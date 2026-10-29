import { importVocabulary, searchFold } from "./import.ts";
import type { VocabularyRecord, Level, Category, WordType } from "./types.ts";
export type VocabularyQuery = {
  search?: string;
  level?: Level;
  category?: Category;
  article?: string;
  type?: WordType;
  known?: boolean;
  knownIds?: Set<string>;
  page?: number;
  pageSize?: number;
};
export interface VocabularyRepository {
  all(): readonly VocabularyRecord[];
  get(id: string): VocabularyRecord | undefined;
  byUnit(unitId: string): VocabularyRecord[];
  byLevel(level: Level): VocabularyRecord[];
  query(filters: VocabularyQuery): {
    items: VocabularyRecord[];
    total: number;
    page: number;
    pages: number;
  };
}
export class LocalVocabularyRepository implements VocabularyRepository {
  private rows: VocabularyRecord[];
  constructor(records: VocabularyRecord[]) {
    const result = importVocabulary([], records);
    if (result.report.rejected) throw new Error("Kelime verisi doğrulanamadı.");
    this.rows = result.records;
  }
  all() {
    return this.rows;
  }
  get(id: string) {
    return this.rows.find((v) => v.id === id);
  }
  byUnit(id: string) {
    return this.rows.filter((v) => v.unit_ids.includes(id));
  }
  byLevel(level: Level) {
    return this.rows.filter((v) => v.levels.includes(level));
  }
  query(q: VocabularyQuery) {
    const search = searchFold(q.search ?? "");
    const rows = this.rows.filter(
      (v) =>
        (!search ||
          searchFold(v.german_word + " " + v.turkish_meaning).includes(
            search,
          )) &&
        (!q.level || v.levels.includes(q.level)) &&
        (!q.category || v.topics.includes(q.category)) &&
        (!q.article ||
          (q.article === "none"
            ? v.article === null
            : v.article === q.article)) &&
        (!q.type || v.word_type === q.type) &&
        (q.known === undefined || Boolean(q.knownIds?.has(v.id)) === q.known),
    );
    const size = Math.min(50, Math.max(1, q.pageSize ?? 12));
    const pages = Math.max(1, Math.ceil(rows.length / size));
    const page = Math.min(pages, Math.max(1, q.page ?? 1));
    return {
      items: rows.slice((page - 1) * size, page * size),
      total: rows.length,
      page,
      pages,
    };
  }
}
