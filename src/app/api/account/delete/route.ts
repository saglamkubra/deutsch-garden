import { createClient } from "@supabase/supabase-js";
import { accountConfig } from "@/lib/account/config";
import { accountError } from "@/lib/account/errors";
export const runtime = "nodejs";
const attempts = new Map<string, { count: number; until: number }>();
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (
    origin !==
    (process.env.ACCOUNT_APP_ORIGIN ||
      process.env.LUMI_APP_ORIGIN ||
      new URL(request.url).origin)
  )
    return Response.json(
      { error: "İstek kaynağı doğrulanamadı." },
      { status: 403 },
    );
  const config = accountConfig(process.env),
    secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!config.configured || !config.url || !config.key || !secret)
    return Response.json(
      {
        error:
          "Hesap silme için sunucu kurulumu gerekli. Kurulum belgesindeki güvenli yönetici adımlarını izle.",
      },
      { status: 503 },
    );
  if (Number(request.headers.get("content-length")) > 4096)
    return Response.json({ error: "İstek çok büyük." }, { status: 413 });
  const token = request.headers
    .get("authorization")
    ?.match(/^Bearer (.+)$/)?.[1];
  if (!token)
    return Response.json({ error: "Yeniden giriş yap." }, { status: 401 });
  const options = {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, { ...init, signal: AbortSignal.timeout(15000) }),
    },
  };
  try {
    const verifier = createClient(config.url, config.key, options);
    const { data, error } = await verifier.auth.getUser(token);
    if (error || !data.user?.email)
      return Response.json({ error: "Oturum doğrulanamadı." }, { status: 401 });
    const id = data.user.id,
      now = Date.now();
    if (attempts.size > 1000)
      for (const [k, a] of attempts) if (a.until < now) attempts.delete(k);
    const attempt = attempts.get(id) ?? { count: 0, until: now + 900000 };
    if (attempt.until < now) {
      attempt.count = 0;
      attempt.until = now + 900000;
    }
    if (++attempt.count > 5)
      return Response.json(
        { error: "Çok fazla deneme. 15 dakika sonra yeniden dene." },
        { status: 429 },
      );
    attempts.set(id, attempt);
    const body = await request.text();
    if (body.length > 4096)
      return Response.json({ error: "İstek çok büyük." }, { status: 413 });
    const { confirmation, password } = JSON.parse(body);
    if (
      confirmation !== "HESABIMI SİL" ||
      typeof password !== "string" ||
      password.length > 1024
    )
      return Response.json(
        { error: "Silme onayını ve parolanı kontrol et." },
        { status: 400 },
      );
    const fresh = await verifier.auth.signInWithPassword({
      email: data.user.email,
      password,
    });
    if (fresh.error || fresh.data.user?.id !== id)
      return Response.json({ error: "Parola doğrulanamadı." }, { status: 403 });
    const admin = createClient(config.url, secret, options);
    const result = await admin.auth.admin.deleteUser(id);
    if (result.error) throw result.error;
    return Response.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return Response.json({ error: accountError(e) }, { status: 400 });
  }
}
