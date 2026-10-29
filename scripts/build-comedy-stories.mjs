// Original public teaching content only. Never reads learner data or environment secrets.
import { writeFileSync } from "node:fs";
const output = [];
function story(id, title, germanTitle, level, description, art, word) {
  const s = {
    id: `story-comedy-${id}`,
    title,
    germanTitle,
    level,
    category: "comedy",
    description,
    art,
    minutes: level === "A1" ? 7 : level === "A2" ? 8 : 10,
    start: "start",
    scenes: [],
    word,
  };
  output.push(s);
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
      id: `${id}-${i + 1}`,
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
  "hund",
  "Pastanın Başındaki Bekçi",
  "Der Hund und der Geburtstagskuchen",
  "A1",
  "Bir doğum günü pastasını korumak kolay mı? Max’ın peşinden git; dört neşeli sonu ve 7 açıklamalı soruyu keşfet.",
  "gift",
  "Hund",
);
scene(
  s,
  "start",
  "Pastanın yanında kim var?",
  [
    [
      "Heute hat Anna Geburtstag. Auf dem Tisch steht ein großer Kuchen.",
      "Bugün Anna’nın doğum günü. Masanın üzerinde büyük bir pasta var.",
    ],
    [
      "Du bringst Blumen. Dein Hund Max kommt auch mit.",
      "Çiçek getiriyorsun. Köpeğin Max da seninle geliyor.",
    ],
    [
      "Max sitzt vor dem Tisch. Er sieht den Kuchen und wartet.",
      "Max masanın önünde oturuyor. Pastayı görüyor ve bekliyor.",
    ],
    [
      "Anna sagt: Bitte pass auf Max auf! Du kannst bei ihm bleiben oder seinen Ball holen.",
      "Anna diyor ki: Lütfen Max’a göz kulak ol! Onun yanında kalabilir ya da topunu getirebilirsin.",
    ],
  ],
  [
    "Max başlangıçta ne yapıyor?",
    ["Masanın önünde bekliyor.", "Pastayı yiyor.", "Bahçede uyuyor."],
    "“sitzt vor dem Tisch” yerini, “wartet” ise beklediğini söyler. Henüz pastayı yediği anlatılmıyor.",
  ],
  [
    ["Ich bleibe bei Max.", "Max’ın yanında kalırım.", "watch"],
    ["Ich hole seinen Ball.", "Topunu getiririm.", "ball"],
  ],
);
scene(
  s,
  "watch",
  "Küçük bekçinin görevi",
  [
    [
      "Du setzt dich neben den Hund. Max schaut immer auf deine Tasche.",
      "Köpeğin yanına oturuyorsun. Max sürekli çantana bakıyor.",
    ],
    [
      "In deiner Tasche ist sein Spielzeug. Jetzt verstehst du Max.",
      "Çantanda onun oyuncağı var. Şimdi Max’ı anlıyorsun.",
    ],
    [
      "Anna bringt Teller. Max steht auf, aber der Kuchen bleibt auf dem Tisch.",
      "Anna tabak getiriyor. Max ayağa kalkıyor ama pasta masanın üzerinde kalıyor.",
    ],
    [
      "Du kannst Max sein Spielzeug geben oder mit ihm in den Garten gehen.",
      "Max’a oyuncağını verebilir ya da onunla bahçeye gidebilirsin.",
    ],
  ],
  [
    "Max neden çantana bakıyor?",
    [
      "Oyuncağı çantada olduğu için.",
      "Çantada pasta olduğu için.",
      "Çanta kayıp olduğu için.",
    ],
    "“In deiner Tasche ist sein Spielzeug” cevabı açıklar. sein, burada Max’a ait olan oyuncağı belirtir.",
  ],
  [
    ["Hier ist dein Spielzeug!", "İşte oyuncağın!", "toy"],
    ["Wir gehen in den Garten.", "Bahçeye gidelim.", "garden"],
  ],
);
scene(
  s,
  "ball",
  "Yuvarlanan sürpriz",
  [
    [
      "Du findest den Ball unter einem Stuhl. Der Hund läuft zu dir.",
      "Topu bir sandalyenin altında buluyorsun. Köpek sana doğru koşuyor.",
    ],
    [
      "Max nimmt den Ball. Dann rollt der Ball zur Tür.",
      "Max topu alıyor. Sonra top kapıya doğru yuvarlanıyor.",
    ],
    [
      "Vor der Tür steht Annas Opa. Er trägt einen sehr großen Hut.",
      "Kapının önünde Anna’nın dedesi duruyor. Çok büyük bir şapka takıyor.",
    ],
    [
      "Du kannst zuerst die Tür öffnen oder Max mit dem Ball zurückrufen.",
      "Önce kapıyı açabilir ya da topu olan Max’ı geri çağırabilirsin.",
    ],
  ],
  [
    "Kapının önünde kim var?",
    ["Anna’nın dedesi.", "Bir öğretmen.", "Anna’nın komşusu."],
    "“Annas Opa” Anna’nın dedesi demektir. Özel isme eklenen -s aidiyet bildirir.",
  ],
  [
    ["Ich öffne die Tür.", "Kapıyı açarım.", "hat"],
    ["Max, komm bitte zurück!", "Max, lütfen geri gel!", "photo"],
  ],
);
scene(
  s,
  "toy",
  "Pastanın güvenliği",
  [
    [
      "Der Hund spielt jetzt mit seinem Spielzeug. Der Kuchen ist noch ganz.",
      "Köpek şimdi oyuncağıyla oynuyor. Pasta hâlâ bütün.",
    ],
    [
      "Anna lacht: Max ist unser bester Kuchenwächter!",
      "Anna gülüyor: Max bizim en iyi pasta bekçimiz!",
    ],
    [
      "Max hört seinen Namen. Er setzt sich sehr gerade hin.",
      "Max adını duyuyor. Dimdik oturuyor.",
    ],
    [
      "Ihr esst Kuchen. Max bekommt sein normales Hundefutter und bleibt zufrieden.",
      "Pasta yiyorsunuz. Max normal köpek mamasını alıyor ve memnun kalıyor.",
    ],
  ],
  [
    "Max’a ne veriliyor?",
    ["Normal köpek maması.", "Bütün pasta.", "Bir fincan kahve."],
    "Son cümlede “sein normales Hundefutter” yazıyor. Pasta insanların, mama ise Max’ın yiyeceği.",
  ],
  [],
  "Ciddi pasta bekçisi",
);
scene(
  s,
  "garden",
  "Saksının arkasındaki parti",
  [
    [
      "Im Garten liegt der Hund neben einem Blumentopf. Du bleibst bei ihm.",
      "Bahçede köpek bir saksının yanına uzanıyor. Yanında kalıyorsun.",
    ],
    [
      "Anna öffnet das Fenster und singt ein Lied. Max hört zu.",
      "Anna pencereyi açıp bir şarkı söylüyor. Max dinliyor.",
    ],
    [
      "Dann bellt Max einmal. Anna lacht: Danke für das Lied, Max!",
      "Sonra Max bir kez havlıyor. Anna gülüyor: Şarkı için teşekkürler Max!",
    ],
    [
      "Du bringst ihm Wasser. Eure kleine Gartenparty ist sehr lustig.",
      "Ona su getiriyorsun. Küçük bahçe partiniz çok eğlenceli.",
    ],
  ],
  [
    "Anna neden Max’a teşekkür ediyor?",
    [
      "Havlamasını şarkı gibi yorumluyor.",
      "Max pasta getirdiği için.",
      "Max pencereyi kapattığı için.",
    ],
    "Max bir kez havlar; Anna bunu komik biçimde bir şarkı sayar. Bu, gerçek bir şarkı söylediği anlamına gelmez.",
  ],
  [],
  "Bahçedeki küçük konser",
);
scene(
  s,
  "hat",
  "Şapkadaki top",
  [
    [
      "Du öffnest die Tür. Der Hund bringt Opa seinen Ball.",
      "Kapıyı açıyorsun. Köpek dedeye topunu getiriyor.",
    ],
    [
      "Opa nimmt den Hut ab. Max legt den Ball hinein.",
      "Dede şapkasını çıkarıyor. Max topu şapkanın içine koyuyor.",
    ],
    [
      "Opa sagt: Mein Hut ist heute eine Sporttasche! Alle lachen.",
      "Dede diyor ki: Şapkam bugün bir spor çantası! Herkes gülüyor.",
    ],
    [
      "Der Kuchen wartet auf dem Tisch. Opa und Max kommen zusammen zur Feier.",
      "Pasta masada bekliyor. Dede ile Max kutlamaya birlikte geliyor.",
    ],
  ],
  [
    "Top sonunda nerede?",
    ["Dedenin şapkasının içinde.", "Pastanın altında.", "Bahçedeki suda."],
    "“legt den Ball hinein” ifadesindeki hinein, önceki cümlede sözü edilen şapkanın içine demektir.",
  ],
  [],
  "Spor çantasına dönüşen şapka",
);
scene(
  s,
  "photo",
  "Doğum günü fotoğrafı",
  [
    [
      "Du rufst Max zurück. Der Hund setzt sich neben Anna.",
      "Max’ı geri çağırıyorsun. Köpek Anna’nın yanına oturuyor.",
    ],
    [
      "Opa kommt herein. Er möchte ein Foto machen.",
      "Dede içeri giriyor. Bir fotoğraf çekmek istiyor.",
    ],
    [
      "Alle lächeln, aber Max hält den Ball vor sein Gesicht.",
      "Herkes gülümsüyor ama Max topu yüzünün önünde tutuyor.",
    ],
    [
      "Auf dem Foto sieht man Anna, ihre Freunde und einen Ball mit Ohren.",
      "Fotoğrafta Anna, arkadaşları ve kulakları olan bir top görünüyor.",
    ],
  ],
  [
    "Fotoğraf neden komik görünüyor?",
    [
      "Top Max’ın yüzünü kapatıyor.",
      "Fotoğrafta kimse yok.",
      "Dede fotoğraf çekmiyor.",
    ],
    "“vor sein Gesicht” yüzünün önüne demektir. “Kulakları olan top” fotoğraftaki görüntüye yönelik şakadır.",
  ],
  [],
  "Kulaklı topun portresi",
);

