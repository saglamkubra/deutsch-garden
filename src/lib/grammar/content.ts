import type { Topic, Category, Example, Lesson } from "./types.ts";
import type { Question } from "../exercises/types.ts";
import { shuffle } from "../exercises/generate.ts";
import { a2Topics } from "./a2.ts";
export { a2Topics } from "./a2.ts";
import { b1Topics } from "./b1.ts";
export { b1Topics } from "./b1.ts";
import { b2Topics } from "./b2.ts";
export { b2Topics } from "./b2.ts";
import { c1Topics } from "./c1.ts";
export { c1Topics } from "./c1.ts";
import { c2Topics } from "./c2.ts";
export { c2Topics } from "./c2.ts";
type Choice = [string, string, string[], string];
type Spec = {
  slug: string;
  title: string;
  de: string;
  category: Category;
  intro: string;
  goals: string[];
  rules: string[];
  examples: Example[];
  mistake: Lesson["mistake"];
  tip: string;
  practice: [string, string, string];
  quiz: (Choice | Question)[];
};
function order(
  prompt: string,
  accepted: string[],
  explanation: string,
): Question {
  return {
    id: "",
    type: "sentence",
    wordIds: [],
    prompt,
    accepted,
    tiles: shuffle(accepted[0].replace(/[.!?]/g, "").split(" "), prompt),
    options: [],
    explanation,
  };
}
function ex(
  de: string,
  tr: string,
  marks: [string, Example["highlights"][number]["role"], string][],
): Example {
  return {
    de,
    tr,
    highlights: marks.map(([text, role, hint]) => ({ text, role, hint })),
  };
}
function create(s: Spec): Topic {
  const id = "grammar-a1-" + s.slug;
  return {
    id,
    level: "A1",
    title: s.title,
    german: s.de,
    category: s.category,
    summary: s.goals[0],
    lesson: {
      objectives: s.goals,
      intro: s.intro,
      rules: s.rules,
      examples: s.examples,
      mistake: s.mistake,
      tip: s.tip,
      practice: {
        id: id + ":practice",
        type: "tr-de",
        wordIds: [id],
        prompt: s.practice[0],
        accepted: [s.practice[1]],
        options: [],
        explanation: s.practice[2],
      },
      quiz: s.quiz.map((q, i) =>
        Array.isArray(q)
          ? {
              id: id + ":q" + (i + 1),
              type: "blank",
              wordIds: [id],
              prompt: q[0],
              accepted: [q[1]],
              options: shuffle([q[1], ...q[2]], id + i),
              explanation: q[3],
            }
          : { ...q, id: id + ":q" + (i + 1), wordIds: [id] },
      ),
    },
  };
}
export const a1Topics: Topic[] = [
  create({
    slug: "pronouns",
    title: "Ben, sen, biz: kişi zamirleri",
    de: "Personalpronomen",
    category: "basics",
    intro:
      "Kişi zamirleri bir kişi veya şeyi adını tekrar söylemeden anlatır. Türkçede özneyi düşürebiliriz; standart Almanca bildirme cümlesinde özne genellikle açıkça söylenir.",
    goals: ["Kişiye uygun zamiri seç.", "sie ve Sie ayrımını bağlamla tanı."],
    rules: [
      "ich = ben; du = sen; er = o (eril), sie = o (dişil), es = o (nötr).",
      "wir = biz; ihr = siz (samimi çoğul); sie = onlar. Saygılı hitap Sie büyük harfle yazılır.",
      "Fiil özneye göre çekilir: ich lerne, wir lernen. Cümle başındaki Sie'nin anlamı bağlamdan anlaşılır.",
      "Zamir ismin dilbilgisel cinsiyetiyle uyumludur: das Buch → es.",
    ],
    examples: [
      ex("Ich lerne Deutsch.", "Ben Almanca öğreniyorum.", [
        ["Ich", "subject", "Birinci tekil kişi."],
        ["lerne", "verb", "ich çekimi."],
        ["Deutsch", "object", "Öğrenilen dil."],
      ]),
      ex("Wir wohnen in Berlin.", "Biz Berlin'de yaşıyoruz.", [
        ["Wir", "subject", "Birinci çoğul kişi."],
        ["wohnen", "verb", "wir ile -en."],
        ["in", "preposition", "Konum bildirir."],
      ]),
    ],
    mistake: {
      wrong: "Ich lernen Deutsch.",
      right: "Ich lerne Deutsch.",
      why: "ich için lerne çekimi gerekir.",
    },
    tip: "Zamirle fiili bir çift gibi öğren: ich lerne. 🌱",
    practice: [
      "Ich [lernen] Deutsch. Parantezdeki fiili düzelt.",
      "lerne",
      "ich birinci tekil; lerne gerekir.",
    ],
    quiz: [
      [
        "“Biz” için hangi zamir?",
        "wir",
        ["ihr", "ich", "du"],
        "wir biz, ihr samimi çoğul sizdir.",
      ],
      [
        "Ali bir erkek. Yerine hangi zamir gelir?",
        "er",
        ["sie", "wir", "ihr"],
        "Tek erkek kişi için er.",
      ],
      [
        "das Buch yerine hangi zamir?",
        "es",
        ["er", "wir", "du"],
        "Buch nötrdür; es kullanılır.",
      ],
      [
        "Tek kişiye resmî hitapta hangi biçim?",
        "Sie",
        ["du", "ihr", "wir"],
        "Saygılı hitap Sie büyük harfle yazılır.",
      ],
      order(
        "“Ben Almanca öğreniyorum.” cümlesini kur.",
        ["Ich lerne Deutsch.", "Deutsch lerne ich."],
        "lerne ikinci öğededir; özne veya nesne başta olabilir.",
      ),
    ],
  }),
  create({
    slug: "sein-haben",
    title: "Olmak ve sahip olmak",
    de: "Sein und haben",
    category: "verbs",
    intro:
      "sein durum veya kimlik, haben sahiplik ve bazı kalıp durumlar için kullanılır. Her iki fiilin çekimleri de düzenli değildir.",
    goals: [
      "sein ve haben biçimlerini kişiyle eşleştir.",
      "Durum ve sahipliği ayırt et.",
    ],
    rules: [
      "sein: ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind.",
      "haben: ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben.",
      "Durum: Ich bin müde. Sahiplik: Ich habe ein Buch.",
      "Yaş sein ile söylenir: Ich bin zwanzig Jahre alt. Ich habe Hunger ise yerleşik bir haben kalıbıdır.",
    ],
    examples: [
      ex("Ich bin müde.", "Ben yorgunum.", [
        ["Ich", "subject", "Birinci tekil."],
        ["bin", "verb", "sein fiilinin ich biçimi."],
      ]),
      ex("Du hast ein Buch.", "Senin bir kitabın var.", [
        ["Du", "subject", "İkinci tekil."],
        ["hast", "verb", "haben fiilinin du biçimi."],
        ["ein", "article", "Nötr akkusativ."],
        ["Buch", "object", "Sahip olunan nesne."],
      ]),
    ],
    mistake: {
      wrong: "Du habe ein Buch.",
      right: "Du hast ein Buch.",
      why: "du ile haben → hast.",
    },
    tip: "bin–bist–ist ve habe–hast–hat üçlülerini tekrar et. 🌷",
    practice: ["Ich [bist] müde. Fiili düzelt.", "bin", "ich ile sein → bin."],
    quiz: [
      ["Ich ___ glücklich.", "bin", ["bist", "ist", "seid"], "ich ile bin."],
      ["Du ___ Zeit.", "hast", ["habe", "hat", "habt"], "du ile hast."],
      ["Wir ___ zu Hause.", "sind", ["bin", "ist", "seid"], "wir ile sind."],
      ["Ihr ___ ein Auto.", "habt", ["haben", "hat", "hast"], "ihr ile habt."],
      [
        "Ich ___ zwanzig Jahre alt.",
        "bin",
        ["habe", "hast", "haben"],
        "Yaş sein ile söylenir.",
      ],
    ],
  }),
  create({
    slug: "present",
    title: "Şimdi ve alışkanlıklar",
    de: "Präsens",
    category: "verbs",
    intro:
      "Präsens şu anı, alışkanlıkları ve zaman bağlamı belli gelecek planlarını anlatabilir. Türkçedeki -yor ve geniş zaman anlamları aynı Almanca yapıyla verilebilir.",
    goals: [
      "Präsens'in zaman bağlamlarını tanı.",
      "Özneye uygun fiil biçimini seç.",
    ],
    rules: [
      "Düzenli fiil kök + kişi eki alır: lern-en → ich lern-e.",
      "Temel ekler: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en.",
      "Jeden Tag alışkanlığı belirtir: Wir lernen jeden Tag.",
      "Morgen fahre ich nach Berlin gelecek planıdır; Präsens yalnızca şu saniyeyi anlatmaz.",
    ],
    examples: [
      ex("Heute lerne ich Deutsch.", "Bugün Almanca öğreniyorum.", [
        ["lerne", "verb", "Çekimli fiil ikinci öğede."],
        ["ich", "subject", "Özne fiilden sonra."],
        ["Deutsch", "object", "Öğrenilen dil."],
      ]),
      ex("Wir spielen jeden Tag.", "Biz her gün oynuyoruz.", [
        ["Wir", "subject", "Çoğul özne."],
        ["spielen", "verb", "wir için -en."],
      ]),
    ],
    mistake: {
      wrong: "Ich lernt Deutsch.",
      right: "Ich lerne Deutsch.",
      why: "ich için -e gerekir.",
    },
    tip: "heute, morgen ve jeden Tag sana zamanı gösterir. ✨",
    practice: [
      "Wir [lernt] Deutsch. Fiili düzelt.",
      "lernen",
      "wir için -en kullanılır.",
    ],
    quiz: [
      [
        "Ich ___ jeden Tag Deutsch.",
        "lerne",
        ["lernst", "lernt", "lernen"],
        "ich için lerne.",
      ],
      [
        "Du ___ heute.",
        "spielst",
        ["spiele", "spielt", "spielen"],
        "du için -st.",
      ],
      [
        "Wir ___ jeden Tag.",
        "lernen",
        ["lerne", "lernst", "lernt"],
        "wir için -en.",
      ],
      [
        "Morgen fahre ich nach Berlin. Ne anlatılıyor?",
        "Yarınki bir plan",
        ["Yalnızca geçmiş", "Yalnızca şu saniye", "Zamansız kural"],
        "Morgen geleceği belirtir.",
      ],
      order(
        "“Biz her gün öğreniyoruz.” cümlesini kur.",
        ["Wir lernen jeden Tag.", "Jeden Tag lernen wir."],
        "Jeden Tag tek öğedir; lernen ikinci öğede kalır.",
      ),
    ],
  }),
  create({
    slug: "regular",
    title: "Düzenli fiillerin küçük düzeni",
    de: "Regelmäßige Verben",
    category: "verbs",
    intro:
      "Düzenli fiillerin kişi ekleri çoğunlukla tahmin edilebilir. Mastardaki -en bölümünü çıkar, sonra özneye uygun eki ekle.",
    goals: [
      "Fiil kökünü ve kişi ekini bul.",
      "-t/-d köklerinde yardımcı e sesini tanı.",
    ],
    rules: [
      "lernen → lern-; machen → mach-. ich lerne, du lernst, er lernt.",
      "Çoğul çekim: wir lernen, ihr lernt, sie lernen.",
      "arbeiten gibi -t/-d köklerinde yardımcı e görülebilir: du arbeitest, er arbeitet, ihr arbeitet.",
      "Her fiil düzenli değildir; şablonu düzensiz fiillere zorla uygulama.",
    ],
    examples: [
      ex("Du machst Tee.", "Sen çay yapıyorsun.", [
        ["Du", "subject", "İkinci tekil."],
        ["machst", "verb", "mach- + -st."],
        ["Tee", "object", "Yapılan şey."],
      ]),
      ex("Ihr arbeitet heute.", "Siz bugün çalışıyorsunuz.", [
        ["Ihr", "subject", "Samimi çoğul siz."],
        ["arbeitet", "verb", "arbeit- + -et."],
      ]),
    ],
    mistake: {
      wrong: "Du arbeitet heute.",
      right: "Du arbeitest heute.",
      why: "du ile arbeitest.",
    },
    tip: "Önce kök, sonra kişi: lern + st. 🌼",
    practice: [
      "Ihr [lernen] Deutsch. Fiili düzelt.",
      "lernt",
      "ihr için -t gerekir.",
    ],
    quiz: [
      [
        "machen fiilinin kökü?",
        "mach-",
        ["machen-", "ma-", "mache-"],
        "Mastardaki -en çıkarılır.",
      ],
      [
        "Du ___ Deutsch.",
        "lernst",
        ["lerne", "lernt", "lernen"],
        "du için -st.",
      ],
      ["Er ___ Tee.", "macht", ["mache", "machst", "machen"], "er için -t."],
      [
        "Ihr ___ im Garten.",
        "arbeitet",
        ["arbeiten", "arbeitest", "arbeite"],
        "ihr ile arbeitet.",
      ],
      [
        "Wir ___ heute.",
        "spielen",
        ["spiele", "spielst", "spielt"],
        "wir için -en.",
      ],
    ],
  }),
  create({
    slug: "irregular",
    title: "Sık kullanılan düzensiz fiiller",
    de: "Unregelmäßige Verben",
    category: "verbs",
    intro:
      "Bazı sık fiillerde kök ünlüsü du ve er/sie/es ile değişir. Mastarla birlikte bu tekil biçimleri ayrıca öğren.",
    goals: [
      "fahren, lesen ve essen değişimlerini tanı.",
      "Tekil değişimini çoğula taşıma.",
    ],
    rules: [
      "fahren: ich fahre, du fährst, er fährt; wir fahren, ihr fahrt, sie fahren.",
      "lesen: ich lese, du liest, er liest; wir lesen, ihr lest, sie lesen.",
      "essen: ich esse, du isst, er isst; wir essen, ihr esst, sie essen.",
      "Her düzensiz fiil aynı değişimi izlemez; du ve er/sie/es biçimlerini ayrıca öğren.",
    ],
    examples: [
      ex("Du liest ein Buch.", "Sen bir kitap okuyorsun.", [
        ["Du", "subject", "İkinci tekil."],
        ["liest", "verb", "lesen → du liest."],
        ["ein", "article", "Buch nötrdür."],
        ["Buch", "object", "Okunan şey."],
      ]),
      ex("Wir fahren nach Berlin.", "Biz Berlin'e gidiyoruz.", [
        ["Wir", "subject", "Birinci çoğul."],
        ["fahren", "verb", "Çoğulda a korunur."],
        ["nach", "preposition", "Şehir adına yön."],
      ]),
    ],
    mistake: {
      wrong: "Du fahrst nach Berlin.",
      right: "Du fährst nach Berlin.",
      why: "du ile a → ä olur.",
    },
    tip: "fahren – du fährst – er fährt üçlüsünü birlikte ek. 🌱",
    practice: [
      "Er [esst] Brot. Fiili düzelt.",
      "isst",
      "essen fiilinin er çekimi isst.",
    ],
    quiz: [
      [
        "Du ___ nach Berlin.",
        "fährst",
        ["fahrst", "fahre", "fahren"],
        "du ile a → ä.",
      ],
      [
        "Er ___ ein Buch.",
        "liest",
        ["lese", "lesen", "lest"],
        "lesen → er liest.",
      ],
      ["Wir ___ Suppe.", "essen", ["isst", "esst", "esse"], "wir ile essen."],
      [
        "Ihr ___ nach Hause.",
        "fahrt",
        ["fährt", "fährst", "fahren"],
        "ihr için fahrt.",
      ],
      [
        "Ich ___ ein Buch.",
        "lese",
        ["liest", "lest", "lesen"],
        "ich biçimi lese.",
      ],
    ],
  }),
  create({
    slug: "articles",
    title: "Der, die, das: isimlerin renkleri",
    de: "Bestimmte Artikel",
    category: "nouns",
    intro:
      "Almanca isimlerin dilbilgisel cinsiyeti eril, dişil veya nötrdür. Bu sınıflandırma her zaman gerçek hayattaki cinsiyetle açıklanamaz. İsmi artikeliyle öğrenmek gerekir.",
    goals: [
      "Nominativde der, die ve das seç.",
      "İsimleri artikel ve çoğuluyla öğren.",
    ],
    rules: [
      "Tekil nominativ: der Apfel (eril), die Blume (dişil), das Buch (nötr).",
      "Nominativ çoğulda belirli artikel die: die Bücher. Bundan tekil cinsiyetini çıkaramazsın.",
      "-ung ve -heit genellikle dişil, -chen küçültmeleri nötrdür: das Mädchen (kız). Doğal cinsiyet ile dilbilgisel cinsiyet aynı olmak zorunda değildir. -e sonu çoğu zaman dişildir ama der Name bir istisnadır; yeni kelimede sözlüğe bak.",
      "İsim büyük harfle yazılır. Artikel hâle göre değişir; bu derste nominativ temelindeyiz.",
    ],
    examples: [
      ex("Der Apfel ist frisch.", "Elma taze.", [
        ["Der", "article", "Apfel eril nominativ."],
        ["Apfel", "subject", "Özne."],
        ["ist", "verb", "sein çekimi."],
      ]),
      ex("Die Blume ist schön.", "Çiçek güzel.", [
        ["Die", "article", "Blume dişil nominativ."],
        ["Blume", "subject", "Özne."],
        ["ist", "verb", "sein çekimi."],
      ]),
      ex("Das Buch ist neu.", "Kitap yeni.", [
        ["Das", "article", "Buch nötr nominativ."],
        ["Buch", "subject", "Özne."],
        ["ist", "verb", "sein çekimi."],
      ]),
    ],
    mistake: {
      wrong: "Die Buch ist neu.",
      right: "Das Buch ist neu.",
      why: "Buch nötrdür: das Buch.",
    },
    tip: "Sözcüğü artikeliyle ek: das Buch. 📚",
    practice: [
      "[Die] Buch ist neu. Hatalı artikelin doğru biçimini yaz.",
      "Das",
      "Buch nötrdür.",
    ],
    quiz: [
      ["Nominativ: ___ Apfel", "der", ["die", "das", "den"], "Apfel erildir."],
      ["Nominativ: ___ Blume", "die", ["der", "das", "dem"], "Blume dişildir."],
      ["Nominativ: ___ Buch", "das", ["der", "die", "den"], "Buch nötrdür."],
      [
        "Nominativ çoğul: ___ Bücher",
        "die",
        ["das", "der", "dem"],
        "Çoğul belirli artikel die.",
      ],
      [
        "En yararlı kelime kaydı hangisi?",
        "das Buch – die Bücher",
        ["buch", "Bütün isimlere der eklemek", "Artikeli öğrenmemek"],
        "Artikel, isim ve çoğul birlikte öğrenilir.",
      ],
    ],
  }),
  create({
    slug: "indefinite",
    title: "Bir şeyden ilk kez söz etmek",
    de: "Unbestimmte Artikel",
    category: "nouns",
    intro:
      "Belirsiz artikel bir şeyi sınıfının herhangi bir üyesi olarak tanıtır. Türkçedeki “bir” yardımcı bir karşılıktır; iki dilin sistemi bire bir aynı değildir.",
    goals: [
      "Nominativde ein/eine seç.",
      "Belirsiz çoğulun artikelsizliğini fark et.",
    ],
    rules: [
      "Nominativ tekil: ein Mann, eine Frau, ein Kind.",
      "Belirsiz artikelin çoğulu yoktur: ein Buch → Bücher.",
      "Belirli şeyi kastederken der/die/das, belirsiz bir şeyi tanıtırken ein/eine kullanılabilir.",
      "ein eril ve nötrde aynı görünür. İsmi belirli artikeliyle öğren. Akkusativ eril einen olur.",
    ],
    examples: [
      ex("Eine Blume wächst.", "Bir çiçek büyüyor.", [
        ["Eine", "article", "Dişil nominativ belirsiz artikel."],
        ["Blume", "subject", "Büyüyen şey."],
        ["wächst", "verb", "wachsen üçüncü tekil."],
      ]),
      ex("Ein Buch liegt hier.", "Burada bir kitap duruyor.", [
        ["Ein", "article", "Nötr nominativ."],
        ["Buch", "subject", "Özne."],
        ["liegt", "verb", "Konum fiili."],
      ]),
    ],
    mistake: {
      wrong: "Ein Blume wächst.",
      right: "Eine Blume wächst.",
      why: "Blume dişildir; eine gerekir.",
    },
    tip: "der → ein, die → eine, das → ein. 🌷",
    practice: [
      "[Ein] Blume wächst. Artikelin doğru biçimini yaz.",
      "Eine",
      "Dişil Blume için eine.",
    ],
    quiz: [
      [
        "Nominativ: ___ Blume wächst.",
        "Eine",
        ["Ein", "Einen", "Einem"],
        "Blume dişil özne.",
      ],
      [
        "Nominativ: ___ Buch liegt hier.",
        "Ein",
        ["Eine", "Einen", "Einem"],
        "Buch nötr.",
      ],
      [
        "Nominativ: ___ Mann wartet.",
        "Ein",
        ["Eine", "Einen", "Einer"],
        "Mann eril nominativ.",
      ],
      [
        "ein Buch ifadesinin belirsiz çoğulu?",
        "Bücher",
        ["eine Bücher", "ein Bücher", "einen Bücher"],
        "Belirsiz artikelin çoğulu yoktur.",
      ],
      [
        "Belirli bir kitaptan söz eden ifade?",
        "das Buch",
        ["ein Buch", "Bücher", "eine Buch"],
        "das belirli artikeldir.",
      ],
    ],
  }),
  create({
    slug: "plurals",
    title: "Birden çoğa: isimlerin çoğulları",
    de: "Plural der Nomen",
    category: "nouns",
    intro:
      "Almancada bütün isimlere eklenen tek çoğul eki yoktur. Çoğulu kelimenin ayrılmaz parçası gibi öğrenmek en güvenilir yoldur.",
    goals: [
      "Yaygın çoğul biçimlerini tanı.",
      "Umlautu ve çoğul artikelini fark et.",
    ],
    rules: [
      "Sık örüntüler: -e, -(e)n, -er, -s veya ek almama. Hiçbiri tüm isimlere uygulanamaz.",
      "der Apfel → die Äpfel; das Buch → die Bücher: bazı çoğullarda umlaut vardır.",
      "die Blume → die Blumen; das Zimmer → die Zimmer. Nominativ çoğul belirli artikel die olur.",
      "Sayıdan sonra çoğul genellikle gerekir: zwei Bücher. Kütle isimleri ve ölçü ifadelerinin farklı kullanımları ayrıca öğrenilir.",
    ],
    examples: [
      ex("Die Bücher sind neu.", "Kitaplar yeni.", [
        ["Die", "article", "Nominativ çoğul."],
        ["Bücher", "subject", "Buch'un çoğulu."],
        ["sind", "verb", "Çoğul özneye uygun fiil."],
      ]),
      ex("Ich kaufe zwei Äpfel.", "Ben iki elma satın alıyorum.", [
        ["Ich", "subject", "Özne."],
        ["kaufe", "verb", "ich çekimi."],
        ["zwei Äpfel", "object", "Sayı + çoğul isim."],
      ]),
    ],
    mistake: {
      wrong: "Zwei Buch liegen hier.",
      right: "Zwei Bücher liegen hier.",
      why: "İki kitap: zwei Bücher.",
    },
    tip: "İki biçimi birlikte ek: der Apfel – die Äpfel. 🍎",
    practice: [
      "Zwei [Buch] liegen hier. İsmin çoğulunu düzelt.",
      "Bücher",
      "Buch'un çoğulu Bücher.",
    ],
    quiz: [
      [
        "das Buch → die ___",
        "Bücher",
        ["Buche", "Buchs", "Buchen"],
        "Buch çoğulda -er ve umlaut alır.",
      ],
      [
        "die Blume → die ___",
        "Blumen",
        ["Blüme", "Blumers", "Blumes"],
        "Blume çoğulu Blumen.",
      ],
      [
        "der Apfel → die ___",
        "Äpfel",
        ["Apfeln", "Apfels", "Apfeler"],
        "Apfel'de a → ä değişir.",
      ],
      [
        "das Zimmer → die ___",
        "Zimmer",
        ["Zimmern", "Zimmers", "Zimmere"],
        "Nominativ çoğul biçimi değişmez.",
      ],
      [
        "Nominativ çoğul belirli artikel?",
        "die",
        ["der", "das", "dem"],
        "Çoğulda die.",
      ],
    ],
  }),
  create({
    slug: "negation",
    title: "Nicht ve kein ile olumsuzluk",
    de: "Negation",
    category: "sentences",
    intro:
      "nicht çoğunlukla bir fiili, sıfatı veya belirli öğeyi olumsuzlar. kein belirsiz artikelli veya artikelsiz bir isim grubunun olumsuz karşılığıdır.",
    goals: [
      "İsim olumsuzluğunda kein seç.",
      "Sıfat olumsuzluğunda nicht kullan.",
    ],
    rules: [
      "ein Buch → kein Buch; eine Blume → keine Blume.",
      "Sıfat önünde nicht: Das Buch ist nicht teuer.",
      "kein, ein gibi çekilir: Akkusativ eril einen → keinen; dişil eine → keine.",
      "nicht'in yeri neyin olumsuzlandığına bağlıdır. Bu derste kısa, bağlamı açık isim ve sıfat örnekleriyle başlıyoruz.",
    ],
    examples: [
      ex("Das Buch ist nicht teuer.", "Kitap pahalı değil.", [
        ["Das", "article", "Buch nötrdür."],
        ["Buch", "subject", "Özne."],
        ["ist", "verb", "sein çekimi."],
      ]),
      ex("Ich habe kein Buch.", "Benim kitabım yok.", [
        ["Ich", "subject", "Özne."],
        ["habe", "verb", "Sahiplik fiili."],
        ["kein", "article", "Belirsiz isim grubunun olumsuzu."],
        ["Buch", "object", "Sahip olunmayan nesne."],
      ]),
    ],
    mistake: {
      wrong: "Das Buch ist kein teuer.",
      right: "Das Buch ist nicht teuer.",
      why: "teuer sıfattır; nicht ile olumsuzlanır.",
    },
    tip: "Bir isme “bir tane bile yok” diyorsan çoğu zaman kein yardım eder. 🌼",
    practice: [
      "Das Buch ist [kein] teuer. Olumsuzluk sözcüğünü düzelt.",
      "nicht",
      "Sıfat teuer için nicht gerekir.",
    ],
    quiz: [
      [
        "Ich habe ___ Buch.",
        "kein",
        ["nicht", "keine", "keinen"],
        "Nötr akkusativ: kein Buch.",
      ],
      [
        "Die Blume ist ___ schön.",
        "nicht",
        ["kein", "keine", "keinen"],
        "schön sıfattır.",
      ],
      [
        "Ich sehe ___ Mann.",
        "keinen",
        ["kein", "keine", "nicht"],
        "Eril akkusativ: keinen Mann.",
      ],
      [
        "Ich kaufe ___ Blumen. (İsim grubunu olumsuzla: hiç çiçek almıyorum.)",
        "keine",
        ["kein", "keinen", "nicht"],
        "Belirsiz çoğul: keine Blumen.",
      ],
      [
        "Ich habe eine Tasche. İsim grubunu olumsuzla.",
        "Ich habe keine Tasche.",
        [
          "Ich habe nicht eine Tasche nicht.",
          "Ich kein habe Tasche.",
          "Ich habe kein Tasche.",
        ],
        "Dişil eine yerine keine.",
      ],
    ],
  }),
  create({
    slug: "word-order",
    title: "Ana cümlede sözcüklerin yeri",
    de: "Satzbau",
    category: "sentences",
    intro:
      "Standart bildirme cümlesinde çekimli fiil ikinci öğededir. “İkinci öğe” her zaman ikinci sözcük demek değildir: çok sözcüklü bir zaman ifadesi tek öğe sayılabilir.",
    goals: [
      "Fiili bildirme cümlesinde ikinci öğeye koy.",
      "Zaman baştayken öznenin yerini ayarla.",
    ],
    rules: [
      "Ich lerne Deutsch: özne – çekimli fiil – diğer öğeler.",
      "Heute lerne ich Deutsch: zaman ilk öğe olur, özne fiilden sonra gelir.",
      "Jeden Tag lerne ich Deutsch: Jeden Tag iki sözcüklü tek zaman öğesidir.",
      "Bu kural standart bildirme cümleleri içindir. Evet/hayır soruları ve yan cümlelerin yapısı farklıdır.",
    ],
    examples: [
      ex("Ich lerne heute Deutsch.", "Ben bugün Almanca öğreniyorum.", [
        ["Ich", "subject", "İlk öğedeki özne."],
        ["lerne", "verb", "İkinci öğedeki çekimli fiil."],
        ["Deutsch", "object", "Öğrenilen dil."],
      ]),
      ex("Heute lerne ich Deutsch.", "Bugün Almanca öğreniyorum.", [
        ["lerne", "verb", "Zaman baştayken de ikinci öğede."],
        ["ich", "subject", "Fiilden sonraki özne."],
        ["Deutsch", "object", "Öğrenilen dil."],
      ]),
    ],
    mistake: {
      wrong: "Heute ich lerne Deutsch.",
      right: "Heute lerne ich Deutsch.",
      why: "Heute ilk öğedir; çekimli lerne ikinci öğeye gelir.",
    },
    tip: "İkinci sözcüğü değil, ikinci cümle öğesini düşün! ✨",
    practice: [
      "Heute [ich lerne] Deutsch. İki sözcüğü doğru sırala.",
      "lerne ich",
      "Zaman başa alınınca fiil özneden önce gelir.",
    ],
    quiz: [
      order(
        "“Bugün Almanca öğreniyorum.” cümlesini kur.",
        [
          "Heute lerne ich Deutsch.",
          "Ich lerne heute Deutsch.",
          "Deutsch lerne ich heute.",
        ],
        "lerne ikinci öğededir; bu karolarla üç diziliş kabul edilir.",
      ),
      [
        "Doğru bildirme cümlesi hangisi?",
        "Heute lerne ich Deutsch.",
        [
          "Heute ich lerne Deutsch.",
          "Heute ich Deutsch lerne.",
          "Lerne heute ich Deutsch.",
        ],
        "Zaman ilk, çekimli fiil ikinci öğede.",
      ],
      [
        "Jeden Tag ___ ich Deutsch.",
        "lerne",
        ["lernen", "lernst", "lernt"],
        "Özne ich; Jeden Tag tek zaman öğesidir.",
      ],
      [
        "Standart bildirme cümlesinde çekimli fiil genellikle nerede?",
        "İkinci öğede",
        ["Daima son sözcükte", "Daima ilk sözcükte", "Rastgele"],
        "Bir öğe birden fazla sözcük içerebilir.",
      ],
      order(
        "“Biz bugün oynuyoruz.” cümlesini kur.",
        ["Wir spielen heute.", "Heute spielen wir."],
        "Özne veya zaman başa gelebilir; spielen ikinci öğede.",
      ),
    ],
  }),
  create({
    slug: "questions",
    title: "Soru sormanın küçük yolları",
    de: "Fragen und W-Fragen",
    category: "sentences",
    intro:
      "Evet/hayır sorusunda çekimli fiil başta gelir. W-sorusunda soru öğesi başta, çekimli fiil ikinci öğededir.",
    goals: [
      "Evet/hayır ve W-sorularını ayırt et.",
      "wo ile wohin arasındaki farkı tanı.",
    ],
    rules: [
      "Evet/hayır: Lernst du Deutsch? Önce fiil, sonra özne.",
      "W-sorusu: Wo wohnst du? Soru öğesi + fiil + özne.",
      "wer = kim; was = ne; wo = nerede; wohin = nereye; wann = ne zaman; warum = neden; wie = nasıl.",
      "Wo konum, wohin yön sorar. Bağımsız sorunun sonunda soru işareti kullan.",
    ],
    examples: [
      ex("Lernst du Deutsch?", "Almanca öğreniyor musun?", [
        ["Lernst", "verb", "Evet/hayır sorusunda ilk sırada."],
        ["du", "subject", "Fiilden sonraki özne."],
        ["Deutsch", "object", "Öğrenilen dil."],
      ]),
      ex("Wo wohnst du?", "Nerede yaşıyorsun?", [
        ["wohnst", "verb", "Soru öğesinden sonra fiil."],
        ["du", "subject", "İkinci tekil kişi."],
      ]),
    ],
    mistake: {
      wrong: "Wo du wohnst?",
      right: "Wo wohnst du?",
      why: "Bağımsız W-sorusunda soru sözcüğünden sonra çekimli fiil gelir.",
    },
    tip: "Wo = nerede? Wohin = nereye? 🦋",
    practice: [
      "Wo [du wohnst]? İki sözcüğü doğru sırala.",
      "wohnst du",
      "Wo + çekimli fiil + özne.",
    ],
    quiz: [
      [
        "“Nerede?” karşılığı?",
        "Wo",
        ["Wer", "Wann", "Warum"],
        "Wo konum sorar.",
      ],
      [
        "“Nereye?” karşılığı?",
        "Wohin",
        ["Wo", "Wer", "Was"],
        "Wohin hedef sorar.",
      ],
      [
        "Evet/hayır sorusu hangisi?",
        "Lernst du Deutsch?",
        ["Du lernst Deutsch.", "Wo lernst du Deutsch?", "Wer lernt Deutsch?"],
        "Çekimli fiil baştadır; evet/hayır yanıtı bekler.",
      ],
      [
        "___ wohnst du? — In Berlin.",
        "Wo",
        ["Wer", "Was", "Warum"],
        "In Berlin konumdur.",
      ],
      order(
        "“Almanca öğreniyor musun?” sorusunu kur.",
        ["Lernst du Deutsch?"],
        "Evet/hayır sorusunda fiil başa gelir.",
      ),
    ],
  }),
  create({
    slug: "accusative",
    title: "Akkusativ ile nesneyi bul",
    de: "Akkusativ",
    category: "cases",
    intro:
      "Birçok fiilin doğrudan nesnesi Akkusativ alır. Özneyle nesneyi ayırmak, eril artikelin neden değiştiğini anlamanı sağlar.",
    goals: [
      "Özne ile doğrudan nesneyi ayırt et.",
      "Eril nesnede den ve einen kullan.",
    ],
    rules: [
      "Özne nominativ: Der Mann liest. Doğrudan nesne: Ich sehe den Mann.",
      "Akkusativ belirli artikel: der → den; die, das ve çoğul die değişmez.",
      "Belirsiz artikel: eril ein → einen; dişil eine ve nötr ein değişmez.",
      "Bütün fiiller aynı hâli istemez: helfen dativ ister. Yalnızca Türkçe çeviriden hâl tahmin etme.",
    ],
    examples: [
      ex("Ich sehe den Mann.", "Ben adamı görüyorum.", [
        ["Ich", "subject", "Gören kişi."],
        ["sehe", "verb", "sehen Akkusativ nesne alır."],
        ["den", "article", "Eril akkusativ."],
        ["Mann", "object", "Görülen kişi."],
      ]),
      ex("Ich lese ein Buch.", "Ben bir kitap okuyorum.", [
        ["Ich", "subject", "Okuyan kişi."],
        ["lese", "verb", "lesen fiili."],
        ["ein", "article", "Nötr akkusativ değişmez."],
        ["Buch", "object", "Okunan nesne."],
      ]),
    ],
    mistake: {
      wrong: "Ich sehe der Mann.",
      right: "Ich sehe den Mann.",
      why: "Eril nesne için den gerekir.",
    },
    tip: "Eril nesne küçük bir işaret verir: der → den. 🌱",
    practice: [
      "Ich sehe [der] Mann. Nesnenin artikelini düzelt.",
      "den",
      "sehen + eril akkusativ: den Mann.",
    ],
    quiz: [
      [
        "Ich sehe ___ Mann.",
        "den",
        ["der", "dem", "des"],
        "Eril doğrudan nesne.",
      ],
      [
        "Ich kaufe ___ Apfel.",
        "einen",
        ["ein", "eine", "einem"],
        "Apfel eril; nesnede einen.",
      ],
      [
        "Ich lese ___ Buch.",
        "das",
        ["der", "den", "dem"],
        "Nötr akkusativ das değişmez.",
      ],
      [
        "Ich sehe ___ Blume.",
        "die",
        ["der", "den", "dem"],
        "Dişil akkusativ die.",
      ],
      [
        "Ich sehe den Mann. Özne hangisi?",
        "Ich",
        ["den Mann", "sehe", "Mann"],
        "Görme işini yapan Ich.",
      ],
    ],
  }),
  create({
    slug: "possessives",
    title: "Benim, senin: sahiplik artikelleri",
    de: "Possessivartikel",
    category: "nouns",
    intro:
      "Sahiplik artikellerinde kök sahibine göre, ek ise sahip olunan ismin cinsiyetine, sayısına ve hâline göre seçilir.",
    goals: [
      "mein, dein, sein ve ihr köklerini seç.",
      "İsme göre sahiplik ekini ayarla.",
    ],
    rules: [
      "ich → mein, du → dein, er/es → sein, sie (o) → ihr; wir → unser, ihr → euer, sie (onlar) → ihr, Sie → Ihr.",
      "Nominativ: mein Vater, meine Mutter, mein Buch; çoğul meine Bücher.",
      "Ali ve onun annesi: seine Mutter. Kök sahibine, -e eki Mutter ismine bağlıdır.",
      "Akkusativ eril meinen Vater olur. euer ek aldığında çoğunlukla eure biçimine dönüşür: eure Mutter.",
    ],
    examples: [
      ex("Meine Mutter liest.", "Annem okuyor.", [
        ["Meine", "article", "mein + dişil nominativ -e."],
        ["Mutter", "subject", "Dişil tekil."],
        ["liest", "verb", "Üçüncü tekil çekim."],
      ]),
      ex("Dein Buch ist neu.", "Senin kitabın yeni.", [
        ["Dein", "article", "du sahibine ait nötr isim."],
        ["Buch", "subject", "Nötr özne."],
        ["ist", "verb", "sein çekimi."],
      ]),
    ],
    mistake: {
      wrong: "Mein Mutter liest.",
      right: "Meine Mutter liest.",
      why: "Mutter dişil nominativ: meine.",
    },
    tip: "Sahip kökü seçer; sahip olunan ismin yapısı eki belirler. 🌷",
    practice: [
      "[Mein] Mutter liest. Sahiplik artikelini düzelt.",
      "Meine",
      "Mutter dişil olduğu için meine.",
    ],
    quiz: [
      [
        "___ Mutter liest. (Benim annem)",
        "Meine",
        ["Mein", "Meinen", "Meinem"],
        "Mutter dişil nominativ.",
      ],
      [
        "___ Buch ist neu. (Senin kitabın)",
        "Dein",
        ["Deine", "Deinen", "Deinem"],
        "Buch nötr nominativ.",
      ],
      [
        "Ali ve onun annesi: ___ Mutter",
        "seine",
        ["sein", "ihre", "meinen"],
        "Ali → sein; Mutter dişil → seine.",
      ],
      [
        "Ich sehe ___ Vater. (Benim babamı)",
        "meinen",
        ["mein", "meine", "meinem"],
        "Eril akkusativ meinen.",
      ],
      [
        "___ Bücher sind neu. (Bizim kitaplarımız)",
        "Unsere",
        ["Unser", "Unseren", "Unserem"],
        "Nominativ çoğul unsere.",
      ],
    ],
  }),
  create({
    slug: "modals",
    title: "Yapabilirim, yapmalıyım, istiyorum",
    de: "Modalverben",
    category: "verbs",
    intro:
      "Modal fiiller yetenek, zorunluluk, izin ve istek anlamları ekler. Ana cümlede modal çekilir; diğer fiil mastar olarak sona gider.",
    goals: [
      "Temel modal fiillerin anlamını ayırt et.",
      "Modal fiille cümle çerçevesi oluştur.",
    ],
    rules: [
      "können = yapabilmek, müssen = zorunda olmak, dürfen = izinli olmak, wollen = istemek; sollen beklenti veya gereklilik bildirir.",
      "können: ich kann, du kannst, er kann; wir können, ihr könnt, sie können. Tekil biçimleri ayrıca öğren.",
      "Ich kann Deutsch lernen: çekimli kann ikinci öğede, lernen mastarı sonda.",
      "nicht müssen = zorunda olmamak; nicht dürfen = izinli olmamak. İkisi aynı değildir.",
    ],
    examples: [
      ex("Ich kann Deutsch lernen.", "Ben Almanca öğrenebilirim.", [
        ["Ich", "subject", "Özne."],
        ["kann", "verb", "Çekimli modal."],
        ["Deutsch", "object", "Öğrenilen dil."],
        ["lernen", "verb", "Sondaki mastar."],
      ]),
      ex("Du musst heute arbeiten.", "Sen bugün çalışmak zorundasın.", [
        ["Du", "subject", "İkinci tekil."],
        ["musst", "verb", "Zorunluluk."],
        ["arbeiten", "verb", "Mastar sonda."],
      ]),
    ],
    mistake: {
      wrong: "Ich kann lerne Deutsch.",
      right: "Ich kann Deutsch lernen.",
      why: "Modal çekilir; diğer fiil mastar olarak sonda kalır.",
    },
    tip: "İki fiil bir çerçeve kursun: kann … lernen. ✨",
    practice: [
      "Ich kann Deutsch [lerne]. Sondaki fiili düzelt.",
      "lernen",
      "Modalden sonra mastar kullanılır.",
    ],
    quiz: [
      [
        "Ich ___ Deutsch sprechen. (Yapabilirim)",
        "kann",
        ["kannst", "können", "könnt"],
        "ich ile kann.",
      ],
      [
        "Du ___ heute arbeiten. (Zorundasın)",
        "musst",
        ["muss", "müssen", "müsst"],
        "du ile musst.",
      ],
      [
        "Wir ___ Deutsch lernen. (İstiyoruz)",
        "wollen",
        ["will", "willst", "wollt"],
        "wir ile wollen.",
      ],
      [
        "nicht müssen ne demektir?",
        "Zorunda olmamak",
        ["Yasak olmak", "Yapamamak", "Mutlaka yapmak"],
        "Zorunluluk yokluğu; yasak değil.",
      ],
      order(
        "“Ben Almanca öğrenebilirim.” cümlesini kur.",
        ["Ich kann Deutsch lernen.", "Deutsch kann ich lernen."],
        "kann ikinci öğede, lernen sonda kalır.",
      ),
    ],
  }),
  create({
    slug: "separable",
    title: "Ayrılan fiillerin iki parçası",
    de: "Trennbare Verben",
    category: "verbs",
    intro:
      "aufstehen ve einkaufen gibi fiillerin ayrılan ön eki vardır. Präsens ana cümlesinde kök çekilir; ön ek sona gider.",
    goals: [
      "Ayrılan ön eki ana cümlede sona taşı.",
      "Modal varsa mastarı bir arada tut.",
    ],
    rules: [
      "aufstehen → Ich stehe um sieben Uhr auf. Çekimli kök stehe ikinci öğede, ön ek auf sonda.",
      "einkaufen → Wir kaufen heute ein. Ön ek fiil çerçevesini kapatır.",
      "Modal fiille mastar ayrılmaz: Ich muss früh aufstehen.",
      "Her ön ek ayrılmaz. besuchen gibi be- ile başlayan fiilleri bu kuralla bölme; ayrılabilirliği fiille birlikte öğren.",
    ],
    examples: [
      ex("Ich stehe früh auf.", "Ben erken kalkıyorum.", [
        ["Ich", "subject", "Özne."],
        ["stehe", "verb", "Çekimli kök."],
        ["auf", "verb", "Sondaki fiil ön eki; burada edat değil."],
      ]),
      ex("Wir kaufen heute ein.", "Biz bugün alışveriş yapıyoruz.", [
        ["Wir", "subject", "Çoğul özne."],
        ["kaufen", "verb", "Çekimli kök."],
        ["ein", "verb", "einkaufen ön eki."],
      ]),
    ],
    mistake: {
      wrong: "Ich aufstehe früh.",
      right: "Ich stehe früh auf.",
      why: "Ana cümlede auf sona ayrılır.",
    },
    tip: "Ön ek kelebek gibi sona uçar. 🦋",
    practice: [
      "Ich muss früh [auf stehen]. Mastarı doğru yaz.",
      "aufstehen",
      "Modalden sonra mastar bir arada yazılır.",
    ],
    quiz: [
      [
        "Ich stehe um sieben Uhr ___. (aufstehen: kalkmak)",
        "auf",
        ["ein", "aus", "an"],
        "Fiil aufstehen; ön ek auf.",
      ],
      [
        "Wir ___ heute ein.",
        "kaufen",
        ["einkaufen", "kauft", "kaufe"],
        "wir ile kaufen; ein zaten sonda.",
      ],
      [
        "Modal fiille doğru cümle?",
        "Ich muss früh aufstehen.",
        [
          "Ich muss auf früh stehen.",
          "Ich aufstehe muss früh.",
          "Ich muss früh stehe auf.",
        ],
        "Mastar ayrılmadan sonda.",
      ],
      [
        "Hangi fiil ayrılabilir?",
        "einkaufen",
        ["besuchen", "lernen", "machen"],
        "einkaufen → kaufen … ein.",
      ],
      order(
        "“Ben erken kalkıyorum.” cümlesini kur.",
        ["Ich stehe früh auf.", "Früh stehe ich auf."],
        "stehe ikinci öğede, auf sonda.",
      ),
    ],
  }),
  create({
    slug: "prepositions",
    title: "Yer, yön ve beraberlik edatları",
    de: "Grundlegende Präpositionen",
    category: "cases",
    intro:
      "Edatlar bir isim grubuyla yer, yön, zaman veya ilişki bildirir. Edatın istediği hâli de öğren; Türkçedeki bir ek her zaman tek bir edata karşılık gelmez.",
    goals: [
      "mit, aus, nach ve für kullanımlarını tanı.",
      "Konum ve yön ayrımına başla.",
    ],
    rules: [
      "mit ve aus dativ ister: mit dem Bus, aus der Türkei.",
      "nach artikelsiz şehir ve çoğu ülke adına yön verir: nach Berlin. Artikelli ülke için in die Türkei kullanılır.",
      "für akkusativ ister: für den Mann, für meine Schwester.",
      "in gibi iki hâlli edatlarda konum: in der Schule; hedef: in die Schule. Yalnızca hareket var diye her zaman akkusativ seçilmez.",
    ],
    examples: [
      ex("Ich fahre mit dem Bus.", "Ben otobüsle gidiyorum.", [
        ["Ich", "subject", "Özne."],
        ["fahre", "verb", "fahren fiili."],
        ["mit", "preposition", "Dativ isteyen edat."],
        ["dem", "article", "der Bus → dem Bus."],
      ]),
      ex("Das Buch ist für meine Schwester.", "Kitap kız kardeşim için.", [
        ["Das", "article", "Nötr nominativ."],
        ["Buch", "subject", "Özne."],
        ["ist", "verb", "sein fiili."],
        ["für", "preposition", "Akkusativ isteyen edat."],
      ]),
    ],
    mistake: {
      wrong: "Ich fahre mit den Bus.",
      right: "Ich fahre mit dem Bus.",
      why: "mit dativ ister: dem Bus.",
    },
    tip: "Edatı hâliyle ek: mit + dativ, für + akkusativ. 🌼",
    practice: [
      "Ich fahre mit [den] Bus. Artikelini düzelt.",
      "dem",
      "mit dativ ister: dem Bus.",
    ],
    quiz: [
      [
        "Ich fahre ___ Berlin. (Berlin'e)",
        "nach",
        ["mit", "aus", "für"],
        "Artikelsiz şehir adına yön: nach.",
      ],
      [
        "Ich komme ___ der Türkei. (Türkiye'den)",
        "aus",
        ["nach", "für", "mit"],
        "Köken/çıkış: aus + dativ.",
      ],
      [
        "Ich fahre mit ___ Bus.",
        "dem",
        ["den", "der", "des"],
        "mit dativ ister; dem Bus.",
      ],
      [
        "Das Geschenk ist für ___ Mann.",
        "den",
        ["dem", "der", "des"],
        "für akkusativ ister; den Mann.",
      ],
      [
        "“Okuldayım.” için konum ifadesi?",
        "in der Schule",
        ["in die Schule", "nach Schule", "für die Schule"],
        "Konum bildiren in burada dativ alır.",
      ],
    ],
  }),
];
const planned: Record<
  Exclude<Topic["level"], "A1">,
  [string, string, Category][]
