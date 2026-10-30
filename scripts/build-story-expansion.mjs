// Six individually authored, public bilingual branching stories. No private input.
import { writeFileSync } from "node:fs";
const stories = [];
function story(
  id,
  title,
  germanTitle,
  level,
  category,
  description,
  art,
  word,
) {
  const s = {
    id: "story-world-" + id,
    title,
    germanTitle,
    level,
    category,
    description,
    art,
    minutes: level === "A1" ? 8 : level === "A2" ? 9 : 12,
    start: "start",
    scenes: [],
    word,
  };
  stories.push(s);
  return s;
}
function scene(s, id, title, lines, q, choices = [], ending) {
  const n = {
    id,
    title,
    art: s.art,
    lines: lines.map(([de, tr]) => ({ de, tr })),
    words: [s.word],
    choices: choices.map(([de, tr, to], i) => ({
      id: id + "-" + (i + 1),
      de,
      tr,
      to,
    })),
    question: {
      prompt: q[0],
      options: q[1],
      correct: q[1][0],
      explanation: q[2],
    },
  };
  if (ending) n.ending = ending;
  s.scenes.push(n);
}

let s = story(
  "a1-ausflug",
  "Otobüsle Küçük Bir Keşif",
  "Ein kleiner Ausflug mit dem Bus",
  "A1",
  "travel",
  "Bir park gezisinde yolu sor, tabelaları oku ve dört farklı gezi sonunu keşfet. Yer ve yön ifadelerini kısa cümlelerle çalış.",
  "train",
  "Haltestelle",
);
scene(
  s,
  "start",
  "Park hangi yönde?",
  [
    [
      "Es ist Samstag. Du bist mit deiner Freundin Mia in einer neuen Stadt.",
      "Cumartesi günü. Arkadaşın Mia ile yeni bir şehirdesin.",
    ],
    [
      "Ihr möchtet zum Park fahren. An der Haltestelle stehen zwei Busse.",
      "Parka gitmek istiyorsunuz. Durakta iki otobüs duruyor.",
    ],
    [
      "Auf einem Bus steht: Linie drei, Stadtpark. Der andere Bus fährt zum Markt.",
      "Bir otobüste şöyle yazıyor: Üç numaralı hat, şehir parkı. Diğer otobüs pazara gidiyor.",
    ],
    [
      "Mia fragt: Ist das unser Bus? Du kannst den Fahrer fragen oder den Plan lesen.",
      "Mia soruyor: Bu bizim otobüsümüz mü? Şoföre sorabilir veya planı okuyabilirsin.",
    ],
  ],
  [
    "Üç numaralı otobüs nereye gidiyor?",
    ["Şehir parkına.", "Havaalanına.", "Mia’nın evine."],
    "Tabeladaki “Linie drei, Stadtpark” bilgisi parkı açıkça gösterir. “der andere Bus” ise diğer, yani pazara giden otobüstür.",
  ],
  [
    ["Fährt dieser Bus zum Park?", "Bu otobüs parka gidiyor mu?", "driver"],
    ["Ich lese zuerst den Plan.", "Önce planı okuyorum.", "map"],
  ],
);
scene(
  s,
  "driver",
  "Şoföre bir soru",
  [
    [
      "Du gehst zum Fahrer. Du fragst: Fährt dieser Bus zum Stadtpark?",
      "Şoförün yanına gidiyorsun. Soruyorsun: Bu otobüs şehir parkına gidiyor mu?",
    ],
    [
      "Ja, sagt er. Die Fahrt dauert zehn Minuten. Bitte steigt vorne ein.",
      "Evet, diyor. Yolculuk on dakika sürüyor. Lütfen önden binin.",
    ],
    [
      "Mia zeigt auf die Haltestelle im Plan. Dort steht auch: Museum.",
      "Mia plandaki durağı gösteriyor. Orada müze de yazıyor.",
    ],
    [
      "Der Fahrer erklärt: Das Museum ist neben dem Park. Ihr könnt dort auch aussteigen.",
      "Şoför açıklıyor: Müze parkın yanında. Orada da inebilirsiniz.",
    ],
  ],
  [
    "Şoför müzenin yeri hakkında ne söylüyor?",
    [
      "Parkın yanında olduğunu.",
      "Pazarda olduğunu.",
      "Şehrin dışında olduğunu.",
    ],
    "“neben dem Park” parkın yanında anlamına gelir. Şoför, müzenin uzaklığını değil parkla konum ilişkisini açıklıyor.",
  ],
  [
    ["Wir fahren direkt zum Park.", "Doğrudan parka gidiyoruz.", "picnic"],
    ["Wir besuchen zuerst das Museum.", "Önce müzeyi geziyoruz.", "museum"],
  ],
);
scene(
  s,
  "map",
  "Plandaki yeşil çizgi",
  [
    [
      "Du liest den Plan an der Haltestelle. Eine grüne Linie zeigt den Weg zum Park.",
      "Duraktaki planı okuyorsun. Yeşil bir çizgi parka giden yolu gösteriyor.",
    ],
    [
      "Neben der Linie steht: Zu Fuß zwanzig Minuten. Der Weg führt am Fluss entlang.",
      "Çizginin yanında şöyle yazıyor: Yürüyerek yirmi dakika. Yol nehir boyunca uzanıyor.",
    ],
    [
      "Mia sagt: Wir haben Zeit. Aber ich möchte auch den Markt sehen.",
      "Mia diyor ki: Zamanımız var. Ama pazarı da görmek istiyorum.",
    ],
    [
      "Ihr könnt jetzt am Fluss gehen oder mit dem anderen Bus zum Markt fahren.",
      "Şimdi nehir boyunca yürüyebilir veya diğer otobüsle pazara gidebilirsiniz.",
    ],
  ],
  [
    "Parka yürümek ne kadar sürüyor?",
    ["Yirmi dakika.", "İki saat.", "Beş dakika."],
    "“Zu Fuß” yürüyerek, “zwanzig Minuten” yirmi dakika demektir. Bu bilgi otobüs yolculuğunun on dakikalık süresinden farklıdır.",
  ],
  [
    ["Wir gehen am Fluss entlang.", "Nehir boyunca yürüyoruz.", "river"],
    ["Wir fahren zuerst zum Markt.", "Önce pazara gidiyoruz.", "market"],
  ],
);
scene(
  s,
  "picnic",
  "Yeşil bankta öğle molası",
  [
    [
      "Ihr steigt am Park aus. Die Haltestelle ist direkt vor dem Eingang.",
      "Parkta iniyorsunuz. Durak girişin hemen önünde.",
    ],
    [
      "Im Park findet ihr eine grüne Bank. Mia holt Brot und Äpfel aus ihrer Tasche.",
      "Parkta yeşil bir bank buluyorsunuz. Mia çantasından ekmek ve elma çıkarıyor.",
    ],
    [
      "Du machst ein Foto von den Blumen. Danach esst ihr zusammen.",
      "Çiçeklerin fotoğrafını çekiyorsun. Sonra birlikte yemek yiyorsunuz.",
    ],
    [
      "Vor der Rückfahrt schaut ihr auf den Plan. Jetzt kennt ihr die richtige Linie.",
      "Dönüş yolculuğundan önce plana bakıyorsunuz. Artık doğru hattı biliyorsunuz.",
    ],
  ],
  [
    "Gezide yiyecekleri kim getiriyor?",
    ["Mia.", "Otobüs şoförü.", "Müze görevlisi."],
    "“Mia holt … aus ihrer Tasche” cümlesinde yiyecekleri çantasından çıkaran Mia’dır. Diğer kişiler bu sahnede yiyecek getirmiyor.",
  ],
  [],
  "Parkta sakin bir piknik",
);
scene(
  s,
  "museum",
  "Yağmur ve renkli resimler",
  [
    [
      "An der Haltestelle beginnt es zu regnen. Ihr lauft zum Museum neben dem Park.",
      "Durakta yağmur yağmaya başlıyor. Parkın yanındaki müzeye koşuyorsunuz.",
    ],
    [
      "Eine Frau am Eingang sagt: Heute ist der Eintritt frei. Ihr könnt hineingehen.",
      "Girişteki bir kadın diyor ki: Bugün giriş ücretsiz. İçeri girebilirsiniz.",
    ],
    [
      "Ihr seht bunte Bilder und eine alte Straßenkarte. Mia findet die Karte besonders schön.",
      "Renkli resimler ve eski bir şehir haritası görüyorsunuz. Mia haritayı özellikle güzel buluyor.",
    ],
    [
      "Später scheint die Sonne wieder. Ihr geht noch kurz durch den Park.",
      "Daha sonra güneş yeniden açıyor. Parkta kısa bir yürüyüş de yapıyorsunuz.",
    ],
  ],
  [
    "Müzenin girişi bugün nasıl?",
    ["Ücretsiz.", "Kapalı.", "Yalnızca gruplara açık."],
    "“Der Eintritt ist frei” girişin ücretsiz olduğunu söyler. Burada “frei” boş bir yer değil, ücret alınmaması anlamındadır.",
  ],
  [],
  "Yağmurun getirdiği müze gezisi",
);
scene(
  s,
  "river",
  "Yürürken bulunan manzara",
  [
    [
      "Ihr bleibt nicht an der Haltestelle. Ihr geht langsam am Fluss entlang.",
      "Durakta kalmıyorsunuz. Nehir boyunca yavaşça yürüyorsunuz.",
    ],
    [
      "Auf einer Brücke bleibt Mia stehen. Von hier sieht sie den ganzen Park.",
      "Mia bir köprünün üzerinde duruyor. Buradan parkın tamamını görüyor.",
    ],
    [
      "Du fragst einen Mann: Ist der Eingang dort links? Er nickt und lächelt.",
      "Bir adama soruyorsun: Giriş orada solda mı? Başını sallıyor ve gülümsüyor.",
    ],
    [
      "Ihr kommt zu Fuß an. Der Weg war schon ein schöner Teil des Ausflugs.",
      "Yürüyerek varıyorsunuz. Yol da gezinin güzel bir parçası oldu.",
    ],
  ],
  [
    "Mia parkı nereden görüyor?",
    ["Bir köprüden.", "Müzenin içinden.", "Otobüsün arkasından."],
    "“Auf einer Brücke” köprünün üzerinde demektir. “Von hier” ifadesi de Mia’nın o anda bulunduğu bu yere gönderme yapar.",
  ],
  [],
  "Nehir kıyısında keşif",
);
scene(
  s,
  "market",
  "Pazar dönüşü park",
  [
    [
      "Ihr fahrt von der Haltestelle zum Markt. Dort kauft Mia zwei kleine Brötchen.",
      "Duraktan pazara gidiyorsunuz. Mia orada iki küçük ekmek alıyor.",
    ],
    [
      "Ein Verkäufer zeigt euch den Weg zum Park. Er sagt: Geht geradeaus, dann rechts.",
      "Bir satıcı size parkın yolunu gösteriyor. Diyor ki: Düz gidin, sonra sağa dönün.",
    ],
    [
      "Ihr folgt dem Weg und findet den Eingang. Die Brötchen nehmt ihr mit.",
      "Yolu takip edip girişi buluyorsunuz. Ekmekleri yanınıza alıyorsunuz.",
    ],
    [
      "Am Ende sitzt ihr doch im Park. Heute habt ihr sogar zwei neue Orte kennengelernt.",
      "Sonunda yine parkta oturuyorsunuz. Bugün iki yeni yer bile tanıdınız.",
    ],
  ],
  [
    "Satıcı hangi yönleri söylüyor?",
    [
      "Düz gidin, sonra sağa dönün.",
      "Önce sola, sonra geri dönün.",
      "Köprüden aşağı inin.",
    ],
    "“geradeaus” düz, “dann rechts” sonra sağa demektir. Yönlerin sırası önemlidir; önce düz gidilir, ardından sağa dönülür.",
  ],
  [],
  "Pazardan geçen lezzetli rota",
);