s = story(
  "koffer",
  "Yanlış Bavul, Doğru Kahkaha",
  "Der Koffer mit den roten Nasen",
  "A2",
  "Trende karışan iki bavulu sahiplerine ulaştır. Perfekt, rica ifadeleri ve yanlış anlamalarla dört farklı çözüm bul.",
  "train",
  "Koffer",
);
scene(
  s,
  "start",
  "İki mavi bavul",
  [
    [
      "Du bist mit dem Zug nach Köln gefahren. Am Ausgang hast du einen blauen Koffer genommen.",
      "Trenle Köln’e gittin. Çıkışta mavi bir bavul aldın.",
    ],
    [
      "Im Koffer liegen keine Kleider, sondern zwölf rote Clownsnasen. Du musst lachen.",
      "Bavulda kıyafet değil, on iki kırmızı palyaço burnu var. Gülüyorsun.",
    ],
    [
      "Auf dem Namensschild steht Frau Sommer. Dein eigener Koffer sieht fast genauso aus.",
      "İsim etiketinde Bayan Sommer yazıyor. Senin bavulun da neredeyse aynı görünüyor.",
    ],
    [
      "Du möchtest nichts behalten. Du kannst zur Information gehen oder die Nummer auf dem Schild anrufen.",
      "Hiçbir şeyi kendine almak istemiyorsun. Danışmaya gidebilir ya da etiketteki numarayı arayabilirsin.",
    ],
  ],
  [
    "Bavul neden sana ait görünmüyor?",
    [
      "Etikette başka bir isim ve içinde palyaço burunları var.",
      "Bavul kırmızı olduğu için.",
      "Tren hiç durmadığı için.",
    ],
    "“keine Kleider, sondern …” beklenenle gerçekte olanı karşılaştırır. Bavullar aynı renktir; renk tek başına yeterli değildir.",
  ],
  [
    ["Ich frage bei der Information.", "Danışmaya sorarım.", "desk"],
    ["Ich rufe Frau Sommer an.", "Bayan Sommer’i ararım.", "call"],
  ],
);
scene(
  s,
  "desk",
  "Danışmadaki küçük gösteri",
  [
    [
      "Die Mitarbeiterin stellt den Koffer auf den Tisch. Bitte beschreiben Sie Ihren Koffer, sagt sie.",
      "Görevli bavulu masaya koyuyor. Lütfen kendi bavulunuzu tarif edin, diyor.",
    ],
    [
      "Du erklärst: Mein Koffer ist blau und hat ein gelbes Band. Dieser hier hat kein Band.",
      "Açıklıyorsun: Bavulum mavi ve sarı bir kurdelesi var. Bunun kurdelesi yok.",
    ],
    [
      "Neben euch wartet eine Frau mit einem blauen Koffer und einem gelben Band. Sie trägt eine rote Nase.",
      "Yanınızda mavi ve sarı kurdeleli bir bavulla bir kadın bekliyor. Kırmızı bir palyaço burnu takmış.",
    ],
    [
      "Du kannst sie höflich fragen oder zuerst der Mitarbeiterin das Band zeigen.",
      "Kadına nazikçe sorabilir ya da önce görevliye kurdeleyi gösterebilirsin.",
    ],
  ],
  [
    "Senin bavulunu ayırt eden özellik ne?",
    ["Sarı kurdele.", "Yeşil kapak.", "On iki tekerlek."],
    "“hat ein gelbes Band” kendi bavulunun ayırt edici özelliğidir. Her iki bavulun mavi olması çözüm sağlamaz.",
  ],
  [
    [
      "Entschuldigung, ist das vielleicht mein Koffer?",
      "Affedersiniz, o benim bavulum olabilir mi?",
      "exchange",
    ],
    [
      "Das gelbe Band gehört zu meinem Koffer.",
      "Sarı kurdele benim bavuluma ait.",
      "announcement",
    ],
  ],
);
scene(
  s,
  "call",
  "Telefondaki ses",
  [
    [
      "Frau Sommer geht ans Telefon. Sie hat deinen Koffer geöffnet und ein Wörterbuch gefunden.",
      "Bayan Sommer telefonu açıyor. Senin bavulunu açmış ve bir sözlük bulmuş.",
    ],
    [
      "Sie sagt: Für meine Clownsshow brauche ich Nasen, keine Grammatik! Ihr lacht beide.",
      "Diyor ki: Palyaço gösterim için burunlara ihtiyacım var, gramere değil! İkiniz de gülüyorsunuz.",
    ],
    [
      "Sie wartet vor dem Bahnhof. Ihr vereinbart einen Treffpunkt neben der großen Uhr.",
      "Garın önünde bekliyor. Büyük saatin yanında buluşmaya karar veriyorsunuz.",
    ],
    [
      "Du kannst allein zur Uhr gehen oder einen Mitarbeiter um Begleitung bitten.",
      "Saate tek başına gidebilir ya da bir görevliden sana eşlik etmesini isteyebilirsin.",
    ],
  ],
  [
    "Bayan Sommer senin bavulunda ne bulmuş?",
    ["Bir sözlük.", "Bir pasta.", "On iki şemsiye."],
    "“hat … geöffnet / gefunden” tamamlanmış eylemler için Perfekt örnekleridir. Sözü edilen nesne Wörterbuch’tur.",
  ],
  [
    ["Ich gehe zur großen Uhr.", "Büyük saate giderim.", "clock"],
    [
      "Könnten Sie bitte mitkommen?",
      "Lütfen benimle gelebilir misiniz?",
      "escort",
    ],
  ],
);
scene(
  s,
  "exchange",
  "Kimlik kontrolü ve kahkaha",
  [
    [
      "Die Frau ist tatsächlich Frau Sommer. Ihr vergleicht die Namensschilder, bevor ihr die Koffer tauscht.",
      "Kadın gerçekten Bayan Sommer. Bavulları değiştirmeden önce isim etiketlerini karşılaştırıyorsunuz.",
    ],
    [
      "In deinem Koffer liegen deine Kleider und dein Wörterbuch. Jetzt ist alles wieder richtig.",
      "Bavulunda kıyafetlerin ve sözlüğün var. Şimdi her şey yine doğru yerde.",
    ],
    [
      "Frau Sommer setzt kurz eine rote Nase auf. Heute habe ich eine kostenlose Deutschstunde bekommen, sagt sie.",
      "Bayan Sommer kısa bir süre kırmızı burun takıyor. Bugün ücretsiz bir Almanca dersi aldım, diyor.",
    ],
    [
      "Du bindest ein zweites gelbes Band an deinen Koffer. Eine Clownsnase reicht als Erinnerung.",
      "Bavuluna ikinci bir sarı kurdele bağlıyorsun. Anı olarak bir palyaço burnu yeter.",
    ],
  ],
  [
    "Bavullar değiştirilmeden önce ne yapılıyor?",
    [
      "İsim etiketleri karşılaştırılıyor.",
      "Eşyalar satılıyor.",
      "Bavullar trende bırakılıyor.",
    ],
    "“bevor” bir olayın diğerinden önce olduğunu gösterir. Değişimden önce sahibin doğrulanması, aceleyle tekrar karıştırmayı önler.",
  ],
  [],
  "İki kurdeleli çözüm",
);
scene(
  s,
  "announcement",
  "Sıradışı anons",
  [
    [
      "Die Mitarbeiterin prüft das gelbe Band und die Namen. Dann gibt sie die richtigen Koffer zurück.",
      "Görevli sarı kurdeleyi ve isimleri kontrol ediyor. Sonra doğru bavulları geri veriyor.",
    ],
    [
      "Frau Sommer bittet um eine kurze Durchsage für ihre Kollegin. Die Kollegin wartet noch am Gleis.",
      "Bayan Sommer iş arkadaşı için kısa bir anons rica ediyor. Arkadaşı hâlâ peronda bekliyor.",
    ],
    [
      "Die Durchsage lautet: Die roten Nasen sind wieder da. Bitte kommen Sie zur Information.",
      "Anons şöyle: Kırmızı burunlar geri geldi. Lütfen danışmaya gelin.",
    ],
    [
      "Ein Kind fragt nach dem Nasenzug. Du erklärst lachend: Es geht nur um einen Koffer.",
      "Bir çocuk burun trenini soruyor. Gülerek açıklıyorsun: Konu yalnızca bir bavul.",
    ],
  ],
  [
    "Anonsun asıl amacı ne?",
    [
      "Bayan Sommer’in iş arkadaşını danışmaya çağırmak.",
      "Yeni bir tren seferi duyurmak.",
      "Herkese burun satmak.",
    ],
    "Anons bir kişiye bilgi vermek için yapılır. Çocuk “kırmızı burunları” yeni bir tren gibi yorumlayınca mizah oluşur.",
  ],
  [],
  "Burun treni anonsu",
);
scene(
  s,
  "clock",
  "Saatin altında kısa prova",
  [
    [
      "Unter der Uhr vergleicht ihr die Namen auf den Koffern. Frau Sommer gibt dir deinen Koffer zurück.",
      "Saatin altında bavullardaki isimleri karşılaştırıyorsunuz. Bayan Sommer bavulunu sana geri veriyor.",
    ],
    [
      "Sie hat vor der Show noch fünf Minuten Zeit. Zum Dank zeigt sie dir einen kleinen Trick.",
      "Gösteriden önce hâlâ beş dakikası var. Teşekkür etmek için sana küçük bir numara gösteriyor.",
    ],
    [
      "Aus ihrer leeren Hand fällt eine rote Nase. Du hast genau hingesehen und trotzdem nichts bemerkt.",
      "Boş elinden kırmızı bir burun düşüyor. Dikkatle bakmana rağmen hiçbir şey fark etmedin.",
    ],
    [
      "Dein Koffer ist wieder bei dir. Der langweilige Bahnhof ist plötzlich eine kleine Bühne geworden.",
      "Bavulun yine yanında. Sıkıcı gar birden küçük bir sahneye dönüştü.",
    ],
  ],
  [
    "Bayan Sommer numarayı neden gösteriyor?",
    ["Teşekkür etmek için.", "Bavulu saklamak için.", "Treni durdurmak için."],
    "“Zum Dank” teşekkür amacı bildirir. Beş dakikalık zaman, gösterinin yapılmasını mümkün kılar.",
  ],
  [],
  "Saatin altındaki sahne",
);
scene(
  s,
  "escort",
  "Ciddi görev, kırmızı burun",
  [
    [
      "Ein Mitarbeiter begleitet dich zum Treffpunkt. Gemeinsam prüft ihr die Namen und tauscht die Koffer.",
      "Bir görevli buluşma noktasına sana eşlik ediyor. Birlikte isimleri kontrol edip bavulları değiştiriyorsunuz.",
    ],
    [
      "Frau Sommer fragt den Mitarbeiter, ob er einmal eine rote Nase tragen möchte. Er sagt zuerst nein.",
      "Bayan Sommer görevliye bir kez kırmızı burun takmak isteyip istemediğini soruyor. Önce hayır diyor.",
    ],
    [
      "Dann setzt er sie doch auf und sagt ganz ernst: Ihre Koffer sind jetzt ordnungsgemäß lustig.",
      "Sonra yine de takıyor ve çok ciddi biçimde şöyle diyor: Bavullarınız artık usulüne uygun biçimde komik.",
    ],
    [
      "Alle lachen. Du bedankst dich für die Hilfe und nimmst den richtigen Koffer mit.",
      "Herkes gülüyor. Yardımı için teşekkür edip doğru bavulu alıyorsun.",
    ],
  ],
  [
    "Son sahnede hangi zıtlık komik?",
    [
      "Görevlinin ciddi üslubuyla kırmızı burun takması.",
      "Kimsenin yardım etmemesi.",
      "Bavulların bulunamaması.",
    ],
    "“ganz ernst” ile palyaço burnu arasındaki karşıtlık mizah yaratır. Yardım istemek burada çözümü kolaylaştırır.",
  ],
  [],
  "Usulüne uygun kahkaha",
);

