import { LEVELS, type Level, type Unit } from "./types.ts";
export const levelThemes: Record<
  Level,
  { name: string; symbol: string; description: string }
> = {
  A1: {
    name: "Bahar Çayırı",
    symbol: "🌷",
    description: "Kendini tanıt, günlük ihtiyaçlarını basit ifadelerle anlat.",
  },
  A2: {
    name: "Kelebek Vadisi",
    symbol: "🦋",
    description: "Tanıdık konularda kısa bilgi alışverişleri yap.",
  },
  B1: {
    name: "Büyülü Orman",
    symbol: "🌳",
    description: "Deneyimlerini, planlarını ve görüşlerini bağlantılı anlat.",
  },
  B2: {
    name: "Ay Işığı Bahçesi",
    symbol: "🌙",
    description: "Görüşlerini gerekçelendir, farklı bakış açılarını tartış.",
  },
  C1: {
    name: "Kristal Sera",
    symbol: "💎",
    description: "Karmaşık konuları esnek, düzenli ve ayrıntılı ifade et.",
  },
  C2: {
    name: "Kraliyet Çiçek Diyarı",
    symbol: "👑",
    description: "İnce anlam ayrımlarını ve farklı üslupları ustalıkla kullan.",
  },
};
const titles: Record<Level, string[]> = {
  A1: [
    "Selamlaşma ve Tanışma",
    "Aile ve Arkadaşlar",
    "Sayılar ve Zaman",
    "Yiyecek ve İçecekler",
    "Günlük Rutinler",
    "Ev ve Okul",
    "Alışveriş",
    "Seyahat ve Yönler",
    "Hobiler",
    "Temel Konuşmalar",
  ],
  A2: [
    "Günlük Deneyimler",
    "Sağlık ve Randevular",
    "Ev ve Komşuluk",
    "İş ve Meslekler",
    "Geçmişte Yaşananlar",
    "Tatil Planları",
    "Hizmetler ve Resmî İşler",
    "Davetler ve Kutlamalar",
    "Medya ve İletişim",
    "Karşılaştırma ve Tercihler",
  ],
  B1: [
    "Yaşam Öyküleri",
    "Eğitim ve Öğrenme",
    "İş Hayatında İletişim",
    "Toplum ve Birlikte Yaşam",
    "Çevre ve Sürdürülebilirlik",
    "Seyahatte Sorun Çözme",
    "Kültür ve Gelenekler",
    "Duygular ve İlişkiler",
    "Görüş Bildirme",
    "Planlar ve Olasılıklar",
  ],
  B2: [
    "Gerekçeli Tartışmalar",
    "Bilim ve Teknoloji",
    "Medya Okuryazarlığı",
    "Çalışma Dünyasının Geleceği",
    "Kültürlerarası İletişim",
    "Ekonomi ve Tüketim",
    "Çevre Politikaları",
    "Resmî Yazışmalar",
    "Metinleri Özetleme",
    "Sunum ve Münazara",
  ],
  C1: [
    "Akademik Söylem",
    "Karmaşık Metin Analizi",
    "Dil ve Kimlik",
    "Toplumsal Tartışmalar",
    "Mesleki Müzakere",
    "Edebî Yorum",
    "Kaynakları Sentezleme",
    "İkna ve Retorik",
    "Üslup ve Dil Düzeyleri",
    "Ayrıntılı Raporlama",
  ],
  C2: [
    "Anlam İncelikleri",
    "İroni ve Örtük Anlam",
    "Edebiyatta Üslup",
    "Akademik Eleştiri",
    "Karmaşık Görüşleri Sentezleme",
    "Deyimler ve Kültürel Çağrışımlar",
    "İleri Düzey Müzakere",
    "Türler Arası Metin Dönüşümü",
    "Spontane ve Hassas İfade",
    "Kapsamlı Söylem Atölyesi",
  ],
};
export const curriculum: Unit[] = LEVELS.flatMap((level) =>
  titles[level].map((title, i) => {
    const id = `${level.toLowerCase()}-${String(i + 1).padStart(2, "0")}`;
    return {
      id,
      level,
      order: i + 1,
      title,
      goal: `${title} konusunda ${levelThemes[level].description.charAt(0).toLocaleLowerCase("tr-TR") + levelThemes[level].description.slice(1)}`,
      lessons: [
        {
          id: id + "-words",
          title: "Kelime patikası",
          kind: "vocabulary",
          description: "Konuya ait kelimeleri kartlarla çalış.",
        },
        {
          id: id + "-practice",
          title: "İletişim atölyesi",
          // Legacy SQL category retained; the actual practice is integrated into the unit course.
          kind: "planned",
          description:
            "Bu ünitenin açıklamalı dersindeki yönlendirmeli ve bağımsız pratik bölümleri.",
        },
      ],
    };
  }),
);
export function unitsFor(level: Level) {
  return curriculum.filter((u) => u.level === level);
}
export function isUnlocked(level: Level, placement: Level) {
  return LEVELS.indexOf(level) <= LEVELS.indexOf(placement);
}
