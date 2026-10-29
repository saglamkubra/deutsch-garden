import expressionGrammar from "../../data/courses/expression-grammar.json" with { type: "json" };
// Original A1 metadata and authored course expressions linked to exact examples.
// Variants list all allowed orders for THESE tile sets; no arbitrary sentence deletion.
export const grammar: Record<
  string,
  {
    sentence: string;
    missing: string;
    forms: string[];
    orders: string[];
    explanation: string;
    phrase?: boolean;
    blank?: string;
  }
> = {
  ...expressionGrammar,
  heißen: {
    sentence: "Ich heiße Deniz.",
    missing: "heiße",
    forms: ["heiße", "heißt", "heißen"],
    orders: ["Ich heiße Deniz."],
    explanation:
      "ich öznesiyle heißen fiili heiße olur. Bildirme cümlesinde çekimli fiil ikinci öğedir.",
  },
  kommen: {
    sentence: "Ich komme aus der Türkei.",
    missing: "komme",
    forms: ["komme", "kommst", "kommen", "kommt"],
    orders: ["Ich komme aus der Türkei.", "Aus der Türkei komme ich."],
    explanation:
      "ich ile komme kullanılır. Aus edatı burada dativ alır: aus der Türkei.",
  },
  helfen: {
    sentence: "Ich helfe meiner Schwester.",
    missing: "helfe",
    forms: ["helfe", "hilfst", "helfen", "hilft"],
    orders: ["Ich helfe meiner Schwester.", "Meiner Schwester helfe ich."],
    explanation:
      "ich ile helfe kullanılır. Helfen dativ ister: meiner Schwester.",
  },
  heute: {
    sentence: "Heute lerne ich Deutsch.",
    missing: "lerne",
    forms: ["lerne", "lernst", "lernen", "lernt"],
    orders: [
      "Heute lerne ich Deutsch.",
      "Ich lerne heute Deutsch.",
      "Deutsch lerne ich heute.",
    ],
    explanation:
      "Zaman ifadesi başa geldiğinde de çekimli fiil ikinci öğede kalır: Heute lerne ich …",
  },
  trinken: {
    sentence: "Wir trinken am Morgen Tee.",
    missing: "trinken",
    forms: ["trinken", "trinke", "trinkst", "trinkt"],
    orders: [
      "Wir trinken am Morgen Tee.",
      "Am Morgen trinken wir Tee.",
      "Tee trinken wir am Morgen.",
    ],
    explanation:
      "wir öznesiyle trinken kullanılır. Am Morgen bir zaman öğesidir.",
  },
  essen: {
    sentence: "Wir essen heute Suppe.",
    missing: "essen",
    forms: ["essen", "esse", "isst", "esst"],
    orders: [
      "Wir essen heute Suppe.",
      "Heute essen wir Suppe.",
      "Suppe essen wir heute.",
    ],
    explanation:
      "wir ile essen kullanılır. Heute başa gelirse özne çekimli fiilden sonra gelir.",
  },
  lernen: {
    sentence: "Wir lernen jeden Tag zehn Wörter.",
    missing: "lernen",
    forms: ["lernen", "lerne", "lernst", "lernt"],
    orders: [
      "Wir lernen jeden Tag zehn Wörter.",
      "Jeden Tag lernen wir zehn Wörter.",
      "Zehn Wörter lernen wir jeden Tag.",
    ],
    explanation:
      "wir ile lernen kullanılır. Jeden Tag zaman ifadesidir; çekimli fiil ikinci öğede bulunur.",
  },
  kaufen: {
    sentence: "Ich kaufe zwei Brötchen.",
    missing: "kaufe",
    forms: ["kaufe", "kaufst", "kaufen", "kauft"],
    orders: ["Ich kaufe zwei Brötchen.", "Zwei Brötchen kaufe ich."],
    explanation:
      "ich ile kaufe kullanılır. Zwei Brötchen nesnedir; başa alınabilir.",
  },
  arbeiten: {
    sentence: "Sie arbeitet heute zu Hause.",
    missing: "arbeitet",
    forms: ["arbeitet", "arbeite", "arbeitest", "arbeiten"],
    orders: [
      "Sie arbeitet heute zu Hause.",
      "Heute arbeitet sie zu Hause.",
      "Zu Hause arbeitet sie heute.",
    ],
    explanation:
      "Bu örnekte sie tekil, yani o demektir; arbeitet kullanılır. Fiil ikinci öğededir.",
  },
  schlafen: {
    sentence: "Das Kind schläft im Zimmer.",
    missing: "schläft",
    forms: ["schläft", "schlafe", "schlafen", "schlaft"],
    orders: ["Das Kind schläft im Zimmer.", "Im Zimmer schläft das Kind."],
    explanation:
      "Das Kind tekildir. Schlafen fiili üçüncü tekilde schläft olur.",
  },
  fahren: {
    sentence: "Wir fahren mit dem Bus zur Schule.",
    missing: "fahren",
    forms: ["fahren", "fahre", "fährst", "fahrt"],
    orders: [
      "Wir fahren mit dem Bus zur Schule.",
      "Mit dem Bus fahren wir zur Schule.",
      "Zur Schule fahren wir mit dem Bus.",
    ],
    explanation:
      "wir ile fahren kullanılır. Mit dem Bus araç, zur Schule yön belirtir.",
  },
  spielen: {
    sentence: "Meine Schwester spielt Gitarre.",
    missing: "spielt",
    forms: ["spielt", "spiele", "spielst", "spielen"],
    orders: [
      "Meine Schwester spielt Gitarre.",
      "Gitarre spielt meine Schwester.",
    ],
    explanation:
      "Meine Schwester üçüncü tekildir: spielt. Bildirme cümlesinde fiil ikinci öğededir.",
  },
};