s = story(
  "probe",
  "Provadaki Şemsiye",
  "Eine Probe mit unerwartetem Regen",
  "B1",
  "Tiyatro provasında bir yanlış anlamayı çöz. Nedeni, niyeti ve sonucu ayırt ederek dört sahne sonuna ulaş.",
  "town",
  "Probe",
);
scene(
  s,
  "start",
  "Mecaz mı, hava durumu mu?",
  [
    [
      "Bei einer Theaterprobe hört Deniz den Satz: Heute lassen wir es auf der Bühne regnen. Er bringt sofort drei Schirme.",
      "Bir tiyatro provasında Deniz şu cümleyi duyuyor: Bugün sahnede yağmur yağdıracağız. Hemen üç şemsiye getiriyor.",
    ],
    [
      "Die Regisseurin meint damit eigentlich einen Regen aus Papierblumen. Niemand hat echtes Wasser bestellt.",
      "Yönetmen aslında kâğıt çiçeklerden oluşan bir yağmuru kastediyor. Kimse gerçek su istemedi.",
    ],
    [
      "Als Deniz die Schirme öffnet, bleibt einer an einem künstlichen Baum hängen. Die Probe muss kurz warten.",
      "Deniz şemsiyeleri açınca biri yapay bir ağaca takılıyor. Prova kısa bir süre beklemek zorunda.",
    ],
    [
      "Du hilfst bei der Probe. Du kannst zuerst nach der geplanten Szene fragen oder Deniz beim Schirm helfen.",
      "Provaya yardım ediyorsun. Önce planlanan sahneyi sorabilir ya da şemsiye konusunda Deniz’e yardım edebilirsin.",
    ],
  ],
  [
    "Yanlış anlamanın kaynağı ne?",
    [
      "Çiçek yağmurunun gerçek yağmur sanılması.",
      "Provaya kimsenin gelmemesi.",
      "Ağacın gerçek olması.",
    ],
    "“eigentlich” gerçek niyeti açıklar. Sahneye yağmur yağdırmak burada kâğıt çiçeklerin düşmesi anlamındadır.",
  ],
  [
    [
      "Ich frage nach dem Ablauf der Szene.",
      "Sahnenin akışını sorarım.",
      "plan",
    ],
    [
      "Ich helfe Deniz mit dem Schirm.",
      "Deniz’e şemsiyede yardım ederim.",
      "help",
    ],
  ],
);
scene(
  s,
  "plan",
  "Provanın küçük çizimi",
  [
    [
      "Die Regisseurin zeichnet den Ablauf der Probe: Erst sagt die Figur einen Satz, dann fallen die Papierblumen.",
      "Yönetmen provanın akışını çiziyor: Önce karakter bir cümle söylüyor, sonra kâğıt çiçekler düşüyor.",
    ],
    [
      "Deniz sieht die Zeichnung und lacht über seinen Irrtum. Gut, dass ich keine Gummistiefel gekauft habe, sagt er.",
      "Deniz çizimi görüyor ve yanılgısına gülüyor. İyi ki lastik çizme almamışım, diyor.",
    ],
    [
      "Ein Schirm könnte die Blumen auffangen. Das wäre eine neue komische Szene, ist aber noch nicht vereinbart.",
      "Bir şemsiye çiçekleri yakalayabilir. Bu yeni, komik bir sahne olurdu ama henüz üzerinde anlaşılmadı.",
    ],
    [
      "Du kannst einen kurzen Versuch vorschlagen oder beim ursprünglichen Plan bleiben.",
      "Kısa bir deneme önerebilir ya da ilk plana bağlı kalabilirsin.",
    ],
  ],
  [
    "Şemsiyeli sahnenin durumu ne?",
    [
      "Henüz kabul edilmemiş bir öneri.",
      "Çoktan oynanmış son gösteri.",
      "Yasaklanmış gerçek yağmur.",
    ],
    "“könnte” ve “wäre” olasılık/öneri bildirir; “noch nicht vereinbart” henüz karar verilmediğini açıkça belirtir.",
  ],
  [
    [
      "Wollen wir es einmal ausprobieren?",
      "Bir kez denemek ister miyiz?",
      "experiment",
    ],
    [
      "Wir bleiben beim vereinbarten Plan.",
      "Kararlaştırılan plana bağlı kalalım.",
      "original",
    ],
  ],
);
scene(
  s,
  "help",
  "Takılan şemsiye",
  [
    [
      "Du hältst den künstlichen Baum fest, während Deniz den Schirm vorsichtig löst. Die Probe kann weitergehen.",
      "Deniz şemsiyeyi dikkatlice kurtarırken yapay ağacı sabit tutuyorsun. Prova devam edebilir.",
    ],
    [
      "Im Schirm stecken zwei Papierblumen. Deniz fragt, ob er die Blumen als Hut tragen darf.",
      "Şemsiyenin içinde iki kâğıt çiçek var. Deniz çiçekleri şapka olarak takıp takamayacağını soruyor.",
    ],
    [
      "Die Regisseurin findet die Idee lustig, möchte aber niemanden zu einem Witz zwingen. Deniz möchte selbst mitmachen.",
      "Yönetmen fikri komik buluyor ama kimseyi bir şakaya zorlamak istemiyor. Deniz kendisi katılmak istiyor.",
    ],
    [
      "Ihr könnt den Blumenhut in die Szene aufnehmen oder ihn nur für das Gruppenfoto benutzen.",
      "Çiçek şapkasını sahneye ekleyebilir ya da yalnızca grup fotoğrafında kullanabilirsiniz.",
    ],
  ],
  [
    "Deniz’in şakaya katılması nasıl kararlaşıyor?",
    [
      "Kendi isteğiyle katılmak istiyor.",
      "Diğerleri onu zorunlu tutuyor.",
      "Yönetmen onunla konuşmadan karar veriyor.",
    ],
    "“möchte selbst mitmachen” gönüllü katılımı bildirir. Mizahın kişiyi küçük düşürmesi veya zorlaması gerekmiyor.",
  ],
  [
    ["Der Hut darf in die Szene.", "Şapka sahnede yer alsın.", "hat"],
    [
      "Wir machen nur ein Erinnerungsfoto.",
      "Yalnızca bir hatıra fotoğrafı çekelim.",
      "picture",
    ],
  ],
);
scene(
  s,
  "experiment",
  "Şemsiyedeki bahar",
  [
    [
      "Bei der nächsten Probe hält Deniz den Schirm verkehrt herum. Die Papierblumen landen tatsächlich darin.",
      "Sonraki provada Deniz şemsiyeyi ters tutuyor. Kâğıt çiçekler gerçekten içine düşüyor.",
    ],
    [
      "Als er den Schirm schließt, fallen die Blumen vor seine Füße. Ich habe den Frühling zusammengeklappt, sagt er.",
      "Şemsiyeyi kapatınca çiçekler ayaklarının önüne düşüyor. İlkbaharı katladım, diyor.",
    ],
    [
      "Die Gruppe lacht über die unerwartete Bewegung und beschließt gemeinsam, sie zu behalten.",
      "Grup beklenmedik harekete gülüyor ve birlikte onu korumaya karar veriyor.",
    ],
    [
      "Der Irrtum wird zur Idee. Trotzdem schreibt ihr den neuen Ablauf auf, damit die nächste Probe nicht wieder überrascht.",
      "Yanlış anlama bir fikre dönüşüyor. Yine de sonraki prova yeniden sürpriz yaratmasın diye yeni akışı yazıyorsunuz.",
    ],
  ],
  [
    "Yeni hareket neden sahnede kalıyor?",
    [
      "Grup deneyip birlikte karar verdiği için.",
      "İlk plana hiç bakılmadığı için.",
      "Gerçek yağmur yağdığı için.",
    ],
    "Önce deneme, sonra ortak karar var. Son cümledeki “damit” yazılı akışın amacını, sürprizi önlemeyi açıklar.",
  ],
  [],
  "Katlanabilen ilkbahar",
);
scene(
  s,
  "original",
  "Duygulu bir bekleyiş",
  [
    [
      "Ihr bleibt beim alten Ablauf. Bei der Probe steht Deniz ohne Schirm auf der Bühne und wartet auf die Blumen.",
      "Eski akışa bağlı kalıyorsunuz. Provada Deniz şemsiyesiz sahnede durup çiçekleri bekliyor.",
    ],
    [
      "Der Helfer vergisst kurz sein Zeichen. Deniz schaut nach oben und sagt: Der Frühling hat wohl Verspätung.",
      "Yardımcı kısa bir an işaretini unutuyor. Deniz yukarı bakıp şöyle diyor: İlkbahar galiba gecikti.",
    ],
    [
      "Dann fallen die Papierblumen genau im richtigen Moment. Die Regisseurin bedankt sich für seine Ruhe.",
      "Sonra kâğıt çiçekler tam doğru anda düşüyor. Yönetmen sakinliği için ona teşekkür ediyor.",
    ],
    [
      "Nach der Probe ergänzt ihr ein deutliches Zeichen im Ablauf. Nicht jeder Fehler braucht eine völlig neue Szene.",
      "Provadan sonra akışa belirgin bir işaret ekliyorsunuz. Her hata tamamen yeni bir sahne gerektirmez.",
    ],
  ],
  [
    "Sonuçta hangi iyileştirme yapılıyor?",
    [
      "Akışa daha belirgin bir işaret ekleniyor.",
      "Tiyatro kapanıyor.",
      "Deniz bir daha provaya alınmıyor.",
    ],
    "“ergänzt … ein deutliches Zeichen” somut çözümü gösterir. İlk plana bağlı kalmak, hiçbir iyileştirme yapmamak demek değildir.",
  ],
  [],
  "Geciken ilkbahar",
);
scene(
  s,
  "hat",
  "Çiçeklerin başrolü",
  [
    [
      "Deniz setzt den Blumenhut bei der Probe auf. Die Figur begrüßt ihn feierlich als Leiter der Wetterabteilung.",
      "Deniz provada çiçek şapkasını takıyor. Karakter onu törenle hava durumu bölümünün müdürü olarak selamlıyor.",
    ],
    [
      "Deniz antwortet: Heute gibt es Blumen, morgen vielleicht Petersilie. Die Gruppe muss eine Pause zum Lachen machen.",
      "Deniz cevap veriyor: Bugün çiçek var, yarın belki maydanoz. Grup gülmek için ara vermek zorunda kalıyor.",
    ],
    [
      "Ihr kürzt den Witz für die Aufführung. Er soll zur Geschichte passen und nicht die ganze Szene verdecken.",
      "Gösteri için şakayı kısaltıyorsunuz. Hikâyeye uymalı ve bütün sahnenin önüne geçmemeli.",
    ],
    [
      "Am Ende der Probe legt Deniz den Hut neben die Requisiten. Jetzt gehört er zum gemeinsam vereinbarten Plan.",
      "Provanın sonunda Deniz şapkayı dekor eşyalarının yanına koyuyor. Artık ortak kararlaştırılan planın bir parçası.",
    ],
  ],
  [
    "Şaka neden kısaltılıyor?",
    [
      "Hikâyeye hizmet edip sahneyi bastırmaması için.",
      "Deniz şapkayı sevmediği için.",
      "Çiçekler gerçek olduğu için.",
    ],
    "“soll … passen” amaç ve beklenti bildirir. Mizahın anlatının geri kalanıyla dengelenmesi isteniyor.",
  ],
  [],
  "Maydanozlu hava durumu",
);
scene(
  s,
  "picture",
  "Sahne dışında kalan şaka",
  [
    [
      "Für die eigentliche Probe legt Deniz den Hut weg. Die Szene bleibt wie geplant.",
      "Asıl prova için Deniz şapkayı kaldırıyor. Sahne planlandığı gibi kalıyor.",
    ],
    [
      "Danach macht die Gruppe ein Foto. Deniz trägt den Hut, und alle anderen halten unsichtbare Schirme.",
      "Sonra grup bir fotoğraf çekiliyor. Deniz şapkayı takıyor, diğer herkes görünmez şemsiyeler tutuyor.",
    ],
    [
      "Auf dem Bild sieht es aus, als würde es nur über Deniz blühen. Er wählt selbst die Bildunterschrift.",
      "Fotoğrafta yalnızca Deniz’in üzerine çiçek yağıyormuş gibi görünüyor. Fotoğraf altı yazısını kendisi seçiyor.",
    ],
    [
      "Probe erfolgreich, Wetter unklar, schreibt er. Ein guter gemeinsamer Witz muss nicht auf die große Bühne.",
      "Prova başarılı, hava durumu belirsiz, yazıyor. İyi bir ortak şakanın büyük sahneye çıkması şart değil.",
    ],
  ],
  [
    "Bu sonda şaka nerede kullanılıyor?",
    [
      "Prova sonrasındaki grup fotoğrafında.",
      "Asıl sahnenin tamamında.",
      "Bir tren anonsunda.",
    ],
    "“Danach” prova sonrasını ayırır. Sahne değişmez; şaka fotoğrafa ve alt yazısına taşınır.",
  ],
  [],
  "Hava durumu belirsiz fotoğraf",
);

