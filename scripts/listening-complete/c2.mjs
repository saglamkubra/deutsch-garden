const lessons = [
  {
    n: 2,
    title: "İleri kültür yorumları",
    german: "Bewahren heißt nicht einfrieren",
    category: "culture",
    goal: "Koruma ve değişim tartışmasında konuşmacının düzeltmelerini ve örtük varsayımları izle.",
    lines: [
      [
        "In unserem fiktiven Kulturgespräch wird gefragt, was eine Stadt eigentlich bewahrt, wenn sie ein altes Kino restauriert. Die Fassade, der frühere Zweck und die Erinnerungen der Bewohner werden dabei zunächst wie ein einziges Gut behandelt.",
        "Kurgusal kültür söyleşimiz eski sinema restore edilince kentin neyi koruduğunu soruyor. Cephe, eski işlev ve sakinlerin anıları başta tek değer gibi ele alınıyor.",
      ],
      [
        "Eine Gesprächspartnerin löst diese Verbindung auf: Die erhaltene Fassade garantiere noch kein lebendiges Kino, und ein neues Programm lösche nicht zwangsläufig jede historische Bedeutung aus. Bewahrung und Veränderung seien keine einfachen Gegensätze.",
        "Bir konuşmacı bu bağı çözüyor: Korunan cephe canlı sinemayı garanti etmez; yeni program her tarihî anlamı zorunlu silmez. Koruma ve değişim basit karşıtlar değilmiş.",
      ],
      [
        "Der Einwand, damit werde jede Umnutzung beliebig, greife ihr zufolge zu kurz. Gerade weil verschiedene Güter betroffen seien, müsse offengelegt werden, welches davon eine Entscheidung stärkt und welches sie möglicherweise schwächt.",
        "Böylece her yeniden kullanım keyfî olur itirazını yetersiz buluyor. Farklı değerler etkilendiği için kararın hangisini güçlendirip hangisini zayıflatabileceği açıklanmalıymış.",
      ],
      [
        "Ein anderer Sprecher erinnert an diejenigen, die das alte Angebot nie nutzen konnten. Die Rede vom unveränderten gemeinsamen Erbe könne verdecken, dass Zugehörigkeit schon früher ungleich verteilt gewesen sei.",
        "Başka konuşmacı eski hizmetten hiç yararlanamayanları hatırlatıyor. Değişmeyen ortak miras söylemi, geçmişte de aidiyetin eşitsiz dağıldığını gizleyebilirmiş.",
      ],
      [
        "Daraus folge allerdings nicht, dass Erinnerungen bedeutungslos seien. Sie müssten vielmehr neben anderen Erfahrungen stehen dürfen, ohne sich zur einzigen legitimen Geschichte des Ortes aufzuschwingen.",
        "Ama bundan anıların önemsiz olduğu çıkmazmış. Tek meşru yer tarihi olmaya kalkışmadan diğer deneyimlerin yanında bulunabilmelilermiş.",
      ],
      [
        "Die Moderatorin unterscheidet deshalb zwischen einem unvermeidlich auswählenden Konzept und einer undurchsichtigen Auswahl. Vollständigkeit sei kaum erreichbar; Rechenschaft über die Auswahl bleibe dennoch möglich.",
        "Moderatör kaçınılmaz seçici tasarımla şeffaf olmayan seçimi ayırıyor. Tamlık zor erişilir olsa da seçim hakkında hesap vermek mümkünmüş.",
      ],
      [
        "Für die geplante Ausstellung wird vorgeschlagen, auch verworfene Entwürfe zu zeigen. Dadurch könnten Besucher sehen, dass der gegenwärtige Zustand nicht die einzig denkbare Fortsetzung der Vergangenheit ist.",
        "Sergide elenmiş taslakları da göstermek öneriliyor. Böylece izleyici bugünkü durumun geçmişin düşünülebilir tek devamı olmadığını görebilir.",
      ],
      [
        "Der Titel des Gesprächs wird am Ende nicht als Freibrief für beliebigen Umbau verstanden. Er bezeichnet die Aufgabe, Kontinuität zu begründen, statt sie bloß zu behaupten.",
        "Başlık sonunda keyfî tadilat izni sayılmıyor. Sürekliliği yalnız iddia etmek yerine gerekçelendirme görevini adlandırıyor.",
      ],
    ],
    checks: [
      [
        "Konuşmada hangi basit karşıtlık reddediliyor?",
        "Koruma ile değişimin mutlak karşıtlığı",
        "Her eski yapının değer taşıması",
        "Seçimlerin açıklanabilir olması",
        "Cephe ve canlı kullanım örneği koruma ile değişimin tek boyutlu olmadığını gösterir. Her dönüşümün keyfî olduğu sonucu da reddedilir.",
      ],
      [
        "Ortak miras söylemi neyi gizleyebilir?",
        "Geçmişteki eşitsiz aidiyeti",
        "Bütün anıların kaybolduğunu",
        "Her kişinin aynı erişime sahip olduğunu kanıtlamayı",
        "Eski hizmeti hiç kullanamayanlar, geçmişin herkes için aynı olmadığına dikkat çeker. Bu ayrıntı anıların tüm değerini silmez.",
      ],
      [
        "Tamlık sınırlıysa hangi görev sürüyor?",
        "Seçimin hesabını açıklamak",
        "Şeffaflıktan vazgeçmek",
        "Tek anlatıyı tartışılmaz yapmak",
        "Vollständigkeit ile Rechenschaft ayrılır. Her şeyi içerememek, hangi seçimin niçin yapıldığını açıklama yükünü ortadan kaldırmaz.",
      ],
      [
        "Elenmiş taslakları göstermek ne sağlar?",
        "Mevcut durumun tek olası devam olmadığını göstermek",
        "Bugünkü yapının kesin değersizliğini kanıtlamak",
        "Bütün seçeneklerin uygulandığını söylemek",
        "Alternatiflerin görünmesi seçilmiş devamın kaçınılmaz olmadığını anlatır. Bu, her alternatifin uygulandığı veya eşit iyi olduğu iddiası değildir.",
      ],
    ],
    focus: [
      [
        1,
        "zwangsläufig",
        "niemals",
        "ausschließlich",
        "nicht zwangsläufig zorunlu sonuç ilişkisini reddeder. Yeni programla tarihî anlamın her durumda silindiğini veya hiç değişmediğini söylemez.",
      ],
      [
        2,
        "ihr zufolge",
        "ihrer zufolge",
        "ihres zufolge",
        "zufolge bu kullanımda Dativ zamiri ihr ile kaynak bildirir. Yargının bu konuşmacıya ait olduğu açık tutulur.",
      ],
      [
        4,
        "vielmehr",
        "zuvor",
        "deswegen",
        "vielmehr anıların önemsizliği çıkarımını düzeltir. Başka deneyimlerle birlikte yer alması savunulur; anılar tümüyle dışlanmaz.",
      ],
      [
        7,
        "statt",
        "um",
        "seit",
        "statt sürekliliği salt ilan etme yerine gerekçelendirme karşılaştırması kurar. Keyfî dönüşümü amaç diye sunmaz.",
      ],
    ],
  },
  {
    n: 3,
    title: "Karmaşık savlar",
    german: "Wenn ein Maßstab zur Abkürzung wird",
    category: "education",
    goal: "Ölçüt tartışmasında gerekli koşul, gösterge ve başarıyı birbirinden ayır.",
    lines: [
      [
        "Ein fiktives Fördergremium diskutiert, ob Projekte künftig vor allem nach ihrer Reichweite beurteilt werden sollen. Die Zahl erreichter Personen scheint auf den ersten Blick einen leicht vergleichbaren Maßstab zu liefern.",
        "Kurgusal destek kurulu projelerin esas olarak erişimle değerlendirilmesini tartışıyor. Ulaşılan kişi sayısı ilk bakışta kolay karşılaştırılır ölçüt gibi görünüyor.",
      ],
      [
        "Eine Befürworterin erklärt, ohne irgendeinen gemeinsamen Maßstab ließen sich Entscheidungen kaum begründen. Ihr Argument lautet jedoch nicht, dass Reichweite bereits jede Form von Qualität abbildet.",
        "Bir destekçi ortak ölçüt olmadan kararların zor gerekçelendirileceğini söylüyor. Ama savı erişimin bütün kaliteyi zaten ölçtüğü değil.",
      ],
      [
        "Ein Kritiker hält dagegen, ein gut zählbarer Wert könne selbst zum Ziel werden. Projekte könnten dann ihre Angebote so verändern, dass die Zahl steigt, obwohl der eigentliche Nutzen gleich bleibt oder sinkt.",
        "Eleştiren kişi kolay sayılan değerin hedefe dönüşebileceğini söylüyor. Projeler sayı artsın diye hizmeti değiştirebilirken gerçek yarar aynı kalabilir veya düşebilir.",
      ],
      [
        "Die Befürworterin räumt dieses Risiko ein, lehnt aber den Schluss ab, jede Messung sei deshalb sinnlos. Ein unvollständiger Maßstab könne nützlich sein, sofern seine Grenzen ausdrücklich mitbeurteilt würden.",
        "Destekçi riski kabul ediyor ama her ölçüm anlamsızdır sonucunu reddediyor. Eksik ölçüt, sınırları açıkça değerlendirilirse yararlı olabilirmiş.",
      ],
      [
        "Eine dritte Stimme trennt daraufhin zwei Fragen: Brauchen wir einen nachvollziehbaren Vergleich, und reicht diese eine Kennzahl dafür aus? Wer die erste Frage bejaht, hat die zweite noch nicht beantwortet.",
        "Üçüncü kişi iki soruyu ayırıyor: İzlenebilir karşılaştırma gerekli mi ve tek gösterge buna yeter mi? İlkine evet demek ikincisini yanıtlamıyor.",
      ],
      [
        "Als Gegenbeispiel wird ein kleines Angebot mit intensivem Beratungsbedarf genannt. Geringe Reichweite könne dort gerade mit hohem Aufwand pro Person zusammenhängen, nicht notwendig mit geringer Qualität.",
        "Karşı örnek yoğun danışma gerektiren küçük hizmet. Düşük erişim kişi başına yüksek emekle bağlantılı olabilir; zorunlu düşük kalite değildir.",
      ],
      [
        "Vereinbart wird schließlich, quantitative Angaben mit einer begründeten Beschreibung von Zielgruppe und Wirkung zu verbinden. Das Verfahren bleibt angreifbar, soll aber seine eigenen Annahmen sichtbar machen.",
        "Sonunda sayısal bilgiyi hedef kitle ve etki açıklamasıyla birleştirmek kararlaşıyor. Yöntem eleştirilebilir kalıyor ama varsayımlarını görünür kılacak.",
      ],
      [
        "Der Fortschritt liegt nicht darin, jeden Einwand beseitigt zu haben. Er liegt darin, einen notwendigen Vergleich nicht mehr mit einem vermeintlich hinreichenden Einzelwert zu verwechseln.",
        "İlerleme her itirazın yok olması değil. Gerekli karşılaştırmayı sözde yeterli tek değerle artık karıştırmamak.",
      ],
    ],
    checks: [
      [
        "İlk destekçi gerçekte ne savunuyor?",
        "Ortak ölçütün gerekçelendirmede yararlı olduğunu",
        "Erişimin bütün kaliteyi eksiksiz ölçtüğünü",
        "Hiç ölçüte ihtiyaç olmadığını",
        "Metin argümanın kapsamını açıkça sınırlar. Ortak ölçüt gerekliliğini tek göstergenin yeterliliğiyle eşitleme.",
      ],
      [
        "Eleştirmenin göstergeye ilişkin riski?",
        "Değerin gerçek amaç yerine hedef olması",
        "Hiçbir sayının toplanamaması",
        "Bütün projelerin kapanması",
        "Sayı yükselirken yararın artmayabileceği örneği göstergeyle amaç arasındaki ayrışmayı anlatır. Bu bütün ölçümü reddetmek değildir.",
      ],
      [
        "Küçük hizmet örneğinin işlevi?",
        "Az erişimin zorunlu düşük kalite olmadığını göstermek",
        "Bütün küçük projelerin kusursuzluğunu kanıtlamak",
        "Karşılaştırmayı yasaklamak",
        "Karşı örnek otomatik düşük kalite çıkarımını sınırlar. Bütün küçük hizmetleri koşulsuz iyi ilan etmez.",
      ],
      [
        "Son uzlaşı ne?",
        "Sayıyı hedef kitle ve etki açıklamasıyla birlikte okumak",
        "Yalnız en büyük sayıyı seçmek",
        "Bütün itirazların bittiğini ilan etmek",
        "Nicel ve gerekçeli nitel bilgi birleştirilir. Yöntemin eleştirilebilir olduğu açık bırakılır; kusursuzluk ilan edilmez.",
      ],
    ],
    focus: [
      [
        1,
        "ließen",
        "ließe",
        "ließest",
        "Kaynakta karşılaştırma çoğul kararlarla değil 'Entscheidungen ließen' biçimiyle kurulur; bu odak alıştırmasında özgün çoğul çekim korunmalıdır.",
      ],
      [
        2,
        "obwohl",
        "damit",
        "seitdem",
        "obwohl yükselen sayı ile değişmeyen veya düşen yarar arasındaki karşıtlığı kurar. Amaç bağlayıcısı bu iç ilişkiyi değiştirebilir.",
      ],
      [
        3,
        "sofern",
        "obwohl",
        "seitdem",
        "sofern yararlılığı sınırların değerlendirilmesi koşuluna bağlar. Ölçütün her durumda yeterli olduğu söylenmez.",
      ],
      [
        7,
        "hinreichenden",
        "hinreichender",
        "hinreichendes",
        "mit einem ... Einzelwert Dativ eril gruptur, sıfat -en alır. Mantıksal olarak yeterli sanılan tek değer eleştiriliyor.",
      ],
    ],
  },
  {
    n: 4,
    title: "Deyimsel anlatım",
    german: "Nicht alles kommt sofort auf den Tisch",
    category: "words",
    goal: "Bir toplantı anlatısında yerleşik kalıpları sözcüğü sözcüğüne çevirmeden anla.",
    lines: [
      [
        "In unserem fiktiven Projektbericht bringt eine Kollegin ein lange übersehenes Problem zur Sprache. Gemeint ist nicht, dass sie etwas körperlich trägt, sondern dass sie es im Gespräch ausdrücklich zum Thema macht.",
        "Kurgusal proje anlatımızda çalışan uzun süredir gözden kaçan sorunu gündeme getiriyor. Fiziksel taşıma değil, konuşmada açıkça konu etme anlatılıyor.",
      ],
      [
        "Die Leitung nimmt ihren Hinweis zur Kenntnis. Diese Formulierung bestätigt zunächst nur, dass die Information aufgenommen wird; Zustimmung oder eine konkrete Maßnahme folgen daraus noch nicht.",
        "Yönetim uyarıyı not ediyor. Bu önce yalnız bilginin alındığını doğruluyor; onay veya somut önlem sonucu henüz çıkmıyor.",
      ],
      [
        "Anschließend wird ein bisher verworfener Vorschlag erneut in Betracht gezogen. Damit wird er geprüft, nicht schon beschlossen; zwischen einer erwogenen Möglichkeit und einer getroffenen Entscheidung liegt ein wichtiger Schritt.",
        "Sonra önceden elenen öneri yeniden değerlendirmeye alınıyor. İnceleniyor ama henüz kararlaştırılmıyor; düşünülmüş olasılıkla verilmiş karar arasında önemli adım var.",
      ],
      [
        "Ein Teammitglied erklärt, die nötigen Räume stünden nächste Woche zur Verfügung. Als es anbietet, sie dem Projekt zur Verfügung zu stellen, übernimmt es dagegen eine aktivere Rolle bei der Bereitstellung.",
        "Bir ekip üyesi gereken odaların gelecek hafta kullanılabilir olduğunu söylüyor. Bunları projeye sunmayı önerince ise tahsiste daha etkin rol alıyor.",
      ],
      [
        "Eine Rückfrage bringt allerdings einen Zeitkonflikt ans Licht. Die Redewendung beschreibt, dass etwas bislang Unbekanntes sichtbar wird; sie setzt keine Lampe und keinen dunklen Raum voraus.",
        "Bir soru zaman çakışmasını açığa çıkarıyor. Kalıp bilinmeyenin görünür olmasını anlatır; lamba veya karanlık oda gerektirmez.",
      ],
      [
        "Nun steht eine Verschiebung zur Diskussion. Dass etwas diskutiert wird, bedeutet weder, dass alle dafür sind, noch, dass die Entscheidung bereits gefallen ist.",
        "Artık erteleme tartışmaya açık. Bir şeyin tartışılması herkesin desteklediği veya kararın verildiği anlamına gelmez.",
      ],
      [
        "Zum Schluss wird vereinbart, die Betroffenen schriftlich in Kenntnis zu setzen. Wer genau informiert und bis wann, wird ausdrücklich festgehalten, damit die Wendung nicht ohne verantwortliche Person im Protokoll stehen bleibt.",
        "Sonunda etkilenenleri yazılı bilgilendirmek kararlaşıyor. Kimin ne zamana kadar bilgilendireceği açık yazılıyor; kalıp tutanakta sorumlusuz kalmıyor.",
      ],
      [
        "Beim erneuten Hören achtest du auf die Rollen innerhalb der Wendungen. Ähnliche Wörter können unterschiedliche Schritte bezeichnen: wahrnehmen, erwägen, bereitstellen, diskutieren und schließlich entscheiden.",
        "Yeniden dinlerken kalıplardaki rollere dikkat et. Benzer sözcükler farklı aşamalar olabilir: fark etmek, düşünmek, sunmak, tartışmak ve sonunda karar vermek.",
      ],
    ],
    checks: [
      [
        "zur Kenntnis nehmen neyi henüz garanti etmez?",
        "Onay veya somut önlemi",
        "Bilginin alınmasını ifade etmeyi",
        "Bir uyarının varlığını",
        "İlk olarak bilgi alınır. Bunu kabul veya uygulama kararına genişletmek kayıttaki aşamaları birbirine karıştırır.",
      ],
      [
        "in Betracht ziehen hangi aşama?",
        "Değerlendirmeye almak",
        "Kesin kabul edip uygulamak",
        "Tamamen unutmak",
        "Olasılığın düşünülmesi ile kararın verilmesi ayrılır. Geprüft, nicht schon beschlossen bu farkı açık tutar.",
      ],
      [
        "ans Licht bringen burada ne demek?",
        "Bilinmeyen çakışmayı açığa çıkarmak",
        "Odaya lamba kurmak",
        "Takvimi karartmak",
        "Zaman çatışması bir soruyla görünür hâle gelir. Fiziksel ışık okuması bu bağlamda özellikle dışlanır.",
      ],
      [
        "Son kararda neden sorumlu ve tarih yazılıyor?",
        "İfadenin somut takip edilebilir işe dönüşmesi için",
        "Herkesin zaten bilgilendirildiğini kanıtlamak için",
        "Tartışmayı hiç yapmamak için",
        "Bilgilendirme kararı tamamlanmış bildirim değildir. Sorumlu ve süre sonraki işin izlenebilirliğini sağlar.",
      ],
    ],
    focus: [
      [
        0,
        "zur Sprache",
        "auf Sprache",
        "an Sprache",
        "zur Sprache bringen konuyu gündeme getirme kalıbıdır. Sabit edatı değiştirerek fiziksel yer anlamına taşımamak gerekir.",
      ],
      [
        1,
        "zur Kenntnis",
        "auf Kenntnis",
        "bei Kenntnis",
        "zur Kenntnis nehmen bilginin alındığını ifade eder. Yerleşik kalıp tek başına kabul veya işlem garantisi değildir.",
      ],
      [
        2,
        "in Betracht",
        "auf Betracht",
        "bei Betracht",
        "in Betracht ziehen değerlendirmek anlamındadır. Kalıbın içindeki in sabittir; seçenek henüz kararlaştırılmamıştır.",
      ],
      [
        6,
        "in Kenntnis",
        "auf Kenntnis",
        "zur Kenntnis",
        "jemanden in Kenntnis setzen birini bilgilendirmektir. zur Kenntnis nehmen ise bilgiyi alanın eylemidir; roller farklıdır.",
      ],
    ],
  },
  {
    n: 5,
    title: "Edebiyat sohbetleri",
    german: "Was der Erzähler verschweigt",
    category: "stories",
    goal: "Özgün kısa metin üzerine konuşmada anlatıcı bilgisiyle yorumun sınırını ayır.",
    lines: [
      [
        "In einer fiktiven Literaturgruppe wird ein eigens erfundener Text besprochen: Eine Person kehrt nach Jahren in ein leeres Haus zurück und beschreibt sorgfältig jeden Gegenstand, erwähnt aber kaum andere Menschen.",
        "Kurgusal edebiyat grubunda özgün uydurma metin konuşuluyor: Biri yıllar sonra boş eve dönüp her eşyayı ayrıntıyla anlatıyor ama insanlardan pek söz etmiyor.",
      ],
      [
        "Eine Leserin versteht diese Auslassungen als Zeichen von Trauer. Ein anderer Leser hält dagegen, dass der Text den Grund der Rückkehr offenlässt und keine bestimmte Verlustgeschichte ausdrücklich bestätigt.",
        "Bir okur eksiltmeleri yas işareti sayıyor. Başkası dönüş nedeninin açık bırakıldığını, belirli kayıp öyküsünün doğrulanmadığını söylüyor.",
      ],
      [
        "Die Moderatorin unterscheidet zwischen einer möglichen Deutung und einer im Text genannten Tatsache. Das bedeutet nicht, dass nur wörtlich Gesagtes diskutiert werden dürfte; Deutungen müssten jedoch an beobachtbaren Einzelheiten ansetzen.",
        "Moderatör olası yorumla metindeki olguyu ayırıyor. Bu yalnız kelimesi kelimesine söylenen tartışılır demek değil; yorum gözlenebilir ayrıntılara dayanmalıymış.",
      ],
      [
        "Besonders umstritten ist der Satz, im Haus sei alles an seinem Platz. Er könnte eine zuverlässige Beschreibung sein, aber ebenso den Versuch zeigen, eine veränderte Situation sprachlich festzuhalten.",
        "Evde her şey yerli yerindeydi cümlesi tartışılıyor. Güvenilir betimleme de olabilir, değişen durumu dille sabitleme girişimi de.",
      ],
      [
        "Eine Teilnehmerin verweist auf einen später erwähnten freien Fleck an der Wand. Diese Stelle widerspreche einer vollständig unveränderten Einrichtung, beweise aber noch nicht, welches Bild dort früher gehangen habe.",
        "Bir katılımcı sonra sözü edilen duvardaki boş yeri gösteriyor. Bu tamamen değişmemiş döşemeye ters düşer ama eskiden hangi resmin asıldığını kanıtlamazmış.",
      ],
      [
        "Die Gruppe diskutiert deshalb auch die Begrenztheit der Erzählerperspektive. Was die erzählende Person nicht berichtet, ist nicht automatisch nicht geschehen; es ist zunächst nur nicht zugänglich gemacht.",
        "Grup anlatıcı bakışının sınırını da tartışıyor. Anlatıcının aktarmadığı şey otomatik hiç yaşanmamış değildir; önce yalnız erişime sunulmamıştır.",
      ],
      [
        "Am Ende wird keine einzige Lesart zur verbindlichen Lösung erklärt. Stattdessen werden die Textstellen gesammelt, die unterschiedliche Deutungen stützen oder ihnen Grenzen setzen.",
        "Sonunda tek okuma zorunlu çözüm ilan edilmiyor. Farklı yorumları destekleyen veya sınırlayan metin yerleri toplanıyor.",
      ],
      [
        "Das Gespräch zeigt, dass Offenheit nicht Beliebigkeit bedeuten muss. Wer seine Deutung begründet und ihre Grenzen benennt, kann andere Lesarten ernst nehmen, ohne alle für gleich gut belegt zu halten.",
        "Konuşma açıklığın keyfîlik demek olmadığını gösteriyor. Yorumunu gerekçelendiren ve sınırını belirten kişi, hepsini eşit kanıtlı saymadan diğer okumaları ciddiye alabilir.",
      ],
    ],
    checks: [
      [
        "Yas yorumu nasıl sunuluyor?",
        "Olası bir okuma",
        "Açıkça doğrulanmış tek olay",
        "Yazarın gerçek yaşam kaydı",
        "Metin belirli kaybı doğrulamaz. Yas bir okurun yorumudur; olguyla yorumun bilgi statüsü ayrılır.",
      ],
      [
        "Duvardaki boş yer neyi kanıtlamaz?",
        "Eskiden hangi resmin bulunduğunu",
        "Bir boş yerden söz edildiğini",
        "Değişmezlik yorumuna itiraz kurulabildiğini",
        "Boş yer tam değişmezlik savını sınırlar ama kayıp resmin kimliğini vermez. Eksik bilgiyi hayal ederek kesinleştirme.",
      ],
      [
        "Anlatılmayan olay için doğru yaklaşım?",
        "Olmamış saymamak",
        "Kesinlikle hiç yaşanmadı demek",
        "Mutlaka yaşandı diye tamamlamak",
        "Erişime sunulmama ile gerçekleşmeme ayrılır. Aynı şekilde anlatılmayanın mutlaka yaşandığını icat etmek de gerekçesizdir.",
      ],
      [
        "Sonuçtaki açıklık ne anlama geliyor?",
        "Farklı okumalar gerekçeleriyle tartışılabilir",
        "Her yorum aynı ölçüde kanıtlıdır",
        "Metin ayrıntılarına ihtiyaç yoktur",
        "Son cümle hem çoğulluğu hem kanıt farklarını korur. Açık okuma alanı bütün iddiaların eşit güçlü olduğu anlamına gelmez.",
      ],
    ],
    focus: [
      [
        1,
        "offenlässt",
        "offenlassen",
        "lässt offen",
        "dass yan cümlesinde çekimli offenlässt sona gelir ve ayrılmaz. Gerekçenin açık kalması yorumun sınırıdır.",
      ],
      [
        2,
        "dürfte",
        "dürften",
        "dürftet",
        "Adlaşmış nötr tekil Gesagtes ile dürfte eşleşir. Burada yalnız açık söylenenin tartışılmasına izin veren dar yorum reddedilir; bağlamı koru.",
      ],
      [
        4,
        "beweise",
        "beweisest",
        "beweiset",
        "Tekil Stelle için Konjunktiv I beweise aktarılan değerlendirmedir. nicht kayıp resmin kimliğinin kanıtlandığını reddeder.",
      ],
      [
        7,
        "ohne",
        "um",
        "statt",
        "ohne ... zu halten diğer okumaları ciddiye almanın hepsini eşit kanıtlı saymayı gerektirmediğini kurar. Amaç eşitlemek değildir.",
      ],
    ],
  },
];

export default lessons;