s = story(
  "a2-lesezeichen",
  "Kitabın Arasındaki Davet",
  "Das Lesezeichen mit der Einladung",
  "A2",
  "friendship",
  "Bir kitapta unutulmuş davet, iki farklı tanışma yolu ve dört arkadaşlık sonu. Davet etme, açıklama ve plan değiştirmeyi çalış.",
  "cafe",
  "Lesezeichen",
);
scene(
  s,
  "start",
  "Kütüphanedeki küçük not",
  [
    [
      "Du hast in der Bibliothek einen Roman ausgeliehen. Zwischen den Seiten liegt ein blaues Lesezeichen.",
      "Kütüphaneden bir roman ödünç aldın. Sayfaların arasında mavi bir ayraç duruyor.",
    ],
    [
      "Auf dem Lesezeichen steht: Unser Lesekreis trifft sich am Freitag um sechs im Café Linden.",
      "Ayraçta şöyle yazıyor: Okuma grubumuz cuma günü saat altıda Linden Kafe’de buluşuyor.",
    ],
    [
      "Darunter hat jemand geschrieben: Neue Leute sind willkommen. Bring gern dein Lieblingsbuch mit.",
      "Altına biri şunu yazmış: Yeni kişiler hoş karşılanır. İstersen en sevdiğin kitabı getir.",
    ],
    [
      "Du möchtest neue Freunde finden, kennst aber niemanden. Du kannst im Café nachfragen oder deinen Nachbarn Emir einladen.",
      "Yeni arkadaşlar bulmak istiyorsun ama kimseyi tanımıyorsun. Kafeye sorabilir veya komşun Emir’i davet edebilirsin.",
    ],
  ],
  [
    "Okuma grubu ne zaman buluşuyor?",
    [
      "Cuma günü saat altıda.",
      "Her sabah saat sekizde.",
      "Pazar günü öğle vakti.",
    ],
    "Davetin “am Freitag um sechs” bölümü gün ve saati birlikte verir. “am” günle, “um” ise saatle kullanılır.",
  ],
  [
    ["Ich frage zuerst im Café nach.", "Önce kafeye sorarım.", "cafe"],
    ["Ich lade Emir ein.", "Emir’i davet ederim.", "emir"],
  ],
);
scene(
  s,
  "cafe",
  "Masanın yanında bir sandalye",
  [
    [
      "Am Freitag zeigst du der Bedienung das Lesezeichen. Sie deutet auf einen runden Tisch am Fenster.",
      "Cuma günü ayracı servis görevlisine gösteriyorsun. Pencere kenarındaki yuvarlak masayı işaret ediyor.",
    ],
    [
      "Dort sitzt Lea mit einem Stapel Bücher. Sie sagt: Schön, dass du gekommen bist. Wir warten noch auf zwei Personen.",
      "Lea orada bir kitap yığınıyla oturuyor. Diyor ki: Gelmene sevindim. İki kişiyi daha bekliyoruz.",
    ],
    [
      "Du erzählst von deinem Roman. Lea möchte wissen, ob du lieber vorlesen oder erst zuhören möchtest.",
      "Romanından söz ediyorsun. Lea, sesli okumayı mı yoksa önce dinlemeyi mi tercih ettiğini öğrenmek istiyor.",
    ],
    [
      "Beides ist in Ordnung. Das Treffen ist kein Test, und niemand muss sofort sprechen.",
      "İkisi de olur. Buluşma bir sınav değil ve hiç kimse hemen konuşmak zorunda değil.",
    ],
  ],
  [
    "Lea yeni katılımcıya ne söylüyor?",
    [
      "Önce dinleyebileceğini de söylüyor.",
      "Mutlaka ilk sırada okumasını istiyor.",
      "Kitabını eve götürmesini yasaklıyor.",
    ],
    "“vorlesen oder erst zuhören” iki seçenek sunar. Son cümledeki “niemand muss” de hemen konuşma zorunluluğu olmadığını doğrular.",
  ],
  [
    [
      "Ich lese eine kurze Stelle vor.",
      "Kısa bir bölümü sesli okurum.",
      "reading",
    ],
    ["Ich höre heute erst einmal zu.", "Bugün önce bir dinlerim.", "listening"],
  ],
);
scene(
  s,
  "emir",
  "Birlikte gitmek daha kolay mı?",
  [
    [
      "Du klingelst bei Emir und zeigst ihm das Lesezeichen. Er liest gern, hat am Freitag aber lange Unterricht.",
      "Emir’in kapısını çalıp ayracı gösteriyorsun. Okumayı seviyor ama cuma günü dersi uzun sürüyor.",
    ],
    [
      "Er sagt: Ich kann erst um halb sieben kommen. Vielleicht gehe ich beim nächsten Mal mit.",
      "Diyor ki: Ancak altı buçukta gelebilirim. Belki bir dahaki sefere birlikte giderim.",
    ],
    [
      "Du möchtest ihn nicht unter Druck setzen. Ihr könnt im Café nachfragen oder zuerst zu zweit ein Buch auswählen.",
      "Ona baskı yapmak istemiyorsun. Kafeye sorabilir veya önce ikiniz bir kitap seçebilirsiniz.",
    ],
    [
      "Emir freut sich über die Einladung. Für ihn ist wichtig, dass er auch später dazukommen darf.",
      "Emir davete seviniyor. Onun için önemli olan, sonradan da katılabilmesi.",
    ],
  ],
  [
    "Emir neden saat altıda gelemiyor?",
    [
      "Dersi uzun sürdüğü için.",
      "Kitap okumayı sevmediği için.",
      "Kafenin yerini bilmediği için.",
    ],
    "“hat … lange Unterricht” dersinin uzun sürdüğünü açıklar. “liest gern” okumayı sevdiğini söyler; bu yüzden ikinci seçenek metne aykırıdır.",
  ],
  [
    [
      "Ich frage, ob Emir später kommen kann.",
      "Emir’in sonradan gelip gelemeyeceğini sorarım.",
      "late",
    ],
    [
      "Wir planen erst einen kleinen Buchabend.",
      "Önce küçük bir kitap akşamı planlarız.",
      "home",
    ],
  ],
);
scene(
  s,
  "reading",
  "Paylaşılan bir paragraf",
  [
    [
      "Du legst das Lesezeichen auf den Tisch und liest einen kurzen Abschnitt vor. Deine Stimme ist am Anfang leise.",
      "Ayracı masaya bırakıp kısa bir bölümü sesli okuyorsun. Sesin başlangıçta alçak çıkıyor.",
    ],
    [
      "Lea wartet geduldig. Danach fragt sie, warum dir gerade diese Stelle gefällt.",
      "Lea sabırla bekliyor. Sonra özellikle bu bölümü neden sevdiğini soruyor.",
    ],
    [
      "Du erklärst es mit einfachen Worten. Ein anderer Teilnehmer hat eine ähnliche Erfahrung gemacht.",
      "Basit sözcüklerle açıklıyorsun. Başka bir katılımcı da benzer bir deneyim yaşamış.",
    ],
    [
      "Nach dem Treffen tauscht ihr Buchtipps aus. Für nächste Woche hast du schon eine Idee.",
      "Buluşmadan sonra kitap önerileri paylaşıyorsunuz. Gelecek hafta için şimdiden bir fikrin var.",
    ],
  ],
  [
    "Okumadan sonra hangi konu konuşuluyor?",
    [
      "Seçilen bölümün neden sevildiği.",
      "Kitabın kaç para ettiği.",
      "Kafenin ne zaman kapandığı.",
    ],
    "Lea’nın “warum dir gerade diese Stelle gefällt” sorusu kişisel bir gerekçe ister. Sahne, doğru telaffuza puan verildiğini söylemez.",
  ],
  [],
  "İlk paragraftan başlayan sohbet",
);
scene(
  s,
  "listening",
  "Sessiz katılım da katılımdır",
  [
    [
      "Das Lesezeichen bleibt heute in deinem Buch. Du hörst zu, während die anderen ihre Geschichten vorstellen.",
      "Ayraç bugün kitabında kalıyor. Diğerleri hikâyelerini tanıtırken dinliyorsun.",
    ],
    [
      "Du notierst dir zwei neue Wörter. Als du eine Frage stellst, erklärt Lea den Ausdruck mit einem Beispiel.",
      "İki yeni sözcüğü not ediyorsun. Bir soru sorduğunda Lea ifadeyi bir örnekle açıklıyor.",
    ],
    [
      "Am Ende sagt sie: Du kannst auch nächste Woche einfach zuhören. Wir freuen uns, wenn du wiederkommst.",
      "Sonunda diyor ki: Gelecek hafta da sadece dinleyebilirsin. Tekrar gelirsen seviniriz.",
    ],
    [
      "Du gehst ohne Druck nach Hause. Für dich war Zuhören heute der richtige Anfang.",
      "Baskı hissetmeden eve gidiyorsun. Senin için bugün doğru başlangıç dinlemekti.",
    ],
  ],
  [
    "Katılımcı iki yeni sözcükle ne yapıyor?",
    [
      "Onları not ediyor.",
      "Onları kitaptan siliyor.",
      "Onlarla sınava giriyor.",
    ],
    "“notierst dir zwei neue Wörter” iki yeni sözcüğü kendin için not aldığını anlatır. Sonraki soru ise anlamayı destekleyen bir sorudur.",
  ],
  [],
  "Dinleyerek açılan arkadaşlık kapısı",
);
scene(
  s,
  "late",
  "Yarım saatlik esneklik",
  [
    [
      "Du schreibst die Telefonnummer vom Lesezeichen ab und rufst im Café an. Lea sagt, dass Emir später kommen kann.",
      "Ayraçtaki telefon numarasını yazıp kafeyi arıyorsun. Lea, Emir’in daha geç gelebileceğini söylüyor.",
    ],
    [
      "Um halb sieben kommt er mit seinem Rucksack herein. Ein freier Stuhl steht schon neben dir.",
      "Altı buçukta sırt çantasıyla içeri giriyor. Yanında boş bir sandalye hazır duruyor.",
    ],
    [
      "Ihr erzählt gemeinsam von einem Buch, das ihr beide kennt. Emir muss nichts nachholen oder erklären.",
      "İkinizin de bildiği bir kitaptan birlikte söz ediyorsunuz. Emir hiçbir şeyi telafi etmek ya da açıklamak zorunda değil.",
    ],
    [
      "Auf dem Heimweg verabredet ihr euch für die nächste Woche. Aus der Einladung ist ein gemeinsamer Plan geworden.",
      "Eve dönerken gelecek hafta için sözleşiyorsunuz. Davet ortak bir plana dönüştü.",
    ],
  ],
  [
    "Emir için önceden ne hazırlanıyor?",
    ["Boş bir sandalye.", "Yazılı bir sınav.", "Başka bir kafeye bilet."],
    "“Ein freier Stuhl steht schon neben dir” cümlesindeki “schon”, sandalyenin Emir gelmeden önce hazır olduğunu gösterir.",
  ],
  [],
  "Sonradan gelen arkadaşın yeri",
);
scene(
  s,
  "home",
  "İki kişilik kitap akşamı",
  [
    [
      "Du gibst Emir das blaue Lesezeichen. Ihr trefft euch am Samstag bei dir und wählt zwei kurze Geschichten aus.",
      "Mavi ayracı Emir’e veriyorsun. Cumartesi senin evinde buluşup iki kısa hikâye seçiyorsunuz.",
    ],
    [
      "Jeder liest eine Seite. Dann sprecht ihr darüber, welche Figur ihr gern kennenlernen würdet.",
      "Her biriniz bir sayfa okuyor. Sonra hangi karakterle tanışmak isteyeceğiniz hakkında konuşuyorsunuz.",
    ],
    [
      "Für den Lesekreis habt ihr heute noch keinen festen Termin. Ihr wollt zuerst ohne Eile miteinander lesen.",
      "Okuma grubu için bugün henüz kesin bir tarihiniz yok. Önce acele etmeden birlikte okumak istiyorsunuz.",
    ],
    [
      "Emir bringt beim nächsten Mal Tee mit. Eine Freundschaft braucht nicht immer einen großen Anfang.",
      "Emir bir dahaki sefere çay getirecek. Bir arkadaşlık her zaman büyük bir başlangıç gerektirmez.",
    ],
  ],
  [
    "İki arkadaş önce ne yapmayı seçiyor?",
    [
      "Kendi hızlarında birlikte okumayı.",
      "Okuma grubunu kapatmayı.",
      "Bütün kitapları değiştirmeyi.",
    ],
    "“zuerst ohne Eile miteinander lesen” önce acele etmeden birlikte okumak demektir. Grup için kesin bir randevu henüz alınmadığı ayrıca belirtilir.",
  ],
  [],
  "Küçük bir masada büyüyen dostluk",
);

