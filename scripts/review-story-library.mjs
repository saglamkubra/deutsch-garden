// Offline editorial corrections to public drafts only. Never reads learner records.
import fs from "node:fs";
const directory = ".cache/story-library-drafts/";
function edit(slug, fn) {
  const base = directory + "story-library-" + slug;
  const path = fs.existsSync(base + ".json")
    ? base + ".json"
    : base + ".rejected.json";
  if (!fs.existsSync(path)) return;
  const data = JSON.parse(fs.readFileSync(path, "utf8"));
  fn(data.draft);
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}
function scene(d, id) {
  return d.scenes.find((s) => s.id === id);
}
edit("b1-radioteam", (d) => {
  d.germanTitle = "Die erste Sendung des Schulradios";
  const s = scene(d, "start");
  s.title = "Yeni okul radyosu";
  s.focus = {
    word: "Mikrofon",
    form: "Mikrofon",
    article: "das",
    meaning: "mikrofon",
    plural: "Mikrofone",
    de: "Das Mikrofon steht vor der Sprecherin.",
    tr: "Mikrofon, konuşmacının önünde duruyor.",
  };
  s.lines[3].tr =
    "İlk büyük mikrofonun önünde hâlâ biraz heyecanlı olsak da öğretmenimiz bize etkin biçimde destek oluyor.";
  scene(d, "end-a1").lines[1].tr =
    "Kristal netliğindeki kayıt, teknik hazırlıklarına gururla bakan bütün katılımcıları sevindiriyor.";
  const titles = [
    "Yeni okul radyosu",
    "Önce teknik hazırlık",
    "Ses denemeleri",
    "Temiz kayıt",
    "Hışırtılı başlangıç",
    "Akıcı sunum",
    "Bir sonraki yayın için notlar",
  ];
  d.scenes.forEach((s, i) => (s.title = titles[i]));
});
edit("b1-neuanfang", (d) => {
  d.germanTitle = "Nach einem Missverständnis";
  for (const s of d.scenes)
    for (const l of s.lines) {
      l.de = l.de
        .replaceAll("begrüsste", "begrüßte")
        .replaceAll("Vormitag", "Vormittag")
        .replaceAll("tippmiş", "getippt");
      l.tr = l.tr
        .replaceAll("dalıdı", "daldı")
        .replaceAll("sorulari", "soruları");
    }
  scene(d, "start").lines[0].tr =
    "Tom’un mesajı telefon ekranında belirdiğinde Anna kendini incinmiş hissetti; çünkü mesajın tonu alışılmadık biçimde soğuk ve ters gelmişti.";
  scene(d, "end-a1").lines[3] = {
    de: "Zufrieden verließen sie das Lokal und wussten, dass sie manche Missverständnisse durch ruhiges Nachfragen gemeinsam klären konnten.",
    tr: "Mekândan memnun ayrılırken, bazı yanlış anlaşılmaları sakince soru sorarak birlikte açıklığa kavuşturabileceklerini biliyorlardı.",
  };
  const titles = [
    "Soğuk görünen mesaj",
    "Doğrudan telefon görüşmesi",
    "Ertesi sabah parkta",
    "Kafede açık bir konuşma",
    "Dinlenmek için bir akşam",
    "Gelecek için bir anlaşma",
    "Projeye odaklanmak",
  ];
  d.scenes.forEach((s, i) => (s.title = titles[i]));
});
edit("b2-stadtteilzeitung", (d) => {
  scene(d, "end-a1").lines[1] = {
    de: "Die Leser schätzen diese präzise Klarstellung, weil sie überprüfbare Informationen an die Stelle unbelegter Behauptungen und vorschneller Spekulationen setzt.",
    tr: "Okurlar bu açık düzeltmeyi takdir ediyor; çünkü doğrulanabilir bilgiler, dayanaksız iddiaların ve aceleci varsayımların yerini alıyor.",
  };
  for (const s of d.scenes) {
    for (const l of s.lines)
      l.tr = l.tr.replaceAll(
        "siyah üzerine beyaz görmek",
        "yazılı belgelerde açıkça görmek",
      );
    s.question.prompt = s.question.prompt.replace(
      "hangi adı atmaya",
      "hangi adımı atmaya",
    );
  }
  scene(d, "start").question.prompt =
    "Editörün ekranında hangi iki tür açıklama bulunuyor?";
});
edit("b2-inselroute", (d) => {
  d.germanTitle = "Zwei Wege auf der Lindeninsel";
  let s = scene(d, "start");
  s.title = "İskeleden iki açık rota";
  s.focus = {
    word: "Hinweisschild",
    form: "Hinweisschild",
    article: "das",
    meaning: "uyarı levhası",
    plural: "Hinweisschilder",
    de: "Das Hinweisschild zeigt einen offenen Weg.",
    tr: "Uyarı levhası açık bir yolu gösteriyor.",
  };
  s.lines[0] = {
    de: "Nachdem die Fähre den Hafen der erfundenen Lindeninsel erreicht hat, studieren wir gemeinsam eine detaillierte Karte mit den öffentlich zugänglichen Wanderwegen.",
    tr: "Feribot, kurgusal Linden Adası’nın limanına vardıktan sonra halka açık yürüyüş yollarını gösteren ayrıntılı bir haritayı birlikte inceliyoruz.",
  };
  s.lines[2] = {
    de: "Die gefährdete Abkürzung ist gesperrt; auf der Karte bleiben jedoch zwei ausdrücklich freigegebene Routen übrig, zwischen denen wir uns entscheiden können.",
    tr: "Riskli kestirme yol kapalı; ancak haritada açık olduğu özellikle belirtilen iki rota kalıyor ve bunlardan birini seçebiliyoruz.",
  };
  s.lines[3] = {
    de: "Während der markierte Küstenweg mit Abstand zu den Klippen verläuft, führt der schattige Waldweg durch den öffentlich zugänglichen Teil eines Schutzgebiets.",
    tr: "İşaretli kıyı yolu uçurumlardan uzakta ilerlerken, gölgeli orman yolu koruma alanının halka açık bölümünden geçiyor.",
  };
  s.choices[0] = {
    de: "Wir wählen den freigegebenen Küstenweg mit Blick aufs Meer.",
    tr: "Deniz manzaralı, açık kıyı yolunu seçiyoruz.",
  };
  s.question.explanation =
    "İskeledeki uyarının konusu “warnt ein großes Hinweisschild am Pier vor unerwarteten Steinschlägen” sözleriyle belirtilir. Seçilebilen yollar ise açık olduğu doğrulanan rotalardır.";
  s = scene(d, "path-a");
  s.title = "Kıyı yolunda yeni bilgi";
  s.lines[0] = {
    de: "Wir entscheiden uns für den freigegebenen Küstenweg, weil das helle Sonnenlicht die raue Küstenlinie wunderschön beleuchtet und die Markierungen gut sichtbar sind.",
    tr: "Parlak güneş ışığı engebeli kıyıyı güzelce aydınlattığı ve işaretler rahatça görüldüğü için açık kıyı yolunu seçiyoruz.",
  };
  s.lines[1] = {
    de: "Nach einer Stunde zügigen Gehens erreichen wir einen Holzzaun; dahinter beginnt die gesperrte Abkürzung, die wir keinesfalls betreten.",
    tr: "Bir saatlik tempolu yürüyüşten sonra ahşap bir çite ulaşıyoruz; arkasında kapalı kestirme yol başlıyor ve oraya kesinlikle girmiyoruz.",
  };
  s.lines[2] = {
    de: "Ein örtlicher Ranger erläutert die Sperrung und zeigt uns einen freigegebenen Bohlenweg über die feuchte Hochebene, der zum alten Leuchtfeuer führt.",
    tr: "Bölgenin koruma görevlisi kapatma nedenini açıklıyor ve nemli yüksek düzlükten eski deniz fenerine uzanan, açık bir tahta yürüyüş yolunu gösteriyor.",
  };
  s.lines[3] = {
    de: "Wir müssen nun abwägen, ob wir diesem markierten Umweg folgen oder auf dem bereits bekannten Küstenweg zum Hafen zurückkehren möchten.",
    tr: "Şimdi işaretli alternatif yola mı devam edeceğimizi, yoksa bildiğimiz kıyı yolundan limana mı döneceğimizi değerlendiriyoruz.",
  };
  s.choices[0] = {
    de: "Wir folgen dem freigegebenen Bohlenweg über die Hochebene.",
    tr: "Yüksek düzlükteki açık tahta yoldan devam ediyoruz.",
  };
  s.question.prompt =
    "Ahşap çitin bulunduğu noktada koruma görevlisi nasıl bir seçenek sunuyor?";
  s.question.options = [
    "Deniz fenerine giden, açık ve işaretli tahta yolu gösteriyor.",
    "Kapalı kestirmeye izinsiz girmemizi öneriyor.",
    "Adadaki bütün yolların kapandığını söylüyor.",
  ];
  s.question.correctIndex = 0;
  s.question.explanation =
    "Alternatif rota “einen freigegebenen Bohlenweg über die feuchte Hochebene” sözleriyle tanımlanır. Görevli kapalı kestirmeyi değil, açık bir yolu gösterir.";
  s = scene(d, "end-a1");
  s.lines[0] = {
    de: "Obwohl der markierte Bohlenweg über die feuchte Hochebene einen längeren Umweg verlangt, erreichen wir auf ihm schließlich glücklich das alte Leuchtfeuer.",
    tr: "Nemli yüksek düzlükteki işaretli tahta yol daha uzun bir dolaşma gerektirse de sonunda bu yoldan eski deniz fenerine sevinçle ulaşıyoruz.",
  };
  s.lines[2].tr =
    "Sabrımızın karşılığını alıyoruz; çünkü akşam ışığı bütün manzarayı altın rengi bir parıltıya bürüyor.";
  s.question.explanation =
    "Yolun sonunda ulaşılan yer, “das alte Leuchtfeuer” ifadesiyle belirtilir. Leuchtfeuer deniz feneri demektir; manzaranın bu yüksek noktadan izlendiği de açıklanır.";
  s = scene(d, "path-b");
  s.title = "Ormandaki yol ayrımı";
  s.lines[2] = {
    de: "Neben dem schmalen Pfad liegt ein umgestürzter Baumstamm; an dieser Stelle weist eine neue Markierung auf zwei offene Ausweichwege hin.",
    tr: "Dar patikanın yanında devrilmiş bir ağaç gövdesi bulunuyor; buradaki yeni işaret, iki açık alternatif yolu gösteriyor.",
  };
  s.lines[3] = {
    de: "Wir können entweder dem ebenen Talweg folgen oder auf einem gesicherten Treppenpfad zum höher gelegenen Aussichtspunkt hinaufsteigen.",
    tr: "Düz vadi yolundan gidebilir ya da güvenlik önlemleri bulunan basamaklı yoldan yukarıdaki seyir noktasına çıkabiliriz.",
  };
  s.choices = [
    {
      de: "Wir folgen dem markierten Talweg neben dem Baumstamm.",
      tr: "Ağaç gövdesinin yanındaki işaretli vadi yolundan gidiyoruz.",
    },
    {
      de: "Wir wählen den gesicherten Treppenpfad zum Aussichtspunkt.",
      tr: "Seyir noktasına çıkan güvenli basamaklı yolu seçiyoruz.",
    },
  ];
  s.question.prompt = "Ağaç gövdesinin yanındaki yeni işaret neyi gösteriyor?";
  s.question.options = [
    "Kullanılabilen iki alternatif yolu.",
    "Ormandaki bütün yolların kapalı olduğunu.",
    "Yalnızca görevlilerin girebildiği bir binayı.",
  ];
  s.question.correctIndex = 0;
  s.question.explanation =
    "“zwei offene Ausweichwege” ifadesi iki açık alternatif yol demektir. Devam cümlesinde bunların vadi yolu ve basamaklı yol olduğu açıklanır.";
  s = scene(d, "end-b1");
  s.title = "Vadide sessiz bir karşılaşma";
  s.lines[0] = {
    de: "Nachdem wir dem markierten Talweg am umgestürzten Baumstamm vorbei gefolgt sind, öffnet sich vor uns eine geschützte Aussicht auf eine idyllische Wiese.",
    tr: "Devrilmiş ağaç gövdesinin yanından geçen işaretli vadi yolunu izledikten sonra önümüzde huzurlu bir çayıra bakan korunaklı bir manzara açılıyor.",
  };
  s.question.prompt = "Vadi yolunu izledikten sonra çayırda ne görüyoruz?";
  s = scene(d, "end-b2");
  s.title = "Basamakların sonunda manzara";
  s.lines[0] = {
    de: "Der Aufstieg auf dem gesicherten Treppenpfad verlangt uns zwar viel Ausdauer ab, doch wir legen regelmäßig Pausen ein und erreichen schließlich die obere Plattform.",
    tr: "Güvenli basamaklı yoldaki çıkış dayanıklılık gerektiriyor; ama düzenli molalar vererek sonunda üstteki platforma ulaşıyoruz.",
  };
  s.question.prompt = "Basamaklı çıkışın sonunda hangi yere ulaşıyoruz?";
  scene(d, "end-a2").title = "Limanda sakin bir mola";
  for (const s of d.scenes)
    for (const l of s.lines)
      l.de = l.de.replaceAll("Klippenausflug", "Küstenausflug");
});
edit("b2-werkstattplan", (d) => {
  const replace = (from, to) => {
    for (const s of d.scenes) {
      for (const l of s.lines) l.de = l.de.replaceAll(from, to);
      s.question.explanation = s.question.explanation.replaceAll(from, to);
    }
  };
  replace("Fensterfenster", "Fenster");
  replace("dem Atelierequipe", "dem Atelierteam");
  replace(
    "sofort auf große Begeisterung stoßen",
    "sofort auf große Begeisterung stößt",
  );
  scene(d, "path-a").question.explanation =
    "“unerwartete Transportverzögerungen verursacht” ifadesinin Türkçesi, beklenmedik nakliye gecikmelerine neden olmasıdır; mesele ahşabın kalitesi değil, teslimatın gecikmesidir.";
  scene(d, "end-b2").question.explanation =
    "“dass kein potenzieller Nutzer ausgeschlossen wird” ifadesi kimsenin dışarıda bırakılmaması hedefini belirtir. Bu, öyküde eski cihazlarla uyumluluğa verilen önemin gerekçesidir.";
  scene(d, "end-a1").question.explanation =
    "“den Zeitplan problemlos einzuhalten” zaman çizelgesine uyabilmek demektir. İkinci cümledeki “eine warme und authentische Ausstrahlung” ise yerel ahşabın oluşturduğu sıcak görünümü açıklar.";
  scene(d, "end-a2").lines[3] = {
    de: "Die Designer freuen sich über die besondere Wirkung des ursprünglichen Entwurfs, halten aber auch fest, dass die zusätzlich vereinbarten Arbeitsstunden bei künftigen Projekten realistischer eingeplant werden müssen.",
    tr: "Tasarımcılar ilk tasarımın özel etkisine seviniyor; ancak birlikte kararlaştırılan ek çalışma saatlerinin gelecek projelerde daha gerçekçi planlanması gerektiğini de not ediyor.",
  };
  scene(d, "end-b1").lines[3] = {
    de: "Das Team dokumentiert neben den Vorteilen auch die Grenze dieser Entscheidung: Menschen mit älteren Geräten können die neue Anwendung vorerst nicht nutzen und benötigen weiterhin ein anderes Angebot.",
    tr: "Ekip, avantajların yanında bu kararın sınırını da belgeliyor: Eski cihazı olan kişiler yeni uygulamayı şimdilik kullanamıyor ve başka bir seçeneğe ihtiyaç duyuyor.",
  };
});
edit("c1-gartenarchiv", (d) => {
  const s = scene(d, "start");
  s.question.explanation =
    "Metindeki “die unvollständige Chronik” sözü kaydın eksik olduğunu gösterir. Son cümledeki “ob sie den offiziellen Weg” ile “auf eigene Faust” karşıtlığı, araştırmacının iki yaklaşım arasında kaldığını açıklar.";
  scene(d, "end-a1").question.explanation =
    "“einem eisigen Klima des Misstrauens” ifadesi buz gibi bir güvensizlik ortamını anlatır. Bu son, resmî kaydın tutulduğunu ama önceden var olan güvenin zarar gördüğünü belirtir.";
  scene(d, "end-b1").question.explanation =
    "Kimlik “Es ist die junge Hilfsbotanikerin” ifadesiyle açıklanır. Böylece hırsızlık şüphesinin doğrulanmadığı, kişinin önceki yılın botanik notlarını aradığı anlaşılır.";
  for (const n of d.scenes)
    for (const l of n.lines) {
      l.de = l.de
        .replaceAll("Paragraphengeistertum", "Paragraphenreiterei")
        .replaceAll("nächten Alleingang", "nächtlichen Alleingang");
    }
});
edit("c1-uebersetzung", (d) => {
  scene(d, "path-a").focus = {
    word: "Beleg",
    form: "Beleg",
    article: "der",
    meaning: "belgeye dayalı örnek, kanıt",
    plural: "Belege",
    de: "Ein Beleg stützt diese Lesart des Begriffs.",
    tr: "Belgeye dayalı bir örnek, terimin bu okunuşunu destekliyor.",
  };
  scene(d, "end-b2").focus.plural = "";
  scene(d, "start").lines[1] = {
    de: "Niemand im gesamten Projektteam konnte mit Sicherheit sagen, ob das Wort Reserve im fiktiven historischen Text eine finanzielle Rücklage oder eine zurückhaltende geistige Haltung bezeichnete.",
    tr: "Proje ekibinde hiç kimse, kurgusal tarihî metindeki Reserve sözcüğünün maddi bir birikimi mi yoksa düşünsel bir ihtiyatı mı anlattığını kesin olarak söyleyemiyordu.",
  };
});
edit("c1-lesesaal", (d) => {
  scene(d, "end-a2").question.explanation =
    "“ihre Stimmen von sich aus zu dämpfen” kullanıcıların seslerini kendiliğinden alçalttığını anlatır. Bu davranış, metinde “gegenseitige Rücksichtnahme” diye adlandırılan karşılıklı anlayışla ilişkilidir.";
  for (const s of d.scenes)
    for (const l of s.lines) {
      l.de = l.de
        .replaceAll(
          "zwischen den Beteiligten beigelegen",
          "zwischen den Beteiligten beigelegt",
        )
        .replaceAll(
          "das Viertel verließen",
          "andere Treffpunkte im Viertel aufsuchten",
        );
      l.tr = l.tr
        .replaceAll(
          "konuşmayı seven birkaç kişi mahalleden ayrılsa da",
          "konuşmayı seven birkaç kişi mahallede başka buluşma yerlerine yönelse de",
        )
        .replaceAll("modern alışverişin", "modern fikir alışverişinin");
    }
});
edit("c2-randnotizen", (d) => {
  d.germanTitle = "Randnotizen zu einer leeren Tasse";
  d.description =
    "Bir yazı atölyesinde boş fincanı gözlemden kurguya taşı. C2 düzeyinde varsayım, bakış açısı, anlatıcı seçimi ve metni yeniden düzenleme çalışması.";
  const rows = [
    [
      "start",
      "Boş fincanın kenarında",
      [
        [
          "In einem offenen Schreibatelier stellt die Leiterin eine leere Tasse auf den Tisch und bittet uns, zunächst nur die sichtbaren Merkmale dieses absichtlich unscheinbaren Gegenstands zu notieren.",
          "Açık bir yazı atölyesinde yönetici masaya boş bir fincan koyup önce bu özellikle sıradan nesnenin yalnızca görünen özelliklerini not etmemizi istiyor.",
        ],
        [
          "Neben dem Henkel verläuft ein heller Kratzer; eine Teilnehmerin nennt ihn sofort die Spur einer überstürzten Abreise, obwohl niemand die bisherige Geschichte der Tasse kennt.",
          "Kulpun yanında açık renkli bir çizik var; bir katılımcı, kimse fincanın önceki hikâyesini bilmediği hâlde buna hemen acele bir ayrılığın izi diyor.",
        ],
        [
          "Die Leiterin widerspricht der Einbildungskraft nicht, legt jedoch zwei verschiedenfarbige Blätter bereit, damit Beobachtung und erfundene Vorgeschichte beim späteren Vorlesen auseinandergehalten werden können, ohne eine davon abzuwerten.",
          "Yönetici hayal gücüne karşı çıkmıyor; fakat sonradan okunurken biri değersizleştirilmeden gözlemle uydurulan geçmiş ayırt edilebilsin diye iki farklı renk kâğıt hazırlıyor.",
        ],
        [
          "Wir dürfen entweder die Beschreibung der Tasse präzisieren oder eine ausdrücklich fiktive Szene entwerfen; die Aufgabe besteht darin, die gewählte Schreibweise anschließend bewusst erkennbar und sprachlich tragfähig zu machen.",
          "Ya fincanın betimlemesini kesinleştirebilir ya da kurgu olduğu açıkça belirtilen bir sahne yazabiliriz; görev, ardından seçilen yazım biçimini bilinçli olarak anlaşılır ve dilsel açıdan sağlam kılmak.",
        ],
      ],
      [
        "Katılımcının acele ayrılık yorumu neden henüz gözlem sayılamaz?",
        [
          "Fincanın geçmişi bilinmediği için bu yorum bir kurgu varsayımıdır.",
          "Çiziğin hiç görünmediği kesinleştiği için.",
          "Atölyede hayal kurmak yasak olduğu için.",
        ],
        "“obwohl niemand die bisherige Geschichte der Tasse kennt” geçmişe dair bilgi eksikliğini belirtir. Çizik görülür; onun acele bir ayrılıktan kaynaklandığı ise henüz gözlenmiş bir gerçek değildir.",
      ],
      [
        [
          "Wir präzisieren zunächst die Beschreibung.",
          "Önce betimlemeyi kesinleştiririz.",
        ],
        [
          "Wir schreiben eine ausdrücklich fiktive Szene.",
          "Kurgu olduğu açık bir sahne yazarız.",
        ],
      ],
      null,
      [
        "Tasse",
        "die",
        "fincan",
        "Tassen",
        "Die leere Tasse steht auf dem Tisch.",
        "Boş fincan masanın üzerinde duruyor.",
      ],
    ],
    [
      "path-a",
      "Sözcüklerin bakış noktası",
      [
        [
          "Wir beschreiben den Kratzer, den matten Rand und den Schatten neben dem Henkel, bevor uns auffällt, dass bereits das Wort verlassen eine nicht belegte Vorgeschichte in die Beschreibung einschmuggelt.",
          "Çiziği, mat kenarı ve kulpun yanındaki gölgeyi betimlerken terk edilmiş sözcüğünün bile betimlemeye doğrulanmamış bir geçmiş soktuğunu fark ediyoruz.",
        ],
        [
          "Eine Teilnehmerin schlägt vor, solche Ausdrücke nicht einfach zu streichen, sondern ihre Wirkung in einer zweiten Spalte zu erläutern, damit die sprachliche Entscheidung für andere nachvollziehbar bleibt.",
          "Bir katılımcı, bu ifadeleri yalnızca silmek yerine ikinci bir sütunda etkilerini açıklamayı öneriyor; böylece dilsel karar başkaları tarafından izlenebilir kalacak.",
        ],
        [
          "Ich würde die Fassung lieber laut lesen und hören, an welchen Stellen eine vermeintlich sachliche Wortfolge bereits eine Stimmung erzeugt, die auf dem weißen Papier weniger deutlich hervortritt.",
          "Bense sürümü sesli okuyup sözde nesnel bir sözcük dizisinin hangi noktalarda beyaz kâğıtta daha az belirgin bir duygu yarattığını duymak istiyorum.",
        ],
        [
          "Beide Vorschläge arbeiten an derselben Beschreibung, setzen aber unterschiedliche Prüfungen ein: Die Spalte erklärt einzelne Begriffe, während das Vorlesen auch Rhythmus, Pausen und die Gewichtung unscheinbarer Wörter erfahrbar macht.",
          "İki öneri de aynı betimleme üzerinde farklı kontroller yapıyor: Sütun tek tek kavramları açıklarken sesli okuma ritmi, durakları ve sıradan sözcüklerin ağırlığını da deneyimlenebilir kılıyor.",
        ],
      ],
      [
        "İkinci sütunun önerilen işlevi nedir?",
        [
          "Seçilen sözcüklerin etkisini açıklayıp dilsel kararı izlenebilir kılmak.",
          "Fincanın fiyatını hesaplamak.",
          "Bütün betimlemeleri yasaklamak.",
        ],
        "“ihre Wirkung in einer zweiten Spalte zu erläutern” ifadelerin etkisinin ikinci sütunda açıklanmasını önerir. Bu seçenek, sözcüklerin verdiği izlenimi okura görünür kılmaya yöneliktir.",
      ],
      [
        [
          "Wir erläutern die Wörter in einer zweiten Spalte.",
          "Sözcükleri ikinci sütunda açıklarız.",
        ],
        [
          "Wir lesen die Beschreibung laut und überarbeiten ihren Rhythmus.",
          "Betimlemeyi sesli okuyup ritmini düzenleriz.",
        ],
      ],
      null,
      [
        "Beschreibung",
        "die",
        "betimleme",
        "Beschreibungen",
        "Die Beschreibung enthält eine unbelegte Annahme.",
        "Betimlemede doğrulanmamış bir varsayım bulunuyor.",
      ],
    ],
    [
      "path-b",
      "Kurguya giren ses",
      [
        [
          "Für die fiktive Szene erfinden wir eine Reisende, die vor ihrer Abfahrt noch Tee trinken möchte, dann aber bemerkt, dass sie an diesem Morgen gar keinen Tee aufgegossen hat.",
          "Kurgusal sahne için yola çıkmadan çay içmek isteyen ama o sabah aslında hiç çay demlemediğini fark eden bir yolcu yaratıyoruz.",
        ],
        [
          "Die leere Tasse wird dadurch zum Ausgangspunkt einer kleinen Verzögerung, nicht zum Beweis eines tatsächlich geschehenen Abschieds; über dem Entwurf steht gut sichtbar der Hinweis auf unsere erfundene Vorgeschichte.",
          "Boş fincan böylece gerçekten yaşanmış bir vedanın kanıtı değil küçük bir gecikmenin başlangıcı oluyor; taslağın üzerinde uydurduğumuz geçmişe dair açıklama görünür biçimde duruyor.",
        ],
        [
          "Nun können wir die Reisende selbst erzählen lassen, sodass ihr Irrtum erst mit ihrer eigenen Erkenntnis sichtbar wird, oder eine außenstehende Erzählerin wählen, die das leere Gefäß von Anfang an beschreibt.",
          "Şimdi yolcuyu konuşturup yanılgısını kendi fark edişiyle görünür kılabilir ya da boş kabı baştan betimleyen dışarıdan bir anlatıcı seçebiliriz.",
        ],
        [
          "Diese Entscheidung verändert weniger den Ablauf als den Wissensvorsprung beim Lesen: Entweder entdecken wir die Leere zusammen mit der Figur oder beobachten, wie sie etwas längst Sichtbares allmählich bemerkt.",
          "Bu karar olay sırasından çok okurun bilgi üstünlüğünü değiştiriyor: Boşluğu ya karakterle birlikte keşfediyoruz ya da zaten görünür bir şeyi yavaşça nasıl fark ettiğini izliyoruz.",
        ],
      ],
      [
        "Anlatıcı seçiminin değiştirdiği temel şey nedir?",
        [
          "Okurun boş fincanı karakterden önce mi, onunla birlikte mi fark edeceği.",
          "Fincanın gerçek geçmişinin kesinleşmesi.",
          "Yolcunun hangi ülkede yaşadığının açıklanması.",
        ],
        "“den Wissensvorsprung beim Lesen” okuma sırasında bilgi üstünlüğünü belirtir. İki seçenek olayın kendisini değil, onun hangi anda ve kimin bilgisiyle sunulduğunu değiştirir.",
      ],
      [
        [
          "Die Reisende erzählt in der Ichform.",
          "Yolcu birinci tekil kişiyle anlatır.",
        ],
        [
          "Eine außenstehende Erzählerin beschreibt die Szene.",
          "Dışarıdan bir anlatıcı sahneyi betimler.",
        ],
      ],
      null,
      [
        "Entwurf",
        "der",
        "taslak",
        "Entwürfe",
        "Der Entwurf ist ausdrücklich als Fiktion gekennzeichnet.",
        "Taslağın kurgu olduğu açıkça belirtiliyor.",
      ],
    ],
    [
      "end-a1",
      "İki sütunda görünen tercih",
      [
        [
          "In der linken Spalte behalten wir die knappe Beschreibung der Tasse, während rechts erläutert wird, weshalb das zunächst gewählte Adjektiv verlassen mehr behauptet, als wir tatsächlich beobachten konnten.",
          "Sol sütunda fincanın kısa betimlemesini koruyor, sağda ise önce seçilen terk edilmiş sıfatının gerçekten gözleyebildiğimizden fazlasını neden iddia ettiğini açıklıyoruz.",
        ],
        [
          "Die Gegenüberstellung macht unseren ersten Versuch nicht lächerlich, sondern zeigt einen konkreten Überarbeitungsschritt, an dem andere Schreibende das Verhältnis zwischen sichtbarem Merkmal und hinzugedachter Bedeutung nachvollziehen können.",
          "Karşılaştırma ilk denememizi gülünçleştirmiyor; diğer yazarların görünen özellikle sonradan eklenen anlam arasındaki ilişkiyi izleyebileceği somut bir düzeltme adımı gösteriyor.",
        ],
        [
          "Eine Besucherin bemerkt, dass selbst die nüchterne Endfassung eine Auswahl treffe; wir ergänzen diesen Einwand, statt die zweite Version als voraussetzungslosen und endgültig neutralen Blick auf den Gegenstand auszugeben.",
          "Bir ziyaretçi kuru son sürümün bile seçim yaptığını söylüyor; ikinci sürümü nesneye koşulsuz ve tamamen tarafsız bakış diye sunmak yerine bu itirazı ekliyoruz.",
        ],
        [
          "Am Ende nehmen wir beide Blätter mit nach Hause, weil der Vergleich mehr über unsere Arbeit verrät als ein einzelner geglätteter Text, in dem alle Entscheidungen spurlos verschwunden wären.",
          "Sonunda iki sayfayı da eve götürüyoruz; çünkü karşılaştırma, bütün kararların izsiz kaybolduğu tek bir pürüzsüz metinden daha çok şey anlatıyor.",
        ],
      ],
      [
        "İlk sürüm neden son sürümün yanında korunuyor?",
        [
          "Düzeltme kararının ve eklenen anlamın izlenebilmesi için.",
          "İlk sürümün kesinlikle tek doğru sayılması için.",
          "Ziyaretçilerin hiçbir fark görememesi için.",
        ],
        "“einen konkreten Überarbeitungsschritt” somut düzenleme adımını belirtir. Yan yana duran metinler, hangi ifadenin neden değiştiğini ve bunun anlam üzerindeki etkisini gösterir.",
      ],
      [],
      "Kararlarını görünür tutan iki sütun",
      [
        "Gegenüberstellung",
        "die",
        "yan yana karşılaştırma",
        "Gegenüberstellungen",
        "Die Gegenüberstellung macht die Überarbeitung sichtbar.",
        "Yan yana karşılaştırma düzenlemeyi görünür kılıyor.",
      ],
    ],
    [
      "end-a2",
      "Sesli okunan betimleme",
      [
        [
          "Beim lauten Lesen legen wir nach dem Wort leer zunächst eine lange Pause ein und hören, wie dadurch eine Erwartung entsteht, die in unserer sachlichen Beschreibung eigentlich gar nicht begründet war.",
          "Sesli okurken boş sözcüğünden sonra önce uzun bir durak bırakıyor ve nesnel betimlememizde aslında temeli bulunmayan bir beklentinin nasıl oluştuğunu duyuyoruz.",
        ],
        [
          "Wir verkürzen die Pause und verschieben einen Satz, sodass die Aufzählung der sichtbaren Merkmale zusammenhängender klingt, ohne den Rhythmus durch eine mechanisch gleichmäßige Folge aller Wörter zu ersetzen.",
          "Durakı kısaltıp bir cümlenin yerini değiştiriyoruz; böylece görünen özelliklerin sıralanışı, bütün sözcükleri mekanik olarak eşitlemeden daha bağlantılı duyuluyor.",
        ],
        [
          "Die Leiterin liest beide Fassungen vor, während wir mit geschlossenen Augen ausschließlich auf die gesetzten Akzente achten; eine besonders eindringliche Stimme gilt dabei nicht automatisch als Beweis einer genaueren Beobachtung.",
          "Yönetici iki sürümü okurken gözlerimizi kapatıp yalnızca vurgulara dikkat ediyoruz; özellikle etkileyici bir ses, kendiliğinden daha doğru gözlemin kanıtı sayılmıyor.",
        ],
        [
          "Unser letzter Eintrag beschreibt deshalb nicht nur die Wortwahl, sondern auch den Vortrag und erinnert uns daran, dass schriftliche Genauigkeit und hörbare Wirkung miteinander verbunden bleiben, ohne dasselbe zu sein.",
          "Son notumuz bu nedenle yalnızca sözcük seçimini değil sunuşu da anlatıyor; yazılı kesinlikle işitilen etkinin aynı şey olmadan bağlantılı kaldığını hatırlatıyor.",
        ],
      ],
      [
        "Uzun durağın fark edilen etkisi nedir?",
        [
          "Betimlemenin içeriğiyle temellendirilmemiş bir beklenti yaratması.",
          "Fincanı fiziksel olarak doldurması.",
          "Bütün dinleyicilerin aynı anıyı yaşamasını kesinleştirmesi.",
        ],
        "“eine Erwartung entsteht” beklentiyi, “gar nicht begründet war” ise bunun nesnel betimlemeyle temellendirilmediğini belirtir. Çalışma, durakların da yorumu etkilediğini gösterir.",
      ],
      [],
      "Ritmi de incelenen metin",
      [
        "Pause",
        "die",
        "durak, ara",
        "Pausen",
        "Eine lange Pause verändert die Erwartung.",
        "Uzun bir durak beklentiyi değiştiriyor.",
      ],
    ],
    [
      "end-b1",
      "Yolcuyla birlikte fark etmek",
      [
        [
          "Ich griff nach der Tasse, als ließe sich die verbleibende Zeit noch austrinken, und wunderte mich erst über ihr geringes Gewicht, bevor ich ihren vollkommen trockenen Boden bemerkte.",
          "Kalan zamanı içip bitirebilirmişim gibi fincana uzandım; kupkuru dibini fark etmeden önce hafifliğine şaşırdım.",
        ],
        [
          "Mit dieser Ichstimme beginnt unsere Reisende ihren erfundenen Morgen; die Lesenden erfahren von der fehlenden Teezubereitung erst dann, wenn die Figur selbst ihre hastige Vorstellung mit dem sichtbaren Gegenstand vergleicht.",
          "Yarattığımız yolcu, kurgusal sabahına bu ben sesiyle başlıyor; okur, çayın hazırlanmadığını ancak karakter aceleci düşüncesini görünen nesneyle karşılaştırdığında öğreniyor.",
        ],
        [
          "Wir vermeiden einen erklärenden Vorspann, der den kleinen Irrtum vorwegnähme, und lassen stattdessen die unmittelbar folgende Entscheidung der Reisenden offen: Noch Tee kochen oder mit der leeren Tasse einfach weiterkommen.",
          "Küçük yanılgıyı önceden söyleyen açıklayıcı girişi kullanmıyor, bunun yerine yolcunun sıradaki kararını açık bırakıyoruz: Çay yapmak mı, boş fincanı kabul ederek devam etmek mi?",
        ],
        [
          "Über dem fertigen Text steht weiterhin der Hinweis Fiktion; die erfundene Nähe einer Ichstimme soll das Mitlesen ermöglichen, ohne unsere wirkliche Kenntnis der ursprünglichen Tasse größer erscheinen zu lassen.",
          "Bitmiş metnin üzerinde hâlâ Kurgu açıklaması var; ben sesinin yarattığı yakınlık, gerçek fincanla ilgili bilgimizi olduğundan fazla göstermeden okuru sahneye katmalı.",
        ],
      ],
      [
        "Birinci kişi anlatımında okur çayın yapılmadığını ne zaman öğreniyor?",
        [
          "Karakterin kendisi fincanı fark edip düşündüğüyle karşılaştırdığında.",
          "Henüz karakter fincana uzanmadan önce bir önsözde.",
          "Gerçek fincanın sahibinden gelen belgede.",
        ],
        "“erst dann, wenn die Figur selbst” bilginin karakterin fark edişiyle eşzamanlı verildiğini açıklar. Böylece okur küçük yanılgıyı dışarıdan önceden bilmez, karakterle birlikte keşfeder.",
      ],
      [],
      "Karakterle eşzamanlı küçük keşif",
      [
        "Ichstimme",
        "die",
        "birinci kişi anlatıcı sesi",
        "Ichstimmen",
        "Die Ichstimme begrenzt das Wissen der Lesenden.",
        "Birinci kişi sesi okurun bilgisini sınırlandırıyor.",
      ],
    ],
    [
      "end-b2",
      "Bir adım önde duran anlatıcı",
      [
        [
          "Auf dem Tisch stand eine leere Tasse, während die Reisende bereits nach dem Henkel griff und gedanklich den Tee kostete, den sie an diesem Morgen nicht zubereitet hatte.",
          "Masada boş bir fincan duruyordu; yolcuysa kulpa uzanıyor, o sabah hazırlamadığı çayın tadını zihninde alıyordu.",
        ],
        [
          "Unsere außenstehende Erzählerin benennt die Leere sofort, sodass beim Lesen ein kleiner Wissensvorsprung entsteht; wir beobachten nun nicht das Geheimnis eines Gegenstands, sondern die Verzögerung einer alltäglichen Erkenntnis.",
          "Dışarıdan anlatıcımız boşluğu hemen adlandırıyor, böylece okurken küçük bir bilgi üstünlüğü oluşuyor; artık bir nesnenin sırrını değil, gündelik bir fark edişin gecikmesini izliyoruz.",
        ],
        [
          "Die Szene endet damit, dass die Reisende den Wasserkocher einschaltet und ihren Zeitplan neu ordnet, ohne dass aus dem kurzen Versehen eine allgemeine Aussage über ihren Charakter abgeleitet wird.",
          "Sahne yolcunun su ısıtıcısını açıp zaman planını yeniden düzenlemesiyle bitiyor; kısa dalgınlığından karakteri hakkında genel bir hüküm çıkarılmıyor.",
        ],
        [
          "Neben den Text legen wir die ursprüngliche Beschreibung und markieren den Übergang zur Erfindung; gerade die offen ausgewiesene Grenze erlaubt es der Geschichte, frei zu werden, ohne sich als tatsächliche Erinnerung auszugeben.",
          "Metnin yanına ilk betimlemeyi koyup kurguya geçişi işaretliyoruz; açıkça gösterilen bu sınır, hikâyenin gerçek hatıraymış gibi davranmadan özgürleşmesini sağlıyor.",
        ],
      ],
      [
        "Dışarıdan anlatıcı boşluğu başta söyleyince ne değişiyor?",
        [
          "Okur karakterden bir adım önce biliyor ve onun fark edişini izliyor.",
          "Okur fincanın gerçek sahibini kesinlikle öğreniyor.",
          "Olayın kurgu olduğuna dair açıklama kaldırılıyor.",
        ],
        "“ein kleiner Wissensvorsprung entsteht” okurun bilgi üstünlüğünü belirtir. Bir sonraki ifade de odağın nesnenin sırrından, karakterin geciken fark edişine kaydığını açıklar.",
      ],
      [],
      "Okurun bir adım önde olduğu sabah",
      [
        "Erzählerin",
        "die",
        "kadın anlatıcı",
        "Erzählerinnen",
        "Die Erzählerin benennt die Leere sofort.",
        "Anlatıcı boşluğu hemen adlandırıyor.",
      ],
    ],
  ];
  d.scenes = rows.map(([id, title, pairs, q, choices, ending, focus]) => ({
    id,
    title,
    lines: pairs.map(([de, tr]) => ({ de, tr })),
    question: {
      prompt: q[0],
      options: q[1],
      correctIndex: 0,
      explanation: q[2],
    },
    choices: choices.map(([de, tr]) => ({ de, tr })),
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
  }));
});
const quizzes = {
  "a1-einkauf": [
    [
      "Elimdeki listede neler yazıyor?",
      "Taze meyve ve sebzeler.",
      "Eski bir kitap.",
      "Bir sinema bileti.",
    ],
    ["Bugün elmanın kilosu ne kadar?", "İki avro.", "Üç avro.", "Dört avro."],
    ["Bir muz ne kadar?", "Elli sent.", "On avro.", "Bir avro."],
    [
      "Anlatıcı bu akşam aldıklarıyla ne hazırlıyor?",
      "Meyve salatası.",
      "Sebze çorbası.",
      "Soğuk sebze suyu.",
    ],
    [
      "Anlatıcı evde limonlarla ne yapıyor?",
      "İçecek hazırlamak için sıkıyor.",
      "Buzdolabına koyuyor.",
      "Masada resmini çiziyor.",
    ],
    [
      "İlk portakal nerede soyuluyor?",
      "Mutfakta.",
      "Pazarda.",
      "Oturma odasında.",
    ],
    [
      "Anlatıcı yolda üzümlerle ne yapıyor?",
      "Birkaç tatlı üzüm yiyor.",
      "Çöpe atıyor.",
      "Bir arkadaşına hediye ediyor.",
    ],
  ],
  "a2-schluessel": [
    [
      "Mavi anahtarlık önceki akşam nerede bulunmuş?",
      "Kütüphanenin önündeki taş zeminde.",
      "Karanlık okuma odasında, ahşap masanın altında.",
      "Büyük okulun girişinde.",
    ],
    [
      "Görevli, ofiste anlatıcının niyetini anlayınca nasıl tepki veriyor?",
      "Dostça gülümsüyor.",
      "Öfkeyle yardım istiyor.",
      "Cam kapıyı kapatıyor.",
    ],
    [
      "Bodrumdaki görevli ne yapıyor?",
      "Eski bir lambayı tamir ediyor.",
      "Sandalyede uyuyor.",
      "Mavi anahtarı arıyor.",
    ],
    [
      "Ertesi sabah anahtarı kim tanıyor?",
      "Teşekkür eden bir üniversite öğrencisi.",
      "Uzak bir mahalleden yaşlı bir polis.",
      "Sert bir kütüphane müdürü.",
    ],
    [
      "Anahtar, sahibine ulaşana kadar nerede saklanıyor?",
      "Resmî kayıt tutularak kayıp eşya bürosunda.",
      "Cam kapının yanındaki masada.",
      "Bodrumdaki karanlık atölyede.",
    ],
    [
      "Anahtar nereye yerleştiriliyor?",
      "Masanın çekmecesine.",
      "Girişteki duyuru panosuna.",
      "Lambanın içine.",
    ],
    [
      "Anlatıcı beklenmedik biçimde kiminle karşılaşıyor?",
      "Anahtarını arayan endişeli bir üniversite öğrencisiyle.",
      "Cam kapıda bekleyen sert bir polisle.",
      "Ofisteki görevliyle.",
    ],
  ],
  "a2-probetag": [
    [
      "Anlatıcı neden kütüphanede deneme günü geçiriyor?",
      "Orada mesleki eğitim almak istediği için.",
      "Yalnızca bir kitap ödünç almak için.",
      "Rastgele bir işte çalışması gerektiği için.",
    ],
    [
      "Yaşlı adam neden yardım istiyor?",
      "Çıkışı bulamadığı için.",
      "Bir tarih kitabını aradığı için.",
      "Üyelik başvurusu yapmak için.",
    ],
    [
      "Okuma köşesindeki masalarda neler bulunuyor?",
      "Renkli dergiler.",
      "Ağır sözlükler.",
      "Dizüstü bilgisayarlar.",
    ],
    [
      "Müdür, anlatıcının hangi becerisini övüyor?",
      "Bilgisayarı iyi kullanmasını.",
      "Bozulan cihazı tamir etmesini.",
      "Yazıcıyı temizlemesini.",
    ],
    [
      "Ebeveynler neden minnettar kalıyor?",
      "Çocuklara şeker verildiği için.",
      "Çocukları hikâyelere sakin biçimde bakabildiği için.",
      "Çıkış yolu tarif edildiği için.",
    ],
    [
      "Yaşlı okur sabah neye ihtiyaç duyduğunu söylüyor?",
      "Bir fincan kahveye.",
      "Bir dilim tatlı keke.",
      "Kendi yaptığı bir içeceğe.",
    ],
    [
      "Ressam neden dostça gülümsüyor?",
      "Çiçek çizmek istediği için.",
      "Aradığı kitabı bulduğu için.",
      "Anlatıcıya iş teklif edeceği için.",
    ],
  ],
  "a2-tauschregal": [
    [
      "Lena üst rafta ne buluyor?",
      "Romanlar.",
      "Dergiler.",
      "Hatıra eşyaları.",
    ],
    [
      "Takas rafına nasıl eşyalar bırakılabiliyor?",
      "Bozuk eşyalar.",
      "Temiz eşyalar.",
      "Ağır mobilyalar.",
    ],
    [
      "Anlatıcının dikkatini hangi kitap çekiyor?",
      "Manzara resimleri bulunan bir kitap.",
      "Bir şiir kitapçığı.",
      "Bir sözlük.",
    ],
    [
      "Kahve içmeye hangi komşu davet ediyor?",
      "Bayan Weber.",
      "Tanımadıkları bir adam.",
      "Postacı.",
    ],
    [
      "Not hangi araçla yazılıyor?",
      "Mavi tükenmez kalemle.",
      "Kırmızı kurşun kalemle.",
      "Kalın keçeli kalemle.",
    ],
    [
      "İskandinavya kitabı neden seçiliyor?",
      "Kuzeye seyahat etmek istendiği için.",
      "Akrabalar ziyaret edileceği için.",
      "Bir sınava hazırlanıldığı için.",
    ],
    [
      "Öğleden sonra ev hangi kokularla doluyor?",
      "Tarçın, un ve taze elma kokularıyla.",
      "Kahve kokusuyla.",
      "Sıcak ekmek ve tereyağı kokularıyla.",
    ],
  ],
  "b2-ausstellung": [
    [
      "Jonas sergi için nasıl bir sanat anlayışını savunuyor?",
      "Yalnızca soyut fotoğraflar.",
      "Yalnızca klasik resimler.",
      "Hiç görsel kullanılmaması.",
    ],
    [
      "Ortak salonda Jonas hangi işle ilgileniyor?",
      "Koyu duvarların aydınlatılmasıyla.",
      "Eser etiketleriyle.",
      "Afişle.",
    ],
    [
      "İki ayrı sergi odasının atmosferi nasıl farklılaşıyor?",
      "Jonas sade mobilya ve LED ışık, anlatıcı sıcak ahşap tercih ediyor.",
      "İkisi de aynı antika mobilyaları kullanıyor.",
      "İki odada da hiç mobilya bulunmuyor.",
    ],
    [
      "Başarılı açılış nerede kutlanıyor?",
      "Galerinin yanındaki sevdikleri parkta, kahve ve kekle.",
      "Diğer çalışanları dışlayan gösterişli bir ziyafette.",
      "Başka bir şehre tatile gidilerek.",
    ],
    [
      "Açıklama metinlerinin kullanılmaması nasıl bir etki yaratıyor?",
      "Ziyaretçilerin kendi yorumlarına alan açıyor.",
      "Ziyaretçiler şaşırdığı için salona hiç girmiyor.",
      "Eleştirmenler katalog yazmaya zorlanıyor.",
    ],
    [
      "Söyleşi nerede düzenleniyor?",
      "Galerinin giriş bölümünde.",
      "Şehir dışındaki sakin bir kafede.",
      "Arkadaki depoda.",
    ],
    [
      "Anlatıcının odasında nasıl bir müzik ve ışık kullanılıyor?",
      "Klasik keman müziği ve loş ışık.",
      "Yüksek sesli rock müziği.",
      "Çalgısız halk şarkıları.",
    ],
  ],
};
for (const [slug, rows] of Object.entries(quizzes))
  edit(slug, (d) =>
    d.scenes.forEach((s, i) => {
      s.question.prompt = rows[i][0];
      s.question.options = rows[i].slice(1);
    }),
  );
