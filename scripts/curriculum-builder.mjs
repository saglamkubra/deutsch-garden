import fs from "node:fs";
import { curriculum } from "../src/lib/learning/curriculum.ts";
import { modules } from "./curriculum-modules.mjs";
import { packs } from "./curriculum-packs.mjs";

const previous = JSON.parse(
  fs.readFileSync("src/data/vocabulary.json", "utf8"),
);
const retained = previous.filter((w) => !w.id.startsWith("dg-course-"));
const added = new Map();
const protectedUnits = new Set(["a1-01", "a1-02", "a2-01", "a2-02", "a2-03"]);
const courses = [];
const expressionGrammar = {};
const reports = [];
function parse(row) {
  const [marked, tr, explanation] = row;
  const match = marked.match(/\{([^{}~]+)~([^{}]+)\}/);
  if (!match || !tr || !explanation || match[1] === match[2])
    throw Error(`İçerik işareti: ${marked}`);
  const de = marked.replace(match[0], match[1]);
  const wrong = marked.replace(match[0], match[2]);
  return {
    de,
    tr,
    explanation,
    gap: match[1],
    wrongGap: match[2],
    wrong,
    blank: marked.replace(match[0], "___"),
  };
}
function expression(unit, e, i) {
  expressionGrammar[e.de] = {
    sentence: e.de,
    missing: e.gap,
    forms: [e.gap, e.wrongGap],
    orders: [e.de],
    explanation: e.explanation,
    blank: e.blank,
    phrase: true,
  };
  // Phrase entries are deliberately labelled expressions, never fake noun records.
  const key = `${unit.level}:${e.de}`;
  let w = added.get(key);
  if (!w) {
    w = {
      id: `dg-course-${unit.id}-${String(i + 1).padStart(2, "0")}`,
      german_word: e.de,
      turkish_meaning: e.tr,
      article: null,
      plural_form: null,
      plural_note: null,
      word_type: "expression",
      cefr_level: unit.level,
      levels: [unit.level],
      category: "conversation",
      topics: ["conversation"],
      unit_ids: [],
      sense_key: `course-expression-${unit.id}-${i + 1}`,
      example_sentence_de: e.de,
      example_sentence_tr: e.tr,
      pronunciation_hint: null,
      audio_url: null,
      difficulty: { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 5 }[unit.level],
      source_name: "Deutsch Garden · özgün içerik",
      source_url: null,
      license: "LicenseRef-DeutschGarden-Original",
      created_at: "2026-10-29T00:00:00.000Z",
      updated_at: "2026-10-29T00:00:00.000Z",
    };
    added.set(key, w);
  }
  if (!w.unit_ids.includes(unit.id)) w.unit_ids.push(unit.id);
  return w.id;
}
for (const unit of curriculum.filter((u) => !protectedUnits.has(u.id))) {
  const pack = packs[unit.id];
  if (!pack || pack.rows.length !== 8) throw Error(`Eksik ünite: ${unit.id}`);
  const ms = modules[unit.level];
  if (ms?.length !== 6) throw Error(`Eksik öğretim modülü: ${unit.level}`);
  const context = pack.rows.map(parse);
  const grammar = ms
    .slice(0, 4)
    .flatMap((m) =>
      m.examples.map((row) => ({
        ...parse(row),
        explanation: m.rule + " " + parse(row).explanation,
      })),
    );
  const all = [...context, ...grammar];
  const ids = all.map((e, i) => expression(unit, e, i));
  const c = {
    id: unit.id + "-words",
    unitId: unit.id,
    level: unit.level,
    title: unit.title + " · Açıklamalı Ders",
    goal: pack.goal,
    steps: [],
    examples: all.map((e, i) => ({
      id: `${unit.id}-example-${i + 1}`,
      de: e.de,
      tr: e.tr,
      explanation: e.explanation,
      highlights: [e.gap],
    })),
    texts: [],
    guided: [],
    independent: [],
    studyPlan: {
      prerequisites: [
        unit.level === "A1"
          ? "Temel ses-harf eşleşmesini ve kısa cümleleri birlikte çalışabilirsin."
          : "Önceki düzeyin temel cümle ve kelime bilgisi; emin olmadığın kural için açıklamalara dön.",
        "Bu ünite yeni bir CEFR yeterlik belgesi veya seviye tespit sınavı değildir.",
      ],
      objectives: [
        pack.goal,
        "Konu ifadelerini Türkçe karşılıklarıyla ve kullanım gerekçeleriyle öğrenmek",
        "Cümlede biçim, bağlam ve iletişim amacını birlikte açıklamak",
        "İki bağlam metnini okuyup verilen bilgiyi varsayımdan ayırmak",
        "Kontrollü soruları çözmek ve kendi metnini kontrol listesiyle gözden geçirmek",
      ],
      sessions: [
        {
          title: "1. oturum · Öğretmeninle keşfet",
          description:
            "İlk altı açıklama temel araçlarını kurar. Her tabloyu aç, Almanca örnekleri Türkçe açıklamayla karşılaştır. Her şeyi tek seferde ezberlemek zorunda değilsin.",
        },
        {
          title: "2. oturum · Konuyu bağlamda işle",
          description:
            "Sonraki sekiz açıklamada bu ünitenin örneklerini incele. İki metni oku; ardından 24 açıklamalı örneği ve 20 yönlendirmeli soruyu çalış. Gerektiğinde birkaç güne böl.",
        },
        {
          title: "3. oturum · Bağımsız uygula",
          description:
            "60 soruyu çöz, yanlışlarını açıklamalarıyla düzelt ve özeti tamamla. Yazma görevi isteğe bağlıdır; serbest yazı otomatik değerlendirilmez.",
        },
      ],
    },
    summary: {
      takeaways: ms.map((m) => m.rule),
      vocabulary: all.map((e) => ({ de: e.de, tr: e.tr })),
      mistakes: ms.map((m) => m.mistake),
      examples: context.slice(0, 3).map((e) => e.de),
      writingChecklist: [
        pack.task,
        "Önce kime, ne amaçla yazdığını belirle; verilen bağlamı koru.",
        "Seçtiğin yapıların altını çiz ve neden uygun olduklarını Türkçe açıkla.",
        "Metinde olmayan bilgiyi gerçekmiş gibi ekleme; kendi örneğini kurgu olarak yazabilirsin.",
        "Özne-fiil uyumunu, fiilin konumunu, bağlaçları ve anlamı kontrol et.",
        "Son bir kez okur gözüyle oku. Serbest metin otomatik puanlanmaz; başka doğru ifadeler de olabilir.",
      ],
    },
  };
  ms.forEach((m, i) => {
    const ex = m.examples.map(parse);
    c.steps.push({
      id: `${unit.id}-teach-${i + 1}`,
      title: `${i + 1} · ${m.title}`,
      introduction: m.explain,
      rule: m.rule,
      usage: m.use,
      structure: ex[0].de,
      mistake: m.mistake,
      memory: m.memory,
      table: {
        heading: "Biçimi, amacı ve anlamı birlikte incele",
        rows: ex.map((e) => [e.gap, e.de, e.tr]),
      },
      details: [
        { title: "Öğretmeninle nedenini düşün", body: m.reason },
        { title: "Adım adım kendin uygula", body: m.practice },
      ],
    });
  });
  context.forEach((e, i) => {
    c.steps.push({
      id: `${unit.id}-teach-${i + 7}`,
      title: `${i + 7} · ${pack.labels[i]}`,
      introduction: `${unit.title} konusunda şimdi şu iletişim görevine odaklanıyoruz: ${pack.labels[i].toLocaleLowerCase("tr-TR")}. ${e.tr} anlamını taşıyan Almanca cümleyi önce bütün olarak oku: ${e.de} Bir ifadeyi yalnızca kelime kelime çevirmek yerine konuşmacının ne yapmak istediğini düşün. ${e.explanation}`,
      rule: e.explanation,
      usage: pack.goal,
      structure: e.de,
      mistake: `Bu görevde “${e.wrong}” hedeflenen biçimi veya anlamı karşılamaz. Verilen Türkçe anlamı ve işaretlenen ögeyi koruyarak “${e.de}” biçimini incele.`,
      memory: `Odak öge: ${e.gap}. Anlamını cümlenin bütünüyle kontrol et.`,
      table: {
        heading: "Cümleyi üç ayrı bakışla oku",
        rows: [
          ["Almanca", e.de, e.tr],
          ["Odak", e.gap, e.explanation],
          ["İletişim amacı", pack.labels[i], pack.goal],
        ],
      },
      details: [
        {
          title: "Öğretmeninle birlikte çözümle",
          body: `Önce cümledeki kişiyi veya temel konuyu bul. Sonra çekimli fiili ve onu tamamlayan bilgileri işaretle. ${e.explanation} Aynı cümleyi doğru yapan şey yalnızca işaretli sözcüğün varlığı değildir; bu sözcüğün bağlamla, kişiyle ve iletişim amacıyla uyumlu olması gerekir. Türkçe karşılığına yeniden bakarak anlatılan bilgiyi, olasılığı veya isteği kendi sözlerinle açıkla.`,
        },
        {
          title: "Kendi kullanımına aktar",
          body: `Örneği kapatıp anlamını bir kez Türkçe söyle; sonra Almanca yapıyı yeniden kur. ${e.gap} yerine farklı bir öge geldiğinde anlamın veya biçimin nasıl değişeceğini düşün. Hazır örneğin dışında bir cümle kurarken yalnızca bir bilgiyi değiştirerek başla; kişi, zaman ve bağlamı aynı anda değiştirmek karşılaştırmayı zorlaştırır. Sonunda örnekle karşılaştır, farklı bir doğru anlatım olabileceğini bil ve kontrollü soruda verilen kalıbı izle.`,
        },
      ],
    });
  });
  for (let t = 0; t < 2; t++)
    c.texts.push({
      id: `${unit.id}-text-${t + 1}`,
      title:
        t === 0
          ? `Okuma · ${unit.title} notları`
          : `İletişim metni · ${unit.title}`,
      de: context
        .slice(t * 4, t * 4 + 4)
        .map((e) => e.de)
        .join("\n\n"),
      tr: context
        .slice(t * 4, t * 4 + 4)
        .map((e) => e.tr)
        .join("\n\n"),
      notes: `Bu metin aynı konuya ilişkin dört özgün ifadeyi bir araya getirir. ${pack.goal} Önce temel anlamı oku; sonra her ifadenin hangi bilgiyi açıkça söylediğini belirle. Çeviriyi kendin anlamayı denedikten sonra aç. İfadelerden birinin içeriğini diğerine otomatik taşıma.`,
    });
  function q(section, type, prompt, answer, why, wordIndex, extra = {}) {
    const list = c[section];
    const options = extra.options ?? [];
    const n = list.length % (options.length || 1);
    list.push({
      id: `${unit.id}-${section}-${String(list.length + 1).padStart(2, "0")}`,
      type,
      prompt,
      accepted: [answer],
      explanation: why,
      rule: extra.rule ?? why,
      hints: [
        extra.rule ?? why,
        "Cümlenin iletişim amacını, kişisini ve fiil konumunu ayrı kontrol et.",
      ],
      wordIds: [ids[wordIndex]],
      reviewWordIds: [ids[wordIndex]],
      kindLabel: {
        choice: "Anlamı ve bağlamı ayırt et",
        blank: "Odak ögeyi tamamla",
        sentence: "Cümleyi adım adım kur",
        "tr-de": "Açıklamalı hata düzeltme",
      }[type],
      ...extra,
      options: [...options.slice(n), ...options.slice(0, n)],
    });
  }
  function choose(section, prompt, answer, wrong, why, i, extra = {}) {
    const opts = [answer, ...wrong];
    q(section, "choice", prompt, answer, why, i, {
      ...extra,
      options: opts,
      optionNotes: Object.fromEntries(
        opts.map((o) => [
          o,
          o === answer ? why : `Hedeflenen anlamla karşılaştır: ${why}`,
        ]),
      ),
    });
  }
  context.forEach((e, i) =>
    choose(
      "guided",
      `“${e.de}” ifadesinin anlamını seç.`,
      e.tr,
      [context[(i + 1) % 8].tr, context[(i + 3) % 8].tr],
      e.explanation,
      i,
    ),
  );
  context.forEach((e, i) =>
    q(
      "guided",
      "blank",
      `“${e.tr}” anlamını koruyarak odak ögeyi yaz: ${e.blank}`,
      e.gap,
      e.explanation,
      i,
    ),
  );
  ms.slice(0, 4).forEach((m, i) =>
    choose(
      "guided",
      `${m.title}: hangi açıklama doğrudur?`,
      m.rule,
      [
        "Bu örneklerde özne, fiil ve bağlamı kontrol etmek gereksizdir.",
        "Bu yapı, her konuşmacı ve her bağlamda tek bir anlamı zorunlu kılar.",
      ],
      m.reason,
      8 + i * 4,
    ),
  );
  context.forEach((e, i) =>
    choose(
      "independent",
      `“${e.tr}” anlamını ve verilen yapıyı karşılayan cümleyi seç.`,
      e.de,
      [e.wrong, context[(i + 2) % 8].de],
      e.explanation,
      i,
    ),
  );
  all.forEach((e, i) =>
    q(
      "independent",
      "sentence",
      `“${e.tr}” anlamını bütün sözcüklerle kur. İlk sözcük: ${e.de.split(/\s+/)[0]}. Verilen örneğin sırasını kullan.`,
      e.de,
      e.explanation,
      i,
      { tiles: e.de.replace(/[.!?]/g, "").split(/\s+/).reverse() },
    ),
  );
  context.forEach((e, i) =>
    q(
      "independent",
      "tr-de",
      `“${e.tr}” anlamını koru. Yanlış odak ögeyi düzelt, diğer sözcüklerin sırasını değiştirme: ${e.wrong}`,
      e.de,
      e.explanation,
      i,
    ),
  );
  context.forEach((e, i) =>
    choose(
      "independent",
      `Gösterilen metnin ${(i % 4) + 1}. ifadesi hangi bilgiyi verir?`,
      e.tr,
      [context[(i + 2) % 8].tr, context[(i + 5) % 8].tr],
      `Metindeki kanıt “${e.de}” ifadesidir. ${e.explanation}`,
      i,
      {
        contextId: c.texts[Math.floor(i / 4)].id,
        kindLabel: "Metindeki bilgiyi ayırt et",
      },
    ),
  );
  grammar
    .slice(0, 12)
    .forEach((e, i) =>
      q(
        "independent",
        "blank",
        `“${e.tr}” anlamıyla örneği tamamla: ${e.blank}`,
        e.gap,
        e.explanation,
        8 + i,
      ),
    );
  if (
    c.steps.length !== 14 ||
    c.examples.length !== 24 ||
    c.guided.length !== 20 ||
    c.independent.length !== 60
  )
    throw Error(`Kapsam hatası: ${unit.id}`);
  courses.push(c);
  reports.push({
    unit: unit.id,
    level: unit.level,
    title: unit.title,
    steps: 14,
    examples: 24,
    guided: 20,
    independent: 60,
    contexts: 8,
    texts: 2,
  });
}
fs.writeFileSync(
  "src/data/courses/complete-curriculum.json",
  JSON.stringify(courses, null, 2) + "\n",
);
// Repeated explanations are shared in the shipped JSON, rather than downloaded 55 times.
const strings = [],
  shapes = [],
  stringIds = new Map(),
  shapeIds = new Map();
