// Original bilingual content. Existing lessons and private learner data are not modified.
import { writeFileSync } from "node:fs";
const write = (path, value) =>
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n");
const listening = [];
function episode(level, title, german, category, summary, lines, questions) {
  const id = `listen-${level.toLowerCase()}-plan-1`;
  listening.push({
    id,
    level,
    title,
    german,
    category,
    icon: "🎧",
    summary,
    lemmas: ["Wochenende", "Pause", "Nachricht"].filter((lemma) =>
      lines.some(([de]) => de.includes(lemma)),
    ),
    sentences: lines.map(([de, tr], i) => ({
      id: `${id}:s${i + 1}`,
      de,
      tr,
      links: ["Wochenende", "Pause", "Nachricht"]
        .filter((word) => de.includes(word))
        .map((lemma) => ({ text: lemma, lemma })),
    })),
    quiz: questions.map(([prompt, answer, wrong1, wrong2, explanation], i) => ({
      id: `${id}:q${i + 1}`,
      type: "choice",
      wordIds: [id],
      prompt,
      accepted: [answer],
      options: [answer, wrong1, wrong2].toSorted((a, b) => {
        const hash = (s) =>
          [...s].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, i + 1);
        return hash(a) - hash(b);
      }),
      explanation,
    })),
  });
}
episode(
  "A2",
  "Hafta sonu planları",
  "Ein Wochenende mit Plan B",
  "conversation",
  "Bir hafta sonu planını dinle; saatleri, gerekçeleri ve değişen planı ayırt et. Sekiz açıklamalı soruyla pekiştir.",
  [
    [
      "Hallo Mila, hast du am Samstag Zeit? Ich möchte mit dir an den See fahren.",
      "Merhaba Mila, cumartesi vaktin var mı? Seninle göle gitmek istiyorum.",
    ],
    [
      "Gern! Aber am Vormittag muss ich meiner Nachbarin beim Einkaufen helfen.",
      "Seve seve! Ama öğleden önce komşuma alışverişte yardım etmem gerekiyor.",
    ],
    [
      "Dann nehmen wir den Bus um halb zwei. Die Fahrt dauert ungefähr vierzig Minuten.",
      "O zaman bir buçuktaki otobüse binelim. Yolculuk yaklaşık kırk dakika sürüyor.",
    ],
    [
      "Gut. Ich bringe Brot und Käse mit. Kannst du etwas zu trinken kaufen?",
      "Güzel. Ekmek ve peynir getiririm. İçecek bir şeyler alabilir misin?",
    ],
    [
      "Ja, das mache ich. Am See können wir spazieren gehen und eine Pause machen.",
      "Evet, alırım. Gölde yürüyüş yapıp mola verebiliriz.",
    ],
    [
      "Am Freitagabend bekomme ich aber eine Nachricht: Am Samstag soll es stark regnen.",
      "Ama cuma akşamı bir mesaj alıyorum: Cumartesi çok yağmur yağması bekleniyormuş.",
    ],
    [
      "Bei Regen möchte ich nicht am See sitzen. Wollen wir stattdessen ins Museum gehen?",
      "Yağmurda göl kenarında oturmak istemiyorum. Onun yerine müzeye gidelim mi?",
    ],
    [
      "Gute Idee! Das Museum öffnet um zehn, aber wir treffen uns erst um zwei am Eingang.",
      "İyi fikir! Müze onda açılıyor ama biz ancak ikide girişte buluşuyoruz.",
    ],
    [
      "Danach können wir im Café neben dem Museum einen Tee trinken. Dort gibt es auch Kuchen.",
      "Sonra müzenin yanındaki kafede çay içebiliriz. Orada pasta da var.",
    ],
    [
      "Abgemacht! Den Ausflug an den See verschieben wir auf das nächste Wochenende.",
      "Anlaştık! Göl gezisini gelecek hafta sonuna erteliyoruz.",
    ],
  ],
  [
    [
      "İlk plan nedir?",
      "Göle gitmek",
      "Müzede çalışmak",
      "Komşuyu ziyaret etmek",
      "İlk cümlede “an den See fahren” deniyor. Müze, hava nedeniyle sonradan seçilen alternatif.",
    ],
    [
      "Mila neden sabah gelemiyor?",
      "Komşusuna alışverişte yardım edecek.",
      "Otobüsü kaçırdığı için.",
      "Müze kapalı olduğu için.",
      "“muss ... beim Einkaufen helfen” bir zorunluluk bildirir; “beim” burada etkinlik sırasında anlamı taşır.",
    ],
    [
      "İlk plandaki otobüs saat kaçta?",
      "13.30",
      "14.30",
      "12.30",
      "Almanca “halb zwei”, ikiye yarım saat var demektir: 13.30. Türkçe saat ifadesiyle karıştırma.",
    ],
    [
      "Yiyecekleri kim getirecek?",
      "Mila",
      "Otobüs şoförü",
      "Komşusu",
      "Mila “Ich bringe Brot und Käse mit” diyor. Ayrılabilen “mitbringen” fiilinin “mit” parçası sonda.",
    ],
    [
      "Mesaj ne zaman geliyor?",
      "Cuma akşamı",
      "Cumartesi öğleden sonra",
      "Pazar sabahı",
      "“Am Freitagabend” zaman bilgisidir. Yağmurun beklendiği gün ise cumartesidir.",
    ],
    [
      "Buluşma nerede ve kaçta?",
      "Müzenin girişinde saat 14.00’te.",
      "Gölde saat 10.00’da.",
      "Kafede saat 13.30’da.",
      "Müzenin açılış saati on; buluşma saati iki. Dinlerken bu iki saatin görevini ayır.",
    ],
    [
      "“stattdessen” burada ne demek?",
      "Onun yerine",
      "Buna rağmen",
      "Önceki gün",
      "Göle gitme planının yerine müze öneriliyor; “stattdessen” bir alternatif getirir.",
    ],
    [
      "Göl gezisi iptal mi ediliyor?",
      "Hayır, gelecek hafta sonuna erteleniyor.",
      "Evet, bir daha yapılmayacak.",
      "Hayır, aynı sabah yapılıyor.",
      "“auf das nächste Wochenende verschieben” ertelemek demektir. “absagen” ile aynı anlamda değildir.",
    ],
  ],
);
episode(
  "B1",
  "İş yerinde konuşmalar",
  "Eine Übergabe ohne Missverständnisse",
  "education",
  "Bir ekip konuşmasında sorumluluk, süre ve koşulları takip et. Sekiz soruyla ayrıntıları ve neden-sonuç bağlarını çalış.",
  [
    [
      "Bevor wir anfangen, möchte ich die Aufgaben für diese Woche verteilen. Der Bericht soll am Donnerstag fertig sein.",
      "Başlamadan önce bu haftanın görevlerini dağıtmak istiyorum. Rapor perşembe günü hazır olmalı.",
    ],
    [
      "Ich kann die Zahlen prüfen, obwohl ich am Dienstag eine Fortbildung habe.",
      "Salı günü bir eğitimim olmasına rağmen sayıları kontrol edebilirim.",
    ],
    [
      "Danke, Nora. Bitte schicke mir deine Ergebnisse bis Mittwochmittag, damit ich genug Zeit für die Zusammenfassung habe.",
      "Teşekkürler Nora. Özeti hazırlamak için yeterli zamanım olsun diye sonuçlarını çarşamba öğlene kadar bana gönder lütfen.",
    ],
    [
      "Das schaffe ich, wenn ich die neue Tabelle heute bekomme. In der alten Datei fehlen die Daten vom Wochenende.",
      "Yeni tabloyu bugün alırsam yetiştiririm. Eski dosyada hafta sonunun verileri eksik.",
    ],
    [
      "Ich habe die Tabelle schon aktualisiert. Du findest sie im gemeinsamen Ordner unter dem heutigen Datum.",
      "Tabloyu zaten güncelledim. Ortak klasörde bugünün tarihi altında bulabilirsin.",
    ],
    [
      "Eine Sache ist noch unklar: Wer informiert die Kundin, falls wir später liefern müssen?",
      "Bir şey hâlâ belirsiz: Daha geç teslim etmemiz gerekirse müşteriyi kim bilgilendirecek?",
    ],
    [
      "Das übernehme ich. Aber wir melden uns nur, wenn sich der Termin wirklich ändert.",
      "Bunu ben üstlenirim. Ama yalnızca tarih gerçekten değişirse haber vereceğiz.",
    ],
    [
      "Nach der Pause prüfen wir gemeinsam, ob alle Angaben verständlich sind. Fachbegriffe erklären wir in einfachen Worten.",
      "Moladan sonra bütün bilgilerin anlaşılır olup olmadığını birlikte kontrol edeceğiz. Teknik terimleri basit sözcüklerle açıklayacağız.",
    ],
    [
      "Bitte dokumentiert auch offene Fragen. Sonst müssen wir beim nächsten Treffen wieder von vorn anfangen.",
      "Lütfen açık kalan soruları da kaydedin. Yoksa sonraki toplantıda yeniden baştan başlamak zorunda kalırız.",
    ],
    [
      "Einverstanden. Ich schicke nachher eine kurze Nachricht mit den Aufgaben und Fristen an das ganze Team.",
      "Anlaştık. Birazdan bütün ekibe görevleri ve süreleri içeren kısa bir mesaj göndereceğim.",
    ],
  ],
  [
    [
      "Raporun tamamlanma günü hangisi?",
      "Perşembe",
      "Çarşamba öğle",
      "Salı",
      "Perşembe nihai teslim günüdür. Çarşamba öğle ise Nora’nın ara sonuçları için belirlenen süredir.",
    ],
    [
      "Nora hangi görevi üstleniyor?",
      "Sayıları kontrol etmek",
      "Müşteriye telefon etmek",
      "Teknik terimleri çevirmek",
      "“die Zahlen prüfen” sayıları kontrol etmek demektir. Müşteriyle iletişim görevini başka bir konuşmacı üstleniyor.",
    ],
    [
      "“obwohl” hangi ilişkiyi kuruyor?",
      "Bir engele rağmen görevi yapabilme",
      "Görevi yapmanın amacı",
      "Kesin bir zaman sırası",
      "“obwohl” karşıtlık bildirir: Eğitim var, buna rağmen kontrol yapılabilir. Yan cümlede çekimli fiil sona gider.",
    ],
    [
      "Sonuçların çarşamba öğlene kadar istenmesinin amacı ne?",
      "Özet için yeterli zaman bırakmak",
      "Salı eğitimini iptal etmek",
      "Müşteriyi bekletmek",
      "“damit ich genug Zeit ... habe” amaç bildirir. Sonuçları gönderen kişi ile özeti hazırlayan kişi farklıdır.",
    ],
    [
      "Nora’nın yetiştirme koşulu hangisi?",
      "Yeni tabloyu bugün alması",
      "Müşterinin araması",
      "Perşembe tatil olması",
      "“wenn ich die neue Tabelle heute bekomme” koşuldur. “wenn” burada “eğer” diye anlaşılır.",
    ],
    [
      "Güncel tablo nerede?",
      "Ortak klasörde, bugünün tarihi altında.",
      "Eski e-postada.",
      "Nora’nın eğitim dosyasında.",
      "“gemeinsamen Ordner” ortak klasör; “unter dem heutigen Datum” dosyayı bulmayı sağlayan ayrıntıdır.",
    ],
    [
      "Müşteriye ne zaman haber verilecek?",
      "Tarih gerçekten değişirse.",
      "Her toplantıdan önce.",
      "Koşulsuz olarak hemen.",
      "“nur, wenn” yalnızca belirli koşul gerçekleşirse demektir; kesin bir gecikme ilan edilmemiştir.",
    ],
    [
      "Açık sorular neden kaydediliyor?",
      "Sonraki toplantıda başa dönmemek için.",
      "Görevleri tamamen bırakmak için.",
      "Müşteriyi suçlamak için.",
      "“Sonst” olumsuz sonucu haber verir: Aksi takdirde aynı işi yeniden yapmak gerekir.",
    ],
  ],
);
episode(
  "B2",
  "Röportajlar",
  "Wem gehört der öffentliche Raum?",
  "culture",
  "Bir röportajda görüş ile kanıtı ayır; karşı sav, koşullu destek ve sınırlamaları sekiz soruyla değerlendir.",
  [
    [
      "In unserer Stadt wird darüber diskutiert, ob eine Straße am Wochenende für Autos gesperrt werden soll.",
      "Şehrimizde bir caddenin hafta sonunda otomobillere kapatılıp kapatılmaması tartışılıyor.",
    ],
    [
      "Frau Berger, Sie führen dort ein Geschäft. Welche Folgen erwarten Sie von dem geplanten Versuch?",
      "Bayan Berger, orada bir işletmeniz var. Planlanan denemeden nasıl sonuçlar bekliyorsunuz?",
    ],
    [
      "Zunächst war ich skeptisch, weil manche Kundinnen und Kunden auf das Auto angewiesen sind.",
      "Başlangıçta kuşkucuydum; çünkü bazı müşteriler otomobile bağımlı.",
    ],
    [
      "Inzwischen halte ich den Versuch für sinnvoll, sofern die Lieferungen am Morgen weiterhin möglich bleiben.",
      "Sabah teslimatları mümkün olmaya devam ettiği takdirde artık bu denemeyi anlamlı buluyorum.",
    ],
    [
      "Die Stadt verweist auf eine Befragung. Die Mehrheit der Befragten wünscht sich mehr Platz zum Sitzen und Spielen.",
      "Belediye bir ankete işaret ediyor. Ankete katılanların çoğunluğu oturmak ve oynamak için daha çok alan istiyor.",
    ],
    [
      "Das ist ein wichtiges Signal, aber noch kein Beleg dafür, dass der Umsatz steigen wird.",
      "Bu önemli bir işaret; ancak cironun artacağının henüz bir kanıtı değil.",
    ],
    [
      "Deshalb sollten während des Versuchs sowohl die Besucherzahlen als auch die Erfahrungen der Anwohnenden erfasst werden.",
      "Bu nedenle deneme sırasında hem ziyaretçi sayıları hem de çevrede yaşayanların deneyimleri kaydedilmeli.",
    ],
    [
      "Ein Nachbar befürchtet, dass der Verkehr nur in die nächste Straße verlagert wird. Diese Sorge darf man nicht übergehen.",
      "Bir komşu, trafiğin yalnızca yan caddeye kaydırılmasından kaygı duyuyor. Bu kaygı göz ardı edilmemeli.",
    ],
    [
      "Nach einer kurzen Pause fügt Frau Berger hinzu: Eine Entscheidung wäre überzeugender, wenn die Kriterien vorher öffentlich wären.",
      "Kısa bir moladan sonra Bayan Berger ekliyor: Ölçütler önceden kamuya açıklansaydı karar daha ikna edici olurdu.",
    ],
    [
      "Der Versuch ist auf drei Monate begrenzt. Erst danach soll über eine dauerhafte Regelung entschieden werden.",
      "Deneme üç ayla sınırlı. Kalıcı bir düzenleme hakkında ancak bundan sonra karar verilmesi planlanıyor.",
    ],
  ],
  [
    [
      "Röportajın konusu nedir?",
      "Hafta sonunda bir caddenin araçlara kapatılması denemesi",
      "Bütün şehirde otomobillerin yasaklanması",
      "Mağazaların süresiz kapatılması",
      "Öneri bir caddeyi ve hafta sonunu kapsar. Yer ve zaman sınırlarını genişleterek yorumlamamak gerekir.",
    ],
    [
      "Berger’in ilk tutumu neydi?",
      "Bazı müşterilerin otomobile ihtiyacı olduğu için kuşkuluydu.",
      "Kanıt olmadan kesin destek veriyordu.",
      "Konudan haberi yoktu.",
      "“Zunächst war ich skeptisch” ilk tutumu, “inzwischen” ise sonradan değişen değerlendirmeyi gösterir.",
    ],
    [
      "Berger hangi koşulla destek veriyor?",
      "Sabah teslimatlarının sürmesi koşuluyla.",
      "Bütün teslimatlar yasaklanırsa.",
      "Anket iptal edilirse.",
      "“sofern” resmî dilde koşul bildirir. Burada desteğin sınırını açıklar.",
    ],
    [
      "Anket neyi gösteriyor?",
      "Katılımcı çoğunluğun daha fazla ortak alan istediğini.",
      "Cironun kesin artacağını.",
      "Bütün kent halkının aynı fikirde olduğunu.",
      "Anket bir tercih bildiriyor. Bu sonuçtan ekonomik artış ya da herkesin görüşü otomatik olarak çıkarılamaz.",
    ],
    [
      "Hangi iki veri birlikte toplanmalı?",
      "Ziyaretçi sayıları ve çevre sakinlerinin deneyimleri",
      "Yalnızca sosyal medya beğenileri",
      "Hava sıcaklığı ve ürün renkleri",
      "“sowohl ... als auch” iki unsuru aynı ağırlıkla bağlar: Hem nicel hem deneyime dayalı bilgi isteniyor.",
    ],
    [
      "Komşunun kaygısı ne?",
      "Trafiğin yakındaki caddeye kayması",
      "Caddeye hiç yaya gelmemesi",
      "Sabah teslimatlarının artması",
      "“verlagern” bir sorunun başka yere taşınmasını anlatır; trafiğin ortadan kalktığı söylenmiyor.",
    ],
    [
      "Kararı daha ikna edici kılacak unsur hangisi?",
      "Ölçütlerin önceden açıklanması",
      "Ölçütlerin sonuçtan sonra seçilmesi",
      "Denemenin hiç ölçülmemesi",
      "“wäre ... wenn ... wären” Konjunktiv II ile bir iyileştirme önerir; mevcut durum hakkında kesin bir suçlama yapmaz.",
    ],
    [
      "Kalıcı karar ne zaman verilecek?",
      "Üç aylık denemeden sonra.",
      "Röportajdan önce.",
      "İlk sabah kesinleşmiş.",
      "“Erst danach” ancak ondan sonra demektir. Deneme ile kalıcı uygulama farklı aşamalardır.",
    ],
  ],
);
episode(
  "C1",
  "Akademik tartışmalar",
  "Was Zahlen tatsächlich erklären",
  "education",
  "Bir araştırma sunumunda yöntem, sınırlılık, nedensellik ve ihtiyatlı sonuç çıkarımını incele. Sekiz gerekçeli soru içerir.",
  [
    [
      "Unsere Untersuchung befasst sich mit der Frage, inwiefern regelmäßige Lesepausen das Textverständnis unterstützen können.",
      "Araştırmamız, düzenli okuma molalarının metni anlamayı ne ölçüde destekleyebileceği sorusunu ele alıyor.",
    ],
    [
      "An der Studie nahmen sechzig Freiwillige teil, die sich nach einer Nachricht im Hochschulverteiler gemeldet hatten.",
      "Çalışmaya, üniversitenin duyuru listesindeki bir mesaj üzerine başvuran altmış gönüllü katıldı.",
    ],
    [
      "Die eine Gruppe legte nach jeweils zwanzig Minuten eine kurze Pause ein, während die andere ohne Unterbrechung las.",
      "Bir grup her yirmi dakikadan sonra kısa bir mola verirken diğer grup kesintisiz okudu.",
    ],
    [
      "Im anschließenden Test schnitt die erste Gruppe im Durchschnitt besser ab; die Unterschiede waren jedoch nicht bei allen Textsorten gleich groß.",
      "Sonraki testte ilk grup ortalamada daha iyi sonuç aldı; ancak fark bütün metin türlerinde aynı büyüklükte değildi.",
    ],
    [
      "Daraus lässt sich zunächst ein Zusammenhang ableiten, nicht aber die Behauptung, jede beliebige Pause steigere zwangsläufig die Leistung.",
      "Buradan başlangıç olarak bir ilişki çıkarılabilir; fakat her türlü molanın zorunlu olarak başarıyı artırdığı iddiası çıkarılamaz.",
    ],
    [
      "Da die Teilnehmenden freiwillig mitwirkten, ist nicht auszuschließen, dass besonders motivierte Personen überrepräsentiert waren.",
      "Katılımcılar gönüllü yer aldığından özellikle motive kişilerin gereğinden fazla temsil edilmiş olması dışlanamaz.",
    ],
    [
      "Hinzu kommt, dass wir lediglich die unmittelbare Leistung gemessen haben. Über langfristige Lernfortschritte sagen die Daten wenig aus.",
      "Üstelik yalnızca anlık başarıyı ölçtük. Veriler uzun vadeli öğrenme ilerlemesi hakkında pek bir şey söylemiyor.",
    ],
    [
      "Eine Kollegin fragt, ob der beobachtete Unterschied auch auf die Schwierigkeit der Texte zurückzuführen sein könnte.",
      "Bir meslektaş, gözlenen farkın metinlerin zorluğundan da kaynaklanıp kaynaklanamayacağını soruyor.",
    ],
    [
      "Dieser Einwand ist berechtigt. In einer Folgestudie wollen wir Textschwierigkeit und Vorwissen systematischer berücksichtigen.",
      "Bu itiraz yerinde. Sonraki bir çalışmada metin zorluğunu ve ön bilgiyi daha sistematik biçimde dikkate almak istiyoruz.",
    ],
    [
      "Unsere Empfehlung lautet daher, Pausen bewusst auszuprobieren und ihre Wirkung zu beobachten, statt eine allgemeingültige Regel zu verkünden.",
      "Bu nedenle önerimiz, evrensel bir kural ilan etmek yerine molaları bilinçli biçimde deneyip etkilerini gözlemlemektir.",
    ],
  ],
  [
    [
      "Araştırmanın temel sorusu hangisi?",
      "Okuma molalarının anlamayı ne ölçüde destekleyebildiği",
      "Her metnin aynı zorlukta olup olmadığı",
      "Gönüllülerin hangi şehirde yaşadığı",
      "“inwiefern” ölçü ve kapsam sorgular. Sunum mutlak bir yarar iddiasıyla başlamıyor.",
    ],
    [
      "Örneklemle ilgili sınırlılık nedir?",
      "Gönüllülük nedeniyle motivasyonu yüksek kişiler fazla temsil edilmiş olabilir.",
      "Hiç kimse çalışmaya katılmamıştır.",
      "Bütün toplum rastgele seçilmiştir.",
      "“nicht auszuschließen” ihtimali dışlamamaktır. Seçim yanlılığı ihtimali belirtiliyor; kesinleşmiş bir kusur olarak sunulmuyor.",
    ],
    [
      "İlk grup ne yapmıştır?",
      "Her yirmi dakikada kısa mola vermiştir.",
      "Yalnızca hafta sonunda okumuştur.",
      "Hiç mola vermemiştir.",
      "“nach jeweils zwanzig Minuten” tekrarlanan bir zaman düzenidir. “jeweils” her defasında anlamını ekler.",
    ],
    [
      "Sonuçların kapsamı hangisi?",
      "Ortalama fark var; metin türleri arasında farkın büyüklüğü değişiyor.",
      "Her katılımcı aynı puanı almıştır.",
      "Her metinde fark eşittir.",
      "“im Durchschnitt” bireysel sonuçların hepsine ilişkin değildir; “jedoch” genellemeyi sınırlayan karşı noktayı getirir.",
    ],
    [
      "Konuşmacı hangi çıkarımı reddediyor?",
      "Her türlü molanın zorunlu olarak başarıyı artıracağını.",
      "Gruplar arasında ortalama fark bulunduğunu.",
      "Yeni araştırma yapılabileceğini.",
      "“nicht aber” çıkarımın sınırını çizer. “zwangsläufig” kaçınılmazlık anlamı taşıdığı için iddiayı gereğinden fazla güçlendirir.",
    ],
    [
      "Veriler neyi yeterince açıklamıyor?",
      "Uzun vadeli öğrenme ilerlemesini",
      "Anlık testteki ortalama sonucu",
      "Katılımcı sayısını",
      "“lediglich” yalnızca demektir. Ölçüm anlık başarıyla sınırlı olduğundan uzun vadeli etkiyi kanıtlamaz.",
    ],
    [
      "Meslektaşın itirazına verilen tepki hangisi?",
      "Yerinde bulunup yeni çalışmanın tasarımına katılıyor.",
      "Kişisel saldırı sayılıp reddediliyor.",
      "Sonuçlar gizleniyor.",
      "“berechtigt” haklı/yerinde anlamındadır. Yanıt, yöntemin geliştirilmesine açık bir bilimsel tutum sergiler.",
    ],
    [
      "Son önerinin tonu nasıl?",
      "Denemeye ve gözleme dayalı, ihtiyatlı.",
      "Her öğrenci için tartışmasız bir emir.",
      "Molaların kesin olarak yasaklanması.",
      "“statt ... zu” iki yaklaşımı karşılaştırır: Gözlem önerilir, evrensel kural ilan etmekten kaçınılır.",
    ],
  ],
);
episode(
  "C2",
  "İnce ayrımlı tartışmalar",
  "Ein Kompromiss, der Fragen offenlässt",
  "conversation",
  "İma, ironi, ödün ve söylem sınırlarını dinle. Kesin bilgi ile yorumun derecesini sekiz açıklamalı soruyla ayır.",
  [
    [
      "Wenn ich die Stellungnahme richtig lese, ist man sich nun also einig, dass Einigkeit vorerst nicht zu erzielen ist.",
      "Açıklamayı doğru okuyorsam artık şunda anlaşılmış: Şimdilik anlaşmaya varılamayacağında.",
    ],
    [
      "Das klingt spöttischer, als ich es meine. Immerhin hat die Kommission offengelegt, woran die Verhandlungen bislang gescheitert sind.",
      "Söylediğim, kastettiğimden daha alaycı duyuluyor. Ne de olsa komisyon, müzakerelerin bugüne kadar neden başarısız kaldığını açıkça ortaya koydu.",
    ],
    [
      "Gewiss, Transparenz ist kein geringer Gewinn. Nur sollte man sie nicht schon mit einer Lösung verwechseln.",
      "Elbette, şeffaflık küçümsenecek bir kazanım değil. Yalnız onu şimdiden çözümle karıştırmamak gerekir.",
    ],
    [
      "Der Vorschlag, die strittige Regelung probeweise auszusetzen, ließe sich als pragmatischer Zwischenschritt verstehen.",
      "Tartışmalı düzenlemeyi deneme amacıyla askıya alma önerisi, pragmatik bir ara adım olarak yorumlanabilir.",
    ],
    [
      "Vorausgesetzt allerdings, dass aus dem Provisorium nicht durch bloßes Nichtstun ein Dauerzustand wird.",
      "Ancak geçici düzenlemenin sırf hiçbir şey yapılmadığı için kalıcı duruma dönüşmemesi koşuluyla.",
    ],
    [
      "Sie unterstellen damit keine böse Absicht, sondern verweisen auf die Eigendynamik institutioneller Entscheidungen, wenn ich Sie recht verstehe.",
      "Sizi doğru anlıyorsam kötü niyet isnat etmiyor, kurumsal kararların kendi dinamiğine işaret ediyorsunuz.",
    ],
    [
      "Genau. Die Nachricht, man habe eine Frist vereinbart, beruhigt mich nur dann, wenn auch feststeht, wer ihre Einhaltung überprüft.",
      "Aynen öyle. Bir süre üzerinde anlaşılmış olduğu haberi, ancak buna uyulmasını kimin denetleyeceği de belliyse beni rahatlatır.",
    ],
    [
      "Nach einer Pause erwidert ihre Gesprächspartnerin: Man könnte einwenden, eine zusätzliche Kontrolle schaffe bloß neue Bürokratie.",
      "Bir moladan sonra karşısındaki kişi yanıtlıyor: Ek denetimin yalnızca yeni bürokrasi yarattığı itirazı ileri sürülebilir.",
    ],
    [
      "Der Einwand ist nicht von der Hand zu weisen; gleichwohl wäre ein klar benannter Auftrag weniger aufwendig als ein dauerhaft ungeklärter Konflikt.",
      "Bu itiraz kolayca bir kenara atılamaz; bununla birlikte açıkça tanımlanmış bir görev, sürekli çözümsüz kalan bir çatışmadan daha az zahmetli olurdu.",
    ],
    [
      "Wir hätten also keinen Schlussstrich gezogen, wohl aber einen überprüfbaren nächsten Schritt vereinbart. Mehr behaupte ich nicht.",
      "Yani konuyu tümüyle kapatmış olmazdık; fakat denetlenebilir bir sonraki adım üzerinde anlaşmış olurduk. Bundan fazlasını iddia etmiyorum.",
    ],
  ],
  [
    [
      "Açılıştaki ironi nereden doğuyor?",
      "Anlaşmazlık üzerinde anlaşmayı bir uzlaşma gibi sunmaktan.",
      "Komisyonun varlığını inkâr etmekten.",
      "Herkesin aynı çözümü desteklemesinden.",
      "“einig ... dass Einigkeit ... nicht” sözcük karşıtlığı ironiyi kurar. Bu, somut çözüm sağlandığı anlamına gelmez.",
    ],
    [
      "Konuşmacı alaycı tonunu neden açıklıyor?",
      "Eleştirisinin komisyonun şeffaflık katkısını yok saymadığını göstermek için.",
      "Bütün önceki sözlerini geri almak için.",
      "Komisyonu kötü niyetle suçlamak için.",
      "“Immerhin” sınırlı da olsa olumlu bir noktayı teslim eder. Sonraki eleştiri bu katkıyı tamamen geçersiz kılmaz.",
    ],
    [
      "“kein geringer Gewinn” hangi etkiyi yaratıyor?",
      "Olumsuzlama yoluyla kayda değer bir kazanımı vurguluyor.",
      "Hiç kazanım olmadığını söylüyor.",
      "Kazanımın parasal tutarını veriyor.",
      "Bu bir litotes örneğidir: Küçük bir kazanım değil demek, önemini dolaylı biçimde vurgular.",
    ],
    [
      "Geçici askıya alma hangi koşulla kabul edilebilir?",
      "Eylemsizlik yüzünden kalıcı hâle gelmezse.",
      "Hiç kimse tekrar değerlendirmezse.",
      "Denetim görevi gizli tutulursa.",
      "“Vorausgesetzt ... dass” koşulu belirtir. Kaygı, geçici çözümün denetimsiz biçimde kalıcılaşmasıdır.",
    ],
    [
      "“man habe eine Frist vereinbart” neyi işaretliyor?",
      "Başkasından aktarılan bir bilgiyi.",
      "Konuşmacının kendi kesin gözlemini.",
      "Geçmişte hiç anlaşma yapılmadığını.",
      "“habe ... vereinbart” Konjunktiv I ile aktarım yapar. Tek başına yalanlama değildir; bilgi kaynağıyla mesafe kurar.",
    ],
    [
      "“nicht von der Hand zu weisen” ne demek?",
      "Kolayca reddedilemeyecek",
      "Kesin olarak kanıtlanmış",
      "Konuyla tamamen ilgisiz",
      "Deyim itirazın dikkate değer olduğunu söyler; mutlaka üstün geldiğini ya da bütünüyle doğru olduğunu değil.",
    ],
    [
      "“gleichwohl” hangi ilişkiyi kuruyor?",
      "İtirazı kabul ettikten sonra karşı gerekçe sunuyor.",
      "Önceki itirazı açıklamasız siliyor.",
      "Zaman sırasını anlatıyor.",
      "“Bununla birlikte” anlamındaki bağlayıcı, ödünden sonra ana savı korur: Denetim görevi daha az yük getirebilir.",
    ],
    [
      "Son cümle hangi iddiayla sınırlı?",
      "Denetlenebilir bir sonraki adım üzerinde anlaşmakla.",
      "Bütün çatışmayı kalıcı olarak çözmekle.",
      "Bürokrasiyi tamamen kaldırmakla.",
      "“keinen Schlussstrich ... wohl aber” nihai kapanış ile somut ara adımı ayırır. “Mehr behaupte ich nicht” kapsamı özellikle sınırlar.",
    ],
  ],
);
write("src/data/listening/extra-episodes.json", listening);