s = story(
  "rolle",
  "Ciddiyetle Karışan Roller",
  "Die Rolle des Jahrhunderts",
  "B2",
  "Bir iletişim atölyesinde “rol” sözcüğünün iki anlamı karışıyor. Beklenti, bağlam ve dolaylı anlatımı yorumlayarak dört çözümü keşfet.",
  "town",
  "Rolle",
);
scene(
  s,
  "start",
  "Yanlış malzeme",
  [
    [
      "Für einen Workshop soll Mara ihre Rolle vorbereiten. Sie erscheint mit einer riesigen Rolle Geschenkpapier unter dem Arm.",
      "Mara’dan bir atölye için rolünü hazırlaması istenir. Koltuğunun altında dev bir hediye kâğıdı rulosuyla gelir.",
    ],
    [
      "Die Leiterin hatte eine Gesprächsrolle gemeint: Mara sollte eine unzufriedene Kundin spielen. Die E-Mail enthielt allerdings kein Beispiel.",
      "Yürütücü bir konuşma rolünü kastetmiştir: Mara memnun olmayan bir müşteriyi canlandıracaktır. Fakat e-postada örnek yoktur.",
    ],
    [
      "Mara behauptet scherzhaft, sie habe die einzige wirklich tragbare Rolle mitgebracht. Einige lachen, andere wirken verunsichert.",
      "Mara şakayla gerçekten taşınabilir olan tek rolü getirdiğini ileri sürer. Bazıları güler, diğerleri kararsız görünür.",
    ],
    [
      "Du moderierst die Gruppe. Du kannst die missverständliche Einladung klären oder Mara fragen, ob sie ihre Idee in eine Übung verwandeln möchte.",
      "Grubu sen yönetiyorsun. Belirsiz daveti açıklığa kavuşturabilir ya da Mara’ya fikrini bir alıştırmaya çevirmek isteyip istemediğini sorabilirsin.",
    ],
  ],
  [
    "Yanlış anlamayı kolaylaştıran unsur hangisi?",
    [
      "Rolle sözcüğünün iki anlamı ve örneksiz davet.",
      "Mara’nın e-postayı hiç almamış olması.",
      "Atölyenin iptal edilmesi.",
    ],
    "Rolle hem canlandırılan rol hem rulo demektir. “allerdings” davetin eksik bağlamına dikkat çeker; metin Mara’nın okumadığını söylemez.",
  ],
  [
    [
      "Ich kläre zunächst den Auftrag.",
      "Önce görevi açıklığa kavuştururum.",
      "clarify",
    ],
    ["Ich frage Mara nach ihrer Idee.", "Mara’ya fikrini sorarım.", "invite"],
  ],
);
scene(
  s,
  "clarify",
  "Suçlu aramadan açıklamak",
  [
    [
      "Du erklärst, mit Rolle sei eine Figur in einem Kundengespräch gemeint gewesen. Mara nickt und legt das Papier beiseite.",
      "Rolle ile bir müşteri konuşmasındaki karakterin kastedildiğini açıklıyorsun. Mara başını sallayıp kâğıdı kenara koyuyor.",
    ],
    [
      "Die Leiterin räumt ein, dass ihre Einladung mehrere Lesarten zugelassen habe. Sie möchte die Verantwortung nicht allein Mara zuschieben.",
      "Yürütücü davetinin birden fazla okumaya açık olduğunu kabul ediyor. Sorumluluğu yalnızca Mara’ya yüklemek istemiyor.",
    ],
    [
      "Um die Stimmung zu lösen, könntest du selbst eine absichtlich missverstandene Anweisung vorspielen.",
      "Havayı yumuşatmak için bilerek yanlış anladığın bir yönergeyi kendin canlandırabilirsin.",
    ],
    [
      "Alternativ könntet ihr die Einladung gemeinsam präzisieren und anschließend direkt mit den Gesprächsrollen beginnen.",
      "Alternatif olarak daveti birlikte netleştirip ardından doğrudan konuşma rollerine başlayabilirsiniz.",
    ],
  ],
  [
    "“mit Rolle sei … gemeint gewesen” hangi işlevi taşıyor?",
    [
      "Önceki niyeti dolaylı biçimde aktarıyor.",
      "Gelecekteki kesin bir yasağı bildiriyor.",
      "Kâğıdın fiziksel uzunluğunu ölçüyor.",
    ],
    "“sei … gemeint gewesen” geçmişe yönelik dolaylı aktarımdır. Burada kullanım önceki görevin anlamını açıklığa kavuşturur; zorunlu olarak kuşku bildirmez.",
  ],
  [
    [
      "Ich spiele selbst das Missverständnis vor.",
      "Yanlış anlamayı kendim canlandırırım.",
      "self",
    ],
    [
      "Wir schreiben eine klarere Einladung.",
      "Daha açık bir davet yazarız.",
      "rewrite",
    ],
  ],
);
scene(
  s,
  "invite",
  "Bir fikre gerçekten izin vermek",
  [
    [
      "Du fragst Mara, ob sie die Rolle aus Papier freiwillig in die Übung einbauen möchte. Sie stimmt zu, bittet aber um eine klare Aufgabe.",
      "Mara’ya kâğıt rulosunu gönüllü olarak alıştırmaya katmak isteyip istemediğini soruyorsun. Kabul ediyor ama açık bir görev istiyor.",
    ],
    [
      "Ihr könntet ein übertriebenes Verkaufsgespräch spielen, in dem jede Antwort sorgfältig eingewickelt wird.",
      "Her cevabın özenle paketlendiği abartılı bir satış konuşması oynayabilirsiniz.",
    ],
    [
      "Oder ihr könntet aus dem Papier eine sichtbare Grenze zwischen sachlicher Kritik und persönlichem Angriff legen.",
      "Ya da kâğıtla nesnel eleştiri ile kişisel saldırı arasında görünür bir sınır oluşturabilirsiniz.",
    ],
    [
      "Beide Übungen brauchen anschließend eine Auswertung. Eine lustige Rolle allein erklärt noch keine gelungene Kommunikation.",
      "Her iki alıştırmanın ardından değerlendirme gerekir. Komik bir rol tek başına başarılı iletişimi açıklamaz.",
    ],
  ],
  [
    "İki önerinin ortak gereği ne?",
    [
      "Sonrasında değerlendirme yapılması.",
      "Mara’nın habersizce taklit edilmesi.",
      "Tüm eleştirinin yasaklanması.",
    ],
    "“brauchen anschließend eine Auswertung” açık koşuldur. Mizah deneyimi başlatabilir; öğrenme çıkarımı ayrıca tartışılır.",
  ],
  [
    [
      "Wir spielen das eingewickelte Verkaufsgespräch.",
      "Paketlenmiş satış konuşmasını oynayalım.",
      "sales",
    ],
    [
      "Wir legen eine Grenze aus Papier.",
      "Kâğıttan bir sınır koyalım.",
      "boundary",
    ],
  ],
);
scene(
  s,
  "self",
  "Kendi payına gülmek",
  [
    [
      "Du nimmst die Rolle und sagst, du solltest den Workshop schließlich aufrollen. Dann rollst du langsam das Papier aus.",
      "Ruloyu alıp sonuçta atölyeyi açıp ele alman gerektiğini söylüyorsun. Sonra kâğıdı yavaşça açıyorsun.",
    ],
    [
      "Der absichtlich wörtliche Umgang mit aufrollen macht den Unterschied zwischen Wortlaut und Absicht sichtbar. Mara lacht mit.",
      "Aufrollen sözcüğünün bilerek gerçek anlamıyla ele alınması söylenenle niyet arasındaki farkı görünür kılıyor. Mara da gülüyor.",
    ],
    [
      "Du ergänzt, du hättest ebenfalls nachfragen können, statt stillschweigend eindeutige Begriffe vorauszusetzen.",
      "Sessizce kavramların açık olduğunu varsaymak yerine senin de soru sorabileceğini ekliyorsun.",
    ],
    [
      "Die Gruppe beginnt mit den Gesprächsrollen. Das Papier bleibt als freundliche Erinnerung an eine gemeinsame Lernpause liegen.",
      "Grup konuşma rollerine başlıyor. Kâğıt, ortak bir öğrenme molasının sıcak bir hatırası olarak kalıyor.",
    ],
  ],
  [
    "Bu çözüm neden Mara’yı hedef almıyor?",
    [
      "Yönetici kendi payını da görünür kılıyor.",
      "Mara’nın hatası herkesin önünde cezalandırılıyor.",
      "Mara odadan çıkarılıyor.",
    ],
    "Anlatıcı kendini şakaya dahil eder ve kendi varsayımını sorgular. “hätte … können” geçmişte kullanılmamış bir imkâna işaret eder.",
  ],
  [],
  "Birlikte açılan rulo",
);
scene(
  s,
  "rewrite",
  "Tek sayfalık kesinlik",
  [
    [
      "Die Gruppe ergänzt in der Einladung: Bitte bereiten Sie die Rolle einer Kundin vor; Material müssen Sie nicht mitbringen.",
      "Grup davete şunu ekliyor: Lütfen bir müşteri rolü hazırlayın; malzeme getirmeniz gerekmiyor.",
    ],
    [
      "Mara zeichnet am Rand eine kleine Papierrolle durch. Die Leiterin lässt die Zeichnung mit ihrer Zustimmung stehen.",
      "Mara kenara küçük bir kâğıt rulosu çizip üstünü çiziyor. Yürütücü onun onayıyla çizimi bırakıyor.",
    ],
    [
      "In der Probe sagt niemand mehr, die Aufgabe sei doch offensichtlich gewesen. Stattdessen prüft ihr, was tatsächlich im Text steht.",
      "Provada artık kimse görevin zaten apaçık olduğunu söylemiyor. Bunun yerine metinde gerçekten ne olduğunu kontrol ediyorsunuz.",
    ],
    [
      "Die Rolle aus Papier wird nicht gebraucht. Ihr habt trotzdem etwas Nützliches ausgepackt: eine verständlichere Arbeitsanweisung.",
      "Kâğıt rulosuna ihtiyaç kalmıyor. Yine de yararlı bir şeyi paketinden çıkarmış oldunuz: daha anlaşılır bir çalışma yönergesi.",
    ],
  ],
  [
    "Yeni davetin önemli farkı ne?",
    [
      "İstenen rolü ve malzeme gerekmemesini açıkça belirtmesi.",
      "Daha fazla belirsiz mecaz kullanması.",
      "Katılımcıları suçlaması.",
    ],
    "Somut örnek ile malzeme açıklaması iki anlam arasındaki belirsizliği giderir. Sadece metni uzatmak değil, gerekli bilgiyi eklemek çözüm olur.",
  ],
  [],
  "Paketten çıkan açıklık",
);
scene(
  s,
  "sales",
  "Paketlenmiş cevaplar",
  [
    [
      "Mara spielt ihre Rolle als Kundin und fragt nach dem Preis. Du wickelst die Antwort symbolisch in eine Lage Papier.",
      "Mara müşteri rolünü oynayıp fiyatı soruyor. Sen cevabı simgesel olarak bir kat kâğıda sarıyorsun.",
    ],
    [
      "Nach drei besonders höflichen Ausweichsätzen ruft jemand: Können wir die Antwort bitte endlich auspacken?",
      "Özellikle nazik üç kaçamak cümleden sonra biri sesleniyor: Cevabı artık paketinden çıkarabilir miyiz?",
    ],
    [
      "Ihr haltet an und vergleicht Höflichkeit mit Unklarheit. Eine freundliche Antwort kann kurz sein und trotzdem den tatsächlichen Preis nennen.",
      "Durup nezaket ile belirsizliği karşılaştırıyorsunuz. Dostça bir cevap kısa olabilir ve yine de gerçek fiyatı söyleyebilir.",
    ],
    [
      "Mara beendet ihre Rolle mit einer klaren Rückfrage. Die Papierverpackung landet im Altpapier, die Erkenntnis bleibt.",
      "Mara rolünü açık bir ek soruyla bitiriyor. Kâğıt ambalaj geri dönüşüme gidiyor, çıkarım kalıyor.",
    ],
  ],
  [
    "Alıştırmanın çıkarımı ne?",
    [
      "Nazik olmak, bilgiyi belirsiz bırakmayı gerektirmez.",
      "Her kısa cevap kabadır.",
      "Fiyat sorulmamalıdır.",
    ],
    "Hikâye nezaketi reddetmez; kaçamaklıkla karıştırılmasını sorgular. “trotzdem” iki özelliğin birlikte bulunabileceğini vurgular.",
  ],
  [],
  "Açılan fiyat etiketi",
);
scene(
  s,
  "boundary",
  "Kâğıttan ciddi sınır",
  [
    [
      "Ihr legt die Rolle Papier zwischen zwei Stühle. Auf einer Seite steht der Satz: Diese Erklärung ist unklar.",
      "Kâğıt rulosunu iki sandalye arasına seriyorsunuz. Bir tarafta şu cümle var: Bu açıklama belirsiz.",
    ],
    [
      "Auf der anderen Seite steht: Du erklärst immer alles schlecht. Schon die übertriebene Endlosigkeit von immer bringt einige zum Schmunzeln.",
      "Diğer tarafta şu yazıyor: Sen her şeyi her zaman kötü açıklıyorsun. Her zaman sözünün abartılı sınırsızlığı bile bazılarını gülümsetiyor.",
    ],
    [
      "Mara tritt in ihrer Rolle neben den ersten Satz: Darüber kann ich sprechen, ohne mich als Person verteidigen zu müssen.",
      "Mara rolü içinde ilk cümlenin yanına geçiyor: Kendimi kişi olarak savunmak zorunda kalmadan bunu konuşabilirim.",
    ],
    [
      "Ihr sammelt präzisere Formulierungen. Der Witz über die Rolle endet, die Unterscheidung zwischen Beobachtung und Pauschalurteil bleibt.",
      "Daha net ifadeler topluyorsunuz. Rol ile rulo arasındaki şaka sona eriyor, gözlem ile genelleme arasındaki ayrım kalıyor.",
    ],
  ],
  [
    "İlk cümle ikinciye göre nasıl farklı?",
    [
      "Belirli bir açıklamayı eleştiriyor, kişiyi genellemiyor.",
      "Hiçbir sorun belirtmiyor.",
      "Daha sert bir kişisel saldırı içeriyor.",
    ],
    "“Diese Erklärung” belirli bir ürüne odaklanır. “du … immer alles” kişiye dönük geniş bir genellemedir.",
  ],
  [],
  "İki sandalye arasındaki fark",
);

