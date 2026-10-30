// Three original public stories. Offline authoring; no provider or learner data.
import { writeFileSync, mkdirSync } from "node:fs";
const dir = ".cache/story-library-drafts/";
mkdirSync(dir, { recursive: true });
let scenes = [];
function add(id, title, pairs, q, choices, ending, focus) {
  scenes.push({
    id,
    title,
    lines: pairs.map(([de, tr]) => ({ de, tr })),
    question: {
      prompt: q[0],
      options: q[1],
      correctIndex: 0,
      explanation: q[2],
    },
    choices: (choices ?? []).map(([de, tr]) => ({ de, tr })),
    ending: ending ?? "",
    focus: {
      word: focus[0],
      form: focus[0],
      article: focus[1],
      meaning: focus[2],
      plural: focus[3],
      de: focus[4],
      tr: focus[5],
    },
  });
}
function save(slug, germanTitle, description) {
  writeFileSync(
    dir + "story-library-" + slug + ".json",
    JSON.stringify(
      {
        model: "editorial-original",
        draft: { germanTitle, description, scenes },
      },
      null,
      2,
    ) + "\n",
  );
  scenes = [];
}
add(
  "start",
  "Duran saatin çevresinde",
  [
    [
      "Seit die Küchenuhr meiner Großmutter stehen geblieben ist, treffen wir uns zum Frühstück erstaunlich pünktlich, obwohl niemand mehr ihren Zeigern vertraut.",
      "Büyükannemin mutfak saati durduğundan beri, kimse artık akreple yelkovana güvenmese de kahvaltıda şaşırtıcı derecede dakik buluşuyoruz.",
    ],
    [
      "Auf dem Tisch liegt ein Kostenvoranschlag aus der Reparaturwerkstatt; daneben hat meine Schwester notiert, welche gemeinsamen Ausgaben wir diesen Monat bereits zugesagt haben.",
      "Masada tamir atölyesinin fiyat teklifi duruyor; yanında kız kardeşim bu ay hangi ortak harcamalara söz verdiğimizi not etmiş.",
    ],
    [
      "Die Uhr ist für mich vor allem ein vertrautes Geräusch, während meine Schwester in ihr eine Erinnerung sieht, die auch ohne funktionierendes Werk bestehen bleibt.",
      "Saat benim için her şeyden önce tanıdık bir ses; kız kardeşim ise onda, mekanizması çalışmasa da varlığını sürdürecek bir hatıra görüyor.",
    ],
    [
      "Wir können zunächst gemeinsam die Werkstatt besuchen oder zu Hause überlegen, welchen Platz die unveränderte Uhr künftig in unserem Alltag haben soll.",
      "Önce birlikte atölyeye gidebilir ya da evde, olduğu gibi kalan saatin günlük hayatımızda bundan sonra nasıl bir yeri olacağını düşünebiliriz.",
    ],
  ],
  [
    "İki kardeşin saate bakışı nasıl farklılaşıyor?",
    [
      "Biri tanıdık sesini, diğeri çalışmasa da taşıdığı hatırayı önemsiyor.",
      "İkisi de saati hemen satmak istiyor.",
      "İkisi de tamir ücretini daha önce ödemiş.",
    ],
    "“ein vertrautes Geräusch” tanıdık sesi, “auch ohne funktionierendes Werk” ise çalışmayan mekanizmaya rağmen süren hatırayı anlatır. Fark, nesneye yüklenen anlamdadır.",
  ],
  [
    ["Wir besuchen gemeinsam die Werkstatt.", "Birlikte atölyeye gideriz."],
    [
      "Wir überlegen zu Hause, welchen Platz die Uhr behalten soll.",
      "Evde saatin yerini nasıl koruyacağını düşünürüz.",
    ],
  ],
  null,
  [
    "Kostenvoranschlag",
    "der",
    "tahmini fiyat teklifi",
    "Kostenvoranschläge",
    "Der Kostenvoranschlag enthält noch keinen Auftrag.",
    "Fiyat teklifi henüz bir iş emri anlamına gelmiyor.",
  ],
);
add(
  "path-a",
  "Mekanizma ile hatıra arasında",
  [
    [
      "Die Uhrmacherin öffnet das Gehäuse erst, nachdem wir einer Untersuchung zugestimmt haben, und zeigt uns ein abgenutztes Rad im alten Werk.",
      "Saatçi, ancak incelemeye onay verdikten sonra kasayı açıyor ve eski mekanizmadaki aşınmış bir çarkı gösteriyor.",
    ],
    [
      "Eine vollständige Restaurierung würde das vertraute Ticken erhalten, wäre jedoch teurer als der Austausch des gesamten Werks gegen einen schlichten, leisen Mechanismus.",
      "Tam bir restorasyon tanıdık tik tak sesini koruyacak, fakat bütün mekanizmayı sade ve sessiz bir mekanizmayla değiştirmekten daha pahalı olacak.",
    ],
    [
      "Meine Schwester bittet um zwei getrennte Angebote, damit wir nicht aus Verlegenheit einer Lösung zustimmen, deren Kosten wir noch gar nicht besprochen haben.",
      "Kız kardeşim, maliyetini henüz konuşmadığımız bir çözüme mahcubiyetten onay vermemek için iki ayrı teklif istiyor.",
    ],
    [
      "Nach dem Gespräch können wir die Restaurierung gemeinsam finanzieren oder uns bewusst für den leiseren Austausch entscheiden und die alten Teile aufbewahren.",
      "Görüşmenin ardından restorasyonu birlikte finanse edebilir ya da bilinçli biçimde daha sessiz değişimi seçip eski parçaları saklayabiliriz.",
    ],
  ],
  [
    "Neden iki ayrı teklif isteniyor?",
    [
      "Maliyetleri karşılaştırıp konuşmadan onay vermemek için.",
      "Saatçi eski parçaları kaybettiği için.",
      "İki farklı saat satın almak için.",
    ],
    "“deren Kosten wir noch gar nicht besprochen haben” henüz konuşulmayan maliyeti vurgular. Ayrı teklifler, kararın mahcubiyetle değil karşılaştırmayla verilmesini sağlar.",
  ],
  [
    [
      "Wir finanzieren die Restaurierung mit dem vertrauten Ticken.",
      "Tanıdık sesi koruyan restorasyonu finanse ederiz.",
    ],
    [
      "Wir wählen das leisere Werk und bewahren die alten Teile auf.",
      "Sessiz mekanizmayı seçip eski parçaları saklarız.",
    ],
  ],
  null,
  [
    "Gehäuse",
    "das",
    "mekanizma kasası",
    "Gehäuse",
    "Das Gehäuse bleibt bei der Reparatur erhalten.",
    "Tamirde saatin kasası korunuyor.",
  ],
);
add(
  "path-b",
  "Çalışmadan da bir yeri olmak",
  [
    [
      "Wir nehmen die Uhr von der Wand und entdecken dahinter einen helleren Kreis, der ihre jahrelange Anwesenheit deutlicher bezeugt als jedes Familienfoto.",
      "Saati duvardan indirince arkasında, yıllardır orada oluşunu herhangi bir aile fotoğrafından daha belirgin gösteren açık renkli bir daire buluyoruz.",
    ],
    [
      "Meine Schwester schlägt vor, die Uhr unverändert ins Regal zu stellen und die tatsächliche Zeit weiterhin am kleinen digitalen Küchenwecker abzulesen.",
      "Kız kardeşim saati değiştirmeden rafa koymayı ve gerçek zamanı küçük dijital mutfak saatinden okumayı sürdürmeyi öneriyor.",
    ],
    [
      "Ich könnte mir stattdessen vorstellen, das Gehäuse wieder aufzuhängen und daneben eine Notiz anzubringen, die erklärt, weshalb die Zeiger absichtlich stillstehen.",
      "Bense kasayı yeniden asıp yanına akreple yelkovanın neden bilerek hareketsiz bırakıldığını açıklayan bir not koymayı düşünebiliyorum.",
    ],
    [
      "Keine der beiden Möglichkeiten ersetzt die verlorene Bewegung; sie unterscheiden sich darin, ob die Uhr zum betrachteten Erinnerungsstück oder zum sichtbaren Gesprächsanlass wird.",
      "İki seçenek de kaybolan hareketin yerini tutmuyor; farkları, saatin seyredilen bir hatıraya mı yoksa görünür bir konuşma vesilesine mi dönüşeceği.",
    ],
  ],
  [
    "Bu yoldaki iki seçenek hangi noktada ayrılıyor?",
    [
      "Saatin rafta bir hatıra mı, duvarda konuşma vesilesi mi olacağında.",
      "Saatin hangi ülkeye gönderileceğinde.",
      "Saatin kesin olarak çalışır hâle gelip gelmeyeceğinde.",
    ],
    "“zum betrachteten Erinnerungsstück oder zum sichtbaren Gesprächsanlass” iki işlevi karşılaştırır. Metin, bu seçeneklerin hiçbirinin mekanizmayı yeniden çalıştırmadığını da açıkça söyler.",
  ],
  [
    [
      "Wir stellen die Uhr unverändert ins Regal.",
      "Saati olduğu gibi rafa koyarız.",
    ],
    [
      "Wir hängen die Uhr mit einer erklärenden Notiz wieder auf.",
      "Saati açıklayıcı bir notla yeniden asarız.",
    ],
  ],
  null,
  [
    "Regal",
    "das",
    "raf",
    "Regale",
    "Im Regal steht ein altes Erinnerungsstück.",
    "Rafta eski bir hatıra eşyası duruyor.",
  ],
);
add(
  "end-a1",
  "Geri gelen tanıdık ses",
  [
    [
      "Bevor wir den Auftrag bestätigen, teilen wir die Kosten ausdrücklich untereinander auf und verschieben eine Anschaffung, die uns beiden weniger wichtig erscheint.",
      "İşi onaylamadan önce maliyeti aramızda açıkça paylaşıyor ve ikimize de daha az önemli gelen bir alışverişi erteliyoruz.",
    ],
    [
      "Zwei Wochen später hängt die restaurierte Uhr wieder an ihrem Platz; ihr Ticken klingt vertraut, ohne dass dadurch die vergangenen Jahre zurückkämen.",
      "İki hafta sonra restore edilmiş saat yeniden yerinde asılı; tik takı tanıdık geliyor ama bu, geçmiş yılları geri getirmiyor.",
    ],
    [
      "Beim Frühstück erzählen wir nicht länger nur von ihrer Besitzerin, sondern auch von der Entscheidung, die wir diesmal gemeinsam und ohne unausgesprochene Erwartungen getroffen haben.",
      "Kahvaltıda artık yalnızca eski sahibini değil, bu kez söze dökülmemiş beklentiler olmadan birlikte verdiğimiz kararı da anlatıyoruz.",
    ],
    [
      "Die Reparaturrechnung legen wir zum Kostenvoranschlag, damit unsere spätere Erinnerung an diesen Morgen nicht ausgerechnet die ganz praktischen Voraussetzungen seines vertrauten Klangs ausblendet.",
      "Bu sabaha ilişkin sonraki hatıramız, tanıdık sesin son derece somut koşullarını gözden kaçırmasın diye tamir faturasını fiyat teklifinin yanına koyuyoruz.",
    ],
  ],
  [
    "Restorasyonun finansmanı nasıl karşılanıyor?",
    [
      "Masraf açıkça paylaşılıyor ve daha az önemli bir alışveriş erteleniyor.",
      "Saatçi bütün ücretten vazgeçiyor.",
      "Diğer aile üyelerine haber vermeden para alınıyor.",
    ],
    "“teilen wir die Kosten ausdrücklich untereinander auf” açık paylaşımı, “verschieben eine Anschaffung” ise ertelenen harcamayı gösterir. Sonuç, kendiliğinden ücretsiz bir onarım değildir.",
  ],
  [],
  "Paylaşılan kararla geri dönen tik tak",
  [
    "Auftrag",
    "der",
    "iş emri, sipariş",
    "Aufträge",
    "Wir bestätigen den Auftrag erst nach dem Gespräch.",
    "İş emrini ancak görüşmeden sonra onaylıyoruz.",
  ],
);
add(
  "end-a2",
  "Sessiz çalışan eski kasa",
  [
    [
      "Wir entscheiden uns für das leise Austauschwerk, lassen uns die ausgebauten Teile aushändigen und schreiben auf die Schachtel, wann und weshalb die Veränderung vorgenommen wurde.",
      "Sessiz yeni mekanizmayı seçiyor, çıkarılan parçaları teslim alıyor ve kutunun üzerine değişimin ne zaman, neden yapıldığını yazıyoruz.",
    ],
    [
      "Die Uhr zeigt wieder die richtige Zeit, doch beim ersten Frühstück ertappe ich mich dabei, auf ein Ticken zu warten, das nicht mehr kommen wird.",
      "Saat yeniden doğru zamanı gösteriyor; fakat ilk kahvaltıda kendimi artık gelmeyecek bir tik takı beklerken yakalıyorum.",
    ],
    [
      "Meine Schwester nimmt dieses Zögern ernst, ohne unsere gemeinsame Entscheidung nachträglich als Fehler zu behandeln; wir haben etwas erhalten und zugleich etwas verändert.",
      "Kız kardeşim tereddüdümü ciddiye alıyor ama ortak kararımızı sonradan hata saymıyor; bir şeyi korurken başka bir şeyi değiştirdik.",
    ],
    [
      "Neben dem nun stillen Gehäuse bleibt deshalb die beschriftete Schachtel stehen, nicht als Beweis einer vollkommenen Lösung, sondern als ehrliche Ergänzung ihrer Geschichte.",
      "Bu nedenle etiketli kutu artık sessiz olan kasanın yanında duruyor; kusursuz çözümün kanıtı olarak değil, hikâyesinin dürüst bir tamamlayıcısı olarak.",
    ],
  ],
  [
    "Eski parçalar neden açıklamalı bir kutuda saklanıyor?",
    [
      "Yapılan değişikliğin hikâyesini görünür tutmak için.",
      "Yeni mekanizmanın çalışmasını engellemek için.",
      "Saatçiye ait parçaları gizlemek için.",
    ],
    "“wann und weshalb die Veränderung vorgenommen wurde” değişimin ne zaman ve neden yapıldığını kayda geçirir. Son paragraf kutunun hikâyeyi tamamladığını açıklar.",
  ],
  [],
  "Değişikliği saklamayan sessiz saat",
  [
    "Schachtel",
    "die",
    "küçük kutu",
    "Schachteln",
    "Die beschriftete Schachtel enthält die alten Teile.",
    "Etiketli kutuda eski parçalar bulunuyor.",
  ],
);
add(
  "end-b1",
  "Rafta yeni bir düzen",
  [
    [
      "Wir stellen die unveränderte Uhr ins Regal und lassen den hellen Kreis an der Wand zunächst sichtbar, statt die frühere Anordnung sofort wiederherzustellen.",
      "Saati değiştirmeden rafa koyuyor ve eski düzeni hemen geri kurmak yerine duvardaki açık renkli daireyi şimdilik görünür bırakıyoruz.",
    ],
    [
      "Bei einem Besuch fragt meine Nichte, ob die Uhr kaputt sei; meine Schwester antwortet, dass sie die Zeit nicht mehr anzeige, aber trotzdem zu uns gehöre.",
      "Bir ziyarette yeğenim saatin bozuk olup olmadığını soruyor; kız kardeşim artık zamanı göstermediğini ama yine de bize ait olduğunu söylüyor.",
    ],
    [
      "Das Gespräch dauert nur wenige Minuten, und gerade diese Selbstverständlichkeit gefällt mir: Das Erinnerungsstück muss weder täglich erklärt werden noch unberührt im Mittelpunkt stehen.",
      "Konuşma yalnızca birkaç dakika sürüyor; hoşuma giden tam da bu doğallık: Hatıra eşyasının ne her gün açıklanması ne de dokunulmadan merkezde durması gerekiyor.",
    ],
    [
      "Als wir später das Regal umstellen, tragen wir die Uhr gemeinsam auf ein anderes Brett und merken, dass Zugehörigkeit nicht an einer einzigen Position hängt.",
      "Daha sonra rafı yeniden düzenlerken saati birlikte başka bir bölmeye taşıyor ve aidiyetin tek bir konuma bağlı olmadığını fark ediyoruz.",
    ],
  ],
  [
    "Yeğene saatin durumu nasıl anlatılıyor?",
    [
      "Artık zamanı göstermediği ama aileye ait olmaya devam ettiği söyleniyor.",
      "Yeni satın alındığı söyleniyor.",
      "Kimsenin ona dokunamayacağı söyleniyor.",
    ],
    "“die Zeit nicht mehr anzeige, aber trotzdem zu uns gehöre” işlev ile aidiyeti ayırır. Saatin bozuk olması, aile içindeki yerinin tamamen kaybolduğu anlamına gelmez.",
  ],
  [],
  "İşlevinden bağımsız bir hatıra",
  [
    "Besuch",
    "der",
    "ziyaret",
    "Besuche",
    "Bei einem Besuch entsteht ein kurzes Gespräch.",
    "Bir ziyaret sırasında kısa bir konuşma başlıyor.",
  ],
);
add(
  "end-b2",
  "Duvardaki küçük açıklama",
  [
    [
      "Wir hängen das Gehäuse wieder auf und legen den Wortlaut unserer Notiz gemeinsam fest, damit dort keine stellvertretende Familienwahrheit verkündet wird.",
      "Kasayı yeniden asıyor ve notun sözlerini birlikte belirliyoruz; böylece orada bütün aile adına tek bir gerçek ilan edilmiyor.",
    ],
    [
      "Auf dem kleinen Blatt steht lediglich, seit wann die Uhr stillsteht und welche verschiedenen Erinnerungen ihr Geräusch bei uns beiden ausgelöst hat.",
      "Küçük kâğıtta yalnızca saatin ne zamandan beri durduğu ve sesinin ikimizde hangi farklı hatıraları uyandırdığı yazıyor.",
    ],
    [
      "Manche Gäste lesen die Notiz, andere bemerken sie kaum; wir erklären niemandem ungefragt, welche Bedeutung ein stillstehender Gegenstand für ihn haben sollte.",
      "Bazı misafirler notu okuyor, bazıları pek fark etmiyor; hiç kimseye sormadan duran bir nesnenin onun için ne ifade etmesi gerektiğini anlatmıyoruz.",
    ],
    [
      "Beim nächsten Frühstück schauen wir auf den digitalen Wecker und dann auf die alte Uhr, die nun zwei unterschiedliche Geschichten nebeneinander aushalten darf.",
      "Sonraki kahvaltıda dijital saate, sonra da artık iki farklı hikâyeyi yan yana taşıyabilen eski saate bakıyoruz.",
    ],
  ],
  [
    "Notun sözleri neden birlikte belirleniyor?",
    [
      "Tek bir kişinin yorumunu bütün ailenin gerçeği gibi sunmamak için.",
      "Tamir faturasını gizlemek için.",
      "Bütün misafirlerin aynı düşünmesini sağlamak için.",
    ],
    "“keine stellvertretende Familienwahrheit” bütün aile adına tek yorum sunmayı reddeder. Notta iki kişinin farklı hatıralarına yer verilmesi bu yaklaşımı somutlaştırır.",
  ],
  [],
  "Yan yana duran iki hatıra",
  [
    "Notiz",
    "die",
    "kısa not",
    "Notizen",
    "Die Notiz lässt unterschiedliche Erinnerungen zu.",
    "Not farklı hatıralara yer bırakıyor.",
  ],
);
save(
  "c1-reparierteuhr",
  "Rund um die stehen gebliebene Uhr",
  "Duran bir aile saati üzerinden hatıra, ortak bütçe ve farklı bakış açılarını takip et. Dolaylı anlatım, karşılaştırma ve gerekçelendirme üzerine C1 okuma çalışması.",
);

