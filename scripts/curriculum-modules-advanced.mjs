import { mod } from "./curriculum-module-tools.mjs";
export const advancedModules = {
  C1: [
    mod(
      "İddianın kapsamını hassas belirlemek",
      "Eine mögliche Erklärung ile die einzige Erklärung aynı iddia gücünü taşımaz; kapsam ve kesinliği koru.",
      "İleri bir metinde asıl bilgi bazen uzun isimlerde değil küçük sınırlandırıcılarda bulunur. Zumindest, überwiegend, unter bestimmten Bedingungen ve in dieser Hinsicht gibi ifadeler iddianın nerede geçerli olduğunu gösterir. Bunları çıkarmak daha kısa fakat daha güçlü bir cümle yaratabilir. Akademik dilin amacı yalnızca resmî görünmek değil, hangi veriden ne kadar sonuç çıkarıldığını açık tutmaktır.",
      "Bir sonuç cümlesini okurken özneyi, yüklemi ve kapsam ifadesini ayrı bul. Eine mögliche Erklärung başka açıklamalara yer bırakır; die einzige Erklärung onları dışlar. Bu farkları aynı Türkçe çeviriye sıkıştırma. Önermenin neyi söylediği kadar neyi söylemediği de önemlidir. Kaynak sınırlı örnek üzerinden konuşuyorsa kapsamını küreselleştirmemelisin.",
      "Bir paragrafın iddiasını iki cümleye indir. Önce sınırlandırıcıları kapatıp anlamın ne kadar değiştiğini gör, sonra gerekli olanları geri ekle. Daha güçlü bir iddia kurmak istiyorsan yalnızca sıfat değiştirme; bunu destekleyen gerekçeyi de yaz. Dilsel kesinlik, gerçek kanıtın yerine geçmez.",
      "Möglicherweise ifadesini kesinlikle diye aktarma; ihtiyat belirten ögeleri otomatik silme.",
      [
        [
          "Dies ist {eine mögliche~die einzig denkbare} Erklärung.",
          "Bu, olası açıklamalardan biridir.",
          "Eine mögliche başka açıklamaları dışlamayan sınırlı bir iddiadır.",
        ],
        [
          "Die Ergebnisse gelten {unter bestimmten Bedingungen~ausnahmslos überall}.",
          "Sonuçlar belirli koşullarda geçerli.",
          "Koşul ifadesi kapsamı sınırlar; evrensellik iddiası yoktur.",
        ],
        [
          "Die Maßnahme ist {in dieser Hinsicht~in jeder denkbaren Hinsicht} wirksam.",
          "Önlem bu açıdan etkili.",
          "In dieser Hinsicht yalnızca belirtilen açıdan bir değerlendirme kurar.",
        ],
        [
          "Die Befunde sind {überwiegend~ausnahmslos} konsistent.",
          "Bulgular büyük ölçüde tutarlı.",
          "Überwiegend istisnaları dışlamayan bir çoğunluk değerlendirmesidir.",
        ],
      ],
    ),
    mod(
      "Metin bağdaşıklığı ve gönderim",
      "Dies, dabei ve hingegen gibi ögelerin neye gönderdiğini açık tut; bağlayıcı eklemek tek başına bağdaşıklık yaratmaz.",
      "Bir metindeki cümleler tek tek doğru olsa bile okuyucu ilişkilerini izleyemeyebilir. Gönderim sözcükleri önceki düşünceyi tekrar etmeden taşır, fakat birden fazla olası gönderge varsa belirsizlik doğar. Dies bazen bir isme, bazen önceki bütün önermeye döner. Bu yüzden paragraftaki bağları yalnızca sözcük tekrarları üzerinden değil düşünce ilişkileri üzerinden okumak gerekir.",
      "Hingegen karşılaştırılan noktayı, dabei eş zamanlı veya ilgili boyutu öne çıkarabilir. Bağlam bu ilişkileri belirler. Eine solche Entwicklung derken okuyucunun hangi gelişmeyi tanıması gerektiğini düşün. Uzun araya girdikten sonra yalnızca sie veya dies yazmak yerine merkez ismi yeniden söylemek daha açık olabilir. Aynı sözcükten kaçınmak uğruna yanlış eş anlamlı seçme.",
      "Paragraftaki her zamirin yanına gönderdiği ismi veya cümleyi not et. İki olasılık varsa ifadeyi yeniden yaz. Sonra bağlayıcının gerçekten karşıtlık, sonuç veya ekleme ilişkisinden hangisini kurduğunu sınayarak oku. Cümleleri farklı sıraya koyduğunda gönderimler kopuyorsa bunları yeniden düzenle.",
      "Dies için görünür ve tek bir gönderim bırak; buna karşılık anlamı olmayan yere hingegen ekleme.",
      [
        [
          "Der erste Ansatz spart Zeit; der zweite ist {hingegen~folglich zwangsläufig} genauer.",
          "İlk yaklaşım zaman kazandırır; ikinci ise daha kesin.",
          "Hingegen iki yaklaşımı bir ölçüt farkıyla karşılaştırır.",
        ],
        [
          "Die Frist wurde verkürzt. {Dies~Die Maschine} erschwert die Vorbereitung.",
          "Süre kısaltıldı. Bu durum hazırlığı zorlaştırıyor.",
          "Dies önceki önermenin bütününe gönderir.",
        ],
        [
          "Die Prüfung ist aufwendig. {Dabei~Ohne jeden Bezug} bleiben Details leicht unbemerkt.",
          "İnceleme zahmetli. Bu sırada ayrıntılar kolayca gözden kaçabiliyor.",
          "Dabei önceki süreçle ilişki kurar.",
        ],
        [
          "Eine {solche~beliebige völlig andere} Entwicklung verlangt Anpassungen.",
          "Böyle bir gelişme uyarlamalar gerektirir.",
          "Solche önceki bağlamdaki türü geri çağırır; rastgele yeni bir gelişme değildir.",
        ],
      ],
    ),
    mod(
      "Yazar tutumu ve mesafe",
      "Offenbar, angeblich ve nach eigener Aussage farklı kaynak ve mesafe ilişkileri kurar.",
      "Bir yazar her bilgiyi aynı mesafeden sunmaz. Offenbar mevcut izlenim veya belirtilere dayalı görünürlüğü, angeblich ise bir iddianın başkasından geldiğini ve bazen mesafeyi işaretleyebilir. Ancak angeblich her kullanımda kesin yalan demek değildir. Sözcüğün tonunu bağlam ve metnin diğer parçalarıyla birlikte değerlendir. Tutumu yalnızca tek zarf üzerinden kesinleştirmek hataya yol açabilir.",
      "Nach eigener Aussage ifadesi bilginin kişinin kendi anlatımına dayandığını açıklar. Yazarın bunu doğruladığı sonucu otomatik çıkmaz. Özetlerken hem kaynak hem mesafe işaretini koru. Şüphe, eleştiri ve tarafsız aktarma birbirinden ayrılabilir; bunların derecesi tür ve bağlama bağlıdır. Yazarın yazmadığı bir niyeti kesin özellik olarak ekleme.",
      "Aynı içeriği üç farklı kaynak veya mesafe ifadesiyle yaz. Hangi sürümün gözleme, hangisinin aktarılmış iddiaya dayandığını Türkçe açıkla. Sonra birini rapor özeti için seç ve nedenini belirt. Metindeki iddiayı benimsemeden aktarabilmek, anlatımın belirsiz veya kaçamak olması demek değildir.",
      "Angeblich her zaman yanlış demek değildir; offenbar kesin matematiksel kanıt anlamına gelmez.",
      [
        [
          "{Nach eigener Aussage~Nach unabhängig bewiesener Tatsache} war sie informiert.",
          "Kendi ifadesine göre haberdardı.",
          "Kaynak kişinin kendi anlatımıdır; bağımsız doğrulama iddia edilmez.",
        ],
        [
          "Die Ursache ist {offenbar~zweifelsfrei bewiesen} komplexer.",
          "Görünüşe göre neden daha karmaşık.",
          "Offenbar bir görünürlüğü veya çıkarımı bildirir; mutlak kanıtla eşit değildir.",
        ],
        [
          "Der angebliche Vorteil ist {noch zu prüfen~bereits zweifelsfrei bestätigt}.",
          "İleri sürülen avantajın daha incelenmesi gerekiyor.",
          "Angeblich ve noch zu prüfen mesafeyi ve açık incelemeyi korur.",
        ],
        [
          "Die Autorin {distanziert sich~garantiert die Richtigkeit} von dieser Deutung.",
          "Yazar bu yorumla arasına mesafe koyuyor.",
          "Sich distanzieren bir yorumu üstlenmemeyi anlatır.",
        ],
      ],
    ),
    mod(
      "Üslup ve hedef okur",
      "Aynı içerik farklı metin türlerinde farklı açıklık, yakınlık ve resmiyet gerektirebilir.",
      "Bir uzmana gönderilen teknik not ile konuyu ilk kez duyan kişiye yazılan açıklama aynı dili kullanmak zorunda değildir. Terimi koruyabilir ama ilk kullanımda açıklayabilirsin. Resmî dil her cümleyi edilgen ve isimleştirilmiş yapmak değildir; kimi zaman özneyi görünür kılan kısa bir cümle daha profesyoneldir. Hedef okurun ne bildiğini düşünerek ayrıntıyı seç.",
      "Wir möchten Sie darauf hinweisen resmî bir bilgilendirme, Bitte beachten Sie daha doğrudan bir yönergedir. İkisi her durumda aynı etkiyi yaratmaz. Bir metni dönüştürürken yalnızca hitabı değiştirmek yetmez; bilgi sırası, örnekler ve açıklama derinliği de uyarlanır. İçeriğin sınırlarını veya kaynağını basitleştirme sırasında kaybetmemeye dikkat et.",
      "Bir kısa paragrafı önce uzman, sonra genel okur için yaz. Hangi terimleri açıkladığını ve hangi ayrıntıları öne aldığını karşılaştır. Anlamı değiştirmeden sadeleştirme hedefle. Son kontrolünde metnin talep mi, bilgi mi, uyarı mı olduğunu sor; okurdan beklediğin eylem açık kalmalı.",
      "Resmîlik uğruna anlamı belirsizleştirme; sadeleştirirken olasılığı kesinliğe dönüştürme.",
      [
        [
          "Für ein allgemeines Publikum wird der Begriff zunächst {erläutert~unerklärt vorausgesetzt}.",
          "Genel okur için kavram önce açıklanıyor.",
          "Erläutern ön bilgi varsayımını azaltarak hedef okura uyum sağlar.",
        ],
        [
          "Bitte {beachten~beobachten zufällig} Sie die neue Frist.",
          "Lütfen yeni süreye dikkat edin.",
          "Beachten bu yönergede dikkate alma eylemini ister.",
        ],
        [
          "Die technische Fassung setzt Fachwissen {voraus~außer Kraft}.",
          "Teknik sürüm uzmanlık bilgisi varsayıyor.",
          "Voraussetzen ön bilgi gereksinimini anlatır.",
        ],
        [
          "Die Überarbeitung soll den Inhalt {zugänglich~inhaltlich beliebig} machen.",
          "Düzeltme içeriği anlaşılır ve erişilebilir kılmalı.",
          "Zugänglich yapmak, anlamı keyfî olarak değiştirmek değildir.",
        ],
      ],
    ),
    mod(
      "Kaynakları birleştirirken ayrımları korumak",
      "Sentez, kaynakları sırayla tekrar etmekten çok aralarındaki ortaklık ve ayrımı görünür kılmaktır.",
      "İki kaynak aynı sözcüğü kullanıp farklı şeyi ölçebilir veya aynı olguyu farklı zamanlarda inceleyebilir. Sentez yaparken önce karşılaştırma ölçütünü kur. Birincisi böyle, ikincisi şöyle demek başlangıçtır; asıl beceri nerede uyuştuklarını, nerede farklı varsayımlara dayandıklarını açıklamaktır. Kaynaklar arasındaki uyuşmazlığı kendi tercihinle ortadan kaldırma.",
      "Während Quelle A ... hebt Quelle B ... hervor biçimi iki odağı karşılaştırabilir. Beide Texte ise gerçekten ortak olan noktayı taşır. Bir kaynağın sessiz kaldığı konuyu karşı çıktığı konu diye aktarmamak gerekir. Belirtilmemiş bir bilgi eksiklik olabilir, ancak otomatik çelişki değildir. Kaynakların iddia güçlerini de eşitlemeden koru.",
      "Kaynaklar için amaç, veri, sonuç ve sınır sütunları olan kısa bir not hazırla. Ardından ortak bir soruya cevap veren bir paragraf yaz. Her cümlenin hangi kaynağa dayandığını izleyebiliyor musun? Kendi değerlendirmene geçtiğinde bunu işaretle. Sentezde kaynak cümlelerini kopyalamak yerine ilişkilerini özgün bir yapıyla anlat.",
      "Bir kaynakta yer almayan görüşü o kaynağa atfetme; farklı kapsamı otomatik çelişki sayma.",
      [
        [
          "Beide Texte {betonen~widerlegen ausnahmslos} die Bedeutung der Bildung.",
          "İki metin de eğitimin önemini vurguluyor.",
          "Betonen ortak odağı gösterir; çürütme anlamı taşımaz.",
        ],
        [
          "Quelle A untersucht Kosten, {während~weil zwangsläufig} Quelle B Folgen beschreibt.",
          "A kaynağı maliyetleri incelerken B kaynağı sonuçları anlatıyor.",
          "Während farklı odakları karşılaştırır; zorunlu neden ilişkisi kurmaz.",
        ],
        [
          "Die Aussagen sind nur {bedingt~uneingeschränkt} vergleichbar.",
          "İddialar yalnızca belirli ölçüde karşılaştırılabilir.",
          "Bedingt karşılaştırmanın sınırını korur.",
        ],
        [
          "Aus der fehlenden Erwähnung folgt {keine~eine sichere} Ablehnung.",
          "Söz edilmemesinden ret sonucu çıkmaz.",
          "Sessizlik açık bir karşı çıkışla aynı değildir.",
        ],
      ],
    ),
    mod(
      "Karşı görüşü hakkaniyetle yanıtlamak",
      "Bir itirazı yanıtlamadan önce onun en güçlü ilgili biçimini doğru aktar.",
      "İleri bir tartışmada karşı görüşü kolayca çürütebileceğin zayıf bir sürüme indirgemek ikna gücünü azaltır. Önce karşı tarafın hangi ölçütü veya varsayımı öne çıkardığını doğru anla. Dem ist entgegenzuhalten gibi kalıplar karşılık vermeyi düzenler, fakat gerekçenin yerini tutmaz. Bir noktayı kabul edip ana sonuçta ayrılmak mümkündür.",
      "Zwar ist einzuräumen ... dennoch ... biçimi sınırlı kabul ile devam eden itirazı birlikte taşır. Kabulün kapsamını açık bırakmazsan okur bütün görüşten vazgeçtiğini düşünebilir. İddia, gerekçe, örnek ve sonuç arasındaki bağları ayrı incele. Bir örnek açıklayıcı olabilir fakat bütün durumlar için yeterli kanıt olmayabilir.",
      "Bir görüşe önce tarafsız iki cümlelik özet yaz. Sonra kabul ettiğin ve itiraz ettiğin noktaları ayır. Yanıtında ölçütü veya varsayımı hedef al; kişinin niteliğine ilişkin hüküm ekleme. Son paragrafta yeni bir kanıt sunuyorsan bunun iddiayı nasıl etkilediğini açıkça anlat.",
      "Karşı görüşü çarpıtma; güçlü bir bağlayıcı kullanmak zayıf gerekçeyi otomatik güçlendirmez.",
      [
        [
          "Zwar ist der Einwand berechtigt; {dennoch~folglich ohne weitere Prüfung} bleibt die Lösung tragfähig.",
          "İtiraz yerinde olsa da çözüm uygulanabilirliğini koruyor.",
          "Dennoch sınırlı kabulün ardından farklı değerlendirmeyi sürdürür.",
        ],
        [
          "Dem ist {entgegenzuhalten~wortlos zuzustimmen}, dass Alternativen fehlen.",
          "Buna karşı alternatiflerin bulunmadığı ileri sürülebilir.",
          "Entgegenhalten gerekçeli karşılık sunmayı gösterir.",
        ],
        [
          "Die Kritik betrifft die Annahme, nicht die {Person~Personenabwertung}.",
          "Eleştiri kişiyi değil varsayımı hedef alıyor.",
          "Person ifadesi tartışmanın kişiselleştirilmediğini açıklar.",
        ],
        [
          "Das Beispiel {veranschaulicht~beweist universell} die Schwierigkeit.",
          "Örnek güçlüğü somutlaştırıyor.",
          "Veranschaulichen açıklayıcı işlevdir; evrensel kanıt iddia etmez.",
        ],
      ],
    ),
  ],
  C2: [
    mod(
      "Anlam, çağrışım ve kapsam ayrımı",
      "Bir yakın anlamlı sözcük, aynı göndergeyi gösterse bile aynı değerlendirme ve çağrışımı taşımayabilir.",
      "C2 çalışmasında amaç yalnızca daha seyrek sözcükler seçmek değildir. Sparsam ile geizig aynı davranış alanına bakabilir, ancak değerlendirme tonları farklıdır. Bir değişim sözcüğünün çağrışımı, kesinlik derecesi ve kullanım ortamı metnin etkisini değiştirir. İnce bir farkı fark etmek kadar, o farkın mevcut bağlamda gerçekten ilgili olup olmadığını açıklamak da önemlidir.",
      "Ausschließlich, lediglich ve immerhin gibi sınırlayıcılar yazarın bilgiye verdiği değeri değiştirebilir. Immerhin olumlu bir asgari kazanım vurgularken lediglich küçültücü bir sınır taşıyabilir. Yine de tek sözcük üzerinden yazarın bütün tutumunu kesinleştirme; bağlam, vurgu ve karşıtlıklar birlikte okunmalıdır. Sözlükte benzer karşılık bulmak üslup eşdeğerliğini kanıtlamaz.",
      "Bir cümledeki sıfatı yakın anlamlı başka bir sıfatla değiştir. Temel bilgi aynı mı, yargı tonu değişti mi? İki sürümün hangi okur ve amaç için uygun olduğunu gerekçelendir. Bir nüans hakkında emin değilsen daha açık bir ifade seç; incelik adına belirsizlik üretmek hedef değildir.",
      "Yakın anlamlıları her bağlamda eşdeğer sayma; bir kelimenin çağrışımını değişmez yazar niyeti diye sunma.",
      [
        [
          "Sie lebt {sparsam~geizig}, ohne anderen etwas vorzuenthalten.",
          "Başkalarından bir şey esirgemeden tutumlu yaşıyor.",
          "Sparsam burada olumlu/nötr tutumlulukla uyumludur; geizig olumsuz yargıyı artırır.",
        ],
        [
          "Es ist {immerhin~lediglich enttäuschenderweise} ein Anfang.",
          "Ne de olsa bu bir başlangıç.",
          "Immerhin asgari olumlu kazanımı öne çıkarır.",
        ],
        [
          "Die Zusage gilt {ausschließlich~unter anderem auch} für diesen Fall.",
          "Taahhüt yalnızca bu durum için geçerli.",
          "Ausschließlich kapsamı dışlayıcı biçimde sınırlar.",
        ],
        [
          "Die Formulierung ist {zurückhaltend~triumphal} gewählt.",
          "İfade temkinli bir tonla seçilmiş.",
          "Zurückhaltend gösterişsiz ve ölçülü tonu anlatır.",
        ],
      ],
    ),
    mod(
      "İroni ve örtük çıkarımı ölçülü okumak",
      "İronik yorum bağlamdaki uyumsuzluğa dayanır; tek başına olumlu sözcük ironi kanıtı değildir.",
      "Harika bir plan cümlesi gerçek bir övgü de, başarısızlığın ardından söylenen ironik değerlendirme de olabilir. İroniyi tanımak için sözcük anlamıyla durum arasındaki gerilimi izle. Metin bu gerilimi açıkça kurmuyorsa ironi olasılığını kesin yargıya dönüştürme. Ton, önceki olay ve konuşmacı ilişkisi yoruma katkıda bulunur; yazılı metinde bunların bazıları eksik kalabilir.",
      "Na wunderbar ifadesi bir aksaklığın hemen ardından geldiğinde farklı yorumlanabilir. Bu, sözcüğün her kullanımda ters anlam taşıdığı anlamına gelmez. Örtük bir önerme çıkarırken dayandığın cümleyi göster ve alternatif okumayı mümkünse belirt. Dilsel sezgini gerekçeyle desteklemek ileri okumanın önemli parçasıdır.",
      "Önce ifadenin düz anlamını yaz. Sonra bağlamın bu okumayla uyumlu olup olmadığını sor. Uyumsuzluk varsa olası ironik yorumu açıkla, fakat metinde bulunmayan niyet ve duyguları ekleme. Bir yorumu savunurken hangi ek bağlamın onu değiştirebileceğini de belirt.",
      "Olumlu sıfat gördüğünde otomatik ironi varsayma; çıkarımla açık bilgiyi ayrı tut.",
      [
        [
          "Nach dem dritten Ausfall sagt er {ironisch~zweifelsfrei lobend}: Na wunderbar.",
          "Üçüncü arızadan sonra ironik biçimde ‘Harika’ diyor.",
          "Arıza bağlamı ile olumlu söz arasındaki uyumsuzluk ironiyi destekler.",
        ],
        [
          "Die Ironie ergibt sich aus dem {Kontrast~Wortlaut allein}.",
          "İroni karşıtlıktan doğuyor.",
          "Bağlamdaki karşıtlık önemlidir; yalnızca sözcükler yeterli değildir.",
        ],
        [
          "Diese Deutung ist {plausibel~alternativlos bewiesen}, aber nicht zwingend.",
          "Bu yorum makul ama zorunlu değil.",
          "Plausibel olası bir yorumdur; tek mümkün okuma iddiası taşımaz.",
        ],
        [
          "Der Text legt eine Kritik {nahe~als einziges Faktum fest}.",
          "Metin bir eleştiri yorumunu düşündürüyor.",
          "Nahelegen örtük yönlendirmeyi, kesin ifade etmekten farklı kurar.",
        ],
      ],
    ),
    mod(
      "Deyim, mecaz ve kültürel çağrışım",
      "Deyimi bütün olarak yorumla; sözcük sözcük çeviri iletişim görevini kaçırabilir.",
      "Eine Brücke schlagen çoğu bağlamda fiziksel köprü yapmak değil iki düşünce veya grup arasında bağ kurmaktır. Deyimsel bir ifadeyi anladığını söylemek için yalnızca kelimelerini çevirmek yetmez; bağlamda ne iş yaptığını açıklamalısın. Bütün kültürel göndermeleri her okuyucunun bildiğini varsayma. Gerektiğinde kısa açıklama, eşdeğer mecazdan daha güvenilir olabilir.",
      "Den Nagel auf den Kopf treffen bir şeyi isabetle ifade etmek, Öl ins Feuer gießen ise gerginliği artırmak gibi kullanılır. Ancak her metne deyim eklemek onu daha doğal yapmaz. Konu, tür ve hedef okur belirleyicidir. Çeviride aynı fiziksel imgeleri korumak yerine işlev ve etkiyi dengelemeyi düşün.",
      "Bir deyimi önce düz, sonra bağlamsal anlamıyla yaz. Hangi bilginin mecaz okumayı gerektirdiğini belirt. Hedef okur deyimi tanımıyorsa açıklayıcı bir karşılık seç. Kendi metninde bir deyimi kullanıp kullanmama kararını gerekçelendir; sırf ileri seviye görünsün diye söylemi kalabalıklaştırma.",
      "Deyimi her bağlamda kelime kelime çevirme; resmî bir metne ilgisiz deyim ekleyerek tonu bozma.",
      [
        [
          "Mit der Bemerkung trifft sie den {Nagel~Hammer} auf den Kopf.",
          "Bu sözüyle konuyu tam isabetle ifade ediyor.",
          "Yerleşik deyimde Nagel kullanılır; anlam kelime kelime fiziksel değildir.",
        ],
        [
          "Die Provokation gießt {Öl~Wasser} ins Feuer.",
          "Kışkırtma gerginliği daha da artırıyor.",
          "Öl ins Feuer gießen çatışmayı büyütme anlamındadır.",
        ],
        [
          "Der Vorschlag schlägt eine {Brücke~Mauer} zwischen den Positionen.",
          "Öneri görüşler arasında bir köprü kuruyor.",
          "Brücke schlagen uzlaştırıcı bağlantı kurar.",
        ],
        [
          "Man sollte die Frage nicht auf die {lange Bank~kurze Bühne} schieben.",
          "Meseleyi sürekli ertelememek gerekir.",
          "Auf die lange Bank schieben gereksiz ertelemeyi anlatan yerleşik kalıptır.",
        ],
      ],
    ),
    mod(
      "Müzakerede taviz ve taahhüdü ayırmak",
      "Bir ihtimali değerlendirmeye açık olmak onu kabul etmek veya kesin taahhüt vermek değildir.",
      "Karmaşık bir görüşmede söylenen her olumlu cümle anlaşma anlamına gelmez. Wir wären bereit, darüber zu sprechen yalnızca konuşmaya açıklık gösterebilir. Voraussetzung wäre ... şartı, vorbehaltlich ... ise çekinceyi korur. İleri iletişimde bu küçük sınırları kaybetmek tarafların neye razı olduğunu yanlış aktarmana yol açar. Ton yumuşak olsa da sınırlar kesin olabilir.",
      "Zugeständnis, Zusage ve Prüfbereitschaft farklı eylemlerdir. Bir konuda görüşmeyi kabul etmek sonuca onay vermek değildir. Özet tutanağında neyin açık, neyin koşullu ve neyin karara bağlanmış olduğunu ayrı belirt. Karşı tarafın koşulunu daha kolay görünmesi için silmek, anlaşmanın içeriğini değiştirir.",
      "Bir müzakere metnindeki her eylemi üç gruba ayır: öneri, koşullu açıklık ve kesinleşen karar. Sonra tarafsız bir sonuç notu yaz. Koşulların yerini ve kapsamını koru. Bir cümlenin daha kibar sürümünü üretirken onu daha güçlü bir taahhüde çevirmediğinden emin ol.",
      "Prüfen veya erwägen ifadelerini kabul etmek diye özetleme; çekinceyi düşürme.",
      [
        [
          "Wir wären bereit, den Vorschlag zu {prüfen~garantieren}.",
          "Öneriyi incelemeye hazır olabiliriz.",
          "Prüfen değerlendirme açıklığıdır; kabul veya garanti değildir.",
        ],
        [
          "Die Zustimmung erfolgt {vorbehaltlich~ungeachtet und ohne} einer Prüfung.",
          "Onay, inceleme çekincesiyle veriliyor.",
          "Vorbehaltlich koşullu sınırı korur.",
        ],
        [
          "Dies ist ein {Zugeständnis~endgültiger Gesamtvertrag}, keine vollständige Einigung.",
          "Bu bir tavizdir, tam bir anlaşma değil.",
          "Zugeständnis sınırlı geri adımı gösterir; bütün anlaşmayı ifade etmez.",
        ],
        [
          "Die Frist ist {verhandelbar~bereits unveränderlich vereinbart}.",
          "Süre müzakereye açık.",
          "Verhandelbar henüz değişmez biçimde kararlaştırılmış olmadığını anlatır.",
        ],
      ],
    ),
    mod(
      "Tür değiştirirken işlevi korumak",
      "Bir metni özet, konuşma veya rapora dönüştürürken amaç, kaynak ve iddia gücünü yeniden kontrol et.",
      "Bir araştırma paragrafını konuşmaya dönüştürmek yalnızca cümleleri kısaltmak değildir. Dinleyici geri dönüp okumayacağı için gönderimleri açıklaştırmak, ön bilgiyi düzenlemek ve sözlü geçişler eklemek gerekebilir. Bir konuşmayı tutanağa dönüştürürken ise duygusal tonun yerine karar ve koşulları görünür kılmak önemlidir. Tür değişimi içerik icat etme izni değildir.",
      "Bir özet ana düşünceyi koruyup ayrıntıyı azaltabilir, fakat istisnayı kaldırıp evrensel sonuç üretemez. Bir edebî anlatıyı nötr bilgi metnine çevirirken hangi çağrışımların kaybolduğunu belirt. Hedef türde aynı etki birebir taşınamayabilir. Bu sınırı fark etmek, görünürde pürüzsüz fakat yanlış bir dönüşümden daha değerlidir.",
      "Kaynak metin için bilgi, tutum ve yapı notu çıkar. Sonra hedef türün okurunu ve amacını yaz. Dönüşümden sonra kaynakta olmayan yeni iddiaları işaretle ve çıkar ya da kendi yorumun olarak açıkla. Yalnızca biçimin değil, anlamın ve işlevin de izlenebilir kaldığını denetle.",
      "Tür değiştirirken ihtiyatı kesinliğe, aktarılmış görüşü yazarın kendi iddiasına dönüştürme.",
      [
        [
          "Die Zusammenfassung muss die Einschränkung {beibehalten~stillschweigend streichen}.",
          "Özet sınırlamayı korumalı.",
          "Beibehalten kaynak iddianın kapsamını değiştirmemeyi gerektirir.",
        ],
        [
          "Für den Vortrag werden Verweise {expliziter~unnötig rätselhafter} gemacht.",
          "Sunum için göndermeler daha açık hâle getiriliyor.",
          "Sözlü dinleyici için açık gönderim izlemeyi kolaylaştırır.",
        ],
        [
          "Die Umarbeitung verändert die Form, nicht den {Kern~beliebigen Neuinhalt}.",
          "Yeniden yazım biçimi değiştiriyor, özü değil.",
          "Kern temel içeriktir; yeni bilgi ekleme izni doğmaz.",
        ],
        [
          "Die Quelle wird {kenntlich~unsichtbar} gemacht.",
          "Kaynak açıkça belirtiliyor.",
          "Kenntlich machen bilginin dayanağını görünür tutar.",
        ],
      ],
    ),
    mod(
      "Kesinlik, belirsizlik ve öz düzeltme",
      "İleri ifade, gerektiğinde kendi cümleni daraltıp daha doğru biçimde yeniden kurabilmeyi de kapsar.",
      "Akıcı konuşurken yanlış bir genelleme yapabilir veya kapsamı gereğinden fazla genişletebilirsin. Genauer gesagt, ich sollte präzisieren ve damit meine ich ... gibi öz düzeltme araçları düşünceni açıklaştırır. Düzeltme yalnızca bir sözcük sürçmesini onarmak değildir; iddianın sınırını ve okuyucunun yorumunu da düzenleyebilir. Gereksiz belirsizlik ile haklı ihtiyatı ayırmak önemlidir.",
      "Nicht alle, sondern einige düzeltmesi kapsamı daraltır. Das soll nicht heißen, dass ... olası yanlış bir çıkarımı engeller. Bu araçlar önceki cümledeki sorumluluğu silmez; hangi kısmı değiştirdiğini açıkça göster. Belirsiz bir ifadeyi daha karmaşık terimlerle tekrar etmek açıklık sağlamaz. Daha kesin bir isim veya sınırlandırılmış önerme seç.",
      "Bir paragrafta aşırı genel olabilecek cümleyi bul. Onu Genau genommen ile daralt ve neyi değiştirdiğini Türkçe açıkla. Ardından okuyucunun çıkarabileceği ama senin kastetmediğin sonucu yazıp onu engelleyen bir cümle ekle. Son metni tekrar okuyarak düzeltmenin gerçekten yeni bir açıklık sağlayıp sağlamadığını kontrol et.",
      "Öz düzeltme yaparken önceki belirsizliğin yerine başka bir belirsizlik koyma; değişen kapsamı belirt.",
      [
        [
          "{Genauer gesagt~Völlig zusammenhanglos} betrifft dies nur einen Teil.",
          "Daha doğrusu bu yalnızca bir bölümü ilgilendiriyor.",
          "Genauer gesagt önceki iddiayı hassaslaştıran öz düzeltmedir.",
        ],
        [
          "Nicht alle, {sondern~weil} einige waren betroffen.",
          "Hepsi değil, bazıları etkilendi.",
          "Nicht ... sondern karşıt düzeltmeyi kurar; kapsam daralır.",
        ],
        [
          "Damit {meine~beweise} ich keine allgemeine Regel.",
          "Bununla genel bir kural kastetmiyorum.",
          "Meinen kastedilen kapsamı açıklar; kanıt sunmaz.",
        ],
        [
          "Das soll nicht heißen, dass die Frage erledigt {sei~seien}.",
          "Bu, meselenin kapanmış olduğu anlamına gelmesin.",
          "Tekil Frage için sei kullanılır; istenmeyen çıkarım sınırlandırılır.",
        ],
      ],
    ),
  ],
};
