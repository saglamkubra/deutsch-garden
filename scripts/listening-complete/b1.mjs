const lessons = [
  {
    n: 2,
    title: "Almanya’da yaşam",
    german: "Ein neuer Alltag im Viertel",
    category: "germany",
    goal: "Yeni bir mahallede bilgi alma, randevu ve komşuluk adımlarını dinle.",
    lines: [
      [
        "Seit drei Wochen wohnt Nora in einem neuen Viertel. Die Wohnung gefällt ihr, aber viele Abläufe kennt sie noch nicht.",
        "Nora üç haftadır yeni bir mahallede oturuyor. Evi beğeniyor ama birçok işleyişi henüz bilmiyor.",
      ],
      [
        "Für einen Behördentermin schaut sie auf der offiziellen Internetseite nach. Dort findet sie eine Liste der benötigten Unterlagen.",
        "Bir resmî randevu için kurumun resmî sitesine bakıyor. Gerekli belgelerin listesini orada buluyor.",
      ],
      [
        "Ein Nachbar bietet Hilfe an, doch Nora möchte die aktuellen Angaben selbst überprüfen. Sie schreibt ihre offenen Fragen auf.",
        "Komşusu yardım öneriyor ama Nora güncel bilgileri kendisi doğrulamak istiyor. Açık sorularını yazıyor.",
      ],
      [
        "Beim Termin fehlt noch eine Kopie. Die Mitarbeiterin erklärt, wie Nora sie nachreichen kann; der Vorgang ist also noch nicht abgeschlossen.",
        "Randevuda bir kopya eksik kalıyor. Görevli Nora'nın bunu nasıl sonradan sunabileceğini açıklıyor; işlem henüz bitmiş değil.",
      ],
      [
        "Zu Hause liest Nora den Aushang im Treppenhaus. Dort stehen die Abholtage für Papier und andere Abfälle in diesem Haus.",
        "Evde merdiven boşluğundaki duyuruyu okuyor. Bu binadaki kâğıt ve diğer atık toplama günleri yazıyor.",
      ],
      [
        "Sie fragt ihre Nachbarin, welcher Behälter zu ihrer Wohnung gehört. Statt zu raten, möchte sie die Regel vor Ort verstehen.",
        "Hangi kabın kendi dairesine ait olduğunu komşusuna soruyor. Tahmin etmek yerine yerel düzeni anlamak istiyor.",
      ],
      [
        "Am Abend trifft sie einige Leute im Innenhof. Sie verabreden sich für einen Spaziergang und tauschen freiwillig Kontaktdaten aus.",
        "Akşam avluda birkaç kişiyle tanışıyor. Yürüyüş için sözleşip gönüllü olarak iletişim bilgilerini paylaşıyorlar.",
      ],
      [
        "Nora merkt, dass nicht alles am ersten Tag klappen muss. Verlässliche Informationen und kleine Gespräche helfen ihr mehr als vorschnelle Annahmen.",
        "Nora her şeyin ilk gün yolunda gitmesi gerekmediğini görüyor. Güvenilir bilgiler ve küçük sohbetler acele varsayımlardan daha çok yardımcı oluyor.",
      ],
    ],
    checks: [
      [
        "Güncel belge bilgisi nereden alınıyor?",
        "Kurumun resmî sitesinden",
        "Rastgele bir yorumdan",
        "Komşunun eski notundan",
        "Resmî site güncel kontrol kaynağıdır. Komşu yardım önerse de Nora bilgiyi ayrıca kontrol ediyor.",
      ],
      [
        "Resmî işlem bitmiş mi?",
        "Hayır, eksik kopya sunulacak",
        "Evet, her şey tamam",
        "Başvuru kesin reddedilmiş",
        "noch nicht abgeschlossen tamamlanmadığını bildirir. Sonradan belge sunabilmek kesin ret ile aynı şey değildir.",
      ],
      [
        "Atık düzeni neden soruluyor?",
        "Binadaki yerel uygulamayı öğrenmek için",
        "Her şehirde tek düzen olduğunu kanıtlamak için",
        "Komşularla tartışmak için",
        "vor Ort belirli binanın uygulamasını vurgular. Bu diyalog ülke çapında değişmez bir kural listesi değildir.",
      ],
      [
        "Anlatının temel yaklaşımı ne?",
        "Bilgiyi kontrol edip adım adım uyum sağlamak",
        "İlk günde her şeyi bitirmek",
        "Hiç yardım istememek",
        "Son cümle güvenilir bilgi ve küçük konuşmaları öne çıkarır. Nora hem kontrol eder hem soru sorar; yardım tamamen reddedilmez.",
      ],
    ],
    focus: [
      [
        1,
        "benötigten",
        "benötigter",
        "benötigtes",
        "der benötigten Unterlagen Genitiv çoğul gruptur. benötigt sıfat gibi çekilir; belgenin gerekli olduğunu belirtir.",
      ],
      [
        3,
        "nachreichen",
        "nachgereicht",
        "reicht nach",
        "kann sonrasında mastar nachreichen kullanılır. Bu, eksik belgeyi daha sonra sunmaktır; başvurunun bittiği söylenmez.",
      ],
      [
        5,
        "Statt",
        "Um",
        "Seit",
        "Statt zu raten tahmin etmenin yerine yerel bilgiyi öğrenmeyi karşılaştırır; zaman başlangıcı değildir.",
      ],
      [
        7,
        "dass",
        "obwohl",
        "damit",
        "dass Nora'nın fark ettiği içeriği açar. Bu cümle amaç veya karşıt beklenti değil zihinsel bulgunun içeriğidir.",
      ],
    ],
  },
  {
    n: 3,
    title: "Eğitim üzerine",
    german: "Welcher Kurs passt zu mir?",
    category: "education",
    goal: "Kurs seçeneklerini hedef, zaman ve destek bakımından karşılaştır.",
    lines: [
      [
        "Emre möchte seine beruflichen Kenntnisse erweitern. Er vergleicht einen Abendkurs mit einem Kurs, der vollständig online stattfindet.",
        "Emre meslek bilgisini geliştirmek istiyor. Akşam kursuyla tamamen çevrim içi yapılan bir kursu karşılaştırıyor.",
      ],
      [
        "Der Abendkurs bietet feste Termine und direkten Austausch. Allerdings weiß Emre vorher nicht immer, wann seine Arbeit endet.",
        "Akşam kursunun sabit saatleri ve doğrudan iletişimi var. Ancak Emre işinin ne zaman biteceğini önceden her zaman bilemiyor.",
      ],
      [
        "Beim Onlinekurs kann er einige Aufgaben selbst einteilen. Ein wöchentliches Treffen ist trotzdem verbindlich und nicht frei verschiebbar.",
        "Çevrim içi kursta bazı görevleri kendisi planlayabiliyor. Yine de haftalık buluşma zorunlu ve serbestçe değiştirilemiyor.",
      ],
      [
        "In der Beratung fragt er nach Voraussetzungen und Rückmeldungen. Ein Zertifikat allein ist ihm weniger wichtig als verständliche Erklärungen.",
        "Danışmada ön koşulları ve geri bildirimi soruyor. Sertifika tek başına onun için anlaşılır açıklamalardan daha az önemli.",
      ],
      [
        "Die Beraterin empfiehlt eine Probestunde, bevor er sich entscheidet. So kann er prüfen, ob das Lerntempo zu ihm passt.",
        "Danışman karar vermeden önce deneme dersi öneriyor. Böylece öğrenme hızının kendisine uyup uymadığını kontrol edebilir.",
      ],
      [
        "Emre notiert auch den tatsächlichen Zeitaufwand. Zwei Unterrichtsstunden bedeuten nicht, dass es keine Vorbereitung oder Hausaufgaben gibt.",
        "Emre gerçek zaman yükünü de not ediyor. İki ders saati hazırlık veya ev ödevi olmadığı anlamına gelmiyor.",
      ],
      [
        "Nach der Probestunde wählt er den Onlinekurs mit Betreuung. Er plant an drei Abenden kurze Lernzeiten statt einer langen Sitzung.",
        "Deneme dersinden sonra destekli çevrim içi kursu seçiyor. Tek uzun oturum yerine üç akşam kısa çalışmalar planlıyor.",
      ],
      [
        "Seinen Plan will er nach zwei Wochen überprüfen. Falls er regelmäßig überfordert ist, möchte er zuerst mit der Kursleitung sprechen.",
        "Planını iki hafta sonra gözden geçirecek. Düzenli zorlanırsa önce kurs yöneticisiyle konuşmak istiyor.",
      ],
    ],
    checks: [
      [
        "Akşam kursunun güçlüğü ne?",
        "İşin bitişi bazen belirsiz",
        "Hiç iletişim olmaması",
        "Dersin yalnız sabah olması",
        "İş bazen geç bitiyor; sabit kurs saati bu yüzden sorun olabilir. Kayıt doğrudan iletişimin olmadığını söylemiyor.",
      ],
      [
        "Çevrim içi kursta her şey esnek mi?",
        "Hayır, haftalık buluşma sabit",
        "Evet, her tarih serbest",
        "Hiç görev yok",
        "trotzdem verbindlich esnekliğin sınırını gösterir. Bazı ödevleri planlayabilmek tüm buluşmaların isteğe bağlı olması değildir.",
      ],
      [
        "Karardan önce ne deneniyor?",
        "Deneme dersi",
        "Sertifika sınavı",
        "Kursu bırakmak",
        "Probestunde öğrenme hızını kontrol etmek içindir. Denemeden önce sertifika aldığı veya kursu bıraktığı söylenmez.",
      ],
      [
        "Nihai seçimin özelliği?",
        "Destekli çevrim içi kurs",
        "Yalnız sertifika satan kurs",
        "Sabah yüz yüze kurs",
        "mit Betreuung destek/rehberlik unsurudur. Karar hem zaman düzenine hem anlaşılır açıklama ihtiyacına dayanır.",
      ],
    ],
    focus: [
      [
        0,
        "stattfindet",
        "stattfinden",
        "findet statt",
        "der ile başlayan ilgi cümlesinde çekimli stattfindet sonda birleşik kalır; ana cümle ayrılmasını buraya taşıma.",
      ],
      [
        2,
        "trotzdem",
        "deswegen",
        "zuvor",
        "trotzdem esnek ödevlere rağmen sabit buluşma sınırını ekler. Bu bir zaman sıralaması veya sonuç gerekçesi değildir.",
      ],
      [
        4,
        "ob",
        "weil",
        "obwohl",
        "ob hızın uyup uymadığı açık sorusunu taşır. Uyum baştan kesin kabul edilmiyor; deneme bu yüzden öneriliyor.",
      ],
      [
        7,
        "Falls",
        "Obwohl",
        "Seitdem",
        "Falls düzenli zorlanma ihtimaline koşul koyar. Henüz Emre'nin kesin ve sürekli zorlandığı söylenmez.",
      ],
    ],
  },
  {
    n: 4,
    title: "Seyahat deneyimleri",
    german: "Ein Umweg mit Aussicht",
    category: "travel",
    goal: "Yolculuk aksiliğinde sebep, seçenek ve sonradan değerlendirmeyi ayır.",
    lines: [
      [
        "Auf unserer Wanderreise wollten wir am ersten Tag ein kleines Dorf erreichen. Die Strecke hatte ich vorher auf einer Karte geplant.",
        "Yürüyüş gezisinde ilk gün küçük bir köye varmak istiyorduk. Güzergâhı önceden haritada planlamıştım.",
      ],
      [
        "Am Morgen erfuhren wir, dass ein Weg nach starkem Regen gesperrt war. Die Information stand an einer offiziellen Hinweistafel.",
        "Sabah şiddetli yağmurdan sonra bir yolun kapandığını öğrendik. Bilgi resmî uyarı levhasında yazıyordu.",
      ],
      [
        "Wir konnten einen längeren Weg nehmen oder mit dem Bus weiterfahren. Weil noch genügend Tageslicht blieb, entschieden wir uns für den Umweg.",
        "Daha uzun yolu seçebilir veya otobüsle devam edebilirdik. Yeterli gün ışığı kaldığından dolambaçlı yolu seçtik.",
      ],
      [
        "Unterwegs machten wir öfter Pause als geplant. Die Aussicht war schön, aber die zusätzliche Strecke kostete uns Kraft.",
        "Yolda planlanandan sık mola verdik. Manzara güzeldi ama ek yol bizi yordu.",
      ],
      [
        "Ich rief die Unterkunft an, damit niemand vergeblich auf uns wartete. Die Gastgeberin erklärte, wo wir den Schlüssel später finden würden.",
        "Kimse boşuna beklemesin diye konaklama yerini aradım. Ev sahibi anahtarı sonra nerede bulacağımızı açıkladı.",
      ],
      [
        "Im Dorf angekommen, kauften wir zuerst etwas zu essen. Das einzige offene Geschäft lag direkt neben der Bushaltestelle.",
        "Köye varınca önce yiyecek aldık. Açık olan tek dükkân otobüs durağının hemen yanındaydı.",
      ],
      [
        "Am nächsten Tag planten wir eine kürzere Etappe. Wir wollten die Reise genießen und nicht nur Kilometer sammeln.",
        "Ertesi gün daha kısa etap planladık. Yalnız kilometre biriktirmek değil, geziden keyif almak istiyorduk.",
      ],
      [
        "Im Rückblick war der Umweg eine gute Erfahrung. Trotzdem würde ich heute immer eine zweite Verbindung und die aktuellen Hinweise prüfen.",
        "Geriye bakınca dolambaçlı yol güzel bir deneyimdi. Yine de bugün her zaman ikinci bağlantıyı ve güncel uyarıları kontrol ederdim.",
      ],
    ],
    checks: [
      [
        "Yolun kapanma nedeni?",
        "Şiddetli yağmur sonrası durum",
        "Otobüs ücretinin artması",
        "Haritanın kaybolması",
        "nach starkem Regen kapanmanın bağlamıdır. Güncel resmî uyarı, önce hazırlanmış harita planından farklı bir bilgi kaynağıdır.",
      ],
      [
        "Uzun yol neden seçiliyor?",
        "Yeterli gün ışığı kaldığı için",
        "Otobüs hiç bulunmadığı için",
        "Yorulmak istedikleri için",
        "Gün ışığı gerekçesi açık verilir. Otobüs alternatif olarak vardır; onu yok saymak karar koşulunu değiştirir.",
      ],
      [
        "Konaklama yeri neden aranıyor?",
        "Boşuna beklenmesini önlemek için",
        "Odayı kesin iptal etmek için",
        "Anahtar satın almak için",
        "damit amaç cümlesi bekleyenleri bilgilendirmeyi açıklar. Aramanın konaklamayı iptal etmek için olduğu söylenmez.",
      ],
      [
        "Geriye dönük öneri ne?",
        "Alternatif bağlantı ve güncel uyarıları kontrol etmek",
        "Bütün uyarıları görmezden gelmek",
        "Her gün daha uzun yürümek",
        "Olumlu deneyim dikkat ihtiyacını ortadan kaldırmaz. Son cümle hem yedek bağlantı hem güncel bilgi denetimini önerir.",
      ],
    ],
    focus: [
      [
        0,
        "hatte",
        "habe",
        "haben",
        "hatte geplant önceki planlamayı geçmiş yolculuktan da önceye yerleştirir. ich ile tekil yardımcı kullanılır.",
      ],
      [
        2,
        "Weil",
        "Obwohl",
        "Damit",
        "Weil uzun yolu seçmenin gerekçesini verir. Amaç veya gerekçeye rağmen yapılan karşıt tercih olarak yorumlama.",
      ],
      [
        4,
        "damit",
        "obwohl",
        "seitdem",
        "damit aramanın amacını anlatır: kimse boşuna beklemesin. Geçmişte aramış olması tek başına bütün bekleyişi kanıtlamaz.",
      ],
      [
        7,
        "würde",
        "würden",
        "würdet",
        "Tekil ich ile würde bugünkü geriye dönük değerlendirmeyi kurar. Sonraki mastar prüfen ile varsayımsal öneri yapılır.",
      ],
    ],
  },
  {
    n: 5,
    title: "Kültür farkları",
    german: "Ein Missverständnis beim Essen",
    category: "culture",
    goal: "Tek bir deneyimden bütün bir kültür hakkında genelleme yapmadan dinle.",
    lines: [
      [
        "Als ich zum ersten Mal bei meiner Kollegin zum Essen war, wollte ich besonders höflich sein. Deshalb wartete ich lange, bevor ich mir nachnahm.",
        "İlk kez iş arkadaşımda yemekteyken özellikle nazik olmak istedim. Bu yüzden ikinci porsiyonu almadan uzun süre bekledim.",
      ],
      [
        "Meine Kollegin dachte, mir schmecke das Essen nicht. Ich wiederum dachte, ich müsse auf eine ausdrückliche Einladung warten.",
        "İş arkadaşım yemeği beğenmediğimi düşündü. Ben ise açık bir davet beklemem gerektiğini düşünüyordum.",
      ],
      [
        "Erst als sie nachfragte, bemerkten wir das Missverständnis. Wir lachten darüber und erklärten einander unsere Gewohnheiten.",
        "Ancak sorunca yanlış anlaşılmayı fark ettik. Buna gülüp birbirimize alışkanlıklarımızı açıkladık.",
      ],
      [
        "Dabei stellte sich heraus, dass selbst ihre Geschwister es anders machen. Es ging also nicht um eine Regel, die für alle gilt.",
        "Kendi kardeşlerinin bile farklı davrandığı ortaya çıktı. Yani herkes için geçerli bir kural söz konusu değildi.",
      ],
      [
        "Später fragte ich, ob ich beim Abräumen helfen könne. Sie freute sich darüber, wollte aber zuerst noch gemeinsam Tee trinken.",
        "Sonra toplamaya yardım edip edemeyeceğimi sordum. Sevindi ama önce birlikte çay içmek istedi.",
      ],
      [
        "Heute versuche ich, freundliche Fragen zu stellen, statt aus jedem Verhalten eine feste kulturelle Regel abzuleiten.",
        "Bugün her davranıştan sabit kültürel kural çıkarmak yerine dostça sorular sormaya çalışıyorum.",
      ],
      [
        "Auch meine eigenen Gewohnheiten kann ich erklären, ohne sie als besser darzustellen. So müssen Unterschiede nicht gleich zu einem Streit führen.",
        "Kendi alışkanlıklarımı da üstün göstermeden açıklayabilirim. Böylece farklılıklar hemen kavgaya dönüşmek zorunda değil.",
      ],
      [
        "Das wichtigste Ergebnis des Abends war für mich nicht die Tischordnung. Es war die Erfahrung, dass Nachfragen Nähe schaffen kann.",
        "Akşamın en önemli sonucu benim için masa düzeni değildi. Soru sormanın yakınlık kurabildiği deneyimiydi.",
      ],
    ],
    checks: [
      [
        "İkinci porsiyon neden bekleniyor?",
        "Açık davet beklediği için",
        "Yemek kesin kötü olduğu için",
        "Yemek kalmadığı için",
        "Anlatıcının nezaket varsayımı beklemeye yol açar. Ev sahibinin beğenmediği yorumu gerçek gerekçe değil bir yanlış anlamadır.",
      ],
      [
        "Yanlış anlama nasıl çözülüyor?",
        "Sorular sorulup alışkanlıklar açıklanıyor",
        "Hiç konuşulmadan ayrılıyorlar",
        "Bir ülke kuralı ilan ediliyor",
        "Nachfragen ve karşılıklı açıklama çözümü sağlar. Anlatı sessizce doğru niyet okumaya veya genellemeye dayanmıyor.",
      ],
      [
        "Kardeşlerle ilgili ayrıntının işlevi?",
        "Aynı çevrede bile farklılık olduğunu göstermek",
        "Tek değişmez kuralı kanıtlamak",
        "Yemeğin fiyatını belirtmek",
        "Kardeşlerin farklı davranması herkesin aynı alışkanlığı taşımadığına örnektir; kültürü tek kalıba indirgeyen yorumu sınırlar.",
      ],
      [
        "Temel sonuç ne?",
        "Sormak yakınlık kurabilir",
        "Bütün farklar kavgaya yol açar",
        "Kendi alışkanlığı her zaman üstündür",
        "Son cümle sorunun ilişki kurucu yönünü vurgular. Daha önceki ohne ... besser da üstünlük iddiasını reddeder.",
      ],
    ],
    focus: [
      [
        0,
        "Als",
        "Wenn",
        "Ob",
        "Als belirli geçmişteki ilk daveti açar. Tekrarlanan her yemek için wenn veya dolaylı soru için ob ile karıştırma.",
      ],
      [
        2,
        "einander",
        "sich selbst",
        "niemandem",
        "einander karşılıklılığı anlatır: iki taraf birbirine açıklar. Yalnız kendine açıklamak veya hiç kimseye açıklamamak değildir.",
      ],
      [
        5,
        "statt",
        "um",
        "seit",
        "statt ... abzuleiten genelleme yerine soru sormayı karşılaştırır. Soruların amacının kural uydurmak olduğu söylenmez.",
      ],
      [
        6,
        "ohne",
        "um",
        "seit",
        "ohne ... darzustellen üstün gösterme davranışının yokluğunu kurar. Kendi alışkanlığını anlatmakla üstünlük ilanı ayrılır.",
      ],
    ],
  },
  {
    n: 6,
    title: "Kişisel görüşler",
    german: "Mehr Platz für Fahrräder?",
    category: "conversation",
    goal: "Bir tartışmada savı, kabul edilen karşı noktayı ve öneriyi ayır.",
    lines: [
      [
        "In unserer Straße sollen einige Parkplätze durch Fahrradständer ersetzt werden. Beim Nachbarschaftstreffen gibt es dazu unterschiedliche Meinungen.",
        "Sokağımızda bazı park yerlerinin bisiklet parklarına dönüştürülmesi planlanıyor. Komşu toplantısında farklı görüşler var.",
      ],
      [
        "Mira findet die Idee gut, weil Fahrräder bisher oft den Gehweg blockieren. Besonders mit einem Kinderwagen kommt man dort schwer vorbei.",
        "Mira fikri destekliyor; bisikletler sık sık kaldırımı kapatıyor. Özellikle bebek arabasıyla geçmek zorlaşıyor.",
      ],
      [
        "Jan versteht dieses Problem, braucht sein Auto aber für wechselnde Arbeitsorte. Er befürchtet, abends noch länger nach einem Platz suchen zu müssen.",
        "Jan bu sorunu anlıyor ama değişen iş yerleri için arabaya ihtiyaç duyuyor. Akşam daha uzun park yeri aramaktan kaygılanıyor.",
      ],
      [
        "Mira sagt, dass nicht jede Person dieselben Möglichkeiten hat. Sie möchte deshalb nicht alle Parkplätze abschaffen, sondern zunächst wenige ersetzen.",
        "Mira herkesin aynı olanaklara sahip olmadığını söylüyor. Bu yüzden tüm yerleri kaldırmak değil, önce az sayıda yeri dönüştürmek istiyor.",
      ],
      [
        "Eine Nachbarin schlägt einen Versuch für drei Monate vor. Währenddessen könnten freie Wege und die Parksituation beobachtet werden.",
        "Bir komşu üç aylık deneme öneriyor. Bu sırada geçiş yolları ve park durumu gözlenebilir.",
      ],
      [
        "Jan stimmt einem Versuch zu, wenn die Ergebnisse offen besprochen werden. Eine dauerhafte Änderung will er erst danach beurteilen.",
        "Jan sonuçlar açıkça konuşulursa denemeye katılıyor. Kalıcı değişikliği ancak sonra değerlendirmek istiyor.",
      ],
      [
        "Am Ende ist noch keine endgültige Entscheidung gefallen. Die Gruppe hat aber konkrete Fragen für das nächste Treffen gesammelt.",
        "Sonunda henüz kesin karar çıkmış değil. Ama grup sonraki toplantı için somut sorular topladı.",
      ],
      [
        "Für mich zeigt das Gespräch, dass Zustimmung nicht immer vollständige Zustimmung bedeutet. Man kann einen Teil unterstützen und bei einem anderen Zweifel haben.",
        "Bana göre konuşma, onayın her zaman tam onay olmadığını gösteriyor. Bir kısmı destekleyip diğerinden kuşku duyabiliriz.",
      ],
    ],
    checks: [
      [
        "Mira'nın gerekçesi ne?",
        "Kaldırımın bisikletlerle kapanması",
        "Arabaların hiç bulunmaması",
        "Toplantının iptal olması",
        "Bebek arabasıyla zor geçiş kaldırım sorununun somut örneğidir. Mira tüm arabaların yok olduğunu söylemiyor.",
      ],
      [
        "Jan neye ihtiyaç duyuyor?",
        "Değişen iş yerleri için arabasına",
        "Her gün bir bisiklet yarışına",
        "Yeni bir çocuk arabasına",
        "Jan'ın çalışma koşulları araç ihtiyacını açıklar. Sorunu kabul etmesi bu ihtiyacı ortadan kaldırmaz.",
      ],
      [
        "Önerilen deneme süresi?",
        "Üç ay",
        "Üç gün",
        "Bir yıl",
        "Drei Monate denemenin süresidir. Kalıcı değişiklik kararı denemenin sonuçlarını izleyen ayrı bir adımdır.",
      ],
      [
        "Toplantı sonunda kalıcı karar var mı?",
        "Henüz yok",
        "Evet, bütün yerler kaldırıldı",
        "Evet, deneme yasaklandı",
        "noch keine endgültige Entscheidung kararın açık olduğunu belirtir. Somut soru toplamak kalıcı uygulama kararı değildir.",
      ],
    ],
    focus: [
      [
        0,
        "ersetzt werden",
        "ersetzen wurde",
        "ersetzt wird",
        "sollen modalı sonrasında edilgen mastar grubu ersetzt werden gelir. Çoğul özneyle değişim planı aktarılır.",
      ],
      [
        3,
        "sondern",
        "denn",
        "oder",
        "nicht alle ..., sondern zunächst wenige düzeltme ve kapsam daraltmasıdır. Tam kaldırma ile sınırlı deneme aynı değildir.",
      ],
      [
        5,
        "wenn",
        "obwohl",
        "damit",
        "wenn Jan'ın desteğini bir koşula bağlar: sonuçlar açıkça tartışılmalı. Koşulsuz kalıcı onay verilmiyor.",
      ],
      [
        6,
        "noch keine",
        "nicht mehr eine",
        "immer eine",
        "noch keine henüz karar çıkmadığını söyler. Daha önce verilmiş kararın artık olmadığı veya her zaman karar olduğu anlamını taşımaz.",
      ],
    ],
  },
  {
    n: 7,
    title: "Günlük hikâyeler",
    german: "Das Paket im falschen Haus",
    category: "stories",
    goal: "Bir yanlış teslimat öyküsünde ipuçlarını ve çözümün sırasını izle.",
    lines: [
      [
        "Als ich nach Hause kam, fand ich vor meiner Tür ein Paket. Mein Name stand darauf, aber die angegebene Hausnummer war falsch.",
        "Eve geldiğimde kapımın önünde paket buldum. Adım üstündeydi ama yazan kapı numarası yanlıştı.",
      ],
      [
        "Zuerst dachte ich, die Lieferung sei für eine andere Person mit demselben Nachnamen. Deshalb öffnete ich das Paket nicht sofort.",
        "Önce aynı soyadlı başka birine ait olduğunu düşündüm. Bu yüzden paketi hemen açmadım.",
      ],
      [
        "Ich verglich die Sendungsnummer mit meiner Bestellbestätigung. Die Nummern stimmten überein, nur die Adresse enthielt einen alten Eintrag.",
        "Takip numarasını sipariş onayımla karşılaştırdım. Numaralar uyuşuyordu; yalnız adreste eski kayıt vardı.",
      ],
      [
        "Meine ehemalige Nachbarin hatte das Paket angenommen und vorbeigebracht. Sie hatte mir eine Nachricht geschickt, die ich noch nicht gelesen hatte.",
        "Eski komşum paketi alıp getirmişti. Henüz okumadığım bir mesaj da göndermişti.",
      ],
      [
        "Ich rief sie an und bedankte mich. Dabei erfuhr ich, dass der Zusteller bei ihr nach mir gefragt hatte.",
        "Onu arayıp teşekkür ettim. Dağıtıcının beni ona sorduğunu bu sırada öğrendim.",
      ],
      [
        "Danach änderte ich die gespeicherte Adresse im Kundenkonto. Vor der nächsten Bestellung wollte ich die Angaben noch einmal kontrollieren.",
        "Sonra müşteri hesabındaki kayıtlı adresi değiştirdim. Sonraki siparişten önce bilgileri yeniden kontrol etmek istedim.",
      ],
      [
        "Im Paket lagen die bestellten Bücher und kein geheimnisvolles Geschenk. Die kleine Überraschung war vielmehr die Hilfe meiner Nachbarin.",
        "Pakette sipariş ettiğim kitaplar vardı; gizemli hediye yoktu. Küçük sürpriz aslında komşumun yardımıydı.",
      ],
      [
        "Seitdem schaue ich zuerst auf Nummer und Absender, bevor ich Vermutungen anstelle. Eine kurze Rückfrage kann eine lange Suche vermeiden.",
        "O zamandan beri tahmin yürütmeden önce numaraya ve göndericiye bakıyorum. Kısa bir soru uzun aramayı önleyebilir.",
      ],
    ],
    checks: [
      [
        "İlk şüphe neden doğuyor?",
        "Kapı numarası yanlış olduğu için",
        "İsim hiç yazmadığı için",
        "Paketin içi boş olduğu için",
        "Ad doğru, kapı numarası yanlıştır. Başlangıçtaki belirsizlik bu iki bilginin çelişkisine dayanır; içi henüz açılmamıştır.",
      ],
      [
        "Paketin kime ait olduğu nasıl doğrulanıyor?",
        "Takip numaraları karşılaştırılarak",
        "Tahmin edilerek",
        "Kitapların rengine bakılarak",
        "Sendungsnummer ile Bestellbestätigung eşleşir. Bu kontrol, ilk varsayımı kanıt yerine kullanmanın önüne geçer.",
      ],
      [
        "Paketi kim getiriyor?",
        "Eski komşusu",
        "Yeni ev sahibi",
        "Kitapçı arkadaşının çocuğu",
        "ehemalige Nachbarin teslim alıp getirir. Mesajın henüz okunmamış olması başta bu yardımın bilinmemesini açıklar.",
      ],
      [
        "Sonradan ne düzeltiliyor?",
        "Kayıtlı adres",
        "Kitapların dili",
        "Komşunun telefon numarası",
        "Kundenkonto içindeki eski adres kaydı değiştirilir. Sorunun çözümü komşunun iletişim bilgisini değiştirmek değildir.",
      ],
    ],
    focus: [
      [
        2,
        "überein",
        "unter",
        "vorbei",
        "übereinstimmen eşleşmek demektir; ayrılabilen fiilde stimmten ... überein kurulur. İki numaranın aynı olduğu doğrulanır.",
      ],
      [
        3,
        "hatte",
        "habe",
        "haben",
        "noch nicht gelesen hatte haberi öğrenmeden önceki okunmamış mesajı gösterir. Tekil ich ile hatte kullanılır.",
      ],
      [
        4,
        "bedankte",
        "bedankten",
        "bedanktest",
        "ich bedankte mich dönüşümlü teşekkür yapısıdır. Tekil anlatıcıya ait geçmiş eylem, farklı kişi ekiyle kurulamaz.",
      ],
      [
        6,
        "vielmehr",
        "deshalb",
        "zuvor",
        "vielmehr sürprizin ne olduğunu yeniden çerçeveler: gizemli içerik değil komşunun yardımı. Bir zaman sırası değildir.",
      ],
    ],
  },
];

export default lessons;
