const lessons = [
  {
    level: "B2",
    id: "listen-b2-conversation-room",
    title: "Ortak alan için uzlaşma",
    german: "Ein Raum, mehrere Bedürfnisse",
    category: "conversation",
    goal: "Bir uzlaşmada sınır, öneri ve geçici onayı ayır.",
    lines: [
      [
        "Drei Nachbarn teilen einen Arbeitsraum, dessen Nutzung bisher kaum geregelt ist. Während eine Person dort ungestört lesen möchte, braucht eine andere gelegentlich einen Ort für Onlinegespräche.",
        "Üç komşu kullanımı pek düzenlenmemiş çalışma alanını paylaşıyor. Biri sessiz okumak, diğeri bazen çevrim içi konuşmak istiyor.",
      ],
      [
        "Der erste Vorschlag lautet, Gespräche grundsätzlich zu verbieten. Dagegen wird eingewendet, dass der Raum damit für einen Teil der Gruppe seinen wichtigsten Zweck verlieren würde.",
        "İlk öneri konuşmaları tamamen yasaklamak. Buna, alanın grubun bir kısmı için temel işlevini kaybedeceği itirazı geliyor.",
      ],
      [
        "Eine Nachbarin schlägt feste Gesprächszeiten vor, ohne außerhalb dieser Zeiten ständig vollständige Ruhe zu versprechen. Auch Tastaturen und kurze Rückfragen gehören schließlich zur gemeinsamen Arbeit.",
        "Bir komşu sabit konuşma saatleri öneriyor ama diğer zamanlarda mutlak sessizlik vaat etmiyor. Klavye ve kısa sorular ortak çalışmanın parçası.",
      ],
      [
        "Die Gruppe einigt sich zunächst auf zwei Nachmittage mit buchbaren Zeitfenstern. Wer ein längeres Gespräch plant, trägt es vorher ein; kurzfristige Änderungen sollen im gemeinsamen Kalender sichtbar werden.",
        "Grup önce iki öğleden sonra rezervasyonlu aralıklarda uzlaşıyor. Uzun görüşme önceden yazılacak, kısa vadeli değişiklikler ortak takvimde görünecek.",
      ],
      [
        "Nach einem Monat wollen alle prüfen, ob die Verteilung funktioniert. Eine Zustimmung zum Versuch soll ausdrücklich nicht bedeuten, dass jede spätere Beschwerde als unberechtigt gilt.",
        "Bir ay sonra dağılımın işleyişi incelenecek. Denemeye onay, sonraki her şikâyetin haksız sayılması anlamına gelmeyecek.",
      ],
      [
        "Das Gespräch endet also nicht mit einer Lösung ohne Nachteile. Es endet mit einem nachvollziehbaren Verfahren, das unterschiedliche Bedürfnisse benennt und Änderungen zulässt.",
        "Konuşma dezavantajsız çözümle bitmiyor. Farklı ihtiyaçları adlandıran ve değişime izin veren anlaşılır süreçle bitiyor.",
      ],
    ],
    checks: [
      [
        "Genel yasak neden eleştiriliyor?",
        "Bazılarının temel ihtiyacını dışlayacağı için",
        "Hiç kimse konuşmak istemediği için",
        "Alanın kapısı olmadığı için",
        "İtiraz ortak alanın farklı işlevleri olduğuna yönelir. Konuşma ihtiyacı kaynakta açıkça bulunduğundan onu yok sayma.",
      ],
      [
        "Konuşmasız saatlerde tam sessizlik garanti mi?",
        "Hayır",
        "Evet, her ses yasak",
        "Alan boş tutulacak",
        "Klavye ve kısa sorular örnekleri mutlak sessizliğin vaat edilmediğini açıklar. Sabit görüşme saati sıfır ses demek değildir.",
      ],
      [
        "Deneme ne zaman değerlendirilecek?",
        "Bir ay sonra",
        "İki gün önce",
        "Bir yıl sonra",
        "Nach einem Monat kontrol zamanıdır. İki öğleden sonra ise haftalık kullanım dağılımına aittir; süreleri karıştırma.",
      ],
      [
        "Denemeye onay neyi kaldırmaz?",
        "Sonradan gerekçeli şikâyet hakkını",
        "Ortak takvimi",
        "Zaman aralıklarını",
        "Sonraki şikâyetler otomatik haksız sayılmıyor. Geçici destek bütün gelecekteki sorunları kabul etmek anlamına gelmez.",
      ],
    ],
    focus: [
      [
        0,
        "dessen",
        "deren",
        "denen",
        "Eril tekil Arbeitsraum'a ait kullanım dessen Nutzung ile kurulur. Sonraki Nutzung dişil diye deren seçilmez.",
      ],
      [
        1,
        "würde",
        "würden",
        "würdet",
        "Der Raum tekil özneyle würde ... verlieren varsayımsal sonuç kurar. Yasak henüz uygulanmış olay değildir.",
      ],
      [
        2,
        "ohne",
        "um",
        "statt",
        "ohne ... zu versprechen sınır koyar: program dışında tam sessizlik sözü yok. Amaç sessizlik garantisi vermek değildir.",
      ],
      [
        4,
        "ob",
        "weil",
        "obwohl",
        "ob dağılımın işleyip işlemediğinin açık incelemesidir. Sonuç denemeden önce kesin kabul edilmez.",
      ],
    ],
  },
  {
    level: "B2",
    id: "listen-b2-stories-key",
    title: "Öykü: beklenmeyen anahtar",
    german: "Ein Schlüssel mit zwei Geschichten",
    category: "stories",
    goal: "Anlatıcı varsayımıyla doğrulanan geçmişi bir öyküde ayır.",
    lines: [
      [
        "Beim Ausräumen einer alten Schublade findet Lea einen beschrifteten Schlüssel. Der Name erinnert sie an eine Werkstatt, die ihr Großvater früher häufig besucht hatte.",
        "Eski çekmeceyi boşaltırken Lea üzerinde etiket olan anahtar buluyor. Adı, dedesinin sık gittiği atölyeyi hatırlatıyor.",
      ],
      [
        "Sie vermutet sofort, dass der Schlüssel zu dieser Werkstatt gehört, und erzählt ihrer Schwester von einem möglichen Familiengeheimnis. Die Schwester bittet sie, zunächst die Rückseite des Schildes anzusehen.",
        "Hemen atölyeye ait olduğunu düşünüp kardeşine olası aile sırrı anlatıyor. Kardeşi önce etiketin arkasına bakmasını istiyor.",
      ],
      [
        "Dort steht eine viel jüngere Jahreszahl. Außerdem findet Lea einen Zettel, auf dem eine vorübergehende Ausleihe erwähnt wird; ihre erste Geschichte passt nicht mehr ohne Weiteres zu den Funden.",
        "Arkada çok daha yeni yıl yazıyor. Geçici ödünç vermeyi anan not da bulunca ilk öyküsü bulgulara kolayca uymuyor.",
      ],
      [
        "Ein Anruf bei der Tante klärt einen Teil der Sache. Der Schlüssel öffnete einen Lagerraum, den die Familie während eines Umzugs kurz genutzt hatte, nicht die alte Werkstatt selbst.",
        "Teyzeye telefon konunun bir kısmını açıklıyor. Anahtar eski atölyeyi değil, taşınmada kısa kullanılan depoyu açıyormuş.",
      ],
      [
        "Warum der Name der Werkstatt auf dem Schild steht, weiß die Tante allerdings nicht. Lea lässt diese Frage offen, statt den fehlenden Teil ihrer Geschichte einfach zu ergänzen.",
        "Ama teyze etikette neden atölye adının olduğunu bilmiyor. Lea öykünün eksik kısmını uydurmak yerine soruyu açık bırakıyor.",
      ],
      [
        "Am Ende bewahrt sie Schlüssel, Zettel und die unterschiedlichen Auskünfte zusammen auf. Interessant ist für sie nun nicht nur der Gegenstand, sondern auch, wie schnell sie aus einem Hinweis eine fertige Erklärung gemacht hatte.",
        "Sonunda anahtar, not ve farklı açıklamaları birlikte saklıyor. Artık yalnız eşya değil, tek ipucundan ne kadar hızlı tamamlanmış açıklama kurduğu da ilgisini çekiyor.",
      ],
    ],
    checks: [
      [
        "İlk atölye fikri ne statüde?",
        "Lea'nın varsayımı",
        "Kesin doğrulanmış belge",
        "Teyzenin ilk beyanı",
        "vermutet ilk yorumun kesin olmadığını belirtir. Sonraki bulgular kontrol edilmeden aile sırrı doğrulanmış sayılmaz.",
      ],
      [
        "Etiketin arkası neyi zorluyor?",
        "İlk zaman ve aidiyet öyküsünü",
        "Anahtarın hiç bulunmadığını",
        "Kardeşin varlığını",
        "Yeni yıl ve geçici ödünç notu ilk öyküye tam uymuyor. Bu ayrıntılar bütün nesnenin hayal edildiğini söylemez.",
      ],
      [
        "Anahtar neyi açıyormuş?",
        "Geçici kullanılan depoyu",
        "Eski atölyenin kapısını",
        "Teyzenin yeni arabasını",
        "Teyzenin açıklaması atölye ile depoyu ayırır. Aynı etiket adı, aynı kapının kesin kanıtı değildir.",
      ],
      [
        "Hangi soru açık kalıyor?",
        "Etikette neden atölye adının yazdığı",
        "Lea'nın kardeşi olup olmadığı",
        "Telefon açılıp açılmadığı",
        "Teyze bu adı açıklayamıyor. Lea bilinmeyeni anlatıyı tamamlamak uğruna kesinleştirmemeyi seçiyor.",
      ],
    ],
    focus: [
      [
        0,
        "hatte",
        "haben",
        "hattest",
        "Großvater tekil özneyle besucht hatte geçmişten önceki ziyaretleri anlatır. Çekmecedeki güncel buluştan farklı zaman katmanıdır.",
      ],
      [
        1,
        "zunächst",
        "endgültig",
        "niemals",
        "zunächst ilk kontrol adımını getirir: arka yüzüne bakmak. Hikâyenin kesin sonucunu önceden ilan etmez.",
      ],
      [
        3,
        "den",
        "der",
        "dem",
        "Lagerraum eril tekil bağlı isimdir; aile odayı kullanmış olduğundan ilgi cümlesinde Akkusativ den gerekir.",
      ],
      [
        4,
        "statt",
        "um",
        "seit",
        "statt eksik kısmı tamamlamak yerine soruyu açık bırakmayı karşılaştırır. Amaç uydurarak bütün açıklamayı bitirmek değildir.",
      ],
    ],
  },
  {
    level: "B2",
    id: "listen-b2-travel-access",
    title: "Seyahatte erişilebilirlik planı",
    german: "Ein Ausflug mit echten Alternativen",
    category: "travel",
    goal: "Gezi planında ilan, doğrulama ve yedek seçeneği ayır.",
    lines: [
      [
        "Eine Gruppe plant einen gemeinsamen Museumsbesuch. Da eine Teilnehmerin einen Rollstuhl nutzt, prüfen die anderen nicht nur die Zugverbindung, sondern auch den Weg zwischen Bahnhof und Eingang.",
        "Grup müze gezisi planlıyor. Bir katılımcı tekerlekli sandalye kullandığından yalnız treni değil, istasyonla giriş arasını da inceliyorlar.",
      ],
      [
        "Die Internetseite nennt einen stufenlosen Zugang, enthält aber keine aktuelle Angabe zum Aufzug. Die Gruppe fragt deshalb beim Museum nach, statt aus dem Symbol eine vollständige Zusicherung abzuleiten.",
        "Sitede basamaksız erişim var ama asansörün güncel durumu yok. Grup sembolden tam garanti çıkarmak yerine müzeye soruyor.",
      ],
      [
        "Die Auskunft bestätigt den Zugang für den Besuchstag und erklärt einen vorübergehend geänderten Eingang. Diese Information wird im gemeinsamen Plan mit Datum festgehalten, nicht als dauerhafte Regel für alle Besuche.",
        "Yanıt ziyaret günü erişimi doğrulayıp geçici giriş değişikliğini açıklıyor. Bilgi tüm ziyaretlerin kalıcı kuralı değil, tarihiyle ortak plana yazılıyor.",
      ],
      [
        "Für die Rückfahrt werden zwei Verbindungen notiert. Falls der erste Anschluss ausfällt, soll niemand spontan unter Zeitdruck nach einer Alternative suchen müssen.",
        "Dönüş için iki bağlantı kaydediliyor. İlk bağlantı iptal olursa kimse zaman baskısıyla alternatif aramak zorunda kalmasın isteniyor.",
      ],
      [
        "Die betroffene Teilnehmerin entscheidet selbst, welche Unterstützung sie möchte. Die Planung soll ihr Möglichkeiten eröffnen, nicht ohne Rückfrage ihren gesamten Tag festlegen.",
        "İlgili katılımcı hangi desteği istediğine kendisi karar veriyor. Plan ona seçenek açmalı, sormadan tüm gününü belirlememeli.",
      ],
      [
        "Am Ende hat die Gruppe keinen vollkommen risikofreien Ausflug versprochen. Sie hat wichtige Bedingungen überprüft, Quellen dokumentiert und eine erreichbare Alternative vorbereitet.",
        "Sonunda grup tamamen risksiz gezi vaat etmiyor. Önemli koşulları kontrol edip kaynakları kaydetmiş, erişilebilir alternatif hazırlamış oluyor.",
      ],
    ],
    checks: [
      [
        "Asansör niçin soruluyor?",
        "Güncel durum sitede açıklanmadığı için",
        "Müze kesin kapalı olduğu için",
        "Hiç giriş bulunmadığı için",
        "Sembol bazı bilgi verir ama güncel asansör durumunu kapsamıyor. Eksik bilgi doğrudan kapalı olduğunun kanıtı yapılmıyor.",
      ],
      [
        "Yanıt hangi kapsamda kaydediliyor?",
        "Ziyaret günü ve tarihiyle",
        "Bütün gelecek yıllar için garanti",
        "Her müze için genel kural",
        "Geçici giriş değişikliği zamana bağlıdır. Tek günün teyidini her ziyaret için sınırsız garantiye çevirmemek gerekir.",
      ],
      [
        "Yedek bağlantının amacı?",
        "Aksilikte baskı altında arama gereğini azaltmak",
        "İlk trenin kesin bozulacağını söylemek",
        "Geziyi iptal etmek",
        "Falls koşulu ihtimali açık tutar. Yedek hazırlamak ilk bağlantının kesin başarısız olduğu anlamına gelmez.",
      ],
      [
        "Destek tercihini kim yapıyor?",
        "İlgili katılımcı",
        "Onun yerine bütün grup",
        "Müzenin afişi",
        "selbst kendi kararını vurgular. Erişilebilir plan kişinin iradesini yok sayan tam gün kontrolü olarak tasarlanmıyor.",
      ],
    ],
    focus: [
      [
        0,
        "sondern",
        "denn",
        "oder",
        "nicht nur ..., sondern auch kontrol alanını genişletir. Tren yanında istasyondan müzeye yolun da incelenmesi gerekir.",
      ],
      [
        1,
        "statt",
        "um",
        "seit",
        "statt sembolden garanti çıkarma yerine güncel bilgi sorulmasını karşılaştırır. Simge tüm koşulları tek başına doğrulamaz.",
      ],
      [
        3,
        "Falls",
        "Obwohl",
        "Damit",
        "Falls ilk bağlantının olası iptalini koşul olarak taşır. İptal kesin yaşanmış olay gibi verilmez.",
      ],
      [
        4,
        "selbst",
        "niemals",
        "heimlich",
        "selbst katılımcının destek tercihini kendi yaptığını belirtir. Plan, onun yerine sessiz karar alma izni değildir.",
      ],
    ],
  },
  {
    level: "B2",
    id: "listen-b2-words-source",
    title: "Kelime Tekrarı: iddia ve doğrulama",
    german: "Behauptet, bestätigt oder vermutet?",
    category: "words",
    goal: "Kaynak statüsünü gösteren sözcükleri bir olay üstünden ayır.",
    lines: [
      [
        "In einer fiktiven Meldung behauptet ein Veranstalter, alle Plätze seien bereits vergeben. Behaupten bezeichnet hier zunächst seine Aussage und liefert allein noch keinen unabhängigen Beleg.",
        "Kurgusal haberde düzenleyici bütün yerlerin dolduğunu iddia ediyor. behaupten önce onun ifadesidir; tek başına bağımsız kanıt değildir.",
      ],
      [
        "Eine Besucherin vermutet dagegen, dass einzelne Karten zurückgegeben werden könnten. Vermuten lässt die Unsicherheit offen; sie nennt keine bereits zugesicherte Möglichkeit.",
        "Bir ziyaretçi bazı biletlerin iade edilebileceğini tahmin ediyor. vermuten belirsizliği koruyor; garanti edilmiş olanak vermiyor.",
      ],
      [
        "Später bestätigt die Verkaufsstelle, dass für diesen Abend tatsächlich keine Karten mehr verfügbar sind. Die Bestätigung bezieht sich auf den genannten Abend, nicht automatisch auf die gesamte Woche.",
        "Sonra satış noktası o akşam gerçekten bilet kalmadığını doğruluyor. Doğrulama o akşama ait; tüm haftaya otomatik yayılmaz.",
      ],
      [
        "Eine weitere Mitteilung kündigt einen möglichen Zusatztermin an. Ankündigen und durchführen sind jedoch verschiedene Schritte; solange der Termin offen ist, sollte er nicht als fest gebucht beschrieben werden.",
        "Başka duyuru olası ek gün bildiriyor. Duyurmakla gerçekleştirmek farklı aşamalar; gün açıkken kesin rezervasyon diye anlatılmamalı.",
      ],
      [
        "Die Redaktion korrigiert anschließend eine zu weit gehende Überschrift. Aus alles ausverkauft wird eine genauere Formulierung, die den bestätigten Zeitraum und die Quelle nennt.",
        "Haber merkezi fazla geniş başlığı düzeltiyor. Her şey tükendi yerine doğrulanmış zaman ve kaynağı belirten daha kesin ifade yazılıyor.",
      ],
      [
        "Beim Hören prüfst du deshalb immer, wer etwas sagt und wie sicher es dargestellt wird. Ein stark klingendes Verb ersetzt nicht die Frage nach Beleg, Zeitpunkt und Umfang.",
        "Dinlerken bu yüzden kimin konuştuğunu ve ne kadar kesin sunduğunu kontrol et. Güçlü fiil kanıt, zaman ve kapsam sorularının yerini tutmaz.",
      ],
    ],
    checks: [
      [
        "behaupten tek başına ne vermez?",
        "Bağımsız kanıt",
        "Bir kişinin ifadesini",
        "Kaynağın kim olabildiğini",
        "İddia birine aittir; doğru veya yanlış olduğunun bağımsız kanıtı yalnız fiilden çıkmaz. Ek kontrol gerekir.",
      ],
      [
        "Ziyaretçi kesin bilet sözü veriyor mu?",
        "Hayır, olasılık söylüyor",
        "Evet, yer ayırtıyor",
        "Bütün hafta ücretsiz ilan ediyor",
        "vermutet ve könnten ihtiyatlı olasılık kurar. Kayıtta onaylanmış iade veya garanti yer bulunmuyor.",
      ],
      [
        "Satış noktası hangi süreyi doğruluyor?",
        "Belirtilen akşamı",
        "Bütün haftayı",
        "Sonsuza kadar bütün günleri",
        "Für diesen Abend dar kapsamdır. Bu doğrulamayı bütün haftaya yaymak kaynaktaki bilgiyi büyütür.",
      ],
      [
        "Başlık neden düzeltiliyor?",
        "Kapsamı kaynaktan geniş olduğu için",
        "Bütün bilgi kesin yalan olduğu için",
        "Ek gün kesin yapıldığı için",
        "Doğrulanan sürenin ve kaynağın yazılması aşırı genellemeyi azaltır. Bu tüm önceki verilerin yanlış ilanı değildir.",
      ],
    ],
    focus: [
      [
        0,
        "seien",
        "sei",
        "seiest",
        "alle Plätze çoğul özneyle seien aktarılan iddiayı kurar. Kip tek başına iddianın doğruluğunu kanıtlamaz.",
      ],
      [
        1,
        "könnten",
        "könnte",
        "könntet",
        "einzelne Karten çoğuldur ve könnten kullanılır. İade bir olasılık olarak kalır; garantiye yükseltilmez.",
      ],
      [
        2,
        "nicht automatisch",
        "immer unbedingt",
        "ausnahmslos",
        "nicht automatisch dar kapsamı korur. Belirli akşam hakkındaki teyit tüm haftayı zorunlu kapsamaz.",
      ],
      [
        4,
        "korrigiert",
        "korrigieren",
        "korrigierst",
        "Tekil Redaktion ile korrigiert eşleşir. Düzeltilen şey aşırı geniş başlıktır; doğrulanan olgu tümüyle silinmez.",
      ],
    ],
  },
];

export default lessons;