s = story(
  "b1-reparatur",
  "Mahallenin Tamir Masası",
  "Ein Samstag im Reparaturcafé",
  "B1",
  "germany",
  "Bir mahalle etkinliğinde yardım iste, deneyimini anlat ve farklı çözüm yollarını karşılaştır. Güvenli sınırlar ve birlikte öğrenme üzerine dört son.",
  "town",
  "Reparatur",
);
scene(
  s,
  "start",
  "Bozuk lambanın ikinci şansı",
  [
    [
      "Seit einigen Wochen wohnst du in einer neuen Nachbarschaft. Heute öffnet im Gemeinschaftshaus zum ersten Mal ein Reparaturcafé.",
      "Birkaç haftadır yeni bir mahallede yaşıyorsun. Bugün toplum merkezinde ilk kez bir tamir kafesi açılıyor.",
    ],
    [
      "Deine Leselampe leuchtet nicht mehr. Auf dem Plakat steht, dass Freiwillige bei kleinen Reparaturen helfen und ihr Wissen teilen möchten.",
      "Okuma lamban artık yanmıyor. Afişte gönüllülerin küçük tamirlerde yardımcı olmak ve bilgilerini paylaşmak istediği yazıyor.",
    ],
    [
      "Am Eingang begrüßt dich Jonas. Er erklärt, dass eine Reparatur nicht immer möglich ist und niemand einen Erfolg versprechen kann.",
      "Girişte Jonas seni karşılıyor. Tamirin her zaman mümkün olmadığını ve hiç kimsenin başarı sözü veremeyeceğini açıklıyor.",
    ],
    [
      "Du kannst zuerst mit einer erfahrenen Helferin über die Lampe sprechen oder am gemeinsamen Tisch nach passenden Ersatzteilen suchen.",
      "Önce deneyimli bir gönüllüyle lamba hakkında konuşabilir ya da ortak masada uygun yedek parça arayabilirsin.",
    ],
  ],
  [
    "Etkinlikte tamir hakkında hangi sınır açıklanıyor?",
    [
      "Her eşyanın onarılacağının garanti edilmediği.",
      "Yalnızca yeni eşyaların kabul edildiği.",
      "Bütün katılımcıların teknisyen olduğu.",
    ],
    "Jonas’ın “nicht immer möglich” ve “niemand … versprechen” sözleri sonuç garantisi olmadığını gösterir. Gönüllü olmak teknisyen olmakla aynı şey değildir.",
  ],
  [
    ["Ich beschreibe zuerst das Problem.", "Önce sorunu anlatırım.", "helper"],
    [
      "Ich schaue mich am Materialtisch um.",
      "Malzeme masasına göz atarım.",
      "parts",
    ],
  ],
);
scene(
  s,
  "helper",
  "Sorunu tarif etmek",
  [
    [
      "Die Helferin Aylin fragt, seit wann die Lampe nicht mehr funktioniert. Du erzählst, dass sie gestern plötzlich ausgegangen ist.",
      "Gönüllü Aylin, lambanın ne zamandan beri çalışmadığını soruyor. Dün aniden söndüğünü anlatıyorsun.",
    ],
    [
      "Sie prüft das Gerät nicht unter Spannung. Zuerst zieht ihr den Stecker, und Aylin erklärt, dass eine elektrische Reparatur Fachkenntnisse erfordert.",
      "Cihazı gerilim altındayken incelemiyor. Önce fişi çekiyorsunuz; Aylin elektrikli cihaz tamirinin uzmanlık gerektirdiğini açıklıyor.",
    ],
    [
      "Bei der äußeren Sichtprüfung entdeckt sie ein beschädigtes Kabel. Sie möchte das Gerät hier nicht öffnen oder provisorisch reparieren.",
      "Dışarıdan yaptığı görsel kontrolde hasarlı bir kablo fark ediyor. Cihazı burada açmak veya geçici olarak onarmak istemiyor.",
    ],
    [
      "Ihr könnt gemeinsam einen Fachbetrieb suchen oder die Lampe mit einem deutlichen Hinweis außer Betrieb nehmen und über eine sichere Alternative sprechen.",
      "Birlikte uzman bir işletme arayabilir veya lambayı açık bir uyarıyla kullanım dışı bırakıp güvenli bir alternatif hakkında konuşabilirsiniz.",
    ],
  ],
  [
    "Aylin neden cihazı açmıyor?",
    [
      "Elektrikli tamirin uzmanlık gerektirdiğini ve sınırlarını gözettiği için.",
      "Katılımcıyla konuşmak istemediği için.",
      "Lambanın yeni olduğunu düşündüğü için.",
    ],
    "Hasarlı kablo ve gerekli uzmanlık birlikte anlatılıyor. Sahne teknik tamir talimatı vermiyor; “nicht öffnen” güvenli sınırı açıkça koyuyor.",
  ],
  [
    [
      "Wir suchen einen Fachbetrieb.",
      "Uzman bir işletme ararız.",
      "professional",
    ],
    [
      "Ich lasse die Lampe vorerst aus.",
      "Lambayı şimdilik kullanmam.",
      "alternative",
    ],
  ],
);
scene(
  s,
  "parts",
  "Parçadan önce bilgi",
  [
    [
      "Am Materialtisch liegen Knöpfe, Stoffreste und Schrauben. Ein Schild bittet darum, Teile nur nach Absprache für eine Reparatur mitzunehmen.",
      "Malzeme masasında düğmeler, kumaş parçaları ve vidalar var. Bir tabela, tamir için parçaların yalnızca konuşup anlaşarak alınmasını istiyor.",
    ],
    [
      "Du findest kein passendes Teil für deine Lampe. Dafür zeigt dir Jonas eine Stofftasche, deren Träger sich gelöst hat.",
      "Lamban için uygun parça bulamıyorsun. Buna karşılık Jonas sana sapı çıkmış bir bez çanta gösteriyor.",
    ],
    [
      "Er fragt, ob du das Nähen schon einmal ausprobiert hast. Du hast wenig Erfahrung, würdest aber gern etwas Einfaches lernen.",
      "Daha önce dikiş dikmeyi deneyip denemediğini soruyor. Deneyimin az ama basit bir şey öğrenmek istiyorsun.",
    ],
    [
      "Du kannst bei der Tasche mitmachen oder die Materialien sortieren, damit andere schneller finden, was sie brauchen.",
      "Çantanın onarımına katılabilir veya diğerlerinin ihtiyaçlarını daha hızlı bulması için malzemeleri düzenleyebilirsin.",
    ],
  ],
  [
    "Lamba için masada ne bulunuyor?",
    [
      "Uygun bir parça bulunmuyor.",
      "Kesin olarak gereken kablo bulunuyor.",
      "Hazır bir yeni lamba bulunuyor.",
    ],
    "“kein passendes Teil” uygun bir parça olmadığını söyler. Sonraki çanta örneği, asıl lambanın onarıldığı anlamına gelmez.",
  ],
  [
    [
      "Ich lerne an der Stofftasche mit.",
      "Bez çantada birlikte öğrenirim.",
      "sewing",
    ],
    ["Ich helfe beim Sortieren.", "Düzenlemeye yardım ederim.", "sorting"],
  ],
);
scene(
  s,
  "professional",
  "Doğru kişiye yönelmek",
  [
    [
      "Aylin notiert die Beschreibung des Problems, aber sie verspricht keine kostenlose Reparatur. Du rufst selbst bei einem Fachbetrieb an.",
      "Aylin sorunun açıklamasını not ediyor ama ücretsiz tamir sözü vermiyor. Uzman işletmeyi kendin arıyorsun.",
    ],
    [
      "Dort fragt man nach dem Modell und bietet dir einen Termin zur Prüfung an. Über mögliche Kosten sollst du dich vor einer Entscheidung informieren.",
      "Orada model soruluyor ve inceleme için bir randevu öneriliyor. Karar vermeden önce olası ücretler hakkında bilgi alman gerekiyor.",
    ],
    [
      "Die Lampe bleibt bis dahin ausgesteckt. Im Reparaturcafé hast du gelernt, ein Problem genauer zu beschreiben und passende Hilfe zu suchen.",
      "Lamba o zamana kadar fişi çekilmiş durumda kalıyor. Tamir kafesinde bir sorunu daha açık anlatmayı ve uygun yardım aramayı öğrendin.",
    ],
    [
      "Am nächsten Samstag möchtest du wiederkommen. Auch wenn die Reparatur noch offen ist, kennst du nun Menschen in deiner Nachbarschaft.",
      "Gelecek cumartesi tekrar gelmek istiyorsun. Tamir konusu henüz sonuçlanmamış olsa da artık mahallende insanlar tanıyorsun.",
    ],
  ],
  [
    "Bu sonun sonunda lamba hakkında ne biliyoruz?",
    [
      "Henüz onarılmadığını, inceleme randevusu önerildiğini.",
      "Ücretsiz olarak yenilendiğini.",
      "Artık kesinlikle güvenli olduğunu.",
    ],
    "Metin yalnızca inceleme randevusundan ve fişin çekili kalmasından söz eder. Sonuç, ücret veya güvenlik garantisi çıkarılamaz.",
  ],
  [],
  "Uzman yardımıyla atılan doğru adım",
);
scene(
  s,
  "alternative",
  "Onarım her zaman bugüne yetişmez",
  [
    [
      "Du legst einen Zettel zur Lampe: Nicht benutzen, Kabel beschädigt. Aylin bestätigt, dass die Reparatur damit noch nicht erledigt ist.",
      "Lambaya bir not koyuyorsun: Kullanmayın, kablo hasarlı. Aylin, bunun tamirin tamamlandığı anlamına gelmediğini doğruluyor.",
    ],
    [
      "Für den heutigen Abend kannst du am hellen Fenster lesen. Jonas bietet dir außerdem an, eine intakte Ersatzlampe auszuleihen.",
      "Bu akşam için aydınlık pencerenin yanında okuyabilirsin. Jonas ayrıca sağlam bir yedek lamba ödünç vermeyi öneriyor.",
    ],
    [
      "Ihr besprecht, wann du sie zurückbringst. Das alte Gerät bleibt unbenutzt, bis du fachkundige Hilfe gefunden hast.",
      "Onu ne zaman geri getireceğini konuşuyorsunuz. Uzman yardımı bulana kadar eski cihaz kullanılmadan kalıyor.",
    ],
    [
      "Du gehst mit einer praktischen Zwischenlösung nach Hause. Hilfe kann auch bedeuten, die eigenen Grenzen ernst zu nehmen.",
      "Pratik bir geçici çözümle eve gidiyorsun. Yardım etmek, kendi sınırlarını ciddiye almak anlamına da gelebilir.",
    ],
  ],
  [
    "Yedek lamba hangi amaçla veriliyor?",
    [
      "Eski cihaz kullanılmadan geçici bir çözüm sağlamak için.",
      "Eski lambanın tamir edildiğini kanıtlamak için.",
      "Hasarlı kabloyu denemek için.",
    ],
    "“Zwischenlösung” geçici çözüm anlamına gelir. Eski cihazın kullanılmadığı ve uzman yardımının hâlâ gerektiği ayrıca belirtilir.",
  ],
  [],
  "Güvenli bir geçici çözüm",
);
scene(
  s,
  "sewing",
  "Birlikte atılan ilk dikiş",
  [
    [
      "Vor der Reparatur der Stofftasche zeigt Jonas dir an einem Reststück eine einfache Naht. Du darfst zunächst langsam üben.",
      "Bez çantanın tamirinden önce Jonas sana artık bir kumaş parçasında basit bir dikiş gösteriyor. Önce yavaşça alıştırma yapabiliyorsun.",
    ],
    [
      "Du fragst nach, wenn du einen Schritt nicht verstehst. Eine andere Teilnehmerin hält den Stoff, damit er nicht verrutscht.",
      "Bir adımı anlamadığında tekrar soruyorsun. Başka bir katılımcı, kaymaması için kumaşı tutuyor.",
    ],
    [
      "Gemeinsam befestigt ihr den Träger und prüft vorsichtig die Naht. Die Tasche kann weiter benutzt werden, die Lampe ist dagegen noch nicht repariert.",
      "Sapı birlikte tutturup dikişi dikkatlice kontrol ediyorsunuz. Çanta kullanılmaya devam edebilir; lamba ise henüz tamir edilmedi.",
    ],
    [
      "Du nimmst ein kleines Übungsstück mit. Beim nächsten Treffen willst du zeigen, was du inzwischen gelernt hast.",
      "Yanına küçük bir alıştırma parçası alıyorsun. Bir sonraki buluşmada bu arada öğrendiklerini göstermek istiyorsun.",
    ],
  ],
  [
    "Bu dalda hangi eşya onarılıyor?",
    ["Bez çanta.", "Elektrikli lamba.", "Kafenin kapısı."],
    "“den Träger befestigen” çantanın sapını tutturmayı anlatır. “dagegen” karşıtlık kurar ve lambanın hâlâ onarılmadığını vurgular.",
  ],
  [],
  "Dikişlerle kurulan komşuluk",
);
scene(
  s,
  "sorting",
  "Görünmeyen emeğin masası",
  [
    [
      "Du sortierst die Materialien für die Reparatur nach Art und Größe. Dabei entdeckst du mehrere kleine Schachteln ohne Beschriftung.",
      "Tamir malzemelerini türüne ve boyutuna göre düzenliyorsun. Bu sırada üzerinde etiket olmayan birkaç küçük kutu fark ediyorsun.",
    ],
    [
      "Mit Jonas schreibst du neue Etiketten. Unbekannte Teile legt ihr getrennt hin, statt ihre Funktion zu erraten.",
      "Jonas’la yeni etiketler yazıyorsun. İşlevlerini tahmin etmek yerine bilinmeyen parçaları ayrı koyuyorsunuz.",
    ],
    [
      "Eine Teilnehmerin findet nun sofort die Knöpfe für ihre Jacke. Sie bedankt sich und fragt, ob du nächste Woche wieder hilfst.",
      "Bir katılımcı artık ceketinin düğmelerini hemen buluyor. Teşekkür edip gelecek hafta tekrar yardım edip etmeyeceğini soruyor.",
    ],
    [
      "Deine Lampe bleibt zwar kaputt, doch du hast einen Platz in der Gruppe gefunden. Auch Ordnung kann gemeinsame Arbeit leichter machen.",
      "Lamban hâlâ bozuk olsa da grupta kendine bir yer buldun. Düzen sağlamak da ortak işi kolaylaştırabilir.",
    ],
  ],
  [
    "İşlevi bilinmeyen parçalara ne yapılıyor?",
    [
      "Tahmin edilmeden ayrı konuluyor.",
      "Hepsine aynı etiket yapıştırılıyor.",
      "Lambaya takılıyor.",
    ],
    "“statt … zu erraten” tahmin etmek yerine ifadesini kurar. Grup, parçaları yanlış tanıtmak yerine ayrı tutmayı seçiyor.",
  ],
  [],
  "Düzenleyerek katkıda bulunmak",
);

