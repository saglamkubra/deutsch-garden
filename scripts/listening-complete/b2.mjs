const lessons = [
  {
    n: 2,
    title: "Toplumsal konular",
    german: "Wem gehört der öffentliche Raum?",
    category: "germany",
    goal: "Kamusal alan tartışmasında farklı kullanıcıların ihtiyaçlarını ve karar sınırını ayır.",
    lines: [
      [
        "In einer fiktiven Stadt soll ein bisheriger Parkplatz zu einem kleinen Platz mit Bäumen umgestaltet werden. Der Vorschlag löst eine lebhafte Diskussion aus.",
        "Kurgusal bir kentte bir otoparkın ağaçlı küçük meydana dönüştürülmesi öneriliyor. Öneri canlı bir tartışma başlatıyor.",
      ],
      [
        "Befürworter betonen, dass es im Viertel kaum schattige Sitzgelegenheiten gibt. Gerade ältere Menschen könnten von einem wohnungsnahen Treffpunkt profitieren.",
        "Destekleyenler mahallede gölgeli oturma yerinin az olduğunu vurguluyor. Özellikle yaşlılar eve yakın buluşma yerinden yararlanabilir.",
      ],
      [
        "Ein Geschäftsinhaber befürchtet dagegen Probleme bei der Anlieferung. Ihm geht es nicht darum, jede Veränderung zu verhindern, sondern um verlässliche Zufahrtszeiten.",
        "Bir işletmeci ise mal tesliminde sorun olmasından kaygılanıyor. Amacı bütün değişimi engellemek değil, güvenilir erişim saatleri.",
      ],
      [
        "Die Planerin schlägt vor, einen Teil der Fläche zeitweise für Lieferungen offen zu halten. Ob das genügt, müsse mit den Betroffenen geklärt werden.",
        "Plancı alanın bir kısmını teslimatlar için belirli süreler açık tutmayı öneriyor. Bunun yeterliliği etkilenenlerle görüşülmeli.",
      ],
      [
        "Eine Rollstuhlnutzerin weist darauf hin, dass schöne Bäume allein noch keinen zugänglichen Platz schaffen. Auch Wege, Übergänge und Sitzhöhen müssten berücksichtigt werden.",
        "Tekerlekli sandalye kullanan biri güzel ağaçların tek başına erişilebilir meydan yaratmadığını belirtiyor. Yollar, geçişler ve oturma yükseklikleri de gözetilmeli.",
      ],
      [
        "Im Gespräch wird deutlich, dass die Bedürfnisse nicht sauber in zwei Lager passen. Dieselbe Person kann mehr Grün wünschen und zugleich eine gute Zufahrt benötigen.",
        "İhtiyaçların iki kampa tam ayrılmadığı ortaya çıkıyor. Aynı kişi daha çok yeşil alan isterken iyi erişime de ihtiyaç duyabilir.",
      ],
      [
        "Vor einer Entscheidung sollen deshalb mehrere Varianten öffentlich vorgestellt werden. Eine Umfrage kann Hinweise geben, ersetzt aber nicht die Prüfung der Zugänglichkeit.",
        "Bu yüzden karar öncesi birden çok seçenek kamuya sunulacak. Anket ipucu verebilir ama erişilebilirlik incelemesinin yerine geçmez.",
      ],
      [
        "Am Ende steht kein fertiger Plan. Festgehalten wird vielmehr, nach welchen Kriterien die nächsten Entwürfe bewertet werden sollen.",
        "Sonunda hazır bir plan yok. Daha çok sonraki taslakların hangi ölçütlerle değerlendirileceği kayda geçiyor.",
      ],
    ],
    checks: [
      [
        "İşletmecinin asıl kaygısı?",
        "Teslimat erişiminin güvenilir olması",
        "Her ağacı kaldırmak",
        "Hiç değişim istememek",
        "nicht darum ..., sondern ... asıl kaygıyı daraltır. Bütün değişime karşı olduğunu söylemek konuşmacıyı yanlış temsil eder.",
      ],
      [
        "Ağaçlar tek başına neyi sağlamaz?",
        "Erişilebilirliği",
        "Gölgelenme olasılığını",
        "Yeşil alan olmasını",
        "Konuşmacı yol ve geçiş gibi ayrıntıları ekler. Görsel güzellik erişim koşullarının denetiminin yerine geçmez.",
      ],
      [
        "Anketin sınırı ne?",
        "Teknik erişim incelemesini ikame etmez",
        "Hiç ipucu veremez",
        "Her kararı kesin sonuçlandırır",
        "Anket yararlı olabilir ama erişilebilirlik denetiminden farklı görev taşır. Metin ikisini bütünüyle değersiz veya eşdeğer saymaz.",
      ],
      [
        "Sonuçta ne belirleniyor?",
        "Sonraki taslakların ölçütleri",
        "Kesin uygulama planı",
        "İşletmelerin kapanışı",
        "Kein fertiger Plan henüz nihai taslak bulunmadığını belirtir. Ölçüt kaydetmek tamamlanmış uygulama kararı değildir.",
      ],
    ],
    focus: [
      [
        0,
        "umgestaltet werden",
        "umgestalten wurde",
        "umgestaltet wird",
        "soll sonrasında edilgen mastar grubu kullanılır. Bir dönüşüm önerisi aktarılır; yapılmış meydan olarak sunulmaz.",
      ],
      [
        2,
        "sondern",
        "denn",
        "oder",
        "nicht ... sondern yapısı reddedilen amaçla gerçek kaygıyı ayırır. Burada erişim saatlerine ilişkin kapsam korunmalıdır.",
      ],
      [
        4,
        "berücksichtigt werden",
        "berücksichtigen wurde",
        "berücksichtigt wird",
        "müssten sonrasında Partizip ve werden mastarı bulunur. Çoğul ayrıntıların dikkate alınması gerekliliği aktarılır.",
      ],
      [
        7,
        "vielmehr",
        "zuvor",
        "deswegen",
        "vielmehr sonucu yeniden çerçeveler: hazır plan yerine ölçütler kaydedilir. Bu sadece zaman sırası veya neden değildir.",
      ],
    ],
  },
  {
    n: 3,
    title: "Teknoloji üzerine",
    german: "Eine App, die nicht alles wissen muss",
    category: "technology",
    goal: "Bir uygulama kararında kolaylık, veri ihtiyacı ve isteğe bağlı işlevleri ayır.",
    lines: [
      [
        "Ein kleines Team entwickelt eine Termin-App für einen Verein. Anfangs möchte es möglichst viele Funktionen anbieten, vom Kalender bis zur Standortanzeige.",
        "Küçük bir ekip dernek için randevu uygulaması geliştiriyor. Başta takvimden konum göstermeye birçok işlev sunmak istiyor.",
      ],
      [
        "Beim Test fragen einige Mitglieder, warum für eine einfache Zusage der genaue Standort nötig sein soll. Das Team hat darauf zunächst keine überzeugende Antwort.",
        "Denemede üyeler basit katılım yanıtı için kesin konumun neden gerektiğini soruyor. Ekibin başlangıçta ikna edici yanıtı yok.",
      ],
      [
        "Die Entwicklerin trennt daraufhin notwendige und freiwillige Angaben. Für die Teilnahme reichen Name und Rückmeldung; die Standortfunktion wird gestrichen.",
        "Geliştirici gerekli ve gönüllü bilgileri ayırıyor. Katılım için ad ve yanıt yeterli; konum işlevi çıkarılıyor.",
      ],
      [
        "Eine Erinnerung bleibt möglich, muss aber ausdrücklich eingeschaltet werden. Wer sie ablehnt, kann die übrigen Funktionen weiterhin nutzen.",
        "Hatırlatma mümkün kalıyor ama açıkça etkinleştirilmeli. Reddedenler diğer işlevleri kullanmayı sürdürebiliyor.",
      ],
      [
        "Außerdem wird erklärt, welche Angaben nur auf dem Gerät liegen und welche an den Vereinsserver übertragen werden. Diese Unterscheidung war vorher kaum sichtbar.",
        "Hangi bilgilerin yalnız cihazda, hangilerinin dernek sunucusunda tutulduğu da açıklanıyor. Bu ayrım daha önce zor görünüyordu.",
      ],
      [
        "Ein Mitglied schlägt vor, alle Daten für spätere Ideen aufzubewahren. Das Team entscheidet sich dagegen, weil ein möglicher späterer Nutzen noch keinen konkreten Zweck ersetzt.",
        "Bir üye gelecekteki fikirler için bütün verileri saklamayı öneriyor. Ekip karşı çıkıyor; olası gelecek yararının somut amacın yerine geçmediğini düşünüyor.",
      ],
      [
        "Nach der Änderung braucht die App weniger Berechtigungen. Das bedeutet nicht, dass damit jedes Sicherheitsproblem gelöst wäre; auch der Zugriff auf dem Server muss geprüft werden.",
        "Değişiklik sonrası uygulama daha az izin istiyor. Bu her güvenlik sorunu çözüldü demek değil; sunucu erişimi de incelenmeli.",
      ],
      [
        "Das Ergebnis ist eine kleinere, aber verständlichere Anwendung. Entscheidend ist nicht die Zahl der Funktionen, sondern ob die Mitglieder bewusst über ihre Nutzung entscheiden können.",
        "Sonuç daha küçük ama anlaşılır bir uygulama. Önemli olan işlev sayısı değil, üyelerin kullanıma bilinçli karar verebilmesi.",
      ],
    ],
    checks: [
      [
        "Konum işlevi ne oluyor?",
        "Kaldırılıyor",
        "Zorunlu yapılıyor",
        "Gizlice açık bırakılıyor",
        "Standortfunktion wird gestrichen ifadesi kaldırmayı belirtir. Gerekli ile isteğe bağlı bilgilerin ayrılması bu karara yol açar.",
      ],
      [
        "Hatırlatmayı reddeden kişi ne yapabilir?",
        "Diğer işlevleri kullanabilir",
        "Hesabı zorunlu silinir",
        "Randevuya katılamaz",
        "übrigen Funktionen weiterhin nutzen reddin temel kullanım kaybı yaratmadığını açıklar. Hatırlatma ayrı bir tercihtir.",
      ],
      [
        "Daha az izin her güvenlik sorununu çözüyor mu?",
        "Hayır, sunucu erişimi de denetlenmeli",
        "Evet, tümü çözülüyor",
        "Artık parola hiç gerekmez",
        "Metin açıkça her sorunun çözülmediğini söyler. Veri azaltma ile sunucu yetkilendirmesi farklı kontrollerdir.",
      ],
      [
        "Ekibin başarı ölçütü ne?",
        "Anlaşılır ve bilinçli kullanım",
        "En çok veri toplamak",
        "En çok özellik eklemek",
        "nicht die Zahl ..., sondern ... ölçütü değiştirir. Küçük uygulama bilinçli karar alanını artırdığı için olumlu değerlendirilir.",
      ],
    ],
    focus: [
      [
        2,
        "reichen",
        "reicht",
        "reichst",
        "Name und Rückmeldung birlikte çoğul öznedir; reichen ile eşleşir. Temel katılım için bu bilgilerin yeterliliği belirtilir.",
      ],
      [
        3,
        "ausdrücklich",
        "heimlich",
        "zwangsläufig",
        "ausdrücklich açık bir etkinleştirme tercihini vurgular. Gizli veya kaçınılmaz etkinleştirme aynı kullanıcı iradesini korumaz.",
      ],
      [
        6,
        "wäre",
        "wärest",
        "wäret",
        "jedes Sicherheitsproblem tekildir; wäre sonucu bütünüyle çözülmüş gibi varsaymama çerçevesinde kullanılır.",
      ],
      [
        7,
        "ob",
        "weil",
        "obwohl",
        "ob bilinçli karar verebilme ölçütünü açık bir değerlendirme sorusu olarak kurar. Kesin olumlu sonuç baştan varsayılmaz.",
      ],
    ],
  },
  {
    n: 4,
    title: "Çevre ve gelecek",
    german: "Ein kühlerer Schulhof",
    category: "culture",
    goal: "Çevre projesinde ölçüm, tahmin, bakım ve bütçe ayrımını dinle.",
    lines: [
      [
        "Eine Schule möchte ihren stark versiegelten Hof verändern. Im Sommer wird die Fläche sehr heiß, und in den Pausen fehlen schattige Aufenthaltsorte.",
        "Bir okul yoğun beton kaplı bahçesini değiştirmek istiyor. Yazın alan çok ısınıyor, teneffüste gölgeli yerler eksik.",
      ],
      [
        "Zunächst messen die Beteiligten an mehreren Tagen Temperaturen an verschiedenen Stellen. Ein einzelner heißer Mittag soll nicht als vollständiges Bild des ganzen Sommers gelten.",
        "Önce katılımcılar birkaç gün farklı noktalarda sıcaklık ölçüyor. Tek sıcak öğle tüm yazın tam resmi sayılmıyor.",
      ],
      [
        "Vorgeschlagen werden Bäume, helle Flächen und ein kleiner überdachter Bereich. Die Varianten unterscheiden sich darin, wie schnell sie Schatten schaffen und wie viel Pflege sie brauchen.",
        "Ağaçlar, açık renk yüzeyler ve küçük örtülü alan öneriliyor. Seçenekler gölgeyi ne kadar hızlı sağladığı ve bakım gereksinimiyle ayrılıyor.",
      ],
      [
        "Bäume könnten langfristig viel beitragen, brauchen aber Zeit zum Wachsen. Eine Überdachung wäre schneller nutzbar, löst jedoch nicht jede Frage zur Begrünung.",
        "Ağaçlar uzun vadede katkı sağlayabilir ama büyümeleri zaman ister. Örtü daha çabuk kullanılabilir, fakat yeşillendirmenin her sorununu çözmez.",
      ],
      [
        "Bei der Besprechung wird auch nach Wasserverbrauch und Zuständigkeit gefragt. Eine gute Idee kann scheitern, wenn später niemand die Pflege organisiert.",
        "Görüşmede su tüketimi ve sorumluluk da soruluyor. Sonradan bakımı kimse düzenlemezse iyi fikir başarısız olabilir.",
      ],
      [
        "Die Gruppe plant deshalb zunächst einen kleinen Abschnitt. Kosten, Nutzung und Pflege sollen dokumentiert werden, bevor weitere Flächen verändert werden.",
        "Bu yüzden grup önce küçük bölüm planlıyor. Diğer alanlar değiştirilmeden önce maliyet, kullanım ve bakım kaydedilecek.",
      ],
      [
        "Die Schülerinnen und Schüler wünschen sich außerdem freie Spielflächen. Mehr Grün und Bewegungsraum müssen im Entwurf zusammen gedacht werden.",
        "Öğrenciler açık oyun alanı da istiyor. Daha çok yeşil alanla hareket alanı tasarımda birlikte düşünülmeli.",
      ],
      [
        "Am Ende wird kein einzelnes Mittel als Wunderlösung präsentiert. Der nächste Schritt ist ein überprüfbarer Versuch mit klar verteilten Aufgaben.",
        "Sonunda tek araç mucize çözüm diye sunulmuyor. Sonraki adım açık görev dağılımlı, değerlendirilebilir deneme.",
      ],
    ],
    checks: [
      [
        "Neden farklı günlerde ölçüm yapılıyor?",
        "Tek öğlenin sınırlı görüntüsüne dayanılmasın diye",
        "Hiç veri toplanmasın diye",
        "Yalnız maliyeti artırmak için",
        "Kayıt tek bir sıcak öğleyi tüm yazın resmi saymamak gerektiğini vurgular. Ölçüm genişliği bu sınırı azaltmak içindir.",
      ],
      [
        "Ağaçların zaman açısından sınırı?",
        "Büyümeleri zaman alır",
        "Hiç gölge sağlayamazlar",
        "Yalnız kışın büyürler",
        "Katkı uzun vadeli olabilir; büyüme süresi ayrı koşuldur. Metin ağacı değersiz saymaz veya kesin takvim garantisi vermez.",
      ],
      [
        "Bakım niçin tartışılıyor?",
        "Uygulamanın sürmesi için sorumlu gerekir",
        "Proje yalnız resim olduğu için",
        "Hiç su kullanmamak garanti olduğu için",
        "Kimin bakımı düzenleyeceği iyi fikrin uygulanabilirliğini etkiler. Tasarım kararı işletme ve bakım görevinden koparılmıyor.",
      ],
      [
        "Sonraki adım ne?",
        "Küçük, görevleri belli deneme",
        "Bütün bahçeyi hemen değiştirmek",
        "Tek mucize çözüm ilan etmek",
        "Küçük bölüm ve belgeleme yaklaşımı kontrollü deneme kurar. Diğer alanlara geçiş bunun öncesinde kesin kararlaştırılmıyor.",
      ],
    ],
    focus: [
      [
        1,
        "Zunächst",
        "Schließlich",
        "Niemals",
        "Zunächst ilk veri toplama aşamasını sıralar. Nihai sonuç veya hiçbir zaman ölçüm yapmama anlamına gelmez.",
      ],
      [
        3,
        "könnten",
        "könnte",
        "könntet",
        "Çoğul Bäume ile könnten ihtiyatlı katkı olasılığını kurar. Gelecek yararın kesin ve tek başına yeterli olduğu söylenmez.",
      ],
      [
        4,
        "wenn",
        "obwohl",
        "damit",
        "wenn bakımın düzenlenmemesi koşulunda başarısızlığı anlatır. Bütün projelerin zaten başarısız olduğu iddiası değildir.",
      ],
      [
        5,
        "bevor",
        "obwohl",
        "damit",
        "bevor başka alanları değiştirmeden önce yapılacak belgelemeyi sıralar. Öncelik, sonraki uygulamanın değerlendirmesine hizmet eder.",
      ],
    ],
  },
  {
    n: 5,
    title: "İş yeri tartışmaları",
    german: "Erreichbar, aber nicht ständig",
    category: "education",
    goal: "İş düzeninde yanıt süresi, istisna ve deneme koşullarını takip et.",
    lines: [
      [
        "In einem Projektteam häufen sich Nachrichten am Abend. Manche antworten sofort, andere lesen sie erst am nächsten Arbeitstag und fühlen sich dafür rechtfertigen zu müssen.",
        "Proje ekibinde akşam mesajları artıyor. Bazıları hemen yanıtlıyor, diğerleri ertesi iş gününde okuyup kendini açıklamak zorunda hissediyor.",
      ],
      [
        "Die Teamleiterin möchte klare Absprachen treffen. Es geht ihr nicht darum, jede flexible Arbeitszeit zu verbieten, sondern um verlässliche Erwartungen.",
        "Ekip lideri açık uzlaşılar istiyor. Amaç her esnek çalışma saatini yasaklamak değil, güvenilir beklenti oluşturmak.",
      ],
      [
        "Ein Kollege arbeitet gern früh, eine Kollegin betreut nachmittags ihr Kind. Beide brauchen unterschiedliche Zeitfenster, ohne ständig auf Nachrichten zu reagieren.",
        "Bir çalışan erken çalışmayı seviyor, bir diğeri öğleden sonra çocuğuyla ilgileniyor. İkisinin de sürekli mesaj yanıtlamadan farklı saatlere ihtiyacı var.",
      ],
      [
        "Vorgeschlagen wird eine gemeinsame Kernzeit von zehn bis zwölf. Außerhalb davon sollen Aufgaben schriftlich dokumentiert werden, damit niemand Informationen verpasst.",
        "On ile on iki arasında ortak saat öneriliyor. Bunun dışında görevler kimse bilgi kaçırmasın diye yazılı belgelenecek.",
      ],
      [
        "Für echte dringende Fälle soll ein gesonderter Kontaktweg gelten. Was als dringend gilt, muss das Team allerdings erst konkret festlegen.",
        "Gerçek acil durumlar için ayrı iletişim yolu öneriliyor. Ama acilin ne olduğu ekipçe somutlaştırılmalı.",
      ],
      [
        "Ein Mitarbeiter warnt, dass unklare Ausnahmen schnell zur neuen Regel werden können. Die Leitung stimmt zu und schlägt eine kurze Auswertung nach vier Wochen vor.",
        "Bir çalışan belirsiz istisnaların hızla yeni kurala dönüşebileceğini belirtiyor. Yönetim katılıp dört hafta sonra kısa değerlendirme öneriyor.",
      ],
      [
        "Niemand verspricht, dass damit jeder Konflikt verschwindet. Die Absprachen sollen aber sichtbar machen, worauf sich die Beteiligten tatsächlich verlassen können.",
        "Kimse her anlaşmazlığın yok olacağını vaat etmiyor. Uzlaşılar katılımcıların neye güvenebileceğini görünür kılmalı.",
      ],
      [
        "Die Gruppe beginnt mit einem Versuch und hält offene Fragen fest. Über eine dauerhafte Regelung wird erst nach der Auswertung entschieden.",
        "Grup denemeye başlayıp açık soruları kaydediyor. Kalıcı düzen ancak değerlendirmeden sonra kararlaştırılacak.",
      ],
    ],
    checks: [
      [
        "Liderin temel hedefi?",
        "Beklentileri netleştirmek",
        "Bütün esnekliği yasaklamak",
        "Herkesi gece çalıştırmak",
        "nicht darum ..., sondern ... liderin hedefini açıkça sınırlar. Esnek saatlerin tamamen kaldırılması önerinin amacı değildir.",
      ],
      [
        "Ortak saat aralığı?",
        "10.00–12.00",
        "12.00–14.00",
        "Akşam boyu",
        "Kernzeit von zehn bis zwölf önerilen ortak zaman aralığıdır. Dışında sürekli hazır bulunma zorunluluğu kurulmaz.",
      ],
      [
        "Acil istisnada eksik kalan ne?",
        "Acilin somut tanımı",
        "Bütün görevlerin yazılması",
        "Dört haftalık değerlendirme fikri",
        "Was als dringend gilt hâlâ belirlenmelidir. Belirsiz istisnaların kurala dönüşmesi kaygısı bu noktaya yönelir.",
      ],
      [
        "Kalıcı karar ne zaman?",
        "Değerlendirmeden sonra",
        "Denemeden önce kesin verildi",
        "Hiç incelenmeden şimdi",
        "erst nach der Auswertung kalıcı kararın zaman sınırıdır. Denemeyi başlatmak kalıcı düzeni koşulsuz onaylamak değildir.",
      ],
    ],
    focus: [
      [
        1,
        "sondern",
        "oder",
        "denn",
        "sondern reddedilen yorumun yerine gerçek amacı koyar. Esneklik yasağı değil, beklenti açıklığı savunuluyor.",
      ],
      [
        2,
        "ohne",
        "um",
        "statt",
        "ohne ... zu reagieren sürekli yanıt vermeme olanağını kurar. Farklı saat ihtiyacının amacı sürekli yanıtlamak değildir.",
      ],
      [
        3,
        "damit",
        "obwohl",
        "seitdem",
        "damit kimsenin bilgi kaçırmaması amacını taşır. Yazılı görevler bunun aracı olarak önerilir; garantili sonuç iddiası değildir.",
      ],
      [
        7,
        "erst nach",
        "schon vor",
        "immer ohne",
        "erst nach kararı değerlendirmeye bağlar. Önce veya değerlendirmesiz karar aynı süreç sırasını korumaz.",
      ],
    ],
  },
  {
    n: 6,
    title: "Haber diliyle açıklamalar",
    german: "Was die Meldung wirklich sagt",
    category: "germany",
    goal: "Kurgusal haberde doğrulanmış bilgi, kaynağa atıf ve açık soruları ayır.",
    lines: [
      [
        "In unserer fiktiven Nachrichtenübung geht es um eine vorübergehend geschlossene Brücke. Die Meldung nennt zunächst nur den Ort und die bestätigte Sperrung.",
        "Kurgusal haber alıştırmamız geçici kapatılmış köprüyle ilgili. Haber önce yalnız yeri ve doğrulanmış kapatmayı belirtiyor.",
      ],
      [
        "Nach Angaben der Stadt werde die Brücke untersucht. Ein genauer Zeitpunkt für die Wiederöffnung stehe noch nicht fest, heißt es in der Mitteilung.",
        "Belediyenin açıklamasına göre köprü inceleniyormuş. Duyuruda yeniden açılma saatinin henüz belli olmadığı söyleniyor.",
      ],
      [
        "Eine Anwohnerin berichtet von einem lauten Geräusch am Morgen. Diese Beobachtung wird als ihre Aussage wiedergegeben, nicht als bereits geklärte Ursache.",
        "Bir mahalleli sabah yüksek ses duyduğunu anlatıyor. Bu gözlem onun ifadesi olarak aktarılıyor; açıklanmış neden sayılmıyor.",
      ],
      [
        "In sozialen Medien wird über schwere Schäden spekuliert. Die Redaktion übernimmt diese Vermutung nicht als Tatsache, weil eine Bestätigung fehlt.",
        "Sosyal medyada ağır hasar tahminleri dolaşıyor. Haber merkezi doğrulama olmadığından bu varsayımı gerçek diye almıyor.",
      ],
      [
        "Für den Verkehr wird eine ausgeschilderte Umleitung genannt. Ob zusätzliche Busse eingesetzt werden, soll später bekannt gegeben werden.",
        "Trafik için levhalı alternatif güzergâh belirtiliyor. Ek otobüs çalıştırılıp çalıştırılmayacağı daha sonra açıklanacak.",
      ],
      [
        "Die Formulierung bislang keine weiteren Angaben bedeutet nicht, dass es sicher keine weiteren Informationen gibt. Sie begrenzt den Stand der Meldung.",
        "Şu ana kadar ek bilgi yok ifadesi, kesinlikle başka bilgi bulunmadığı anlamına gelmez. Haberin mevcut bilgi durumunu sınırlar.",
      ],
      [
        "Wer die Meldung zusammenfasst, sollte Quelle und Zeitpunkt mitnennen. Sonst kann eine vorläufige Aussage wie eine endgültige Feststellung wirken.",
        "Haberi özetleyen kişi kaynağı ve zamanı da belirtmeli. Yoksa geçici ifade kesin tespit gibi görünebilir.",
      ],
      [
        "Im zweiten Durchgang hörst du deshalb besonders auf nach Angaben, noch nicht und soll. Diese kleinen Ausdrücke zeigen, wie sicher die Information tatsächlich dargestellt wird.",
        "İkinci dinleyişte bu yüzden nach Angaben, noch nicht ve soll ifadelerine dikkat et. Bu küçük yapılar bilginin ne kadar kesin sunulduğunu gösterir.",
      ],
    ],
    checks: [
      [
        "Doğrulanan temel olay?",
        "Köprünün geçici kapatılması",
        "Ağır hasarın kesin nedeni",
        "Ek otobüslerin kesin saati",
        "Haber yalnız kapatmanın doğrulandığını belirtir. Hasar sosyal medya tahmini; ek otobüs ise sonraki açıklamaya bırakılır.",
      ],
      [
        "Mahallelinin duyduğu ses ne olarak veriliyor?",
        "Kişinin gözlemi",
        "Kesin hasar nedeni",
        "Belediyenin nihai raporu",
        "Aussage gözlemin kaynağını belirtir. Ses duyulması köprünün kapanma nedeninin bağımsız kanıtı olarak sunulmuyor.",
      ],
      [
        "Yeniden açılma zamanı?",
        "Henüz belli değil",
        "Kesin sabah sekiz",
        "Hiç açılmayacak",
        "noch nicht fest bilgi eksikliğini ifade eder. Bunu hiç açılmayacak gibi kalıcı sonuca dönüştürmemek gerekir.",
      ],
      [
        "Özette ne korunmalı?",
        "Kaynak ve bilgi zamanı",
        "Yalnız en çarpıcı söylenti",
        "Belirsizliğin silinmesi",
        "Kaynak ile zaman geçici bilgiyi doğru çerçeveler. Bunları atmak varsayımı doğrulanmış ve kalıcı olay gibi gösterebilir.",
      ],
    ],
    focus: [
      [
        1,
        "werde",
        "werdest",
        "werdet",
        "Tekil Brücke için Konjunktiv I werde ve untersucht edilgen aktarım kurar. Bu ifade kaynağı belediye açıklamasına bağlar.",
      ],
      [
        4,
        "soll",
        "sollen",
        "sollst",
        "Burada açıklanacak içerik tek bir ob cümlesidir; soll ile aktarılır. Ek otobüslerin kesin kullanılacağı veya saatin bilindiği söylenmez.",
      ],
      [
        3,
        "weil",
        "obwohl",
        "damit",
        "weil haber merkezinin varsayımı almama gerekçesini verir. Doğrulama eksikliği bir neden; amaç veya karşıtlık değildir.",
      ],
      [
        5,
        "bislang",
        "ausnahmslos",
        "endgültig",
        "bislang şu ana kadarki bilgi sınırını belirtir. Bunu her zaman ve kesinlikle bilgi yok şeklinde genişletme.",
      ],
    ],
  },
  {
    id: "listen-b2-grammar-modal",
    title: "Gramer Dinleme: çıkarım mı zorunluluk mu?",
    german: "Was muss hier wirklich sein?",
    category: "grammar",
    goal: "Modal fiillerin zorunluluk, çıkarım ve dış kaynak anlamlarını bağlamla ayır.",
    lines: [
      [
        "Wir hören dieselbe Verbform in verschiedenen Situationen. Im ersten Beispiel sagt eine Kollegin: Ich muss den Bericht heute abgeben, weil morgen die Besprechung stattfindet.",
        "Aynı fiil biçimini farklı durumlarda dinliyoruz. İlk örnekte çalışan bugün raporu vermek zorundayım diyor; toplantı yarın.",
      ],
      [
        "Hier beschreibt müssen eine Aufgabe oder Verpflichtung. Daraus folgt noch nicht, dass der Bericht schon fertig ist oder bereits abgegeben wurde.",
        "Burada müssen görev veya yükümlülük anlatıyor. Bundan raporun hazır olduğu ya da teslim edildiği sonucu çıkmaz.",
      ],
      [
        "Im zweiten Beispiel brennt im Büro noch Licht. Jemand sagt: Lena muss noch dort sein; ihre Jacke hängt auch am Stuhl.",
        "İkinci örnekte ofiste ışık yanıyor. Biri Lena hâlâ orada olmalı diyor; ceketi de sandalyede.",
      ],
      [
        "Diese Aussage ist eine Schlussfolgerung aus Beobachtungen. Sie bedeutet nicht, dass jemand Lena angewiesen hat, im Büro zu bleiben.",
        "Bu ifade gözlemlerden çıkarım. Birinin Lena'ya ofiste kalma emri verdiği anlamına gelmiyor.",
      ],
      [
        "Im dritten Beispiel heißt es: Der neue Kollege soll vorher in Wien gearbeitet haben. Die sprechende Person gibt damit eine Information aus anderer Quelle weiter.",
        "Üçüncü örnek yeni çalışan daha önce Viyana'da çalışmış deniyor. Konuşan kişi başka kaynaktaki bilgiyi aktarıyor.",
      ],
      [
        "Gearbeitet haben verweist auf eine frühere Tätigkeit. Die Form allein sagt aber nicht, ob die Information unabhängig überprüft wurde.",
        "gearbeitet haben önceki işe işaret ediyor. Ama yapı tek başına bilginin bağımsız doğrulandığını söylemiyor.",
      ],
      [
        "Vergleiche zuletzt: Du musst nicht teilnehmen und Du darfst nicht teilnehmen. Im ersten Satz fehlt die Pflicht, im zweiten wird die Teilnahme untersagt.",
        "Son olarak katılmak zorunda değilsin ve katılamazsın ifadelerini karşılaştır. İlkinde zorunluluk yok; ikincisinde katılım yasak.",
      ],
      [
        "Höre deshalb nicht nur auf das Modalverb. Suche nach Situation, Quelle und Zeitbezug, bevor du seine Bedeutung festlegst.",
        "Bu yüzden yalnız modal fiili dinleme. Anlamını belirlemeden durum, kaynak ve zaman ilişkisini ara.",
      ],
    ],
    checks: [
      [
        "İlk rapor örneği neyi anlatıyor?",
        "Teslim yükümlülüğünü",
        "Teslimin kesin bittiğini",
        "Işıktan çıkarımı",
        "Görev son tarih bağlamıyla verilir. Bir işin yapılması gerekmesi, onun tamamlandığının kanıtı değildir.",
      ],
      [
        "Lena örneğinde muss ne işlevde?",
        "Gözlemden çıkarım",
        "Kalma emri",
        "Önceden verilmiş izin",
        "Işık ve ceket dayanak olarak sunulur. Konuşmacı bir görev dayatmıyor; Lena'nın orada olmasını çıkarıyor.",
      ],
      [
        "Viyana bilgisi nasıl sunuluyor?",
        "Başka kaynaktan aktarılan bilgi",
        "Bağımsız doğrulanmış kesin rapor",
        "Yeni bir çalışma emri",
        "soll ... gearbeitet haben önceki işe ilişkin dış kaynak aktarımıdır. Yapı bağımsız doğrulama garantisi vermez.",
      ],
      [
        "musst nicht / darfst nicht ayrımı?",
        "Zorunluluk yokluğu / yasak",
        "Tam eşanlamlılık",
        "İkisinde de kesin görev",
        "Olumsuzluk modalın kapsamını değiştirir. Gerekli değil ile izin yok aynı öğrenici seçeneğini taşımaz.",
      ],
    ],
    focus: [
      [
        0,
        "abgeben",
        "abgegeben",
        "gibt ab",
        "muss sonrasında abgeben mastarı kullanılır. Rapor teslim yükümlülüğü, teslimin tamamlandığı anlamına gelmez.",
      ],
      [
        2,
        "sein",
        "ist",
        "gewesen",
        "muss ve sein mastarı burada gözlemden çıkarım grubudur. Çekimli ist aynı mastar konumuna eklenmez.",
      ],
      [
        4,
        "haben",
        "sein",
        "worden",
        "arbeiten Perfekt mastarında gearbeitet haben kurar. soll ile önceki işe ilişkin kaynak iddiası aktarılır.",
      ],
      [
        7,
        "bevor",
        "obwohl",
        "damit",
        "bevor anlamı kesinleştirmeden önce yapılacak bağlam kontrolünü sıralar. Bir sebep veya karşıtlık olarak yorumlama.",
      ],
    ],
  },
];

export default lessons;
