// Original editorial story; completes the fixed catalog without another API call.
import { writeFileSync, mkdirSync } from "node:fs";
const scenes = [];
function scene(id, title, lines, q, choices, ending, focus) {
  scenes.push({
    id,
    title,
    lines: lines.map(([de, tr]) => ({ de, tr })),
    question: {
      prompt: q[0],
      options: q[1],
      correctIndex: 0,
      explanation: q[2],
    },
    choices: (choices ?? []).map(([de, tr]) => ({ de, tr })),
    ending: ending ?? "",
    focus,
  });
}
const word = (word, article, meaning, plural, de, tr) => ({
  word,
  form: word,
  article,
  meaning,
  plural,
  de,
  tr,
});
scene(
  "start",
  "Okuyanı da okuyan bir not",
  [
    [
      "Im offenen Schreibatelier hängt eine ununterzeichnete Notiz neben einem Spiegel: Die Antwort steht nicht dort, wo ihr sie sucht. Daneben liegt ein Stapel freigegebener Übungstexte, die ausdrücklich zum gemeinsamen Lesen bestimmt sind.",
      "Açık yazı atölyesinde bir aynanın yanında imzasız bir not asılıdır: Yanıt, onu aradığınız yerde değil. Yanında, birlikte okunması için özellikle ayrılmış ve paylaşımına izin verilmiş alıştırma metinlerinden bir deste vardır.",
    ],
    [
      "Ein Teilnehmer erklärt die Sache sofort zum Rätsel über die unbekannte Verfasserin. Eine andere Leserin hält dagegen, dass gerade diese Suche nach einer Person von der eigentlichen Frage des Textes ablenken könnte.",
      "Bir katılımcı durumu hemen bilinmeyen yazarla ilgili bir bilmece ilan eder. Başka bir okur ise tam da bir kişi aramanın metnin asıl sorusundan uzaklaştırabileceğini düşünür.",
    ],
    [
      "Du bemerkst, dass die Buchstaben weder gespiegelt noch verschlüsselt sind. Unklar bleibt vielmehr, worauf das Wort dort verweist und ob die fehlende Unterschrift Teil der Aufgabe oder ein bloßes Versehen ist.",
      "Harflerin ne ters yazıldığını ne de şifrelendiğini fark edersin. Belirsiz kalan, asıl olarak orada sözcüğünün neye gönderme yaptığı ve imzanın yokluğunun görevin parçası mı yoksa basit bir unutkanlık mı olduğudur.",
    ],
    [
      "Die Atelierleiterin erlaubt euch, den Aushang und die freigegebenen Blätter zu untersuchen; persönliche Unterlagen bleiben unberührt. Du kannst zunächst die sprachliche Anlage prüfen oder nach dem dokumentierten Entstehungszusammenhang fragen.",
      "Atölye yöneticisi duyuruyu ve paylaşımına izin verilen sayfaları incelemenize izin verir; kişisel belgelere dokunulmaz. Önce dilsel kuruluşu inceleyebilir veya belgelenmiş oluşum bağlamını sorabilirsin.",
    ],
  ],
  [
    "Başlangıçta hangi gözlem doğrudan doğrulanabiliyor?",
    [
      "Harflerin ters veya şifreli yazılmadığı.",
      "Notu kimin yazdığı.",
      "İmzanın neden bulunmadığı.",
    ],
    "“weder gespiegelt noch verschlüsselt” harflerin durumunu doğrudan belirtir. Gönderimin ve imzanın anlamı ise açık bırakıldığı için gözlemle yorum birbirine karıştırılmamalıdır.",
  ],
  [
    [
      "Ich untersuche zuerst die sprachliche Anlage.",
      "Önce dilsel kuruluşu incelerim.",
    ],
    [
      "Ich frage nach dem dokumentierten Entstehungszusammenhang.",
      "Belgelenmiş oluşum bağlamını sorarım.",
    ],
  ],
  null,
  word(
    "Notiz",
    "die",
    "kısa not",
    "Notizen",
    "Die Notiz lässt mehrere Fragen offen.",
    "Not birkaç soruyu açık bırakıyor.",
  ),
);
scene(
  "path-a",
  "Gösterilen yer ile aranan anlam",
  [
    [
      "Du liest die Notiz mehrfach und hältst fest, dass dort ohne einen eindeutigen Bezugspunkt auskommen muss. Eine Lesart bezieht das Wort auf den Spiegel, eine andere auf die Erwartung, hinter jedem Text müsse eine verborgene Person stehen.",
      "Notu birkaç kez okuyup orada sözcüğünün açık bir gönderim noktası olmadan işlediğini not edersin. Bir okuma sözcüğü aynaya, diğeri ise her metnin arkasında gizli bir kişi bulunması gerektiği beklentisine bağlar.",
    ],
    [
      "Die zweite Lesart macht aus der fehlenden Unterschrift einen bewussten Hinweis, kann diese Absicht aber nicht belegen. Gerade weil sie reizvoll klingt, möchtest du nicht unterschlagen, wo die Auslegung über das Beobachtbare hinausgeht.",
      "İkinci okuma eksik imzayı bilinçli bir ipucuna dönüştürür ama bu niyeti kanıtlayamaz. Özellikle ilgi çekici göründüğü için yorumun gözlemlenebilir olanı nerede aştığını gizlemek istemezsin.",
    ],
    [
      "Eine Teilnehmerin schlägt vor, den Satz an einer anderen Wand anzubringen und zu beobachten, wie sich die Deutung verändert. Die Leiterin stimmt einem vorübergehenden, klar als Versuch bezeichneten Aufbau zu.",
      "Bir katılımcı cümleyi başka bir duvara asmayı ve yorumun nasıl değiştiğini gözlemlemeyi önerir. Yönetici, açıkça deneme olarak belirtilen geçici bir düzene onay verir.",
    ],
    [
      "Ihr könnt diesen Versuch gemeinsam durchführen oder die beiden Lesarten in einem eigenen, namentlich gekennzeichneten Kommentar gegenüberstellen. Keine der Möglichkeiten verrät allein, wer die ursprüngliche Notiz verfasst hat.",
      "Bu denemeyi birlikte yapabilir veya iki okumayı kendi imzalı yorumunda karşılaştırabilirsin. Bu yolların hiçbiri, ilk notu kimin yazdığını tek başına açığa çıkarmaz.",
    ],
  ],
  [
    "İkinci okumanın sınırı nedir?",
    [
      "Çekici bir yorum olması, varsaydığı niyeti kanıtlamıyor.",
      "Metindeki bütün harfleri değiştirmek zorunda olması.",
      "Aynanın gerçekten bulunmamasına dayanması.",
    ],
    "“kann diese Absicht aber nicht belegen” ifadesi yorumun sınırını doğrudan belirtir. Bir okumanın anlamlı görünmesi, yazarın gerçekten o niyeti taşıdığını göstermeye yetmez.",
  ],
  [
    [
      "Wir erproben die Wirkung an einer anderen Wand.",
      "Başka duvardaki etkisini deneriz.",
    ],
    [
      "Ich schreibe einen eigenen Kommentar zu beiden Lesarten.",
      "İki okuma üzerine kendi yorumumu yazarım.",
    ],
  ],
  null,
  word(
    "Lesart",
    "die",
    "bir metni yorumlama biçimi; okuma",
    "Lesarten",
    "Diese Lesart ist möglich, aber nicht abschließend belegt.",
    "Bu okuma mümkündür ama kesin biçimde kanıtlanmış değildir.",
  ),
);
scene(
  "path-b",
  "Bir belgenin gösterdiği kadar",
  [
    [
      "Die Leiterin zeigt euch einen zur Einsicht freigegebenen Entwurf der letzten Schreibübung. Darin steht derselbe Satz als Beispiel für einen Ausdruck, dessen Bezug erst durch den Ort seiner Verwendung entsteht.",
      "Yönetici, son yazı alıştırmasının incelenmesine izin verilmiş bir taslağını gösterir. Aynı cümle orada, gönderimi ancak kullanıldığı yerle oluşan bir ifadeye örnek olarak geçer.",
    ],
    [
      "Auf dem Entwurf ist Anja als Verfasserin des Beispiels genannt. Das Blatt belegt damit eine frühere Fassung; es beweist noch nicht, wer später die Notiz neben dem Spiegel aufgehängt hat.",
      "Taslakta örneğin yazarı olarak Anja belirtilmiştir. Sayfa böylece önceki bir sürümü belgeler; notu daha sonra aynanın yanına kimin astığını henüz kanıtlamaz.",
    ],
    [
      "Anja ist heute anwesend und erklärt sich bereit, die freigegebene Übung zu erläutern. Sie möchte jedoch nicht, dass beiläufige private Gespräche zum Gegenstand der Nachforschung werden.",
      "Anja bugün oradadır ve paylaşımına izin verilen alıştırmayı açıklamayı kabul eder. Ancak arada geçen özel konuşmaların araştırmanın konusuna dönüşmesini istemez.",
    ],
    [
      "Du kannst sie gezielt nach Beispiel und Aushang fragen oder die ungeklärte Weiterverwendung bestehen lassen und auf den öffentlich sichtbaren Satz mit einem eigenen Text antworten.",
      "Ona özellikle örneği ve duyuruyu sorabilir veya sonraki kullanımın belirsizliğini olduğu gibi bırakıp herkese açık cümleye kendi metninle karşılık verebilirsin.",
    ],
  ],
  [
    "Taslağın sağladığı kanıt hangi sınır içinde kalıyor?",
    [
      "Önceki sürümü gösteriyor; duyuruyu kimin astığını henüz göstermiyor.",
      "Özel konuşmaların hepsini açıklıyor.",
      "Aynanın niçin seçildiğini kesinleştiriyor.",
    ],
    "“es beweist noch nicht” kanıtın kapsamını sınırlar. Metnin önceki sürümü ile notun sonradan sergilenmesi ayrı olaylar olarak ele alınır.",
  ],
  [
    [
      "Ich frage Anja gezielt nach Beispiel und Aushang.",
      "Anja’ya özellikle örneği ve duyuruyu sorarım.",
    ],
    [
      "Ich antworte mit einem eigenen Text auf die offene Frage.",
      "Açık soruya kendi metnimle karşılık veririm.",
    ],
  ],
  null,
  word(
    "Entwurf",
    "der",
    "taslak",
    "Entwürfe",
    "Der Entwurf zeigt eine frühere Fassung.",
    "Taslak önceki bir sürümü gösteriyor.",
  ),
);
scene(
  "end-a1",
  "Yer değiştirince değişen soru",
  [
    [
      "Ihr nehmt den Spiegel nicht weg, sondern befestigt eine deutlich als Versuch gekennzeichnete Kopie des Satzes an der gegenüberliegenden Wand. Einige Lesende beziehen dort nun auf einen ganz anderen Ausschnitt des Raums.",
      "Aynayı kaldırmak yerine cümlenin açıkça deneme olarak işaretlenmiş bir kopyasını karşı duvara asarsınız. Bazı okurlar artık orada sözcüğünü odanın bambaşka bir bölümüne bağlar.",
    ],
    [
      "Andere halten an ihrer ersten Deutung fest und erklären, weshalb die ursprüngliche Anordnung für sie weiterhin maßgeblich ist. Die unterschiedlichen Reaktionen werden mit Einverständnis gesammelt, ohne daraus einen Wettbewerb um die einzig richtige Antwort zu machen.",
      "Diğerleri ilk yorumlarında kalır ve başlangıçtaki düzenin kendileri için neden hâlâ belirleyici olduğunu açıklar. Farklı tepkiler, tek doğru yanıt için yarışmaya dönüştürülmeden, izin alınarak toplanır.",
    ],
    [
      "Der Spiegel wird dadurch weder als endgültiger Schlüssel entlarvt noch als bedeutungsloses Requisit abgetan. Sichtbar wird vielmehr, wie stark eine räumliche Anordnung bestimmte Lesarten nahelegt, ohne sie allen Menschen zwingend vorzuschreiben.",
      "Böylece ayna ne kesin çözüm anahtarı olarak açığa çıkarılır ne de anlamsız bir dekor sayılır. Daha çok, mekânsal düzenin belli okumaları herkese zorunlu kılmadan ne kadar güçlü biçimde önerdiği görünür olur.",
    ],
    [
      "Ihr gestaltet aus dem Versuch eine kleine gemeinsame Installation und nennt die Mitwirkenden. Die Herkunft der ersten Notiz bleibt offen; aus ihrer Untersuchung ist jedoch ein nachvollziehbar eigener Beitrag geworden.",
      "Denemeyi küçük bir ortak yerleştirmeye dönüştürüp katkı verenleri belirtirsiniz. İlk notun kaynağı açık kalır; ancak onun incelenmesinden, oluşumu izlenebilir ayrı bir katkı doğmuştur.",
    ],
  ],
  [
    "Deneme sonucunda ne görünür hale geliyor?",
    [
      "Mekânsal düzenin farklı okumaları nasıl etkileyebildiği.",
      "İlk notun yazarının kesin kimliği.",
      "Bütün okurların aynı yanıtı vermek zorunda olduğu.",
    ],
    "“bestimmte Lesarten nahelegt” düzenin yorumları etkilediğini belirtir. Devamındaki “ohne sie allen Menschen zwingend vorzuschreiben” ise bu etkinin zorunlu ve tek tip olmadığını açıklar.",
  ],
  [],
  "Mekânı da okuyan ortak yerleştirme",
  word(
    "Spiegel",
    "der",
    "ayna",
    "Spiegel",
    "Der Spiegel verändert den räumlichen Bezug.",
    "Ayna mekânsal gönderimi değiştiriyor.",
  ),
);
scene(
  "end-a2",
  "Yorumunu imzalayan okur",
  [
    [
      "Du verfasst einen kurzen Kommentar, in dem du die räumliche und die auf die unbekannte Person gerichtete Deutung auseinanderhältst. An keiner Stelle gibst du deine Auslegung als gesicherte Absicht der ursprünglichen Verfasserin aus.",
      "Mekânsal yorumla bilinmeyen kişiye yönelen yorumu ayırdığın kısa bir açıklama yazarsın. Hiçbir yerde kendi yorumunu ilk yazarın kesin niyeti olarak sunmazsın.",
    ],
    [
      "Unter den Kommentar setzt du deinen Namen und ein Datum. Damit ist erkennbar, wer für diese neue Deutung einsteht, auch wenn die Herkunft der ersten Notiz weiterhin nicht feststeht.",
      "Yorumun altına adını ve tarihi koyarsın. Böylece ilk notun kaynağı hâlâ bilinmese de bu yeni yorumun sorumluluğunu kimin üstlendiği anlaşılır.",
    ],
    [
      "Eine Leserin widerspricht dir und begründet ihre Sicht an denselben Wörtern. Du ergänzt einen Hinweis auf diese abweichende Position, statt ihren Widerspruch zum Beweis mangelnder Aufmerksamkeit umzudeuten.",
      "Bir okur sana itiraz edip görüşünü aynı sözcüklere dayanarak gerekçelendirir. Onun itirazını dikkatsizliğin kanıtı saymak yerine farklı görüşe işaret eden bir not eklersin.",
    ],
    [
      "Die Notiz bleibt ein kleines Rätsel; dein Kommentar wird zu einem Beispiel dafür, wie man sich klar positionieren kann, ohne die Grenzen des eigenen Wissens zu verschweigen.",
      "Not küçük bir bilmece olarak kalır; senin yorumun ise kişinin kendi bilgisinin sınırlarını gizlemeden nasıl açık bir görüş ortaya koyabileceğine örnek olur.",
    ],
  ],
  [
    "Yorumun imzalanması neyi açıklığa kavuşturuyor?",
    [
      "Yeni yorumu kimin üstlendiğini.",
      "İlk notun mutlaka aynı kişi tarafından yazıldığını.",
      "Diğer okumanın artık geçersiz olduğunu.",
    ],
    "“wer für diese neue Deutung einsteht” yeni yorumun sorumluluğunu belirtir. İlk notun kaynağının belirsizliği ayrıca korunduğundan iki yazarlık birbirine karıştırılmaz.",
  ],
  [],
  "Sınırlarını belirten imzalı yorum",
  word(
    "Deutung",
    "die",
    "yorum; anlamlandırma",
    "Deutungen",
    "Eine Deutung kann begründet sein und dennoch offenbleiben.",
    "Bir yorum gerekçeli olabilir ve yine de tartışmaya açık kalabilir.",
  ),
);
scene(
  "end-b1",
  "Yazarlıkla sergilemeyi ayırmak",
  [
    [
      "Anja bestätigt, dass sie das Beispiel für die frühere Übung geschrieben hat. Den späteren Aushang habe sie allerdings gemeinsam mit zwei Teilnehmenden vorbereitet, wobei die fehlende Unterschrift zum Nachdenken über den Kontext anregen sollte.",
      "Anja, örneği önceki alıştırma için yazdığını doğrular. Ancak sonraki duyuruyu iki katılımcıyla birlikte hazırladığını; imzanın yokluğunun bağlam üzerine düşünmeye yöneltmek için seçildiğini anlatır.",
    ],
    [
      "Mit Zustimmung aller Beteiligten notierst du diese Auskunft neben den bereits sichtbaren Quellen. Die Zuschreibung unterscheidet nun zwischen der Formulierung des Beispiels und der gemeinsamen Gestaltung seiner Präsentation.",
      "İlgili herkesin onayıyla bu açıklamayı zaten görünür olan kaynakların yanına not edersin. Atıf artık örneğin kaleme alınmasıyla sunumun birlikte hazırlanmasını ayırır.",
    ],
    [
      "Damit sind zwei Entstehungsschritte geklärt, nicht sämtliche möglichen Lesarten des Satzes. Auch eine dokumentierte Absicht zwingt das Publikum nicht dazu, jede andere begründete Interpretation aufzugeben.",
      "Böylece oluşumun iki aşaması açıklığa kavuşur; cümlenin olası bütün okumaları değil. Belgelenmiş bir niyet bile izleyiciyi, gerekçeli diğer bütün yorumlardan vazgeçmeye zorlamaz.",
    ],
    [
      "Du ergänzt die Zuschreibung um diesen Unterschied und schließt die Suche nach verborgenen Personen ab. Die gemeinsame Lektüre kann weitergehen, ohne dass sie weitere persönliche Nachforschungen voraussetzt.",
      "Atıf notuna bu ayrımı da ekleyip gizli kişiler arayışını bitirirsin. Birlikte okuma, başka kişisel araştırmalar gerektirmeden devam edebilir.",
    ],
  ],
  [
    "Anja’nın açıklamasından sonra hangi ayrım korunuyor?",
    [
      "Oluşumun açıklanmasıyla bütün yorumların belirlenmesinin ayrı olması.",
      "Belgelendirilmiş niyetin diğer bütün yorumları yasaklaması.",
      "Sunumda katkısı olanların yok sayılması.",
    ],
    "“nicht sämtliche möglichen Lesarten” oluşumun açıklanmasının bütün yorumları kapatmadığını belirtir. Yazarlığın belgelenmesi ile okurun gerekçeli yorumu farklı düzlemlerdedir.",
  ],
  [],
  "İki aşaması aydınlanan not",
  word(
    "Zuschreibung",
    "die",
    "bir katkıyı veya eseri bir kişiye atfetme",
    "Zuschreibungen",
    "Die Zuschreibung nennt verschiedene Beiträge getrennt.",
    "Atıf, farklı katkıları ayrı ayrı belirtiyor.",
  ),
);
scene(
  "end-b2",
  "Kendi yanıtının sorumluluğu",
  [
    [
      "Du entscheidest dich gegen eine weitere Suche nach der Person hinter dem Aushang und schreibst eine eigene Antwort: Vielleicht beginnt die Frage erst dort, wo wir unsere erste Gewissheit prüfen.",
      "Duyurunun arkasındaki kişiyi aramayı sürdürmemeye karar verip kendi yanıtını yazarsın: Belki soru, ilk kesinliğimizi sorguladığımız yerde başlar.",
    ],
    [
      "Diesen Satz kennzeichnest du ausdrücklich als neuen Beitrag mit deinem Namen. Er wird nicht als wiedergefundener Teil des ursprünglichen Textes ausgegeben, sondern als bewusste Reaktion auf eine offene Leseerfahrung.",
      "Bu cümleyi adını koyarak açıkça yeni bir katkı olarak belirtirsin. İlk metnin yeniden bulunmuş bir parçası gibi değil, açık bir okuma deneyimine bilinçli bir karşılık olarak sunulur.",
    ],
    [
      "Andere dürfen eine Antwort danebenstellen oder die Seite einfach ohne eigenen Eintrag lesen. Für die Leiterin gehört auch diese Zurückhaltung zu einem offenen Atelier, das Beteiligung nicht mit ständiger Sichtbarkeit verwechselt.",
      "Diğerleri yanına bir yanıt koyabilir veya sayfayı kendi notlarını eklemeden okuyabilir. Yönetici için bu geri duruş da katılımı sürekli görünür olmakla karıştırmayan açık bir atölyenin parçasıdır.",
    ],
    [
      "Am Ende stehen mehrere unterschriebene Texte neben der unbekannten Notiz. Ihr habt ihre Herkunft nicht abschließend geklärt, aber deutlich gemacht, welche neuen Aussagen von wem verantwortet werden.",
      "Sonunda bilinmeyen notun yanında birkaç imzalı metin durur. Kaynağı kesin olarak açıklamamış olsanız da yeni açıklamaları kimin üstlendiğini açık hale getirmişsinizdir.",
    ],
  ],
  [
    "Yeni metinler neden imzalı ve ayrı olarak sunuluyor?",
    [
      "Yeni katkılarla kaynağı belirsiz ilk notu karıştırmamak için.",
      "Herkesi mutlaka yazmaya zorlamak için.",
      "İlk notun kaynağını çözmüş gibi görünmek için.",
    ],
    "“ausdrücklich als neuen Beitrag” yeni katkının ayrı niteliğini belirtir. Son cümlede de ilk notun kaynağı açıklanmamışken yeni açıklamaların sorumlularının belli olduğu söylenir.",
  ],
  [],
  "Açık soruya eklenen yeni sesler",
  word(
    "Antwort",
    "die",
    "yanıt",
    "Antworten",
    "Die Antwort ist als neuer Beitrag gekennzeichnet.",
    "Yanıt yeni bir katkı olarak belirtiliyor.",
  ),
);
const draft = {
  germanTitle: "Die Verfasserin der Notiz am Spiegel",
  description:
    "Aynanın yanındaki imzasız bir notu araştırırken gönderim, yorum ve yazarlığı ayır. Dört son, aynı metinden farklı ama gerekçeli sonuçların nasıl doğduğunu gösterir.",
  scenes,
};
mkdirSync(".cache/story-library-drafts", { recursive: true });
writeFileSync(
  ".cache/story-library-drafts/story-library-c2-spiegelbrief.json",
  JSON.stringify({ model: "editorial-original", draft }, null, 2) + "\n",
);
console.log("Original C2 story saved; no provider request was made.");
