import { mod } from "./curriculum-module-tools.mjs";
export const basicModules = {
  A1: [
    mod(
      "Kişi ve çekimli fiil",
      "Ana cümlede çekimli fiil ikinci ögededir; fiilin biçimi özneyle uyumludur.",
      "Bir Almanca cümleyi kurarken önce kimden söz ettiğini belirle. Ich kendini, du samimi konuştuğun kişiyi, Sie resmî hitabı gösterir. Fiili mastar olarak bırakmak yerine kişiye uygun biçime getirirsin. İkinci öge ikinci sözcük demek değildir: Heute Morgen iki sözcüklü tek bir zaman ögesi olabilir. Kısa cümlede özne ve çekimli fiili birlikte görmek, daha sonra ekleyeceğin yer ve zaman bilgileri için sağlam bir çerçeve kurar.",
      "Ich lerne ve du lernst aynı eylemi iki farklı kişiyle anlatır. Kişi eki konuşmacının kim olduğunu gösterir; bu yüzden Türkçedeki gibi özneyi her zaman düşürmek doğru değildir. Heute lerne ich derken zaman öne çıkar, fakat lerne ikinci konumda kalır. Özne zamanın ardından üçüncü yerde olabilir. Cümle başındaki bilgiyi değiştirince bütün cümleyi yeniden kurmak yerine çekimli fiilin konumunu sabit tut.",
      "Üç kısa cümle yaz ve özneyi bir çizgiyle, çekimli fiili iki çizgiyle işaretle. Sonra yalnızca ich yerine du koy. Fiil ekini kontrol et; diğer bilgileri aynı bırak. Ardından bir zaman ögesini başa taşı. Eski ve yeni cümlede anlamın hangi yönünün öne çıktığını kendi sözlerinle anlat.",
      "Ich lernen veya Heute ich lerne biçimlerini hedef ana cümle yapısıyla karıştırma.",
      [
        [
          "Ich {lerne~lernen} heute Deutsch.",
          "Bugün Almanca çalışıyorum.",
          "Ich için lernen fiilinin biçimi lerne olur.",
        ],
        [
          "Du {wohnst~wohnen} hier.",
          "Sen burada oturuyorsun.",
          "Du öznesi wohnen fiilinde -st eki alır.",
        ],
        [
          "Heute {arbeite~arbeiten} ich zu Hause.",
          "Bugün evde çalışıyorum.",
          "Zaman başta olsa da çekimli arbeite ikinci ögedir.",
        ],
        [
          "Wir {kommen~kommt} aus Ankara.",
          "Biz Ankara’dan geliyoruz.",
          "Wir için kommen mastarla aynı görünür; kişi uyumu yine vardır.",
        ],
      ],
    ),
    mod(
      "Soru kurmak ve uygun cevabı bulmak",
      "Evet/hayır sorusu çekimli fiille, bilgi sorusu soru ögesiyle başlar.",
      "Bir sorunun amacı cevabın türünü belirler. Wo bir yeri, wann zamanı, wer kişiyi sorar. Evet veya hayırla cevaplanabilen bir soruda çekimli fiil başa gelir: Kommst du? Bir bilgi sorusunda ise önce soru ögesi, ardından fiil bulunur: Wann kommst du? Türkçedeki soru ekini Almancada ayrı bir sözcük gibi aramak yerine başlangıç sırasına dikkat et.",
      "Wo wohnst du sorusuna yer, wann kommst du sorusuna zaman vermek gerekir. Cevapta bütün cümleyi tekrar etmek zorunda değilsin, fakat doğru bilgi türünü seçmelisin. Resmî ve samimi hitapta fiil biçimi değişir: Wohnst du? ve Wohnen Sie? Aynı konuşmanın içinde hitabı sebepsiz yere değiştirmemeye çalış. Soru işareti tek başına yanlış sırayı düzeltmez.",
      "Bir cümleyi önce evet/hayır sorusuna dönüştür, sonra onun bir bilgisini soru ögesiyle sor. Örneğin zaman bilgisini kapat ve wann kullan. Verdiğin cevabın sorulan yere, zamana veya kişiye gerçekten karşılık gelip gelmediğini denetle. Metinde söylenmeyen bilgiyi cevap olarak uydurma.",
      "Wo ile wann veya wer ile wie sözcüklerini yalnızca benzer göründükleri için değiştirme.",
      [
        [
          "{Wo~Wann} wohnst du?",
          "Nerede oturuyorsun?",
          "Wo yer sorar; oturulan yeri öğrenmek istiyoruz.",
        ],
        [
          "{Wann~Wer} beginnt der Kurs?",
          "Kurs ne zaman başlıyor?",
          "Wann başlangıç zamanını sorar.",
        ],
        [
          "{Haben~Hat} Sie Zeit?",
          "Vaktiniz var mı?",
          "Resmî Sie ile haben kullanılır ve soru fiille başlar.",
        ],
        [
          "Wie {heißt~heißen} du?",
          "Adın ne?",
          "Du için heißen fiili heißt olur; wie soru ögesidir.",
        ],
      ],
    ),
    mod(
      "İsim, artikel ve nesne",
      "İsimleri artikelleriyle öğren; erkek Akkusativ nesnede der/ein yerine den/einen kullanılır.",
      "Almanca isimler büyük harfle başlar ve tekil isimlerin dilbilgisel cinsiyeti vardır. Der, die ve das yalnızca Türkçe karşılığı olmayan süsler değildir; sonraki ek ve zamirleri de etkiler. Belirli bir şeyden söz ederken der/die/das, ilk kez veya herhangi bir şeyden söz ederken ein/eine kullanabilirsin. İsim öğrenirken artikeli ve çoğulunu aynı küçük kelime kartında tutmak ilerideki hâl konularını kolaylaştırır.",
      "Cümlede özne ile nesneyi ayır. Der Tisch ist groß cümlesinde masa öznedir. Ich kaufe einen Tisch cümlesinde satın alınan şey nesnedir ve erkek isimde einen görünür. Dişil eine ve nötr ein Akkusativ’te aynı görünebilir; bu, nesne olmadıkları anlamına gelmez. Türkçe karşılığa bakarak her Almanca ismin cinsiyetini tahmin edemezsin.",
      "Örneklerde önce isim grubunu bul, sonra onun cümlede ne yaptığını sor. Bir şeyi alan, gören veya isteyen kişiyi özne; alınan, görülen veya istenen şeyi nesne olarak karşılaştır. Bu ünitede verilen kalıpları kullan, bütün fiillere aynı nesne kuralını genelleme. Çoğul ve artikel için mevcut kelime kartlarına geri dönebilirsin.",
      "Ich kaufe ein Tisch yerine einen Tisch gerekir; Tisch erkek isimdir ve burada nesnedir.",
      [
        [
          "Ich brauche {einen~ein} Stift.",
          "Bir kaleme ihtiyacım var.",
          "Der Stift erkek Akkusativ nesnede einen alır.",
        ],
        [
          "Das ist {eine~ein} Tasche.",
          "Bu bir çanta.",
          "Die Tasche dişildir; belirsiz artikel eine olur.",
        ],
        [
          "Ich lese {ein~einen} Buch.",
          "Bir kitap okuyorum.",
          "Das Buch nötrdür; Akkusativ ein görünümü korunur.",
        ],
        [
          "{Die~Das} Schuhe sind neu.",
          "Ayakkabılar yeni.",
          "Schuhe çoğuldur; belirli çoğul artikel die kullanılır.",
        ],
      ],
    ),
    mod(
      "Zaman ve günlük sıra",
      "Günler am, kesin saatler um ile belirtilir; zaman başta olduğunda fiil ikinci ögede kalır.",
      "Bir günlük plan anlatırken önce gün veya saat gibi dinleyicinin ihtiyaç duyduğu bilgiyi seç. Am Montag haftanın gününü, um acht Uhr saati verir. Heute ve morgen tek başına zaman belirtebilir; her zaman bir edat eklemek gerekmez. Am Morgen sabah, morgen ise yarın olabilir. Büyük harf ve bağlam bazen benzer görünen sözcükleri ayırır.",
      "Ich komme am Montag ile Am Montag komme ich aynı temel zamanı anlatır; ikinci cümle zamanı öne çıkarır. Fakat Am Montag ich komme sırası bu ana cümle kalıbına uymaz. Resmî randevuda açık saat söylemek, konuşma dilindeki farklı saat kalıplarından kaynaklanan belirsizliği azaltır. Saat bilgisi ile eylemin süresini birbirinden ayır.",
      "Hayalî bir gün seç ve üç işi gün/saat bilgisiyle yaz. İlk cümlede zaman ortada, ikinci cümlede başta olsun. Sonra planı okuyup gün, saat ve yapılan işi ayrı not et. Bilgilerden biri yazmıyorsa tamamlamaya çalışma; bilinmeyen zamanı tekrar sorabileceğin kısa bir soru kur.",
      "Am acht Uhr ile um Montag biçimlerini karıştırma; gün ve saat farklı edatlarla gelir.",
      [
        [
          "Der Kurs beginnt {um~am} neun Uhr.",
          "Kurs saat dokuzda başlıyor.",
          "Kesin saat um ile belirtilir.",
        ],
        [
          "Ich komme {am~um} Freitag.",
          "Cuma günü geliyorum.",
          "Haftanın günü am ile kullanılır.",
        ],
        [
          "Morgen {habe~haben} ich Zeit.",
          "Yarın vaktim var.",
          "Zaman başta olsa da habe ikinci konumdadır.",
        ],
        [
          "Wir bleiben {heute~der heute} zu Hause.",
          "Bugün evde kalıyoruz.",
          "Heute bu kullanımda tek başına zaman zarfıdır; artikel almaz.",
        ],
      ],
    ),
    mod(
      "Nicht ve kein ile olumsuzluk",
      "Kein uygun isim grubunu, nicht ise bağlama göre eylemi, sıfatı veya belirli bir bilgiyi olumsuzlar.",
      "Olumsuzlukta yalnızca tek bir ‘değil’ sözcüğü aramak yeterli olmaz. Ich habe kein Auto bir arabaya sahip olmadığını söyler. Das Auto ist nicht neu ise belirli arabanın yeni olmadığını anlatır. Kein bir artikel ailesi gibi çekilir; kein, keine ve keinen biçimleri isim grubuna göre değişir. Nicht’in yeri neyin olumsuzlandığıyla ilişkilidir.",
      "Önce olumlu cümleyi düşün, sonra hangi bilgiyi reddettiğine karar ver. Bir ismin varlığını mı, bir sıfatı mı, belirli bir zamanı mı? Bu karar kelime seçiminden önce gelir. Ich komme heute nicht bir gelmeme durumunu anlatabilir; Ich komme nicht heute, sondern morgen ise özellikle bugünü karşıtlar. İleri ayrıntılar için acele etmeden verilen açık örnekleri karşılaştır.",
      "Bir olumlu isim cümlesi ile bir sıfat cümlesi yaz. Birincisini kein ailesiyle, ikincisini nicht ile olumsuzla. İsim erkek Akkusativ ise keinen biçimini denetle. Cümlenin Türkçe anlamını yeniden söyleyerek yanlışlıkla başka bir bilgiyi reddetmediğinden emin ol. Olumsuz cevabın soruya uygun olup olmadığını da kontrol et.",
      "Ich habe nicht ein Auto her bağlamın varsayılan olumsuzluğu değildir; bu görevde kein Auto kalıbını kullan.",
      [
        [
          "Ich habe {kein~nicht} Fahrrad.",
          "Bisikletim yok.",
          "Belirsiz nötr isim grubunu kein olumsuzlar.",
        ],
        [
          "Die Tasche ist {nicht~kein} teuer.",
          "Çanta pahalı değil.",
          "Teuer sıfattır; nicht ile olumsuzlanır.",
        ],
        [
          "Ich brauche {keinen~kein} Kaffee.",
          "Kahve istemiyorum; kahveye ihtiyacım yok.",
          "Der Kaffee burada erkek Akkusativ nesnedir; keinen kullanılır.",
        ],
        [
          "Wir haben {keine~keinen} Kinder.",
          "Çocuğumuz yok.",
          "Kinder çoğuldur; kein ailesinin biçimi keine olur.",
        ],
      ],
    ),
    mod(
      "İstek ve basit modal çerçeve",
      "Möchte, kann veya muss çekilir; tamamlayıcı fiil mastar olarak sonda durur.",
      "Bir eylemi yapmaktan söz etmek ile onu istemek, yapabilmek veya yapmak zorunda olmak farklı anlamlardır. Ich trinke Wasser ile Ich möchte Wasser trinken cümlelerini karşılaştır. İkinci cümlede istek bildiren möchte çekimlidir, trinken ise mastar kalır. Bütün cümleyi uzatmadan bir ek anlam kazandırırsın. Her modal fiili aynı Türkçe ekle çevirmekten kaçın.",
      "Ich kann, du kannst, wir können gibi biçimlerde kişi uyumunu koru. Cümle araya zaman veya nesne alsa da asıl eylem mastarı sonda kalır. Möchte kibar bir istek için sık kullanılır; muss gereklilik anlatır. Bir kafede ne istediğini söylemek ile bir işi yapabilme becerini söylemek aynı konuşma görevi değildir.",
      "Önce eylemi seç, sonra konuşmacının tutumunu belirle: istiyor mu, yapabiliyor mu, zorunda mı? Uygun çekimli fiili ikinci konuma, mastarı sona koy. Verilen örneğin kişisini değiştirerek tekrar et. Olumsuzluk eklerken anlamın nasıl değiştiğini Türkçe anlat; yalnızca sözcükleri doğru sıraya dizmekle yetinme.",
      "Ich kann schwimme veya ich möchte trinke biçimlerinde mastara kişi eki ekleme.",
      [
        [
          "Ich {möchte~möchten} einen Tee trinken.",
          "Bir çay içmek istiyorum.",
          "Ich için möchte çekilir; trinken sonda mastardır.",
        ],
        [
          "Du {kannst~können} gut schwimmen.",
          "İyi yüzebiliyorsun.",
          "Du için können çekimi kannst olur.",
        ],
        [
          "Wir müssen heute {arbeiten~arbeitet}.",
          "Bugün çalışmamız gerekiyor.",
          "Müssen çekimlidir; asıl eylem mastar kalır.",
        ],
        [
          "Kannst du mir {helfen~hilfst}?",
          "Bana yardım edebilir misin?",
          "Soruda kannst başta, helfen mastarı sonda bulunur.",
        ],
      ],
    ),
  ],
  A2: [
    mod(
      "Geçmişi sıralamak",
      "Perfekt’te haben/sein kişiyle çekilir; Partizip II ana cümlenin sonunda kalır.",
      "Bir deneyimi anlatırken eylemin kendisini ve onun zamanını birlikte kurarsın. Gündelik geçmişte Perfekt sık kullanılır. Yardımcı fiil kişiye göre çekilir; asıl eylemin Partizip II biçimi aynı kalır. Gehen gibi bir yere geçiş bildiren yaygın kullanımlar sein alırken birçok eylem haben alır. Her hareket sözcüğüne otomatik sein seçme; fiilin anlamı ve kullanımını örnekle öğren.",
      "Ich habe einen Film gesehen ile Ich bin nach Hause gegangen cümlelerinde iki parçalı çerçeveyi bul. Gesehen ve gegangen düzensiz biçimlerdir. Başına gestern eklemek çekimli fiilin ikinci öge kuralını kaldırmaz: Gestern habe ich ... Önce tamamlanan olayı açıkla, sonra zaman ve yer bilgisini ekle. Birden fazla olayı dann ve danach ile sıraya koyabilirsin.",
      "Hayalî bir deneyimi üç kısa cümleyle yaz. Her yardımcı fiili özneyle eşleştir ve Partizip II’nin altını çiz. Yardımcı seçimini tek sözcükle değil kullanım bağlamıyla açıkla. Ardından olayların sırasını kontrol et; metinde daha önce geçen bir olayı kendi varsayımınla daha sonraya taşıma.",
      "Gestern ich habe yerine Gestern habe ich; haben veya sein parçasını düşürme.",
      [
        [
          "Ich habe gestern einen Film {gesehen~geseht}.",
          "Dün bir film izledim.",
          "Sehen fiilinin Partizip II biçimi gesehen olur.",
        ],
        [
          "Wir sind nach Hause {gegangen~gegeht}.",
          "Eve gittik.",
          "Gehen bu kullanımda sein ile gegangen biçimini alır.",
        ],
        [
          "Danach {habe~haben} ich gekocht.",
          "Ondan sonra yemek yaptım.",
          "Zaman bağlayıcısından sonra çekimli habe ikinci konumdadır.",
        ],
        [
          "Sie hat ihre Freundin {besucht~gebesucht}.",
          "Arkadaşını ziyaret etti.",
          "Besuchen ayrılamayan be- ön eki nedeniyle ge- almaz.",
        ],
      ],
    ),
    mod(
      "Yan cümleyle neden ve içerik",
      "Weil ve dass yan cümlelerinde çekimli fiil sonda bulunur; ana cümleyle araya virgül konur.",
      "Kısa cümleleri bağlamak, düşünceler arasındaki ilişkiyi açıklar. Weil gerekçe, dass aktarılan düşünce veya içerik kurar. Ich bleibe hier, weil es regnet derken ikinci bölüm bir neden verir. Ich denke, dass ... biçiminde ise ne düşündüğünü söylersin. İki bağlaç aynı sözcük sırasına sahip olabilir ama aynı anlam görevini üstlenmez.",
      "Ana cümlede fiil ikinci konumdayken yan cümlede sonda kapanır. Bu değişikliği baştan fark etmek uzun cümlenin anlaşılmasını kolaylaştırır. Modal varsa Ich bleibe hier, weil ich arbeiten muss deriz; çekimli muss en sona gider. Her bağlaç için bu kuralı genelleme: und ile kurulan eş görevli bağlantı farklıdır.",
      "Önce iki kısa cümle yaz, sonra bunların arasında gerçekten neden ilişkisi olup olmadığını sor. Neden varsa weil ile bağla; düşüncenin içeriğini aktarıyorsan dass kullan. Son olarak çekimli fiilin yerini ve virgülü kontrol et. Türkçeye çevirirken bağlacın verdiği ilişkiyi koru, yalnızca kelime sırasını kopyalama.",
      "Weil ich muss arbeiten yerine weil ich arbeiten muss kullan; neden ile sonucu ters çevirme.",
      [
        [
          "Ich bleibe hier, weil es {regnet~regnen}.",
          "Yağmur yağdığı için burada kalıyorum.",
          "Weil gerekçe verir; regnet yan cümle sonunda çekimlidir.",
        ],
        [
          "Ich weiß, dass du heute {kommst~kommen}.",
          "Bugün geleceğini biliyorum.",
          "Dass içerik yan cümlesini açar; du ile kommst gerekir.",
        ],
        [
          "Sie lernt, weil sie eine Prüfung {hat~haben}.",
          "Sınavı olduğu için ders çalışıyor.",
          "Hat yan cümlede sona gelir ve sie ile uyumludur.",
        ],
        [
          "Wir hoffen, dass alles gut {geht~gehen}.",
          "Her şeyin iyi gitmesini umuyoruz.",
          "Alles tekil özne gibi çekilir; geht sonda bulunur.",
        ],
      ],
    ),
    mod(
      "Edatı anlamıyla ve hâliyle öğrenmek",
      "Mit, bei ve zu Dativ ister; iki hâlli yer edatlarında konum ile hedefi ayrı değerlendir.",
      "Türkçedeki tek bir yer eki Almancada birden fazla edatla karşılanabilir. Bu nedenle ‘nereye?’ sorusu her durumda Akkusativ cevabı doğurmaz: zum Bahnhof bir hedef olsa da zu Dativ alır. In der Küche ile in die Küche ise iki hâlli in edatının konum ve hedef ayrımını gösterir. Önce edatı, sonra bu edatın kullanımını belirle.",
      "Mit dem Bus araçla yolculuğu, bei meiner Freundin birinin yanında bulunmayı anlatır. İsim grubunun artikeli edatın istediği hâle göre değişir. Bir cümlede hem hareket hem bulunulan yer olabilir; hareket sözcüğüne bakarak bütün grupları aynı hâle sokma. Mit dem Bus in die Stadt örneğinde iki grup farklı görev ve hâl taşır.",
      "Örnekte edatın altını çiz ve onu izleyen isim grubunu belirle. Artikelin sözlük biçimini bul; sonra istenen hâli gerekçelendir. Yön veya konum seçimini bir resimle gösterebilirsin. Kendi cümleni kurarken yalnızca bir hedefi değiştir; aynı anda edat ve isim cinsiyetini değiştirmek ilk karşılaştırmayı zorlaştırır.",
      "Zu yön bildirse bile Dativ ister. İki hâlli edatlar için kullanılan wo/wohin ayrımını bütün edatlara yayma.",
      [
        [
          "Ich fahre mit {dem~den} Bus.",
          "Otobüsle gidiyorum.",
          "Mit Dativ ister; der Bus dem Bus olur.",
        ],
        [
          "Wir gehen {zum~zu den} Bahnhof.",
          "İstasyona gidiyoruz.",
          "Zu dem kısalarak zum olur; hedef olsa da Dativ kullanılır.",
        ],
        [
          "Sie ist in {der~die} Küche.",
          "O mutfakta.",
          "In burada mevcut konum bildirir; dişil Dativ der kullanılır.",
        ],
        [
          "Sie geht in {die~der} Küche.",
          "O mutfağa gidiyor.",
          "In bu örnekte hedefe geçiş bildirir; Akkusativ die kullanılır.",
        ],
      ],
    ),
    mod(
      "Karşılaştırmayı açık kurmak",
      "Eşitlik so ... wie, farklılık Komparativ ... als ile kurulur.",
      "İki seçeneği karşılaştırırken önce eşitlik mi farklılık mı söylediğine karar ver. So groß wie aynı büyüklükte, größer als daha büyük demektir. Sıfatın karşılaştırma biçimi her zaman yalnızca -er eklemekle oluşmaz; gut → besser gibi düzensizleri örnekle öğrenirsin. Karşılaştırmayı bir ölçüte bağlamak dinleyicinin hangi açıdan karar verdiğini anlamasını sağlar.",
      "Billiger bir fiyatı, schneller bir hızı karşılaştırabilir. Daha iyi dediğinde hangi ölçütün önemli olduğunu gerekirse ikinci cümlede belirt. Als ile wie farkını tek bir çeviri sözcüğüne indirgeme. Günlük konuşmada farklı biçimler duysan da bu derste eşitlik için wie, farklılık için als kalıbını tutarlı çalışıyoruz.",
      "Aynı iki nesne hakkında bir eşitlik, bir farklılık cümlesi yaz. Ölçütü değiştir: fiyat, uzaklık veya hız. Verdiğin yargının kişisel tercih mi nesnel bilgi mi olduğunu ayır. Bir tabloyu okuyorsan yalnızca tabloda bulunan ölçütü karşılaştır; ucuz olması otomatik olarak daha kaliteli olduğunu göstermez.",
      "Größer wie yerine größer als; so groß als yerine so groß wie kullan.",
      [
        [
          "Der Zug ist schneller {als~wie} der Bus.",
          "Tren otobüsten daha hızlı.",
          "Komparativ schneller farklılık bildirir ve als ile bağlanır.",
        ],
        [
          "Das Zimmer ist so groß {wie~als} meines.",
          "Oda benimki kadar büyük.",
          "So groß eşitlik kalıbı wie ile tamamlanır.",
        ],
        [
          "Diese Lösung ist {besser~guter}.",
          "Bu çözüm daha iyi.",
          "Gut sıfatının karşılaştırma biçimi besser olur.",
        ],
        [
          "Der blaue Mantel ist {günstiger~günstigsten} als der rote.",
          "Mavi palto kırmızıdan daha uygun fiyatlı.",
          "Als ile iki seçenek karşılaştırıldığında Komparativ günstiger uygundur.",
        ],
      ],
    ),
    mod(
      "Dönüşlü fiil ve kişi ilişkisi",
      "Sich freuen gibi dönüşlü yapılarda zamir kişiye uyar: ich freue mich, du freust dich.",
      "Bazı eylemler Almancada dönüşlü zamirle birlikte öğrenilir. Sich freuen, sich interessieren ve sich erinnern sık örneklerdir. Türkçe karşılıklarında ayrı bir ‘kendini’ sözcüğü görünmeyebilir; buna bakarak zamiri düşürme. Fiilin hangi edatla bağlandığı da önemlidir: sich für etwas interessieren bir konuya ilgi duymaktır. Eylemi, zamiri ve gerekiyorsa edatı aynı kalıpta öğren.",
      "Ich interessiere mich ile du interessierst dich karşılaştırmasında hem fiil hem zamir değişir. Sich yalnızca her kişiye yapıştırılan değişmez bir sözcük değildir. Öte yandan her fiile dönüşlü zamir eklemek de yanlıştır. Önce verilen sözlük kalıbını tanı, sonra kim için kullanıldığını belirle. Konu veya nesne bilgisini en son ekle.",
      "Bir örneği üç kişiyle tekrar yaz. Zamirleri renkle, fiil eklerini çizgiyle ayır. Türkçe anlamını okurken zamirin ayrı çevrilmemesinin Almancada gereksiz olduğu anlamına gelmediğini kendine açıkla. Kısa bir hayalî durum seçip sevinç veya ilgi cümlesi kur; özel duygu veya anı paylaşmak zorunda değilsin.",
      "Ich interessiere für ... yerine ich interessiere mich für ... kullan; edatı da kalıpla öğren.",
      [
        [
          "Ich freue {mich~sich} auf das Wochenende.",
          "Hafta sonunu heyecanla bekliyorum.",
          "Ich için dönüşlü zamir mich olur; auf gelecek beklentisini bağlar.",
        ],
        [
          "Du interessierst {dich~mich} für Musik.",
          "Müzikle ilgileniyorsun.",
          "Du için dich gerekir; sich für etwas interessieren bir kalıptır.",
        ],
        [
          "Wir treffen {uns~sich} am Bahnhof.",
          "İstasyonda buluşuyoruz.",
          "Wir için zamir uns olur; karşılıklı buluşma anlatılır.",
        ],
        [
          "Sie erinnert {sich~mich} an den Ausflug.",
          "O geziyi hatırlıyor.",
          "Üçüncü tekil sie için sich kullanılır; erinnern an ile bağlanır.",
        ],
      ],
    ),
    mod(
      "Plan ve amaç için mastar",
      "Planen, versuchen gibi yapılarda zu + mastar; amaç bildirirken um ... zu kullanılabilir.",
      "Bir planı veya amacı tek cümlede anlatmak için mastar yapıları kullanabilirsin. Ich versuche, Deutsch zu lernen bir girişimi anlatır. Ich lerne, um im Alltag besser zu sprechen ise çalışmanın amacını söyler. Aynı zu görünse de yapıların iletişim görevi farklıdır. Bir mastar grubu yeni bir çekimli kişi taşımadığı için özne ilişkisini doğru kurmak önemlidir.",
      "Um ... zu yapısında ana eylemi ve amaç eylemini aynı kişi yaptığında bu dersteki örnekler doğaldır. Amaçta başka bir kişi gerekiyorsa farklı bir yan cümle yapısı gerekebilir. Ayrılabilen fiillerde zu ön ekle kök arasına gelir: einzukaufen. Modal fiilden sonra ise bu örneklerde zu eklenmez; ich möchte lernen deriz.",
      "Önce iki eylemin kimin tarafından yapıldığını yaz. Aynı kişiyse amaç bağını um ... zu ile dene. Sonra mastarın yerini ve virgülü kontrol et. İki eylem arasında amaç değil neden ilişkisi varsa weil ile karşılaştır. Bağlaç seçiminde yalnızca biçime değil, ifade etmek istediğin ilişkiye de bak.",
      "Ich möchte zu lernen yerine ich möchte lernen; her mastardan önce otomatik zu koyma.",
      [
        [
          "Ich versuche, Deutsch {zu lernen~lernen zu}.",
          "Almanca öğrenmeye çalışıyorum.",
          "Versuchen burada zu + mastar grubuyla tamamlanır.",
        ],
        [
          "Wir sparen, um eine Reise {zu machen~machen zu}.",
          "Bir seyahat yapmak için para biriktiriyoruz.",
          "Um ... zu aynı kişilerin amacını anlatır.",
        ],
        [
          "Sie plant, morgen {einzukaufen~zu einkaufen}.",
          "Yarın alışveriş yapmayı planlıyor.",
          "Ayrılabilen einkaufen fiilinde zu araya girer.",
        ],
        [
          "Ich möchte besser {sprechen~zu sprechen}.",
          "Daha iyi konuşmak istiyorum.",
          "Möchte ile tamamlayıcı mastar bu yapıda zu almaz.",
        ],
      ],
    ),
  ],
};
