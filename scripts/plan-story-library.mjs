// Additive, fixed public lesson plan: exactly ten stories per CEFR level.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const existing = [
  "stories",
  "extra-stories",
  "comedy-stories",
  "world-stories",
].flatMap((n) =>
  JSON.parse(readFileSync("src/data/stories/" + n + ".json", "utf8")),
);
const plans = [];
const add = (level, category, slug, title, plot) =>
  plans.push({
    id: `story-library-${level.toLowerCase()}-${slug}`,
    level,
    category,
    title,
    plot,
    art: {
      daily: "cafe",
      friendship: "park",
      mystery: "night",
      fantasy: "garden",
      travel: "train",
      work: "town",
      germany: "town",
      comedy: "gift",
    }[category],
  });
add(
  "A1",
  "work",
  "blumenladen",
  "Çiçekçide İlk Sabah",
  "A new helper in a small flower shop asks about colors, numbers and a simple bouquet order. Branches lead to four distinct helpful outcomes; no assumed job knowledge.",
);
add(
  "A1",
  "germany",
  "fensterbrett",
  "Pencere Önündeki Saksılar",
  "A newcomer meets neighbors through flowers on a shared window ledge. Use introductions, locations and polite simple questions; no claims about tenancy law.",
);
add(
  "A1",
  "friendship",
  "picknick",
  "Yağmurdan Sonra Piknik",
  "Two friends adjust a picnic after rain. A dry bench, a covered courtyard, a garden and a friendly cafe offer genuinely different small adventures.",
);
add(
  "A1",
  "daily",
  "einkauf",
  "Pazar Sepetindeki Liste",
  "A handwritten shopping list leads through a friendly market. Practice fruit, quantities, simple prices and asking what an unfamiliar item is.",
);
add(
  "A2",
  "daily",
  "backtag",
  "Fırından Gelen Koku",
  "Neighbors prepare a shared baking afternoon. Explain a missing ingredient, ask for help and choose between changing plans and sharing tasks; no technical oven instructions.",
);
add(
  "A2",
  "mystery",
  "schluessel",
  "Mavi Anahtarlık",
  "A blue bicycle keyring is found near the library. Compare public clues and ask staff without revealing private addresses; four plausible ways to find or safely await the owner.",
);
add(
  "A2",
  "fantasy",
  "laterne",
  "Yolu Gösteren Fener",
  "A friendly lantern lights different garden paths when people ask kind questions. Choices determine what the characters discover, without danger or frightening creatures.",
);
add(
  "A2",
  "work",
  "probetag",
  "Kütüphanede Deneme Günü",
  "A learner helps at a fictional library open day. Clarify a task, explain available time and decide how to organize a welcoming reading corner.",
);
add(
  "A2",
  "travel",
  "faehre",
  "Küçük Feribot Yolculuğu",
  "Two travelers plan a calm daytime ferry excursion and respond to a changed timetable. Distinct endings focus on the island garden, waterfront village, market or a later trip, no emergency.",
);
add(
  "A2",
  "germany",
  "tauschregal",
  "Mahallenin Takas Rafı",
  "A newcomer discovers a neighborhood exchange shelf. Explain what can be shared, read the organizers' simple fictional rules and choose how to contribute.",
);
add(
  "B1",
  "daily",
  "wochenmarkt",
  "Son Domates Kasası",
  "The last tomato crate at a market prompts a discussion about sharing, cooking together and changing a shopping plan. Give reasons and recount what happened without moral pressure.",
);
add(
  "B1",
  "friendship",
  "fotoalbum",
  "Eski Fotoğraftaki Yeni Plan",
  "Two friends find an old group photograph and plan a small reunion. Ask permission before sharing photos and respect a friend who prefers a quiet meeting.",
);
add(
  "B1",
  "fantasy",
  "windpost",
  "Rüzgâr Postanesi",
  "A magical post office carries friendly messages in the wind. An unsigned public greeting needs context; decide whether to ask, display a neutral notice or write a new invitation.",
);
add(
  "B1",
  "travel",
  "umleitung",
  "Bisiklet Rotasındaki Değişiklik",
  "An ordinary signed cycle-path diversion changes a relaxed day trip. Compare time, companions' preferences and public route information; no dangerous maneuvers.",
);
add(
  "B1",
  "work",
  "radioteam",
  "Okul Radyosunun İlk Yayını",
  "An adult language class produces its first school radio program. Resolve a recording mistake, divide tasks and credit contributors while explaining opinions.",
);
add(
  "B1",
  "friendship",
  "neuanfang",
  "Bir Yanlış Anlaşılmanın Ardından",
  "A brief text message sounded colder than intended. Friends separate assumptions from what was actually written, listen and choose different respectful ways to reconnect.",
);
add(
  "B1",
  "germany",
  "gartenfest",
  "Avludaki Bahar Şenliği",
  "Neighbors organize a courtyard spring gathering. Balance quiet and sociable activities through requests and reasons; all event rules are fictional agreements, not German legal advice.",
);
add(
  "B2",
  "daily",
  "rezeptbuch",
  "Tarif Defterinin Yeni Sayfası",
  "A family recipe notebook inspires a community dinner. Distinguish preserving a tradition from allowing adaptations, and explain changes transparently without invented cultural claims.",
);
add(
  "B2",
  "friendship",
  "ausstellung",
  "İki Arkadaş, Bir Sergi",
  "Friends preparing an exhibition disagree about selection and credit. Compare artistic aims, negotiate boundaries and produce distinct cooperative or independent outcomes.",
);
add(
  "B2",
  "fantasy",
  "zeitgarten",
  "Dakikaların Açtığı Bahçe",
  "A magical garden grows flowers when attention is freely given, not when people rush. Four branches explore curiosity, rest, cooperation and leaving room for unfinished work.",
);
add(
  "B2",
  "travel",
  "inselroute",
  "Adanın İki Yolu",
  "Visitors compare two fictional island routes and learn why an area is temporarily closed. Choose informed alternatives, question assumptions and consider companions without shaming them.",
);
add(
  "B2",
  "germany",
  "stadtteilzeitung",
  "Mahalle Gazetesinin Açık Sayfası",
  "A neighborhood newspaper receives conflicting accounts of a community project. Compare sources, seek clarification and distinguish an opinion column from a report.",
);
add(
  "B2",
  "work",
  "werkstattplan",
  "Tasarım Atölyesindeki İki Öneri",
  "A design workshop has two feasible plans and limited time. Weigh accessibility, materials and clarity; four endings arise from transparent priorities rather than one perfect answer.",
);
add(
  "B2",
  "mystery",
  "postkarte",
  "Gecikmiş Kartpostalın Rotası",
  "A delayed postcard arrives at a public bookshop with an ambiguous place name. Use dates, public maps and the shop archive to reconstruct several plausible routes without a crime plot.",
);
add(
  "C1",
  "daily",
  "reparierteuhr",
  "Durmuş Saatin Etrafında",
  "A stopped decorative clock in a shared reading room triggers a nuanced discussion of routine, memory and practical usefulness. Avoid electrical repair instructions and grief themes.",
);
add(
  "C1",
  "friendship",
  "gemeinsamertext",
  "Birlikte Yazılan Sessizlik",
  "Two friends co-write a short stage text and disagree about a deliberate pause. Explore subtext, listening and preserving different interpretations without forcing agreement.",
);
add(
  "C1",
  "mystery",
  "gartenarchiv",
  "Bahçe Arşivindeki Boş Sayfa",
  "A missing page in a fictional community garden archive invites several explanations. Compare the limits of documentary evidence and preserve uncertainty without sensationalism.",
);
add(
  "C1",
  "travel",
  "nachtzug",
  "Gece Trenindeki Pencere",
  "A comfortable overnight train journey brings several perspectives on the same landscape. Choices explore conversation, observation, an audio guide and a shared travel note; no threat or emergency.",
);
add(
  "C1",
  "work",
  "uebersetzung",
  "Çeviri Masasındaki Anlamlar",
  "A team translates an original short museum text with an ambiguous key phrase. Weigh audience, register and retained ambiguity, with no copyrighted source material.",
);
add(
  "C1",
  "germany",
  "lesesaal",
  "Mahallenin Sessiz Köşesi",
  "Residents discuss how a fictional neighborhood reading space can welcome conversation while protecting quiet study. Different negotiated arrangements retain tradeoffs.",
);
add(
  "C1",
  "fantasy",
  "sternenkarte",
  "Yeryüzüne Çizilen Yıldız Haritası",
  "A whimsical map projects stars onto garden paths, but the pattern changes with the questions asked. Explore interpretation, cooperation and accepting incomplete knowledge; no pseudo-scientific claims.",
);
add(
  "C2",
  "daily",
  "randnotizen",
  "Gündelik Olanın Kenar Notları",
  "An essay workshop reconsiders a supposedly trivial daily observation. Distinguish precise detail, imposed symbolism and retrospective storytelling through nuanced voices.",
);
add(
  "C2",
  "friendship",
  "unausgesprochen",
  "Söylenmeyen Cümlenin Ardından",
  "Friends revisit an unfinished sentence after a collaborative event. Explore implicature, irony and respectful non-disclosure without assuming motives or forcing emotional resolution.",
);
add(
  "C2",
  "fantasy",
  "namenhaus",
  "Adını Değiştiren Ev",
  "A benign magical house changes the names of its rooms when visitors tell different stories. Four endings explore identity, language and shared space without erasing anyone's memories.",
);
add(
  "C2",
  "travel",
  "reisefuehrer",
  "Bir Rehberin Dipnotlarında",
  "An original fictional travel guide has notes that complicate its confident main narrative. Compare narrative authority, selective description and situated perspectives without inventing real history.",
);
add(
  "C2",
  "germany",
  "stadtgespraech",
  "Bir Meydanın Birden Çok Adı",
  "People in a fictional German neighborhood use different informal names for the same square. Trace contexts of naming and belonging without making claims about actual municipal regulations.",
);
add(
  "C2",
  "comedy",
  "vernissage",
  "Açılış Konuşmasının Kaybolan Noktası",
  "At an art opening, one missing full stop turns a serious speech into a chain of harmless misunderstandings. Use subtle situational humor, irony and register shifts without mocking identities.",
);
add(
  "C2",
  "mystery",
  "spiegelbrief",
  "Aynadaki Notun Yazarı",
  "A playful unsigned note in a public writers' studio can be read in two ways. Test interpretations and authorship hypotheses using textual evidence, not a detective crime or private surveillance.",
);
for (const level of ["A1", "A2", "B1", "B2", "C1", "C2"]) {
  if (
    existing.filter((s) => s.level === level).length +
      plans.filter((p) => p.level === level).length !==
    10
  )
    throw Error("Invalid level total " + level);
  for (const category of [
    "daily",
    "friendship",
    "mystery",
    "fantasy",
    "travel",
    "work",
    "germany",
    "comedy",
  ])
    if (
      ![...existing, ...plans].some(
        (s) => s.level === level && s.category === category,
      )
    )
      throw Error("Missing category " + level + category);
}
mkdirSync("src/data/stories", { recursive: true });
writeFileSync(
  "src/data/stories/library-plans.json",
  JSON.stringify(plans, null, 2) + "\n",
);
console.log(
  "38 additive plans validated: 10 stories and all 8 categories per level.",
);
