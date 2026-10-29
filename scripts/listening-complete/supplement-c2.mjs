const lessons = [
  {
    level: "C2",
    id: "listen-c2-germany-public",
    title: "Kamusal dil ve katılım",
    german: "Verständlich für wen?",
    category: "germany",
    goal: "Kamusal açıklamada sadelik, ayrıntı ve temsil iddialarının sınırını izle.",
    lines: [
      [
        "In einer fiktiven Stadtverwaltung wird eine neue Informationsbroschüre diskutiert. Der Auftrag, verständlicher zu schreiben, scheint zunächst unumstritten; erst bei der Frage nach der angenommenen Leserschaft treten Unterschiede hervor.",
        "Kurgusal belediyede yeni bilgi broşürü tartışılıyor. Daha anlaşılır yazma hedefi başta tartışmasız görünürken varsayılan okur sorusunda farklar ortaya çıkıyor.",
      ],
      [
        "Ein Beteiligter setzt Verständlichkeit mit möglichst kurzen Sätzen gleich. Eine Kollegin wendet ein, dass Kürze zwar helfen könne, ausgelassene Bedingungen aber gerade diejenigen benachteiligten, die den institutionellen Hintergrund nicht kennen.",
        "Biri anlaşılabilirliği en kısa cümlelerle eşitliyor. Diğeri kısalığın yararlı olabileceğini ama atlanan koşulların özellikle kurum arka planını bilmeyenleri dezavantajlı kıldığını söylüyor.",
      ],
      [
        "Vorgeschlagen wird deshalb eine gestufte Darstellung: eine übersichtliche Orientierung und daneben gut auffindbare Einzelheiten. Die Ebenen sollen einander ergänzen, nicht durch widersprüchliche Angaben verschiedene Wirklichkeiten schaffen.",
        "Bu yüzden katmanlı anlatım öneriliyor: Açık genel yönlendirme ve kolay bulunan ayrıntı. Katmanlar çelişen bilgilerle farklı gerçeklikler değil birbirini tamamlamalı.",
      ],
      [
        "Beim Test wird nicht nur gefragt, ob die Texte angenehm wirken. Die Teilnehmenden sollen anhand konkreter Aufgaben zeigen können, welche Information sie finden und an welcher Stelle eine Voraussetzung unklar bleibt.",
        "Denemede metinlerin hoş görünmesiyle yetinilmiyor. Katılımcılar somut görevlerle hangi bilgiyi bulduklarını ve hangi koşulun belirsiz kaldığını gösterecek.",
      ],
      [
        "Die Rückmeldungen gelten dabei nicht als Stimme aller Einwohner. Sie machen bestimmte Hindernisse sichtbar; ob andere Gruppen ähnliche oder zusätzliche Schwierigkeiten haben, bleibt eine eigene Frage.",
        "Geri bildirimler tüm sakinlerin sesi sayılmıyor. Bazı engelleri görünür kılıyor; diğer grupların benzer veya ek güçlükleri ayrı soru olarak kalıyor.",
      ],
      [
        "Verständliche Sprache erscheint am Ende weder als bloße Vereinfachung noch als Ersatz für sachliche Genauigkeit. Sie wird als Gestaltung von Zugängen verstanden, deren Erfolg an tatsächlichen Verständnismöglichkeiten zu prüfen ist.",
        "Sonunda anlaşılır dil ne salt basitleştirme ne olgusal kesinliğin yerine geçen şey. Başarısı gerçek anlama olanaklarında sınanacak erişim tasarımı sayılıyor.",
      ],
    ],
    checks: [
      [
        "Salt kısalık neden eleştiriliyor?",
        "Koşulların atılması anlamayı zedeleyebilir",
        "Uzun cümle her zaman iyidir",
        "Okurun hiçbir bilgiye ihtiyacı yoktur",
        "Kısa metin gerekli koşulu kaybederse özellikle arka planı bilmeyeni zorlayabilir. İtiraz kısalığın tümüyle değersizliği değildir.",
      ],
      [
        "Katmanlar arasındaki gereklilik?",
        "Tamamlayıcı ve tutarlı bilgi",
        "Birbiriyle çelişen kurallar",
        "Ayrıntının tamamen gizlenmesi",
        "Genel yönlendirme ve ayrıntı erişilebilir biçimde tamamlanır. İki katman farklı gerçekler oluşturmak için kullanılmaz.",
      ],
      [
        "Test hangi ek yöntemi istiyor?",
        "Somut bilgi bulma görevlerini",
        "Yalnız estetik beğeniyi",
        "Kurumun kendi kendini onaylamasını",
        "Hoş görünmek gerçek bilgi bulmayla eşit değildir. Görevler belirsizliğin yerini gözlenebilir hâle getirmeyi amaçlar.",
      ],
      [
        "Geri bildirimlerin sınırı ne?",
        "Bütün sakinleri otomatik temsil etmez",
        "Hiç engel gösteremez",
        "Her başka grubun aynı olduğunu kanıtlar",
        "Belirli engelleri görünür kılan örneklem bütün kent adına konuşmaz. Diğer grupların koşulları ayrıca araştırılmalıdır.",
      ],
    ],
    focus: [
      [
        0,
        "erst",
        "schon immer",
        "niemals",
        "erst burada farkların hangi aşamada belirdiğini sınırlar. Başta ortak görünen hedef, okur varsayımında ayrışır.",
      ],
      [
        1,
        "zwar",
        "weil",
        "ob",
        "zwar ... aber kısa cümlenin yararını kabul edip sınırını ekler. Kısalıkla bütün koşulları silmek eşitlenmez.",
      ],
      [
        3,
        "anhand",
        "anstatt",
        "ungeachtet",
        "anhand somut görevleri değerlendirme aracı olarak gösterir. Görevlerin yerine veya onlara rağmen ölçüm yapılmıyor.",
      ],
      [
        5,
        "deren",
        "dessen",
        "denen",
        "Çoğul Zugänge'ye ait başarı deren Erfolg ile bağlanır. Erfolg tekil olsa da ilgi zamiri bağlı önceki çoğul ismi izler.",
      ],
    ],
  },
  {
    level: "C2",
    id: "listen-c2-travel-perspective",
    title: "Yol anlatısında bakış açısı",
    german: "Ein Ort zwischen Besuch und Alltag",
    category: "travel",
    goal: "Seyahat anlatısındaki ziyaretçi bakışını yerel deneyimle eşitlemeden dinle.",
    lines: [
      [
        "Eine fiktive Reisesendung beginnt mit dem Satz, in einem kleinen Hafenort sei die Zeit stehen geblieben. Das Bild klingt einprägsam, beschreibt aber zunächst die Wahrnehmung einer Person, die nur wenige Tage dort verbringt.",
        "Kurgusal gezi programı küçük liman kasabasında zaman durmuş cümlesiyle başlıyor. Akılda kalıcı imge önce yalnız birkaç gün kalan kişinin algısını anlatıyor.",
      ],
      [
        "Eine Bewohnerin widerspricht nicht der Schönheit des Ortes, wohl aber der Vorstellung unveränderter Lebensverhältnisse. Ihre Arbeitswege, steigende Belastungen und saisonale Umstellungen passen nicht in das Bild zeitloser Ruhe.",
        "Bir sakin yerin güzelliğine değil, yaşamın değişmediği fikrine itiraz ediyor. İş yolları, artan yükler ve mevsimsel değişimler zamansız huzur imgesine sığmıyor.",
      ],
      [
        "Die Reisende erkennt, dass ihr Ausruhen auf Abläufen beruht, die für andere Arbeit bedeuten. Daraus folgt weder, dass Erholung verwerflich ist, noch, dass ihre Beschreibung wertlos wäre; ihr Geltungsanspruch wird begrenzt.",
        "Gezgin dinlenmesinin başkaları için iş olan süreçlere dayandığını fark ediyor. Bu dinlenmenin kötü ya da betimlemenin değersiz olduğunu değil, iddianın sınırlandığını gösteriyor.",
      ],
      [
        "Für die überarbeitete Sendung werden deshalb unterschiedliche Tagesabläufe nebeneinandergestellt. Die Beiträge sollen sich nicht zu einer angeblich vollständigen Ortsbeschreibung addieren, sondern die Verschiedenheit der Blickrichtungen sichtbar machen.",
        "Yenilenen programda farklı günlük düzenler yan yana konuyor. Sözde tam kasaba betimlemesi oluşturmak değil, bakışların farklılığını göstermek amaçlanıyor.",
      ],
      [
        "Auch praktische Angaben bleiben ausdrücklich datiert. Die Erfahrung eines gelungenen Anschlusses im vergangenen Sommer wird nicht in eine zeitlich unbegrenzte Zusage für künftige Reisende umgeschrieben.",
        "Pratik bilgiler de tarihli kalıyor. Geçen yaz başarılı aktarma deneyimi gelecek yolculara süresiz güvenceye dönüştürülmüyor.",
      ],
      [
        "Die Sendung endet mit einer offeneren Einladung: den Ort zu besuchen und zugleich zuzuhören, was der eigene kurze Aufenthalt nicht erschließt. Interesse zeigt sich hier auch darin, den Grenzen der eigenen Erzählung Raum zu lassen.",
        "Program daha açık davetle bitiyor: Yeri gezmek ve kısa ziyaretin açamadığı şeyleri de dinlemek. İlgi kendi anlatısının sınırlarına yer vermekle de gösteriliyor.",
      ],
    ],
    checks: [
      [
        "Zaman durmuş imgesi önce neyi yansıtıyor?",
        "Kısa süreli ziyaretçinin algısını",
        "Kasabanın eksiksiz sosyolojik kaydını",
        "Her sakinin aynı görüşünü",
        "İmge akılda kalıcı olsa da kısa ziyaret bakışıdır. Program bunu tüm yaşam koşullarına sınırsız açıklama yapmaz.",
      ],
      [
        "Sakinin itirazı neye?",
        "Yaşamın değişmediği varsayımına",
        "Yerin güzel bulunmasına",
        "Her tür dinlenmeye",
        "nicht ... wohl aber ayrımı itirazın hedefini sınırlar. Güzelliği kabul etmek değişmez yaşam iddiasını kabul etmek değildir.",
      ],
      [
        "Yeni programın çokluğu ne amaçlıyor?",
        "Bakış farklarını görünür kılmak",
        "Eksiksiz tek kasaba hükmü vermek",
        "Bütün deneyimleri değersiz saymak",
        "Yan yana günlük akışlar tamamlanmış tek gerçeklik diye toplanmaz. Farklı konumların gördükleri açılır.",
      ],
      [
        "Geçen yazın bağlantı deneyimi ne değildir?",
        "Gelecek için süresiz garanti",
        "Bir geçmiş deneyim",
        "Tarihli bir anlatı öğesi",
        "Tarihli başarı gelecekte değişmeyecek hizmet sözü değildir. Deneyimi tarife ve garantiye dönüştürmeme sınırı korunur.",
      ],
    ],
    focus: [
      [
        0,
        "sei",
        "seien",
        "seiet",
        "Tekil Zeit ile sei aktarılmış imgeyi kurar. Kip bu metaforu bağımsız doğrulanmış fiziksel olgu yapmaz.",
      ],
      [
        1,
        "wohl aber",
        "überhaupt nicht",
        "niemals wieder",
        "wohl aber önceki nicht ile itirazın gerçek hedefini belirginleştirir. Yerin güzelliği değil değişmezlik fikri eleştiriliyor.",
      ],
      [
        3,
        "sondern",
        "denn",
        "oder",
        "nicht ... sondern programın amacını sınırlar. Farklı bakışları göstermek tam ve nihai yer tanımı vermek değildir.",
      ],
      [
        4,
        "nicht",
        "zwingend",
        "garantiert",
        "nicht geçmiş başarıyı süresiz söze dönüştürmeyi reddeder. Zaman sınırı pratik bilgide açık tutulur.",
      ],
    ],
  },
  {
    level: "C2",
    id: "listen-c2-technology-assumption",
    title: "Teknolojide görünmeyen varsayımlar",
    german: "Das Modell und seine Lücken",
    category: "technology",
    goal: "Model çıktısında örneklem, görünmez hata ve kullanım sınırını ayır.",
    lines: [
      [
        "In einer fiktiven Entwicklungsrunde wird ein Modell vorgestellt, das eingehende Texte nach Themen ordnet. Ein hoher Wert in einem vorbereiteten Test lässt zunächst den Eindruck entstehen, die Aufgabe sei weitgehend gelöst.",
        "Kurgusal geliştirme toplantısında metinleri konulara ayıran model sunuluyor. Hazır testte yüksek değer önce görevin büyük ölçüde çözüldüğü izlenimi veriyor.",
      ],
      [
        "Eine Prüferin fragt, welche Texte im Test fehlen. Wenn vor allem sauber formulierte Standardsätze enthalten seien, könne der Wert wenig darüber sagen, wie das Modell mit mehrdeutigen oder ungewöhnlich geschriebenen Anfragen umgehe.",
        "Denetçi testte hangi metinlerin olmadığını soruyor. Daha çok düzgün standart cümle varsa değer belirsiz veya alışılmadık isteklerdeki davranışı pek açıklamayabilirmiş.",
      ],
      [
        "Das Team ergänzt deshalb Gegenbeispiele, statt ausschließlich bekannte Erfolgsfälle erneut zu bestätigen. Dabei wird zwischen einem falsch zugeordneten Thema und einer Anfrage unterschieden, die außerhalb der vorgesehenen Kategorien liegt.",
        "Ekip yalnız bilinen başarıları teyit etmek yerine karşı örnek ekliyor. Yanlış sınıflanan konu ile öngörülen kategoriler dışındaki istek ayrılıyor.",
      ],
      [
        "Eine niedrige Sicherheit soll künftig eine nachvollziehbare Rückfrage auslösen, nicht eine überzeugend klingende Vermutung. Die Nutzenden sollen erkennen können, wann die automatische Zuordnung unsicher ist und wer eine Korrektur prüfen kann.",
        "Düşük güven, ikna edici varsayım değil anlaşılır ek soru üretecek. Kullanıcı otomatik sınıflamanın belirsizliğini ve düzeltmeyi kimin denetleyeceğini görebilecek.",
      ],
      [
        "Diese Änderung macht das Modell nicht fehlerfrei. Sie verändert jedoch den Umgang mit Grenzen: Ein unzureichend gedeckter Vorschlag muss nicht als sichere Entscheidung an den nächsten Prozessschritt weitergereicht werden.",
        "Bu modelin hatasız olması değil. Sınırların ele alınışı değişiyor: Yetersiz dayanaklı öneri sonraki aşamaya kesin karar diye aktarılmak zorunda değil.",
      ],
      [
        "Die Runde einigt sich auf überprüfbare Einsatzbedingungen und eine erneute Bewertung bei verändertem Material. Ein Testergebnis wird damit als Aussage über bestimmte Bedingungen behandelt, nicht als zeitloses Gütesiegel.",
        "Toplantı denetlenebilir kullanım koşulları ve veri değişince yeniden değerlendirmede uzlaşıyor. Test sonucu belirli koşullardaki ifade; zamansız kalite damgası değil.",
      ],
    ],
    checks: [
      [
        "Yüksek ilk değer neden sınırlı?",
        "Testte eksik metin türleri olabilir",
        "Hiç test yapılmadığı için",
        "Her yüksek değer kesin yalan olduğu için",
        "Test örneklemi hangi durumlar hakkında konuşulabileceğini sınırlar. Değeri tümüyle reddetmek ile kapsamını kontrol etmek farklıdır.",
      ],
      [
        "Hangi iki durum ayrılıyor?",
        "Yanlış sınıflama ve kategori dışı istek",
        "Yalnız eski ve yeni bilgisayar",
        "Gündüz ve gece ekranı",
        "Kategori dışı içerik için mevcut etiketlerden birini zorla seçmek başka hatadır. Karşı örnekler farklı sınırları görünür kılar.",
      ],
      [
        "Düşük güven neye yol açmalı?",
        "Açık ek soruya",
        "Uydurulmuş kesin yanıtı gizlemeye",
        "Her zaman otomatik onaya",
        "Rückfrage ek bilgi veya insan kontrolü alanını açar. Güvenli görünen ama dayanıksız öneri kesin karar diye aktarılmaz.",
      ],
      [
        "Son test yaklaşımı ne?",
        "Koşula bağlı ve yeniden değerlendirilebilir sonuç",
        "Sonsuz geçerli kalite garantisi",
        "Bütün veri türleri için otomatik doğruluk",
        "Veri değişince yeni değerlendirme gerekir. Belirli test başarısı zamandan ve kullanımdan bağımsız güvence değildir.",
      ],
    ],
    focus: [
      [
        0,
        "sei",
        "seien",
        "seiet",
        "Tekil Aufgabe için sei verilen izlenimi aktarır. Çözülmüş görünmek bütün kullanım durumlarında doğrulanmış olmak değildir.",
      ],
      [
        1,
        "umgehe",
        "umgehest",
        "umgehet",
        "Tekil Modell için Konjunktiv I umgehe, denetçinin sorusundaki aktarılan davranışı kurar. Ungewöhnlich içerik ayrı sınanmalıdır.",
      ],
      [
        2,
        "statt",
        "um",
        "seit",
        "statt yalnız başarı teyidi yerine karşı örnek aramayı kurar. Amaç eski testi kendine tekrar tekrar doğrulatmak değildir.",
      ],
      [
        5,
        "nicht",
        "garantiert",
        "ausnahmslos",
        "nicht test sonucunu zamansız damga saymayı reddeder. Koşullar ve yeni materyalde değerlendirme ihtiyacı korunur.",
      ],
    ],
  },
  {
    level: "C2",
    id: "listen-c2-grammar-scope",
    title: "Gramer Dinleme: koşulun sınırı",
    german: "Nur wenn heißt nicht immer",
    category: "grammar",
    goal: "Gerekli koşul, yeterlilik ve olumsuzluk kapsamını sesli karşılaştırmalarda ayır.",
    lines: [
      [
        "In einer fiktiven Arbeitsanweisung heißt es: Nur wenn alle Unterlagen vorliegen, kann der Antrag abschließend geprüft werden. Vollständigkeit wird damit als Voraussetzung genannt, nicht als Zusicherung eines bestimmten Ergebnisses.",
        "Kurgusal yönergede ancak bütün belgeler varsa başvuru son kez incelenebilir deniyor. Tamlık ön koşul; belirli sonuç garantisi değil.",
      ],
      [
        "Eine Hörerin fasst das vorschnell so zusammen: Sobald die Unterlagen vollständig sind, wird der Antrag bewilligt. In dieser Zusammenfassung wurden sowohl die mögliche Prüfung als auch das offene Ergebnis verändert.",
        "Bir dinleyen bunu belgeler tam olur olmaz başvuru onaylanır diye acele özetliyor. Böylece hem olası inceleme hem açık sonuç değiştirilmiş oluyor.",
      ],
      [
        "Ähnlich wichtig ist die Unterscheidung zwischen nicht alle und keiner. Nicht alle Vorschläge wurden angenommen lässt offen, ob einige erfolgreich waren; kein Vorschlag wurde angenommen schließt dies aus.",
        "nicht alle ile keiner ayrımı da önemli. Bütün öneriler kabul edilmedi ifadesi bazılarının başarısını açık bırakırken hiçbiri kabul edilmedi bunu dışlıyor.",
      ],
      [
        "Auch bei Modalverben verschiebt sich der Umfang der Verneinung. Nicht teilnehmen müssen bezeichnet fehlende Verpflichtung; nicht teilnehmen dürfen kann ein Verbot ausdrücken, obwohl beide Sätze ähnlich kurz klingen.",
        "Modal fiilde de olumsuzluk kapsamı kayar. Katılmak zorunda olmamak yükümlülük yokluğu; katılmasına izin olmamak yasak olabilir, iki cümle benzer kısa duyulsa da.",
      ],
      [
        "Im zweiten Durchgang sollst du die Aussagen deshalb nicht nur Wort für Wort übersetzen. Formuliere jeweils, welche Möglichkeit ausgeschlossen und welche ausdrücklich offen gelassen wird.",
        "İkinci dinleyişte yalnız sözcüğü sözcüğüne çevirme. Hangi olanağın dışlandığını ve hangisinin özellikle açık bırakıldığını söyle.",
      ],
      [
        "Die Beispiele sind erfundene Sprachübungen und keine Auskunft über ein bestimmtes Antragsverfahren. Ihre Aufgabe ist, die logische Richtung einer Aussage hörbar zu machen und beim Zusammenfassen zu erhalten.",
        "Örnekler uydurma dil çalışmaları; belirli başvuru süreci hakkında bilgi değil. Amaç ifadenin mantıksal yönünü duyulur kılmak ve özette korumak.",
      ],
    ],
    checks: [
      [
        "Tam belge ne olarak sunuluyor?",
        "İnceleme için gerekli ön koşul",
        "Kesin olumlu sonuç garantisi",
        "Bütün koşulların tek başına yeterlisi",
        "Nur wenn gerekli koşulu sınırlar. İnceleyebilmekle onaylamak farklıdır; metin otomatik olumlu karar vermez.",
      ],
      [
        "Acele özetteki hata ne?",
        "İnceleme olanağını kesin onaya çevirmek",
        "Yalnız cümleyi kısaltmak",
        "Kaynağın bütün kapsamını aynen korumak",
        "Sobald ve wird bewilligt zaman ile sonucu güçlendirir. İki anlam değişikliği sadeleştirme diye gizlenmemelidir.",
      ],
      [
        "nicht alle neyi açık bırakır?",
        "Bazılarının kabul edilmiş olmasını",
        "Herkesin kesin reddedildiğini",
        "Bütün önerilerin kesin kabulünü",
        "Hepsi değil, hiçbiriyle aynı değildir. Olumsuzluğun nicelik üzerindeki kapsamı iki ifadede farklıdır.",
      ],
      [
        "müssen / dürfen olumsuzluğunda fark?",
        "Zorunluluk yokluğu / yasak",
        "Tam eşanlamlılık",
        "Sadece zaman farkı",
        "Gerekmiyor ile izin yok farklı seçenek alanı kurar. Sözcük benzerliği aynı mantıksal içeriği garanti etmez.",
      ],
    ],
    focus: [
      [
        0,
        "Nur wenn",
        "Weil",
        "Obwohl",
        "Nur wenn eksiksizliği gerekli koşul yapar. Belgelerin varlığı olumlu sonucun tek başına yeterli garantisi değildir.",
      ],
      [
        1,
        "bewilligt",
        "beantragt",
        "vermutet",
        "bewilligt onaylanmayı anlatır; ilk örnek yalnız inceleme olanağı verir. Özet bu farkı değiştirerek hatalı güçlenir.",
      ],
      [
        2,
        "kein Vorschlag",
        "einige Vorschläge",
        "mancher Vorschlag",
        "kein hiçbir öneri demektir ve kabul edilmiş örneği dışlar. Nicht alle bazı kabul ihtimalini açık bırakır.",
      ],
      [
        3,
        "obwohl",
        "damit",
        "seitdem",
        "obwohl kısa ve benzer duyulmaya rağmen anlam ayrımını korur. Bu bir amaç veya zaman başlangıcı değildir.",
      ],
    ],
  },
];

export default lessons;