s = story(
  "b2-vermerk",
  "Kütüphanedeki Kurşun Kalem İzi",
  "Der Vermerk im Lesesaal",
  "B2",
  "mystery",
  "Bir sergi kataloğundaki notu araştır: gözlemle varsayımı ayır, kaynakları karşılaştır ve dört farklı çözüm yolunu gör.",
  "night",
  "Vermerk",
);
scene(
  s,
  "start",
  "Tarihsiz bir kenar notu",
  [
    [
      "Während du für eine kleine Ausstellung recherchierst, stößt du auf einen alten Katalog mit einem handschriftlichen Vermerk: Der Titel kam erst später.",
      "Küçük bir sergi için araştırma yaparken, üzerinde el yazısıyla “Başlık sonradan eklendi” notu bulunan eski bir kataloğa rastlıyorsun.",
    ],
    [
      "Neben dem Vermerk steht weder ein Name noch ein Datum. Auf der gegenüberliegenden Seite ist ein Foto der Künstlerin Mara Stein abgedruckt.",
      "Notun yanında ne bir isim ne de bir tarih var. Karşı sayfada sanatçı Mara Stein’ın bir fotoğrafı basılı.",
    ],
    [
      "Dein Kollege vermutet sofort, die Künstlerin habe den Titel selbst geändert. Der Katalog allein beweist diese Vermutung jedoch nicht.",
      "Meslektaşın hemen, başlığı sanatçının kendisinin değiştirdiğini düşünüyor. Ancak katalog tek başına bu varsayımı kanıtlamıyor.",
    ],
    [
      "Du kannst zunächst die verschiedenen Katalogausgaben vergleichen oder die Bibliothekarin fragen, woher das Exemplar stammt.",
      "Önce kataloğun farklı baskılarını karşılaştırabilir veya kütüphaneciye bu nüshanın nereden geldiğini sorabilirsin.",
    ],
  ],
  [
    "Başlangıçta kesin olarak bilinen nedir?",
    [
      "Notta yazar adı ve tarih bulunmadığı.",
      "Notu sanatçının yazdığı.",
      "Başlığın kasıtlı olarak sahteleştirildiği.",
    ],
    "Metin, notun imzasız ve tarihsiz olduğunu açıkça söyler. Meslektaşın düşüncesi “vermutet” ile verildiği için doğrulanmış bilgi değildir.",
  ],
  [
    ["Ich vergleiche die Ausgaben.", "Baskıları karşılaştırırım.", "editions"],
    [
      "Ich frage nach der Herkunft des Buches.",
      "Kitabın kaynağını sorarım.",
      "origin",
    ],
  ],
);
scene(
  s,
  "editions",
  "Aynı resim, iki başlık",
  [
    [
      "In der ersten Ausgabe heißt das Bild Abend am Fluss, in der zweiten trägt es den Titel Rückkehr. Die Abbildung selbst ist unverändert.",
      "İlk baskıda resmin adı Nehir Kıyısında Akşam, ikinci baskıda ise Dönüş. Görselin kendisi değişmemiş.",
    ],
    [
      "Ein gedruckter Vermerk nennt eine überarbeitete Werkliste, erklärt aber nicht, wer den neuen Titel vorgeschlagen hat.",
      "Basılı bir not, gözden geçirilmiş bir eser listesinden söz ediyor ama yeni başlığı kimin önerdiğini açıklamıyor.",
    ],
    [
      "Im Archivverzeichnis findest du Hinweise auf einen Briefwechsel zwischen der Künstlerin und dem damaligen Kurator. Die Briefe sind noch nicht ausgewertet.",
      "Arşiv dizininde sanatçıyla dönemin küratörü arasındaki yazışmaya ilişkin kayıtlar buluyorsun. Mektuplar henüz değerlendirilmemiş.",
    ],
    [
      "Du kannst die Briefe unter den geltenden Zugangsregeln prüfen lassen oder die Ausstellung vorerst nur um die gesicherte Titeländerung ergänzen.",
      "Mektupların geçerli erişim kuralları çerçevesinde incelenmesini isteyebilir veya sergiye şimdilik yalnızca doğrulanmış başlık değişikliğini ekleyebilirsin.",
    ],
  ],
  [
    "Baskıların karşılaştırılması neyi doğruluyor?",
    [
      "Resmin başlığının değiştiğini.",
      "Başlığı mutlaka küratörün yazdığını.",
      "Resmin yeniden boyandığını.",
    ],
    "İki başlık doğrudan karşılaştırılabiliyor; görsel aynı kalıyor. “erklärt aber nicht” ise değişikliği kimin yaptığı sorusunun açık kaldığını belirtir.",
  ],
  [
    [
      "Ich lasse den Briefwechsel prüfen.",
      "Yazışmanın incelenmesini isterim.",
      "letters",
    ],
    [
      "Ich kennzeichne die offene Frage.",
      "Açık kalan soruyu belirtirim.",
      "cautious",
    ],
  ],
);
scene(
  s,
  "origin",
  "Bir kitabın dolaşan hikâyesi",
  [
    [
      "Die Bibliothekarin erklärt, dass der Katalog aus dem Nachlass einer Übersetzerin stammt. Diese hatte später an einer Führung durch die Ausstellung teilgenommen.",
      "Kütüphaneci, kataloğun bir çevirmenin geride bıraktığı koleksiyondan geldiğini açıklıyor. Çevirmen daha sonra sergideki bir rehberli geziye katılmış.",
    ],
    [
      "Der handschriftliche Vermerk könnte also eine persönliche Gesprächsnotiz sein. Ob er auf einer verlässlichen Aussage beruht, lässt sich daraus noch nicht ableiten.",
      "El yazısı not bu nedenle kişisel bir konuşma notu olabilir. Güvenilir bir açıklamaya dayanıp dayanmadığı buradan henüz çıkarılamaz.",
    ],
    [
      "Im Buch liegt außerdem eine Einladung mit dem Namen des damaligen Museumsmitarbeiters. Seine öffentlich zugänglichen Erinnerungen erwähnen die Führung.",
      "Kitabın içinde dönemin müze çalışanının adının bulunduğu bir davetiye de var. Çalışanın kamuya açık anıları bu rehberli geziden söz ediyor.",
    ],
    [
      "Du kannst diese Quelle mit anderen Belegen vergleichen oder die Fundgeschichte als offene Recherchefrage in die Ausstellung aufnehmen.",
      "Bu kaynağı başka kanıtlarla karşılaştırabilir veya buluntunun hikâyesini sergiye açık bir araştırma sorusu olarak dahil edebilirsin.",
    ],
  ],
  [
    "Kataloğun kökeni not hakkında ne sağlıyor?",
    [
      "Olası bir bağlam, fakat kesin doğrulama değil.",
      "Sanatçının imzasının doğrulandığını.",
      "Başlık değişikliğinin hiç yaşanmadığını.",
    ],
    "“könnte” olasılık bildirir; “noch nicht ableiten” kesin sonuca varılamadığını söyler. Kaynağın geçmişini bilmek, içeriğini otomatik doğrulamaz.",
  ],
  [
    [
      "Ich suche unabhängige Belege.",
      "Bağımsız kanıtlar ararım.",
      "corroborate",
    ],
    [
      "Ich mache die Recherche sichtbar.",
      "Araştırma sürecini görünür kılarım.",
      "open",
    ],
  ],
);
scene(
  s,
  "letters",
  "Tarihin yerini bulan mektup",
  [
    [
      "Die Archivmitarbeiterin findet einen datierten Brief, in dem Mara Stein den Titel Rückkehr ausdrücklich vorschlägt. Ein zweiter Brief bestätigt die Übernahme in die Werkliste.",
      "Arşiv görevlisi, Mara Stein’ın Dönüş başlığını açıkça önerdiği tarihli bir mektup buluyor. İkinci bir mektup da başlığın eser listesine alınmasını doğruluyor.",
    ],
    [
      "Der Vermerk im Katalog war damit inhaltlich auf einer richtigen Spur. Wer ihn geschrieben hat, bleibt trotzdem ungeklärt.",
      "Böylece katalogdaki not içerik bakımından doğru bir iz üzerinde çıkıyor. Ancak notu kimin yazdığı yine de açıklığa kavuşmuyor.",
    ],
    [
      "Du zitierst die erlaubten Belegstellen mit Herkunft und Datum. Persönliche Details, die für die Titelfrage nichts beitragen, lässt du weg.",
      "Kullanımına izin verilen kanıt bölümlerini kaynak ve tarihleriyle aktarıyorsun. Başlık sorusuna katkı sağlamayan kişisel ayrıntıları dışarıda bırakıyorsun.",
    ],
    [
      "Die Ausstellung erzählt nun von einer belegten Entscheidung der Künstlerin. Die Handschrift selbst wird nicht plötzlich zum Beweis ihrer Urheberschaft.",
      "Sergi artık sanatçının belgelenmiş bir kararını anlatıyor. El yazısı ise birdenbire notun yazarlığının kanıtına dönüşmüyor.",
    ],
  ],
  [
    "Mektuplar hangi ayrımı korumayı gerektiriyor?",
    [
      "Başlığın kaynağı ile el yazısı notun yazarını ayırmayı.",
      "Bütün kişisel ayrıntıları yayımlamayı.",
      "Katalogdaki her cümleyi sanatçıya ait saymayı.",
    ],
    "Mektuplar sanatçının başlık önerisini kanıtlar; imzasız notun yazarını kanıtlamaz. Aynı konuda iki ayrı yazarlık sorusu bulunmaktadır.",
  ],
  [],
  "Belgesi bulunan değişiklik",
);
scene(
  s,
  "cautious",
  "Açık bırakılan boşluk",
  [
    [
      "Du übernimmst in den Ausstellungstext, dass sich der Titel zwischen zwei Ausgaben geändert hat. Ein kurzer Vermerk nennt die noch ungeklärte Verantwortlichkeit.",
      "Sergi metnine başlığın iki baskı arasında değiştiğini yazıyorsun. Kısa bir not, sorumlunun henüz belirlenemediğini söylüyor.",
    ],
    [
      "Dein Kollege möchte die spannendere Behauptung trotzdem verwenden. Du erklärst, dass eine anschauliche Geschichte fehlende Belege nicht ersetzen kann.",
      "Meslektaşın daha heyecanlı iddiayı yine de kullanmak istiyor. Canlı bir anlatının eksik kanıtların yerini alamayacağını açıklıyorsun.",
    ],
    [
      "Die Recherche wird nicht abgebrochen. Ihr notiert lediglich, welche Quelle ihr als Nächstes prüfen wollt und weshalb die bisherige Aussage begrenzt bleibt.",
      "Araştırma bırakılmıyor. Yalnızca sırada hangi kaynağı inceleyeceğinizi ve mevcut açıklamanın neden sınırlı kaldığını not ediyorsunuz.",
    ],
    [
      "Das Publikum bekommt eine klare Information statt einer scheinbaren Gewissheit. Die offene Frage wird zum ehrlichen Teil der Ausstellung.",
      "İzleyiciye görünürde kesinlik yerine açık bir bilgi sunuluyor. Açık kalan soru serginin dürüst bir parçası oluyor.",
    ],
  ],
  [
    "Araştırmanın durumu bu sonda nasıl?",
    [
      "Devam edecek, fakat mevcut iddia sınırlandırılıyor.",
      "Bütün sorular kesin olarak çözülüyor.",
      "Kaynaklara artık gerek olmadığı kabul ediliyor.",
    ],
    "“nicht abgebrochen” araştırmanın bırakılmadığını söyler. Yalnızca şu anda desteklenebilen açıklama ile sonraki araştırma adımı ayrılır.",
  ],
  [],
  "Belirsizliği dürüstçe anlatmak",
);
scene(
  s,
  "corroborate",
  "Birbirini tamamlayan kaynaklar",
  [
    [
      "Du findest einen zeitgenössischen Zeitungsbericht, der den Titelwechsel einer Anregung des Kurators zuschreibt. Das widerspricht zunächst der späteren Erinnerung des Museumsmitarbeiters.",
      "Dönemin bir gazete haberini buluyorsun; haber başlık değişikliğini küratörün önerisine bağlıyor. Bu, müze çalışanının daha sonraki anısıyla başlangıçta çelişiyor.",
    ],
    [
      "Ein Vermerk in einer Sitzungsnotiz zeigt jedoch, dass Vorschlag und endgültige Zustimmung von verschiedenen Personen stammen können. Die Rollen müssen getrennt betrachtet werden.",
      "Bir toplantı notundaki açıklama ise önerinin ve son onayın farklı kişilerden gelebileceğini gösteriyor. Roller ayrı ayrı ele alınmalı.",
    ],
    [
      "Ihr formuliert die Erklärung neu: Der Kurator regte den Wechsel an, die Künstlerin stimmte zu. Beide Quellen werden mit ihren Grenzen genannt.",
      "Açıklamayı yeniden kuruyorsunuz: Değişikliği küratör önerdi, sanatçı onayladı. Her iki kaynak da sınırlarıyla birlikte belirtiliyor.",
    ],
    [
      "Das Rätsel führt nicht zu einer einzigen heldenhaften Entdeckung. Es zeigt, wie aus mehreren unvollständigen Aussagen ein genaueres Bild entsteht.",
      "Gizem tek bir kahramanca keşifle bitmiyor. Birkaç eksik açıklamadan nasıl daha doğru bir tablo oluştuğunu gösteriyor.",
    ],
  ],
  [
    "Kaynaklar nasıl uzlaştırılıyor?",
    [
      "Öneri ile son onay farklı roller olarak ele alınarak.",
      "Geç tarihli bütün anlatılar silinerek.",
      "Gazete haberi hiç okunmamış sayılarak.",
    ],
    "Metin “Vorschlag” ve “endgültige Zustimmung” ayrımını kurar. Bu ayrım iki kişiye ilişkin bilgiyi zorla tek kişiye mal etmeden açıklar.",
  ],
  [],
  "Birden fazla sesle çözülen gizem",
);
scene(
  s,
  "open",
  "Ziyaretçinin de gördüğü araştırma",
  [
    [
      "Du zeigst eine genehmigte Abbildung der Katalogseite und setzt darunter einen Vermerk: Wer schrieb diese Zeilen, und worauf stützte sich die Aussage?",
      "Katalog sayfasının kullanımına izin verilmiş görselini gösterip altına bir not koyuyorsun: Bu satırları kim yazdı ve açıklama neye dayanıyordu?",
    ],
    [
      "Daneben stehen nur die gesicherten Informationen zur Herkunft des Exemplars. Eine Besucherin erinnert sich an eine ähnliche Führung und bietet einen weiteren Hinweis an.",
      "Yanında yalnızca nüshanın kaynağına ilişkin doğrulanmış bilgiler bulunuyor. Bir ziyaretçi benzer bir rehberli geziyi hatırlayıp ek bir ipucu sunuyor.",
    ],
    [
      "Ihr nehmt ihren Hinweis auf, prüft ihn aber erst, bevor er in den Ausstellungstext gelangt. Eine Erinnerung ist ein Ausgangspunkt, nicht schon ein Beleg.",
      "İpucunu not alıyorsunuz ama sergi metnine girmeden önce inceliyorsunuz. Bir anı bir başlangıç noktasıdır; kendi başına kanıt sayılmaz.",
    ],
    [
      "Die Ausstellung bleibt offen für neue Erkenntnisse. Dass die Frage vorläufig ungelöst ist, wird weder versteckt noch dramatisch ausgeschmückt.",
      "Sergi yeni bulgulara açık kalıyor. Sorunun şimdilik çözülememiş olduğu ne gizleniyor ne de dramatik biçimde süsleniyor.",
    ],
  ],
  [
    "Ziyaretçinin hatırladığı olay nasıl değerlendiriliyor?",
    [
      "İncelenecek yeni bir ipucu olarak.",
      "Hemen kesin kanıt olarak.",
      "Bütün diğer kaynakları geçersiz sayan sonuç olarak.",
    ],
    "“prüft ihn aber erst” ifadesi yayımdan önce kontrol gerektiğini belirtir. Sonraki cümle de anı ile kanıtı açıkça ayırır.",
  ],
  [],
  "Açık kalan ama ilerleyen araştırma",
);

