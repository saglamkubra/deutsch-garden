const lessons = [
  {
    n: 2,
    title: "Yolculuk hazırlığı",
    german: "Mit dem Zug ans Meer",
    category: "travel",
    goal: "Bir yolculukta kalkış, değişen peron ve aktarma bilgisini ayır.",
    lines: [
      [
        "Morgen fahre ich mit meiner Schwester ans Meer. Wir haben die Fahrkarten schon online gekauft.",
        "Yarın kız kardeşimle denize gidiyorum. Biletleri internetten aldık bile.",
      ],
      [
        "Unser Zug fährt um acht Uhr zwanzig ab. Wir wollen eine halbe Stunde früher am Bahnhof sein.",
        "Trenimiz sekizi yirmi geçe kalkıyor. İstasyonda yarım saat erken olmak istiyoruz.",
      ],
      [
        "In der App steht jetzt Gleis sieben statt Gleis vier. Wir müssen also die neue Anzeige beachten.",
        "Uygulamada artık dört yerine yedinci peron yazıyor. Yeni göstergeye dikkat etmeliyiz.",
      ],
      [
        "In Bremen müssen wir einmal umsteigen. Dafür haben wir fünfundzwanzig Minuten Zeit.",
        "Bremen'de bir kez aktarma yapmalıyız. Bunun için yirmi beş dakikamız var.",
      ],
      [
        "Meine Schwester packt die Fahrkarten und ihre Jacke ein. Ich nehme Wasser, Brot und zwei Äpfel mit.",
        "Kız kardeşim biletleri ve ceketini çantaya koyuyor. Ben su, ekmek ve iki elma alıyorum.",
      ],
      [
        "Am Ziel nehmen wir den Bus zur Unterkunft. Die Bushaltestelle liegt direkt vor dem Bahnhof.",
        "Varınca konaklayacağımız yere otobüsle gideceğiz. Durak istasyonun hemen önünde.",
      ],
      [
        "Wenn der erste Zug zu spät kommt, fragen wir das Personal nach einer anderen Verbindung.",
        "İlk tren geç kalırsa görevlilere başka bir bağlantı soracağız.",
      ],
      [
        "Heute laden wir noch unsere Handys auf. Dann legen wir alles bereit und gehen früh schlafen.",
        "Bugün telefonlarımızı da şarj edeceğiz. Sonra her şeyi hazırlayıp erken yatacağız.",
      ],
    ],
    checks: [
      [
        "Tren ne zaman kalkıyor?",
        "08.20",
        "08.00",
        "08.50",
        "Kayıtta acht Uhr zwanzig kalkıştır; yarım saat önce istasyonda olmak ayrı bir hazırlık planıdır.",
      ],
      [
        "Güncel peron hangisi?",
        "7",
        "4",
        "25",
        "Uygulamadaki yeni bilgi Gleis sieben'dir. Dört eski peron; yirmi beş ise aktarma için ayrılan dakikadır.",
      ],
      [
        "Nerede aktarma yapılacak?",
        "Bremen'de",
        "Varış durağında",
        "Konaklama yerinde",
        "Bremen ara aktarma noktasıdır. Varıştan sonraki otobüs yolculuğu, trenler arasındaki aktarmadan ayrıdır.",
      ],
      [
        "Gecikmede ne yapacaklar?",
        "Görevlilere başka bağlantı soracaklar",
        "Biletleri çöpe atacaklar",
        "Kesinlikle eve dönecekler",
        "Wenn koşulu altında personelden alternatif istenir; kayıt yolculuğun iptal edileceğini söylemez.",
      ],
    ],
    focus: [
      [
        1,
        "ab",
        "ein",
        "aus",
        "abfahren ayrılabilen fiildir. Kalkış cümlesinde fährt çekimlidir, ab sona gider; verilen saati bu eyleme bağla.",
      ],
      [
        2,
        "statt",
        "mit",
        "für",
        "statt iki peron bilgisini karşılaştırır: yeni peron yedi, yerine geçtiği eski peron dörttür; yönü tersine çevirme.",
      ],
      [
        3,
        "umsteigen",
        "umgestiegen",
        "umsteigt",
        "müssen sonrasında mastar umsteigen kullanılır. Bir kez tren değiştirmek, yolculuğun bittiği anlamına gelmez.",
      ],
      [
        6,
        "Wenn",
        "Obwohl",
        "Damit",
        "Wenn gecikme ihtimaline koşul koyar. Henüz trenin kesin geciktiği veya yolculuğun iptal olduğu söylenmez.",
      ],
    ],
  },
  {
    n: 3,
    title: "Restoranda konuşmalar",
    german: "Ein Tisch am Fenster",
    category: "conversation",
    goal: "Sipariş, beslenme tercihi ve hesap ayrıntılarını bir diyalogda takip et.",
    lines: [
      [
        "Guten Abend, wir haben für zwei Personen reserviert. Der Name ist Berger, und die Reservierung ist für sieben Uhr.",
        "İyi akşamlar, iki kişilik rezervasyonumuz var. Berger adına, saat yedi için.",
      ],
      [
        "Ihr Tisch am Fenster ist frei. Möchten Sie zuerst etwas trinken oder gleich die Speisekarte sehen?",
        "Pencere kenarındaki masanız hazır. Önce bir şey içmek mi, doğrudan menüye bakmak mı istersiniz?",
      ],
      [
        "Für mich bitte ein Wasser ohne Kohlensäure. Mein Freund nimmt eine Apfelschorle, aber bitte ohne Eis.",
        "Bana gazsız su lütfen. Arkadaşım elma suyu ile maden suyu karışımı alacak ama buzsuz olsun.",
      ],
      [
        "Ist in der Gemüsesuppe Milch? Ich vertrage keine Milchprodukte und möchte deshalb vorher nachfragen.",
        "Sebze çorbasında süt var mı? Süt ürünlerini tolere edemiyorum, bu yüzden önceden sormak istiyorum.",
      ],
      [
        "Die Suppe enthält Sahne. Ich kann Ihnen aber einen Salat ohne Käse und dazu Brot anbieten.",
        "Çorba krema içeriyor. Ama peynirsiz salata ve yanında ekmek önerebilirim.",
      ],
      [
        "Dann nehme ich den Salat. Mein Freund bestellt die Nudeln, und wir möchten später vielleicht noch einen Nachtisch.",
        "Öyleyse salatayı alayım. Arkadaşım makarna söylüyor; belki sonra bir tatlı daha isteriz.",
      ],
      [
        "Hat es Ihnen geschmeckt? Wenn Sie nichts mehr möchten, bringe ich Ihnen gern die Rechnung.",
        "Beğendiniz mi? Başka bir şey istemiyorsanız hesabı getirebilirim.",
      ],
      [
        "Wir möchten getrennt bezahlen. Kann ich meinen Teil mit Karte zahlen und mein Freund seinen bar?",
        "Ayrı ödemek istiyoruz. Ben kendi payımı kartla, arkadaşım kendi payını nakit ödeyebilir mi?",
      ],
    ],
    checks: [
      [
        "Rezervasyon kaç kişilik?",
        "İki",
        "Yedi",
        "Üç",
        "Zwei Personen kişi sayısıdır. Sieben Uhr rezervasyon saatidir; sayıları aynı bilgi türü gibi değerlendirme.",
      ],
      [
        "Çorba neden seçilmiyor?",
        "Krema içerdiği için",
        "Soğuk olduğu için",
        "Menüde olmadığı için",
        "Kişi süt ürünlerini tolere edemediğini söylüyor; görevli çorbada Sahne olduğunu açıklayınca salataya geçiliyor.",
      ],
      [
        "Tatlı kesin sipariş edildi mi?",
        "Hayır, belki sonra istenecek",
        "Evet, iki tatlı söylendi",
        "Evet, çorbayla geldi",
        "vielleicht ve später planı açık bırakır. Tatlının kesin sipariş edildiğini veya geldiğini kayıt söylemiyor.",
      ],
      [
        "Ödeme tercihi ne?",
        "Ayrı; biri kart, diğeri nakit",
        "Tek hesap ve yalnız nakit",
        "İkisi de ödeme yapmayacak",
        "getrennt ayrı ödemeyi belirtir. mit Karte ve bar iki kişinin tercihlerini ayırır; birlikte tek ödeme değildir.",
      ],
    ],
    focus: [
      [
        0,
        "für zwei Personen",
        "mit zwei Personen",
        "ohne zwei Personen",
        "für zwei Personen rezervasyonun kapsamıdır. mit veya ohne kullanmak iki kişi için ayrılan masa anlamını korumaz.",
      ],
      [
        2,
        "ohne Eis",
        "mit Eis",
        "nur Eis",
        "ohne Eis buz istememe tercihidir. Su için gazsızlık, arkadaşın içeceği için buzsuzluk ayrı ayrıntılardır.",
      ],
      [
        4,
        "enthält",
        "enthalten",
        "enthaltet",
        "Tekil Suppe öznesi enthält ile eşleşir. İçerik Sahne'dir; önerilen peynirsiz salata başka bir yiyecektir.",
      ],
      [
        7,
        "getrennt",
        "zusammen",
        "kostenlos",
        "getrennt ayrı hesap anlamındadır. kostenlos ücretsiz, zusammen birlikte olur; kayıttaki ödeme niyetini değiştirir.",
      ],
    ],
  },
  {
    n: 4,
    title: "Ev ararken",
    german: "Eine Wohnung mit Fragen",
    category: "germany",
    goal: "Ev ilanındaki bilgiyle görüşmede eklenen koşulları ayır.",
    lines: [
      [
        "Ich suche seit zwei Monaten eine kleine Wohnung. Heute besichtige ich eine Wohnung in der Nähe meiner Arbeit.",
        "İki aydır küçük bir ev arıyorum. Bugün işime yakın bir evi geziyorum.",
      ],
      [
        "Sie hat zwei Zimmer und einen Balkon. Die Küche ist klein, aber der Herd und der Kühlschrank bleiben hier.",
        "İki odası ve balkonu var. Mutfak küçük ama ocakla buzdolabı burada kalacak.",
      ],
      [
        "Im Beispiel beträgt die Kaltmiete sechshundert Euro. Für Heizung und andere Nebenkosten kommen hundertfünfzig Euro dazu.",
        "Bu örnekte giderler hariç kira altı yüz avro. Isınma ve diğer ek giderler için yüz elli avro daha ekleniyor.",
      ],
      [
        "Der Vermieter sagt, dass der Strom extra bezahlt wird. Ich frage deshalb, welche Kosten noch nicht im Preis sind.",
        "Ev sahibi elektriğin ayrıca ödendiğini söylüyor. Bu yüzden fiyata hangi giderlerin dahil olmadığını soruyorum.",
      ],
      [
        "Die Straßenbahn hält um die Ecke. Nachts ist es im Schlafzimmer ruhig, denn das Fenster geht zum Hof.",
        "Tramvay köşe başında duruyor. Yatak odası geceleri sessiz; pencere avluya bakıyor.",
      ],
      [
        "Einziehen kann ich erst im nächsten Monat. Die bisherige Mieterin braucht noch Zeit für ihren Umzug.",
        "Ancak gelecek ay taşınabilirim. Önceki kiracının taşınması için biraz daha zamana ihtiyacı var.",
      ],
      [
        "Bevor ich entscheide, möchte ich den Vertrag in Ruhe lesen und offene Fragen schriftlich klären.",
        "Karar vermeden önce sözleşmeyi sakin biçimde okuyup açık soruları yazılı netleştirmek istiyorum.",
      ],
      [
        "Die Besichtigung gefällt mir, aber ich sage noch nicht zu. Morgen vergleiche ich diese Wohnung mit einer zweiten.",
        "Evi beğendim ama henüz kabul etmiyorum. Yarın bu evi ikinci bir evle karşılaştıracağım.",
      ],
    ],
    checks: [
      [
        "İki belirtilen tutarın toplamı kaç?",
        "750 avro",
        "600 avro",
        "150 avro",
        "600 ve 150 toplamı 750'dir; elektrik ayrıca olduğundan bu hesap tüm masrafların kesin toplamı değildir.",
      ],
      [
        "Elektrik belirtilen toplama dahil mi?",
        "Hayır, ayrıca ödenecek",
        "Evet, tamamı dahil",
        "Kayıtta ücretsiz deniyor",
        "Strom extra bezahlt ifadesi ayrı ödeme bildirir. Bu örnek kira hukuku hakkında genel bir kural olarak sunulmuyor.",
      ],
      [
        "Ne zaman taşınabilir?",
        "Gelecek ay",
        "Bugün",
        "İki ay önce",
        "erst im nächsten Monat en erken belirtilen gelecek ayı anlatır; iki ay arama süresidir, taşınma tarihi değildir.",
      ],
      [
        "Evi kabul etti mi?",
        "Henüz değil; karşılaştıracak",
        "Evet, sözleşme imzalandı",
        "Hayır, kesin reddetti",
        "noch nicht zu henüz onay vermediğini söyler. Beğenmesi kesin kabul, karşılaştırması da kesin ret değildir.",
      ],
    ],
    focus: [
      [
        0,
        "seit zwei Monaten",
        "in zwei Monaten",
        "vor zwei Monaten",
        "seit başlangıçtan bugüne süren aramayı taşır. in gelecekteki, vor ise önceki bir noktaya işaret eder; aynı süre değildir.",
      ],
      [
        3,
        "dass",
        "obwohl",
        "damit",
        "dass ev sahibinin söylediği içeriği açar. Elektriğin ayrı ödendiği aktarılır; amaç veya karşıtlık ilişkisi kurulmaz.",
      ],
      [
        5,
        "erst",
        "schon",
        "immer",
        "erst burada daha erken taşınılamadığını sınırlar. schon daha erken veya beklenenden önce okumasına gidebilirdi.",
      ],
      [
        7,
        "noch nicht",
        "nicht mehr",
        "gar nie wieder",
        "noch nicht henüz karar verilmediğini söyler. nicht mehr artık geçerli olmayan önceki kabulü düşündürür; aynı durum değildir.",
      ],
    ],
  },
  {
    n: 5,
    title: "Günlük sorunlar",
    german: "Die Waschmaschine bleibt stehen",
    category: "conversation",
    goal: "Bir arıza konuşmasında belirtiyi, randevuyu ve geçici çözümü takip et.",
    lines: [
      [
        "Meine Waschmaschine bleibt seit gestern mitten im Programm stehen. Das Wasser läuft noch ab, aber die Trommel dreht sich nicht.",
        "Çamaşır makinem dünden beri program ortasında duruyor. Su hâlâ boşalıyor ama tambur dönmüyor.",
      ],
      [
        "Ich rufe den Kundendienst an und beschreibe zuerst das Problem. Die Mitarbeiterin fragt nach der Nummer auf dem Gerät.",
        "Müşteri hizmetlerini arayıp önce sorunu anlatıyorum. Görevli cihazın üstündeki numarayı soruyor.",
      ],
      [
        "Ich soll keine Teile selbst öffnen. Für eine sichere Prüfung muss ein Techniker das Gerät ansehen.",
        "Parçaları kendim açmamam söyleniyor. Güvenli kontrol için teknisyenin cihazı görmesi gerekiyor.",
      ],
      [
        "Der früheste Termin ist am Donnerstag zwischen zehn und zwölf Uhr. Am Mittwoch ist leider niemand mehr frei.",
        "En erken randevu perşembe on ile on iki arasında. Çarşamba boş görevli kalmamış.",
      ],
      [
        "Donnerstag arbeite ich zu Hause, deshalb passt das Zeitfenster. Vor dem Besuch bekomme ich noch eine Nachricht.",
        "Perşembe evden çalışıyorum, bu yüzden saat aralığı uygun. Ziyaretten önce bir mesaj daha gelecek.",
      ],
      [
        "Über die Kosten kann die Mitarbeiterin noch nichts Genaues sagen. Ich bitte darum, den Preis vor einer Reparatur zu klären.",
        "Görevli giderleri henüz kesin söyleyemiyor. Onarımdan önce fiyatın netleştirilmesini rica ediyorum.",
      ],
      [
        "Bis dahin wasche ich die dringend nötigen Sachen bei meiner Schwester. Sie wohnt nur zwei Straßen weiter.",
        "O zamana kadar acil gereken çamaşırları kız kardeşimde yıkayacağım. İki sokak ileride oturuyor.",
      ],
      [
        "Ich schreibe den Termin auf und halte die Gerätenummer bereit. So muss ich beim nächsten Gespräch nicht wieder danach suchen.",
        "Randevuyu yazıp cihaz numarasını hazır tutuyorum. Böylece sonraki konuşmada yeniden aramam gerekmeyecek.",
      ],
    ],
    checks: [
      [
        "Makinede hangi belirti var?",
        "Tambur dönmüyor",
        "Hiç su boşalmıyor",
        "Cihazın numarası yok",
        "Su boşalıyor ama tambur dönmüyor. aber ile karşılaştırılan iki belirtiyi birbirine karıştırma.",
      ],
      [
        "Randevu hangi gün?",
        "Perşembe",
        "Çarşamba",
        "Dün",
        "Donnerstag ziyaret günüdür. Mittwoch boş yer bulunamayan gün, gestern ise arızanın başlangıcıdır.",
      ],
      [
        "Onarım ücreti kesin mi?",
        "Hayır, önceden netleştirilmesi isteniyor",
        "Evet, ücretsiz olduğu söylendi",
        "Evet, iki yüz avro",
        "noch nichts Genaues belirsizliği korur. Kayıt hiçbir kesin fiyat veya ücretsiz onarım sözü vermiyor.",
      ],
      [
        "Geçici çözüm ne?",
        "Acil çamaşırları kız kardeşinde yıkamak",
        "Yeni makine almak",
        "Parçaları kendisi sökmek",
        "Kız kardeşin evi geçici çözümdür. Parçaları açmaması söylenir; kayıt teknik onarım talimatı vermiyor.",
      ],
    ],
    focus: [
      [
        0,
        "seit gestern",
        "morgen",
        "nächste Woche",
        "seit gestern arızanın dünden beri sürdüğünü belirtir. Gelecek zaman ifadeleri bu başlangıç bilgisini vermez.",
      ],
      [
        3,
        "zwischen zehn und zwölf Uhr",
        "vor zehn Uhr",
        "nach zwölf Uhr",
        "zwischen ... und bir saat aralığı kurar. Kesin on randevusu veya on ikiden sonra ziyaret diye daraltma.",
      ],
      [
        4,
        "deshalb",
        "trotzdem",
        "dagegen",
        "Evde çalışmak randevunun uygun oluşunun gerekçesidir. deshalb sonuç ilişkisi kurar, karşıtlık bildirmez.",
      ],
      [
        7,
        "muss",
        "müssen",
        "müsst",
        "Ich tekil özneyle muss eşleşir. nicht tekrar arama zorunluluğunun yokluğunu anlatır; numarayı aramak yasak değildir.",
      ],
    ],
  },
  {
    n: 6,
    title: "Davetler",
    german: "Ein Fest im Innenhof",
    category: "culture",
    goal: "Davette saat, getirilecek yiyecek ve yağmur planını ayırt et.",
    lines: [
      [
        "Am Samstag feiern wir im Innenhof ein kleines Nachbarschaftsfest. Alle aus dem Haus sind eingeladen, auch die neuen Nachbarn.",
        "Cumartesi avluda küçük bir komşuluk şenliği yapıyoruz. Yeni komşular dahil apartmandaki herkes davetli.",
      ],
      [
        "Wir beginnen um vier Uhr nachmittags. Wer beim Aufbauen helfen möchte, kann schon um halb vier kommen.",
        "Öğleden sonra dörtte başlıyoruz. Kuruluma yardım etmek isteyenler üç buçukta gelebilir.",
      ],
      [
        "Jede Person kann etwas zu essen mitbringen, aber das ist keine Pflicht. Getränke und Geschirr sind schon da.",
        "Herkes yiyecek getirebilir ama zorunlu değil. İçeceklerle tabaklar hazır.",
      ],
      [
        "Ich mache einen Kartoffelsalat ohne Fleisch. Meine Nachbarin schreibt die Zutaten auf eine kleine Karte.",
        "Etsiz patates salatası yapıyorum. Komşum malzemeleri küçük bir karta yazıyor.",
      ],
      [
        "Wenn es regnet, treffen wir uns im Gemeinschaftsraum. Die Tür befindet sich links neben dem Fahrradkeller.",
        "Yağmur yağarsa ortak salonda buluşacağız. Kapısı bisiklet bodrumunun solunda.",
      ],
      [
        "Musik gibt es nur leise, damit wir die Nachbarn nicht stören. Gegen acht Uhr räumen wir gemeinsam auf.",
        "Komşuları rahatsız etmemek için müzik kısık olacak. Sekize doğru birlikte toplayacağız.",
      ],
      [
        "Bitte sagt bis Freitag Bescheid, ob ihr kommt. Dann wissen wir ungefähr, wie viele Plätze wir brauchen.",
        "Gelip gelmeyeceğinizi cumaya kadar bildirin lütfen. Böylece yaklaşık kaç yer gerektiğini biliriz.",
      ],
      [
        "Kinder können gern mitkommen. Für das Spiel am Anfang brauchen sie keine besonderen Sachen.",
        "Çocuklar da gelebilir. Başlangıçtaki oyun için özel eşya gerekmiyor.",
      ],
    ],
    checks: [
      [
        "Şenlik hangi saatte başlıyor?",
        "16.00",
        "15.30",
        "20.00",
        "Vier Uhr nachmittags başlangıçtır. Halb vier kurulum yardımı, sekize doğru ise toplama zamanıdır.",
      ],
      [
        "Yiyecek getirmek zorunlu mu?",
        "Hayır, isteğe bağlı",
        "Evet, herkes et getirmeli",
        "Yalnız çocuklar getirmeli",
        "kann ve keine Pflicht bir seçeneği anlatır. Davete katılmak yiyecek getirmeye bağlanmıyor.",
      ],
      [
        "Yağmurda ne yapılacak?",
        "Ortak salonda buluşulacak",
        "Şenlik kesin iptal edilecek",
        "Bisiklet bodrumunda yemek yenilecek",
        "Gemeinschaftsraum yağmur planıdır. Bisiklet bodrumu yalnız salonun kapısını tarif eden konum işaretidir.",
      ],
      [
        "Cumaya kadar ne isteniyor?",
        "Katılım yanıtı",
        "Kesin ücret ödemesi",
        "Özel oyun malzemesi",
        "Bescheid sagen katılımı bildirmektir; amaç yaklaşık yer sayısını bilmektir. Ücret veya özel eşya istenmez.",
      ],
    ],
    focus: [
      [
        1,
        "halb vier",
        "halb fünf",
        "vierzehn Uhr",
        "Almancada halb vier üç buçuktur. Şenliğin dörtteki başlangıcıyla, daha erken kurulum yardımını ayır.",
      ],
      [
        3,
        "ohne Fleisch",
        "mit Fleisch",
        "nur Fleisch",
        "ohne Fleisch etsiz salatayı belirtir. Malzeme listesi ayrıca hazırlanır; kişilerin bütün beslenme tercihlerine dair genelleme yapılmaz.",
      ],
      [
        5,
        "damit",
        "obwohl",
        "seitdem",
        "damit komşuları rahatsız etmeme amacını kurar. Bu bir zaman başlangıcı veya karşıtlık cümlesi değildir.",
      ],
      [
        6,
        "ob",
        "weil",
        "obwohl",
        "ob gelinip gelinmeyeceğinin açık yanıtını ister. Davetli kişinin kesin geleceği önceden kabul edilmez.",
      ],
    ],
  },
  {
    n: 7,
    title: "Kişisel deneyimler",
    german: "Mein erster Tag im Gartenverein",
    category: "stories",
    goal: "Geçmiş deneyimde ilk duygu, yardım ve sonuç arasındaki değişimi izle.",
    lines: [
      [
        "Letzten Sonntag war ich zum ersten Mal im Gartenverein. Ich kannte dort niemanden und war am Anfang ziemlich nervös.",
        "Geçen pazar ilk kez bahçecilik derneğindeydim. Kimseyi tanımıyordum ve başta oldukça gergindim.",
      ],
      [
        "Am Eingang hat mich eine ältere Frau begrüßt. Sie hat mir gezeigt, wo wir unsere Taschen abstellen können.",
        "Girişte yaşlı bir kadın beni karşıladı. Çantaları nereye bırakabileceğimizi gösterdi.",
      ],
      [
        "Zuerst sollten wir Blumen in große Kästen pflanzen. Ich habe die falsche Erde genommen und musste noch einmal fragen.",
        "Önce büyük kasalara çiçek dikecektik. Yanlış toprağı aldım ve yeniden sormam gerekti.",
      ],
      [
        "Niemand hat über meinen Fehler gelacht. Ein anderer Teilnehmer hat mir ruhig erklärt, welche Erde wir brauchen.",
        "Kimse hatama gülmedi. Başka bir katılımcı hangi toprağın gerektiğini sakince açıkladı.",
      ],
      [
        "Nach einer Stunde haben wir eine Pause gemacht. Beim Tee habe ich erfahren, dass viele erst seit Kurzem dabei sind.",
        "Bir saat sonra mola verdik. Çay içerken birçok kişinin daha yeni katıldığını öğrendim.",
      ],
      [
        "Danach habe ich zusammen mit einer Nachbarin die jungen Pflanzen gegossen. Dabei konnten wir uns gut unterhalten.",
        "Sonra bir komşuyla genç bitkileri suladım. Bu sırada güzelce sohbet edebildik.",
      ],
      [
        "Am Ende war ich müde, aber viel entspannter. Ich habe mich für den nächsten Termin auf die Liste geschrieben.",
        "Sonunda yorgundum ama çok daha rahattım. Bir sonraki buluşma için listeye adımı yazdım.",
      ],
      [
        "Jetzt weiß ich, dass ich dort nicht alles sofort können muss. Nachfragen hat mir geholfen, statt mich zu blamieren.",
        "Artık orada her şeyi hemen bilmem gerekmediğini biliyorum. Soru sormak beni utandırmak yerine yardımcı oldu.",
      ],
    ],
    checks: [
      [
        "Başlangıçta nasıl hissediyor?",
        "Gergin",
        "Kızgın",
        "Çok uykulu",
        "ziemlich nervös ilk duyguyu verir. Sonundaki entspannter daha sonraki değişimdir; başlangıca taşınmaz.",
      ],
      [
        "Hangi hata yapılıyor?",
        "Yanlış toprak alınıyor",
        "Buluşma günü unutuluyor",
        "Çantalar kayboluyor",
        "falsche Erde doğrudan belirtilen hatadır. Yardım toprak seçiminedir; çantalar girişteki açıklamanın parçasıdır.",
      ],
      [
        "Diğer katılımcı nasıl davranıyor?",
        "Sakince açıklıyor",
        "Gülüp uzaklaşıyor",
        "Yardım etmeyi reddediyor",
        "ruhig erklärt ve niemand gelacht destekleyici tepkiyi anlatır. Anlatıcının korkusuyla gerçekleşen davranışı ayır.",
      ],
      [
        "Sonunda ne yapıyor?",
        "Bir sonraki buluşmaya yazılıyor",
        "Dernekten kesin ayrılıyor",
        "Yeni buluşmayı iptal ediyor",
        "Listeye yazılması devam niyetidir. Yorgun olması kötü deneyim veya ayrılma kararı anlamına gelmiyor.",
      ],
    ],
    focus: [
      [
        0,
        "Letzten Sonntag",
        "Nächsten Sonntag",
        "Jeden Sonntag",
        "Letzten Sonntag belirli geçmiş pazarı anlatır. Gelecek veya her hafta tekrarlanan olay olarak yorumlama.",
      ],
      [
        1,
        "hat",
        "haben",
        "hast",
        "Tekil Frau ile hat ve begrüßt Perfekt kurar. Karşılayan kişi yaşlı kadındır; anlatıcı girişte karşılanan kişidir.",
      ],
      [
        4,
        "eine Pause gemacht",
        "eine Pause machen",
        "eine Pause macht",
        "haben ... gemacht Perfekttir. Pause ile machen birlikte mola verme anlamını kurar; geçmiş deneyimin sırası korunur.",
      ],
      [
        7,
        "statt",
        "um",
        "ohne",
        "statt burada beklenen olumsuz sonucun yerine yardım oluşunu karşılaştırır. Soru sormanın amacının utanmak olduğu söylenmez.",
      ],
    ],
  },
  {
    id: "listen-a2-grammar-perfekt",
    title: "Gramer Dinleme: geçmişi sıraya koy",
    german: "Was vorher passiert ist",
    category: "grammar",
    goal: "Bir olay anlatısında Perfekt biçimlerini ve olay sırasını ses üzerinden fark et.",
    lines: [
      [
        "Gestern bin ich früh aufgestanden, weil ich einen wichtigen Termin hatte. Vor dem Frühstück habe ich meine Tasche gepackt.",
        "Dün önemli randevum olduğu için erken kalktım. Kahvaltıdan önce çantamı hazırladım.",
      ],
      [
        "Dann habe ich gefrühstückt und das Haus verlassen. Erst an der Haltestelle habe ich gemerkt, dass mein Schlüssel fehlt.",
        "Sonra kahvaltı edip evden çıktım. Ancak durakta anahtarımın olmadığını fark ettim.",
      ],
      [
        "Zum Glück war meine Mitbewohnerin noch zu Hause. Ich habe sie angerufen, und sie hat sofort nachgesehen.",
        "Neyse ki ev arkadaşım hâlâ evdeydi. Onu aradım ve hemen kontrol etti.",
      ],
      [
        "Der Schlüssel lag neben der Kaffeemaschine. Ich bin zurückgelaufen und habe ihn an der Tür bekommen.",
        "Anahtar kahve makinesinin yanında duruyordu. Koşarak geri döndüm ve onu kapıda aldım.",
      ],
      [
        "Meinen ersten Bus habe ich verpasst. Mit dem nächsten Bus bin ich trotzdem noch rechtzeitig angekommen.",
        "İlk otobüsümü kaçırdım. Sonraki otobüsle yine de zamanında vardım.",
      ],
      [
        "Hör beim zweiten Mal auf bin aufgestanden und bin angekommen. Diese Perfektformen werden hier mit sein gebildet.",
        "İkinci dinleyişte bin aufgestanden ve bin angekommen biçimlerine dikkat et. Buradaki Perfekt yapıları sein ile kuruluyor.",
      ],
      [
        "In habe gepackt und habe angerufen steht dagegen haben. Lerne das Hilfsverb immer zusammen mit dem jeweiligen Verb.",
        "habe gepackt ve habe angerufen biçimlerinde ise haben var. Yardımcıyı her zaman ilgili fiille birlikte öğren.",
      ],
      [
        "Die Wörter dann, erst und trotzdem helfen dir beim Verstehen. Sie verbinden die Ereignisse, haben aber verschiedene Aufgaben.",
        "dann, erst ve trotzdem anlamayı kolaylaştırır. Olayları bağlarlar ama görevleri farklıdır.",
      ],
    ],
    checks: [
      [
        "Eksiklik nerede fark ediliyor?",
        "Durakta",
        "Randevu odasında",
        "Kahvaltıdan önce",
        "erst an der Haltestelle fark etme yerini belirtir. Çantanın daha önce hazırlanması, eksikliğin o sırada fark edildiğini göstermez.",
      ],
      [
        "Anahtar nerede bulunuyor?",
        "Kahve makinesinin yanında",
        "Otobüs koltuğunda",
        "Çantanın içinde",
        "lag neben der Kaffeemaschine açık yer bilgisidir. Eve geri koşmanın gerekçesi de bu bulunan anahtardır.",
      ],
      [
        "Sonuçta randevuya geç kalıyor mu?",
        "Hayır, zamanında varıyor",
        "Evet, kesin kaçırıyor",
        "Randevu iptal ediliyor",
        "trotzdem noch rechtzeitig ilk otobüs kaçmasına rağmen zamanında varışı bildirir; sonucu yalnız ilk aksilikten çıkarma.",
      ],
      [
        "Öğretici bölüm ne öneriyor?",
        "Yardımcıyı fiille birlikte öğrenmek",
        "Her fiile haben koymak",
        "Perfektte yardımcıyı silmek",
        "Kayıt sein ve haben örneklerini karşılaştırır. Tek tip yardımcı kuralı vermek yerine fiilin kendi kalıbını öğrenmeyi önerir.",
      ],
    ],
    focus: [
      [
        0,
        "bin",
        "habe",
        "hat",
        "aufstehen verilen Perfektte sein ile kurulur: ich bin aufgestanden. Her geçmiş fiile aynı yardımcıyı ekleme.",
      ],
      [
        2,
        "angerufen",
        "geanruft",
        "anrufen",
        "anrufen ayrılabilen fiildir ve Partizip II angerufen olur. habe ile önceki telefon etme olayı anlatılır.",
      ],
      [
        4,
        "angekommen",
        "angekammt",
        "ankommen",
        "ankommen Partizip II angekommen biçimindedir ve burada bin ile kullanılır. Varış, ilk otobüsün kaçırılmasından sonradır.",
      ],
      [
        7,
        "aber",
        "deshalb",
        "zuvor",
        "aber aynı sözcüklerin olayları bağlamasına rağmen görevlerinin farklı olduğunu vurgular. Bütün bağlayıcılar yalnız zaman sırası değildir.",
      ],
    ],
  },
];

export default lessons;
