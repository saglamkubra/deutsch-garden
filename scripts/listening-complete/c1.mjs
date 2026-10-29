const lessons = [
  {
    n: 2,
    title: "İleri röportajlar",
    german: "Zwischen Erinnerung und Dokument",
    category: "culture",
    goal: "Kurgusal röportajda anı, belge ve yorumun farklı kanıt türleri olduğunu ayır.",
    lines: [
      [
        "In diesem fiktiven Interview spricht eine Archivleiterin darüber, wie eine Ausstellung zur Geschichte eines Viertels entsteht. Die erste Frage lautet, ob persönliche Erinnerungen genauso behandelt werden wie amtliche Dokumente.",
        "Bu kurgusal röportajda arşiv yöneticisi mahalle tarihi sergisinin oluşumunu anlatıyor. İlk soru kişisel anılarla resmî belgelerin aynı biçimde ele alınıp alınmadığı.",
      ],
      [
        "Die Leiterin widerspricht der Vorstellung einer einfachen Rangliste. Ein Dokument könne einen Ablauf festhalten, während eine Erinnerung zeige, wie jemand diesen Ablauf erlebt und später gedeutet habe.",
        "Yönetici basit sıralama fikrine karşı çıkıyor. Belge bir süreci kaydederken anı, kişinin süreci nasıl yaşayıp sonradan yorumladığını gösterebilirmiş.",
      ],
      [
        "Auf die Frage nach Widersprüchen antwortet sie, diese würden nicht automatisch aus der Ausstellung entfernt. Vielmehr werde transparent gemacht, welche Angaben voneinander abweichen und welche Fragen offenbleiben.",
        "Çelişkiler sorulunca bunların sergiden otomatik çıkarılmadığını söylüyor. Hangi bilgilerin farklılaştığı ve hangi soruların açık kaldığı şeffafça gösteriliyormuş.",
      ],
      [
        "Ein Beispiel sei die Erinnerung an einen früheren Treffpunkt. Während manche ihn als offen beschreiben, hätten andere sich dort ausgeschlossen gefühlt; beide Erfahrungen dürften sichtbar bleiben.",
        "Örnek eski bir buluşma yeriymiş. Kimileri açık bulurken başkaları dışlanmış hissetmiş; her iki deneyim de görünür kalabilirmiş.",
      ],
      [
        "Die Interviewerin fragt, ob damit jede Aussage gleich wahr werde. Die Leiterin verneint: Nachprüfbare Tatsachen würden weiterhin geprüft, doch subjektives Erleben werde nicht mit einer amtlichen Teilnehmerliste verwechselt.",
        "Röportajcı bunun her ifadeyi eşit doğru yapıp yapmadığını soruyor. Yönetici reddediyor: Denetlenebilir olgular kontrol edilirken öznel deneyim resmî katılımcı listesiyle karıştırılmıyormuş.",
      ],
      [
        "Besonders wichtig sei die Zustimmung zur Veröffentlichung persönlicher Erzählungen. Wer ein Gespräch führe, habe damit nicht automatisch jeder späteren Verwendung zugestimmt.",
        "Kişisel anlatıların yayımlanmasına rıza özellikle önemliymiş. Görüşme yapan kişi böylece sonraki her kullanıma otomatik onay vermiş sayılmazmış.",
      ],
      [
        "Für das Publikum sollen kurze Quellenhinweise die Einordnung erleichtern. Sie ersetzen keine vollständige Forschung, machen aber die Herkunft zentraler Aussagen nachvollziehbar.",
        "Kısa kaynak notları izleyicinin değerlendirmesini kolaylaştıracak. Tam araştırmanın yerini tutmuyor ama temel ifadelerin kaynağını izlenebilir kılıyor.",
      ],
      [
        "Zum Schluss beschreibt die Leiterin die Ausstellung nicht als endgültiges Urteil. Sie sei ein begründeter Zwischenstand, der ergänzt werden könne, wenn neue Materialien oder Perspektiven hinzukämen.",
        "Yönetici sergiyi nihai hüküm diye tanımlamıyor. Yeni malzeme veya bakış açıları gelirse genişletilebilecek gerekçeli ara durummuş.",
      ],
    ],
    checks: [
      [
        "Yönetici basit kaynak sıralamasına neden karşı?",
        "Kaynaklar farklı soruları aydınlatabilir",
        "Belgeler hiçbir bilgi vermez",
        "Bütün anılar kusursuz kayıttır",
        "Belge süreci, anı yaşantı ve yorumu gösterebilir. Bu ayrım ikisini bütünüyle değersiz veya hatasız ilan etmez.",
      ],
      [
        "Çelişkiler nasıl ele alınıyor?",
        "Kaynak farkları açıkça gösteriliyor",
        "Hepsi sessizce siliniyor",
        "Rastgele tek anlatı kesin seçiliyor",
        "Transparent gemacht ifadesi farkların görünür tutulmasıdır. Bu, bütün olguları incelemeden eşit doğru ilan etmek değildir.",
      ],
      [
        "Görüşmeye katılım neyi garanti etmez?",
        "Her sonraki kullanıma rızayı",
        "Bir konuşma yapıldığını",
        "Bir deneyimin anlatıldığını",
        "Görüşmeye katılmak ile yayın ve yeniden kullanım kapsamı ayrılır. Rızanın sınırını sessizce genişletmemek gerekir.",
      ],
      [
        "Sergi nasıl çerçeveleniyor?",
        "Gerekçeli ve genişletilebilir ara sonuç",
        "Tartışılmaz son hüküm",
        "Araştırmasız rastgele seçki",
        "Zwischenstand yeni malzeme ile değişebilirliği korur. Kaynaklı olması nihai ve değişmez olduğu anlamına gelmiyor.",
      ],
    ],
    focus: [
      [
        1,
        "während",
        "damit",
        "sobald",
        "während bu bağlamda iki kaynak türünün görevini karşılaştırır. Amaç veya gerçekleşme başlangıcı ilişkisi kurulmaz.",
      ],
      [
        2,
        "Vielmehr",
        "Zuvor",
        "Folglich",
        "Vielmehr çıkarma varsayımının yerine şeffaf gösterme yaklaşımını koyar. Sırf zaman sırası veya zorunlu sonuç değildir.",
      ],
      [
        4,
        "verneint",
        "verneinen",
        "verneinst",
        "Tekil Leiterin ile verneint eşleşir. Reddedilen görüş her ifadenin aynı doğruluk statüsüne sahip olduğu çıkarımıdır.",
      ],
      [
        7,
        "könne",
        "könnest",
        "könnet",
        "Tekil Zwischenstand ile Konjunktiv I könne aktarılan genişletilebilirliği kurar. Serginin kesin tamamlanmış hüküm olmadığı korunur.",
      ],
    ],
  },
  {
    n: 3,
    title: "Karmaşık toplumsal konular",
    german: "Digitale Angebote und echte Zugänge",
    category: "germany",
    goal: "Hizmete erişimde teknik olanakla gerçek kullanılabilirliği ayır.",
    lines: [
      [
        "Eine fiktive Gemeinde möchte bestimmte Anträge nur noch über ein Onlineportal anbieten. In der Diskussion wird dies zunächst als Vereinfachung für alle beschrieben, weil Wege und Wartezeiten entfielen.",
        "Kurgusal belediye bazı başvuruları yalnız çevrim içi sunmak istiyor. Yol ve bekleme azalacağından bu, başta herkes için kolaylaşma diye anlatılıyor.",
      ],
      [
        "Eine Beratungsstelle hält dem entgegen, dass ein vorhandenes Gerät nicht automatisch sichere Nutzung ermöglicht. Sprachliche Hürden, schwer lesbare Formulare und fehlende Unterstützung könnten weiterhin Zugänge versperren.",
        "Danışma merkezi cihaz sahibi olmanın güvenli kullanımı otomatik sağlamadığını söylüyor. Dil engeli, okunması zor formlar ve destek eksikliği erişimi engelleyebilir.",
      ],
      [
        "Der Projektleiter räumt diese Probleme ein, verweist aber auf begrenzte Mittel. Ein dauerhaft doppeltes Angebot sei aufwendig; deshalb müssten die tatsächlichen Bedarfe genauer erhoben werden.",
        "Proje yöneticisi sorunları kabul ediyor ama kaynakların sınırlı olduğunu belirtiyor. Sürekli iki kanallı hizmet maliyetliymiş; gerçek ihtiyaç daha iyi ölçülmeliymiş.",
      ],
      [
        "Eine Teilnehmerin warnt davor, Nichtnutzung vorschnell als mangelndes Interesse zu deuten. Wer wiederholt an einem Formular scheitere, tauche in einer einfachen Nutzungsstatistik möglicherweise gar nicht auf.",
        "Bir katılımcı kullanmamayı ilgisizlik saymaya karşı uyarıyor. Formda tekrar tekrar zorlanan kişi basit kullanım istatistiğinde hiç görünmeyebilir.",
      ],
      [
        "Vorgeschlagen wird eine begleitete Testphase, in der auch abgebrochene Vorgänge freiwillig beschrieben werden können. Persönliche Angaben sollen dabei auf das für die Auswertung Nötige begrenzt bleiben.",
        "Yarıda bırakılan işlemlerin gönüllü anlatılabildiği destekli deneme öneriliyor. Kişisel bilgiler değerlendirmeye gerekenle sınırlı kalmalı.",
      ],
      [
        "Daneben soll vorerst eine erreichbare Ansprechstelle bestehen bleiben. Sie ist nicht als Gegenmodell zur Digitalisierung gedacht, sondern als Teil eines zugänglichen Gesamtangebots.",
        "Bu sırada ulaşılabilir danışma noktası şimdilik kalacak. Dijitalleşmenin karşıtı değil, erişilebilir toplam hizmetin parçası olarak düşünülüyor.",
      ],
      [
        "Die Gruppe unterscheidet am Ende zwischen technischer Bereitstellung und tatsächlicher Teilhabe. Ein Portal kann funktionieren, ohne dass jede betroffene Person es unter ihren Bedingungen sinnvoll nutzen kann.",
        "Grup teknik sunumla gerçek katılımı ayırıyor. Portal çalışabilir ama her ilgili kişi kendi koşullarında onu kullanamayabilir.",
      ],
      [
        "Eine endgültige Entscheidung wird vertagt. Zuerst soll geklärt werden, welche Hindernisse durch Gestaltung beseitigt werden können und wo zusätzliche Unterstützung erforderlich bleibt.",
        "Kesin karar erteleniyor. Önce hangi engellerin tasarımla giderilebildiği ve nerede ek destek gerektiği açıklanacak.",
      ],
    ],
    checks: [
      [
        "Cihaz sahibi olmak neden yeterli görülmüyor?",
        "Dil, tasarım ve destek engelleri sürebilir",
        "Bütün cihazlar bozuk olduğu için",
        "Kimse çevrim içi hizmet istemediği için",
        "Teknik olanak ile gerçek kullanım koşulu ayrılır. Metin dijital hizmeti bütünüyle reddetmez; farklı engelleri görünür kılar.",
      ],
      [
        "Kullanmama neden doğrudan ilgisizlik değildir?",
        "Başarısız denemeler istatistikte görünmeyebilir",
        "İstatistik her zaman her nedeni gösterir",
        "Bütün kişiler bilerek reddeder",
        "Formda zorlanıp bırakanların görünmemesi olasıdır. Veri yokluğunu niyet kanıtı gibi okumama uyarısı yapılır.",
      ],
      [
        "Danışma noktası nasıl konumlanıyor?",
        "Toplam erişilebilir hizmetin parçası",
        "Dijitalleşmeyi bütünüyle yasaklayan araç",
        "Yalnız çalışanlara özel ödül",
        "nicht ... sondern noktanın karşı model değil tamamlayıcı olduğunu açıklar. İki hizmet türü zorunlu karşıtlık olarak sunulmuyor.",
      ],
      [
        "Karar neye kadar erteleniyor?",
        "Engeller ve gerekli destek netleşene kadar",
        "Portalın kesin kapatılmasına kadar",
        "Bütün kişisel veriler yayımlanana kadar",
        "Önce engellerin tasarımla giderilip giderilemediği incelenecek. Henüz kalıcı tek kanallı hizmet kararı verilmiş değil.",
      ],
    ],
    focus: [
      [
        1,
        "dass",
        "obwohl",
        "damit",
        "dass danışma merkezinin karşı sav içeriğini açar. Cihaz ile güvenli kullanımın aynı şey olmadığı iddiası aktarılır.",
      ],
      [
        3,
        "Wer",
        "Wen",
        "Wem",
        "Wer burada genel özne işlevli ilgi yapısını başlatır. Scheitern eylemini yapan kişiye gönderir; nesne hâli değildir.",
      ],
      [
        5,
        "sondern",
        "denn",
        "oder",
        "nicht als Gegenmodell ..., sondern als Teil ... karşıt yorumun düzeltilmesidir. Danışma dijitalleşmeye eklenir.",
      ],
      [
        6,
        "ohne",
        "um",
        "statt",
        "ohne dass teknik çalışmayla herkesin yararlanmasını ayrı tutar. Birincinin ikincisini garanti etmediği vurgulanır.",
      ],
    ],
  },
  {
    n: 4,
    title: "Kültürel çözümlemeler",
    german: "Wer erzählt die Stadt?",
    category: "culture",
    goal: "Bir kültür projesinde temsil, seçki ve eksik seslere ilişkin savları izle.",
    lines: [
      [
        "Eine fiktive Stadtbibliothek plant eine Lesereihe über das eigene Viertel. Zunächst werden vor allem bekannte Autorinnen und Autoren vorgeschlagen, deren Texte bereits in vielen Sammlungen stehen.",
        "Kurgusal kent kütüphanesi mahalle hakkında okuma dizisi hazırlıyor. Önce eserleri pek çok seçkide bulunan tanınmış yazarlar öneriliyor.",
      ],
      [
        "Eine Mitarbeiterin fragt, ob Bekanntheit hier unbemerkt zum einzigen Auswahlkriterium wird. Wer bereits häufig veröffentlicht wurde, sei leichter zu finden, repräsentiere aber nicht automatisch jede Erfahrung im Viertel.",
        "Bir çalışan tanınmışlığın fark edilmeden tek ölçüt olup olmadığını soruyor. Sık yayımlananlar kolay bulunur ama mahalledeki her deneyimi temsil etmeyebilir.",
      ],
      [
        "Daraufhin werden auch mündliche Erzählungen und unveröffentlichte Texte einbezogen. Ihre Aufnahme soll jedoch nicht nur dekorativ wirken, sondern mit derselben Sorgfalt vorbereitet werden.",
        "Bunun üzerine sözlü anlatılar ve yayımlanmamış metinler de katılıyor. Dahil edilmeleri yalnız süs gibi değil, aynı özenle hazırlanmış olmalı.",
      ],
      [
        "Ein Teammitglied gibt zu bedenken, dass niemand eine ganze Gruppe vertreten müsse. Eine persönliche Erzählung dürfe gerade in ihrer Besonderheit stehen, ohne zum Muster aller ähnlichen Lebenswege erklärt zu werden.",
        "Bir ekip üyesi kimsenin bütün grubu temsil etmek zorunda olmadığını hatırlatıyor. Kişisel anlatı benzer hayatların tümünün örneği ilan edilmeden özgüllüğüyle kalabilmeli.",
      ],
      [
        "Auch die Form der Veranstaltung wird diskutiert. Ein Gespräch mit Übersetzung könnte andere Zugänge eröffnen als eine ausschließlich deutschsprachige Lesung, verlangt aber zusätzliche Vorbereitung.",
        "Etkinlik biçimi de tartışılıyor. Çevirili söyleşi yalnız Almanca okumadan farklı erişim yolları açabilir ama ek hazırlık ister.",
      ],
      [
        "Die Bibliothek entscheidet sich für mehrere Formate und erklärt ihre Auswahl öffentlich. Das macht die Auswahl nicht neutral, wohl aber nachvollziehbarer und leichter kritisierbar.",
        "Kütüphane birkaç biçim seçip seçkisini açıkça açıklıyor. Bu onu tarafsız yapmaz ama daha izlenebilir ve eleştirilebilir kılar.",
      ],
      [
        "Für die Ankündigung wird auf große Worte wie die Stimme des Viertels verzichtet. Stattdessen heißt es, dass die Reihe unterschiedliche und unvollständige Perspektiven nebeneinanderstellt.",
        "Duyuruda mahallenin sesi gibi büyük sözlerden kaçınılıyor. Bunun yerine farklı ve eksik bakış açılarını yan yana koyduğu söyleniyor.",
      ],
      [
        "Der Wert des Projekts liegt damit nicht in einem abschließenden Gesamtbild. Er liegt in der Möglichkeit, vertraute Geschichten neu zu hören und die Bedingungen ihrer Auswahl mitzudenken.",
        "Projenin değeri nihai bütüncül resimde değil. Tanıdık hikâyeleri yeniden dinleme ve seçilme koşullarını birlikte düşünme olanağında.",
      ],
    ],
    checks: [
      [
        "Tanınmışlık neden sorgulanıyor?",
        "Kolay bulunmak tam temsil demek değil",
        "Tanınmış bütün metinler yanlış",
        "Hiç yayımlanmamış metin değer taşımaz",
        "Soru seçim ölçütünün daralmasına yönelir. Bilinen yazarlar reddedilmiyor; temsil iddiasının sınırı tartışılıyor.",
      ],
      [
        "Kişisel anlatı neye zorlanmamalı?",
        "Bütün grubun temsilcisi olmaya",
        "Kendi özgüllüğünü korumaya",
        "Konuşmacı olarak yer almaya",
        "Niemand eine ganze Gruppe vertreten müsse kişiyle grup arasındaki temsil yükünü sınırlar. Tek deneyim tüm hayatlara genellenmez.",
      ],
      [
        "Seçkisini açıklamak projeyi tarafsız yapıyor mu?",
        "Hayır, daha izlenebilir kılıyor",
        "Evet, tamamen nötr kılıyor",
        "Her eleştiriyi yasaklıyor",
        "nicht neutral, wohl aber nachvollziehbarer açık ayrımdır. Açıklık eleştiriyi bitirmek değil mümkün kılmak için değerlidir.",
      ],
      [
        "Duyuruda neden büyük temsil iddiası yok?",
        "Seçkinin çoklu ama eksik perspektifler sunduğu kabul ediliyor",
        "Etkinlik iptal edildiği için",
        "Mahallede hiç hikâye olmadığı için",
        "Unvollständige Perspektiven kapsam sınırlamasıdır. Tek ve nihai mahalle sesi iddiası özellikle kullanılmıyor.",
      ],
    ],
    focus: [
      [
        0,
        "deren",
        "dessen",
        "denen",
        "deren çoğul yazarların metinlerine aitlik kurar. Sonraki Texte sözcüğünün kendi rolüyle kaynak yazarların sayısını ayır.",
      ],
      [
        2,
        "sondern",
        "denn",
        "oder",
        "nicht nur dekorativ ..., sondern ... göstermelik katılım yerine özenli hazırlığı vurgular. Basit neden bağlacı değildir.",
      ],
      [
        3,
        "ohne",
        "um",
        "statt",
        "ohne ... erklärt zu werden anlatının otomatik genel örneğe dönüştürülmemesini kurar. Edilgen mastar yapısı korunur.",
      ],
      [
        6,
        "Stattdessen",
        "Zuvor",
        "Niemals",
        "Stattdessen terk edilen büyük iddianın yerine daha sınırlı duyuruyu koyar. Bu yalnız önce-sonra sıralaması değildir.",
      ],
    ],
  },
  {
    n: 5,
    title: "Mesleki sunumlar",
    german: "Ein Vorschlag mit offenen Annahmen",
    category: "education",
    goal: "Sunumda bulgu, varsayım, öneri ve başarı ölçütünü ayrı takip et.",
    lines: [
      [
        "In einer fiktiven Teamsitzung wird ein neuer Ablauf für Kundenanfragen vorgestellt. Die Sprecherin beginnt nicht mit einer fertigen Lösung, sondern mit dem beobachteten Problem: Rückfragen bleiben häufig zwischen zwei Abteilungen liegen.",
        "Kurgusal ekip toplantısında müşteri soruları için yeni akış sunuluyor. Konuşmacı hazır çözümle değil gözlenen sorunla başlıyor: sorular iki bölüm arasında bekliyor.",
      ],
      [
        "Die bisherigen Zahlen zeigen die Dauer abgeschlossener Fälle. Sie sagen jedoch wenig darüber aus, wie viele Anfragen abgebrochen wurden oder noch gar nicht erfasst sind.",
        "Eski sayılar tamamlanan dosyaların süresini gösteriyor. Ama yarıda bırakılan ya da kayda hiç geçmeyen soruların sayısını pek açıklamıyor.",
      ],
      [
        "Vorgeschlagen wird ein gemeinsames Eingangsfeld mit klarer Zuständigkeit. Die Annahme lautet, dass weniger Übergaben zu kürzeren Wartezeiten führen könnten; dies müsse zunächst überprüft werden.",
        "Açık sorumluluklu ortak giriş öneriliyor. Daha az devrin beklemeyi kısaltabileceği varsayılıyor; bu önce sınanmalıymış.",
      ],
      [
        "Die Sprecherin nennt außerdem mögliche Nebenwirkungen. Wenn jede Anfrage an einer Stelle landet, könnte dort ein neuer Engpass entstehen, sofern keine Vertretung geregelt ist.",
        "Konuşmacı olası yan etkileri de belirtiyor. Her soru tek noktaya gelirse yedek görevli düzenlenmedikçe yeni darboğaz oluşabilir.",
      ],
      [
        "Für den Versuch sollen deshalb nicht nur Durchschnittszeiten erhoben werden. Auch Rückfragen, unerledigte Fälle und die Belastung der Mitarbeitenden sollen sichtbar bleiben.",
        "Denemede bu yüzden yalnız ortalama süreler toplanmayacak. Geri sorular, bitmeyen dosyalar ve çalışan yükü de görünür kalacak.",
      ],
      [
        "Ein Teilnehmer fragt nach dem Aufwand der Dokumentation. Die Sprecherin schlägt wenige klar definierte Angaben vor, damit die Messung nicht selbst zum größten Teil der Arbeit wird.",
        "Bir katılımcı belgeleme yükünü soruyor. Ölçüm işin en büyük parçasına dönüşmesin diye az sayıda açık tanımlı bilgi öneriliyor.",
      ],
      [
        "Nach sechs Wochen soll das Team entscheiden, ob der Ablauf angepasst, fortgeführt oder beendet wird. Für alle drei Möglichkeiten werden vorher nachvollziehbare Kriterien vereinbart.",
        "Altı hafta sonra akışın düzenlenmesine, sürmesine veya bitmesine karar verilecek. Üç seçenek için de önceden anlaşılır ölçüt konuluyor.",
      ],
      [
        "Die Präsentation endet mit einer Bitte um Kritik an den Annahmen. Zustimmung zum Versuch wird ausdrücklich nicht mit Zustimmung zu einer dauerhaften Einführung gleichgesetzt.",
        "Sunum varsayımlara eleştiri isteğiyle bitiyor. Denemeye onay açıkça kalıcı uygulamaya onay sayılmıyor.",
      ],
    ],
    checks: [
      [
        "Eski ölçümlerin temel sınırı?",
        "Bitmiş dosyalar dışındakileri az açıklaması",
        "Hiç süre içermemesi",
        "Bütün müşteri niyetlerini ölçmesi",
        "Abgeschlossene Fälle kapsamdır. Yarım kalan ve kayda geçmeyen süreçleri görmeden tüm sistem başarısı çıkarılamaz.",
      ],
      [
        "Yeni akışın olası yan etkisi?",
        "Tek noktada darboğaz",
        "Bütün soruların yok olması",
        "Her bölümün otomatik kapanması",
        "Engpass riski özellikle yedek görevli düzeni eksikliğine bağlanır. Öneri tüm riskleri yok eden çözüm diye sunulmaz.",
      ],
      [
        "Neden sınırlı sayıda gösterge öneriliyor?",
        "Ölçümün aşırı iş yüküne dönüşmemesi için",
        "Hiç değerlendirme yapılmasın diye",
        "Sadece iyi görünen veri seçmek için",
        "Az ama açık tanımlı bilgi ölçümü uygulanabilir tutma amacındadır. Yarım dosya ve yükün izlenmesi ayrıca istenir.",
      ],
      [
        "Deneme onayı ne değildir?",
        "Kalıcı uygulama onayı",
        "Bir sınama olanağı",
        "Varsayımları eleştirme alanı",
        "Son cümle iki onayı açıkça ayırır. Sürdürme, uyarlama ve bitirme seçenekleri önceden geçerli bırakılır.",
      ],
    ],
    focus: [
      [
        0,
        "sondern",
        "denn",
        "oder",
        "nicht ... sondern sunumun başlangıcını düzeltir: hazır çözüm yerine gözlenen sorun. Kaynakta olmayan kesin çözüm ekleme.",
      ],
      [
        2,
        "könnten",
        "könnte",
        "könntet",
        "Çoğul Übergaben ile könnten ihtiyatlı varsayımı kurar. Daha kısa sürenin kesin kanıtlandığı iddiası değildir.",
      ],
      [
        3,
        "sofern",
        "obwohl",
        "sodass",
        "sofern yedek düzeninin olmaması koşulunu sınırlar. Riskin bütün koşullarda kesin gerçekleştiği söylenmez.",
      ],
      [
        7,
        "gleichgesetzt",
        "gleichsetzen",
        "setzt gleich",
        "wird ... gleichgesetzt edilgen yapıdır. nicht iki onayın eşitlenmesini açıkça reddeder; aynı karar aşaması değildir.",
      ],
    ],
  },
];

export default lessons;
