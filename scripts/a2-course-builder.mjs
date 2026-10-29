import fs from "node:fs";

// Static authoring helper: never reads environment variables or learner storage.
export function buildCourse({
  unitId,
  title,
  goal,
  prerequisites,
  objectives,
  steps,
  examples,
  vocabulary,
  texts,
  choices,
  blanks,
  repairs,
  comprehension,
  takeaways,
  writingChecklist,
  exampleReviewWords,
}) {
  const id = `${unitId}-words`;
  const c = {
    id,
    unitId,
    level: "A2",
    title,
    goal,
    steps,
    examples: examples.map(([de, tr, explanation, highlights], i) => ({
      id: `${unitId}-example-${i + 1}`,
      de,
      tr,
      explanation,
      highlights,
    })),
    texts: texts.map((t, i) => ({ ...t, id: `${unitId}-text-${i + 1}` })),
    guided: [],
    independent: [],
    studyPlan: {
      prerequisites,
      objectives,
      sessions: [
        {
          title: "1. oturum · Konuyu adım adım öğren",
          description:
            "1–7. açıklamaları ve tabloları incele. Örnek cümlelerin Türkçe karşılığını kendi sözlerinle açıkla. İlerlemen kaydedilir; aynı gün bitirmek zorunda değilsin.",
        },
        {
          title: "2. oturum · Bağlam içinde uygula",
          description:
            "8–14. açıklamaları ve iki metni çalış. Ardından 24 açıklamalı örneği inceleyip 20 yönlendirmeli soruyu çöz. Hatalı denemede açıklamayı okuyarak yeniden deneyebilirsin.",
        },
        {
          title: "3. oturum · Bağımsız çalış ve tekrar et",
          description:
            "60 bağımsız soruyu çöz. Hatalarını ayrı tekrar bölümünde düzelt, özeti oku ve isteğe bağlı yazma kontrol listesini uygula. Serbest yazma otomatik notlandırılmaz.",
        },
      ],
    },
    summary: {
      takeaways,
      vocabulary: [],
      mistakes: repairs.map((r) => r[3]),
      examples: examples.slice(0, 3).map((e) => e[0]),
      writingChecklist,
    },
  };
  const existing = JSON.parse(
    fs.readFileSync("src/data/vocabulary.json", "utf8"),
  );
  const records = vocabulary.map(
    (
      [
        german_word,
        turkish_meaning,
        word_type,
        example_sentence_de,
        example_sentence_tr,
        article = null,
        plural_form = null,
        plural_note = null,
      ],
      i,
    ) => ({
      id: `dg-${unitId}-${String(i + 1).padStart(2, "0")}`,
      german_word,
      turkish_meaning,
      word_type,
      example_sentence_de,
      example_sentence_tr,
      article,
      plural_form,
      plural_note,
      cefr_level: "A2",
      levels: ["A2"],
      category: unitId === "a2-03" ? "home" : "conversation",
      topics: [unitId === "a2-03" ? "home" : "conversation"],
      unit_ids: [unitId],
      sense_key: `${unitId}-${i + 1}`,
      pronunciation_hint: null,
      audio_url: null,
      difficulty: 2,
      source_name: "Deutsch Garden · özgün içerik",
      source_url: null,
      license: "LicenseRef-DeutschGarden-Original",
      created_at: "2026-10-28T00:00:00.000Z",
      updated_at: "2026-10-28T00:00:00.000Z",
    }),
  );
  const wordIds = (word) =>
    [...records, ...existing]
      .filter((w) => w.german_word === word)
      .slice(0, 1)
      .map((w) => w.id);
  function question(
    section,
    type,
    prompt,
    answer,
    explanation,
    rule,
    word,
    extra = {},
  ) {
    const list = c[section];
    const options = extra.options ?? [];
    const shift = list.length % (options.length || 1);
    const ids = wordIds(word);
    if (!ids.length) throw Error(`Kelime bağlantısı bulunamadı: ${word}`);
    list.push({
      id: `${unitId}-${section}-${String(list.length + 1).padStart(2, "0")}`,
      type,
      prompt,
      accepted: [answer],
      explanation,
      rule,
      hints: [
        rule,
        "Önce bağlamı, sonra kişi çekimini, isim hâlini ve sözcük sırasını kontrol et.",
      ],
      wordIds: ids,
      reviewWordIds: ids,
      kindLabel: {
        choice: "Bağlamı ve yapıyı seç",
        blank: "Eksik biçimi tamamla",
        sentence: "Sözcüklerle cümle kur",
        "tr-de": "Hata dedektifi",
      }[type],
      ...extra,
      options: [...options.slice(shift), ...options.slice(0, shift)],
    });
  }
  function choice(section, row, context) {
    const [prompt, answer, wrong1, wrong2, explanation, rule, word] = row;
    question(section, "choice", prompt, answer, explanation, rule, word, {
      options: [answer, wrong1, wrong2],
      optionNotes: {
        [answer]: explanation,
        [wrong1]: `Bu seçenek hedeflenen anlamı veya yapıyı karşılamıyor. ${explanation}`,
        [wrong2]: `Cümleyi şu ölçütle yeniden incele: ${rule} ${explanation}`,
      },
      ...(context === undefined
        ? {}
        : { contextId: c.texts[context].id, kindLabel: "Metinden kanıt bul" }),
    });
  }
  choices.slice(0, 10).forEach((r) => choice("guided", r));
  blanks
    .slice(0, 10)
    .forEach(([prompt, answer, why, rule, word]) =>
      question("guided", "blank", prompt, answer, why, rule, word),
    );
  choices.slice(10).forEach((r) => choice("independent", r));
  blanks
    .slice(10)
    .forEach(([prompt, answer, why, rule, word]) =>
      question("independent", "blank", prompt, answer, why, rule, word),
    );
  // Constrained sentence tasks have one requested starting word and exact tiles.
  examples.slice(0, 16).forEach(([de, tr, why], i) => {
    const bare = de.replace(/[.!?]/g, "");
    const tiles = bare.split(/\s+/);
    question(
      "independent",
      "sentence",
      `“${tr}” anlamını verilen sözcüklerle kur. İlk sözcük: ${tiles[0]}.`,
      de,
      why,
      "Verilen ilk sözcüğü koru; tüm taşları kullan. Çekimli fiilin ve varsa mastarın yerini kontrol et.",
      exampleReviewWords[i],
      { tiles: [...tiles].reverse() },
    );
  });
  repairs.forEach(([prompt, answer, why, rule, word]) =>
    question(
      "independent",
      "tr-de",
      `Hatalı cümleyi düzelt; yalnızca belirtilen hatayı değiştir, diğer sözcüklerin sırasını koru: ${prompt}`,
      answer,
      why,
      rule,
      word,
    ),
  );
  comprehension.forEach(([context, ...row]) =>
    choice("independent", row, context),
  );
  c.steps = steps.map((s, i) => ({ ...s, id: `${unitId}-teach-${i + 1}` }));
  c.summary.vocabulary = records.map((w) => ({
    de: (w.article ? `${w.article} ` : "") + w.german_word,
    tr: w.turkish_meaning,
  }));
  if (
    c.steps.length !== 14 ||
    c.examples.length !== 24 ||
    c.guided.length !== 20 ||
    c.independent.length !== 60 ||
    records.length !== 30
  )
    throw Error(
      `Kapsam hatası: ${unitId}, ${c.guided.length}/${c.independent.length}/${records.length}`,
    );
  fs.writeFileSync(
    `src/data/courses/${unitId}.json`,
    JSON.stringify(c, null, 2) + "\n",
  );
  fs.writeFileSync(
    `src/data/courses/${unitId}-vocabulary.json`,
    JSON.stringify(records, null, 2) + "\n",
  );
  // Update only this author's stable new IDs; all earlier data is preserved.
  const owned = new Map(records.map((w) => [w.id, w]));
  const merged = existing.map((w) => owned.get(w.id) ?? w);
  const ids = new Set(existing.map((w) => w.id));
  merged.push(...records.filter((w) => !ids.has(w.id)));
  fs.writeFileSync(
    "src/data/vocabulary.json",
    JSON.stringify(merged, null, 2) + "\n",
  );
  console.log(`${unitId}: 14 açıklama, 24 örnek, 20+60 soru, 30 kelime.`);
}

export function lesson(
  title,
  introduction,
  rule,
  usage,
  structure,
  mistake,
  memory,
  rows,
  detail1,
  detail2,
) {
  return {
    title,
    introduction,
    rule,
    usage,
    structure,
    mistake,
    memory,
    table: { heading: "Biçimi anlamıyla birlikte keşfet", rows },
    details: [
      { title: "Öğretmeninle birlikte düşün", body: detail1 },
      { title: "Kendi cümlene uygula", body: detail2 },
    ],
  };
}