s = story(
  "schild",
  "Sessizlik İlanının Gürültüsü",
  "Bitte dieses Schild nicht laut vorlesen",
  "C1",
  "Bir müzedeki sessizlik levhası beklenmedik tartışma yaratıyor. Üslup, iletişim niyeti ve uygulama arasındaki çelişkiyi incele.",
  "town",
  "Schild",
);
scene(
  s,
  "start",
  "Sesli okunan sessizlik",
  [
    [
      "Im Stadtmuseum hängt ein neues Schild: Bitte bewahren Sie absolute Stille. Ein Besucher liest es seiner Begleiterin mit kräftiger Stimme vor.",
      "Kent müzesinde yeni bir levha asılıdır: Lütfen mutlak sessizliği koruyun. Bir ziyaretçi bunu yanındaki kişiye güçlü bir sesle okur.",
    ],
    [
      "Der Aufseher mahnt ihn daraufhin so laut zur Ruhe, dass sich drei weitere Gruppen umdrehen. Die gut gemeinte Regel vervielfacht ihren eigenen Anlass.",
      "Gözetmen bunun üzerine onu o kadar yüksek sesle sessizliğe çağırır ki üç grup daha dönüp bakar. İyi niyetli kural, kendi gerekçesini çoğaltır.",
    ],
    [
      "Du unterstützt das Museum bei der Besucherkommunikation. Der Leiter bittet dich um eine Lösung, die weder Menschen beschämt noch die Sammlung zur Geräuschkulisse macht.",
      "Müzenin ziyaretçi iletişimine destek veriyorsun. Müdür, insanları utandırmadan ve koleksiyonu bir gürültü fonuna dönüştürmeden bir çözüm bulmanı ister.",
    ],
    [
      "Du kannst zunächst die Formulierung des Schildes überprüfen oder die tatsächlichen Bedürfnisse der anwesenden Besucher erfragen.",
      "Önce levhanın ifadesini inceleyebilir ya da oradaki ziyaretçilerin gerçek ihtiyaçlarını sorabilirsin.",
    ],
  ],
  [
    "Başlangıçtaki temel çelişki hangisi?",
    [
      "Sessizliği sağlama çabasının yeni gürültü üretmesi.",
      "Müzede hiçbir kural olmaması.",
      "Ziyaretçinin levhayı görmemesi.",
    ],
    "Kuralın okunması ve yüksek sesle uygulanması aynı sonucu yeniden üretir. “daraufhin” olayların bağını, “so … dass” sonucu kurar.",
  ],
  [
    ["Ich überprüfe den Wortlaut.", "İfadeyi incelerim.", "wording"],
    ["Ich frage nach den Bedürfnissen.", "İhtiyaçları sorarım.", "needs"],
  ],
);
scene(
  s,
  "wording",
  "Mutlaklığın küçük açığı",
  [
    [
      "Du fragst, was absolute Stille praktisch bedeuten soll. Auch Schritte, ein Husten oder eine nötige Erklärung ließen sich schließlich nicht vollständig vermeiden.",
      "Mutlak sessizliğin uygulamada ne anlama geldiğini soruyorsun. Sonuçta adımlar, öksürük ya da gerekli bir açıklama da tamamen önlenemez.",
    ],
    [
      "Der Leiter gibt zu, das Schild solle vor allem lange, laute Gespräche verhindern. Seine Formulierung behauptet also mehr, als die Regel leisten muss.",
      "Müdür, levhanın asıl olarak uzun ve yüksek sesli konuşmaları önlemek istediğini kabul ediyor. Yani ifade, kuralın sağlaması gerekenden fazlasını iddia ediyor.",
    ],
    [
      "Eine Mitarbeiterin schlägt ironisch vor, man müsse vor dem nächsten Schild erst eine Schweigeprüfung bestehen. Die Gruppe lacht über die Übertreibung.",
      "Bir çalışan, bir sonraki levhadan önce sessizlik sınavından geçmek gerektiğini ironik biçimde öneriyor. Grup abartıya gülüyor.",
    ],
    [
      "Ihr könnt entweder eine konkrete Bitte formulieren oder die bestehende Regel in einer kurzen, freiwilligen Besucherbefragung prüfen.",
      "Somut bir rica yazabilir ya da mevcut kuralı kısa, gönüllü bir ziyaretçi anketinde değerlendirebilirsiniz.",
    ],
  ],
  [
    "Sessizlik sınavı önerisi nasıl okunmalı?",
    [
      "Mutlak kuralı görünür kılan ironik bir abartı olarak.",
      "Kesinleşmiş bir giriş zorunluluğu olarak.",
      "Yasal bir sınav duyurusu olarak.",
    ],
    "“ironisch” ve grubun tepkisi şakanın işaretleridir. Dolaylı anlatımdaki “man müsse” önerinin aktarıldığını gösterir; gerçek karar verildiğini göstermez.",
  ],
  [
    [
      "Wir formulieren eine konkrete Bitte.",
      "Somut bir rica yazalım.",
      "concrete",
    ],
    [
      "Wir fragen nach der Wirkung des Schildes.",
      "Levhanın etkisini soralım.",
      "survey",
    ],
  ],
);
scene(
  s,
  "needs",
  "Fısıltının da bağlamı var",
  [
    [
      "Eine Besucherin erklärt, sie lese das Schild ihrer sehbehinderten Begleitung vor. Ein anderes Paar wolle nur kurz den Weg zum Ausgang klären.",
      "Bir ziyaretçi, levhayı görme engelli refakatçisine okuduğunu açıklıyor. Başka bir çift yalnızca çıkışın yolunu kısaca öğrenmek istiyor.",
    ],
    [
      "Nicht jedes hörbare Wort ist also ein rücksichtsloses Gespräch. Gleichzeitig braucht eine Zeichengruppe im Nebenraum verlässliche Ruhe.",
      "Demek ki duyulan her sözcük düşüncesizce bir konuşma değildir. Aynı zamanda yan odadaki çizim grubunun öngörülebilir bir sessizliğe ihtiyacı vardır.",
    ],
    [
      "Du schlägst vor, die Bitte auf dem Schild mit zugänglicher Information und klar erkennbaren Gesprächsbereichen zu verbinden.",
      "Levhadaki ricayı erişilebilir bilgi ve açıkça belirlenmiş konuşma alanlarıyla birleştirmeyi öneriyorsun.",
    ],
    [
      "Der Leiter ist offen für eine räumliche Lösung oder zunächst für eine leise Schulung des Teams. Welche Priorität setzt du?",
      "Müdür mekânsal bir çözüme de önce ekibin sakin bir yönlendirme eğitimine de açık. Sen hangisine öncelik verirsin?",
    ],
  ],
  [
    "İhtiyaçları sormak ilk yorumu nasıl değiştiriyor?",
    [
      "Bazı konuşmaların erişim veya yön bulma ihtiyacından doğduğunu gösteriyor.",
      "Tüm konuşmaların kasıtlı rahatsızlık olduğunu kanıtlıyor.",
      "Çizim grubunun sessizlik istemediğini gösteriyor.",
    ],
    "Metin iki ihtiyacı birlikte tutar. “Gleichzeitig” ikinci gereksinimi geçersiz kılmadan yanına ekler.",
  ],
  [
    [
      "Wir kennzeichnen Gesprächsbereiche.",
      "Konuşma alanlarını belirleyelim.",
      "zones",
    ],
    [
      "Wir üben ruhige Hinweise im Team.",
      "Ekipte sakin uyarı pratiği yapalım.",
      "team",
    ],
  ],
);
scene(
  s,
  "concrete",
  "Sessizliği bağırmadan istemek",
  [
    [
      "Das neue Schild lautet: Bitte sprechen Sie hier leise und halten Sie längere Gespräche im Foyer. Der erwartete Umgang ist nun überprüfbar.",
      "Yeni levhada şöyle yazıyor: Lütfen burada alçak sesle konuşun ve uzun konuşmaları fuayede yapın. Beklenen davranış artık anlaşılır biçimde denetlenebilir.",
    ],
    [
      "Der Aufseher liest den Text probeweise im Flüsterton. Seine Kollegin bedankt sich feierlich dafür, dass die Generalprobe diesmal ohne Megafon auskommt.",
      "Gözetmen metni denemek için fısıltıyla okuyor. İş arkadaşı, genel provanın bu kez megafon olmadan yapılmasına törenle teşekkür ediyor.",
    ],
    [
      "Der Witz gilt der früheren Methode, nicht einer bestimmten Besucherin. Ihr besprecht ausdrücklich, wie Hinweise freundlich und unaufdringlich bleiben.",
      "Şaka belirli bir ziyaretçiye değil, önceki yönteme yöneliktir. Uyarıların nasıl dostça ve rahatsız etmeden kalacağını açıkça konuşuyorsunuz.",
    ],
    [
      "Die Sammlung wird nicht vollkommen lautlos. Das Schild verspricht es auch nicht mehr; es erleichtert vielmehr eine gemeinsame Rücksichtnahme.",
      "Koleksiyonun çevresi tamamen sessizleşmez. Levha da artık bunu vaat etmez; daha çok ortak bir özeni kolaylaştırır.",
    ],
  ],
  [
    "Yeni levhanın kazanımı ne?",
    [
      "Gerçekçi ve somut davranış belirtmesi.",
      "Hiç ses olmayacağını garanti etmesi.",
      "Bütün ziyaretçileri aynı anda dışarı çıkarması.",
    ],
    "“vielmehr” önceki iddiayı düzeltip asıl işlevi belirginleştirir. Amaç kusursuz sessizlik değil, uygulanabilir karşılıklı özen olur.",
  ],
  [],
  "Megafonsuz genel prova",
);
scene(
  s,
  "survey",
  "Levhanın anlaşılma testi",
  [
    [
      "Ihr bittet Besucher freiwillig, das Schild in eigenen Worten wiederzugeben. Einige verstehen es als Gesprächsverbot, andere nur als Bitte um leise Stimmen.",
      "Ziyaretçilerden gönüllü olarak levhayı kendi sözleriyle anlatmalarını istiyorsunuz. Bazıları konuşma yasağı, bazıları yalnızca alçak ses ricası olarak anlıyor.",
    ],
    [
      "Der Leiter notiert: Eindeutig uneindeutig. Das Wortspiel erleichtert das Eingeständnis, ersetzt aber die Auswertung nicht.",
      "Müdür not alıyor: Açıkça belirsiz. Sözcük oyunu kabul etmeyi kolaylaştırıyor ama değerlendirmenin yerini almıyor.",
    ],
    [
      "Ihr veröffentlicht keine Namen und zieht aus der kleinen Gruppe keine Aussage über sämtliche Museumsbesucher.",
      "İsimleri yayımlamıyor ve küçük gruptan tüm müze ziyaretçileri hakkında sonuç çıkarmıyorsunuz.",
    ],
    [
      "Auf dieser begrenzten Grundlage überarbeitet ihr das Schild. Ein bescheidener Befund ist hilfreicher als eine sehr laute Behauptung.",
      "Bu sınırlı temelde levhayı değiştiriyorsunuz. Mütevazı bir bulgu, çok gürültülü bir iddiadan daha yararlı.",
    ],
  ],
  [
    "Anketten hangi sonuç çıkarılabilir?",
    [
      "Bu küçük grupta levhanın farklı anlaşıldığı.",
      "Bütün ziyaretçilerin aynı düşündüğü.",
      "Levhanın tüm müzelerde kesinlikle yasaklanması gerektiği.",
    ],
    "Örneklemin kapsamı açıkça sınırlanır. Az sayıdaki yanıt evrensel bir yargıya dönüştürülmez.",
  ],
  [],
  "Açıkça belirsiz bulgu",
);
scene(
  s,
  "zones",
  "Konuşmanın yeri",
  [
    [
      "Neben dem Schild markiert ihr einen kurzen Weg zum Foyer und bietet Informationen in gut lesbarer Schrift an.",
      "Levhanın yanında fuayeye giden kısa yolu işaretliyor, bilgileri kolay okunur yazıyla sunuyorsunuz.",
    ],
    [
      "Eine Familie führt ihr angeregtes Gespräch dort weiter. Die Zeichengruppe kann im Sammlungsraum konzentriert arbeiten.",
      "Bir aile canlı konuşmasını orada sürdürüyor. Çizim grubu koleksiyon odasında yoğunlaşarak çalışabiliyor.",
    ],
    [
      "Der Aufseher zeigt nur noch freundlich auf den Wegweiser. Er nennt ihn seinen leisesten und zugleich deutlichsten Kollegen.",
      "Gözetmen artık yalnızca dostça yön tabelasını gösteriyor. Onu hem en sessiz hem de en açık konuşan iş arkadaşı diye adlandırıyor.",
    ],
    [
      "Das Schild bleibt eine Bitte, keine magische Lösung. Ihr prüft später, ob die neue Aufteilung auch zu Stoßzeiten funktioniert.",
      "Levha sihirli bir çözüm değil, bir rica olarak kalıyor. Yeni düzenin yoğun saatlerde de işleyip işlemediğini daha sonra kontrol ediyorsunuz.",
    ],
  ],
  [
    "Son cümle çözümün hangi yönünü vurguluyor?",
    [
      "Farklı koşullarda hâlâ sınanması gerektiğini.",
      "Kesin olarak her zaman işe yaradığını.",
      "Yön tabelasının canlı olduğunu.",
    ],
    "“ob” açık bir değerlendirme sorusu getirir. Başlangıçtaki olumlu gözlem, yoğun saatler için otomatik kanıt sayılmaz.",
  ],
  [],
  "En sessiz iş arkadaşı",
);
scene(
  s,
  "team",
  "Fısıltı eğitiminin küçük başarısı",
  [
    [
      "Im Team übt ihr kurze, freundliche Hinweise. Das Schild dient dabei als Hilfe, nicht als Ersatz für eine situative Entscheidung.",
      "Ekipte kısa ve dostça uyarılar çalışıyorsunuz. Levha, duruma göre karar vermenin yerine değil, ona yardımcı olarak kullanılıyor.",
    ],
    [
      "Ein Kollege spielt einen viel zu enthusiastischen Flüsterer, dessen Flüstern fast den ganzen Raum erreicht. Alle erkennen das Problem sofort.",
      "Bir iş arkadaşı, fısıltısı neredeyse bütün odaya ulaşan aşırı hevesli bir fısıltıcıyı canlandırıyor. Herkes sorunu hemen fark ediyor.",
    ],
    [
      "Ihr lacht über die Überzeichnung und übt anschließend eine ruhigere Variante, ohne echte Besucher nachzuahmen.",
      "Abartılı canlandırmaya gülüyor, ardından gerçek ziyaretçileri taklit etmeden daha sakin bir seçenek deniyorsunuz.",
    ],
    [
      "Bei der nächsten Öffnung zeigt sich eine vorsichtige Verbesserung. Das Schild ist unverändert, aber seine Anwendung klingt anders.",
      "Sonraki açılışta sınırlı bir iyileşme gözleniyor. Levha aynı ama uygulanışının sesi farklı.",
    ],
  ],
  [
    "Bu sonun temel çıkarımı ne?",
    [
      "Yazılı kural kadar uygulama biçimi de önemli.",
      "Levha tek başına her davranışı belirler.",
      "Ziyaretçileri taklit etmek şarttır.",
    ],
    "Metin değişmezken davranış değişir. “vorsichtige Verbesserung” de sonucun sınırlı ve temkinli değerlendirildiğini belirtir.",
  ],
  [],
  "Daha sessiz uygulama",
);