add(
  "start",
  "Rehberin küçük dipnotu",
  [
    [
      "In einem gebrauchten Reiseführer über die erfundene Hafenstadt Merlenau entdecke ich eine handschriftliche Fußnote, deren Verfasserin ausdrücklich erlaubt, ihre Hinweise weiterzugeben, solange niemand daraus ein allgemeingültiges Ortsurteil macht.",
      "Kurgusal liman kenti Merlenau hakkında ikinci el bir rehberde el yazısıyla bir dipnot buluyorum; yazarı, notlarından evrensel bir kent yargısı çıkarılmadığı sürece paylaşılmalarına özellikle izin veriyor.",
    ],
    [
      "Die gedruckte Seite empfiehlt eine einzige Aussichtsterrasse als den eigentlichen Blick auf die Stadt; die Notiz fragt dagegen, wessen Alltag von dort sichtbar wird und welcher hinter den Fassaden verschwindet.",
      "Basılı sayfa tek bir seyir terasını kentin asıl manzarası olarak öneriyor; not ise oradan kimin gündelik hayatının görüldüğünü, hangisinin cephelerin arkasında kaybolduğunu soruyor.",
    ],
    [
      "Auf dem Umschlag einer öffentlich zugänglichen Stadtkarte steht dieselbe Frage, sodass sich die Spur ohne private Nachforschungen verfolgen lässt; dennoch wäre jede Antwort zunächst eine Auswahl unter mehreren möglichen Perspektiven.",
      "Halka açık bir kent haritasının kapağında aynı soru var; böylece özel hayatları araştırmadan izin peşine düşülebiliyor. Yine de her yanıt, önce birkaç olası bakış arasından bir seçim olacak.",
    ],
    [
      "Ich kann den empfohlenen Aussichtspunkt aufsuchen und seine Begrenzungen mitlesen oder den gedruckten Rundgang entlang der öffentlich freigegebenen Uferwege nehmen, ohne daraus schon die wahrere Reise erklären zu wollen.",
      "Önerilen seyir noktasına gidip sınırlılıklarını da okuyabilir ya da halka açık kıyı yollarındaki basılı rotayı izleyebilirim; bunlardan birini şimdiden daha gerçek yolculuk ilan etmeme gerek yok.",
    ],
  ],
  [
    "Dipnot, rehberin önerisine hangi soruyu ekliyor?",
    [
      "Seçilen manzarada kimin gündelik hayatının görünür olduğu sorusunu.",
      "Terasın hangi yıl yıkıldığını.",
      "Rehberin bütün bilgilerinin kesinlikle yanlış olduğunu.",
    ],
    "“wessen Alltag von dort sichtbar wird” görünürlük meselesini açar. Dipnot basılı bilgiyi topluca reddetmez; tek bir manzaranın seçiciliğine dikkat çeker.",
  ],
  [
    [
      "Ich lese die Stadt zunächst von der Aussichtsterrasse aus.",
      "Kenti önce seyir terasından okurum.",
    ],
    [
      "Ich folge dem öffentlichen Rundgang am Ufer.",
      "Kıyıdaki halka açık rotayı izlerim.",
    ],
  ],
  null,
  [
    "Fußnote",
    "die",
    "dipnot",
    "Fußnoten",
    "Eine Fußnote kann die Reichweite einer Aussage begrenzen.",
    "Bir dipnot, bir ifadenin kapsamını sınırlandırabilir.",
  ],
);
add(
  "path-a",
  "Yukarıdan görünen ve görünmeyen",
  [
    [
      "Von der Terrasse aus lassen sich die Hafenbecken mühelos überblicken, während die schmalen Durchgänge zwischen den Wohnhäusern im Gegenlicht zu einer einzigen dunklen Fläche zusammenfallen und ihre Unterschiede verlieren.",
      "Terastan liman havuzları rahatça görülebiliyor; konutlar arasındaki dar geçitler ise ters ışıkta tek bir koyu yüzeye dönüşüp farklarını yitiriyor.",
    ],
    [
      "Eine ehrenamtliche Stadtführerin erläutert, dass die Formulierung eigentlicher Blick aus einer älteren Werbekampagne stammt und weder den Alltag aller Bewohner noch die Geschichte sämtlicher Viertel abzubilden beanspruchen sollte.",
      "Gönüllü bir kent rehberi, asıl manzara ifadesinin eski bir reklam kampanyasından geldiğini; bütün sakinlerin gündelik hayatını veya bütün mahallelerin tarihini temsil etme iddiası taşımaması gerektiğini anlatıyor.",
    ],
    [
      "Ich notiere diese Herkunft neben der ursprünglichen Empfehlung, statt die Werbeformel bloß gegen eine andere zu ersetzen; die Aussicht bleibt eindrucksvoll, verliert aber den Anspruch, allein für Merlenau zu sprechen.",
      "Reklam sözünü yalnızca başka bir sözle değiştirmek yerine bu kökeni ilk önerinin yanına yazıyorum; manzara etkileyiciliğini koruyor ama tek başına Merlenau adına konuşma iddiasını yitiriyor.",
    ],
    [
      "Für meinen kleinen Reisebericht kann ich nun eine kommentierte Panoramaaufnahme anfertigen oder auf das Gesamtbild verzichten und eine zeichnerische Folge einzelner sichtbarer Übergänge zwischen Wasser, Arbeit und Wohnen versuchen.",
      "Küçük gezi yazım için şimdi açıklamalı bir panorama çekebilir ya da genel görüntüden vazgeçip su, çalışma ve konut alanları arasında görünen geçişleri ayrı çizimlerle gösterebilirim.",
    ],
  ],
  [
    "Rehberin açıklaması ilk öneriyi nasıl değiştiriyor?",
    [
      "Manzaranın etkisini koruyup bütün kenti temsil ettiği iddiasını sınırlandırıyor.",
      "Terasın halka kapalı olduğunu kanıtlıyor.",
      "Kentte hiç konut bulunmadığını gösteriyor.",
    ],
    "“verliert aber den Anspruch, allein für Merlenau zu sprechen” temsil iddiasının sınırlandığını söyler. “bleibt eindrucksvoll” manzaranın değerinin tamamen reddedilmediğini gösterir.",
  ],
  [
    [
      "Ich fertige ein kommentiertes Panorama an.",
      "Açıklamalı bir panorama hazırlarım.",
    ],
    [
      "Ich zeichne einzelne sichtbare Übergänge.",
      "Görünen geçişleri ayrı ayrı çizerim.",
    ],
  ],
  null,
  [
    "Herkunft",
    "die",
    "köken, çıkış noktası",
    "Herkünfte",
    "Die Herkunft der Formulierung verändert ihre Lesart.",
    "İfadenin kökeni, okunma biçimini değiştiriyor.",
  ],
);
add(
  "path-b",
  "Kıyıdaki cümlenin sınırı",
  [
    [
      "Am öffentlichen Uferweg bemerke ich, dass die Karte zwar Aussichtspunkte markiert, aber nicht unterscheidet, ob die dazwischenliegenden Flächen als Arbeitsplätze, Durchgänge oder freiwillige Aufenthaltsorte genutzt werden.",
      "Halka açık kıyı yolunda haritanın seyir noktalarını işaretlediğini ama aradaki alanların iş yeri, geçiş alanı veya isteğe bağlı dinlenme yeri olarak kullanımını ayırmadığını fark ediyorum.",
    ],
    [
      "Vor einem kleinen Informationsraum hängt ein freigegebener Hörspaziergang, dessen Beiträge von Beteiligten selbst eingesprochen wurden; auf dem Schild wird ausdrücklich vor der Verwechslung einzelner Stimmen mit einem Stadtporträt gewarnt.",
      "Küçük bir bilgi odasının önünde katılımcıların kendi sesleriyle hazırlayıp paylaşıma açtığı sesli yürüyüş bulunuyor; levha, tek tek seslerin bir kent portresiyle karıştırılmaması konusunda özellikle uyarıyor.",
    ],
    [
      "Ich könnte mit Kopfhörern den veröffentlichten Beiträgen folgen, ohne die darin erwähnten Menschen aufzusuchen, oder mich zunächst allein an den sichtbaren Übergängen des Weges orientieren und meine eigenen Auslassungen festhalten.",
      "Anılan kişileri aramadan kulaklıkla yayımlanmış kayıtları izleyebilir ya da önce yalnızca yolun görünen geçişlerini esas alıp kendi atladığım noktaları kaydedebilirim.",
    ],
    [
      "Beide Formen verlangen eine nachvollziehbare Kennzeichnung ihrer Perspektive: Eine Stimme wird nicht durch ihre Unmittelbarkeit allgemeingültig, und eine Beobachtung wird nicht dadurch vollständig, dass sie ohne fremde Worte auskommt.",
      "İki biçim de bakış açısını anlaşılır şekilde belirtmeyi gerektiriyor: Bir ses dolaysızlığı nedeniyle evrenselleşmiyor; bir gözlem de başkalarının sözüne başvurmadan yapıldığı için tamamlanmış olmuyor.",
    ],
  ],
  [
    "Bilgi levhası hangi karışıklığa karşı uyarıyor?",
    [
      "Tek tek paylaşılan seslerin bütün kentin portresi sayılmasına.",
      "Kulaklıkların hiçbir yerde kullanılmamasına.",
      "Yol üzerindeki bütün alanların boş sanılmasına.",
    ],
    "“einzelner Stimmen mit einem Stadtporträt” tekil anlatımla bütüncül temsil arasındaki farkı belirtir. Yayımlanma izni, kayıtların bütün sakinler adına konuştuğu anlamına gelmez.",
  ],
  [
    [
      "Ich folge den freigegebenen Hörbeiträgen.",
      "Paylaşıma açılmış ses kayıtlarını izlerim.",
    ],
    [
      "Ich protokolliere zunächst meine eigenen Beobachtungen.",
      "Önce kendi gözlemlerimi kaydederim.",
    ],
  ],
  null,
  [
    "Beobachtung",
    "die",
    "gözlem",
    "Beobachtungen",
    "Eine Beobachtung hat einen bestimmten Standort.",
    "Bir gözlemin belirli bir bakış noktası vardır.",
  ],
);
add(
  "end-a1",
  "Açıklaması da görünen panorama",
  [
    [
      "Unter meine Panoramaaufnahme schreibe ich, von welcher Terrasse und zu welcher Tageszeit sie entstanden ist, damit der scheinbar voraussetzungslose Gesamtblick seine tatsächlichen Bedingungen nicht länger verbergen kann.",
      "Panoramanın altına hangi terasta, günün hangi saatinde çekildiğini yazıyorum; böylece sanki koşulsuzmuş gibi görünen genel bakışın gerçek koşulları gizli kalmıyor.",
    ],
    [
      "Die Bildunterschrift nennt außerdem die kaum erkennbaren Wohnwege und weist darauf hin, dass aus ihrer optischen Unsichtbarkeit keinesfalls auf die Bedeutungslosigkeit des dort stattfindenden Alltags geschlossen werden darf.",
      "Açıklama, güçlükle seçilen konut yollarını da anıyor ve görüntüde görünmemelerinden, oradaki gündelik hayatın önemsiz olduğu sonucunun çıkarılamayacağını belirtiyor.",
    ],
    [
      "Als eine Freundin das Bild später betrachtet, fragt sie nicht nach dem besten Standort, sondern nach den Grenzen meiner Auswahl; genau diese Verschiebung möchte ich im Reisebericht erhalten.",
      "Daha sonra fotoğrafa bakan bir arkadaşım en iyi çekim yerini değil, seçimimin sınırlarını soruyor; gezi yazısında korumak istediğim tam da bu değişim.",
    ],
    [
      "Die handschriftliche Fußnote zitiere ich nur im erlaubten Umfang und erläutere ihren Zusammenhang, sodass sie nicht als anonyme Beglaubigung meiner eigenen, weiterhin begrenzten Deutung herhalten muss.",
      "El yazısı dipnotu yalnızca izin verilen kapsamda aktarıp bağlamını açıklıyorum; böylece kendi hâlâ sınırlı yorumumun anonim doğrulama belgesi olarak kullanılmıyor.",
    ],
  ],
  [
    "Panoramanın açıklamasında neden zor görülen yollar da anılıyor?",
    [
      "Görünmezliğin önemsizlikle karıştırılmasını engellemek için.",
      "Fotoğrafın bütün kenti eksiksiz gösterdiğini kanıtlamak için.",
      "Konutlara izinsiz girilmesini önermek için.",
    ],
    "“keinesfalls auf die Bedeutungslosigkeit” ifadesi, görünmeyenin değersiz sayılamayacağını vurgular. Açıklama, görüntünün kapsamını büyütmekten çok sınırlarını anlaşılır kılar.",
  ],
  [],
  "Kendi sınırlarını açıklayan panorama",
  [
    "Bildunterschrift",
    "die",
    "görsel altı açıklaması",
    "Bildunterschriften",
    "Die Bildunterschrift benennt den Standort.",
    "Görsel altı açıklaması bakış noktasını belirtiyor.",
  ],
);
add(
  "end-a2",
  "Tek resim yerine çizim dizisi",
  [
    [
      "Statt die Stadt in einem einzigen Bild einzufangen, zeichne ich drei sichtbare Übergänge und lasse zwischen den Blättern bewusst Platz, damit die Abfolge keine lückenlose Übersicht vortäuscht.",
      "Kenti tek bir görüntüye sığdırmak yerine görünen üç geçişi çiziyor ve sıra kesintisiz bir bütünlük taklidi yapmasın diye sayfaların arasında bilerek boşluk bırakıyorum.",
    ],
    [
      "Unter jeder Skizze vermerke ich, welche Einzelheiten ich aus der Entfernung erkennen konnte und wo eine Linie bereits meine zeichnerische Entscheidung statt einer eindeutig belegbaren Grenze darstellt.",
      "Her eskizin altına uzaktan hangi ayrıntıları seçebildiğimi ve bir çizginin nerede açıkça doğrulanabilen sınır yerine benim çizim kararımı gösterdiğini yazıyorum.",
    ],
    [
      "Die Aussichtsterrasse erscheint dadurch weder als falscher Ort noch als privilegierter Schlüssel zur Stadt; sie wird zum Ausgangspunkt einer ausdrücklich vorläufigen Reihe, deren Leerstellen für weitere Blicke offenbleiben.",
      "Böylece seyir terası ne yanlış bir yer ne de kentin ayrıcalıklı anahtarı oluyor; boşlukları yeni bakışlara açık, geçici olduğu özellikle belirtilmiş bir dizinin başlangıcına dönüşüyor.",
    ],
    [
      "Im Reisebericht stehen die Zeichnungen nebeneinander, während die alte Empfehlung als historisch erklärter Anlass erhalten bleibt und nicht zur Karikatur einer angeblich naiven früheren Reisekultur herabgesetzt wird.",
      "Gezi yazısında çizimler yan yana duruyor; eski öneri de tarihselliği açıklanmış bir çıkış noktası olarak korunuyor, sözde saf bir eski seyahat kültürünün karikatürüne indirgenmiyor.",
    ],
  ],
  [
    "Çizimler arasındaki boşluklar ne işe yarıyor?",
    [
      "Dizinin kesintisiz ve eksiksiz bir kent özeti olduğu izlenimini önlüyor.",
      "Çizerin bütün çizimleri kaybettiğini gösteriyor.",
      "Başka bir bakışa ihtiyaç kalmadığını ilan ediyor.",
    ],
    "“keine lückenlose Übersicht vortäuscht” eksiksiz bir genel görünüm taklidi yapılmadığını belirtir. Boşluklar, metnin ilerleyen bölümünde yeni bakışlara açıklıkla ilişkilendirilir.",
  ],
  [],
  "Boşluklarını koruyan çizim dizisi",
  [
    "Skizze",
    "die",
    "eskiz, taslak çizim",
    "Skizzen",
    "Eine Skizze zeigt auch Entscheidungen der zeichnenden Person.",
    "Bir eskiz, çizen kişinin kararlarını da gösterir.",
  ],
);
add(
  "end-b1",
  "Sesleri birbirine karıştırmadan",
  [
    [
      "Ich folge dem veröffentlichten Hörspaziergang und notiere zu jedem Beitrag, wer darin ausdrücklich für die eigenen Erfahrungen spricht, statt aus unterschiedlichen Lebenswegen eine einheitliche Botschaft zusammenzuschneiden.",
      "Yayımlanmış sesli yürüyüşü izleyip farklı yaşamları tek bir mesaja dönüştürmek yerine her kayıtta kimin açıkça kendi deneyimi adına konuştuğunu not ediyorum.",
    ],
    [
      "Eine Bootsbauerin beschreibt den Morgen am Wasser als Arbeitsbeginn, während ein anderer Beitrag denselben Weg als ruhigen Feierabendort erinnert; beide Aussagen behalten ihren jeweiligen zeitlichen und persönlichen Rahmen.",
      "Bir tekne ustası su kıyısındaki sabahı işe başlangıç olarak anlatırken başka bir kayıt aynı yolu sakin bir mesai sonrası yeri olarak hatırlıyor; ikisi de kendi zaman ve kişi çerçevesini koruyor.",
    ],
    [
      "Für den Reisebericht gebe ich nur die öffentlich freigegebenen Fundstellen an und fasse die Unterschiede mit eigenen Worten zusammen, ohne behauptete Zustimmung der Beteiligten zu meinem gesamten Text zu unterstellen.",
      "Gezi yazısında yalnızca kamuya açık kaynak yerlerini belirtiyor, katılımcıların yazımın tamamını onayladığını varsaymadan farkları kendi sözlerimle özetliyorum.",
    ],
    [
      "Die Fußnote hat meine Route damit tatsächlich verändert, aber nicht zu einer endgültigen Wahrheit geführt; sie hat mich vielmehr daran erinnert, wie sorgfältig ein fremdes Wort in die eigene Darstellung eintritt.",
      "Dipnot böylece rotamı gerçekten değiştirmiş oluyor ama beni nihai gerçeğe götürmüyor; daha çok, başkasının sözünün kendi anlatımıma ne kadar dikkatle katılması gerektiğini hatırlatıyor.",
    ],
  ],
  [
    "Aynı kıyı yoluna ilişkin iki anlatım nasıl ele alınıyor?",
    [
      "Her biri kendi zaman ve kişisel deneyim çerçevesinde korunuyor.",
      "Biri doğru, diğeri kasıtlı yalan ilan ediliyor.",
      "İkisinden de konuşmacıların bütün yazıyı onayladığı sonucu çıkarılıyor.",
    ],
    "“beide Aussagen behalten ihren jeweiligen zeitlichen und persönlichen Rahmen” farklılıkların bağlamlarıyla korunduğunu anlatır. Aynı yerin iki ayrı kullanımının varlığı çelişki diye silinmez.",
  ],
  [],
  "Bağlamları korunan iki ses",
  [
    "Beitrag",
    "der",
    "katkı, kayıtlı anlatım",
    "Beiträge",
    "Jeder Beitrag behält seinen eigenen Zusammenhang.",
    "Her katkı kendi bağlamını koruyor.",
  ],
);
add(
  "end-b2",
  "Gözlem defterindeki açık sınır",
  [
    [
      "Ich gehe den öffentlichen Uferweg ohne Hörbeiträge ab und halte zunächst nur fest, wo ich stehen bleiben konnte, welche Durchgänge ausgeschildert waren und welche Bereiche meiner Beobachtung entzogen blieben.",
      "Halka açık kıyı yolunu ses kayıtlarını dinlemeden yürüyor; önce nerede durabildiğimi, hangi geçitlerin işaretli olduğunu ve hangi alanları gözlemleyemediğimi kaydediyorum.",
    ],
    [
      "Neben jede Vermutung setze ich ein sichtbares Fragezeichen, damit aus dem geschlossenen Tor eines Betriebshofs nicht unversehens die Behauptung wird, dort arbeite an diesem Nachmittag überhaupt niemand.",
      "Her varsayımın yanına görünür bir soru işareti koyuyorum; böylece işletme avlusunun kapalı kapısı, o öğleden sonra orada hiç kimsenin çalışmadığı iddiasına dönüşmüyor.",
    ],
    [
      "Zu Hause ordne ich die Notizen nach Beobachtung und Deutung und merke, dass gerade die Trennung meinen Bericht lesbarer macht, obwohl sie ihm manche scheinbar anschauliche Gewissheit nimmt.",
      "Evde notları gözlem ve yorum olarak ayırınca, görünüşte canlı bazı kesinlikleri ortadan kaldırsa da bu ayrımın yazımı daha anlaşılır kıldığını fark ediyorum.",
    ],
    [
      "Die letzte Seite bleibt für spätere Ergänzungen frei; ein kurzer Hinweis erklärt, dass mein Spaziergang eine begrenzte Erfahrung dokumentiert und weder den Hörspaziergang ersetzt noch die Stadt abschließend beschreibt.",
      "Son sayfa sonraki eklemeler için boş kalıyor; kısa bir açıklama, yürüyüşümün sınırlı bir deneyimi kaydettiğini, sesli yürüyüşün yerini tutmadığını ve kenti son sözü söyleyerek anlatmadığını belirtiyor.",
    ],
  ],
  [
    "Kapalı kapıyla ilgili çıkarımın yanına neden soru işareti konuyor?",
    [
      "Gözlenen kapı durumunu içeride kimsenin çalışmadığı iddiasından ayırmak için.",
      "İşletmenin kesinlikle terk edildiğini ilan etmek için.",
      "Haritadaki bütün bilgileri silmek için.",
    ],
    "“nicht unversehens die Behauptung wird” gözlemin fark edilmeden iddiaya dönüşmesini engellemeyi anlatır. Kapalı kapı gözlenebilir; içeride kimsenin bulunmadığı buradan kesinleşmez.",
  ],
  [],
  "Gözlemle yorumu ayıran defter",
  [
    "Fragezeichen",
    "das",
    "soru işareti",
    "Fragezeichen",
    "Das Fragezeichen kennzeichnet eine Vermutung.",
    "Soru işareti bir varsayımı belirtiyor.",
  ],
);
save(
  "c2-reisefuehrer",
  "In den Fußnoten eines Reiseführers",
  "Kurgusal bir liman kentinde rehberin seçtiği bakışı sorgula. C2 düzeyinde temsil, örtük iddia, kaynak bağlamı ve gözlem ile yorumun ayrımını çalış.",
);