s = story(
  "c1-widerhall",
  "Hatıraları Dinleyen Ağaç",
  "Der Baum, der Erinnerungen hörte",
  "C1",
  "fantasy",
  "Bir ağacın geri verdiği sesler arasında hatırlama, yorum ve rıza kavramlarını tart. Dört sonun hiçbiri kayıp zamanı bütünüyle geri getirmiyor.",
  "garden",
  "Widerhall",
);
scene(
  s,
  "start",
  "Yaprakların taşıdığı ses",
  [
    [
      "Am Rand einer verlassenen Gartenanlage steht ein Baum, dessen Blätter nicht rauschen, sondern Bruchstücke vergangener Gespräche wiedergeben. Niemand weiß, weshalb er gerade jetzt zu sprechen beginnt.",
      "Terk edilmiş bir bahçenin kıyısında yaprakları hışırdamak yerine geçmiş konuşmaların parçalarını tekrarlayan bir ağaç duruyor. Ağacın neden tam şimdi konuşmaya başladığını kimse bilmiyor.",
    ],
    [
      "Als du näher trittst, erkennst du den Widerhall eines Satzes, den deine Großmutter oft gesagt hat. Die Stimme klingt vertraut, doch der Zusammenhang bleibt unvollständig.",
      "Yaklaştığında büyükannenin sıkça söylediği bir cümlenin yankısını tanıyorsun. Ses tanıdık geliyor ama bağlam eksik kalıyor.",
    ],
    [
      "Die Gärtnerin Nela warnt dich davor, den Baum für ein verlässliches Archiv zu halten. Er bewahre, so sagt sie, keine vollständigen Leben, sondern das, was an diesem Ort nachklinge.",
      "Bahçıvan Nela, ağacı güvenilir bir arşiv saymaman konusunda seni uyarıyor. Ağacın bütün yaşamları değil, burada yankılanmayı sürdüren şeyleri sakladığını söylüyor.",
    ],
    [
      "Du kannst nach der Herkunft deiner vertrauten Stimme fragen oder zunächst zuhören, welche anderen Erinnerungen zwischen den Zweigen liegen.",
      "Tanıdığın sesin kaynağını sorabilir veya önce dallar arasında başka hangi anıların bulunduğunu dinleyebilirsin.",
    ],
  ],
  [
    "Nela ağacın niteliğini nasıl sınırlandırıyor?",
    [
      "Eksiksiz bir yaşam arşivi olmadığını belirterek.",
      "Her sesi kesinlikle doğru kişiye bağlayarak.",
      "Bütün geçmişi geri getireceğini söyleyerek.",
    ],
    "Nela’nın “keine vollständigen Leben, sondern … nachklinge” karşıtlığı, duyulan seslerin parçalı niteliğini vurgular. Tanıdıklık güvenilirliğin kanıtı değildir.",
  ],
  [
    [
      "Ich frage nach der vertrauten Stimme.",
      "Tanıdık sesin kaynağını sorarım.",
      "voice",
    ],
    [
      "Ich höre zuerst den anderen Stimmen zu.",
      "Önce diğer sesleri dinlerim.",
      "others",
    ],
  ],
);
scene(
  s,
  "voice",
  "Bir cümlenin değişen anlamı",
  [
    [
      "Der Baum wiederholt den Satz: Du darfst noch einmal anfangen. Je länger du zuhörst, desto weniger sicher bist du, ob er als Trost oder als Aufforderung gemeint war.",
      "Ağaç şu cümleyi tekrarlıyor: Bir kez daha başlayabilirsin. Dinledikçe bunun teselli mi yoksa bir çağrı mı olduğundan daha az emin oluyorsun.",
    ],
    [
      "Nela erklärt, ein Widerhall könne eine Stimme bewahren, ohne ihre ursprüngliche Absicht festzuhalten. Was du darin hörst, werde auch von deiner eigenen Gegenwart geprägt.",
      "Nela, bir yankının asıl niyeti sabitlemeden bir sesi koruyabileceğini açıklıyor. Seste duyduğun şeyin kendi bugünün tarafından da biçimlendiğini söylüyor.",
    ],
    [
      "Du könntest den Satz immer wieder abrufen, bis er alles andere überlagert. Oder du könntest ihn als Fragment annehmen und daneben deine eigene Erinnerung erzählen.",
      "Cümleyi, diğer her şeyi bastırana kadar tekrar tekrar çağırabilirsin. Ya da onu bir parça olarak kabul edip yanına kendi anını koyabilirsin.",
    ],
    [
      "Der Baum nimmt dir die Entscheidung nicht ab. Er öffnet lediglich einen Raum, in dem Wiederholung und Weitererzählen unterschiedliche Wege anbieten.",
      "Ağaç senin yerine karar vermiyor. Yalnızca tekrarın ve anlatıyı sürdürmenin farklı yollar sunduğu bir alan açıyor.",
    ],
  ],
  [
    "Tanıdık cümlenin yorumu neden değişebilir?",
    [
      "Dinleyenin bugünkü deneyimleri de yoruma katıldığı için.",
      "Ağaç cümlenin bütün bağlamını açıkladığı için.",
      "Nela cümlenin kesin anlamını ilan ettiği için.",
    ],
    "“von deiner eigenen Gegenwart geprägt” bugünün yoruma etkisini belirtir. Sesin korunmasıyla başlangıçtaki niyetin bilinmesi aynı şey değildir.",
  ],
  [
    [
      "Ich erzähle meine eigene Erinnerung dazu.",
      "Yanına kendi anımı anlatırım.",
      "retell",
    ],
    [
      "Ich bitte um eine letzte Wiederholung.",
      "Son bir kez tekrarlanmasını isterim.",
      "farewell",
    ],
  ],
);
scene(
  s,
  "others",
  "Bahçedeki başkalarının hatıraları",
  [
    [
      "Zwischen den Zweigen hörst du einen Streit, ein Kinderlachen und den Widerhall eines Versprechens. Nicht jede Stimme scheint gehört werden zu wollen.",
      "Dallar arasında bir tartışma, bir çocuk kahkahası ve bir sözün yankısını duyuyorsun. Her ses duyulmak istiyormuş gibi görünmüyor.",
    ],
    [
      "Nela erzählt, dass einige Menschen ihre Erinnerungen freiwillig dem Baum anvertraut hätten, während andere Gespräche nur zufällig an diesem Ort stattgefunden hätten.",
      "Nela, bazı insanların anılarını isteyerek ağaca emanet ettiğini, diğer konuşmaların ise yalnızca tesadüfen burada gerçekleştiğini anlatıyor.",
    ],
    [
      "Die Magie unterscheidet diese Fälle nicht von selbst. Deshalb hat die Gärtnerin bisher niemandem erlaubt, die Stimmen öffentlich vorzuführen.",
      "Büyü bu durumları kendiliğinden ayırt etmiyor. Bu nedenle bahçıvan şimdiye kadar hiç kimsenin sesleri halka açık biçimde sunmasına izin vermemiş.",
    ],
    [
      "Du kannst mit ihr Regeln für einen geschützten Ort entwickeln oder die hörbaren Stimmen vorerst durch neue Bäume und Abstand abschirmen.",
      "Onunla korunaklı bir alan için kurallar geliştirebilir veya duyulan sesleri şimdilik yeni ağaçlar ve mesafe yoluyla perdeleyebilirsin.",
    ],
  ],
  [
    "Bahçıvan neden halka açık gösterime izin vermiyor?",
    [
      "Gönüllü paylaşımla tesadüfen duyulan konuşmalar ayrılmadığı için.",
      "Bütün anıların zaten herkesçe bilindiği için.",
      "Yalnızca sessiz bir bahçe istediği için.",
    ],
    "Sorun yalnızca ses düzeyi değildir. Nela, anılarını isteyerek paylaşanlarla tesadüfen konuşanlar arasındaki farkı gözetmeye çalışır.",
  ],
  [
    [
      "Wir vereinbaren Regeln für das Zuhören.",
      "Dinlemek için kurallar belirleriz.",
      "rules",
    ],
    [
      "Wir schaffen zunächst einen geschützten Abstand.",
      "Önce korunaklı bir mesafe oluştururuz.",
      "distance",
    ],
  ],
);
scene(
  s,
  "retell",
  "Eksik sesin yanına kendi sesin",
  [
    [
      "Du erzählst von einem Nachmittag, an dem deine Großmutter denselben Satz zu dir gesagt hatte. Der Baum antwortet nicht mit einem Beweis, sondern mit einem leisen Widerhall.",
      "Büyükannenin aynı cümleyi sana söylediği bir öğleden sonrayı anlatıyorsun. Ağaç bir kanıtla değil, hafif bir yankıyla karşılık veriyor.",
    ],
    [
      "Während du sprichst, merkst du, welche Einzelheiten du sicher erinnerst und welche du später ergänzt hast. Beides kann Bedeutung tragen, ohne dass es miteinander verwechselt werden muss.",
      "Konuşurken hangi ayrıntıları kesin hatırladığını, hangilerini sonradan eklediğini fark ediyorsun. Birbirine karıştırılmadan ikisi de anlam taşıyabilir.",
    ],
    [
      "Nela bindet einen unbeschriebenen Faden an einen Zweig. Er soll dich nicht festhalten, sondern daran erinnern, dass deine Geschichte noch weitergeht.",
      "Nela bir dala üzerinde yazı olmayan bir ip bağlıyor. Amaç seni oraya bağlamak değil, hikâyenin hâlâ sürdüğünü hatırlatmak.",
    ],
    [
      "Du verlässt die Anlage, ohne die Vergangenheit vollständig rekonstruiert zu haben. Mitgenommen hast du die Freiheit, aus einem Fragment kein abgeschlossenes Leben machen zu müssen.",
      "Geçmişi bütünüyle yeniden kurmadan bahçeden ayrılıyorsun. Yanına aldığın şey, tek bir parçayı tamamlanmış bir yaşama dönüştürmek zorunda olmama özgürlüğü.",
    ],
  ],
  [
    "Bu son hangi kazanımı öne çıkarıyor?",
    [
      "Hatırlananla sonradan ekleneni ayırt ederek anlatıyı sürdürmeyi.",
      "Ağacın bütün geçmişi kanıtladığını.",
      "Kişisel anıların artık değersiz olduğunu.",
    ],
    "“sicher erinnerst” ile “später ergänzt” ayrımı korunur. Son, eksiksiz yeniden kurma yerine parçalı bir geçmişle ilişki kurabilmeyi vurgular.",
  ],
  [],
  "Hatırayı sürdürmenin özgürlüğü",
);
scene(
  s,
  "farewell",
  "Tekrarın sonundaki sessizlik",
  [
    [
      "Du bittest den Baum um eine letzte Wiederholung. Diesmal hörst du dem Widerhall zu, ohne ihn auf eine einzige Bedeutung festlegen zu wollen.",
      "Ağaçtan son bir tekrar istiyorsun. Bu kez yankıyı tek bir anlama sabitlemeye çalışmadan dinliyorsun.",
    ],
    [
      "Als die Stimme verstummt, lässt Nela die Stille stehen. Sie füllt sie weder mit einer Erklärung noch mit dem Versprechen, dass du jederzeit alles zurückholen könntest.",
      "Ses sustuğunda Nela sessizliğe alan bırakıyor. Onu ne bir açıklamayla ne de her şeyi istediğin zaman geri getirebileceğin sözüyle dolduruyor.",
    ],
    [
      "Du verabschiedest dich nicht von deiner Großmutter, als wäre sie im Baum eingeschlossen. Du verabschiedest dich von der Erwartung, eine Stimme könne jeden Verlust aufheben.",
      "Büyükannen ağacın içine hapsolmuş gibi ondan vedalaşmıyorsun. Bir sesin her kaybı ortadan kaldırabileceği beklentisine veda ediyorsun.",
    ],
    [
      "Auf dem Heimweg bleibt der Satz bei dir, aber er bestimmt nicht mehr jeden Gedanken. Er ist eine Möglichkeit geworden, keine Anweisung.",
      "Eve dönerken cümle seninle kalıyor ama artık her düşünceni belirlemiyor. Bir talimat değil, bir olasılık haline geldi.",
    ],
  ],
  [
    "Veda burada neye yöneliktir?",
    [
      "Bir sesin bütün kaybı gidereceği beklentisine.",
      "Büyükannenin gerçekten ağaca hapsedilmesine.",
      "Hatırlamanın her biçiminden vazgeçmeye.",
    ],
    "Metin, büyükanneye ağacın içindeymiş gibi veda edilmediğini açıkça söyler. Bırakılan şey hatıra değil, sesin her kaybı gidereceği beklentisidir.",
  ],
  [],
  "Yankıdan sonra kalan alan",
);
scene(
  s,
  "rules",
  "Dinlemenin sorumluluğu",
  [
    [
      "Ihr besprecht, wie sich freiwillig geteilte Erinnerungen von unbeabsichtigt aufgefangenen Gesprächen trennen ließen. Ein angenehmer Widerhall allein soll kein Grund sein, etwas weiterzugeben.",
      "Gönüllü olarak paylaşılan anıların istemeden yakalanan konuşmalardan nasıl ayrılabileceğini konuşuyorsunuz. Hoş bir yankı tek başına bir şeyi aktarma gerekçesi sayılmamalı.",
    ],
    [
      "Nela sammelt keine Namen oder Lebensgeschichten auf Vorrat. Wer den Ort besucht, soll selbst bestimmen können, ob überhaupt etwas erzählt oder bewahrt wird.",
      "Nela önceden isim veya yaşam öyküsü toplamıyor. Mekânı ziyaret eden kişi, herhangi bir şey anlatılıp saklanıp saklanmayacağına kendisi karar verebilmeli.",
    ],
    [
      "Der Baum wird nicht zum öffentlichen Schauspiel. Ihr schafft kleine Zeiten des Zuhörens, in denen Fragen erlaubt sind und ein Nein ohne Begründung gilt.",
      "Ağaç halka açık bir gösteriye dönüşmüyor. Soruların sorulabildiği ve hayır demenin gerekçe gerektirmediği küçük dinleme zamanları oluşturuyorsunuz.",
    ],
    [
      "Damit ist nicht jede Schwierigkeit gelöst. Doch die Magie muss sich nun an den Menschen messen lassen, statt dass die Menschen sich ihrer Wirkung unterordnen.",
      "Böylece her güçlük çözülmüş olmuyor. Ancak artık insanların büyünün etkisine boyun eğmesi yerine büyünün insanlara göre değerlendirilmesi gerekiyor.",
    ],
  ],
  [
    "Kuralların temel yaklaşımı hangisi?",
    [
      "İnsanın paylaşmama kararını da korumak.",
      "Hoş duyulan her sesi yayımlamak.",
      "Ziyaretçilerden önceden bütün anılarını toplamak.",
    ],
    "“ein Nein ohne Begründung gilt” gerekçesiz bir hayırın da geçerli olduğunu belirtir. Maginin varlığı, kişinin tercihinin önüne geçirilmez.",
  ],
  [],
  "Rızayla korunan masal bahçesi",
);
scene(
  s,
  "distance",
  "Koruyucu bir sessizlik kuşağı",
  [
    [
      "Ihr pflanzt junge Sträucher um den alten Baum. Je größer der Abstand zum Weg wird, desto schwächer ist der Widerhall dort zu hören.",
      "Yaşlı ağacın çevresine genç çalılar dikiyorsunuz. Yoldan uzaklık arttıkça yankı orada daha az duyuluyor.",
    ],
    [
      "Die Erinnerungen werden nicht gelöscht, aber sie begegnen Vorübergehenden nicht länger ungefragt. Nela kennzeichnet den Bereich als stillen Garten und verzichtet auf neugierig machende Einzelheiten.",
      "Anılar silinmiyor ama artık yoldan geçenlerin karşısına istenmeden çıkmıyor. Nela alanı sessiz bahçe olarak işaretliyor ve merak uyandıran ayrıntılar vermiyor.",
    ],
    [
      "Du weißt, dass Abstand allein die Frage nach Zustimmung nicht beantwortet. Er verhindert vorerst, dass aus einem ungelösten Problem eine tägliche Vorführung wird.",
      "Tek başına mesafenin rıza sorusunu yanıtlamadığını biliyorsun. Şimdilik çözülememiş bir sorunun günlük bir gösteriye dönüşmesini önlüyor.",
    ],
    [
      "Später wollt ihr über weitere Schritte sprechen. Heute besteht eure Entscheidung darin, nicht alles Hörbare sofort verfügbar zu machen.",
      "Daha sonra başka adımları konuşmak istiyorsunuz. Bugünkü kararınız, duyulabilen her şeyi hemen erişilebilir hale getirmemek.",
    ],
  ],
  [
    "Mesafe oluşturmanın sınırı nedir?",
    [
      "Rıza sorununu tek başına çözmemesi.",
      "Bütün anıları kesin olarak silmesi.",
      "Sesleri daha geniş bir kitleye ulaştırması.",
    ],
    "“Abstand allein … nicht beantwortet” mesafenin sınırlı bir önlem olduğunu belirtir. Karar, sorunu çözmüş gibi yapmak yerine yayılmayı şimdilik azaltır.",
  ],
  [],
  "Hemen açılmayan bir kapı",
);

