// Original C2 situational comedy; no provider request or private input.
import { mkdirSync, writeFileSync } from "node:fs";
const scenes = [];
const focus = (word, article, meaning, plural, de, tr) => ({
  word,
  form: word,
  article,
  meaning,
  plural,
  de,
  tr,
});
function scene(id, title, lines, q, choices, ending, word) {
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
    focus: word,
  });
}
scene(
  "start",
  "Konuşmanın aradığı nokta",
  [
    [
      "Zehn Minuten vor der Vernissage hält die Gastgeberin ein ausgedrucktes Manuskript hoch und erklärt, ihrer Rede fehle noch der Schlusspunkt. Sofort beginnt ein Helfer, auf dem Boden nach einem verlorenen Satzzeichen zu suchen.",
      "Sergi açılışından on dakika önce ev sahibi basılmış konuşma metnini kaldırıp konuşmasının son noktasının eksik olduğunu söyler. Bir yardımcı hemen yerde kaybolmuş bir noktalama işareti aramaya başlar.",
    ],
    [
      "Du begreifst rasch, dass sie keine herausgefallene Druckerschwärze meint, sondern einen passenden Abschluss. Dass ausgerechnet die letzte Seite tatsächlich ohne Punkt endet, macht die sprachliche Verwechslung allerdings überraschend anschlussfähig.",
      "Onun kâğıttan düşmüş bir mürekkep parçasını değil, uygun bir kapanışı kastettiğini çabucak anlarsın. Ama tam da son sayfanın gerçekten noktasız bitmesi, dilsel karışıklığın beklenmedik biçimde sürmesine olanak verir.",
    ],
    [
      "Die Künstlerin hört amüsiert zu und weist auf ein Bild hin, das ausschließlich aus kleinen Farbflecken besteht. An Punkten mangele es heute offenbar nicht; ungeklärt sei lediglich, welcher von ihnen eine Rede beenden könne.",
      "Sanatçı eğlenerek dinler ve yalnızca küçük renk lekelerinden oluşan bir resmi gösterir. Bugün görünüşe göre nokta sıkıntısı yoktur; belirsiz olan, bunlardan hangisinin bir konuşmayı bitirebileceğidir.",
    ],
    [
      "Du kannst mit der Gastgeberin einen verständlichen letzten Gedanken formulieren oder zunächst mit dem Helfer klären, was auf der abgeschnitten wirkenden Seite tatsächlich fehlt. Niemand muss dafür in privaten Unterlagen stöbern.",
      "Ev sahibiyle anlaşılır bir son düşünce oluşturabilir veya önce yardımcıyla, kesilmiş gibi duran sayfada gerçekte neyin eksik olduğunu açıklığa kavuşturabilirsin. Bunun için hiç kimsenin özel belgeleri karıştırması gerekmez.",
    ],
  ],
  [
    "Başlangıçtaki karışıklık hangi iki anlam arasında doğuyor?",
    [
      "Konuşmanın uygun kapanışı ile basılı noktalama işareti arasında.",
      "Kaybolan bir resim ile satılan bir resim arasında.",
      "Açılış günü ile kapanış günü arasında.",
    ],
    "“keine herausgefallene Druckerschwärze” ifadesi arananın fiziksel bir işaret olmadığını belirtir. Ardındaki “sondern einen passenden Abschluss” gerçek isteği açıklayarak iki anlamı ayırır.",
  ],
  [
    [
      "Ich formuliere mit der Gastgeberin einen letzten Gedanken.",
      "Ev sahibiyle son düşünceyi oluştururum.",
    ],
    [
      "Ich prüfe mit dem Helfer die unvollständig wirkende Seite.",
      "Yardımcıyla eksik görünen sayfayı incelerim.",
    ],
  ],
  null,
  focus(
    "Schlusspunkt",
    "der",
    "son nokta; kapanış",
    "Schlusspunkte",
    "Der Schlusspunkt kann ein Zeichen oder ein Abschluss sein.",
    "Son nokta bir işaret veya bir kapanış olabilir.",
  ),
);
scene(
  "path-a",
  "Söylenmesi gerekmeyen ara",
  [
    [
      "Ihr lest den letzten Absatz gemeinsam und bemerkt zwischen zwei Sätzen das Wort Pause in einer anderen Schriftart. Die Gastgeberin gesteht lachend, sie hätte es vor lauter Aufregung beinahe mit vorgelesen.",
      "Son paragrafı birlikte okuyup iki cümle arasında farklı yazı tipindeki Ara sözcüğünü fark edersiniz. Ev sahibi, heyecandan neredeyse onu da sesli okuyacağını gülerek itiraf eder.",
    ],
    [
      "Die Pause war als stille Regieanweisung gedacht, während der folgende Satz bereits den eigentlichen Abschied vom Rednerpult enthält. Ein zusätzlicher feierlicher Schluss würde die Rede eher verlängern, als ihr Klarheit zu geben.",
      "Ara, sessiz bir sahne yönergesi olarak düşünülmüştür; onu izleyen cümle ise konuşma kürsüsüne asıl vedayı zaten içerir. Gösterişli bir kapanış eklemek, konuşmaya açıklık kazandırmaktan çok onu uzatacaktır.",
    ],
    [
      "Die Künstlerin schlägt vor, den Text bis zu diesem einfachen Satz zu kürzen. Ein Gast regt dagegen an, die kleine Verwechslung offen zu erzählen und anschließend das Publikum freiwillig einen Titel für den Abend sammeln zu lassen.",
      "Sanatçı metni bu basit cümleye kadar kısaltmayı önerir. Bir konuk ise küçük karışıklığın açıkça anlatılmasını ve ardından isteyen izleyicilerden akşam için başlık önerileri toplanmasını düşünür.",
    ],
    [
      "Beide Wege können die gespannte Situation lösen, verlangen aber unterschiedliche Formen der Beteiligung. Du entscheidest dich entweder für den klaren Abschluss oder für eine ausdrücklich freiwillige, kurze Öffnung zum Saal.",
      "İki yol da gerginliği azaltabilir ama farklı katılım biçimleri gerektirir. Ya açık bir kapanışı ya da salondakilere açıkça gönüllü olduğu belirtilen kısa bir katılım alanı açmayı seçersin.",
    ],
  ],
  [
    "Metindeki Ara sözcüğünün başlangıçtaki işlevi nedir?",
    [
      "Sesli okunmayacak bir sahne yönergesi olması.",
      "Konuşmanın konusu olan bir tabloya ad vermesi.",
      "İzleyicileri salondan çıkarması.",
    ],
    "“als stille Regieanweisung gedacht” sözleri, sözcüğün konuşmacıya yönelik olduğunu gösterir. Ev sahibinin onu neredeyse sesli okuyacağını söylemesi de komik karışıklığı açıklar.",
  ],
  [
    [
      "Wir kürzen die Rede bis zum klaren Abschlusssatz.",
      "Konuşmayı açık kapanış cümlesine kadar kısaltırız.",
    ],
    [
      "Wir erzählen die Verwechslung und laden zu freiwilligen Titeln ein.",
      "Karışıklığı anlatıp isteyenleri başlık önermeye davet ederiz.",
    ],
  ],
  null,
  focus(
    "Pause",
    "die",
    "ara; duraklama",
    "Pausen",
    "Die Pause wird gespielt und nicht vorgelesen.",
    "Ara, sesli okunmaz; uygulanır.",
  ),
);
scene(
  "path-b",
  "Yazıcının masumiyeti",
  [
    [
      "Der Helfer legt den freigegebenen Entwurf neben das Manuskript und stellt fest, dass kein Wort verloren gegangen ist. Lediglich der abschließende Punkt wurde beim Kopieren in die nächste Zeile verschoben und anschließend abgeschnitten.",
      "Yardımcı, paylaşımına izin verilen taslağı konuşma metninin yanına koyar ve hiçbir sözcüğün kaybolmadığını görür. Yalnızca son nokta kopyalama sırasında sonraki satıra kaymış, ardından kesilmiştir.",
    ],
    [
      "Damit ist der technische Teil des Rätsels kleiner als die entstandene Aufregung. Der Entwurf enthält zugleich die knappe Bemerkung: Jetzt dürfen die Bilder sprechen, die keines weiteren feierlichen Absatzes bedarf.",
      "Böylece bilmecenin teknik bölümü, ortaya çıkan telaştan daha küçük çıkar. Taslakta ayrıca, başka gösterişli bir paragraf gerektirmeyen şu kısa söz bulunur: Şimdi resimler konuşabilir.",
    ],
    [
      "Die Gastgeberin möchte entweder den Punkt schlicht ergänzen und beim ursprünglichen Text bleiben oder die freiwilligen Helfenden mit einer gemeinsam entworfenen Miniatur über gesprochene und ungesprochene Anweisungen eröffnen lassen.",
      "Ev sahibi ya noktayı basitçe ekleyip ilk metne bağlı kalmak ya da açılışı, gönüllü yardımcıların söylenen ve söylenmeyen yönergeler üzerine birlikte hazırladığı küçük bir sahneyle yapmak ister.",
    ],
    [
      "Du fragst zuerst, wer tatsächlich mitwirken möchte; niemand wird ungefragt zur komischen Figur erklärt. Anschließend könnt ihr den Druck korrigieren oder aus dem Missverständnis ein klar gekennzeichnetes gemeinsames Spiel machen.",
      "Önce gerçekten kimlerin katılmak istediğini sorarsın; hiç kimse kendisine sorulmadan komik karakter ilan edilmez. Sonra baskıyı düzeltebilir veya yanlış anlamadan, ortak oyun olduğu açıkça belirtilen bir sahne oluşturabilirsiniz.",
    ],
  ],
  [
    "Taslakla karşılaştırma sonucunda ne anlaşılıyor?",
    [
      "Sözcüklerin değil, son noktanın kesildiği.",
      "Konuşmanın tamamının kaybolduğu.",
      "Bir tablonun yanlışlıkla yazdırıldığı.",
    ],
    "“kein Wort verloren gegangen” sözcük kaybını reddeder. “Lediglich der abschließende Punkt” ise baskıda eksilen öğenin yalnızca son nokta olduğunu açıklar.",
  ],
  [
    [
      "Wir ergänzen den Punkt und behalten den ursprünglichen Text.",
      "Noktayı ekleyip ilk metni koruruz.",
    ],
    [
      "Wir eröffnen gemeinsam mit einer freiwilligen kleinen Szene.",
      "Açılışı gönüllü küçük bir sahneyle birlikte yaparız.",
    ],
  ],
  null,
  focus(
    "Entwurf",
    "der",
    "taslak",
    "Entwürfe",
    "Der Entwurf enthält bereits einen vollständigen Schluss.",
    "Taslakta zaten eksiksiz bir kapanış bulunuyor.",
  ),
);
scene(
  "end-a1",
  "Kısa cümlenin uzun etkisi",
  [
    [
      "Ihr streicht die überflüssigen Anläufe zum Schluss und lasst einen einzigen Satz stehen: Jetzt dürfen die Bilder sprechen. Die Gastgeberin markiert die vorherige Stille deutlich, damit diesmal kein gedrucktes Pause durchs Mikrofon wandert.",
      "Sona ulaşmak için eklenmiş gereksiz girişleri çıkarıp tek bir cümle bırakırsınız: Şimdi resimler konuşabilir. Ev sahibi, bu kez basılı Ara sözcüğü mikrofona gitmesin diye önceki sessizliği belirgin biçimde işaretler.",
    ],
    [
      "Als sie den Satz tatsächlich beendet, wartet der Saal einen Moment, als rechne er noch mit einer Erklärung des Beendens. Dann lächelt die Künstlerin und tritt vom Pult zu den Bildern hinüber.",
      "Cümleyi gerçekten bitirdiğinde salon, sanki bitirmenin açıklamasını da bekliyormuş gibi bir an durur. Sonra sanatçı gülümseyip kürsüden resimlerin yanına geçer.",
    ],
    [
      "Das kurze Lachen, das daraufhin entsteht, richtet sich nicht gegen die unsichere Gastgeberin. Es gilt der gemeinsam erkannten Gewohnheit, einer gelungenen Schlussformel sicherheitshalber noch einen Schluss hinterherzuschicken.",
      "Ardından gelen kısa gülüş, heyecanlı ev sahibini hedef almaz. Hep birlikte fark edilen, başarılı bir kapanış sözünün arkasına ne olur ne olmaz bir kapanış daha ekleme alışkanlığına yönelir.",
    ],
    [
      "Die Gespräche verteilen sich im Raum, und niemand vermisst den gestrichenen Absatz. Der Satz hat die Rede nicht spektakulärer gemacht, sondern ihr ermöglicht, im richtigen Augenblick Platz für etwas anderes zu lassen.",
      "Sohbetler salona yayılır ve hiç kimse çıkarılmış paragrafı aramaz. Cümle, konuşmayı daha gösterişli yapmamış; doğru anda başka bir şeye yer bırakmasını sağlamıştır.",
    ],
  ],
  [
    "Bu sonda gülüşün yöneldiği şey nedir?",
    [
      "Bir kapanışın arkasına bir kapanış daha ekleme alışkanlığı.",
      "Ev sahibinin kişiliği veya kimliği.",
      "Sanatçının tablolarının değersizliği.",
    ],
    "“nicht gegen die unsichere Gastgeberin” kişiyi hedef almayı açıkça reddeder. Sonraki cümle, ortaklaşa fark edilen kapanışı uzatma alışkanlığının komik bulunduğunu söyler.",
  ],
  [],
  "Gerçekten biten açılış konuşması",
  focus(
    "Satz",
    "der",
    "cümle",
    "Sätze",
    "Ein klarer Satz kann einen langen Absatz ersetzen.",
    "Açık bir cümle uzun bir paragrafın yerini tutabilir.",
  ),
);
scene(
  "end-a2",
  "Başlığını birlikte bulan akşam",
  [
    [
      "Die Gastgeberin erzählt die Verwechslung so, dass sie selbst Teil des kleinen Durcheinanders bleibt, statt dem Helfer eine unfreiwillige Rolle zuzuschieben. Das Publikum darf anschließend Vorschläge für einen zusätzlichen Titel des Abends machen.",
      "Ev sahibi karışıklığı, yardımcıya istemediği bir rol yüklemek yerine kendisi de küçük telaşın parçası olarak kalacak biçimde anlatır. Ardından izleyiciler akşamın ek başlığı için öneriler sunabilir.",
    ],
    [
      "Ein Gast bietet an: Viele Punkte, kein Punkt. Eine andere Stimme schlägt vor, gar keinen weiteren Titel hinzuzufügen, weil die ursprüngliche Ausstellung bereits einen eigenen Namen hat. Beide Beiträge werden mit demselben freundlichen Interesse aufgenommen.",
      "Bir konuk Çok nokta, hiç nokta yok başlığını önerir. Başka biri, serginin zaten kendi adı bulunduğu için ek başlık koymamayı teklif eder. İki katkı da aynı dostça ilgiyle karşılanır.",
    ],
    [
      "Die Vorschläge bleiben eine spielerische Zugabe und werden nicht als gemeinsame Meinung des gesamten Publikums ausgegeben. Wer lieber nur zuhört, muss weder abstimmen noch eine eigene Pointe erfinden.",
      "Öneriler oyunsu bir ek olarak kalır; bütün izleyicilerin ortak görüşü gibi sunulmaz. Sadece dinlemeyi tercih eden kişi ne oy vermek ne de kendi esprisini bulmak zorundadır.",
    ],
    [
      "Am Ende hängt eine kleine Karte mit den freiwillig freigegebenen Vorschlägen neben dem Eingang. Die Bilder behalten ihren Platz, während aus der verlorenen Gewissheit ein freundliches Gespräch über Sprache geworden ist.",
      "Sonunda girişin yanında, gönüllü olarak paylaşılmasına izin verilen önerilerin yazılı olduğu küçük bir kart asılıdır. Resimler yerlerinde kalırken kaybolan kesinlik, dil üzerine dostça bir sohbete dönüşmüştür.",
    ],
  ],
  [
    "İzleyici önerileri hangi sınırla sunuluyor?",
    [
      "Bütün salonun zorunlu ortak görüşü sayılmadan.",
      "Herkesin mutlaka oy vermesi şartıyla.",
      "Serginin resmî adını otomatik silerek.",
    ],
    "“nicht als gemeinsame Meinung des gesamten Publikums” ifadesi önerilerin bütün izleyicilere mal edilmediğini gösterir. Dinlemeyi seçenlerin katılma zorunluluğu olmadığı da belirtilir.",
  ],
  [],
  "Gönüllü başlıkların küçük galerisi",
  focus(
    "Publikum",
    "das",
    "izleyiciler; seyirci topluluğu",
    "",
    "Das Publikum darf zuhören, ohne einen Vorschlag zu machen.",
    "İzleyiciler öneri sunmadan da dinleyebilir.",
  ),
);
scene(
  "end-b1",
  "Tek noktalık büyük kurtarma",
  [
    [
      "Der Helfer ergänzt mit einem Stift den fehlenden Punkt und hält das Blatt mit gespieltem Ernst wie ein aufwendig restauriertes Kunstwerk hoch. Die Gastgeberin bedankt sich ebenso feierlich für die Rettung eines ganzen Satzes durch ein einziges Zeichen.",
      "Yardımcı eksik noktayı kalemle ekleyip sayfayı büyük emekle onarılmış bir sanat eseriymiş gibi yapmacık bir ciddiyetle kaldırır. Ev sahibi de tek bir işaretle bütün bir cümlenin kurtarılması için aynı gösterişli ciddiyetle teşekkür eder.",
    ],
    [
      "Beide haben diese kleine Übertreibung vorher miteinander abgesprochen; der Helfer wird nicht zum Objekt eines Witzes gemacht, den er erst vor dem Publikum verstehen muss. Anschließend beginnt die Gastgeberin mit ihrem unveränderten Text.",
      "İkisi bu küçük abartıyı önceden birlikte kararlaştırmıştır; yardımcı, anlamını ancak izleyicilerin önünde öğreneceği bir esprinin nesnesi yapılmaz. Ardından ev sahibi değişmemiş konuşma metnine başlar.",
    ],
    [
      "Als sie beim Schlusssatz ankommt, setzt sie eine kurze, hörbare Zäsur und schaut einmal zu dem Helfer hinüber. Mehr braucht es nicht, damit die Anwesenden die doppelte Bedeutung des geretteten Punktes wiedererkennen.",
      "Kapanış cümlesine geldiğinde kısa ve duyulur bir duraklama yapıp yardımcıya bakar. Oradakilerin kurtarılan noktanın iki anlamını yeniden tanıması için fazlası gerekmez.",
    ],
    [
      "Die Ausstellung wird eröffnet, ohne dass aus einer Panne ein großes Spektakel werden muss. Der winzige Punkt bleibt später auf dem Manuskript sichtbar, während die übergroße Rettungsfeier allen als freundlicher Moment in Erinnerung bleibt.",
      "Bir aksaklık büyük bir gösteriye dönüştürülmeden sergi açılır. Küçük nokta daha sonra metnin üzerinde görünür kalırken, abartılı kurtarma töreni herkesin aklında dostça bir an olarak yer eder.",
    ],
  ],
  [
    "Küçük esprinin yardımcıyı zor durumda bırakmamasını ne sağlıyor?",
    [
      "Abartılı sahnenin önceden birlikte kararlaştırılması.",
      "Yardımcının espriyi ilk kez sahnede öğrenmesi.",
      "Aksaklığın herkesin önünde ona yüklenmesi.",
    ],
    "“vorher miteinander abgesprochen” esprinin önceden ortaklaştırıldığını belirtir. Sonraki açıklama, yardımcının habersiz bir şakanın nesnesi yapılmadığını özellikle vurgular.",
  ],
  [],
  "Bir işaretle kurtarılan tören",
  focus(
    "Punkt",
    "der",
    "nokta; temel konu",
    "Punkte",
    "Der Punkt kann ein Satzzeichen und zugleich eine Pointe sein.",
    "Nokta hem bir noktalama işareti hem de bir esprinin odağı olabilir.",
  ),
);
scene(
  "end-b2",
  "Yönerge sahneye çıkınca",
  [
    [
      "Die freiwilligen Helfenden entwerfen eine einminütige Szene, in der jemand das Wort Pause vorliest, während alle anderen demonstrativ weitersprechen. Erst als die gedruckte Regieanweisung wortlos hochgehalten wird, entsteht die angekündigte Stille.",
      "Gönüllü yardımcılar bir dakikalık bir sahne hazırlar: Biri Ara sözcüğünü okurken diğerleri gösterişli biçimde konuşmayı sürdürür. Ancak basılı yönerge sessizce kaldırıldığında duyurulan sessizlik oluşur.",
    ],
    [
      "Die Regieanweisung wird damit weder lächerlich gemacht noch als grundsätzlich überflüssig verworfen. Komisch ist vielmehr der Unterschied zwischen dem Benennen einer Handlung und ihrem tatsächlichen Vollzug, den die Gruppe absichtlich auseinanderzieht.",
      "Böylece sahne yönergesi ne alaya alınır ne de temelden gereksiz sayılır. Komik olan, grubun bilerek birbirinden ayırdığı, bir eylemi adlandırmakla onu gerçekten yapmak arasındaki farktır.",
    ],
    [
      "Die Gastgeberin stellt die kleine Szene als gemeinsame Arbeit der Beteiligten vor und schließt mit dem ursprünglichen Satz über die sprechenden Bilder. Die Verwechslung ersetzt die Ausstellung nicht, sondern öffnet einen kurzen Weg zu ihr.",
      "Ev sahibi küçük sahneyi katılanların ortak çalışması olarak tanıtır ve konuşan resimlerle ilgili ilk cümleyle bitirir. Karışıklık serginin yerini almaz; ona giden kısa bir yol açar.",
    ],
    [
      "Nachher erzählt jeder die Pointe ein wenig anders, doch niemand behauptet, die spontane Nummer sei von Anfang an so geplant gewesen. Dass etwas gemeinsam gelungen ist, verlangt hier keine nachträglich erfundene perfekte Vorbereitung.",
      "Sonrasında herkes espriyi biraz farklı anlatır ama hiç kimse bu doğaçlama gösterinin en baştan böyle planlandığını iddia etmez. Bir şeyin birlikte başarılması, sonradan uydurulmuş kusursuz bir hazırlık öyküsü gerektirmez.",
    ],
  ],
  [
    "Sahnenin temel mizahı hangi ayrımdan doğuyor?",
    [
      "Bir eylemin adını söylemekle onu gerçekten yapmak arasındaki farktan.",
      "Sahne yönergelerinin her zaman gereksiz olmasından.",
      "Gönüllülerin habersiz biçimde alaya alınmasından.",
    ],
    "“Benennen einer Handlung” ile “tatsächlichen Vollzug” arasındaki fark açıkça belirtilir. Yönergenin gereksiz sayılmadığı da söylenerek mizahın hedefi sınırlandırılır.",
  ],
  [],
  "Ara sözcüğünün oynadığı rol",
  focus(
    "Regieanweisung",
    "die",
    "sahne yönergesi",
    "Regieanweisungen",
    "Die Regieanweisung beschreibt eine Handlung auf der Bühne.",
    "Sahne yönergesi sahnede yapılacak bir eylemi açıklar.",
  ),
);
const draft = {
  germanTitle: "Der verschwundene Punkt der Eröffnungsrede",
  description:
    "Bir açılış konuşmasında nokta, ana fikir ve sahne yönergesi birbirine karışır. Dört farklı sonla dilin çok anlamlılığını, abartıyı ve katılımın sınırlarını keşfet.",
  scenes,
};
mkdirSync(".cache/story-library-drafts", { recursive: true });
writeFileSync(
  ".cache/story-library-drafts/story-library-c2-vernissage.json",
  JSON.stringify({ model: "editorial-original", draft }, null, 2) + "\n",
);
console.log("Original C2 comedy saved without a provider request.");