add(
  "start",
  "Bir meydanın birkaç adı",
  [
    [
      "Auf dem Platz der erfundenen Kleinstadt Lindenau steht eine neue Informationstafel, deren Überschrift einen einzigen Namen verwendet, während ältere Bewohnerinnen im Gespräch mehrere Bezeichnungen nebeneinander gebrauchen, ohne sich deshalb misszuverstehen.",
      "Kurgusal Lindenau kasabasının meydanındaki yeni bilgi panosu başlığında tek bir ad kullanıyor; daha eski sakinler ise konuşurken birbirlerini yanlış anlamadan birkaç adı yan yana kullanıyor.",
    ],
    [
      "Im offenen Nachbarschaftsatelier sollen wir eine kleine Ausstellung über diese Namen vorbereiten; die Aufgabe verlangt weder eine Umbenennung noch eine Abstimmung darüber, welche Erinnerung öffentlich gewinnen darf.",
      "Açık mahalle atölyesinde bu adlar hakkında küçük bir sergi hazırlayacağız; görev ne ad değiştirmeyi ne de hangi hatıranın kamusal alanda kazanacağına ilişkin oylamayı gerektiriyor.",
    ],
    [
      "Eine Stadtplanerin bringt freigegebene Kartenausschnitte mit, ein langjähriger Ladenbesitzer bietet einen ausdrücklich als persönliche Erinnerung gekennzeichneten Bericht an, und beide bitten darum, ihre Beiträge nicht ungefragt miteinander gleichzusetzen.",
      "Bir kent planlamacısı paylaşıma açılmış harita parçaları getiriyor; uzun yıllardır dükkân işleten bir sakin de kişisel hatıra olduğu özellikle belirtilen anlatısını sunuyor; ikisi de katkılarının sorulmadan eş tutulmamasını istiyor.",
    ],
    [
      "Wir können zunächst die datierten Karten vergleichen oder mit dem angebotenen Gespräch beginnen; entscheidend bleibt, ob wir Unterschiede nachvollziehbar ausstellen, statt aus ihrer bloßen Verschiedenheit schon einen Streit abzuleiten.",
      "Önce tarihli haritaları karşılaştırabilir ya da önerilen görüşmeyle başlayabiliriz; önemli olan, farklılıkları sırf farklı oldukları için çatışma saymak yerine anlaşılır biçimde sergilememiz.",
    ],
  ],
  [
    "Atölyenin görevi hangisini gerektirmiyor?",
    [
      "Meydanın adını değiştirmeyi veya hatıralar arasında kazanan seçmeyi.",
      "Harita parçalarını karşılaştırmayı.",
      "Katkıların hangi tür kaynak olduğunu belirtmeyi.",
    ],
    "“weder eine Umbenennung noch eine Abstimmung” iki amacı açıkça dışlar. Serginin hedefi, adların bağlamlarını göstermek; birini zorunlu galip ilan etmek değildir.",
  ],
  [
    [
      "Wir vergleichen zuerst die datierten Karten.",
      "Önce tarihli haritaları karşılaştırırız.",
    ],
    [
      "Wir beginnen mit dem angebotenen Gespräch.",
      "Önerilen görüşmeyle başlarız.",
    ],
  ],
  null,
  [
    "Bezeichnung",
    "die",
    "adlandırma",
    "Bezeichnungen",
    "Mehrere Bezeichnungen können nebeneinander bestehen.",
    "Birden fazla adlandırma yan yana var olabilir.",
  ],
);
add(
  "path-a",
  "Haritaların söyleyebildiği kadar",
  [
    [
      "Beim Vergleich der Karten fällt auf, dass der Name auf einer Ausgabe nicht erscheint, obwohl die angrenzenden Straßen verzeichnet sind; das Fehlen allein erklärt jedoch weder den damaligen Sprachgebrauch noch eine Absicht.",
      "Haritaları karşılaştırınca bir baskıda çevredeki sokaklar kaydedildiği hâlde adın bulunmadığı görülüyor; bu yokluk tek başına ne dönemin dil kullanımını ne de bir niyeti açıklıyor.",
    ],
    [
      "Die Stadtplanerin weist auf den unterschiedlichen Maßstab hin und zeigt, dass derselbe Kartenverlag in einer detaillierteren Ausgabe bereits jene Bezeichnung druckte, die auf dem gröberen Blatt scheinbar verschwunden war.",
      "Kent planlamacısı ölçek farkına dikkat çekip aynı yayınevinin daha ayrıntılı baskıda, daha kaba ölçekli sayfada sanki kaybolmuş görünen adı zaten bastığını gösteriyor.",
    ],
    [
      "Damit wird aus dem vermeintlichen Beweis einer gezielten Auslassung eine Frage nach Darstellungsbedingungen; offen bleibt weiterhin, welche Namen im Alltag tatsächlich bevorzugt und von welchen Gruppen sie verwendet wurden.",
      "Böylece kasıtlı dışlama sanılan kanıt, gösterim koşullarına ilişkin bir soruya dönüşüyor; gündelik hayatta hangi adların kimlerce tercih edildiği ise açık kalıyor.",
    ],
    [
      "Für die Ausstellung können wir eine kommentierte Zeitleiste der überprüften Karten erstellen oder zwei Maßstäbe direkt nebeneinanderstellen und die Betrachtenden selbst die unterschiedlich dichte Beschriftung entdecken lassen.",
      "Sergi için incelenen haritalardan açıklamalı bir zaman çizelgesi yapabilir ya da iki ölçeği yan yana koyup ziyaretçilerin etiket yoğunluğundaki farkı kendilerinin keşfetmesini sağlayabiliriz.",
    ],
  ],
  [
    "Adın bir haritada bulunmaması neden kasıtlı dışlamanın kesin kanıtı sayılamıyor?",
    [
      "Farklı ölçek ve ayrıntı düzeyi, neyin yazılabildiğini etkiliyor.",
      "Öteki haritalarda hiçbir sokak bulunmadığı için.",
      "Planlamacı bütün eski haritaları geçersiz ilan ettiği için.",
    ],
    "“den unterschiedlichen Maßstab” ölçek farkını gösterir. Sonraki bulgu aynı yayınevinin ayrıntılı baskısında adı içerdiğidir; yokluk, tek başına niyeti kanıtlamaz.",
  ],
  [
    [
      "Wir erstellen eine kommentierte Zeitleiste.",
      "Açıklamalı bir zaman çizelgesi hazırlarız.",
    ],
    [
      "Wir stellen zwei Maßstäbe direkt nebeneinander.",
      "İki farklı ölçeği doğrudan yan yana koyarız.",
    ],
  ],
  null,
  [
    "Maßstab",
    "der",
    "ölçek",
    "Maßstäbe",
    "Der Maßstab beeinflusst die sichtbaren Einzelheiten.",
    "Ölçek, görünen ayrıntıları etkiliyor.",
  ],
);
add(
  "path-b",
  "Hatıranın kendi sesi",
  [
    [
      "Der Ladenbesitzer erzählt, dass seine Familie den Platz jahrzehntelang beim Namen eines längst geschlossenen Brunnencafés genannt habe, obwohl dieser Ausdruck auf seinen alten Lieferrechnungen nie als Anschrift auftauche.",
      "Dükkân sahibi, eski teslimat faturalarında bu ifade hiç adres olarak geçmese de ailesinin meydana yıllarca çoktan kapanmış Çeşme Kafe’nin adını verdiğini anlatıyor.",
    ],
    [
      "Er möchte damit keine stadtweite Gewohnheit belegen, sondern erklären, weshalb ihm die heutige offizielle Bezeichnung zunächst fremd klang, obwohl er den bezeichneten Ort selbstverständlich und ohne Zögern wiedererkannte.",
      "Bununla bütün kentteki bir alışkanlığı kanıtlamak değil, tarif edilen yeri tereddütsüz tanımasına rağmen bugünkü resmî adın ilk başta neden yabancı geldiğini açıklamak istiyor.",
    ],
    [
      "Auf unsere Nachfrage erlaubt er eine kurze Aufnahme für diese Ausstellung, behält sich jedoch vor, den ausgewählten Ausschnitt vor der Veröffentlichung anzuhören und missverständliche Kürzungen gemeinsam mit uns zu besprechen.",
      "Sorumuza karşılık bu sergi için kısa bir kayda izin veriyor; ancak yayımdan önce seçilen bölümü dinlemeyi ve yanlış anlaşılabilecek kısaltmaları bizimle konuşmayı şart koşuyor.",
    ],
    [
      "Wir können den freigegebenen O-Ton mit einer Kontextangabe präsentieren oder aus dem bestätigten Inhalt eine schriftliche Gegenüberstellung von Alltagsname und amtlicher Anschrift entwickeln, ohne eine Seite als unecht abzuwerten.",
      "Onaylanan özgün ses kaydını bağlam bilgisiyle sunabilir veya doğrulanan içerikten gündelik adla resmî adresi yazılı biçimde karşılaştırabiliriz; birini sahte diye değersizleştirmeye gerek yok.",
    ],
  ],
  [
    "Dükkân sahibi ailesinin kullandığı adı anlatırken neyi özellikle iddia etmiyor?",
    [
      "Bütün kentte herkesin aynı adı kullandığını.",
      "Bu adın aile hatırasında yer aldığını.",
      "Resmî adı duyunca yeri yine de tanıdığını.",
    ],
    "“keine stadtweite Gewohnheit belegen” bütün kente genellenen alışkanlık iddiasını açıkça reddeder. Anlatımın kapsamı, konuşmacının ailesi ve deneyimidir.",
  ],
  [
    [
      "Wir präsentieren den bestätigten O-Ton mit Kontext.",
      "Onaylanan özgün ses kaydını bağlamıyla sunarız.",
    ],
    [
      "Wir erstellen eine schriftliche Gegenüberstellung.",
      "Yazılı bir karşılaştırma hazırlarız.",
    ],
  ],
  null,
  [
    "Anschrift",
    "die",
    "adres",
    "Anschriften",
    "Die amtliche Anschrift steht auf der Rechnung.",
    "Resmî adres faturada yazıyor.",
  ],
);
add(
  "end-a1",
  "Zaman çizelgesindeki açık aralık",
  [
    [
      "Unsere Zeitleiste nennt zu jeder Karte das Erscheinungsjahr und den Maßstab; zwischen zwei gesicherten Ausgaben bleibt ein ausdrücklich markierter Zeitraum, für den uns bislang keine vergleichbare Quelle vorliegt.",
      "Zaman çizelgemiz her haritanın baskı yılını ve ölçeğini belirtiyor; doğrulanmış iki baskı arasında karşılaştırılabilir kaynak bulamadığımız, özellikle işaretlenmiş bir aralık kalıyor.",
    ],
    [
      "Eine Besucherin fragt, ob während dieser Lücke der Name abgeschafft worden sei; wir zeigen auf die Beschriftung und erläutern, weshalb fehlendes Material keine Auskunft über ein mögliches Ereignis erteilt.",
      "Bir ziyaretçi bu boşluk sırasında adın kaldırılıp kaldırılmadığını soruyor; açıklamayı gösterip malzeme yokluğunun olası bir olay hakkında neden bilgi vermediğini anlatıyoruz.",
    ],
    [
      "Statt den Leerraum mit einer eingängigen Erzählung zu schließen, stellen wir daneben eine offene Quellenfrage und erklären, welche Art von öffentlichem Beleg eine spätere Ergänzung rechtfertigen könnte.",
      "Boşluğu akılda kalıcı bir anlatıyla kapatmak yerine yanına açık bir kaynak sorusu koyuyor ve hangi tür kamusal belgenin sonradan ekleme yapmayı haklı kılacağını açıklıyoruz.",
    ],
    [
      "Die Ausstellung wirkt dadurch weniger abgeschlossen, bietet aber einen überprüfbaren Weg durch das Material, auf dem eine spätere Korrektur als Erkenntnisgewinn und nicht als peinliche Niederlage erscheinen kann.",
      "Sergi böylece daha az tamamlanmış görünüyor ama malzeme içinde denetlenebilir bir yol sunuyor; bu yolda sonraki düzeltme utanç verici yenilgi değil, bilgi kazanımı olabiliyor.",
    ],
  ],
  [
    "Zaman çizelgesindeki boşluk nasıl ele alınıyor?",
    [
      "Kaynak bulunmayan dönem olarak belirtilip açık bir araştırma sorusu bırakılıyor.",
      "Adın kesinlikle yasaklandığı dönem diye ilan ediliyor.",
      "Ziyaretçiler fark etmesin diye kapatılıyor.",
    ],
    "“für den uns bislang keine vergleichbare Quelle vorliegt” boşluğun bilgi durumunu açıklar. Sonraki paragraflar buradan olay uydurmak yerine kaynak sorusu üretildiğini gösterir.",
  ],
  [],
  "Belirsizliğini gizlemeyen zaman çizelgesi",
  [
    "Zeitleiste",
    "die",
    "zaman çizelgesi",
    "Zeitleisten",
    "Die Zeitleiste zeigt auch eine Quellenlücke.",
    "Zaman çizelgesi bir kaynak boşluğunu da gösteriyor.",
  ],
);
add(
  "end-a2",
  "Yan yana duran iki ölçek",
  [
    [
      "Wir hängen die beiden Kartenausschnitte auf gleicher Augenhöhe auf und geben ihren unterschiedlichen Maßstab deutlich an, damit die scheinbar unmittelbare Vergleichbarkeit nicht unbemerkt zu einem sachlichen Missverständnis führt.",
      "Görünüşte doğrudan karşılaştırılabilir olmaları fark edilmeden yanlış anlamaya yol açmasın diye iki harita parçasını aynı göz hizasına asıp farklı ölçeklerini belirgin biçimde yazıyoruz.",
    ],
    [
      "Eine transparente Umzeichnung hebt nur die jeweils gedruckten Namen hervor, während alle Ergänzungen aus heutiger Kenntnis eine andere Farbe erhalten und ausdrücklich als nachträgliche Orientierungshilfe bezeichnet werden.",
      "Şeffaf bir yeniden çizim yalnızca o baskılarda basılmış adları öne çıkarıyor; bugünkü bilgiden eklenenler başka renkle gösterilip sonradan eklenmiş yön bulma yardımı olarak belirtiliyor.",
    ],
    [
      "Die Besuchenden entdecken selbst, dass ein dichter beschriftetes Blatt nicht zwangsläufig die umfassendere gesellschaftliche Wirklichkeit erzählt, sondern zunächst mehr kartografisch ausgewählte Einzelheiten innerhalb eines bestimmten Darstellungsrahmens zeigt.",
      "Ziyaretçiler, daha yoğun yazılı bir sayfanın mutlaka daha kapsamlı toplumsal gerçekliği anlatmadığını; önce, belirli bir gösterim çerçevesinde seçilmiş daha çok harita ayrıntısı gösterdiğini kendileri keşfediyor.",
    ],
    [
      "Am Ausgang lassen wir die Frage stehen, welche weiteren Quellen die gezeichnete Auswahl ergänzen könnten, ohne den Karten nachträglich Aussagen aufzubürden, für die sie weder hergestellt noch geeignet waren.",
      "Çıkışta, haritalara üretilmedikleri ve elverişli olmadıkları iddiaları sonradan yüklemeden, çizilmiş seçimi hangi başka kaynakların tamamlayabileceği sorusunu bırakıyoruz.",
    ],
  ],
  [
    "Bugünkü bilgiden yapılan eklemeler neden başka renkte?",
    [
      "Sonradan eklenen yardımla özgün baskıdaki bilgiyi ayırmak için.",
      "Eski haritaları bütünüyle okunmaz kılmak için.",
      "İki haritanın aynı ölçekte olduğunu göstermek için.",
    ],
    "“alle Ergänzungen aus heutiger Kenntnis eine andere Farbe” güncel eklemelerin ayrı işaretlendiğini belirtir. Böylece özgün kaynağın söylediği ile sonradan katılan bilgi karışmaz.",
  ],
  [],
  "Kaynakla eklemeyi ayıran haritalar",
  [
    "Ergänzung",
    "die",
    "ekleme, tamamlama",
    "Ergänzungen",
    "Die Ergänzung ist farblich vom Original getrennt.",
    "Ekleme, renkle özgün kaynaktan ayrılıyor.",
  ],
);
add(
  "end-b1",
  "Kapsamı belirtilmiş bir ses",
  [
    [
      "Nach der gemeinsamen Durchsicht wählt der Ladenbesitzer einen kurzen Ausschnitt aus und bestätigt die Begleitzeile, die seine Erzählung als familiäre Erinnerung statt als stellvertretende Stimme des ganzen Ortes kennzeichnet.",
      "Birlikte incelemenin ardından dükkân sahibi kısa bir bölüm seçiyor ve anlatısını bütün yerleşimin temsilî sesi değil aile hatırası olarak belirten eşlik yazısını onaylıyor.",
    ],
    [
      "Neben dem Kopfhörer steht, für welche Ausstellung die Aufnahme freigegeben wurde; eine Weiterverwendung wird daraus nicht abgeleitet, und die vereinbarte Ansprechstelle für spätere Rückfragen bleibt gut sichtbar.",
      "Kulaklığın yanında kaydın hangi sergi için paylaşıma açıldığı yazıyor; buradan başka kullanımlara izin çıkarılmıyor ve sonraki sorular için kararlaştırılan iletişim noktası görünür tutuluyor.",
    ],
    [
      "Einige Besucher erkennen den erzählten Namen wieder, andere hören ihn zum ersten Mal; wir sammeln ihre Reaktionen nur freiwillig und getrennt von der bereits freigegebenen Aufnahme.",
      "Bazı ziyaretçiler anlatılan adı tanıyor, bazıları ilk kez duyuyor; tepkilerini yalnızca gönüllü olarak ve zaten onaylanmış kayıttan ayrı topluyoruz.",
    ],
    [
      "So entsteht kein Chor, der rückwirkend eine einzige Vergangenheit behauptet, sondern eine hörbare Einladung, ähnliche Erfahrungen ebenso sorgfältig zu verorten wie überraschend unterschiedliche Erinnerungen an denselben Platz.",
      "Böylece geriye dönük tek bir geçmiş iddia eden koro değil, benzer deneyimleri de aynı meydanın şaşırtıcı derecede farklı hatıraları kadar özenle bağlama yerleştirmeye yönelik işitilebilir bir davet oluşuyor.",
    ],
  ],
  [
    "Kaydın eşlik yazısı hangi sınırı açıkça koruyor?",
    [
      "Aile hatırasının bütün kasabanın ortak sesi sayılmamasını.",
      "Ziyaretçilerin farklı hatıralar anlatmasının yasaklanmasını.",
      "Kaydın her yerde sınırsız kullanılabilmesini.",
    ],
    "“als familiäre Erinnerung statt als stellvertretende Stimme” anlatının temsil kapsamını sınırlar. İkinci paragraf, izin verilen kullanımın da bu sergiyle ilişkili olduğunu açıklar.",
  ],
  [],
  "Bir aile hatırasının kendi sesi",
  [
    "Aufnahme",
    "die",
    "ses kaydı",
    "Aufnahmen",
    "Die Aufnahme wurde für diese Ausstellung freigegeben.",
    "Ses kaydı bu sergi için paylaşıma açıldı.",
  ],
);
add(
  "end-b2",
  "Adres ile gündelik ad arasında",
  [
    [
      "Für die schriftliche Gegenüberstellung übernehmen wir nur den bestätigten Inhalt des Gesprächs und lassen den Ladenbesitzer prüfen, ob die Zusammenfassung seine Einschränkungen ebenso deutlich wiedergibt wie seine anschauliche Erinnerung.",
      "Yazılı karşılaştırmaya yalnızca görüşmenin doğrulanmış içeriğini alıyor ve özetin canlı hatıra kadar sınırlamaları da açıkça aktarıp aktarmadığını dükkân sahibine kontrol ettiriyoruz.",
    ],
    [
      "Auf einer Seite steht die amtliche Anschrift aus einer freigegebenen Musterrechnung, auf der anderen der familiäre Alltagsname; persönliche Rechnungsdaten bleiben unberührt und werden für diesen Vergleich nicht benötigt.",
      "Bir tarafta paylaşımına izin verilmiş örnek faturadaki resmî adres, öbüründe ailenin gündelik adı var; kişisel fatura verilerine dokunulmuyor ve bu karşılaştırma için onlara ihtiyaç duyulmuyor.",
    ],
    [
      "Die Erläuterung betont, dass die beiden Formen unterschiedliche Aufgaben erfüllen: Die eine ermöglicht eine eindeutige Zustellung, während die andere einen gemeinsam erinnerten Bezugspunkt innerhalb eines bestimmten Familienkreises bezeichnet.",
      "Açıklama iki biçimin farklı işlevlerini vurguluyor: Biri teslimatın doğru yapılmasını sağlıyor; öbürü belirli bir aile çevresinin birlikte hatırladığı bir dayanağı adlandırıyor.",
    ],
    [
      "Als die Ausstellung eröffnet, fragt niemand mehr nach dem einzig echten Namen; stattdessen sprechen wir darüber, wann eine Bezeichnung verständlich ist und wem gegenüber ihr Zusammenhang erläutert werden muss.",
      "Sergi açıldığında artık hiç kimse tek gerçek adı sormuyor; bunun yerine bir adın ne zaman anlaşılır olduğunu ve bağlamının kime açıklanması gerektiğini konuşuyoruz.",
    ],
  ],
  [
    "Resmî adres ile aile içinde kullanılan ad nasıl karşılaştırılıyor?",
    [
      "Biri teslimat, diğeri aile içi hatırlama gibi farklı işlevlerle açıklanıyor.",
      "Ailede kullanılan adın yalan olduğu ilan ediliyor.",
      "Kişisel faturalar herkesin okuyabilmesi için yayımlanıyor.",
    ],
    "“unterschiedliche Aufgaben erfüllen” iki biçimin farklı işlev gördüğünü açıklar. Sonraki ifadeler doğru teslimatı ve aile içindeki ortak hatırlama noktasını ayrı ayrı belirtir.",
  ],
  [],
  "Birbirini silmeyen iki adlandırma",
  [
    "Gegenüberstellung",
    "die",
    "karşılaştırmalı yan yana sunum",
    "Gegenüberstellungen",
    "Die Gegenüberstellung erläutert verschiedene Funktionen.",
    "Yan yana sunum farklı işlevleri açıklıyor.",
  ],
);
save(
  "c2-stadtgespraech",
  "Ein Platz mit mehreren Namen",
  "Aynı meydanın farklı adlarını kaynak, ölçek ve kişisel hatıra üzerinden incele. C2 düzeyinde kapsam sınırlama, çıkarım, temsil ve farklı işlevleri karşılaştırma çalışması.",
);
console.log(
  "Three original public stories written; no API calls or learner changes.",
);