s = story(
  "teekanne",
  "Çaydanlığın Kesin Tanıklığı",
  "Die Teekanne, die alles besser wusste",
  "C2",
  "Güvenilmez anlatıcının iddialarını tart. İroni, örtük anlam ve kanıt sınırlarıyla dört farklı edebî sonu keşfet.",
  "cafe",
  "Teekanne",
);
scene(
  s,
  "start",
  "Kendinden emin bir tanık",
  [
    [
      "Ich will mich nicht rühmen, begann die Teekanne, doch ohne mich wäre diese Sitzung kaum zu retten gewesen. Dass sie währenddessen stumm auf dem Tisch gestanden hatte, verschwieg sie vorläufig.",
      "Övünmek istemem, diye başladı çaydanlık, ama ben olmasaydım bu toplantıyı kurtarmak pek mümkün olmazdı. O sırada masada sessizce durmuş olduğunu şimdilik söylemedi.",
    ],
    [
      "Die Gäste stritten darüber, wer den entscheidenden Einfall gehabt habe. Die Teekanne deutete ihr bloßes Dabeisein bereits als Beweis für geistige Urheberschaft.",
      "Konuklar belirleyici fikrin kime ait olduğunu tartışıyordu. Çaydanlık yalnızca orada bulunmasını bile düşünsel sahipliğin kanıtı olarak yorumluyordu.",
    ],
    [
      "Als Protokollantin sollst du den Abend festhalten. Deine Aufgabe besteht weder darin, jedes Selbstlob zu bestätigen, noch darin, den Erzähler vorschnell zum Lügner zu erklären.",
      "Tutanak yazarı olarak akşamı kayda geçireceksin. Görevin ne her övgüyü onaylamak ne de anlatıcıyı aceleyle yalancı ilan etmek.",
    ],
    [
      "Du kannst die Teekanne um überprüfbare Einzelheiten bitten oder zunächst die anderen Stimmen zu Wort kommen lassen.",
      "Çaydanlıktan doğrulanabilir ayrıntılar isteyebilir ya da önce diğer seslerin söz almasını sağlayabilirsin.",
    ],
  ],
  [
    "Anlatıcının güvenilirliğini ilk anda ne zedeliyor?",
    [
      "Orada bulunmayı fikrin sahibi olmanın kanıtı sayması.",
      "Toplantıya ait hiçbir ayrıntı bilmemesi.",
      "Konukların tamamının onu yalanlaması.",
    ],
    "“bloßes Dabeisein” ile “geistige Urheberschaft” arasındaki sıçrama gerekçesizdir. Anlatı henüz tüm sözlerin yalan olduğunu kanıtlamaz.",
  ],
  [
    [
      "Ich bitte um überprüfbare Einzelheiten.",
      "Doğrulanabilir ayrıntılar isterim.",
      "details",
    ],
    [
      "Ich höre zunächst die anderen an.",
      "Önce diğerlerini dinlerim.",
      "voices",
    ],
  ],
);
scene(
  s,
  "details",
  "Sessizliğin yorumu",
  [
    [
      "Die Teekanne erklärte, ihr bedeutungsvolles Schweigen habe die Runde zum Nachdenken gezwungen. Auf die Frage, woran sich dessen Wirkung erkennen lasse, verwies sie auf die zufällig folgende Pause.",
      "Çaydanlık, anlamlı sessizliğinin grubu düşünmeye zorladığını açıkladı. Etkisinin nereden anlaşıldığı sorulunca tesadüfen ardından gelen araya işaret etti.",
    ],
    [
      "Du notierst die zeitliche Abfolge, trennst sie aber von der behaupteten Ursache. Ein Ereignis, das nach einem anderen eintritt, ist nicht schon dessen nachgewiesene Folge.",
      "Zamansal sıralamayı not ediyor ama iddia edilen nedenden ayırıyorsun. Bir olayın diğerinden sonra olması, onun kanıtlanmış sonucu olduğu anlamına gelmez.",
    ],
    [
      "Die Teekanne nennt diese Unterscheidung kleinlich. Ihre plötzliche Gereiztheit macht die Behauptung weder falsch noch überzeugender.",
      "Çaydanlık bu ayrımı kılı kırk yarmak diye niteliyor. Birden sinirlenmesi iddiayı ne yanlış ne de daha ikna edici yapıyor.",
    ],
    [
      "Du kannst um eine unabhängige Beobachtung bitten oder den Widerspruch als literarisches Stilmittel sichtbar im Protokoll stehen lassen.",
      "Bağımsız bir gözlem isteyebilir ya da çelişkiyi edebî bir anlatım aracı olarak tutanakta görünür bırakabilirsin.",
    ],
  ],
  [
    "Tutanak yazarı hangi ayrımı koruyor?",
    [
      "Zamansal ardışıklık ile kanıtlanmış nedensellik arasındaki ayrımı.",
      "Sessizlik ile hiç toplantı yapılmaması arasındaki ayrımı.",
      "Her sinirli kişinin kesinlikle yalan söylediği yargısını.",
    ],
    "“nicht schon” otomatik çıkarıma itiraz eder. Duygusal tepki de bağımsız kanıtın yerine geçmez.",
  ],
  [
    [
      "Ich suche eine unabhängige Beobachtung.",
      "Bağımsız bir gözlem ararım.",
      "evidence",
    ],
    [
      "Ich lasse den Widerspruch sichtbar.",
      "Çelişkiyi görünür bırakırım.",
      "irony",
    ],
  ],
);
scene(
  s,
  "voices",
  "Birden fazla küçük hakikat",
  [
    [
      "Die Tasse erinnerte sich an einen Satz der Gastgeberin, der Löffel an eine Skizze auf der Serviette. Die Teekanne hielt beides für bloße Begleiterscheinungen ihrer Anwesenheit.",
      "Fincan ev sahibinin bir cümlesini, kaşık peçetedeki bir çizimi hatırlıyordu. Çaydanlık ikisini de kendi varlığının yalnızca yan etkileri sayıyordu.",
    ],
    [
      "Die Gastgeberin erklärte dagegen, die Idee sei allmählich im Gespräch entstanden. Sie widersprach damit dem Alleinanspruch, nicht notwendig jeder einzelnen Erinnerung.",
      "Ev sahibi ise fikrin konuşma sırasında yavaş yavaş oluştuğunu açıkladı. Böylece tek başına sahiplik iddiasına karşı çıktı; her bir anıyı zorunlu olarak reddetmedi.",
    ],
    [
      "Du erkennst, dass die Stimmen keine fertige Rangliste ergeben. Ein seriöser Bericht darf Uneinigkeit enthalten, ohne sie mit einer beliebigen Lösung zuzudecken.",
      "Seslerin hazır bir sıralama oluşturmadığını fark ediyorsun. Ciddi bir anlatım, görüş ayrılığını rastgele bir çözümle örtmeden içinde barındırabilir.",
    ],
    [
      "Du kannst ein mehrstimmiges Protokoll verfassen oder eine kurze, ausdrücklich fiktive Zugabe für die Gruppe schreiben.",
      "Çoksesli bir tutanak yazabilir ya da grup için açıkça kurmaca olarak belirtilen kısa bir ek metin hazırlayabilirsin.",
    ],
  ],
  [
    "Ev sahibinin itirazının kapsamı ne?",
    [
      "Fikrin yalnızca bir nesneye ait olduğu iddiası.",
      "Diğer tüm anıların kesinlikle uydurma olduğu iddiası.",
      "Konuşmanın hiç yaşanmamış olması.",
    ],
    "“nicht notwendig” önemli bir sınırlamadır. Bir iddianın kapsamını eleştirmek, ona bağlı her ayrıntıyı reddetmek değildir.",
  ],
  [
    [
      "Ich schreibe ein mehrstimmiges Protokoll.",
      "Çoksesli bir tutanak yazarım.",
      "polyphony",
    ],
    [
      "Ich kennzeichne eine fiktive Zugabe.",
      "Kurmaca bir ek metni açıkça işaretlerim.",
      "fiction",
    ],
  ],
);
scene(
  s,
  "evidence",
  "Mütevazı bir çay lekesi",
  [
    [
      "Auf der Serviette findet ihr tatsächlich eine Skizze mit einer Uhrzeit. Sie stützt die Erinnerung an einen gemeinsamen Entwurf, beweist aber nicht sämtliche behaupteten Gedankenwege.",
      "Peçetede gerçekten saat yazılı bir çizim buluyorsunuz. Ortak taslak anısını destekliyor ama ileri sürülen düşünce yollarının tümünü kanıtlamıyor.",
    ],
    [
      "Die Teekanne besteht darauf, wenigstens den runden Fleck verursacht zu haben. Diesmal ist ihr Anspruch erfreulich bescheiden und mit dem feuchten Boden vereinbar.",
      "Çaydanlık en azından yuvarlak lekeye kendisinin sebep olduğunda ısrar ediyor. Bu kez iddiası sevindirici ölçüde mütevazı ve ıslak tabanla uyumlu.",
    ],
    [
      "Du hältst fest, was beobachtet wurde, was erinnert und was bloß vermutet wird. Die Kategorien bleiben auch dort getrennt, wo ein besonders hübscher Satz sie gern vermischen würde.",
      "Neyin gözlendiğini, neyin hatırlandığını ve neyin yalnızca tahmin edildiğini kaydediyorsun. Özellikle hoş bir cümlenin bunları karıştırmak istediği yerde bile kategoriler ayrı kalıyor.",
    ],
    [
      "Am Ende darf die Teekanne den Fleck signieren. Ihr größter belegbarer Beitrag misst neun Zentimeter im Durchmesser.",
      "Sonunda çaydanlığın lekeyi imzalamasına izin veriliyor. Kanıtlanabilir en büyük katkısının çapı dokuz santimetre.",
    ],
  ],
  [
    "Son cümledeki mizah nasıl kuruluyor?",
    [
      "Büyük düşünsel iddianın ölçülebilir küçük bir lekeye daralmasıyla.",
      "Fikrin kesin olarak leke tarafından üretildiğinin kanıtlanmasıyla.",
      "Tüm gözlemlerin geçersiz sayılmasıyla.",
    ],
    "Soyut büyüklük iddiası somut çap ölçüsüne indirilir. “belegbar” önemli sınırdır; bilinmeyen bütün katkıların yokluğu iddia edilmez.",
  ],
  [],
  "Dokuz santimetrelik katkı",
);
scene(
  s,
  "irony",
  "Alçakgönüllülükle taçlanan rapor",
  [
    [
      "Du übernimmst den ersten Satz der Teekanne wörtlich: Ich will mich nicht rühmen. Direkt darunter zitierst du ihre fünf nachfolgenden Selbstlobreden.",
      "Çaydanlığın ilk cümlesini aynen alıyorsun: Övünmek istemem. Hemen altında ardından gelen beş kendini övme konuşmasını alıntılıyorsun.",
    ],
    [
      "Der Text behauptet nicht ausdrücklich, die Teekanne sei eitel. Die sorgfältige Gegenüberstellung lässt die Lesenden den Widerspruch selbst entdecken.",
      "Metin çaydanlığın kendini beğenmiş olduğunu açıkça ileri sürmüyor. Dikkatli yan yana koyma, okurların çelişkiyi kendilerinin keşfetmesini sağlıyor.",
    ],
    [
      "Als die Teekanne den Bericht liest, lobt sie dessen vornehme Zurückhaltung. Dass auch dieses Lob sie selbst ins rechte Licht rücken soll, bleibt der Runde nicht verborgen.",
      "Çaydanlık raporu okuyunca onun zarif ölçülülüğünü övüyor. Bu övgünün de kendisini iyi göstermeye çalıştığı grubun gözünden kaçmıyor.",
    ],
    [
      "Du kennzeichnest den Abschnitt als satirische Darstellung. Die tatsächlichen Sitzungsnotizen bleiben daneben unverändert zugänglich.",
      "Bölümü hicivsel anlatım olarak işaretliyorsun. Gerçek toplantı notları yanında değiştirilmeden erişilebilir kalıyor.",
    ],
  ],
  [
    "İroni okura nasıl aktarılıyor?",
    [
      "İddia ile davranış yan yana getirilerek.",
      "Yalnızca açık bir hakaret kullanılarak.",
      "Gerçek notlar gizlice değiştirilerek.",
    ],
    "Söylenen “övünmemek” ile ardından gelen öz övgüler uyuşmaz. Okur çıkarımı bu düzenlemeden üretir; ayrı tutulan gerçek notlar çarpıtılmaz.",
  ],
  [],
  "Ölçülü öz övgü",
);
scene(
  s,
  "polyphony",
  "Kesin hüküm yerine açık kayıt",
  [
    [
      "Im Protokoll stehen die Erinnerungen nebeneinander, jeweils mit ihrer Quelle. Wo sie auseinandergehen, vermerkst du die Abweichung, ohne vorschnell einen Sieger zu bestimmen.",
      "Tutanakta anılar, her birinin kaynağıyla yan yana duruyor. Ayrıldıkları yerde aceleyle bir kazanan belirlemeden farkı not ediyorsun.",
    ],
    [
      "Die Teekanne beantragt, ihre Stimme fett zu drucken, weil sie schließlich das größte Gefäß sei. Die Tasse fragt, ob man Wahrheit jetzt in Litern messe.",
      "Çaydanlık, sonuçta en büyük kap kendisi olduğu için sözlerinin kalın yazılmasını istiyor. Fincan, artık hakikatin litreyle ölçülüp ölçülmediğini soruyor.",
    ],
    [
      "Ihr lacht über die unpassende Maßeinheit und behaltet dieselbe Schriftgröße für alle. Gleiche Darstellung bedeutet dabei nicht, dass jede Behauptung gleich gut belegt wäre.",
      "Uygunsuz ölçü birimine gülüyor ve herkes için aynı yazı boyutunu koruyorsunuz. Eşit sunum, her iddianın eşit derecede kanıtlandığı anlamına gelmiyor.",
    ],
    [
      "Am Rand bleibt Platz für spätere Ergänzungen. Die Teekanne nennt ihn großzügig ihren noch ungeschriebenen zweiten Band.",
      "Kenarda sonraki eklemeler için yer kalıyor. Çaydanlık bunu cömertçe henüz yazılmamış ikinci cildi diye adlandırıyor.",
    ],
  ],
  [
    "“Aynı yazı boyutu” hangi anlama gelmez?",
    [
      "İddiaların kanıt gücünün eşit olduğu anlamına.",
      "Kaynakların görünür tutulduğu anlamına.",
      "Sunumda ayrıcalık verilmediği anlamına.",
    ],
    "Metin temsil eşitliği ile bilgiye dayalı güvenilirliği ayırır. İkisini bir tutmak, çaydanlığın boyut ile hakikat arasında kurduğu hatalı bağa benzer.",
  ],
  [],
  "Litreyle ölçülmeyen hakikat",
);
scene(
  s,
  "fiction",
  "Çay komitesinin kurmaca kararı",
  [
    [
      "Du schreibst eine ausdrücklich erfundene Zugabe: Der Ausschuss zur Förderung bescheidener Teekannen verleiht der Teekanne einen Preis für unauffällige Selbstdarstellung.",
      "Açıkça uydurulmuş bir ek yazıyorsun: Mütevazı Çaydanlıkları Destekleme Kurulu, çaydanlığa göze batmayan öz sunum ödülü veriyor.",
    ],
    [
      "In ihrer Dankesrede betont sie, die Auszeichnung sei ihr eigentlich zu klein; aus Rücksicht auf die anderen werde sie dennoch dreißig Minuten darüber sprechen.",
      "Teşekkür konuşmasında ödülün aslında kendisine küçük geldiğini vurguluyor; yine de diğerlerini düşündüğü için bu konuda otuz dakika konuşacakmış.",
    ],
    [
      "Die Runde erkennt die satirische Übertreibung. Niemand verwechselt den erfundenen Ausschuss mit einem tatsächlichen Beschluss des Abends.",
      "Grup hicivsel abartıyı fark ediyor. Kimse uydurulmuş kurulu akşamın gerçek bir kararıyla karıştırmıyor.",
    ],
    [
      "Die Teekanne verlangt eine Fortsetzung. Du versprichst lediglich eine zweite Tasse Tee: Auch erzählerische Großzügigkeit braucht gelegentlich eine Pause.",
      "Çaydanlık devamını istiyor. Sen yalnızca ikinci bir fincan çay vaat ediyorsun: Anlatısal cömertliğin de bazen molaya ihtiyacı vardır.",
    ],
  ],
  [
    "Bu son neden gerçek tutanakla karışmıyor?",
    [
      "Ek açıkça kurmaca olarak işaretlendiği için.",
      "Toplantıda gerçekten aynı kurul karar aldığı için.",
      "Okurların tüm kaynakları kaldırıldığı için.",
    ],
    "İcat edilmiş kurul ve konuşma, ayrı ve açık bir kurmaca çerçevesindedir. İroni, “başkalarını düşünme” iddiasıyla uzun öz övgü arasındaki uyumsuzluktan doğar.",
  ],
  [],
  "Mütevazılık ödülü",
);