const stories = [],
  glossary = [];
function word(word, article, meaning, plural, de, tr) {
  glossary.push({
    id: `story-extra-${glossary.length + 1}`,
    word,
    article,
    meaning,
    plural,
    de,
    tr,
    repository: false,
  });
}
word(
  "Hinweis",
  "der",
  "ipucu; uyarı",
  "Hinweise",
  "Der Hinweis führt uns zum Archiv.",
  "İpucu bizi arşive götürüyor.",
);
word(
  "Abwägung",
  "die",
  "seçenekleri tartma; değerlendirme",
  "Abwägungen",
  "Die Abwägung braucht Zeit.",
  "Seçenekleri tartmak zaman gerektirir.",
);
word(
  "Zeugnis",
  "das",
  "tanıklık; belge",
  "Zeugnisse",
  "Dieses Zeugnis ergänzt die Akte.",
  "Bu tanıklık dosyayı tamamlıyor.",
);
word(
  "Deutung",
  "die",
  "yorum; anlamlandırma",
  "Deutungen",
  "Diese Deutung bleibt vorläufig.",
  "Bu yorum geçici kalıyor.",
);
const choice = (de, tr, to) => ({ id: to, de, tr, to });
function scene(
  id,
  title,
  art,
  pairs,
  lemma,
  prompt,
  answer,
  wrong,
  explanation,
  choices = [],
  ending,
) {
  return {
    id,
    title,
    art,
    lines: pairs.map(([de, tr]) => ({ de, tr })),
    words: [lemma],
    choices,
    ...(ending ? { ending } : {}),
    question: {
      prompt,
      options: [answer, ...wrong],
      correct: answer,
      explanation,
    },
  };
}
function story(
  id,
  title,
  germanTitle,
  level,
  category,
  art,
  minutes,
  description,
  scenes,
) {
  stories.push({
    id,
    title,
    germanTitle,
    level,
    category,
    art,
    minutes,
    description,
    start: "start",
    scenes,
  });
}
story(
  "story-b1-briefe",
  "Bir Mektubun İzinde",
  "Der Brief ohne Absender",
  "B1",
  "mystery",
  "town",
  9,
  "Bir kütüphanede bulunan mektubun sahibini araştır. Gerekçe bildirerek seçim yap; dört farklı sonucu keşfet.",
  [
    scene(
      "start",
      "Kitabın arasındaki mektup",
      "town",
      [
        [
          "Als Elif ein altes Buch aus der Stadtbibliothek öffnet, fällt ein Brief heraus. Auf dem Umschlag steht kein Name.",
          "Elif şehir kütüphanesinden aldığı eski bir kitabı açınca içinden bir mektup düşer. Zarfın üzerinde isim yoktur.",
        ],
        [
          "Im Brief bedankt sich jemand für Hilfe beim Deutschlernen. Unten steht nur: Bis Freitag am roten Tor.",
          "Mektupta biri Almanca öğrenirken aldığı yardım için teşekkür eder. Altta yalnızca şu yazılıdır: Cuma günü kırmızı kapıda görüşürüz.",
        ],
        [
          "Ein Hinweis auf der Rückseite nennt die Gartengruppe der Bibliothek. Elif möchte den Brief zurückgeben, ohne ihn öffentlich zu zeigen.",
          "Arkadaki bir ipucu kütüphanenin bahçe grubundan söz eder. Elif, mektubu herkese göstermeden geri vermek ister.",
        ],
        [
          "Sie kann zuerst die Bibliothekarin fragen oder am Freitag direkt zum Gartentor gehen. Beide Wege brauchen Geduld.",
          "Önce kütüphaneciye sorabilir ya da cuma günü doğrudan bahçe kapısına gidebilir. Her iki yol da sabır gerektirir.",
        ],
      ],
      "Hinweis",
      "Elif’in amacı nedir?",
      "Mektubu özel tutarak sahibine ulaştırmak.",
      ["Mektubu internette yayımlamak.", "Kitabı satmak."],
      "“ohne ihn öffentlich zu zeigen” mahremiyeti koruma niyetini açıklar. İpucu kesin kimlik bilgisi değildir.",
      [
        choice(
          "Ich frage zuerst in der Bibliothek nach.",
          "Önce kütüphaneye sorarım.",
          "library",
        ),
        choice(
          "Ich gehe am Freitag zum Gartentor.",
          "Cuma günü bahçe kapısına giderim.",
          "gate",
        ),
      ],
    ),
    scene(
      "library",
      "Kayıt ve izin",
      "town",
      [
        [
          "Die Bibliothekarin hört Elif zu, nennt aber keine Namen aus der Ausleihliste. Diese Daten sind privat.",
          "Kütüphaneci Elif’i dinler ama ödünç listesindeki isimleri söylemez. Bu bilgiler özeldir.",
        ],
        [
          "Sie schlägt vor, eine Nachricht an die Gartengruppe weiterzuleiten. Die Person kann sich dann selbst melden.",
          "Bahçe grubuna bir mesaj iletmeyi önerir. Böylece ilgili kişi kendisi haber verebilir.",
        ],
        [
          "Ein Hinweis wäre die Zeichnung auf dem Umschlag: eine kleine blaue Blume. Elif muss nicht den ganzen Text teilen.",
          "Bir ipucu, zarfın üzerindeki küçük mavi çiçek çizimi olabilir. Elif’in bütün metni paylaşması gerekmez.",
        ],
        [
          "Elif überlegt, ob sie die Nachricht weiterleiten lässt oder den Brief sicher im Fundbüro abgibt.",
          "Elif, mesajı ilettirmeyi mi yoksa mektubu güvenli biçimde kayıp eşya bürosuna bırakmayı mı seçeceğini düşünür.",
        ],
      ],
      "Hinweis",
      "Kütüphaneci neden isim vermiyor?",
      "Ödünç alma bilgileri özel olduğu için.",
      ["Hiç kimse kitap almadığı için.", "Elif’i tanımadığı için."],
      "Kayıtların özel olması açık gerekçedir; yardım etmek için bilgileri açıklamak zorunlu değildir.",
      [
        choice(
          "Bitte leiten Sie meine Nachricht weiter.",
          "Lütfen mesajımı iletin.",
          "reunited",
        ),
        choice(
          "Ich gebe den Brief im Fundbüro ab.",
          "Mektubu kayıp eşya bürosuna bırakırım.",
          "safe",
        ),
      ],
    ),
    scene(
      "gate",
      "Kırmızı kapıda",
      "garden",
      [
        [
          "Am Freitag trifft Elif vor dem Garten zwei Menschen, die auf die Gruppe warten. Sie fragt nur nach der blauen Blume.",
          "Cuma günü Elif bahçenin önünde grubu bekleyen iki kişiyle karşılaşır. Yalnızca mavi çiçeği sorar.",
        ],
        [
          "Eine Frau erkennt die Zeichnung, kennt aber den Brief nicht. Ein Mann meint, seine Schwester habe früher solche Blumen gemalt.",
          "Bir kadın çizimi tanır ama mektubu bilmez. Bir adam, kız kardeşinin eskiden böyle çiçekler çizdiğini söyler.",
        ],
        [
          "Dieser Hinweis ist interessant, aber kein Beweis. Elif möchte den Brief nicht einfach einer fremden Person geben.",
          "Bu ipucu ilginçtir ama kanıt değildir. Elif mektubu tanımadığı birine öylece vermek istemez.",
        ],
        [
          "Sie kann nach einem weiteren Merkmal fragen oder einen Kontaktzettel für die Gartengruppe hinterlassen.",
          "Başka bir ayırt edici özellik sorabilir ya da bahçe grubuna bir iletişim notu bırakabilir.",
        ],
      ],
      "Hinweis",
      "Çiçek çizimini tanımak neyi gösterir?",
      "Bir olasılık sunar ama sahipliği kanıtlamaz.",
      ["Mektubun kesinlikle adama ait olduğunu.", "Mektubun sahte olduğunu."],
      "“kein Beweis” ifadesi, ipucu ile kesin sonuç arasındaki farkı vurgular.",
      [
        choice("Welche Farbe hat das Papier?", "Kâğıt ne renk?", "confirmed"),
        choice(
          "Ich hinterlasse einen Kontaktzettel.",
          "Bir iletişim notu bırakırım.",
          "waiting",
        ),
      ],
    ),
    scene(
      "reunited",
      "İzinli buluşma",
      "garden",
      [
        [
          "Zwei Tage später meldet sich die Verfasserin bei der Bibliothek. Sie beschreibt die blaue Blume und das gelbe Papier.",
          "İki gün sonra mektubu yazan kişi kütüphaneye haber verir. Mavi çiçeği ve sarı kâğıdı tarif eder.",
        ],
        [
          "Der Hinweis passt. Bei einem vereinbarten Treffen erhält sie den Brief zurück und bedankt sich bei Elif.",
          "İpucu uyuşur. Önceden kararlaştırılan buluşmada mektubunu geri alır ve Elif’e teşekkür eder.",
        ],
        [
          "Sie hatte ihn vor vielen Jahren an ihre Deutschlehrerin geschrieben, aber nie abgeschickt.",
          "Mektubu yıllar önce Almanca öğretmenine yazmış ama hiç göndermemiştir.",
        ],
        [
          "Jetzt möchte sie die Lehrerin selbst suchen. Elif freut sich, geholfen zu haben, ohne fremde Namen zu veröffentlichen.",
          "Şimdi öğretmeni kendisi aramak ister. Elif başkalarının isimlerini yayımlamadan yardımcı olduğuna sevinir.",
        ],
      ],
      "Hinweis",
      "Kimliği doğrulamaya ne yardımcı olur?",
      "Çiçek ile kâğıdın birlikte tarif edilmesi.",
      ["Yalnızca mektubu istemek.", "Herkesin adını yayımlamak."],
      "Birden fazla ayrıntının uyuşması güveni artırır. İletişim, kütüphane aracılığıyla ve izinle kurulmuştur.",
      [],
      "Mektup sahibine ulaştı",
    ),
    scene(
      "safe",
      "Güvenli bekleyiş",
      "town",
      [
        [
          "Im Fundbüro wird der Brief in einer geschlossenen Mappe aufbewahrt. Elif bekommt eine Nummer für spätere Fragen.",
          "Mektup kayıp eşya bürosunda kapalı bir dosyada saklanır. Elif sonraki sorular için bir numara alır.",
        ],
        [
          "Der Hinweis auf die blaue Blume steht in der Beschreibung, der private Text bleibt verborgen.",
          "Mavi çiçek ipucu açıklamada yer alır; özel metin gizli kalır.",
        ],
        [
          "Noch hat sich niemand gemeldet. Das bedeutet nicht, dass der Weg falsch war; manche Suche dauert länger.",
          "Henüz kimse haber vermemiştir. Bu, izlenen yolun yanlış olduğu anlamına gelmez; bazı arayışlar daha uzun sürer.",
        ],
        [
          "Elif kann später nachfragen. Für heute weiß sie, dass der Brief nicht verloren geht.",
          "Elif daha sonra sorabilir. Bugün için mektubun kaybolmayacağını bilir.",
        ],
      ],
      "Hinweis",
      "Bu sonun kesin sonucu nedir?",
      "Mektup güvenli biçimde korunuyor.",
      ["Sahibi kesin olarak bulundu.", "Mektup yok edildi."],
      "Anlatı, sahipliğin çözüldüğünü söylemiyor. Güvenli saklama ile aramanın tamamlanmasını ayır.",
      [],
      "Mektup korumaya alındı",
    ),
    scene(
      "confirmed",
      "İkinci ayrıntı",
      "garden",
      [
        [
          "Der Mann ruft seine Schwester an, ohne ihr den Brieftext vorzulesen. Sie erinnert sich an das gelbe Papier.",
          "Adam, mektubun metnini okumadan kız kardeşini arar. Kız kardeşi sarı kâğıdı hatırlar.",
        ],
        [
          "Als weiteren Hinweis nennt sie einen kleinen Riss an der Ecke. Elif findet genau diesen Riss.",
          "Başka bir ipucu olarak köşedeki küçük yırtıktan söz eder. Elif tam bu yırtığı bulur.",
        ],
        [
          "Sie verabreden die Übergabe in der Bibliothek. Dort kann die Schwester den Brief selbst abholen.",
          "Teslim için kütüphanede buluşmayı kararlaştırırlar. Kız kardeşi mektubu oradan kendisi alabilir.",
        ],
        [
          "Elif geht nach Hause. Aus einer Vermutung ist durch vorsichtiges Nachfragen eine sichere Begegnung geworden.",
          "Elif eve gider. Dikkatli sorular sayesinde bir tahmin güvenli bir buluşmaya dönüşmüştür.",
        ],
      ],
      "Hinweis",
      "Ek ayrıntı neden önemli?",
      "Yalnızca çizimi tanımaktan daha güçlü doğrulama sağlıyor.",
      [
        "Kâğıdın parasal değerini artırıyor.",
        "Mektubun yayımlanmasını zorunlu kılıyor.",
      ],
      "Köşedeki yırtık, paylaşılmamış bir ayrıntıdır; salt tahmini destekleyen ek bilgi sağlar.",
      [],
      "Doğrulanmış teslim",
    ),
    scene(
      "waiting",
      "Açık kalan iz",
      "garden",
      [
        [
          "Elif hinterlässt eine Kontaktmöglichkeit bei der Gruppenleitung. Der Brief bleibt zunächst bei ihr.",
          "Elif grup yöneticisine bir iletişim yolu bırakır. Mektup şimdilik kendisinde kalır.",
        ],
        [
          "Der Hinweis wird nur innerhalb der Gruppe weitergegeben. Niemand veröffentlicht den persönlichen Inhalt.",
          "İpucu yalnızca grup içinde paylaşılır. Kimse kişisel içeriği yayımlamaz.",
        ],
        [
          "Eine Woche später gibt es noch keine Antwort. Elif beschließt, den Brief danach ins Fundbüro zu bringen.",
          "Bir hafta sonra hâlâ yanıt yoktur. Elif bundan sonra mektubu kayıp eşya bürosuna götürmeye karar verir.",
        ],
        [
          "Nicht jede Geschichte endet sofort mit einer Lösung. Manchmal ist ein guter nächster Schritt schon ein Anfang.",
          "Her hikâye hemen çözümle bitmez. Bazen iyi bir sonraki adım bile başlangıçtır.",
        ],
      ],
      "Hinweis",
      "Yanıt gelmezse Elif ne yapacak?",
      "Mektubu kayıp eşya bürosuna götürecek.",
      ["Mektubu herkese okuyacak.", "Aramayı hiç başlatmayacak."],
      "“danach ... zu bringen” sonraki adımı belirtir; bu son çözülmemiş ama güvenli bir süreci anlatır.",
      [],
      "Arayış sürüyor",
    ),
  ],
);