function intern(value, list, map) {
  if (!map.has(value)) {
    map.set(value, list.length);
    list.push(value);
  }
  return map.get(value);
}
function encode(value) {
  if (typeof value === "string") return [0, intern(value, strings, stringIds)];
  if (Array.isArray(value)) return [1, ...value.map(encode)];
  if (value && typeof value === "object") {
    const keys = Object.keys(value),
      key = JSON.stringify(keys);
    let index = shapeIds.get(key);
    if (index === undefined) {
      index = shapes.length;
      shapes.push(keys);
      shapeIds.set(key, index);
    }
    return [2, index, ...keys.map((k) => encode(value[k]))];
  }
  return value;
}
const root = encode(courses);
fs.writeFileSync(
  "src/data/courses/curriculum-packed.json",
  JSON.stringify({ version: 1, strings, shapes, root }) + "\n",
);
fs.writeFileSync(
  "src/data/vocabulary.json",
  JSON.stringify([...retained, ...added.values()], null, 2) + "\n",
);
fs.writeFileSync(
  "src/data/courses/expression-grammar.json",
  JSON.stringify(expressionGrammar, null, 2) + "\n",
);
fs.writeFileSync(
  "reports/complete-curriculum.json",
  JSON.stringify(
    {
      generatedOn: "2026-10-29",
      preservedCourses: 5,
      addedCourses: courses.length,
      addedExpressions: added.size,
      units: reports,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `${courses.length} yeni ders; ${added.size} benzersiz öğretim ifadesi. Önceki ${retained.length} kelime kaydı korundu.`,
);