s = story(
  "c2-urheberschaft",
  "Toplantı Tutanaklarının Arasında",
  "Zwischen Entwurf und Unterschrift",
  "C2",
  "work",
  "Bir ekip metninde görünmeyen katkıları araştır. Söylenenle ima edileni, yazarlıkla sorumluluğu ve uzlaşmayla örtbas etmeyi ayıran dört son.",
  "town",
  "Urheberschaft",
);
scene(
  s,
  "start",
  "İsimsiz kalan ilk taslak",
  [
    [
      "Kurz vor der Veröffentlichung eines gemeinsamen Ausstellungskonzepts bemerkst du, dass die öffentliche Fassung nur die Projektleitung nennt, obwohl wesentliche Gedanken aus mehreren früheren Entwürfen übernommen wurden.",
      "Ortak bir sergi tasarısının yayımlanmasından hemen önce, temel düşünceler önceki birkaç taslaktan alınmış olmasına rağmen kamuya açık sürümün yalnızca proje yönetimini andığını fark ediyorsun.",
    ],
    [
      "Eine Kollegin nennt das eine bloße Formalität; ein anderer spricht bereits von bewusster Aneignung. Zwischen beiden Zuschreibungen liegt allerdings eine Reihe ungeprüfter Annahmen über Urheberschaft und Verantwortung.",
      "Bir çalışma arkadaşı bunu basit bir formalite sayıyor; bir diğeri şimdiden bilinçli sahiplenmeden söz ediyor. Ancak bu iki nitelemenin arasında yazarlık ve sorumluluk hakkında sınanmamış varsayımlar bulunuyor.",
    ],
    [
      "Du hast Zugriff auf die freigegebenen Versionsstände und auf ein Sitzungsprotokoll, dessen Formulierung offenlässt, ob die Unterschrift eine Autorenschaft oder lediglich die Freigabe bezeichnen sollte.",
      "Erişimine açılmış sürümlere ve imzanın yazarlığı mı yoksa yalnızca yayım onayını mı göstermesi gerektiğini açık bırakan bir toplantı tutanağına erişimin var.",
    ],
    [
      "Du kannst zunächst die Entstehung des Textes nachvollziehbar dokumentieren oder die Beteiligten zu einem Gespräch über die Bedeutung der Namensnennung einladen.",
      "Önce metnin oluşumunu izlenebilir biçimde belgeleyebilir veya ilgili kişileri isim belirtmenin anlamını konuşmaya davet edebilirsin.",
    ],
  ],
  [
    "Metnin başında hangi değerlendirme henüz temellendirilmemiştir?",
    [
      "Durumun mutlaka bilinçli sahiplenme olduğu.",
      "Kamuya açık sürümde yalnızca yönetimin anıldığı.",
      "Önceki sürümlere erişilebildiği.",
    ],
    "İlk iki cümle görünür olguyu ve buna yüklenen anlamı ayırır. “bewusste Aneignung” niyet isnadıdır; metin bunun henüz araştırılmadığını vurgular.",
  ],
  [
    [
      "Ich rekonstruiere die Textgeschichte.",
      "Metnin oluşumunu yeniden kurarım.",
      "versions",
    ],
    [
      "Ich kläre zuerst die Erwartungen im Gespräch.",
      "Önce görüşmede beklentileri açıklığa kavuştururum.",
      "meeting",
    ],
  ],
);
scene(
  s,
  "versions",
  "Cümlelerin izini sürmek",
  [
    [
      "Die Versionsstände zeigen, dass Nora die Leitfrage entwickelt, Selim die Beispiele präzisiert und die Projektleitung den Text gekürzt hat. Keine dieser Tätigkeiten lässt sich ohne Weiteres mit der gesamten Urheberschaft gleichsetzen.",
      "Sürümler, ana soruyu Nora’nın geliştirdiğini, örnekleri Selim’in belirginleştirdiğini ve proje yönetiminin metni kısalttığını gösteriyor. Bu çalışmaların hiçbiri doğrudan metnin bütün yazarlığıyla özdeşleştirilemez.",
    ],
    [
      "Im Protokoll ist von einer redaktionellen Schlussfassung die Rede. Ob die Namen der inhaltlich Mitwirkenden bewusst gestrichen oder schon beim Zusammenführen der Dateien übersehen wurden, bleibt zunächst unklar.",
      "Tutanakta editoryal bir son sürümden söz ediliyor. İçeriğe katkı verenlerin isimlerinin bilinçli olarak mı çıkarıldığı yoksa dosyalar birleştirilirken mi gözden kaçtığı henüz belirsiz.",
    ],
    [
      "Du beschränkst deine Übersicht auf belegbare Änderungen und lässt beiläufige private Kommentare außen vor. Gerade eine sorgfältige Dokumentation darf nicht mehr behaupten, als ihre Quellen tragen.",
      "Özetini belgelenebilir değişikliklerle sınırlıyor ve araya giren özel yorumları dışarıda bırakıyorsun. Özellikle özenli bir belgeleme, kaynaklarının taşıdığından daha fazlasını iddia etmemeli.",
    ],
    [
      "Nun könntest du eine begründete Korrektur der Zuschreibung vorschlagen oder vor jeder öffentlichen Änderung die noch offenen Fragen zur Freigabe klären lassen.",
      "Şimdi katkı atfının gerekçeli biçimde düzeltilmesini önerebilir veya herhangi bir kamuya açık değişiklikten önce yayım onayına ilişkin açık soruları açıklığa kavuşturtabilirsin.",
    ],
  ],
  [
    "Sürüm incelemesi hangi sonuca izin veriyor?",
    [
      "Farklı kişilerin farklı türde katkı yaptığının gösterilmesine.",
      "Niyetin bütün ayrıntılarıyla kesinleştirilmesine.",
      "Özel yorumların yayımlanmasının zorunlu sayılmasına.",
    ],
    "“zeigen” ile verilen somut katkılar belirlenebilir. İsimlerin neden kaybolduğu ise “bleibt … unklar” ile ayrı, henüz açık bir soru olarak korunur.",
  ],
  [
    [
      "Ich schlage eine transparente Beitragsnotiz vor.",
      "Şeffaf bir katkı notu öneririm.",
      "credits",
    ],
    [
      "Ich lasse die offenen Freigabefragen klären.",
      "Açık onay sorularının netleştirilmesini isterim.",
      "pause",
    ],
  ],
);
scene(
  s,
  "meeting",
  "Aynı sözcük, farklı beklenti",
  [
    [
      "Im Gespräch wird deutlich, dass Freigabe für die Projektleitung eine gebündelte Verantwortung bedeutete, während Nora darunter die Bestätigung einer gemeinsam ausgewiesenen Urheberschaft verstanden hatte.",
      "Görüşmede, onayın proje yönetimi için tek elde toplanmış sorumluluk, Nora içinse ortaklaşa belirtilen yazarlığın doğrulanması anlamına geldiği ortaya çıkıyor.",
    ],
    [
      "Selim hält es für wenig hilfreich, aus dieser begrifflichen Verschiebung entweder eine harmlose Bagatelle oder bereits eine nachgewiesene Täuschung zu machen. Die Wirkung auf die Beteiligten sei dennoch ernst zu nehmen.",
      "Selim, bu kavramsal kaymadan ya zararsız bir önemsizlik ya da şimdiden kanıtlanmış bir aldatma sonucu çıkarmanın pek yararlı olmadığını düşünüyor. Buna rağmen durumun ilgili kişiler üzerindeki etkisinin ciddiye alınması gerektiğini söylüyor.",
    ],
    [
      "Einigkeit über die unterschiedlichen Erwartungen ersetzt noch keine Vereinbarung darüber, wie Beiträge künftig sichtbar werden. Ebenso wenig legt sie fest, wer für die veröffentlichten Aussagen einsteht.",
      "Farklı beklentilerin kabul edilmesi, katkıların gelecekte nasıl görünür olacağına ilişkin anlaşmanın yerini tutmuyor. Yayımlanan açıklamaların sorumluluğunu kimin üstleneceğini de belirlemiyor.",
    ],
    [
      "Du kannst eine gemeinsame Arbeitsvereinbarung anstoßen oder auf einer gesonderten Darstellung der voneinander abweichenden Positionen bestehen.",
      "Ortak bir çalışma düzenlemesi başlatabilir veya birbirinden ayrılan görüşlerin ayrı ayrı gösterilmesinde ısrar edebilirsin.",
    ],
  ],
  [
    "Görüşmede beklentilerin farklı olduğunun anlaşılması neyi sağlamaz?",
    [
      "Katkı ve sorumluluk hakkında kendiliğinden tamamlanmış bir anlaşmayı.",
      "Sorunun kavramsal bir yönü olduğunun görülmesini.",
      "Katılımcıların görüşlerini açıklayabilmesini.",
    ],
    "“ersetzt noch keine Vereinbarung” ifadesi teşhis ile çözümü ayırır. Beklenti farkını anlamak, ileriye dönük kuralları otomatik olarak oluşturmaz.",
  ],
  [
    [
      "Wir formulieren eine gemeinsame Arbeitsvereinbarung.",
      "Ortak bir çalışma düzenlemesi yazarız.",
      "agreement",
    ],
    [
      "Wir halten die Unterschiede ausdrücklich fest.",
      "Farklılıkları açıkça kayda geçiririz.",
      "dissent",
    ],
  ],
);
scene(
  s,
  "credits",
  "İsim listesinden daha fazlası",
  [
    [
      "Du legst eine Beitragsnotiz vor, die Entwicklung der Leitfrage, Ausarbeitung der Beispiele und redaktionelle Bearbeitung unterscheidet. Die Urheberschaft wird nicht nachträglich auf eine einzige Person zugespitzt.",
      "Ana sorunun geliştirilmesini, örneklerin işlenmesini ve editoryal çalışmayı ayıran bir katkı notu sunuyorsun. Yazarlık sonradan tek bir kişiye indirgenmiyor.",
    ],
    [
      "Die Beteiligten prüfen die Beschreibung ihrer jeweiligen Arbeit und einigen sich auf eine sachliche Ergänzung. Die Verantwortung für die freigegebene Gesamtfassung wird daneben ausdrücklich benannt.",
      "İlgili kişiler kendi çalışmalarına ilişkin açıklamaları kontrol ediyor ve nesnel bir ek üzerinde anlaşıyor. Onaylanmış bütün sürümün sorumluluğu da ayrıca belirtiliyor.",
    ],
    [
      "Damit ist nicht bewiesen, dass die ursprüngliche Auslassung absichtlich geschah. Korrigiert wird eine unzureichende Darstellung, ohne aus der Korrektur eine unbelegte Absichtserklärung abzuleiten.",
      "Bu, önceki eksikliğin kasıtlı olduğunu kanıtlamıyor. Düzeltmeden kanıtsız bir niyet sonucu çıkarmadan yetersiz bir gösterim düzeltiliyor.",
    ],
    [
      "Das Konzept erscheint mit nachvollziehbaren Angaben. Nicht die Länge der Namensliste macht die Lösung tragfähig, sondern die überprüfbare Beziehung zwischen Beitrag, Anerkennung und Verantwortung.",
      "Tasarım izlenebilir bilgilerle yayımlanıyor. Çözümü sağlam kılan isim listesinin uzunluğu değil; katkı, takdir ve sorumluluk arasındaki kontrol edilebilir ilişki.",
    ],
  ],
  [
    "Çözümün dayanağı bu sonda nedir?",
    [
      "Katkı, atıf ve sorumluluğun ayrı ve doğrulanabilir biçimde gösterilmesi.",
      "İsim listesinin mümkün olduğunca uzatılması.",
      "İlk eksikliğin niyetinin kanıtsız ilan edilmesi.",
    ],
    "Son cümlede “Nicht … sondern …” yapısı nicelikten ilişkiye geçişi vurgular. Düzeltmenin, geçmiş niyeti kendiliğinden kanıtlamadığı da özellikle korunur.",
  ],
  [],
  "Emeği görünür kılan katkı notu",
);
scene(
  s,
  "pause",
  "Yavaşlatmanın gerekçesi",
  [
    [
      "Du erläuterst, weshalb die Frage der Urheberschaft noch nicht von der Freigabefrage getrennt geklärt ist. Die Gruppe verschiebt die Veröffentlichung, statt fehlende Einigung als stillschweigende Zustimmung auszugeben.",
      "Yazarlık sorusunun yayım onayı sorusundan ayrı olarak neden henüz açıklığa kavuşmadığını anlatıyorsun. Grup, eksik uzlaşmayı örtük onay gibi sunmak yerine yayımı erteliyor.",
    ],
    [
      "Die Pause erhält einen konkreten Rahmen: Welche Textstellen sind strittig, wer muss angehört werden, und bis wann soll eine neue Fassung vorliegen?",
      "Araya somut bir çerçeve veriliyor: Hangi metin bölümleri tartışmalı, kimin görüşü alınmalı ve yeni sürüm ne zamana kadar hazırlanmalı?",
    ],
    [
      "Nora begrüßt, dass die Verzögerung nicht ihr persönlich zugeschoben wird. Selim hält zugleich fest, dass eine Frist allein den Konflikt nicht löst.",
      "Nora, gecikmenin kişisel olarak kendisine yüklenmemesini olumlu karşılıyor. Selim aynı zamanda, tek başına bir sürenin çatışmayı çözmeyeceğini kayda geçiriyor.",
    ],
    [
      "Das Ergebnis ist vorläufig, aber nicht beliebig. Die Gruppe hat entschieden, welche Ungewissheit sie vor einer öffentlichen Aussage noch bearbeiten muss.",
      "Sonuç geçici ama keyfî değil. Grup, kamuya açık bir açıklamadan önce hangi belirsizliği ele alması gerektiğine karar vermiş durumda.",
    ],
  ],
  [
    "Erteleme hangi özellikle salt oyalanmadan ayrılıyor?",
    [
      "Somut sorular, kişiler ve bir zaman çerçevesi belirlenmesiyle.",
      "Bütün sorumluluğun Nora’ya yüklenmesiyle.",
      "Bir tarihin tek başına çözüm sayılmasıyla.",
    ],
    "Ortadaki sorular, dinlenecek kişiler ve süre tanımlanmıştır. Metin aynı zamanda sürenin kendisini çözüm saymadığını açıkça söyler.",
  ],
  [],
  "Gerekçesi ve sınırı olan bir ara",
);
scene(
  s,
  "agreement",
  "Gelecekteki metinlerin kuralı",
  [
    [
      "Ihr formuliert eine Vereinbarung, die Entwurf, redaktionelle Bearbeitung, Urheberschaft und Freigabe getrennt beschreibt. Neue Mitarbeitende sollen diese Unterscheidungen nicht erst aus einem Konflikt lernen müssen.",
      "Taslağı, editoryal çalışmayı, yazarlığı ve yayım onayını ayrı ayrı açıklayan bir düzenleme yazıyorsunuz. Yeni çalışanların bu ayrımları ancak bir çatışma yaşayınca öğrenmesi gerekmemeli.",
    ],
    [
      "Die bestehende Fassung wird gemeinsam überprüft; eine sachliche Ergänzung nennt die nachweisbaren Beiträge. Wer mit einer Zuschreibung nicht einverstanden ist, kann dies vor der Veröffentlichung sichtbar machen.",
      "Mevcut sürüm birlikte gözden geçiriliyor; nesnel bir ek, kanıtlanabilir katkıları belirtiyor. Bir atfa katılmayan kişi, bunu yayımdan önce görünür kılabiliyor.",
    ],
    [
      "Niemand muss die frühere Auslassung schönreden, um an der neuen Regel mitzuwirken. Eine tragfähige Vereinbarung verlangt nicht, dass alle dieselbe Erinnerung an den Konflikt übernehmen.",
      "Yeni kurala katkı vermek için hiç kimse geçmişteki eksikliği hoş göstermek zorunda değil. Sağlam bir düzenleme, herkesin çatışmaya ilişkin aynı anıyı benimsemesini gerektirmez.",
    ],
    [
      "Der Streit verschwindet nicht rückwirkend. Er verändert aber die Bedingungen, unter denen das nächste gemeinsame Projekt beginnen kann.",
      "Tartışma geriye dönük olarak ortadan kalkmıyor. Ancak sonraki ortak projenin başlayabileceği koşulları değiştiriyor.",
    ],
  ],
  [
    "Ortak kural neyi gerektirmiyor?",
    [
      "Herkesin geçmiş çatışmayı aynı biçimde hatırlamasını.",
      "Katkı türlerinin açıkça tanımlanmasını.",
      "Yayımdan önce itirazın görünür olabilmesini.",
    ],
    "“verlangt nicht” ile düzenlemenin sınırı çizilir. İşbirliği için ortak bir süreç kurulabilir; kişilerin geçmişe ilişkin yorumlarının tekleştirilmesi gerekmez.",
  ],
  [],
  "Aynı hatırayı dayatmayan uzlaşma",
);
scene(
  s,
  "dissent",
  "Uzlaşılmayan noktanın kaydı",
  [
    [
      "Ihr könnt euch über die Urheberschaft einzelner Passagen nicht vollständig einigen. Statt eine Einigung zu behaupten, haltet ihr die unterschiedlichen Positionen sachlich und mit Zustimmung der Betroffenen fest.",
      "Bazı bölümlerin yazarlığı konusunda tam olarak anlaşamıyorsunuz. Anlaşma varmış gibi yapmak yerine, ilgili kişilerin onayıyla farklı görüşleri nesnel biçimde kaydediyorsunuz.",
    ],
    [
      "Die Veröffentlichung beschränkt sich auf den gemeinsam freigegebenen Teil. Umstrittene Zuschreibungen werden nicht nebenbei in einer Fußnote entschieden, die nur eine Seite formuliert hat.",
      "Yayım, birlikte onaylanan bölümle sınırlanıyor. Tartışmalı atıflar, yalnızca bir tarafın yazdığı bir dipnotla dolaylı olarak karara bağlanmıyor.",
    ],
    [
      "Für die offenen Fragen vereinbart ihr ein weiteres, klar begrenztes Verfahren. Bis dahin wird weder Schweigen als Zustimmung noch Widerspruch als mangelnde Kollegialität ausgelegt.",
      "Açık sorular için sınırları belirli başka bir süreç kararlaştırıyorsunuz. O zamana kadar ne sessizlik onay ne de itiraz ekip arkadaşlığı eksikliği olarak yorumlanıyor.",
    ],
    [
      "Der gemeinsame Text ist kürzer geworden, die Darstellung aber redlicher. Zusammenzuarbeiten bedeutet hier, Differenzen verantwortlich zu begrenzen, nicht sie aus dem Blick zu drängen.",
      "Ortak metin kısaldı ama gösterim daha dürüst hale geldi. Burada birlikte çalışmak, farklılıkları gözden uzaklaştırmak değil, sorumlu biçimde sınırlandırmak anlamına geliyor.",
    ],
  ],
  [
    "Bu sonun işbirliği anlayışı hangisi?",
    [
      "Anlaşmazlığı gizlemeden ortak alanı sınırlandırmak.",
      "Sessiz kalan herkesin onay verdiğini varsaymak.",
      "İtiraz edenleri ekip dışında bırakmak.",
    ],
    "Son, ortaklaşa onaylanmış metni korurken açık soruları ayrı bir sürece bırakır. “weder … noch …” yapısı sessizlik ve itiraz hakkında iki hatalı çıkarımı da reddeder.",
  ],
  [],
  "Farklılıkları saklamayan ortak metin",
);