const headings = {
  "a1-blumenladen": [
    "Im Blumenladen",
    "Dükkândaki ilk sabah",
    "Kırmızı çiçekler",
    "Sarı çiçekler",
    "Özenli bir hediye",
    "Dostça bir konuşma",
    "Memnun bir müşteri",
    "Dükkânda çiçek bakımı",
  ],
  "a1-fensterbrett": [
    "Die Töpfe auf dem Fensterbrett",
    "Evdeki ilk gün",
    "Merdivenlerde sohbet",
    "Pencere önünde hazırlık",
    "Kahve ve yeni arkadaşlar",
    "Nazikçe vedalaşmak",
    "Avluda karşılaşma",
    "Evde sakin bir akşam",
  ],
  "a1-picknick": [
    "Das kleine Picknick",
    "Parkta yağmur",
    "Parktaki bank",
    "Sıcak bir kafe",
    "Bankta piknik",
    "Bahçede piknik",
    "Kafedeki mola",
    "Akşam için yeni plan",
  ],
  "a1-einkauf": [
    "Die Liste im Einkaufskorb",
    "Pazara giderken",
    "Elma tezgâhında",
    "Muz tezgâhında",
    "Armutlarla eve dönüş",
    "Limonlarla eve dönüş",
    "Tatlı portakallar",
    "Taze üzümler",
  ],
  "a2-backtag": [
    "Der Duft aus dem Ofen",
    "Fırından gelen sürpriz",
    "Maria’nın mutfağında",
    "Stefan’ın yanında",
    "Birlikte kahve",
    "Kısa bir ziyaret",
    "Kuruyemiş eşliğinde sohbet",
    "İşe geri dönmek",
  ],
  "a2-schluessel": [
    "Das Geheimnis des blauen Schlüssels",
    "Kütüphanenin önündeki buluntu",
    "Yönetim odasına doğru",
    "Görevliyi ararken",
    "Duyuru sahibine ulaşıyor",
    "Kayıp eşya teslimi",
    "Ofiste güvenli bir yer",
    "Birlikte kontrol turu",
  ],
  "a2-laterne": [
    "Die Laterne zeigt den Weg",
    "Bahçedeki parlak ışık",
    "Soldaki çiçekli patika",
    "Sağdaki çeşme yolu",
    "Ahşap kapı",
    "Kokulu otlar çayırı",
    "Göletin kıyısı",
    "Köşkteki buluşma",
  ],
  "a2-probetag": [
    "Ein Probetag in der Bibliothek",
    "Kütüphaneye hoş geldin",
    "Girişte yardım",
    "Okuma köşesini hazırlamak",
    "Yeni kütüphane kartları",
    "Çocuk bölümünde düzen",
    "Kahve kokusu",
    "Okuma köşesinde çiçekler",
  ],
  "a2-faehre": [
    "Eine kleine Fährfahrt",
    "Sabah yola çıkış",
    "Adanın bahçesi",
    "Balıkçı köyü",
    "Kokulu köşk",
    "Rengârenk çiçek pazarı",
    "Sakin mendirek",
    "Yüksek deniz feneri",
  ],
  "a2-tauschregal": [
    "Das Tauschregal im Viertel",
    "Köşedeki rafı keşfetmek",
    "Kurallar ve kendi katkın",
    "Raflarda küçük hazineler",
    "Açık havada sohbet",
    "Küçük öneri notu",
    "Kuzey yolculuğunun hayali",
    "Hafta sonu mutfakta",
  ],
  "b1-wochenmarkt": [
    "Die letzte Tomatenkiste",
    "Semt pazarında",
    "Kasayı paylaşmak",
    "Diğer dükkâna doğru",
    "Hızlı bir çorba",
    "Yanına taze ekmek",
    "Sade bir proje",
    "Otlarla lezzetlenen yemek",
  ],
  "b1-fotoalbum": [
    "Ein neuer Plan im alten Fotoalbum",
    "Eski albüm",
    "Parkta bir buluşma",
    "Telefonla konuşmak",
    "Parktaki sohbet",
    "Başka bir gün için haber",
    "Evde sıcak bir ziyaret",
    "Planı birlikte ertelemek",
  ],
  "b1-windpost": [
    "Das Windpostamt im Garten",
    "Gizemli mektup",
    "Arşiv görevlisiyle konuşma",
    "Herkese açık duyuru",
    "Büyük bahar şenliği",
    "Birlikte şarkı söylemek",
    "Yaratıcı el işi atölyesi",
    "Bahçedeki kutlama",
  ],
  "b1-umleitung": [
    "Die unerwartete Umleitung",
    "Yol kenarındaki levha",
    "Dik dağ patikası",
    "Uzun asfalt yol",
    "Yüksek düzlükte macera",
    "Yamaçtaki alternatif yol",
    "Çayırın çevresinden",
    "İşaretli alternatif rota",
  ],
  "b1-gartenfest": [
    "Das Frühlingsfest im Innenhof",
    "Avludaki hazırlık",
    "Dans alanında",
    "Rahat oturma köşesi",
    "Uzun dans gecesi",
    "Müziğe kısa mola",
    "Bahçede oyun akşamı",
    "Sohbetle geçen akşam",
  ],
  "b2-rezeptbuch": [
    "Das Familienrezeptbuch auf dem Dachboden",
    "Tavan arasındaki defter",
    "İlk tarifi korumak",
    "Tarifi yeniden yorumlamak",
    "Aile sofrası",
    "Mahalle için büyük sofra",
    "Dijital tarif günlüğü",
    "Birlikte yemek atölyesi",
  ],
  "b2-ausstellung": [
    "Zwei Freunde, eine Ausstellung",
    "Ortak sergi fikri",
    "Aynı salonda iki yaklaşım",
    "Yan yana iki ayrı oda",
    "Ortak katalogla açılış",
    "Görsellere alan açmak",
    "Söyleşide buluşmak",
    "Ayrı açılışlar",
  ],
  "b2-zeitgarten": [
    "Der verborgene Zeitgarten",
    "Yeşil labirente giriş",
    "Yosunlu dolambaç",
    "Parlayan köklerin yolu",
    "Sabrın sessizliği",
    "Gümüş damlaların sırrı",
    "Anların dansı",
    "Eski yazıtların bilgeliği",
  ],
  "b2-stadtteilzeitung": [
    "Die offene Seite der Stadtteilzeitung",
    "Mahalle gazetesinde toplantı",
    "Belgeleri incelemek",
    "Sakinlerle doğrudan görüşmek",
    "Bilgiyi düzelten haber",
    "Ayrıntılı başyazı",
    "Duygulara yer veren röportaj",
    "Açık görüşme",
  ],
  "b2-werkstattplan": [
    "Zwei Vorschläge in der Designwerkstatt",
    "Proje masasında karar",
    "Doğal malzemelerin yolu",
    "Dijital düzenlemenin yolu",
    "Yerel malzemelerle tamamlamak",
    "Özel malzemeyi beklemek",
    "Güncel cihazlara odaklanmak",
    "Eski cihazlara da ulaşmak",
  ],
  "b2-postkarte": [
    "Die Reise der verspäteten Postkarte",
    "Posta kutusundaki sır",
    "Tozlu arşivde",
    "Eski teslimat listeleri",
    "Ustanın evi",
    "Parkın yanındaki ev",
    "Telefon görüşmesi",
    "Eski depo",
  ],
  "c1-gemeinsamertext": [
    "Gemeinsam geschriebene Stille",
    "İlk taslak",
    "Sessizliği denemek",
    "Sözcüğün güveni",
    "Azaltmanın etkisi",
    "Tartışmadan sonra ayrı yollar",
    "Ortak metinde uzlaşmak",
    "Araya giren sessizlik",
  ],
  "c1-gartenarchiv": [
    "Das Rätsel im Gartenarchiv",
    "Eksik sayfayı fark etmek",
    "Yönetimle resmî inceleme",
    "Arşivde izleri araştırmak",
    "Katı soruşturmanın sonucu",
    "İç görüşmeyle açıklık",
    "Loş arşivde konuşmak",
    "Bulunan ek belge",
  ],
  "c1-nachtzug": [
    "Der Nachtzug nach Prag",
    "Karanlığa doğru hareket",
    "Kompartımanda sohbet",
    "Doğayı gözlemlemek",
    "Düşünceler üzerine konuşma",
    "Sessizce not almak",
    "Şiirde belirgin bir yön",
    "Uzun bir düşünme molası",
  ],
  "c1-uebersetzung": [
    "Zwei Bedeutungen am Übersetzungstisch",
    "Metindeki anlam belirsizliği",
    "Tarihî sözlükleri incelemek",
    "Küratöre sormak",
    "Kitap sonundaki sözlükçe",
    "Ana metne giren yorum",
    "Anlaşılır bir özet",
    "Farklı yorumlara açık dipnot",
  ],
  "c1-lesesaal": [
    "Der Lesesaal im Viertel",
    "Okuma salonunda tartışma",
    "Esnek bir düzen",
    "Sessizliği korumak",
    "Ses yalıtımını geliştirmek",
    "Güven ve karşılıklı anlayış",
    "Yan binadaki kafe",
    "Tutarlı sessizlik kuralları",
  ],
  "c1-sternenkarte": [
    "Eine Sternenkarte auf der Erde",
    "Saklı takımyıldızlarının bahçesi",
    "Kesin geometrinin yolu",
    "Belirsizliğin akışı",
    "Bilinmeyene bir adım",
    "Tamamlanan anıt",
    "Çok anlamlılığın şiiri",
    "Son sözü ararken",
  ],
  "c2-unausgesprochen": [
    "Nach dem unausgesprochenen Satz",
    "Açık kalan konuşma",
    "Parkta derinleşen sohbet",
    "Arşive geri dönüş",
    "Anlaşmanın sessizliği",
    "Yeni bir ortak metin",
    "Çözülen küçük bilmece",
    "Bilimsel bir yazı",
  ],
  "c2-namenhaus": [
    "Das Haus der wechselnden Namen",
    "Evin eşiğinde",
    "Hatıralar koridoru",
    "Gelecek düşlerinin salonu",
    "Sessiz hatıralar odası",
    "Altın yılların arşivi",
    "Geleceğin atölyesi",
    "İnsanlık bahçesi",
  ],
};
for (const [slug, [germanTitle, ...titles]] of Object.entries(headings))
  edit(slug, (d) => {
    d.germanTitle = germanTitle;
    d.scenes.forEach((s, i) => (s.title = titles[i]));
  });
edit("a1-einkauf", (d) => {
  scene(d, "start").lines[1] = {
    de: "Auf meinem Zettel stehen Obst und Gemüse für das Abendessen.",
    tr: "Listemde akşam yemeği için meyve ve sebze yazıyor.",
  };
  scene(d, "start").question.explanation =
    "“Obst und Gemüse” meyve ve sebze demektir. “Auf meinem Zettel” ifadesi bunların kâğıdın üzerinde yazdığını söyler; anlatıcı listesine bakarak alışveriş yapar.";
  for (const s of d.scenes)
    for (const l of s.lines)
      l.de = l.de.replaceAll("grossen", "großen").replaceAll("Gefäss", "Gefäß");
});
console.log("Public editorial corrections saved; learner records untouched.");