const newWords = [
  [
    "Koffer",
    "der",
    "bavul",
    "Koffer",
    "Mein Koffer hat ein gelbes Band.",
    "Bavulumun sarı bir kurdelesi var.",
  ],
  [
    "Probe",
    "die",
    "prova; deneme",
    "Proben",
    "Die Probe beginnt um zehn Uhr.",
    "Prova saat onda başlıyor.",
  ],
  [
    "Rolle",
    "die",
    "rol; rulo",
    "Rollen",
    "Diese Rolle ist aus Papier.",
    "Bu rulo kâğıttan.",
  ],
  [
    "Schild",
    "das",
    "levha; tabela",
    "Schilder",
    "Auf dem Schild steht eine Bitte.",
    "Levhada bir rica yazıyor.",
  ],
  [
    "Teekanne",
    "die",
    "çaydanlık; çay demliği",
    "Teekannen",
    "Die Teekanne steht auf dem Tisch.",
    "Çaydanlık masanın üzerinde duruyor.",
  ],
].map(([word, article, meaning, plural, de, tr], i) => ({
  id: `story-comedy-word-${i + 1}`,
  word,
  article,
  meaning,
  plural,
  de,
  tr,
  repository: false,
}));
for (const story of output) {
  for (const n of story.scenes) {
    if (
      !n.lines.some((l) =>
        l.de.toLowerCase().includes(story.word.toLowerCase()),
      )
    )
      throw Error(`${story.id}/${n.id}: missing glossary word`);
    const [answer, ...wrong] = n.question.options;
    const shift = (story.scenes.indexOf(n) + output.indexOf(story)) % 3;
    n.question.options = [answer, ...wrong]
      .slice(shift)
      .concat([answer, ...wrong].slice(0, shift));
  }
  delete story.word;
}
writeFileSync(
  "src/data/stories/comedy-stories.json",
  JSON.stringify(output, null, 2) + "\n",
);
writeFileSync(
  "src/data/stories/comedy-glossary.json",
  JSON.stringify(newWords, null, 2) + "\n",
);
console.log(
  `${output.length} hikâye; ${output.reduce((n, s) => n + s.scenes.length, 0)} sahne. Eski içerikler değiştirilmedi.`,
);