const glossary = [
  [
    "Haltestelle",
    "die",
    "durak",
    "Haltestellen",
    "An der Haltestelle wartet ein Bus.",
    "Durakta bir otobüs bekliyor.",
  ],
  [
    "Lesezeichen",
    "das",
    "kitap ayracı",
    "Lesezeichen",
    "Das Lesezeichen liegt zwischen den Seiten.",
    "Ayraç sayfaların arasında duruyor.",
  ],
  [
    "Reparatur",
    "die",
    "tamir; onarım",
    "Reparaturen",
    "Nicht jede Reparatur ist sofort möglich.",
    "Her tamir hemen mümkün değildir.",
  ],
  [
    "Vermerk",
    "der",
    "not; kısa açıklama",
    "Vermerke",
    "Der Vermerk enthält kein Datum.",
    "Notta tarih bulunmuyor.",
  ],
  [
    "Widerhall",
    "der",
    "yankı; bir etkinin sürmesi",
    "Widerhalle",
    "Der Widerhall einer Stimme ist noch kein vollständiges Gespräch.",
    "Bir sesin yankısı, eksiksiz bir konuşma demek değildir.",
  ],
  [
    "Urheberschaft",
    "die",
    "bir metnin veya eserin kim tarafından oluşturulduğu; yazarlık",
    "",
    "Die Urheberschaft wird getrennt von der Freigabe beschrieben.",
    "Yazarlık, yayım onayından ayrı olarak açıklanıyor.",
  ],
].map(([word, article, meaning, plural, de, tr], i) => ({
  id: "story-world-word-" + (i + 1),
  word,
  article,
  meaning,
  plural,
  de,
  tr,
  repository: false,
}));
for (const s of stories) delete s.word;
writeFileSync(
  "src/data/stories/world-stories.json",
  JSON.stringify(stories, null, 2) + "\n",
);
writeFileSync(
  "src/data/stories/world-glossary.json",
  JSON.stringify(glossary, null, 2) + "\n",
);
console.log(
  "6 yeni hikâye, 42 sahne, 168 iki dilli metin, 24 son ve 42 açıklamalı soru oluşturuldu. Eski katalog korunuyor.",
);
