import { DatabaseSync } from "node:sqlite";
import { createHash, createHmac } from "node:crypto";
import type {
  TutorRequest,
  TutorReply,
  Line,
  Completion,
  Receipt,
} from "./protocol.ts";
import { LIMITS } from "./protocol.ts";
export const dayStamp = (ms: number) =>
  new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(ms));
export const transcriptHash = (messages: Line[]) =>
  createHash("sha256")
    .update(
      JSON.stringify(
        messages.map((m) => ({ role: m.role, content: m.content })),
      ),
    )
    .digest("hex");
export const requestHash = (r: TutorRequest) =>
  createHash("sha256")
    .update(
      JSON.stringify([
        r.action,
        r.conversationId,
        r.level,
        r.mode,
        r.correction,
        r.word ?? "",
        transcriptHash(r.messages),
      ]),
    )
    .digest("hex");
export class TutorError extends Error {
  status: number;
  code: string;
  retry: number;
  constructor(status: number, code: string, retry = 0) {
    super(code);
    this.status = status;
    this.code = code;
    this.retry = retry;
  }
}
type Conversation = {
  id: string;
  owner: string;
  level: string;
  mode: string;
  style: string;
  hash: string;
  turns: number;
  characters: number;
  started: number;
  closed: number;
  pending: string | null;
  pending_at: number;
};
export const LEDGER_TABLES = [
  "lumi_conversations",
  "lumi_calls",
  "lumi_usage",
  "lumi_awards",
  "lumi_access_attempts",
] as const;
export type LedgerData = {
  version: 1;
  tables: Record<string, Record<string, string | number | null>[]>;
};
export class LumiLedger {
  db: DatabaseSync;
  constructor(path: string) {
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA busy_timeout=4000; PRAGMA journal_mode=WAL;
 CREATE TABLE IF NOT EXISTS lumi_conversations(id TEXT PRIMARY KEY,owner TEXT NOT NULL,level TEXT NOT NULL,mode TEXT NOT NULL,style TEXT NOT NULL,hash TEXT NOT NULL,turns INTEGER NOT NULL DEFAULT 0,characters INTEGER NOT NULL DEFAULT 0,started INTEGER NOT NULL,closed INTEGER NOT NULL DEFAULT 0,pending TEXT,pending_at INTEGER NOT NULL DEFAULT 0);
 CREATE TABLE IF NOT EXISTS lumi_calls(id TEXT PRIMARY KEY,owner TEXT NOT NULL,conversation_id TEXT NOT NULL,hash TEXT NOT NULL,status TEXT NOT NULL,created INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS lumi_usage(id INTEGER PRIMARY KEY,owner TEXT NOT NULL,day TEXT NOT NULL,at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS lumi_awards(day TEXT PRIMARY KEY,owner TEXT NOT NULL,conversation_id TEXT NOT NULL,issued INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS lumi_access_attempts(at INTEGER NOT NULL);
 CREATE INDEX IF NOT EXISTS lumi_usage_day ON lumi_usage(day,owner);`);
  }
  conversation(id: string) {
    return this.db
      .prepare("SELECT * FROM lumi_conversations WHERE id=?")
      .get(id) as Conversation | undefined;
  }
  reserve(
    owner: string,
    r: TutorRequest,
    now: number,
  ): { cached: boolean; remaining: number } {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db
        .prepare("DELETE FROM lumi_usage WHERE at<?")
        .run(now - 7 * 86400000);
      this.db
        .prepare("DELETE FROM lumi_calls WHERE created<?")
        .run(now - 2 * 86400000);
      this.db
        .prepare("DELETE FROM lumi_conversations WHERE started<?")
        .run(now - 30 * 86400000);
      const previous = this.db
        .prepare("SELECT * FROM lumi_calls WHERE id=?")
        .get(r.requestId) as
        { owner: string; hash: string; status: string } | undefined;
      if (
        previous &&
        (previous.owner !== owner || previous.hash !== requestHash(r))
      )
        throw new TutorError(409, "REQUEST_CONFLICT");
      if (previous?.status === "done") {
        this.db.exec("COMMIT");
        return { cached: true, remaining: this.remaining(owner, now) };
      }
      let c = this.conversation(r.conversationId);
      if (!c) {
        if (r.action !== "message" || r.messages.length !== 1)
          throw new TutorError(409, "HISTORY_CONFLICT");
        this.db
          .prepare(
            "INSERT INTO lumi_conversations(id,owner,level,mode,style,hash,started) VALUES(?,?,?,?,?,?,?)",
          )
          .run(
            r.conversationId,
            owner,
            r.level,
            r.mode,
            r.correction,
            transcriptHash([]),
            now,
          );
        c = this.conversation(r.conversationId)!;
      }
      if (c.owner !== owner) throw new TutorError(403, "ACCESS_DENIED");
      if (c.closed) throw new TutorError(409, "CLOSED");
      if (c.level !== r.level || c.mode !== r.mode || c.style !== r.correction)
        throw new TutorError(409, "SETTINGS_CONFLICT");
      if (c.pending && now - c.pending_at < 120000)
        throw new TutorError(409, "BUSY", 3);
      if (
        c.hash !==
        transcriptHash(
          r.action === "message" ? r.messages.slice(0, -1) : r.messages,
        )
      )
        throw new TutorError(409, "HISTORY_CONFLICT");
      if (r.action === "message" && c.turns >= LIMITS.turns)
        throw new TutorError(409, "SESSION_LIMIT");
      const count = (sql: string, ...args: (string | number)[]) =>
        Number((this.db.prepare(sql).get(...args) as { n: number }).n);
      if (
        count("SELECT count(*) n FROM lumi_usage WHERE day=?", dayStamp(now)) >=
          LIMITS.globalDay ||
        this.remaining(owner, now) <= 0
      )
        throw new TutorError(429, "DAILY_LIMIT", 3600);
      if (
        count("SELECT count(*) n FROM lumi_usage WHERE at>?", now - 60000) >=
          LIMITS.globalMinute ||
        count(
          "SELECT count(*) n FROM lumi_usage WHERE owner=? AND at>?",
          owner,
          now - 60000,
        ) >= LIMITS.clientMinute
      )
        throw new TutorError(429, "RATE_LIMIT", 60);
      this.db
        .prepare("INSERT INTO lumi_usage(owner,day,at) VALUES(?,?,?)")
        .run(owner, dayStamp(now), now);
      this.db
        .prepare(
          "INSERT INTO lumi_calls(id,owner,conversation_id,hash,status,created) VALUES(?,?,?,?,'pending',?) ON CONFLICT(id) DO UPDATE SET status='pending'",
        )
        .run(r.requestId, owner, r.conversationId, requestHash(r), now);
      this.db
        .prepare(
          "UPDATE lumi_conversations SET pending=?,pending_at=? WHERE id=?",
        )
        .run(r.requestId, now, r.conversationId);
      this.db.exec("COMMIT");
      return { cached: false, remaining: this.remaining(owner, now) };
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
  remaining(owner: string, now: number) {
    const n = Number(
      (
        this.db
          .prepare("SELECT count(*) n FROM lumi_usage WHERE owner=? AND day=?")
          .get(owner, dayStamp(now)) as { n: number }
      ).n,
    );
    return Math.max(0, LIMITS.clientDay - n);
  }
  failed(id: string) {
    this.db
      .prepare(
        "UPDATE lumi_calls SET status='failed' WHERE id=? AND status='pending'",
      )
      .run(id);
    this.db
      .prepare("UPDATE lumi_conversations SET pending=NULL WHERE pending=?")
      .run(id);
  }
  complete(
    owner: string,
    r: TutorRequest,
    reply: TutorReply,
    now: number,
    secret: string,
  ): Completion | null {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const c = this.conversation(r.conversationId);
      if (!c || c.owner !== owner || c.pending !== r.requestId)
        throw new TutorError(409, "HISTORY_CONFLICT");
      let completion: Completion | null = null;
      if (r.action === "message") {
        this.db
          .prepare(
            "UPDATE lumi_conversations SET hash=?,turns=turns+1,characters=characters+?,pending=NULL WHERE id=?",
          )
          .run(
            transcriptHash([
              ...r.messages,
              { role: "assistant", content: reply.message },
            ]),
            r.messages.at(-1)!.content.trim().length,
            c.id,
          );
      } else if (r.action === "finish") {
        const seconds = Math.max(0, Math.floor((now - c.started) / 1000)),
          qualified =
            r.mode !== "diary-review" &&
            c.turns >= LIMITS.practiceTurns &&
            c.characters >= LIMITS.practiceChars &&
            seconds >= LIMITS.practiceSeconds;
        this.db
          .prepare(
            "UPDATE lumi_conversations SET closed=1,pending=NULL WHERE id=?",
          )
          .run(c.id);
        if (qualified)
          this.db
            .prepare(
              "INSERT OR IGNORE INTO lumi_awards(day,owner,conversation_id,issued) VALUES(?,?,?,?)",
            )
            .run(dayStamp(now), owner, c.id, now);
        const award = this.db
          .prepare(
            "SELECT * FROM lumi_awards WHERE day=? AND owner=? AND conversation_id=?",
          )
          .get(dayStamp(now), owner, c.id);
        completion = {
          qualified,
          turns: c.turns,
          characters: c.characters,
          seconds,
          receipt: award
            ? this.receipt(dayStamp(now), c.id, owner, secret)
            : null,
        };
      } else
        this.db
          .prepare("UPDATE lumi_conversations SET pending=NULL WHERE id=?")
          .run(c.id);
      this.db
        .prepare("UPDATE lumi_calls SET status='done' WHERE id=?")
        .run(r.requestId);
      this.db.exec("COMMIT");
      return completion;
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
  receipt(date: string, id: string, owner: string, secret: string): Receipt {
    return {
      id: "lumi:daily:" + date,
      sessionId: id,
      date,
      signature: createHmac("sha256", secret)
        .update([date, id, owner].join("|"))
        .digest("hex"),
    };
  }
  verifyReceipt(r: Receipt, owner: string, secret: string) {
    return (
      !!this.db
        .prepare(
          "SELECT day FROM lumi_awards WHERE day=? AND owner=? AND conversation_id=?",
        )
        .get(r.date, owner, r.sessionId) &&
      this.receipt(r.date, r.sessionId, owner, secret).signature === r.signature
    );
  }
  remove(owner: string, id: string) {
    const c = this.conversation(id);
    if (c && c.owner !== owner) throw new TutorError(403, "ACCESS_DENIED");
    if (c?.pending) throw new TutorError(409, "BUSY");
    this.db
      .prepare("DELETE FROM lumi_conversations WHERE id=? AND owner=?")
      .run(id, owner);
    this.db
      .prepare("DELETE FROM lumi_calls WHERE conversation_id=? AND owner=?")
      .run(id, owner);
  }
  accessAttempt(now: number) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db
        .prepare("DELETE FROM lumi_access_attempts WHERE at<?")
        .run(now - 900000);
      const n = Number(
        (
          this.db
            .prepare("SELECT count(*) n FROM lumi_access_attempts")
            .get() as { n: number }
        ).n,
      );
      if (n >= 8) throw new TutorError(429, "RATE_LIMIT", 900);
      this.db
        .prepare("INSERT INTO lumi_access_attempts(at) VALUES(?)")
        .run(now);
      this.db.exec("COMMIT");
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
  exportData(): LedgerData {
    return {
      version: 1,
      tables: Object.fromEntries(
        LEDGER_TABLES.map((t) => [
          t,
          this.db.prepare("SELECT * FROM " + t).all(),
        ]),
      ),
    } as LedgerData;
  }
  importData(input: unknown) {
    if (
      !input ||
      typeof input !== "object" ||
      (input as LedgerData).version !== 1
    )
      throw new TutorError(503, "STORAGE_UNAVAILABLE");
    const tables = (input as LedgerData).tables;
    if (!tables || Object.keys(tables).length !== LEDGER_TABLES.length)
      throw new TutorError(503, "STORAGE_UNAVAILABLE");
    this.db.exec("BEGIN IMMEDIATE");
    try {
      for (const table of LEDGER_TABLES) {
        const rows = tables[table];
        if (!Array.isArray(rows) || rows.length > 15000)
          throw new TutorError(503, "STORAGE_UNAVAILABLE");
        const columns = (
          this.db.prepare("PRAGMA table_info(" + table + ")").all() as {
            name: string;
          }[]
        ).map((c) => c.name);
        this.db.exec("DELETE FROM " + table);
        const insert = this.db.prepare(
          "INSERT INTO " +
            table +
            " (" +
            columns.join(",") +
            ") VALUES (" +
            columns.map(() => "?").join(",") +
            ")",
        );
        for (const row of rows) {
          if (
            !row ||
            Object.keys(row).length !== columns.length ||
            columns.some(
              (c) =>
                !Object.hasOwn(row, c) ||
                (!["string", "number"].includes(typeof row[c]) &&
                  row[c] !== null),
            )
          )
            throw new TutorError(503, "STORAGE_UNAVAILABLE");
          insert.run(...columns.map((c) => row[c]));
        }
      }
      this.db.exec("COMMIT");
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
  close() {
    this.db.close();
  }
}