// Later levels use distinct arguments and consequences, not cosmetic rewrites of the B1 plot.
story(
  "story-b2-entscheidung",
  "İki Yolun Arasında",
  "Ein Angebot mit Bedingungen",
  "B2",
  "work",
  "town",
  10,
  "Bir iş teklifinin hız, sorumluluk ve şeffaflık bakımından sonuçlarını tart. Dört farklı kararın bedelini ve kazanımını oku.",
  [
    scene(
      "start",
      "Cazip teklif",
      "town",
      [
        [
          "Mara erhält das Angebot, ein Kulturfestival zu leiten. Das Budget ist knapp, doch der Sponsor verspricht zusätzliche Mittel.",
          "Mara bir kültür festivalini yönetme teklifi alır. Bütçe dardır ama sponsor ek kaynak vaat eder.",
        ],
        [
          "Im Gegenzug möchte er sämtliche Programmpunkte vorab genehmigen. Im Vertrag wird dieses Recht nur beiläufig erwähnt.",
          "Karşılığında programın bütün maddelerini önceden onaylamak ister. Sözleşmede bu hak yalnızca üstünkörü anılır.",
        ],
        [
          "Die Abwägung fällt Mara schwer: Ohne Geld könnten kleine Gruppen nicht auftreten; mit der Klausel wäre ihre Freiheit eingeschränkt.",
          "Mara için değerlendirme zordur: Para olmadan küçük gruplar sahne alamayabilir; bu maddeyle de özgürlükleri kısıtlanacaktır.",
        ],
        [
          "Sie kann zunächst mit dem Sponsor verhandeln oder den Entwurf dem gesamten Team offenlegen. Noch ist nichts unterschrieben.",
          "Önce sponsorla pazarlık edebilir ya da taslağı bütün ekibe açıklayabilir. Henüz hiçbir şey imzalanmamıştır.",
        ],
      ],
      "Abwägung",
      "Temel çatışma nedir?",
      "Maddi destek ile programın bağımsızlığı arasındaki gerilim.",
      ["İki eşit salon arasında seçim.", "İmzalanmış sözleşmenin tarihi."],
      "Karşılık şartı, kaynak sorununu çözse bile içerik özgürlüğünü sınırlayabilir. Henüz bağlayıcı bir imza yok.",
      [
        choice(
          "Ich verhandle über die Klausel.",
          "Maddeyi görüşürüm.",
          "negotiate",
        ),
        choice(
          "Ich bespreche den Entwurf mit dem Team.",
          "Taslağı ekiple konuşurum.",
          "team",
        ),
      ],
    ),
    scene(
      "negotiate",
      "Şartların dili",
      "town",
      [
        [
          "Der Sponsor erklärt, er wolle lediglich Überraschungen vermeiden. Mara bittet ihn, diesen Wunsch genauer zu formulieren.",
          "Sponsor yalnızca sürprizleri önlemek istediğini söyler. Mara bu isteği daha açık ifade etmesini rica eder.",
        ],
        [
          "Nach längerer Abwägung bietet er an, sein Vetorecht auf rechtswidrige Inhalte zu beschränken und Entscheidungen schriftlich zu begründen.",
          "Uzun bir değerlendirmeden sonra veto hakkını hukuka aykırı içerikle sınırlamayı ve kararları yazılı gerekçelendirmeyi önerir.",
        ],
        [
          "Das wäre enger als der ursprüngliche Entwurf. Dennoch sollte eine unabhängige Beratung prüfen, ob die Formulierung tatsächlich eindeutig ist.",
          "Bu, ilk taslaktan daha dar olacaktır. Yine de ifadenin gerçekten açık olup olmadığını bağımsız bir danışman incelemelidir.",
        ],
        [
          "Mara kann die überarbeitete Fassung prüfen lassen oder auf die Förderung verzichten und das Festival verkleinern.",
          "Mara güncellenmiş metni inceletebilir ya da destekten vazgeçip festivali küçültebilir.",
        ],
      ],
      "Abwägung",
      "Yeni öneri ilk taslaktan nasıl farklı?",
      "Veto hakkını belirli içerikle sınırlıyor.",
      [
        "Veto hakkını bütün etkinliklere genişletiyor.",
        "Her koşulu ortadan kaldırıyor.",
      ],
      "“beschränken” sınırlamaktır. Metin daralsa da bağımsız inceleme ihtiyacının sürdüğü belirtiliyor.",
      [
        choice(
          "Ich lasse die neue Fassung prüfen.",
          "Yeni metni inceletirim.",
          "reviewed",
        ),
        choice(
          "Ich plane ein kleineres Festival ohne Sponsor.",
          "Sponsorsuz daha küçük festival planlarım.",
          "smaller",
        ),
      ],
    ),
    scene(
      "team",
      "Ortak karar",
      "garden",
      [
        [
          "Im Team gibt es keine einheitliche Meinung. Einige wollen die Chance nutzen, andere befürchten eine schleichende Einflussnahme.",
          "Ekipte ortak bir görüş yoktur. Bazıları fırsatı değerlendirmek ister, diğerleri yavaş yavaş artan bir müdahaleden kaygılanır.",
        ],
        [
          "Die Abwägung wird konkreter, als eine Kollegin die Kosten für jede Veranstaltung auflistet. Drei Projekte wären besonders gefährdet.",
          "Bir çalışma arkadaşı her etkinliğin maliyetini listeleyince değerlendirme somutlaşır. Özellikle üç proje risk altındadır.",
        ],
        [
          "Das Team kann alternative Unterstützung suchen. Dafür müsste es den Termin verschieben und offen über die Finanzierungslücke sprechen.",
          "Ekip alternatif destek arayabilir. Bunun için tarihi ertelemesi ve kaynak açığını açıkça konuşması gerekir.",
        ],
        [
          "Oder es könnte zunächst ein begrenztes Programm beschließen und die strittige Klausel ausdrücklich ablehnen.",
          "Ya da önce sınırlı bir program kararlaştırıp tartışmalı maddeyi açıkça reddedebilir.",
        ],
      ],
      "Abwägung",
      "Alternatif destek aramanın bedeli nedir?",
      "Erteleme ve kaynak açığını açıklama gereği.",
      [
        "Kesinlikle bütün projelerin iptali.",
        "Sponsorun koşullarını otomatik kabul.",
      ],
      "“Dafür müsste” seçeneğin gerektirdiği koşulu gösterir; sonuç kesin başarı ya da kesin iptal olarak sunulmuyor.",
      [
        choice(
          "Wir suchen weitere Unterstützende.",
          "Başka destekçiler ararız.",
          "collective",
        ),
        choice(
          "Wir beschließen ein begrenztes Programm.",
          "Sınırlı program kararlaştırırız.",
          "limited",
        ),
      ],
    ),
    scene(
      "reviewed",
      "Sınırlı sözleşme",
      "town",
      [
        [
          "Die Beratung empfiehlt eine klarere Beschwerdestelle und feste Antwortfristen. Der Sponsor akzeptiert beide Ergänzungen.",
          "Danışmanlık birimi daha açık bir itiraz mercii ve sabit yanıt süreleri önerir. Sponsor iki eklemeyi de kabul eder.",
        ],
        [
          "Erst danach stimmt das Team dem Vertrag zu. Die Abwägung hat Zeit gekostet, aber die Bedingungen sind nun nachvollziehbar.",
          "Ancak bundan sonra ekip sözleşmeyi kabul eder. Değerlendirme zaman almıştır ama şartlar artık anlaşılırdır.",
        ],
        [
          "Das Festival kann im geplanten Umfang stattfinden. Über die tatsächliche Zusammenarbeit wird das Team nach der Veranstaltung berichten.",
          "Festival planlanan ölçekte yapılabilir. Ekip, fiilî iş birliği hakkında etkinlikten sonra bilgi verecektir.",
        ],
        [
          "Mara nennt dies keinen Sieg über den Sponsor, sondern eine überprüfbare Vereinbarung mit verbleibender Verantwortung.",
          "Mara bunu sponsora karşı zafer değil, sorumluluğu devam eden ve denetlenebilir bir anlaşma olarak tanımlar.",
        ],
      ],
      "Abwägung",
      "Ekibin onayından önce ne oluyor?",
      "İtiraz mercii ve yanıt süreleri ekleniyor.",
      ["Bütün koşullar sözlü bırakılıyor.", "Etkinlik çoktan bitiyor."],
      "“Erst danach” onayın ön koşullar tamamlandıktan sonra verildiğini vurgular.",
      [],
      "Şartları açık iş birliği",
    ),
    scene(
      "smaller",
      "Küçük ama bağımsız",
      "garden",
      [
        [
          "Ohne Sponsor reicht das Budget nur für zwei Tage. Mara sagt den übrigen Gruppen nicht einfach ab, sondern erklärt die Entscheidung.",
          "Sponsorsuz bütçe yalnızca iki güne yeter. Mara diğer grupları açıklamasız geri çevirmez; kararını anlatır.",
        ],
        [
          "Einige sind enttäuscht. Die Abwägung löst den Geldmangel nicht, bewahrt aber die Freiheit des Programms.",
          "Bazıları hayal kırıklığına uğrar. Değerlendirme para açığını çözmez ama programın özgürlüğünü korur.",
        ],
        [
          "Die nicht berücksichtigten Gruppen werden für ein späteres Treffen eingeladen. Dafür gibt es noch keine feste Finanzierung.",
          "Programa alınamayan gruplar daha sonraki bir buluşmaya davet edilir. Bunun için henüz kesin kaynak yoktur.",
        ],
        [
          "Mara ist erleichtert und zugleich unzufrieden. Eine verantwortliche Entscheidung muss sich nicht vollkommen gut anfühlen.",
          "Mara hem rahatlamış hem de memnuniyetsizdir. Sorumlu bir kararın bütünüyle iyi hissettirmesi gerekmez.",
        ],
      ],
      "Abwägung",
      "Anlatı hangi bedeli açık tutuyor?",
      "Daha az grubun hemen sahne alabilmesini.",
      [
        "Bağımsızlığın kesin kaybedilmesini.",
        "Gelecek buluşmanın finansmanının garanti olmasını.",
      ],
      "Özgürlüğün korunması ekonomik sorunu sihirli biçimde çözmez; gelecek kaynak da garanti edilmez.",
      [],
      "Bağımsızlığın bedeli",
    ),
    scene(
      "collective",
      "Paylaşılan destek",
      "garden",
      [
        [
          "Das Team veröffentlicht einen sachlichen Finanzierungsplan und bittet mehrere lokale Vereine um Unterstützung.",
          "Ekip nesnel bir finansman planı yayımlar ve birkaç yerel dernekten destek ister.",
        ],
        [
          "Nach sechs Wochen sind die wichtigsten Kosten gedeckt. Die Abwägung hat allerdings eine Verschiebung um einen Monat nötig gemacht.",
          "Altı hafta sonra en önemli giderler karşılanır. Ancak değerlendirme bir aylık ertelemeyi gerekli kılmıştır.",
        ],
        [
          "Nicht alle ursprünglichen Gäste können am neuen Termin teilnehmen. Für sie wird eine spätere Zusammenarbeit geprüft.",
          "İlk konukların hepsi yeni tarihte katılamaz. Onlar için daha sonraki bir iş birliği değerlendirilir.",
        ],
        [
          "Die Finanzierung ist breiter verteilt. Mara weiß nun, dass auch ein gemeinsamer Erfolg konkrete Verluste enthalten kann.",
          "Finansman daha geniş bir tabana yayılmıştır. Mara artık ortak bir başarının da somut kayıplar içerebileceğini bilir.",
        ],
      ],
      "Abwägung",
      "Başarının yanında hangi sorun sürüyor?",
      "Yeni tarih bazı konuklara uymuyor.",
      ["Hiç kaynak bulunamadı.", "Program sponsora devredildi."],
      "En önemli giderlerin karşılanması bütün sorunların çözüldüğü anlamına gelmez; ertelemenin katılım bedeli vardır.",
      [],
      "Ortak ama gecikmiş başarı",
    ),
    scene(
      "limited",
      "Ölçülü başlangıç",
      "town",
      [
        [
          "Das Team wählt ein Programm, das mit den vorhandenen Mitteln sicher durchgeführt werden kann. Die Klausel wird nicht akzeptiert.",
          "Ekip mevcut kaynaklarla güvenle yapılabilecek bir program seçer. Madde kabul edilmez.",
        ],
        [
          "Der Sponsor zieht sein Angebot zurück. Für die Abwägung war diese Möglichkeit von Anfang an entscheidend gewesen.",
          "Sponsor teklifini geri çeker. Bu olasılık değerlendirmede baştan beri belirleyici olmuştur.",
        ],
        [
          "Zwei gefährdete Projekte finden Raum in einer kleineren Werkstatt. Das dritte muss warten; niemand verspricht einen ungesicherten Termin.",
          "Risk altındaki iki proje daha küçük bir atölyede yer bulur. Üçüncüsü beklemek zorundadır; kimse kesinleşmemiş tarih vaat etmez.",
        ],
        [
          "Mara dokumentiert die offenen Wünsche. Der Anfang bleibt kleiner als erhofft, aber seine Grenzen werden ehrlich benannt.",
          "Mara açık kalan istekleri kaydeder. Başlangıç umulandan küçüktür ama sınırları dürüstçe belirtilir.",
        ],
      ],
      "Abwägung",
      "Ekip nasıl bir söz vermekten kaçınıyor?",
      "Kaynağı ve tarihi kesin olmayan proje sözü.",
      ["Programın sınırlarını açıklamak.", "Mevcut bütçeyi gözetmek."],
      "“ungesichert” güvenceye alınmamış demektir; dürüst sınırlar güvenilirliğin parçasıdır.",
      [],
      "Dürüst sınırlar",
    ),
  ],
);
story(
  "story-c1-stadt",
  "Şehrin Hafızası",
  "Das Gedächtnis der Straße",
  "C1",
  "germany",
  "town",
  11,
  "Bir şehir arşivinde resmî kayıt ile kişisel tanıklığı karşılaştır. Temsil, izin ve yorum sorumluluğunu dört sonla araştır.",
  [
    scene(
      "start",
      "Eksik dosya",
      "town",
      [
        [
          "Für eine Ausstellung über ein abgerissenes Viertel soll Deniz eine chronologische Darstellung verfassen. Die Bauakten wirken zunächst lückenlos.",
          "Deniz’den yıkılmış bir mahalle hakkındaki sergi için kronolojik bir anlatım hazırlaması istenir. Yapı dosyaları ilk bakışta eksiksiz görünür.",
        ],
        [
          "Erst beim Vergleich mit privaten Fotos fällt auf, dass die offizielle Chronik den Wegzug mehrerer Familien kaum erwähnt.",
          "Ancak özel fotoğraflarla karşılaştırınca resmî tarihin bazı ailelerin taşınmasından neredeyse hiç söz etmediği fark edilir.",
        ],
        [
          "Ein mündliches Zeugnis könnte diese Leerstelle erhellen. Es wäre jedoch ebenso wenig neutral wie die behördliche Akte.",
          "Sözlü bir tanıklık bu boşluğu aydınlatabilir. Ancak o da resmî dosya kadar tarafsızlıktan uzak olabilir.",
        ],
        [
          "Deniz kann zunächst die Archivkriterien untersuchen oder ehemalige Bewohnerinnen um freiwillige Gespräche bitten.",
          "Deniz önce arşivin ölçütlerini inceleyebilir ya da eski sakinlerden gönüllü görüşmeler isteyebilir.",
        ],
      ],
      "Zeugnis",
      "Anlatının temel sorunu hangisi?",
      "Resmî kaydın bazı yaşam deneyimlerini görünmez bırakması.",
      [
        "Hiç resmî belge bulunmaması.",
        "Fotoğrafların kesinlikle sahte olması.",
      ],
      "Dosyaların düzenli olması kapsayıcılıklarını kanıtlamaz. Kişisel tanıklığın da otomatik olarak tarafsız olmadığı belirtiliyor.",
      [
        choice(
          "Ich untersuche die Auswahlkriterien des Archivs.",
          "Arşivin seçim ölçütlerini incelerim.",
          "archive",
        ),
        choice(
          "Ich bitte um freiwillige Gespräche.",
          "Gönüllü görüşmeler isterim.",
          "voices",
        ),
      ],
    ),
    scene(
      "archive",
      "Neyin kaydı tutulmuş?",
      "town",
      [
        [
          "Die damalige Verwaltung dokumentierte vor allem Genehmigungen und Eigentumsverhältnisse. Mieterwechsel gehörten nicht zum Auftrag dieser Sammlung.",
          "Dönemin yönetimi esas olarak izinleri ve mülkiyet ilişkilerini kaydetmiştir. Kiracı değişimleri bu koleksiyonun görevi kapsamında değildir.",
        ],
        [
          "Das erklärt die Leerstelle, entschuldigt aber keine Ausstellung, die den begrenzten Bestand als vollständige Stadtgeschichte ausgibt.",
          "Bu, boşluğu açıklar ama sınırlı koleksiyonu şehrin tam tarihi olarak sunan bir sergiyi haklı çıkarmaz.",
        ],
        [
          "Ein einzelnes Zeugnis aus einer späteren Befragung widerspricht zudem dem Datum in einer Bauakte. Beide Angaben haben unterschiedliche Entstehungsbedingungen.",
          "Sonraki bir görüşmeden gelen tek bir tanıklık ayrıca yapı dosyasındaki tarihle çelişir. İki bilgi farklı oluşum koşullarına sahiptir.",
        ],
        [
          "Deniz kann die Unsicherheit sichtbar machen oder die widersprüchliche Stelle bis zur weiteren Prüfung aus dem Haupttext nehmen.",
          "Deniz belirsizliği görünür kılabilir ya da çelişkili kısmı daha fazla inceleme yapılana kadar ana metinden çıkarabilir.",
        ],
      ],
      "Zeugnis",
      "Arşivdeki boşluğun açıklanması neyi gereksiz kılmaz?",
      "Sergide kaynağın sınırlarını belirtmeyi.",
      [
        "Dosyaların görev kapsamını anlamayı.",
        "Bütün tarihleri kesinlikle aynı saymayı.",
      ],
      "“erklärt ... entschuldigt aber” nedenin anlaşılması ile bugünkü sunum sorumluluğunu ayırır.",
      [
        choice(
          "Ich zeige beide Angaben mit ihrer Herkunft.",
          "İki bilgiyi kaynaklarıyla gösteririm.",
          "layers",
        ),
        choice(
          "Ich lasse die Passage vorläufig weg.",
          "Kısmı şimdilik çıkarırım.",
          "caution",
        ),
      ],
    ),
    scene(
      "voices",
      "Anlatmanın koşulları",
      "garden",
      [
        [
          "Eine frühere Bewohnerin ist zu einem Gespräch bereit, möchte jedoch weder ihren Namen noch familiäre Einzelheiten veröffentlicht sehen.",
          "Eski bir sakin görüşmeye hazırdır ama adının ya da aileye ilişkin ayrıntıların yayımlanmasını istemez.",
        ],
        [
          "Ihr Zeugnis schildert Nachbarschaft als Schutzraum, während ein anderer Bewohner dieselbe Enge als bedrückend erinnert.",
          "Onun tanıklığı komşuluğu koruyucu bir alan olarak anlatırken başka bir sakin aynı sıkışıklığı bunaltıcı hatırlar.",
        ],
        [
          "Die Aussagen schließen einander nicht notwendig aus. Unterschiedliche Lebenslagen können gegensätzliche Erfahrungen desselben Ortes hervorbringen.",
          "Bu anlatımlar zorunlu olarak birbirini dışlamaz. Farklı yaşam koşulları aynı yerin zıt deneyimlerini doğurabilir.",
        ],
        [
          "Deniz kann anonymisierte Ausschnitte gemeinsam freigeben lassen oder auf Zitate verzichten und stattdessen den Gesprächsprozess beschreiben.",
          "Deniz anonimleştirilmiş alıntıları birlikte onaylatabilir ya da alıntı kullanmadan görüşme sürecini anlatabilir.",
        ],
      ],
      "Zeugnis",
      "Çelişen hatıralar nasıl yorumlanıyor?",
      "Aynı mekân farklı yaşam koşullarında farklı deneyimlenebilir.",
      [
        "Birinin kesinlikle yalan söylediği varsayılıyor.",
        "İkisinin de belgesiz olduğu için değersiz sayılıyor.",
      ],
      "“nicht notwendig” zorunlu bir dışlama olmadığını söyler; bütün ifadelerin aynı derecede doğrulandığını iddia etmez.",
      [
        choice(
          "Ich lasse anonymisierte Auszüge freigeben.",
          "Anonim alıntılara onay alırım.",
          "consent",
        ),
        choice(
          "Ich beschreibe den Prozess ohne Zitate.",
          "Süreci alıntısız anlatırım.",
          "process",
        ),
      ],
    ),
    scene(
      "layers",
      "Katmanlı anlatı",
      "town",
      [
        [
          "Die Ausstellung nennt für jede Datierung die Quelle und erklärt, welche Frage damit beantwortet werden kann. Widersprüche bleiben lesbar.",
          "Sergi her tarihlendirme için kaynağı belirtir ve bunun hangi soruyu yanıtlayabildiğini açıklar. Çelişkiler okunabilir kalır.",
        ],
        [
          "Neben einer Bauakte steht ein Zeugnis, das einen späteren tatsächlichen Umzug beschreibt. Genehmigung und Lebensereignis werden unterschieden.",
          "Bir yapı dosyasının yanında, daha sonraki fiilî taşınmayı anlatan bir tanıklık yer alır. İzin ile yaşanmış olay ayrılır.",
        ],
        [
          "Eine Besucherin findet die Darstellung anstrengend, weil sie keine einzige eindeutige Jahreszahl erhält. Deniz ergänzt eine verständliche Einordnung.",
          "Bir ziyaretçi tek ve kesin bir yıl bulamadığı için sunumu yorucu bulur. Deniz anlaşılır bir bağlam açıklaması ekler.",
        ],
        [
          "Die Stadtgeschichte wird dadurch nicht beliebig. Ihre überprüfbaren Schichten treten vielmehr deutlicher hervor.",
          "Böylece şehir tarihi keyfîleşmez. Aksine denetlenebilir katmanları daha açık biçimde ortaya çıkar.",
        ],
      ],
      "Zeugnis",
      "Tarihler arasındaki fark nasıl aydınlanıyor?",
      "İzin tarihi ile fiilî taşınma farklı olaylar olarak ayrılıyor.",
      ["Bütün kaynaklar kaldırılıyor.", "Kesinlik ihtiyacı küçümseniyor."],
      "İki kaynağın farklı sorulara cevap vermesi çelişkinin bir bölümünü açıklayabilir; yorumun izlenebilirliği korunur.",
      [],
      "Kaynakları görünür hafıza",
    ),
    scene(
      "caution",
      "Açıkça belirtilen boşluk",
      "town",
      [
        [
          "Die umstrittene Datierung erscheint nicht im Haupttext. Eine kurze Notiz erklärt jedoch, dass die Quellen an dieser Stelle noch geprüft werden.",
          "Tartışmalı tarihlendirme ana metinde yer almaz. Ancak kısa bir not, bu noktada kaynakların hâlâ incelendiğini açıklar.",
        ],
        [
          "Das Zeugnis wird mit Zustimmung geschützt aufbewahrt, statt als störende Abweichung gelöscht zu werden.",
          "Tanıklık, rahatsız edici bir sapma diye silinmek yerine izinle ve korumalı biçimde saklanır.",
        ],
        [
          "So vermeidet Deniz eine voreilige Festlegung, riskiert aber, dass gerade die unsichere Erfahrung weniger Aufmerksamkeit erhält.",
          "Böylece Deniz erken bir kesin yargıdan kaçınır ama özellikle belirsiz deneyimin daha az dikkat görmesi riskini alır.",
        ],
        [
          "Für die nächste Ausgabe wird eine Überprüfung angekündigt. Die Leerstelle bleibt als Aufgabe sichtbar.",
          "Sonraki sürüm için yeniden inceleme duyurulur. Boşluk, yapılacak bir iş olarak görünür kalır.",
        ],
      ],
      "Zeugnis",
      "Temkinli kararın riski nedir?",
      "Belirsiz deneyimin daha az görünür olması.",
      [
        "Kaynağın otomatik olarak yok olması.",
        "Bütün kayıtların kesinleşmesi.",
      ],
      "Anlatı temkini tek başına kusursuz çözüm saymıyor; görünürlük bakımından bedelini de açıklıyor.",
      [],
      "İncelemeye açık boşluk",
    ),
    scene(
      "consent",
      "Birlikte onaylanan sesler",
      "garden",
      [
        [
          "Die Beteiligten prüfen die anonymisierten Ausschnitte und können einzelne Stellen streichen. Eine Person zieht ihren Beitrag ganz zurück.",
          "Katılımcılar anonimleştirilmiş alıntıları inceler ve bazı kısımları çıkarabilir. Bir kişi katkısını tümüyle geri çeker.",
        ],
        [
          "Ihr Zeugnis wird nicht veröffentlicht. Die verbleibenden Stimmen stehen nebeneinander, ohne zu einer künstlichen Einheitsgeschichte verbunden zu werden.",
          "Onun tanıklığı yayımlanmaz. Kalan sesler yapay bir tek anlatıya birleştirilmeden yan yana durur.",
        ],
        [
          "Die Ausstellung erläutert, dass Zustimmung eine Bedingung der Veröffentlichung ist und kein Beweis historischer Vollständigkeit.",
          "Sergi, onayın yayımlama koşulu olduğunu ve tarihsel eksiksizliğin kanıtı olmadığını açıklar.",
        ],
        [
          "Deniz erkennt, dass verantwortliche Sichtbarkeit auch das Recht einschließt, unsichtbar zu bleiben.",
          "Deniz, sorumlu görünürlüğün görünmez kalma hakkını da kapsadığını anlar.",
        ],
      ],
      "Zeugnis",
      "Katkısını geri çeken kişinin anlatısına ne oluyor?",
      "Yayımlanmıyor.",
      ["Anonim olduğu için izinsiz basılıyor.", "Diğer kişi adına sunuluyor."],
      "İzin yalnızca adın gizlenmesi değildir; yayımlanmayı reddetme olanağı da tanınmıştır.",
      [],
      "İzinle kurulan çok seslilik",
    ),
    scene(
      "process",
      "Sessizliğin açıklaması",
      "town",
      [
        [
          "Anstelle persönlicher Zitate beschreibt Deniz, wie Gespräche vorbereitet wurden und welche Grenzen die Beteiligten gesetzt haben.",
          "Deniz kişisel alıntıların yerine görüşmelerin nasıl hazırlandığını ve katılımcıların hangi sınırları koyduğunu anlatır.",
        ],
        [
          "Kein privates Zeugnis wird ausgestellt. Dadurch fehlen anschauliche Stimmen, doch die Menschen werden nicht zum bloßen Material der Ausstellung.",
          "Özel bir tanıklık sergilenmez. Bu yüzden canlı sesler eksik kalır ama insanlar da serginin salt malzemesine dönüşmez.",
        ],
        [
          "Ein begleitender Workshop lädt dazu ein, über öffentliche Erinnerung und das Recht auf Zurückhaltung zu sprechen.",
          "Eşlik eden bir atölye kamusal hafıza ve geri durma hakkı hakkında konuşmaya davet eder.",
        ],
        [
          "Die Ausstellung beantwortet weniger Einzelfragen, macht aber ihre eigene Arbeitsweise zum überprüfbaren Teil der Erzählung.",
          "Sergi daha az tekil soruyu yanıtlar ama kendi çalışma yöntemini anlatının denetlenebilir parçası hâline getirir.",
        ],
      ],
      "Zeugnis",
      "Bu seçimde ne kazanılıp ne kaybediliyor?",
      "Özel sınırlar korunuyor; doğrudan tanıklığın canlılığı azalıyor.",
      [
        "Bütün tarihsel sorular kesin çözülüyor.",
        "Hiçbir yöntem açıklanmıyor.",
      ],
      "Süreç anlatımı etik sınırları görünür kılar; somut kişisel seslerin yokluğu açık bir sınırlılıktır.",
      [],
      "Yöntemini anlatan sergi",
    ),
  ],
);
story(
  "story-c2-stimmen",
  "Satır Arasındaki Sesler",
  "Die fehlende Seite",
  "C2",
  "mystery",
  "night",
  12,
  "Eksik bir müsvedde, güvenilmez bir anlatıcı ve editör notları. İroniyi ve varsayımları ayırarak dört tutarlı yoruma ulaş.",
  [
    scene(
      "start",
      "Son sayfa yok",
      "night",
      [
        [
          "In einem Nachlass entdeckt Lale eine Erzählung, deren letzte Seite fehlt. Auf dem Umschlag steht: Für die Nachwelt, falls sie Zeit hat.",
          "Lale bir yazarın geride bıraktığı belgelerde son sayfası eksik bir öykü bulur. Zarfın üstünde şöyle yazar: Gelecek kuşaklara, vakitleri olursa.",
        ],
        [
          "Der Erzähler versichert auffällig oft, er habe nichts zu verbergen. Ausgerechnet die entscheidende Begegnung schildert er jedoch nur aus zweiter Hand.",
          "Anlatıcı, saklayacak hiçbir şeyi olmadığını dikkat çekici sıklıkta yineler. Ama tam da belirleyici karşılaşmayı yalnızca başkasından aktarımla anlatır.",
        ],
        [
          "Eine Deutung drängt sich auf, ist aber noch nicht gesichert: Vielleicht schützt die demonstrative Offenheit eine wohlüberlegte Auslassung.",
          "Bir yorum kendini dayatır ama henüz doğrulanmış değildir: Belki de gösterişli açıklık, iyi düşünülmüş bir suskunluğu koruyordur.",
        ],
        [
          "Lale kann die Randnotizen untersuchen oder zunächst die Perspektivwechsel im Text verfolgen. Den fehlenden Schluss will sie nicht erfinden.",
          "Lale kenar notlarını inceleyebilir ya da önce metindeki bakış açısı değişimlerini izleyebilir. Eksik sonu uydurmak istemez.",
        ],
      ],
      "Deutung",
      "Açılış hangi tutumu gerektiriyor?",
      "İpuçlarından yorum üretirken kesinlik iddiasını sınırlamayı.",
      [
        "Anlatıcının kesin suçlu sayılmasını.",
        "Eksik sayfanın tamamlanmış gibi sunulmasını.",
      ],
      "“Vielleicht” ve “noch nicht gesichert” yorumu olasılık olarak tutar. Güvenilmezlik belirtisi tek başına belirli bir olayı kanıtlamaz.",
      [
        choice(
          "Ich prüfe die Randnotizen.",
          "Kenar notlarını incelerim.",
          "notes",
        ),
        choice(
          "Ich verfolge die wechselnden Perspektiven.",
          "Değişen bakış açılarını izlerim.",
          "perspective",
        ),
      ],
    ),
    scene(
      "notes",
      "Kimin kalemi?",
      "night",
      [
        [
          "Am Rand steht neben einer besonders pathetischen Beteuerung: Das glaubt er selbst nicht. Die Handschrift ähnelt der des Autors, ist aber nicht eindeutig zuzuordnen.",
          "Özellikle tumturaklı bir güvencenin yanında kenara şu yazılmıştır: Buna kendisi de inanmıyor. El yazısı yazarınkine benzer ama kesin ona atfedilemez.",
        ],
        [
          "Wäre die Notiz vom Autor, ließe sie sich als Distanzierung vom Erzähler lesen. Von einer späteren Leserin stammend wäre sie bereits eine fremde Deutung.",
          "Not yazara aitse anlatıcıdan uzaklaşma olarak okunabilir. Sonraki bir okura aitse zaten başka birinin yorumudur.",
        ],
        [
          "Eine Datierung fehlt. Die Versuchung ist groß, aus der Ähnlichkeit einen Beweis zu machen; gerade deshalb hält Lale inne.",
          "Tarih yoktur. Benzerliği kanıta dönüştürme ayartısı büyüktür; Lale tam da bu yüzden durup düşünür.",
        ],
        [
          "Sie kann die Notiz mit einem Vorbehalt abdrucken oder sie bis zu einer fachlichen Prüfung nur im Kommentar erwähnen.",
          "Notu bir çekinceyle basabilir ya da uzman incelemesine kadar yalnızca açıklamada anabilir.",
        ],
      ],
      "Deutung",
      "El yazısı benzerliği neyi sağlar?",
      "Yazara atıf ihtimalini destekler; kesinleştirmez.",
      [
        "Yazarın bütün niyetini kesin kanıtlar.",
        "Notun mutlaka sahte olduğunu gösterir.",
      ],
      "Koşullu yapılar iki ayrı kaynak ihtimalini açık tutar. “ähnelt” ile kesin aidiyet aynı şey değildir.",
      [
        choice(
          "Ich drucke die Notiz mit Vorbehalt ab.",
          "Notu çekinceyle basarım.",
          "footnote",
        ),
        choice(
          "Ich erwähne sie vorerst nur im Kommentar.",
          "Şimdilik yalnızca açıklamada anarım.",
          "restraint",
        ),
      ],
    ),
    scene(
      "perspective",
      "Anlatının çatlağı",
      "town",
      [
        [
          "Im ersten Abschnitt nennt der Erzähler die Besucherin eine Unbekannte; später erinnert er sich beiläufig an ihren vertrauten Schritt.",
          "İlk bölümde anlatıcı ziyaretçiye bir yabancı der; daha sonra onun tanıdık adımlarını laf arasında hatırlar.",
        ],
        [
          "Die Unstimmigkeit lässt eine frühere Beziehung vermuten. Sie könnte ebenso auf eine verworfene Überarbeitung zurückgehen.",
          "Tutarsızlık daha önceki bir ilişkiyi düşündürür. Ama terk edilmiş bir düzeltmeden de kaynaklanmış olabilir.",
        ],
        [
          "Für die Deutung ist entscheidend, ob man jede Spur als absichtsvoll gesetztes Signal behandelt oder auch den unfertigen Werkzustand berücksichtigt.",
          "Yorum için belirleyici olan, her izi bilinçli yerleştirilmiş işaret saymak ya da eserin bitmemişliğini de hesaba katmaktır.",
        ],
        [
          "Lale kann die beiden Lesarten nebeneinander entwickeln oder eine textnahe Lesart wählen und deren Grenzen ausdrücklich benennen.",
          "Lale iki okumayı yan yana geliştirebilir ya da metne yakın bir okuma seçip sınırlarını açıkça belirtebilir.",
        ],
      ],
      "Deutung",
      "Tutarsızlık için hangi iki açıklama açık?",
      "Bilinçli anlatıcı çatlağı veya bitmemiş düzeltme izi.",
      [
        "Yalnızca basım hatası kesinliği.",
        "Ziyaretçinin hiç var olmaması kesinliği.",
      ],
      "“könnte ebenso” alternatif olasılığı korur. Eserin tamamlanmamış olması yorumun kesinliğini etkiler.",
      [
        choice(
          "Ich entwickle beide Lesarten nebeneinander.",
          "İki okumayı yan yana geliştiririm.",
          "parallel",
        ),
        choice(
          "Ich wähle eine begrenzte textnahe Lesart.",
          "Sınırları belli metinsel okuma seçerim.",
          "close",
        ),
      ],
    ),
    scene(
      "footnote",
      "Görünen çekince",
      "night",
      [
        [
          "Die Ausgabe zeigt die Randnotiz als Faksimile. Eine gut sichtbare Fußnote erläutert, weshalb ihre Urheberschaft offenbleibt.",
          "Baskı kenar notunun tıpkıbasımını gösterir. Kolay görülen bir dipnot, aidiyetin neden açık kaldığını açıklar.",
        ],
        [
          "Die Deutung gewinnt dadurch Anschaulichkeit, doch Lale weiß, dass ein Bild stärker wirken kann als seine Einschränkung.",
          "Yorum böylece somutluk kazanır ama Lale bir görüntünün onu sınırlayan açıklamadan daha güçlü etki yaratabileceğini bilir.",
        ],
        [
          "Deshalb steht der Vorbehalt nicht im Kleingedruckten, sondern unmittelbar neben dem Bild. Auch die alternative Herkunft wird genannt.",
          "Bu nedenle çekince küçük puntolu yerde değil, doğrudan resmin yanında durur. Alternatif köken de belirtilir.",
        ],
        [
          "Die Lesenden erhalten ein Indiz und seine Grenze zugleich. Der Schluss der Erzählung bleibt unergänzt.",
          "Okurlar hem bir belirtiyi hem de onun sınırını birlikte görür. Öykünün sonu tamamlanmadan bırakılır.",
        ],
      ],
      "Deutung",
      "Çekincenin resmin yanında olması neden önemli?",
      "Görselin kesin kanıt gibi algılanma riskini azaltır.",
      ["Aidiyeti kesinleştirir.", "Eksik sayfayı geri getirir."],
      "Sunum biçimi yorum etkisini değiştirir. Açık çekince belirsizliği ortadan kaldırmaz, görünür tutar.",
      [],
      "İpucu ve sınırı birlikte",
    ),
    scene(
      "restraint",
      "Ölçülü geri duruş",
      "night",
      [
        [
          "Lale verzichtet vorerst auf die Abbildung. Im Kommentar beschreibt sie die Notiz und begründet die ausstehende Zuordnung.",
          "Lale şimdilik görselden vazgeçer. Açıklamada notu tarif eder ve aidiyetin neden beklediğini gerekçelendirir.",
        ],
        [
          "Diese Deutung ist weniger eindrucksvoll, dafür wird eine unsichere Handschrift nicht zum heimlichen Schlüssel des gesamten Textes.",
          "Bu yorum daha az çarpıcıdır; buna karşılık belirsiz el yazısı bütün metnin gizli anahtarına dönüştürülmez.",
        ],
        [
          "Ein Kollege wirft ihr übertriebene Vorsicht vor. Lale räumt den Verlust an Anschaulichkeit ein, hält die Zuschreibung aber für verfrüht.",
          "Bir meslektaşı aşırı temkinli olduğunu söyler. Lale somutluk kaybını kabul eder ama atfı erken bulur.",
        ],
        [
          "Die Entscheidung kann nach einer Prüfung revidiert werden. Zurückhaltung bedeutet hier Aufschub, nicht das Verschwindenlassen einer Quelle.",
          "Karar incelemeden sonra değiştirilebilir. Geri duruş burada ertelemedir; bir kaynağı yok etmek değildir.",
        ],
      ],
      "Deutung",
      "Kararın geri çevrilebilir olması neye dayanıyor?",
      "Kaynak korunuyor ve uzman incelemesi bekleniyor.",
      ["Kaynak tamamen siliniyor.", "Sonuç tartışmaya kapatılıyor."],
      "“revidiert werden” yeniden değerlendirilebilir demektir. Geri duruş, kanıtın ortadan kaldırılmasıyla karıştırılmaz.",
      [],
      "Gerekçeli erteleme",
    ),
    scene(
      "parallel",
      "İki açık okuma",
      "town",
      [
        [
          "Der Kommentar verfolgt einmal die Spur einer absichtlichen Selbstentlarvung, einmal die eines noch nicht bereinigten Entwurfs.",
          "Açıklama bir yandan kasıtlı bir kendini ele verme izini, diğer yandan henüz düzeltilmemiş taslak izini izler.",
        ],
        [
          "Keine Deutung wird zur letzten Wahrheit erhoben. Dennoch nennt Lale für beide konkrete Textstellen und die jeweils nötigen Annahmen.",
          "Hiçbir yorum son gerçek düzeyine çıkarılmaz. Yine de Lale ikisi için de somut metin parçaları ve gerekli varsayımları belirtir.",
        ],
        [
          "Ein Leser fragt, ob damit nicht alles möglich werde. Die Antwort verweist auf den Unterschied zwischen begründeter Offenheit und beliebiger Behauptung.",
          "Bir okur böylece her şeyin mümkün sayılıp sayılmadığını sorar. Yanıt, gerekçeli açıklık ile keyfî iddia arasındaki farkı gösterir.",
        ],
        [
          "Der fehlende Schluss wird zur Grenze der Untersuchung, nicht zur Erlaubnis, irgendeinen Schluss einzusetzen.",
          "Eksik son araştırmanın sınırına dönüşür; rastgele bir son ekleme iznine değil.",
        ],
      ],
      "Deutung",
      "Çoklu okuma neden keyfî sayılmıyor?",
      "İki yorum da somut parçalar ve açık varsayımlarla gerekçelendiriliyor.",
      ["Bütün iddialar eşit kabul ediliyor.", "Metin hiç dikkate alınmıyor."],
      "Belirsizlik sınırsız yorum özgürlüğü değildir. Gerekçelerin denetlenebilir olması iki okumayı ayakta tutar.",
      [],
      "Gerekçeli açıklık",
    ),
    scene(
      "close",
      "Sınırlı bir sav",
      "night",
      [
        [
          "Lale argumentiert, die wechselnden Bezeichnungen destabilisierten das Vertrauen in den Erzähler. Über sein konkretes Motiv trifft sie keine Aussage.",
          "Lale değişen adlandırmaların anlatıcıya güveni sarstığını savunur. Somut güdüsü hakkında iddiada bulunmaz.",
        ],
        [
          "Die Deutung bleibt damit nah an einer beobachtbaren Wirkung des Textes, statt die Biografie des Autors als Erklärung nachzuliefern.",
          "Böylece yorum, açıklama diye yazarın biyografisini eklemek yerine metnin gözlenebilir bir etkisine yakın kalır.",
        ],
        [
          "Im Nachwort nennt sie die Möglichkeit einer unfertigen Überarbeitung ausdrücklich. Ihre These ist eine begrenzte Lesart, keine Rekonstruktion der fehlenden Seite.",
          "Sonsözde bitmemiş bir düzeltme olasılığını açıkça belirtir. Tezi sınırlı bir okumadır; eksik sayfanın yeniden kurulması değildir.",
        ],
        [
          "Unter dem letzten erhaltenen Satz bleibt Weißraum. Er ist kein dramatischer Beweis, sondern die sichtbare Stelle dessen, was fehlt.",
          "Korunmuş son cümlenin altında boşluk kalır. Bu dramatik bir kanıt değil, eksik olanın görünür yeridir.",
        ],
      ],
      "Deutung",
      "Lale’nin savı neyle sınırlı?",
      "Metindeki adlandırmaların anlatıcıya güveni sarsmasıyla.",
      [
        "Yazarın kişisel suçunu kanıtlamakla.",
        "Eksik sonun içeriğini kesin kurmakla.",
      ],
      "Metinsel etki ile niyet veya biyografik gerçek aynı düzeyde değildir. Anlatı açıkça bu sınırı korur.",
      [],
      "Sınırını bilen yorum",
    ),
  ],
);
write("src/data/stories/extra-stories.json", stories);
write("src/data/stories/extra-glossary.json", glossary);
console.log(
  `${listening.length} dinleme, ${listening.reduce((n, e) => n + e.quiz.length, 0)} soru, ${stories.length} hikâye, ${stories.reduce((n, s) => n + s.scenes.length, 0)} sahne hazır.`,
);
