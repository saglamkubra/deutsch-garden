import { pack } from "./curriculum-pack-tools.mjs";
export const basicPacks = {
  "a1-03": pack(
    "Sayı, saat ve takvim bilgilerini bir günlük plan içinde kullan; süre ile başlangıcı ayır.",
    "Hayalî bir gün için saatleri belirtilmiş altı kısa plan cümlesi yaz.",
    [
      [
        "Ich habe {zwölf~zwanzig} Bücher.",
        "On iki kitabım var.",
        "Zwölf on iki, zwanzig yirmidir; sayının anlamını koru.",
      ],
      [
        "Der Bus kommt {um~am} acht Uhr.",
        "Otobüs saat sekizde geliyor.",
        "Kesin saat um edatıyla belirtilir.",
      ],
      [
        "Der Unterricht ist {am~um} Montag.",
        "Ders pazartesi günü.",
        "Haftanın günü am ile kullanılır.",
      ],
      [
        "Heute ist der {dritte~drei} Mai.",
        "Bugün üç mayıs.",
        "Takvim gününü belirtirken sıra sayısı dritte kullanılır.",
      ],
      [
        "Die Pause dauert {zehn~zehnte} Minuten.",
        "Mola on dakika sürüyor.",
        "Süre miktarı için temel sayı zehn gerekir, sıra sayısı değil.",
      ],
      [
        "Ich komme {morgen~gestern} wieder.",
        "Yarın yeniden geliyorum.",
        "Morgen gelecek günü, gestern önceki günü gösterir.",
      ],
      [
        "Der Kurs beginnt um neun und endet um {elf~zwölf} Uhr.",
        "Kurs dokuzda başlayıp on birde bitiyor.",
        "Elf on birdir; başlangıç ve bitiş bilgilerini ayrı oku.",
      ],
      [
        "Wir treffen uns {heute~der heute} Nachmittag.",
        "Bugün öğleden sonra buluşuyoruz.",
        "Heute Nachmittag artikel gerektirmeyen zaman grubudur.",
      ],
    ],
  ),
  "a1-04": pack(
    "Yiyecek ve içecek iste, menüdeki temel bilgileri anla ve kibar sipariş ver.",
    "İki kişi arasında altı konuşma sıralık hayalî bir kafe diyaloğu yaz.",
    [
      [
        "Ich möchte {einen~ein} Kaffee.",
        "Bir kahve istiyorum.",
        "Der Kaffee erkek Akkusativ nesnede einen alır.",
      ],
      [
        "Für mich bitte {ein~einen} Wasser.",
        "Benim için bir su lütfen.",
        "Das Wasser nötrdür; bu sipariş kalıbında ein kullanılır.",
      ],
      [
        "Die Suppe ist {warm~kalt}.",
        "Çorba sıcak.",
        "Warm sıcak, kalt soğuktur; sıfat anlamı değiştirir.",
      ],
      [
        "Ich esse {kein~nicht} Fleisch.",
        "Et yemiyorum.",
        "Artikelsiz kullanılan nötr isim Fleisch burada kein ile olumsuzlanır.",
      ],
      [
        "Haben Sie {auch~nie} Tee?",
        "Çayınız da var mı?",
        "Auch ek bir seçenek sorar; nie hiçbir zaman anlamına gelir.",
      ],
      [
        "Das Brot kostet {zwei~zwölf} Euro.",
        "Ekmek iki avro.",
        "Zwei iki, zwölf on ikidir; fiyatı karıştırma.",
      ],
      [
        "Wir möchten bitte {bezahlen~bezahlt}.",
        "Hesap ödemek istiyoruz lütfen.",
        "Möchten ardından bezahlen mastarı gelir.",
      ],
      [
        "Der Salat ist {frisch~müde}.",
        "Salata taze.",
        "Frisch yiyeceğin tazeliğini, müde kişinin yorgunluğunu anlatır.",
      ],
    ],
  ),
  "a1-05": pack(
    "Bir günlük rutini kişi, zaman ve ayrılabilen fiillerle kısa cümleler hâlinde anlat.",
    "Hayalî bir kişinin sabahından akşamına altı olay yaz; üç zaman ifadesi kullan.",
    [
      [
        "Ich stehe um sieben Uhr {auf~an}.",
        "Saat yedide kalkıyorum.",
        "Aufstehen ayrılabilen fiildir; çekimli stehe ile ön ek auf ayrılır.",
      ],
      [
        "Danach {frühstücke~frühstücken} ich.",
        "Ondan sonra kahvaltı yapıyorum.",
        "Zaman ögesinden sonra fiil ikinci konumda ve ich için frühstücke olur.",
      ],
      [
        "Ich fahre mit dem Bus {zur~bei der} Arbeit.",
        "İşe otobüsle gidiyorum.",
        "Zur Arbeit işe yönelmeyi gösterir; bei der Arbeit bulunma bağlamıdır.",
      ],
      [
        "Meine Schwester {arbeitet~arbeiten} heute zu Hause.",
        "Kız kardeşim bugün evde çalışıyor.",
        "Tekil Schwester için arbeitet çekimi gerekir.",
      ],
      [
        "Am Mittag mache ich {eine~ein} Pause.",
        "Öğlen bir mola veriyorum.",
        "Die Pause dişil nesnedir; eine kullanılır.",
      ],
      [
        "Nach der Arbeit kaufe ich {ein~aus}.",
        "İşten sonra alışveriş yapıyorum.",
        "Einkaufen ayrılınca ein sona gelir; aus başka bir ön ektir.",
      ],
      [
        "Abends {lese~liest} ich ein Buch.",
        "Akşamları bir kitap okuyorum.",
        "Ich için lesen çekimi lese olur.",
      ],
      [
        "Ich gehe um elf Uhr {schlafen~geschlafen}.",
        "Saat on birde uyumaya gidiyorum.",
        "Schlafen gehen kalıbında schlafen mastarı kullanılır; geçmiş ortaç değil.",
      ],
    ],
  ),
  "a1-06": pack(
    "Ev ve okulda sık kullanılan nesneleri ve basit yer bilgilerini anlaşılır biçimde anlat.",
    "Hayalî bir sınıf veya oda için altı kısa tanıtım cümlesi yaz.",
    [
      [
        "Das ist {mein~meine} Zimmer.",
        "Bu benim odam.",
        "Das Zimmer nötr isimdir; iyelik biçimi mein olur.",
      ],
      [
        "Die Küche ist {klein~kleinen}.",
        "Mutfak küçük.",
        "Sein sonrasındaki yüklem sıfatı bu örnekte ek almaz.",
      ],
      [
        "Im Klassenzimmer sind {zwanzig~zwanzigste} Stühle.",
        "Sınıfta yirmi sandalye var.",
        "Miktar için temel sayı zwanzig kullanılır.",
      ],
      [
        "Ich brauche {einen~ein} Bleistift.",
        "Bir kurşun kaleme ihtiyacım var.",
        "Der Bleistift erkek Akkusativ nesnedir.",
      ],
      [
        "Die Bücher liegen {hier~wohin}.",
        "Kitaplar burada duruyor.",
        "Hier mevcut yeri bildirir; wohin bir hedef sorusudur.",
      ],
      [
        "Die Lehrerin {schreibt~schreiben} an die Tafel.",
        "Öğretmen tahtaya yazıyor.",
        "Tekil Lehrerin için schreibt çekimi kullanılır.",
      ],
      [
        "Unser Haus hat {einen~eine} Garten.",
        "Evimizin bir bahçesi var.",
        "Der Garten erkek nesnedir; einen gerekir.",
      ],
      [
        "Das Fenster ist {offen~öffnen}.",
        "Pencere açık.",
        "Offen durum sıfatıdır; öffnen açmak fiilidir.",
      ],
    ],
  ),
  "a1-07": pack(
    "Fiyat sor, basit ürün bilgilerini karşılaştır ve istediğin ürünü kibarca belirt.",
    "Bir mağazada altı sıralık alışveriş diyaloğu yaz; fiyat ve renk sor.",
    [
      [
        "Wie viel {kostet~kosten} die Jacke?",
        "Ceket ne kadar?",
        "Tekil Jacke için kostet kullanılır.",
      ],
      [
        "Ich suche {einen~ein} Pullover.",
        "Bir kazak arıyorum.",
        "Der Pullover erkek Akkusativ nesnede einen alır.",
      ],
      [
        "Haben Sie diese Schuhe in Größe {achtunddreißig~dreiundachtzig}?",
        "Bu ayakkabılar otuz sekiz numarada var mı?",
        "Achtunddreißig 38, dreiundachtzig 83 demektir.",
      ],
      [
        "Die Tasche ist {rot~roten}.",
        "Çanta kırmızı.",
        "Sein sonrasındaki sıfat bu yapıda ek almaz.",
      ],
      [
        "Kann ich mit Karte {bezahlen~bezahle}?",
        "Kartla ödeyebilir miyim?",
        "Kann ile bezahlen mastarı sonda kalır.",
      ],
      [
        "Ich nehme {die~das} blaue Jacke.",
        "Mavi ceketi alıyorum.",
        "Jacke dişildir; nesnede belirli artikel die kalır.",
      ],
      [
        "Das ist mir zu {teuer~teuren}.",
        "Bu benim için fazla pahalı.",
        "Zu teuer yüklem sıfat grubudur ve bu kullanımda ek almaz.",
      ],
      [
        "Ich brauche {keine~keinen} Tüte.",
        "Poşete ihtiyacım yok.",
        "Die Tüte dişil isim olduğundan keine kullanılır.",
      ],
    ],
  ),
  "a1-08": pack(
    "Basit yön tarifi, ulaşım ve bilet bilgilerini sorup anlayabil.",
    "İstasyonda başlayan kısa bir yol tarifi ve iki bilet sorusu yaz.",
    [
      [
        "Wo ist {der~die} Bahnhof?",
        "İstasyon nerede?",
        "Bahnhof erkek isimdir ve soruda özne olarak der alır.",
      ],
      [
        "Gehen Sie bitte nach {links~gestern}.",
        "Lütfen sola gidin.",
        "Nach links yön bilgisidir; gestern zaman bilgisidir.",
      ],
      [
        "Die Haltestelle ist {rechts~morgen}.",
        "Durak sağda.",
        "Rechts konumu, morgen zamanı anlatır.",
      ],
      [
        "Ich brauche eine Fahrkarte {nach~seit} Berlin.",
        "Berlin’e bir bilete ihtiyacım var.",
        "Şehir hedefine nach kullanılır; seit süre başlangıcıdır.",
      ],
      [
        "Der Zug fährt um zehn Uhr {ab~ein}.",
        "Tren saat onda kalkıyor.",
        "Abfahren kalkmak fiilinin ön eki ab sonda durur.",
      ],
      [
        "Muss ich hier {umsteigen~umgestiegen}?",
        "Burada aktarma yapmam gerekiyor mu?",
        "Muss ile umsteigen mastarı kullanılır.",
      ],
      [
        "Das Museum ist {neben~wann} dem Hotel.",
        "Müze otelin yanında.",
        "Neben yer ilişkisini kuran edattır; wann zaman sorusudur.",
      ],
      [
        "Wie lange dauert die {Fahrt~fährt}?",
        "Yolculuk ne kadar sürüyor?",
        "Fahrt yolculuk ismidir; fährt çekimli fiildir.",
      ],
    ],
  ),
  "a1-09": pack(
    "Hobilerini, yapabildiklerini ve boş zaman tercihlerini kısa cümlelerle anlat.",
    "Kurgusal bir hobi tanıtımı yaz; sevdiğin ve sevmediğin iki etkinlik ekle.",
    [
      [
        "Ich spiele gern {Gitarre~der Gitarre}.",
        "Gitar çalmayı seviyorum.",
        "Bu müzik aleti çalma kalıbında Gitarre artikelsiz kullanılır.",
      ],
      [
        "Am Wochenende {wandere~wandern} ich.",
        "Hafta sonu doğa yürüyüşü yapıyorum.",
        "Ich için wandere çekimi gerekir; zaman başta olduğu için fiil ikinci ögedir.",
      ],
      [
        "Meine Freundin kann gut {zeichnen~zeichnet}.",
        "Arkadaşım iyi çizim yapabiliyor.",
        "Kann ile asıl fiil zeichnen mastar kalır.",
      ],
      [
        "Ich höre {gern~gerne nicht immer niemals} Musik.",
        "Müzik dinlemeyi seviyorum.",
        "Gern eylemin severek yapıldığını belirtir.",
      ],
      [
        "Wir treffen {uns~sich} im Park.",
        "Parkta buluşuyoruz.",
        "Wir öznesiyle bu karşılıklı eylemde uns kullanılır.",
      ],
      [
        "Liest du lieber Bücher {oder~weil} Zeitschriften?",
        "Kitap mı dergi mi okumayı tercih edersin?",
        "Oder iki seçeneği soruda karşılaştırır.",
      ],
      [
        "Ich schwimme {nicht~kein} gern.",
        "Yüzmeyi sevmiyorum.",
        "Gern ile anlatılan tercihi nicht olumsuzlar; kein isim belirleyicisidir.",
      ],
      [
        "Heute habe ich {Zeit~Uhr} für mein Hobby.",
        "Bugün hobime vaktim var.",
        "Zeit süre/zaman imkânını, Uhr saat aracını veya saati belirtir.",
      ],
    ],
  ),
  "a1-10": pack(
    "Günlük konuşmada rica, teşekkür, anlamadığını söyleme ve buluşma önerisi kullan.",
    "Bir arkadaşla kısa buluşma konuşması yaz; bir rica ve bir netleştirme sorusu ekle.",
    [
      [
        "Entschuldigung, ich {verstehe~verstehen} das nicht.",
        "Affedersiniz, bunu anlamıyorum.",
        "Ich için verstehen fiili verstehe olur.",
      ],
      [
        "Können Sie bitte langsamer {sprechen~sprechen Sie}?",
        "Lütfen daha yavaş konuşabilir misiniz?",
        "Können Sie sorusunda sona yalnızca sprechen mastarı gelir.",
      ],
      [
        "Wie schreibt {man~Mann} das?",
        "Bu nasıl yazılır?",
        "Man genel özne, Mann erkek kişi ismidir.",
      ],
      [
        "Vielen {Dank~Danke} für Ihre Hilfe.",
        "Yardımınız için çok teşekkürler.",
        "Vielen Dank yerleşik teşekkür kalıbıdır; Danke ayrı kullanımdır.",
      ],
      [
        "Hast du heute {Abend~gestern} Zeit?",
        "Bu akşam vaktin var mı?",
        "Heute Abend bugünün akşamını anlatan zaman grubudur.",
      ],
      [
        "Wir können uns um sechs Uhr {treffen~getroffen}.",
        "Saat altıda buluşabiliriz.",
        "Können ardından treffen mastarı kullanılır.",
      ],
      [
        "Das passt mir leider {nicht~kein}.",
        "Bu ne yazık ki bana uymuyor.",
        "Passen eylemini bu örnekte nicht olumsuzlar.",
      ],
      [
        "Bis {morgen~gestern}!",
        "Yarın görüşürüz!",
        "Bis morgen gelecek güne yönelik veda kalıbıdır.",
      ],
    ],
  ),
  "a2-04": pack(
    "İş, meslek ve görevleri anlat; deneyimden söz et ve iş ortamında bilgi iste.",
    "Hayalî bir meslek tanıtımı ve görev sorusu içeren sekiz cümle yaz.",
    [
      [
        "Ich arbeite {als~wie} Verkäuferin in einem Geschäft.",
        "Bir mağazada satış görevlisi olarak çalışıyorum.",
        "Meslek rolü als ile belirtilir; burada benzetme yapmıyoruz.",
      ],
      [
        "Zu meinen Aufgaben {gehört~gehören} die Beratung.",
        "Görevlerim arasında danışmanlık var.",
        "Tekil Beratung özne olduğu için gehört kullanılır.",
      ],
      [
        "Ich habe zwei Jahre in einem Büro {gearbeitet~gearbeiten}.",
        "Bir ofiste iki yıl çalıştım.",
        "Arbeiten düzenli Partizip II biçiminde gearbeitet olur.",
      ],
      [
        "Seit einem Jahr {lerne~habe gelernt abgeschlossen} ich Deutsch.",
        "Bir yıldır Almanca öğreniyorum.",
        "Devam eden durum seit ile bu örnekte Präsens alır.",
      ],
      [
        "Könnten Sie mir die Aufgabe {erklären~erklärt}?",
        "Görevi bana açıklayabilir misiniz?",
        "Könnten ardından erklären mastarı gerekir.",
      ],
      [
        "Ich möchte in einem Team {arbeiten~gearbeitet}.",
        "Bir ekipte çalışmak istiyorum.",
        "Möchte ile mastar çalışılır; Partizip II kullanılmaz.",
      ],
      [
        "Die Arbeitszeit beginnt {um~am} acht Uhr.",
        "Mesai saat sekizde başlıyor.",
        "Kesin saat um ile belirtilir.",
      ],
      [
        "Ich bin zuverlässig, weil ich Termine {einhalte~einhalten}.",
        "Süreleri gözettiğim için güvenilirim.",
        "Ich ile einhalte çekilir; weil yan cümlesinde fiil sondadır.",
      ],
    ],
  ),
  "a2-05": pack(
    "Geçmiş olayları sırala, eski durumları war/hatte ile anlat ve kısa bir deneyim metni kur.",
    "Hayalî bir geçmiş gün hakkında sekiz cümle yaz; iki zaman sırası bağlayıcısı kullan.",
    [
      [
        "Als Kind {war~waren} ich oft im Garten.",
        "Çocukken sık sık bahçedeydim.",
        "Ich ile sein geçmiş biçimi war olur.",
      ],
      [
        "Damals {hatte~hatten} meine Familie wenig Zeit.",
        "O zamanlar ailemin az vakti vardı.",
        "Familie tekil olduğu için hatte gerekir.",
      ],
      [
        "Letzten Sommer sind wir ans Meer {gefahren~gefahrt}.",
        "Geçen yaz deniz kıyısına gittik.",
        "Yolculuk anlamındaki fahren burada sein ile gefahren alır.",
      ],
      [
        "Zuerst haben wir die Taschen {ausgepackt~auspacken}.",
        "Önce çantaları boşalttık.",
        "Ayrılabilen auspacken geçmişte ausgepackt olur.",
      ],
      [
        "Danach {haben~sind} wir zusammen gekocht.",
        "Ondan sonra birlikte yemek yaptık.",
        "Kochen bu Perfekt kullanımında haben alır.",
      ],
      [
        "Es hat geregnet, deshalb {blieben~bleiben gegangen} wir drinnen.",
        "Yağmur yağdı, bu yüzden içeride kaldık.",
        "Blieben, bleiben fiilinin çoğul Präteritum biçimidir.",
      ],
      [
        "Ich erinnere {mich~sich} gern an diesen Tag.",
        "Bu günü severek hatırlıyorum.",
        "Sich erinnern fiilinde ich için mich kullanılır.",
      ],
      [
        "Am Ende waren wir müde, {aber~weil} zufrieden.",
        "Sonunda yorgun ama memnunduk.",
        "Aber iki farklı değerlendirmeyi karşıtlayarak bağlar.",
      ],
    ],
  ),
  "a2-06": pack(
    "Tatil için plan, tercih, ulaşım ve rezervasyon isteğini açık biçimde anlat.",
    "Bir hayalî tatil için ulaşım, konaklama ve amaç belirten sekiz cümlelik plan yaz.",
    [
      [
        "Wir planen, im Juni zu {verreisen~verreist}.",
        "Haziranda seyahate çıkmayı planlıyoruz.",
        "Planen burada zu + mastar grubuyla tamamlanır.",
      ],
      [
        "Ich möchte ein Zimmer {reservieren~reserviert}.",
        "Bir oda ayırtmak istiyorum.",
        "Möchte ardından reservieren mastarı gerekir.",
      ],
      [
        "Das Hotel liegt näher am Strand {als~wie} die Pension.",
        "Otel plaja pansiyondan daha yakın.",
        "Näher farklılık karşılaştırmasıdır ve als kullanılır.",
      ],
      [
        "Wir fahren mit dem Zug, weil es bequemer {ist~sein}.",
        "Daha rahat olduğu için trenle gidiyoruz.",
        "Weil yan cümlesinde ist sona gelir.",
      ],
      [
        "Ist das Frühstück im Preis {enthalten~enthält}?",
        "Kahvaltı fiyata dahil mi?",
        "Enthalten dahil olma durumunu anlatır; enthält farklı bir fiil çekimidir.",
      ],
      [
        "Wir sparen, um länger bleiben zu {können~könnt}.",
        "Daha uzun kalabilmek için para biriktiriyoruz.",
        "Amaç grubunda können mastar olarak sona gelir.",
      ],
      [
        "Bei schlechtem Wetter besuchen wir {ein~einen} Museum.",
        "Kötü havada bir müze ziyaret edeceğiz.",
        "Das Museum nötr Akkusativ nesnede ein alır.",
      ],
      [
        "Ich freue mich {auf~über gestern} die Reise.",
        "Seyahati heyecanla bekliyorum.",
        "Sich freuen auf gelecek bir beklentiyi bağlar.",
      ],
    ],
  ),
  "a2-07": pack(
    "Bir hizmet noktasında amacını açıkla, belge ve süre sor, anlamadığın bilgiyi netleştir.",
    "Kurgusal bir hizmet görüşmesi yaz; kişisel kimlik bilgisi kullanmadan belge ve saat sor.",
    [
      [
        "Ich möchte {einen~ein} Antrag stellen.",
        "Bir başvuru yapmak istiyorum.",
        "Der Antrag erkek Akkusativ nesnede einen alır.",
      ],
      [
        "Welche Unterlagen muss ich {mitbringen~bringe mit}?",
        "Hangi belgeleri getirmem gerekiyor?",
        "Muss ile mitbringen birleşik mastar olarak kalır.",
      ],
      [
        "Könnten Sie mir sagen, wo ich warten {soll~sollen}?",
        "Nerede beklemem gerektiğini söyleyebilir misiniz?",
        "Dolaylı soruda ich için soll sonda bulunur.",
      ],
      [
        "Ich habe das Formular schon {ausgefüllt~ausfüllen}.",
        "Formu çoktan doldurdum.",
        "Ayrılabilen ausfüllen fiilinin Partizip II biçimi ausgefüllt olur.",
      ],
      [
        "Die Kopie ist {kostenlos~kostenlosen}.",
        "Kopya ücretsiz.",
        "Sein sonrasındaki sıfat bu kullanımda ek almaz.",
      ],
      [
        "Bis wann muss ich die Unterlagen {abgeben~abgegeben}?",
        "Belgeleri ne zamana kadar teslim etmeliyim?",
        "Muss ile abgeben mastarı gelir; bis wann son zamanı sorar.",
      ],
      [
        "Ich brauche Hilfe, weil ich die Frage nicht {verstehe~verstehen}.",
        "Soruyu anlamadığım için yardıma ihtiyacım var.",
        "Weil sonunda ich için verstehe çekimi gerekir.",
      ],
      [
        "Vielen Dank für {Ihre~Ihren} Erklärung.",
        "Açıklamanız için teşekkür ederim.",
        "Die Erklärung dişil nesnedir; resmî iyelik Ihre olur.",
      ],
    ],
  ),
  "a2-08": pack(
    "Davet et, kabul veya ret gerekçesi ver ve bir kutlamanın ayrıntılarını konuş.",
    "Sekiz konuşma sıralık hayalî davet diyaloğu yaz; bir alternatif zaman öner.",
    [
      [
        "Ich lade dich zu meinem Geburtstag {ein~an}.",
        "Seni doğum günüme davet ediyorum.",
        "Einladen ana cümlede ayrılır; ein sona gider.",
      ],
      [
        "Die Feier findet {am~um} Samstag statt.",
        "Kutlama cumartesi yapılıyor.",
        "Haftanın günü am ile kullanılır; stattfinden ayrılır.",
      ],
      [
        "Ich komme gern, wenn ich Zeit {habe~haben}.",
        "Vaktim olursa memnuniyetle gelirim.",
        "Wenn yan cümlesinde ich için habe sonda bulunur.",
      ],
      [
        "Leider kann ich nicht kommen, weil ich arbeiten {muss~müssen}.",
        "Ne yazık ki çalışmam gerektiği için gelemiyorum.",
        "Modal fiil weil yan cümlesinin en sonunda muss olur.",
      ],
      [
        "Soll ich etwas {mitbringen~bringe mit}?",
        "Yanımda bir şey getireyim mi?",
        "Soll ile mitbringen mastarı soru sonunda kullanılır.",
      ],
      [
        "Wir könnten uns auch am Sonntag {treffen~getroffen}.",
        "Pazar günü de buluşmayı düşünebiliriz.",
        "Könnten yumuşak öneridir; treffen mastardır.",
      ],
      [
        "Ich wünsche dir {alles~alle} Gute.",
        "Sana en iyi dileklerimi sunuyorum.",
        "Alles Gute yerleşik iyi dilek kalıbıdır.",
      ],
      [
        "Danke, dass du an mich {gedacht hast~hast gedacht}.",
        "Beni düşündüğün için teşekkürler.",
        "Dass yan cümlesinde Perfekt yardımcısı en sonda kalır.",
      ],
    ],
  ),
  "a2-09": pack(
    "Mesaj, haber ve çevrimiçi iletişim hakkında konuş; bilgi iste ve temel görüş belirt.",
    "Bir arkadaşına hayalî etkinlik mesajı yaz ve aldığı bilgiyi netleştiren iki soru ekle.",
    [
      [
        "Ich habe dir eine Nachricht {geschickt~geschicken}.",
        "Sana bir mesaj gönderdim.",
        "Schicken düzenli Partizip II biçiminde geschickt olur.",
      ],
      [
        "Kannst du mir den Link {senden~sendest}?",
        "Bana bağlantıyı gönderebilir misin?",
        "Kannst ile senden mastarı sonda kalır.",
      ],
      [
        "Ich höre Podcasts, um besser Deutsch zu {verstehen~verstanden}.",
        "Almancayı daha iyi anlamak için podcast dinliyorum.",
        "Amaç grubunda verstehen mastarı kullanılır.",
      ],
      [
        "Der Artikel ist kürzer {als~wie} das Interview.",
        "Yazı söyleşiden daha kısa.",
        "Komparativ kürzer ile als kullanılır.",
      ],
      [
        "Ich glaube, dass diese Information wichtig {ist~sein}.",
        "Bu bilginin önemli olduğunu düşünüyorum.",
        "Dass yan cümlesinde çekimli ist sonda bulunur.",
      ],
      [
        "Bitte teile keine {privaten~privater} Daten.",
        "Lütfen özel veriler paylaşma.",
        "Keine ile çoğul sıfat tamlamasında privaten biçimi gerekir.",
      ],
      [
        "Weißt du, wann die Sendung {beginnt~beginnen}?",
        "Programın ne zaman başladığını biliyor musun?",
        "Dolaylı soru sonunda tekil Sendung ile beginnt olur.",
      ],
      [
        "Ich interessiere mich {für~mit} deutsche Filme.",
        "Almanca filmlerle ilgileniyorum.",
        "Sich interessieren für bu anlamda yerleşik edat kalıbıdır.",
      ],
    ],
  ),
  "a2-10": pack(
    "İki seçeneği ölçütlerle karşılaştır, tercih belirt ve gerekçeni açıkla.",
    "İki hayalî kursu fiyat, saat ve uzaklık açısından karşılaştıran sekiz cümle yaz.",
    [
      [
        "Dieser Kurs ist günstiger {als~wie} der andere.",
        "Bu kurs diğerinden daha uygun fiyatlı.",
        "Komparativ günstiger karşılaştırmayı als ile kurar.",
      ],
      [
        "Der Onlinekurs ist so lang {wie~als} der Präsenzkurs.",
        "Çevrimiçi kurs yüz yüze kurs kadar uzun.",
        "So ... wie eşitlik karşılaştırmasıdır.",
      ],
      [
        "Ich lerne {lieber~liebst} am Abend.",
        "Akşam çalışmayı tercih ederim.",
        "Lieber tercih bildiren karşılaştırma biçimidir.",
      ],
      [
        "Der erste Termin passt mir {besser~guter}.",
        "İlk saat bana daha uygun.",
        "Gut fiil bağlamında karşılaştırılınca besser olur.",
      ],
      [
        "Ich wähle diesen Kurs, weil er näher {ist~sein}.",
        "Daha yakın olduğu için bu kursu seçiyorum.",
        "Weil gerekçe yan cümlesi sonunda ist bulunur.",
      ],
      [
        "Die kleine Gruppe gefällt {mir~mich}.",
        "Küçük grup hoşuma gidiyor.",
        "Gefallen etkilenen kişiyi Dativ ile alır; ich için mir gerekir.",
      ],
      [
        "Für mich ist die Uhrzeit {wichtiger~wichtigste} als der Preis.",
        "Benim için saat fiyattan daha önemli.",
        "Als iki ölçütü karşılaştıran Komparativ wichtiger ile bağlanır.",
      ],
      [
        "Beide Angebote sind gut, {aber~weil} ich muss mich entscheiden.",
        "İki teklif de iyi ama karar vermem gerekiyor.",
        "Aber karşıt ana cümleyi bağlar; muss ikinci konumdadır.",
      ],
    ],
  ),
};