> = {
  A2: [
    ["Dativ", "Dativ: dolaylı tümleç", "cases"],
    ["Akkusativ und Dativ", "Akkusativ ve Dativ karşılaştırması", "cases"],
    ["Wechselpräpositionen", "İki hâlli edatlar", "cases"],
    ["Perfekt", "Perfekt ile geçmiş", "verbs"],
    ["Präteritum", "Yaygın fiillerin Präteritum biçimleri", "verbs"],
    ["Reflexive Verben", "Dönüşlü fiiller", "verbs"],
    ["Komparativ und Superlativ", "Karşılaştırma ve en üstünlük", "basics"],
    ["Adjektivendungen", "Sıfat eklerine giriş", "nouns"],
    ["weil und dass", "weil ve dass ile yan cümleler", "sentences"],
    ["Konjunktionen", "Bağlaçlar", "sentences"],
    ["Imperativ", "Emir kipi", "verbs"],
    ["Zukunft ausdrücken", "Geleceği ifade etmek", "verbs"],
  ],
  B1: [
    ["Relativsätze", "İlgi cümleleri", "sentences"],
    ["Konjunktiv II", "Varsayım ve nezaket", "verbs"],
    ["Passiv", "Edilgen yapıya giriş", "verbs"],
    ["Infinitiv mit zu", "zu ile mastar", "sentences"],
    ["Erweiterte Nebensätze", "Gelişmiş yan cümleler", "sentences"],
    ["Plusquamperfekt", "Geçmişten önceki geçmiş", "verbs"],
    ["Genitiv", "Genitiv: ilgi hâli", "cases"],
    ["Verben mit Präpositionen", "Edatlı fiiller", "cases"],
    ["Adjektivdeklination", "Sıfat çekimi", "nouns"],
    ["Temporalsätze", "Zaman cümleleri", "sentences"],
    ["Konditionalsätze", "Koşul cümleleri", "sentences"],
    ["Indirekte Fragen", "Dolaylı sorular", "sentences"],
  ],
  B2: [
    ["Erweitertes Passiv", "İleri edilgen yapılar", "verbs"],
    ["Komplexe Relativsätze", "Karmaşık ilgi cümleleri", "sentences"],
    ["Nominalisierung", "İsimleştirme", "style"],
    ["Partizipialkonstruktionen", "Ortaçlı yapılar", "style"],
    ["Erweiterter Konjunktiv II", "İleri Konjunktiv II", "verbs"],
    ["Erweiterte Wortstellung", "İleri sözcük dizimi", "sentences"],
    ["Formelle Schriftsprache", "Resmî yazılı Almanca", "style"],
    ["Erweiterte Konnektoren", "İleri bağlayıcılar", "sentences"],
    ["Indirekte Rede", "Dolaylı anlatıma giriş", "style"],
    ["Präpositionalstrukturen", "İleri edat yapıları", "cases"],
  ],
  C1: [
    ["Konjunktiv I", "Konjunktiv I", "verbs"],
    ["Erweiterte indirekte Rede", "İleri dolaylı anlatım", "style"],
    ["Komplexer Satzbau", "Karmaşık cümle yapıları", "sentences"],
    ["Nominalstil", "İleri isim ağırlıklı anlatım", "style"],
    ["Partizipialattribute", "Ortaçlı nitelemeler", "nouns"],
    ["Wissenschaftliches Schreiben", "Akademik yazı yapıları", "style"],
    ["Modalkonstruktionen", "İleri kiplik yapıları", "verbs"],
    ["Stilistische Varianten", "Üslup çeşitleri", "style"],
    ["Passivalternativen", "Edilgen yapının alternatifleri", "verbs"],
  ],
  C2: [
    ["Stilistische Transformationen", "İleri üslup dönüşümleri", "style"],
    ["Idiomatische Grammatik", "Deyimsel dilbilgisi", "style"],
    ["Register und Nuancen", "Dil düzeyi ve ince anlam", "style"],
    ["Wissenschaftliche Konstruktionen", "Karmaşık akademik yapılar", "style"],
    ["Diskursstrukturen", "İleri söylem yapıları", "style"],
    ["Modus und Modalität", "Kip ve kiplikte ince ayrımlar", "verbs"],
    ["Satzumformung", "İleri cümle dönüştürme", "sentences"],
  ],
};
export const topics: Topic[] = [
  ...a1Topics,
  ...(
    Object.entries(planned) as [
      Exclude<Topic["level"], "A1">,
      [string, string, Category][],
    ][]
  ).flatMap(([level, items]) =>
    items
      .map(([german, title, category], i) => ({
        id:
          "grammar-" +
          level.toLowerCase() +
          "-" +
          String(i + 1).padStart(2, "0"),
        level,
        title,
        german,
        category,
        summary: "Doğrulanmış açıklama ve etkinlikler ileride eklenecek.",
      }))
      .map(
        (topic) =>
          [
            ...a2Topics,
            ...b1Topics,
            ...b2Topics,
            ...c1Topics,
            ...c2Topics,
          ].find((ready) => ready.id === topic.id) ?? topic,
      ),
  ),
];
export const topicById = (id: string) => topics.find((t) => t.id === id);
