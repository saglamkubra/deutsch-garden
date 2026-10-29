import fs from "node:fs";
const c = {
  id: "a2-01-words",
  unitId: "a2-01",
  level: "A2",
  title: "Günlük Deneyimler · Dün Neler Yaptım?",
  goal: "Yaşadığın bir günü Perfekt ile anlat; yardımcı fiil seçimini açıkla, geçmiş deneyimler hakkında soru sor ve olayları sıraya koy.",
  steps: [],
  examples: [],
  guided: [],
  independent: [],
  texts: [],
  summary: { takeaways: [], vocabulary: [], mistakes: [], examples: [] },
  studyPlan: {
    prerequisites: [
      "A1 kişi zamirleri ve haben/sein çekimi",
      "Ana cümlede çekimli fiilin ikinci konumu",
      "Temel günlük rutinler ve isimlerin artikelleri",
    ],
    objectives: [
      "36 yeni kelime ve ifadeyi bağlam içinde kullanmak",
      "Düzenli, sık düzensiz ve ön ekli Partizip II biçimlerini ayırmak",
      "haben/sein seçimini gerekçelendirmek",
      "Geçmiş hakkında olumlu, olumsuz ve soru cümleleri kurmak",
      "Bir okuma metni ve diyaloğu anlayıp 6–8 cümlelik bir gün anlatısı oluşturmak",
    ],
    sessions: [
      {
        title: "1. oturum · Temeli kur",
        description:
          "1–6. açıklamalarla temeli kur. Tabloları aç, yardımcı fiili ve Partizip II biçimini kendi cümlelerinde ayır. Örnekler bölümü tüm açıklamalardan sonra açılır.",
      },
      {
        title: "2. oturum · Anlatımı genişlet",
        description:
          "7–14. açıklamaları, okuma ve diyaloğu incele; ardından 24 açıklamalı örneği ve 20 yönlendirmeli soruyu çalış. Gerektiğinde bu oturumu birkaç güne böl.",
      },
      {
        title: "3. oturum · Kendi başına uygula",
        description:
          "60 bağımsız soru, açıklamalı hata tekrarı ve ders özeti. İlerlemen kaldığın soruda saklanır; hepsini aynı gün bitirmen gerekmez.",
      },
    ],
  },
};
function step(
  title,
  introduction,
  rule,
  usage,
  structure,
  mistake,
  memory,
  rows,
  details,
) {
  c.steps.push({
    id: `a2-01-teach-${c.steps.length + 1}`,
    title,
    introduction,
    rule,
    usage,
    structure,
    mistake,
    memory,
    ...(rows
      ? {
          table: { heading: "Biçimi, görevini ve anlamını birlikte gör", rows },
        }
      : {}),
    details: details.map(([title, body]) => ({ title, body })),
  });
}
step(
  "1 · Bildiğin cümleden yeni bir deneyime",
  "A1’de Ich lerne Deutsch diyerek şu anki çalışmanı veya genel alışkanlığını anlattın. Şimdi bir arkadaşın dününün nasıl geçtiğini soruyor. Aynı kelimeyi bilmek yetmez; olayın geçmişte olduğunu da göstermen gerekir. Bildiğin özne ve fiilleri, tamamlanan deneyimleri anlatacak biçimde yeniden birleştireceğiz.",
  "Perfekt, gündelik konuşmada geçmişte gerçekleşen olayları anlatmak için sık kullanılır. Çekimli haben veya sein ile Partizip II birlikte anlam oluşturur. Almancadaki zamanlar Türkçedeki eklerle birebir örtüşmez; önce olayın bağlamını, sonra Almanca yapıyı düşün.",
  "Dün ne yaptığını, geçen hafta kimlerle görüştüğünü veya hafta sonunda nereye gittiğini söylerken kullanırsın. Bu ünitede kısa ana cümlelerle çalışıyoruz; weil/dass yan cümleleri ve ayrıntılı zaman karşılaştırmaları başka derslerin konusudur.",
  "Ich lerne Deutsch. → Ich habe Deutsch gelernt.",
  "Sadece gestern ekleyip Ich lerne gestern Deutsch demek, burada anlatmak istediğimiz tamamlanmış geçmiş deneyimi kurmaz. Buradaki hedef, açık bir Perfekt ana cümlesidir; her bağlamı tek bir zaman kuralına indirgemiyoruz.",
  "Önce “Ne oldu?” de: öğrenmek. Sonra iki parçayı bul: habe + gelernt.",
  [
    ["şimdi / genel", "Ich lerne Deutsch.", "Almanca öğreniyorum."],
    ["dün", "Ich habe Deutsch gelernt.", "Almanca çalıştım / öğrendim."],
  ],
  [
    [
      "İki parçayı birlikte gör",
      "Ich sözcüğü iki cümlede de aynı kişiyi gösteriyor. İkinci cümlede lerne yerine habe ve gelernt var. Habe kişiye göre çekiliyor; gelernt asıl eylemi taşıyor. Perfekt’i tek bir yeni fiil sanma: arada başka bilgiler bulunabilen iki parçalı bir yapı olarak gör.",
    ],
    [
      "Bu derste başarı ne demek?",
      "Başarı bütün biçimleri bir anda ezberlemek değildir. Yardımcı fiili ve Partizip II’yi bulabiliyor, bir seçimde nedenini açıklayabiliyor ve kısa bir deneyim anlatabiliyorsan hedefe yaklaşıyorsun. Yanlış yapınca açıklamaya dön; uygulama ilk hatanı silmeden düzeltmeni sağlar.",
    ],
  ],
);
step(
  "2 · Zamanı kur: gestern ve letzte Woche",
  "Anlatıya dinleyicinin zihninde yer açarak başla: bugün mü, dün mü, geçen hafta mı? Gestern “dün”, vorgestern “dünden önceki gün”, letzte Woche “geçen hafta” demektir. Am Wochenende bağlama göre geçmiş veya gelecek hafta sonunu gösterebilir; bu ifade tek başına zamanı kesinleştirmez.",
  "Zaman ifadesi başa geldiğinde bir öge sayılır; çekimli yardımcı fiil ikinci konumda kalır. İkinci konum, ikinci sözcük demek değildir: Letzte Woche iki sözcükten oluşsa da tek zaman ögesidir.",
  "Gestern habe ich ... diye başlayabilir veya zamanı ortada verebilirsin. Türkçedeki “Dün ben ...” sırasını aynen taşımak yerine ikinci konumdaki yardımcıyı koru.",
  "Ich habe gestern gelernt. ↔ Gestern habe ich gelernt.",
  "Gestern ich habe gelernt dizilişinde yardımcı üçüncü ögeye kayar. Doğru sıralama Gestern habe ich gelernt. Zaman başa gelince özne, yardımcıdan sonraya geçer.",
  "ZAMAN | YARDIMCI FİİL | ÖZNE | ... | PARTİZİP.",
  [
    ["dün", "gestern", "bir gün önce"],
    ["dünden önceki gün", "vorgestern", "iki gün önce"],
    ["geçen hafta", "letzte Woche", "önceki hafta"],
  ],
  [
    [
      "İki doğru başlangıç",
      "Ich habe gestern einen Film gesehen ve Gestern habe ich einen Film gesehen aynı temel olayı anlatır. İlkinde kişiyi, ikincisinde zamanı öne çıkarırsın. Her ikisinde de habe ikinci ögedir, gesehen sonda kalır. İki cümlede değişen yerleri parmağınla takip et.",
    ],
    [
      "Eve mi, evde mi?",
      "Nach Hause yönelmeyi, zu Hause bir yerde bulunmayı anlatır. Ich bin nach Hause gegangen: Eve gittim. Ich bin zu Hause geblieben: Evde kaldım. Yalnızca “ev” sözcüğünü bilmek yetmez; ifadeyi hareket veya konum bağlamıyla öğren.",
    ],
  ],
);
step(
  "3 · İki fiil arasında cümle çerçevesi",
  "Ich habe gestern einen Film gesehen cümlesinde habe ve gesehen arasında zaman ve nesne var. Bu bölgeyi bilgiyle doldurabilirsin; iki fiili yan yana yazmak zorunda değilsin. Dinlerken sondaki Partizip II gelene kadar anlamın tamamlanmasını beklemeyi öğrenmek önemlidir.",
  "Çekimli yardımcı ana cümlenin ikinci konumunda, asıl fiilin Partizip II biçimi sonda bulunur. Özne değişince yardımcı değişir; Partizip II bu kullanımda kişiye göre çekilmez.",
  "Önce kısa bir çekirdek cümle kur; sonra zaman, yer veya nesne ekle. Her eklemeden sonra yardımcı ile Partizip II’nin konumunu yeniden kontrol et.",
  "Ich | habe | gestern einen Film | gesehen. / Wir | haben | einen Film | gesehen.",
  "Wir haben einen Film gesehent değil, gesehen. Partizip II’ye ayrıca kişi eki eklenmez. Bu derste standart ana cümle çerçevesini çalışıyoruz; konuşmadaki sonradan eklenmiş bilgiler ayrı bir konudur.",
  "İki fiilin arasına köprü çiz: habe ______ gesehen.",
  [
    ["ich", "habe ... gesehen", "ben ... gördüm"],
    ["du", "hast ... gesehen", "sen ... gördün"],
    ["wir", "haben ... gesehen", "biz ... gördük"],
  ],
  [
    [
      "Cümleyi üç aşamada büyüt",
      "Ich habe gelernt: Çalıştım. Ich habe Deutsch gelernt: Almanca çalıştım. Ich habe gestern zu Hause Deutsch gelernt: Dün evde Almanca çalıştım. Bir anda uzun cümle yazmak yerine bu genişletme yöntemini kullan. Her eklemede temel yapının korunduğunu gör.",
    ],
    [
      "Habe her zaman “sahibim” değildir",
      "Ich habe ein Buch: Bir kitabım var. Ich habe ein Buch gelesen: Bir kitap okudum. İkinci cümlede habe yardımcıdır; asıl eylem gelesen içindedir. Kelime kelime “sahibim okunmuş” demiyoruz; iki parçayı birlikte geçmiş anlamıyla anlıyoruz.",
    ],
  ],
);
step(
  "4 · Haben: kişiye uygun yardımcı",
  "Çoğu günlük fiil Perfekt’te haben kullanır. Önce haben çekimini sağlamlaştıralım: ich habe, du hast ve er hat birbirinin yerine geçmez. Partizip II’yi doğru yazsan bile yanlış yardımcı çekimi özne-fiil uyumunu bozar.",
  "Haben şimdiki zaman biçimiyle çekilir: ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben. Geçmiş anlamı yapının tamamından doğar; yardımcının biçimi seni şaşırtmasın.",
  "Machen, lernen, arbeiten, hören, sehen ve essen gibi sık fiillerle kullan. Önce özneyi bul, yardımcıyı söyle, ardından Partizip II’yi ekle.",
  "Özne + habe/hast/hat/haben/habt/haben + ... + Partizip II.",
  "Ihr haben gelernt yanlış; ihr habt gelernt doğru. Sie hat ile sie haben arasındaki fark, sie’nin “o kadın” mı “onlar” mı olduğuna bağlıdır. Resmî Sie büyük harfle yazılır ve haben alır.",
  "Du → hast; ihr → habt. Kısa biçimleri özellikle sesli tekrar et.",
  [
    ["ich", "habe gelernt", "çalıştım"],
    ["du", "hast gelernt", "çalıştın"],
    ["er / sie / es", "hat gelernt", "çalıştı"],
    ["wir", "haben gelernt", "çalıştık"],
    ["ihr", "habt gelernt", "çalıştınız"],
    ["sie / Sie", "haben gelernt", "çalıştılar / çalıştınız"],
  ],
  [
    [
      "Türkçeden aktarım tuzağı",
      "Türkçede “Ben çalıştım” dediğinde kişi bilgisi fiilin ekinde görünür. Almancada ich yazman, yardımcıyı doğru çekme gereğini kaldırmaz. Ich haben ... yazıp kişi bilgisini yalnızca özneye bırakma. Denetlerken özne ve çekimli fiili bir çift olarak oku.",
    ],
    [
      "Anlamı kaybetmeden dönüştür",
      "Ich habe gelernt cümlesini önce wir öznesiyle kur: Wir haben gelernt. Sonra du ile söyle: Du hast gelernt. Gelernt aynı kaldı; değişen parça yardımcıdır. Bu küçük dönüşümleri hızlı ezber testi olarak değil, yapının hangi bölümünün ne işe yaradığını anlamak için yap.",
    ],
  ],
);
step(
  "5 · Düzenli Partizip II: ge- + kök + -t",
  "Machen fiilinden -en bölümünü çıkarınca mach- kökü kalır. Başına ge-, sonuna -t ekleyince gemacht olur. Lernen → gelernt ve spielen → gespielt aynı örüntüyü izler. Ancak bu formülü bütün Almanca fiillere uygulamayacağız; düzensizleri ayrıca öğreneceğiz.",
  "Birçok düzenli fiilde ge- + kök + -t kullanılır. Kökü -t veya -d ile biten sık düzenli fiillerde söyleyişi kolaylaştıran -et görülür: arbeiten → gearbeitet, warten → gewartet.",
  "Yaptığın işi veya çalıştığın dersi anlatabilirsin. Yardımcıyı eklemeden yalnızca Partizip II yazmak, tam bir Perfekt ana cümlesi oluşturmaz.",
  "Machen → gemacht → Ich habe das Frühstück gemacht.",
  "Gearbeitet yerine gearbeitt yazma. Ich gemacht değil, Ich habe ... gemacht gerekir. Düzenli örüntüyü öğrendikten sonra her fiili mekanik biçimde bu örüntüye zorlama.",
  "Bir paket gibi gör: ge-[kök]-t; gearbeitet içinde araya e girer.",
  [
    ["machen", "hat gemacht", "yaptı"],
    ["lernen", "hat gelernt", "öğrendi"],
    ["spielen", "hat gespielt", "oynadı"],
    ["arbeiten", "hat gearbeitet", "çalıştı"],
    ["warten", "hat gewartet", "bekledi"],
  ],
  [
    [
      "Kökü gerçekten bul",
      "Lernen içindeki kök lern- olduğu için gelernt yazarız; gelernen değil. Kartına yalnızca gelernt değil, lernen – hat gelernt çiftini yaz. Böylece mastarı, yardımcıyı ve geçmiş biçimi birlikte hatırlarsın. Bu yöntem düzensiz fiillerde de işine yarar.",
    ],
    [
      "Kısa cümleden kullanıma geç",
      "Ich habe Musik gehört cümlesini oku. Ich yerine wir getir: Wir haben Musik gehört. Nesneyi değiştir: Wir haben einen Podcast gehört. Partizip II aynı kaldı, yardımcı özneye uydu. Kuralı yalnızca tanımaktan kullanmaya geçmek için benzer küçük değişiklikler yap.",
    ],
  ],
);
step(
  "6 · Düzensizleri anlamlı gruplarla öğren",
  "Günlük deneyimler yalnızca düzenli fiillerden oluşmaz: yersin, içersin, birini görürsün, kitap okursun. Essen → gegessen, trinken → getrunken, sehen → gesehen ve lesen → gelesen biçimlerini ayrı tanımalısın. Kökün sesi veya yazımı değişebilir.",
  "Sık güçlü fiillerin Partizip II biçimi çoğunlukla -en ile biter; fakat kök değişimlerini tek bir tahmin kuralı açıklamaz. Karışık fiiller de vardır: bringen → gebracht. Fiili yardımcı ve kısa örnekle birlikte öğren.",
  "Ne yediğini, ne izlediğini veya kiminle buluştuğunu anlat. Her oturumda birkaç biçimi tekrar etmek, uzun bir listeyi aynı anda ezberlemekten daha yönetilebilirdir.",
  "Essen – hat gegessen; trinken – hat getrunken; treffen – hat getroffen.",
  "Geesst, getrinkt veya gelest yazmak, düzenli örüntüyü düzensize taşımaktır. Hatanı düzeltirken yalnızca doğru biçimi kopyalama; mastar ve Partizip II’yi yan yana söyle.",
  "Bir küçük sahne: Ich habe gegessen, Wasser getrunken und ein Buch gelesen.",
  [
    ["essen", "hat gegessen", "yedi"],
    ["trinken", "hat getrunken", "içti"],
    ["lesen", "hat gelesen", "okudu"],
    ["sehen", "hat gesehen", "gördü / izledi"],
    ["treffen", "hat getroffen", "buluştu"],
    ["schlafen", "hat geschlafen", "uyudu"],
  ],
  [
    [
      "Ezber listesini bir güne dönüştür",
      "Sabah için Ich habe Brot gegessen, öğle için Ich habe Wasser getrunken, akşam için Ich habe ein Buch gelesen de. Gerçekçi bir zaman çizgisi kurduğunda biçimler arasında bağ oluşur. Örnekleri hayalî bir güne uyarlayabilirsin; özel bilgi yazmak zorunda değilsin.",
    ],
    [
      "Aşırı genelleme yapma",
      "Sehen → gesehen örneğinde -en korunurken trinken → getrunken içinde kök de değişir. Bringen → gebracht ise -t ile biter ama kökü değişmiştir. “Sonu -t ise kök asla değişmez” gibi kestirmeler doğru değildir. Burada verilen sık biçimleri, kullanımlarıyla öğreniyoruz.",
    ],
  ],
);
step(
  "7 · Ne zaman sein? Hareketi doğru yorumla",
  "Ich bin nach Hause gegangen içinde bin, haben yerine sein seçildiğini gösterir. Bir yerden başka bir yere gitmek gibi, nesne almayan yer değiştirmelerde sein yaygındır. Fakat “hareket varsa her zaman sein” doğru değildir: Ich habe getanzt gibi cümleler de vardır.",
  "Bu derste gehen, kommen, ankommen, aufstehen ve bir yere yolculuk anlamındaki fahren ile sein kullanacağız. Bleiben yer değiştirme anlatmasa da sein alan önemli bir istisnadır. Seçim, fiilin bu cümledeki kullanımına bağlıdır.",
  "Bir yere gittiğini, vardığını, ayağa kalktığını veya evde kaldığını anlat. Fahren, bir aracı sürmek gibi geçişli başka kullanımlarda haben alabilir; burada bir yere yolculuğu çalışıyoruz.",
  "Gehen – ist gegangen; ankommen – ist angekommen; bleiben – ist geblieben.",
  "Ich habe nach Hause gegangen değil, Ich bin nach Hause gegangen. Ich bin Deutsch gelernt de yanlış: lernen bu kullanımda haben alır. Sadece Türkçe “hareket” sözcüğüne dayanarak seçim yapma.",
  "Bu örneklerde gitmek, gelmek, varmak → sein. Bleiben’i ayrı istisna kartına yaz.",
  [
    ["gehen", "ist gegangen", "gitti"],
    ["kommen", "ist gekommen", "geldi"],
    ["ankommen", "ist angekommen", "vardı"],
    ["aufstehen", "ist aufgestanden", "kalktı"],
    ["bleiben", "ist geblieben", "kaldı"],
  ],
  [
    [
      "İki soruyla karar ver",
      "Önce fiili belirle: lernen mi, gehen mi? Sonra ne anlattığını düşün. Ich habe Deutsch gelernt öğrenme etkinliğidir; Ich bin nach Hause gegangen yer değiştirmedir. Yardımcıyı seçerken yalnızca gestern sözcüğüne bakamazsın: zaman ifadesi, hangi yardımcıyı kullanacağını söylemez.",
    ],
    [
      "İstisnayı görünür kıl",
      "Ich bin zu Hause geblieben, “yer değiştirme yoksa mutlaka haben” varsayımını bozar. Almancayı gerçek örneklerle öğrenmenin nedeni budur. Bleiben’i sein ile birlikte öğren; yardımcı seçiminin daha ayrıntılı kullanımlarını sonraki derslerde genişleteceğiz.",
    ],
  ],
);
step(
  "8 · Sein çekimi: bin, bist, ist, sind, seid",
  "Yardımcıyı sein olarak seçmek yeterli değildir; özneyle uyumlu biçimi de bulmalısın. Ich bin ile du bist farklıdır. Türkçede özne düşebilse de bu alıştırmalarda özneyi açık yazıp iki parçalı yapıyı sağlam kuracağız.",
  "Ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind. Gegangen gibi Partizip II biçimi özneye göre değişmez. Yalnızca yardımcıyı kişiye uygun çekersin.",
  "Bir yolculuğu yalnız mı, arkadaşlarınla mı yaptığını anlatırken aynı fiili farklı kişilerle kullanabilirsin. Özellikle ihr seid biçimini sind ile karıştırmadan çalış.",
  "Ich bin gegangen. → Du bist gegangen. → Wir sind gegangen.",
  "Ihr sind angekommen değil, Ihr seid angekommen. Sie ist angekommen “o kadın geldi”; sie sind angekommen “onlar geldi”; Sie sind angekommen ise resmî “siz geldiniz” olabilir.",
  "İkili gruplar halinde söyle: ich bin – du bist; wir sind – ihr seid.",
  [
    ["ich", "bin gegangen", "gittim"],
    ["du", "bist gegangen", "gittin"],
    ["er / sie / es", "ist gegangen", "gitti"],
    ["wir", "sind gegangen", "gittik"],
    ["ihr", "seid gegangen", "gittiniz"],
    ["sie / Sie", "sind gegangen", "gittiler / gittiniz"],
  ],
  [
    [
      "Aynı olayı başka kişi anlatsın",
      "Ich bin mit dem Zug gefahren cümlesini arkadaşınla birlikte kur: Wir sind mit dem Zug gefahren. Burada mit dem Zug araç bilgisidir; yardımcıyı seçtiren, fahren fiilinin bir yere yolculuk anlamındaki kullanımıdır. Sadece Zug sözcüğü geçti diye sein seçmiyoruz.",
    ],
    [
      "Üç parçalı kontrol",
      "Uzun bir cümleyi bitirince özne, yardımcı ve son fiile bak. Wir / sind / angekommen uyumlu; wir / ist / angekommen uyumsuzdur. Bu üç parçayı parmağınla takip etmek, araya zaman ve yer bilgileri girdiğinde hatanın yerini bulmanı kolaylaştırır.",
    ],
  ],
);
step(
  "9 · Ön ekler: eingekauft ama besucht",
  "Ayrılabilen fiiller A1’den tanıdık: Ich stehe auf. Perfekt’te ön ek kaybolmaz; Partizip II’nin içinde yer alır: aufgestanden. Besuchen gibi ayrılamayan ön ekli fiilde ise ge- eklemeyiz. Ön eki tanımak, kulağa benzer yanlış biçimleri ayırmanı sağlar.",
  "Ayrılabilen ön eklerde ge- genellikle ön ekin ardından gelir: einkaufen → eingekauft, anrufen → angerufen. Be-, ver-, er- gibi ayrılamayan ön eklerde ge- kullanılmaz: besuchen → besucht, verstehen → verstanden.",
  "Alışveriş, arama, oda toplama ve ziyaret anlat. Ön ek, yardımcıyı tek başına belirlemez: eingekauft haben, angekommen sein ile kurulur.",
  "Einkaufen → ein-ge-kauft; aufräumen → auf-ge-räumt; besuchen → besucht.",
  "Geeinkauft veya gebesucht yazma. Ich habe ein gekauft diyerek Partizip II’yi ayırma; eingekauft bu kullanımda tek sözcüktür. Anrufen → angerufen içindeki kök değişimini unutma.",
  "Ön ek ayrılabiliyorsa ge- araya girer; be- ve ver- ile ge- görünmez.",
  [
    ["einkaufen", "hat eingekauft", "alışveriş yaptı"],
    ["aufräumen", "hat aufgeräumt", "topladı"],
    ["anrufen", "hat angerufen", "aradı"],
    ["besuchen", "hat besucht", "ziyaret etti"],
    ["verstehen", "hat verstanden", "anladı"],
    ["ankommen", "ist angekommen", "vardı"],
  ],
  [
    [
      "İki kararı ayır",
      "Einkaufen için önce Partizip II’yi kur: eingekauft. Sonra yardımcıyı seç: haben. Ankommen için biçim angekommen, yardımcı sein olur. Bütün parçaları aynı anda tahmin etmek yerine bu iki kararı ayrı düşünmek hatanın nerede olduğunu bulmana yardım eder.",
    ],
    [
      "A1 ile köprü",
      "Ich rufe meine Schwester an, dün için Ich habe meine Schwester angerufen olur. Ön ek an- ayrı bir sona atılmış parça olarak değil, angerufen içinde görünür. İki cümleyi yüksek sesle oku ve değişen biçimlerin aynı eylemi anlattığını fark et.",
    ],
  ],
);
step(
  "10 · -ieren fiilleri: telefoniert ve passiert",
  "Telefonieren uzun görünse de Partizip II biçimi kolay tanınır: telefoniert. -ieren ile biten bu grupta ge- kullanılmaz. Her ge- eksikliğini hata sanmak yerine fiilin hangi örüntüye ait olduğuna bakmalısın.",
  "-ieren fiilleri genellikle -iert ile Partizip II kurar ve ge- almaz: telefonieren → telefoniert, studieren → studiert. Bu örüntü yardımcıyı belirlemez: telefonieren haben alırken “meydana gelmek” anlamındaki passieren sein alır.",
  "Telefon görüşmesi veya gerçekleşen bir olay anlatırken kullan. Passieren burada “olmak / meydana gelmek” anlamındadır; farklı geçişli anlamları bu ünitede çalışmıyoruz.",
  "Ich habe telefoniert. / Was ist passiert?",
  "Getelefoniert yazma. Bütün -ieren fiilleri haben alır diye düşünme: Was ist passiert? bunun karşı örneğidir. Partizip biçimini ve yardımcı seçimini ayrı denetle.",
  "-ieren gördüğünde “ge- yok” de; yardımcı eşini ayrıca hatırla.",
  [
    ["telefonieren", "hat telefoniert", "telefonda konuştu"],
    ["studieren", "hat studiert", "üniversitede öğrenim gördü"],
    ["passieren", "ist passiert", "oldu / meydana geldi"],
  ],
  [
    [
      "İşe yarayan soru kalıbı",
      "Was ist passiert? “Ne oldu?” demektir ve konuşmada bütün bir kalıp olarak öğrenilebilir. Ist, burada olayın gerçekleşmesini anlatan passieren fiilinin yardımcısıdır. “Sonu -ieren, mutlaka habe kullanmalıyım” yaklaşımı doğru değildir.",
    ],
    [
      "Aramak ile konuşmak",
      "Ich habe meine Mutter angerufen: Annemi aradım. Ich habe mit meiner Mutter telefoniert: Annemle telefonda konuştum. İkisi bağlantılı ama farklı yapılardır. Anrufen doğrudan kimi aradığını belirtir; telefonieren örneğindeki mit + kişi kalıbını da bütün olarak öğren.",
    ],
  ],
);
step(
  "11 · Olumsuzluk: nicht mi, kein mi?",
  "“Dün çalıştım” kadar “Dün çalışmadım” demek de önemlidir. Bir şeyi hiç almadığını söylemekle bir işi yapmadığını söylemek aynı yapı değildir. Türkçede bir olumsuz fiil eki kullanabildiğin yerlerde Almancada nicht ve kein arasında seçim gerekebilir.",
  "Belirsiz veya artikelsiz bir ismi olumsuzlarken kein/keine kullanılır. Bu basit örneklerde eylemi olumsuzlayan nicht, Partizip II’den önce gelir: Ich habe nicht gearbeitet. Daha ayrıntılı cümlelerde konumu olumsuzlanan ögeye göre değişebilir.",
  "Çalışmadığını, kahve içmediğini veya ekmek almadığını söyle. Burada bütün olumsuzluk konusunu bitirmiyoruz; sık iki kullanımı sağlamlaştırıyoruz.",
  "Ich habe nicht gearbeitet. / Ich habe keinen Kaffee getrunken. / Ich habe kein Brot gekauft.",
  "Kahve içmediğini nötr biçimde anlatırken burada hedeflenen kullanım keinen Kaffee’dir. Kaffee eril olduğu için nesne hâlinde keinen olur. Brot nötrdür; kein Brot kullanılır.",
  "Eylem: nicht gearbeitet. Belirsiz isim: kein Brot, keinen Kaffee.",
  [
    ["çalışmadım", "Ich habe nicht gearbeitet.", "Eylem olumsuz."],
    ["ekmek almadım", "Ich habe kein Brot gekauft.", "Brot nötr isim."],
    [
      "kahve içmedim",
      "Ich habe keinen Kaffee getrunken.",
      "Kaffee eril, nesne hâli.",
    ],
  ],
  [
    [
      "Akkusativ’i neden görüyoruz?",
      "Ein Kaffee → einen Kaffee, kein Kaffee → keinen Kaffee dönüşümü trinken fiilinin nesnesinde olur. Bu çekim Perfekt yüzünden oluşmaz: Ich trinke keinen Kaffee cümlesinde de aynıdır. Yeni zamanı öğrenirken bildiğin isim çekimlerini de korumalısın.",
    ],
    [
      "Anlamı değiştirmeden düzelt",
      "Ich habe gestern gearbeitet nicht cümlesinde bu dersin nötr anlatımı için nicht’i Partizip II’den önce yerleştir: Ich habe gestern nicht gearbeitet. Sonra cümleyi anlamıyla oku. Sadece sözcüğün yerini değiştirmek değil, neyin olumsuzlandığını anlamak önemlidir.",
    ],
  ],
);
step(
  "12 · Sorular: Hast du …? Wohin bist du …?",
  "Bir deneyimi anlatmak iletişimin yarısıdır; diğer yarısı karşındakini dinleyip soru sormaktır. Cevabı evet/hayır olan sorularla, ne veya nereye gibi bilgi isteyen soruların dizilişi farklıdır. Yardımcı fiil bu ayrımı görmeni kolaylaştırır.",
  "Evet/hayır sorusunda yardımcı başa gelir: Hast du gelernt? Soru sözcüklü soruda soru ögesi başta, yardımcı ikinci konumdadır: Was hast du gemacht? Partizip II her ikisinde de sonda kalır.",
  "Hafta sonunda alışveriş yapılıp yapılmadığını, dün nereye gidildiğini veya kimin ziyaret edildiğini sor. Was eylem/şey, wohin yön, wann zaman bilgisi ister.",
  "Hast du gestern gelernt? / Was hast du gemacht? / Wohin bist du gegangen?",
  "Was du hast gemacht? yanlış; Was hast du gemacht? doğru. Soru kurmak yardımcı seçimini değiştirmez: bist du gearbeitet değil, hast du gearbeitet gerekir.",
  "Bilgi sorusu: SORU | YARDIMCI | ÖZNE | ... | PARTİZİP.",
  [
    ["evet / hayır", "Hast du eingekauft?", "Alışveriş yaptın mı?"],
    ["ne", "Was hast du gemacht?", "Ne yaptın?"],
    ["nereye", "Wohin bist du gegangen?", "Nereye gittin?"],
    ["ne zaman", "Wann bist du angekommen?", "Ne zaman vardın?"],
  ],
  [
    [
      "Cevabı sorudan kur",
      "Was hast du gemacht? sorusundaki du’yu cevabında ich yap: Ich habe gelernt. Wohin bist du gegangen? sorusuna yer ekle: Ich bin nach Hause gegangen. Yardımcıyı sorudan otomatik kopyalama; konuşan kişi değişince çekim de değişir.",
    ],
    [
      "Sohbeti soru listesine çevirme",
      "Schön!, Wirklich? veya Und danach? gibi kısa tepkiler dinlediğini gösterir. Her tepkiyi karmaşık bir cümleye çevirmek zorunda değilsin. Diyalog çalışmasında önce olayı anla; sonra karşı tarafın söylediği bilgiyle bağlantılı tek bir takip sorusu seç.",
    ],
  ],
);
step(
  "13 · Olayları anlaşılır sıraya koy",
  "Beş doğru cümle kurup hepsine gestern ile başlamak anlaşılır ama biraz liste gibi duyulur. Zuerst, dann, danach ve zum Schluss olay sırasını gösterir. Önce, sonra, ondan sonra, en son bağlantılarıyla basit bir anlatıyı daha kolay takip edilir yapabilirsin.",
  "Bu ifadeler başta kullanılırsa ilk öge sayılır; yardımcı ikinci konumda kalır. İki tam ana cümleyi und ile bağladığında her cümlenin kendi çekimli fiilini koruyabilirsin.",
  "Sabah, öğle ve akşam yaptıklarını sırayla anlat. Her cümleye çok sayıda ayrıntı sıkıştırmak yerine önce olay sırasını açık tut; sonra gerekli bilgiyi ekle.",
  "Zuerst habe ich gefrühstückt. Dann bin ich in den Park gegangen. Danach habe ich gelesen.",
  "Danach ich habe gelesen değil, Danach habe ich gelesen. Sein alan yeni bir fiile geçerken önceki cümlenin habe yardımcısını yanlışlıkla sürdürme.",
  "Önce bağlayıcıyı söyle; ardından yardımcıyı hemen yerleştir.",
  [
    ["önce", "zuerst", "ilk olay"],
    ["sonra", "dann", "bir sonraki olay"],
    ["ondan sonra", "danach", "önceki olayın ardından"],
    ["en son", "zum Schluss", "son olay"],
  ],
  [
    [
      "Listeden kısa anlatıya",
      "Ich habe gefrühstückt. Ich bin in den Park gegangen. Ich habe gelesen. cümlelerini ayrı ayrı denetle. Sonra başlangıçları değiştir: Zuerst habe ich gefrühstückt. Dann bin ich in den Park gegangen. Danach habe ich gelesen. Bağlantı eklerken fiilin ikinci konumunu koruduğuna dikkat et.",
    ],
    [
      "Gerçek konuşmada war da var",
      "Am Abend war ich müde, “Akşam yorgundum” demektir. War, sein fiilinin sık kullanılan Präteritum biçimidir. Bu örneği tanıman yeterli; bütün Präteritum çekimlerinden henüz sorumlu değilsin. Bu ünitenin üretim sorularında odağımız Perfekt olarak kalır.",
    ],
  ],
);
step(
  "14 · Metni çöz, kendi gününü anlat",
  "Öğrendiğin parçaları birleştirelim. Okuma metnini önce yardımcıları bulmak, ikinci kez olay sırasını anlamak için oku. Diyalogda hangi soruya hangi cevabın verildiğine bak. Tek bir bilinmeyen sözcük bütün metni anlamanı engellemek zorunda değildir.",
  "Zaman işaretini, özneyi, yardımcıyı ve Partizip II’yi sırayla bul. Okuduğunu anlama sorusunda kendi hayatına göre değil metne göre cevap ver. Metnin söylemediği bilgiyi tahmin edip kesinleştirme.",
  "Kısa günlük notu, hafta sonu mesajı veya arkadaş sohbetinde kullan. Gerçek hayatın yerine hayalî bir gün seçebilirsin; özel bilgilerini uygulamaya veya Lumi’ye yazman gerekmez.",
  "6–8 kısa cümle: zaman + iki haben cümlesi + iki sein cümlesi + bir olumsuzluk + olay sırası + bir soru.",
  "Yardımcıyı unutmak, bütün fiillere ge- eklemek veya metnin söylemediği bilgiyi cevaba katmak yaygın hatalardır. Önce kısa cümlelerin doğruluğunu kur; ayrıntıyı sonra artır.",
  "Son kontrol: zaman açık mı, yardımcı doğru mu, özneyle uyumlu mu, Partizip II sonda mı?",
  null,
  [
    [
      "İsteğe bağlı üretim görevin",
      "Not defterine “Mein gestriger Tag” başlığıyla 6–8 cümle yaz. En az iki haben, iki sein cümlesi ve bir olumsuzluk kullan. Zuerst, dann ve danach ile sırayı kur. Sonunda bir arkadaşına sorabileceğin soru ekle. Bu serbest metin otomatik puanlanmaz; kendi kontrol listeni kullan.",
    ],
    [
      "Kendi öğretmenin ol",
      "Her cümlede yardımcı ve Partizip II’nin altını çiz. Seçimini bir cümleyle Türkçe açıkla. “Neden bin?” sorusuna “burada gehen bir yere gitmeyi anlatıyor” diyebilmeye çalış. Emin olmadığın cümleyi kısaltıp örneklerle karşılaştır; uzunluk tek başına başarı değildir.",
    ],
  ],
);

// Examples, vocabulary and exercise banks are appended below.
const exampleRows = [
  [
    "Ich habe gestern Deutsch gelernt.",
    "Dün Almanca çalıştım.",
    "Lernen düzenlidir: gelernt. Ich için habe seçilir. Zaman bilgisi arada durabilir; gelernt ana cümlenin sonunda kalır.",
    ["habe", "gelernt"],
  ],
  [
    "Gestern habe ich das Frühstück gemacht.",
    "Dün kahvaltıyı hazırladım.",
    "Zaman ilk öge olduğundan habe ikinci konumdadır ve ich onun ardından gelir. Frühstück isim olduğu için büyük harfle yazılır.",
    ["Gestern", "habe", "gemacht"],
  ],
  [
    "Du hast am Wochenende viel gearbeitet.",
    "Hafta sonunda çok çalıştın.",
    "Du öznesi hast ister. Arbeiten kökü -t ile bittiği için Partizip II içinde ek e görülür: gearbeitet.",
    ["hast", "gearbeitet"],
  ],
  [
    "Wir haben einen Film gesehen.",
    "Bir film izledik.",
    "Sehen düzensizdir: gesehen. Film eril isimdir; nesne olduğu için einen Film olur. Wir ile yardımcı haben kullanılır.",
    ["haben", "einen Film", "gesehen"],
  ],
  [
    "Sie hat Brot gegessen und Wasser getrunken.",
    "O, ekmek yedi ve su içti.",
    "Sie burada tekil kadın öznesidir. Essen ve trinken düzensizdir. Aynı özne ve yardımcıya bağlanan ikinci eylemde hat tekrar edilmeyebilir.",
    ["hat", "gegessen", "getrunken"],
  ],
  [
    "Ihr habt eine Nachricht geschrieben.",
    "Bir mesaj yazdınız.",
    "Ihr ile habt gerekir. Schreiben → geschrieben güçlü fiildir. Nachricht dişildir; bu örnekte nesne olsa da eine biçimi değişmez.",
    ["habt", "geschrieben"],
  ],
  [
    "Ich bin gestern nach Hause gegangen.",
    "Dün eve gittim.",
    "Gehen burada yer değiştirmeyi anlatır ve sein alır. Ich için bin seçilir. Nach Hause yönü, gegangen geçmiş eylemi gösterir.",
    ["bin", "nach Hause", "gegangen"],
  ],
  [
    "Wir sind mit dem Zug gefahren.",
    "Trenle yolculuk yaptık.",
    "Fahren burada bir araçla yolculuk anlamındadır ve sein alır. Wir için sind gerekir. Mit dem Zug araç bildiren bir kalıptır.",
    ["sind", "gefahren"],
  ],
  [
    "Meine Freundin ist um neun angekommen.",
    "Arkadaşım saat dokuzda vardı.",
    "Ankommen → angekommen ayrılabilen ön ek örneğidir. Varış eylemi sein ile kurulur; tekil özne için ist kullanılır.",
    ["ist", "angekommen"],
  ],
  [
    "Wir sind am Sonntag zu Hause geblieben.",
    "Pazar günü evde kaldık.",
    "Bleiben, yer değiştirme olmamasına rağmen sein alır. Zu Hause bulunulan yeri gösterir; nach Hause ile aynı değildir.",
    ["sind", "zu Hause", "geblieben"],
  ],
  [
    "Ich bin heute früh aufgestanden.",
    "Bugün erken kalktım.",
    "Bugün sözcüğü Perfekt’i engellemez: bugün tamamlanmış bir olay anlatılabilir. Aufstehen → aufgestanden ve bu kullanımda sein gerekir.",
    ["bin", "aufgestanden"],
  ],
  [
    "Am Nachmittag habe ich eingekauft.",
    "Öğleden sonra alışveriş yaptım.",
    "Einkaufen → eingekauft ayrılabilen ön ek örneğidir. Zaman ilk öge olduğu için habe ikinci konuma gelir. Ön ekli her fiil sein almaz.",
    ["habe", "eingekauft"],
  ],
  [
    "Danach habe ich mein Zimmer aufgeräumt.",
    "Ondan sonra odamı topladım.",
    "Aufräumen → aufgeräumt biçiminde ge- ön ekten sonra gelir. Danach ilk ögedir, habe ikinci konumdadır. Zimmer nötrdür: mein Zimmer.",
    ["Danach", "habe", "aufgeräumt"],
  ],
  [
    "Ich habe meine Schwester angerufen.",
    "Kız kardeşimi / ablamı aradım.",
    "Anrufen → angerufen hem ayrılabilen hem kök değişimi olan bir fiildir. Kimi aradığını doğrudan nesneyle söylersin.",
    ["habe", "angerufen"],
  ],
  [
    "Wir haben unsere Nachbarn besucht.",
    "Komşularımızı ziyaret ettik.",
    "Besuchen, ayrılamayan be- ön ekiyle başlar: besucht, gebesucht değil. Wir için haben gerekir; unsere Nachbarn çoğul nesnedir.",
    ["haben", "besucht"],
  ],
  [
    "Ich habe lange mit meiner Freundin telefoniert.",
    "Arkadaşımla uzun süre telefonda konuştum.",
    "Telefonieren -ieren ile biter ve ge- almaz. Mit meiner Freundin görüştüğün kişiyi gösteren kalıptır. Aramak ile telefonda konuşmak farklı yapılardır.",
    ["habe", "telefoniert"],
  ],
  [
    "Was ist gestern passiert?",
    "Dün ne oldu?",
    "Passieren burada olayın meydana gelmesini anlatır ve sein alır. Soru sözcüğü ilk, ist ikinci konumdadır; passiert ge- almaz.",
    ["Was", "ist", "passiert"],
  ],
  [
    "Ich habe gestern nicht gearbeitet.",
    "Dün çalışmadım.",
    "Bu nötr cümlede nicht eylemi olumsuzlar ve gearbeitet biçiminden önce durur. Olumsuzluk yardımcı fiili ortadan kaldırmaz.",
    ["habe", "nicht", "gearbeitet"],
  ],
  [
    "Ich habe keinen Kaffee getrunken.",
    "Kahve içmedim.",
    "Kaffee eril isimdir ve trinken fiilinin nesnesidir. Bu yüzden kein, keinen olur. Belirsiz ismi olumsuzlarken burada kein ailesi kullanılır.",
    ["keinen Kaffee", "getrunken"],
  ],
  [
    "Hast du deine Freundin getroffen?",
    "Arkadaşınla buluştun mu?",
    "Evet/hayır sorusunda hast ilk konumdadır. Treffen → getroffen düzensizdir; du için yardımcı çekimi hast olarak kalır.",
    ["Hast", "getroffen"],
  ],
  [
    "Was hast du am Wochenende gemacht?",
    "Hafta sonunda ne yaptın?",
    "Bilgi sorusunda was ilk, hast ikinci ögedir. Cevapta özne du’dan ich’e geçince yardımcı da habe olur.",
    ["Was", "hast", "gemacht"],
  ],
  [
    "Wohin seid ihr gestern gegangen?",
    "Dün nereye gittiniz?",
    "Wohin yön sorar. Gehen bu kullanımda sein alır ve ihr için seid gerekir. Hem yardımcı ailesini hem kişi çekimini denetle.",
    ["Wohin", "seid", "gegangen"],
  ],
  [
    "Zuerst habe ich gelesen, dann habe ich gekocht.",
    "Önce okudum, sonra yemek pişirdim.",
    "İki ana cümlede de yardımcı ikinci konumda durur. Lesen → gelesen düzensiz; kochen → gekocht düzenlidir. Bağlayıcılar olay sırasını gösterir.",
    ["Zuerst", "habe", "gelesen", "dann", "gekocht"],
  ],
  [
    "Am Abend war ich müde, aber ich habe noch eine Nachricht geschrieben.",
    "Akşam yorgundum ama yine de bir mesaj yazdım.",
    "War, sein fiilinin sık kullanılan Präteritum biçimidir. Aynı anlatıdaki ikinci cümlenin Perfekt olması doğaldır; bütün fiiller tek biçimde olmak zorunda değildir.",
    ["war", "habe", "geschrieben"],
  ],
];
c.examples = exampleRows.map(([de, tr, explanation, highlights], i) => ({
  id: `a2-01-example-${i + 1}`,
  de,
  tr,
  explanation,
  highlights,
}));
c.texts = [
  {
    id: "a2-01-reading",
    title: "Okuma · Leyla’nın küçük hafta sonu",
    de: "Am Samstag bin ich um acht aufgestanden. Zuerst habe ich mit meiner Schwester gefrühstückt. Danach sind wir mit dem Zug nach Köln gefahren. Dort haben wir unsere Freundin Nora getroffen. Wir haben einen Spaziergang gemacht und im Park Brot gegessen. Am Nachmittag hat es geregnet. Deshalb sind wir in ein Café gegangen. Ich habe Tee getrunken und eine Nachricht an meinen Bruder geschrieben. Nora hat ihre Mutter angerufen. Am Abend sind wir nach Hause gefahren. Ich habe nicht mehr gelernt. Der Tag war schön, aber ich war müde.",
    tr: "Cumartesi saat sekizde kalktım. Önce kız kardeşimle kahvaltı yaptım. Ardından trenle Köln’e gittik. Orada arkadaşımız Nora ile buluştuk. Yürüyüş yaptık ve parkta ekmek yedik. Öğleden sonra yağmur yağdı. Bu nedenle bir kafeye gittik. Çay içtim ve erkek kardeşime bir mesaj yazdım. Nora annesini aradı. Akşam eve döndük. Artık ders çalışmadım. Gün güzeldi ama yorgundum.",
    notes:
      "Önce zaman ifadelerini, sonra yardımcı fiil çiftlerini işaretle. Deshalb “bu nedenle” demektir. Metin yaş, meslek veya yolculuk ücretini söylemiyor; bunları tahmin ederek cevaplama.",
  },
  {
    id: "a2-01-dialogue",
    title: "Diyalog · Pazartesi kısa bir sohbet",
    de: "Mert: Hallo Ada! Wie war dein Wochenende?\nAda: Schön! Ich habe am Samstag meine Nachbarn besucht.\nMert: Was habt ihr zusammen gemacht?\nAda: Wir haben gekocht und danach einen Film gesehen.\nMert: Bist du am Sonntag auch ausgegangen?\nAda: Nein, ich bin zu Hause geblieben. Ich habe mein Zimmer aufgeräumt und mit meiner Schwester telefoniert.\nMert: Hast du auch Deutsch gelernt?\nAda: Ja, am Abend habe ich zwanzig Minuten gelesen. Und du?\nMert: Ich bin mit meinem Bruder in den Park gegangen. Wir haben Musik gehört.",
    tr: "Mert: Merhaba Ada! Hafta sonun nasıldı?\nAda: Güzeldi! Cumartesi komşularımı ziyaret ettim.\nMert: Birlikte ne yaptınız?\nAda: Yemek pişirdik ve sonra bir film izledik.\nMert: Pazar günü de dışarı çıktın mı?\nAda: Hayır, evde kaldım. Odamı topladım ve kız kardeşimle telefonda konuştum.\nMert: Almanca da çalıştın mı?\nAda: Evet, akşam yirmi dakika okudum. Ya sen?\nMert: Erkek kardeşimle parka gittim. Müzik dinledik.",
    notes:
      "Sorudaki hast/bist ile cevaptaki habe/bin biçimlerini karşılaştır. Ausgegangen, ausgehen fiilinin “dışarı çıkmak” anlamındaki geçmiş biçimidir. Und du? aynı soruyu doğal biçimde karşı tarafa verir.",
  },
];
const vocabulary = [
  [
    "gestern",
    "dün",
    "adverb",
    "Gestern habe ich einen Spaziergang gemacht.",
    "Dün yürüyüş yaptım.",
  ],
  [
    "vorgestern",
    "dünden önceki gün",
    "adverb",
    "Vorgestern habe ich Nora besucht.",
    "Dünden önceki gün Nora’yı ziyaret ettim.",
  ],
  [
    "damals",
    "o zamanlar",
    "adverb",
    "Damals habe ich in Köln gewohnt.",
    "O zamanlar Köln’de yaşıyordum.",
  ],
  [
    "zuerst",
    "önce; ilk olarak",
    "adverb",
    "Zuerst habe ich gefrühstückt.",
    "Önce kahvaltı yaptım.",
  ],
  [
    "dann",
    "sonra",
    "adverb",
    "Dann bin ich nach Hause gegangen.",
    "Sonra eve gittim.",
  ],
  [
    "danach",
    "ondan sonra",
    "adverb",
    "Danach habe ich ein Buch gelesen.",
    "Ondan sonra bir kitap okudum.",
  ],
  [
    "schließlich",
    "sonunda; en sonunda",
    "adverb",
    "Schließlich sind wir angekommen.",
    "Sonunda vardık.",
  ],
  [
    "plötzlich",
    "aniden",
    "adverb",
    "Plötzlich hat es geregnet.",
    "Aniden yağmur yağdı.",
  ],
  [
    "nach Hause",
    "eve",
    "expression",
    "Ich bin nach Hause gefahren.",
    "Eve gittim / döndüm.",
  ],
  [
    "zu Hause",
    "evde",
    "expression",
    "Ich bin zu Hause geblieben.",
    "Evde kaldım.",
  ],
  [
    "machen",
    "yapmak",
    "verb",
    "Ich habe das Frühstück gemacht.",
    "Kahvaltıyı hazırladım.",
  ],
  [
    "gehen",
    "gitmek; yürüyerek gitmek",
    "verb",
    "Wir sind in den Park gegangen.",
    "Parka gittik.",
  ],
  ["bleiben", "kalmak", "verb", "Ich bin zu Hause geblieben.", "Evde kaldım."],
  [
    "sehen",
    "görmek; izlemek",
    "verb",
    "Ich habe einen Film gesehen.",
    "Bir film izledim.",
  ],
  [
    "hören",
    "duymak; dinlemek",
    "verb",
    "Wir haben Musik gehört.",
    "Müzik dinledik.",
  ],
  [
    "treffen",
    "buluşmak; karşılaşmak",
    "verb",
    "Ich habe meine Freundin getroffen.",
    "Arkadaşımla buluştum.",
  ],
  [
    "besuchen",
    "ziyaret etmek",
    "verb",
    "Wir haben unsere Nachbarn besucht.",
    "Komşularımızı ziyaret ettik.",
  ],
  [
    "ankommen",
    "varmak",
    "verb",
    "Wir sind um neun angekommen.",
    "Saat dokuzda vardık.",
  ],
  [
    "einkaufen",
    "alışveriş yapmak",
    "verb",
    "Ich habe am Samstag eingekauft.",
    "Cumartesi alışveriş yaptım.",
  ],
  [
    "aufräumen",
    "toplamak; düzenlemek",
    "verb",
    "Ich habe mein Zimmer aufgeräumt.",
    "Odamı topladım.",
  ],
  [
    "anrufen",
    "telefonla aramak",
    "verb",
    "Ich habe meine Schwester angerufen.",
    "Kız kardeşimi aradım.",
  ],
  [
    "mitbringen",
    "yanında getirmek",
    "verb",
    "Ich habe einen Kuchen mitgebracht.",
    "Yanımda bir kek getirdim.",
  ],
  [
    "erzählen",
    "anlatmak",
    "verb",
    "Nora hat von ihrem Wochenende erzählt.",
    "Nora hafta sonunu anlattı.",
  ],
  [
    "telefonieren",
    "telefonda konuşmak",
    "verb",
    "Ich habe mit Nora telefoniert.",
    "Nora ile telefonda konuştum.",
  ],
  [
    "passieren",
    "olmak; meydana gelmek",
    "verb",
    "Was ist gestern passiert?",
    "Dün ne oldu?",
  ],
  [
    "vergessen",
    "unutmak",
    "verb",
    "Ich habe meinen Schlüssel vergessen.",
    "Anahtarımı unuttum.",
  ],
  [
    "verstehen",
    "anlamak",
    "verb",
    "Ich habe die Nachricht verstanden.",
    "Mesajı anladım.",
  ],
  [
    "finden",
    "bulmak",
    "verb",
    "Ich habe meinen Schlüssel gefunden.",
    "Anahtarımı buldum.",
  ],
  [
    "Erlebnis",
    "deneyim; yaşantı",
    "noun",
    "Das war ein schönes Erlebnis.",
    "Bu güzel bir deneyimdi.",
    "das",
    "Erlebnisse",
  ],
  [
    "Ausflug",
    "gezi; günübirlik gezi",
    "noun",
    "Wir haben einen Ausflug gemacht.",
    "Bir gezi yaptık.",
    "der",
    "Ausflüge",
  ],
  [
    "Wochenende",
    "hafta sonu",
    "noun",
    "Am Wochenende habe ich gelesen.",
    "Hafta sonunda kitap okudum.",
    "das",
    "Wochenenden",
  ],
  [
    "Frühstück",
    "kahvaltı",
    "noun",
    "Ich habe das Frühstück gemacht.",
    "Kahvaltıyı hazırladım.",
    "das",
    "Frühstücke",
  ],
  [
    "Spaziergang",
    "yürüyüş; gezinti",
    "noun",
    "Wir haben einen Spaziergang gemacht.",
    "Yürüyüş yaptık.",
    "der",
    "Spaziergänge",
  ],
  [
    "Pause",
    "mola",
    "noun",
    "Ich habe eine Pause gemacht.",
    "Mola verdim.",
    "die",
    "Pausen",
  ],
  [
    "Besuch",
    "ziyaret",
    "noun",
    "Der Besuch war schön.",
    "Ziyaret güzeldi.",
    "der",
    "Besuche",
  ],
  [
    "Nachricht",
    "mesaj; haber",
    "noun",
    "Ich habe eine Nachricht geschrieben.",
    "Bir mesaj yazdım.",
    "die",
    "Nachrichten",
  ],
];
const records = vocabulary.map(
  (
    [
      german_word,
      turkish_meaning,
      word_type,
      example_sentence_de,
      example_sentence_tr,
      article = null,
      plural_form = null,
    ],
    i,
  ) => ({
    id: `dg-a2-01-${String(i + 1).padStart(2, "0")}`,
    german_word,
    turkish_meaning,
    word_type,
    article,
    plural_form,
    plural_note: null,
    cefr_level: "A2",
    levels: ["A2"],
    category: "routines",
    topics: ["routines"],
    unit_ids: ["a2-01"],
    sense_key: `daily-experience-${String(i + 1).padStart(2, "0")}`,
    example_sentence_de,
    example_sentence_tr,
    pronunciation_hint: null,
    audio_url: null,
    difficulty: 2,
    source_name: "Deutsch Garden · özgün içerik",
    source_url: null,
    license: "LicenseRef-DeutschGarden-Original",
    created_at: "2026-10-28T00:00:00.000Z",
    updated_at: "2026-10-28T00:00:00.000Z",
  }),
);
const wid = (word) => records.find((w) => w.german_word === word)?.id;
const A1 = JSON.parse(
  fs.readFileSync("src/data/vocabulary.json", "utf8"),
).filter((w) => w.cefr_level === "A1");
const wordId = (word) =>
  wid(word) || A1.find((w) => w.german_word === word)?.id;
let section = "guided";
function question(
  type,
  prompt,
  accepted,
  explanation,
  rule,
  options = [],
  words = [],
  extra = {},
) {
  const list = c[section],
    id = `a2-01-${section}-${String(list.length + 1).padStart(2, "0")}`;
  const rotated = options.length
    ? [
        ...options.slice(list.length % options.length),
        ...options.slice(0, list.length % options.length),
      ]
    : [];
  const ids = words.map(wordId).filter(Boolean);
  list.push({
    id,
    type,
    prompt,
    accepted: Array.isArray(accepted) ? accepted : [accepted],
    explanation,
    rule,
    options: rotated,
    wordIds: ids.length ? ids : [c.id],
    reviewWordIds: ids,
    hints: [
      rule,
      "Önce özneyi ve asıl fiili bul; ardından çekimi ve cümle sonunu kontrol et.",
    ],
    kindLabel: {
      choice: "Bağlamdan seç",
      blank: "Eksik biçimi tamamla",
      sentence: "Sözcüklerle cümle kur",
      "tr-de": "Kontrollü çeviri",
      "de-tr": "Anlamı ayırt et",
    }[type],
    ...(options.length
      ? {
          optionNotes: Object.fromEntries(
            options.map((o) => [
              o,
              (Array.isArray(accepted) ? accepted : [accepted]).includes(o)
                ? explanation
                : `Bu seçenek istenen yapıyı veya bağlamı karşılamıyor. ${rule}`,
            ]),
          ),
        }
      : {}),
    ...extra,
  });
}
const choose = (prompt, answer, wrong, why, rule, words = [], extra = {}) =>
  question(
    "choice",
    prompt,
    answer,
    why,
    rule,
    [answer, ...wrong],
    words,
    extra,
  );
const blank = (prompt, answer, why, rule, words = []) =>
  question("blank", prompt, answer, why, rule, [], words);
const sentence = (de, tr, why, rule, words = []) =>
  question(
    "sentence",
    `${tr} İlk sözcük: ${de.split(" ")[0]}. Verilen bütün sözcükleri kullan.`,
    de,
    why,
    rule,
    [],
    words,
    { tiles: de.replace(/[.!?]/g, "").split(" ").reverse() },
  );
choose(
  "“Dün Almanca çalıştım.” anlamını hangi cümle verir?",
  "Ich habe gestern Deutsch gelernt.",
  ["Ich lerne morgen Deutsch.", "Ich bin gestern Deutsch gelernt."],
  "Habe + gelernt tamamlanan öğrenme eylemini anlatır. Morgen “yarın” demektir; lernen burada sein almaz.",
  "Lernen, Perfekt’te haben ile kullanılır.",
  ["lernen"],
);
blank(
  "Yalnızca yardımcıyı yaz: Ich ___ einen Spaziergang gemacht.",
  "habe",
  "Özne ich olduğu için haben fiili habe olur. Gemacht asıl eylemi taşır; Spaziergang ile “yürüyüş yapmak” kalıbı kurulur.",
  "Ich ile haben → habe.",
  ["machen", "Spaziergang"],
);
blank(
  "Yalnızca yardımcıyı yaz: Nora ___ einen Film gesehen.",
  "hat",
  "Nora tekil özne olduğu için hat gerekir. Sehen fiilinin geçmiş biçimi gesehen; bu kullanımın yardımcısı haben’dir.",
  "Tekil üçüncü kişi → hat.",
  ["sehen"],
);
blank(
  "Yalnızca yardımcıyı yaz: Ihr ___ Musik gehört.",
  "habt",
  "Ihr için haben çekimi habt olur. Haben, wir ve sie çoğuluyla kullanılır; ihr ile aynı biçimi kopyalayamazsın.",
  "Ihr + habt; hören → gehört.",
  ["hören"],
);
blank(
  "machen fiilinin Partizip II biçimini yaz: Ich habe eine Pause ___.",
  "gemacht",
  "Mach- köküne ge- ve -t eklenir: gemacht. Pause yapmak için eine Pause machen kalıbı kullanılır.",
  "Düzenli temel örüntü ge- + kök + -t.",
  ["machen", "Pause"],
);
blank(
  "arbeiten fiilini tamamla: Wir haben lange ___.",
  "gearbeitet",
  "Arbeit- kökü -t ile bittiği için gearbeitet biçiminde e bulunur. Gearbeitt biçimi bu fiilin doğru geçmiş biçimi değildir.",
  "Arbeiten → gearbeitet.",
  ["arbeiten"],
);
blank(
  "sehen fiilini tamamla: Ich habe einen Film ___.",
  "gesehen",
  "Sehen güçlü bir fiildir; geçmiş biçimini düzenli bir -t ekiyle kurmayız. Doğru biçim gesehen olarak öğrenilir.",
  "Sehen – hat gesehen.",
  ["sehen"],
);
blank(
  "trinken fiilini tamamla: Du hast Wasser ___.",
  "getrunken",
  "Trinken fiilinde kök değişir: getrunken. Getrinkt biçimi düzenli fiil kuralını yanlış yere uygulamaktır.",
  "Trinken – hat getrunken.",
  ["trinken"],
);
choose(
  "Boşluğu tamamla: Ich ___ nach Hause gegangen.",
  "bin",
  ["habe", "hat"],
  "Gehen burada bir yere gitmeyi anlatır; sein alır. Ich için sein çekimi bin olur. Habe farklı yardımcı, hat ise ayrıca yanlış kişidir.",
  "Ich bin ... gegangen.",
  ["gehen", "nach Hause"],
);
blank(
  "Yalnızca yardımcıyı yaz: Ich ___ zu Hause geblieben.",
  "bin",
  "Bleiben yer değiştirme olmasa da sein alan önemli bir fiildir. Ich öznesiyle bin kullanılır; ist üçüncü kişidir.",
  "Bleiben – ist geblieben; ich bin geblieben.",
  ["bleiben", "zu Hause"],
);
blank(
  "Yalnızca yardımcıyı yaz: Wir ___ um neun angekommen.",
  "sind",
  "Ankommen varış anlatır ve sein alır. Wir çoğul özne olduğundan sind kullanılır; Partizip II angekommen değişmez.",
  "Wir + sind; ankommen → angekommen.",
  ["ankommen"],
);
blank(
  "Yalnızca yardımcıyı yaz: Ihr ___ mit dem Zug gefahren.",
  "seid",
  "Yolculuk anlamındaki fahren bu örnekte sein alır. Ihr için sein çekimi seid’dir; sind, wir ve sie içindir.",
  "Ihr seid ... gefahren.",
  ["fahren"],
);
blank(
  "einkaufen fiilini tamamla: Ich habe gestern ___.",
  "eingekauft",
  "Ein- ayrılabilen ön ektir. Ge-, ön ekten sonra gelir: ein-ge-kauft. Partizip II’yi ayrı sözcüklere bölmeyiz.",
  "Einkaufen → eingekauft.",
  ["einkaufen"],
);
blank(
  "besuchen fiilini tamamla: Wir haben Nora ___.",
  "besucht",
  "Be- ayrılamayan ön ektir. Besuchen fiilinde Partizip II besucht olur; gebesucht biçimi kullanılmaz.",
  "Be- ön ekli bu fiilde ge- yok.",
  ["besuchen"],
);
blank(
  "telefonieren fiilini tamamla: Ich habe mit Nora ___.",
  "telefoniert",
  "-ieren ile biten telefonieren, Partizip II’de ge- almaz. Bu yüzden telefoniert doğrudur; getelefoniert değildir.",
  "Telefonieren – hat telefoniert.",
  ["telefonieren"],
);
choose(
  "“Dün çalışmadım.” için nötr ve doğru cümleyi seç.",
  "Ich habe gestern nicht gearbeitet.",
  ["Ich nicht habe gestern gearbeitet.", "Ich habe gestern gearbeitet nicht."],
  "Olumsuzlukta habe ikinci konumda, gearbeitet sonda kalır. Bu nötr cümlede nicht, Partizip II’den önce kullanılır.",
  "Nicht’i burada son fiilden önce yerleştir.",
  ["arbeiten"],
);
choose(
  "“Dün ne yaptın?” sorusunu seç.",
  "Was hast du gestern gemacht?",
  ["Was du hast gestern gemacht?", "Was gestern du gemacht?"],
  "Was birinci öge, hast ikinci ögedir. Özne ardından gelir; gemacht sonda durur. Yardımcıyı düşüremeyiz.",
  "Soru ögesi + yardımcı + özne + ... + Partizip II.",
  ["machen", "gestern"],
);
sentence(
  "Gestern habe ich eine Pause gemacht.",
  "Dün mola verdim.",
  "Gestern başa gelince habe ikinci konumdadır. Eine Pause yapmak için kullanılan isim kalıbıdır; gemacht sonda kalır.",
  "Zaman başta olsa da yardımcı ikinci konumda.",
  ["Pause", "machen"],
);
sentence(
  "Dann bin ich nach Hause gegangen.",
  "Sonra eve gittim.",
  "Dann ilk ögedir. Gehen, yönelme anlatan bu kullanımda sein alır; ich için bin seçilir ve gegangen sona gelir.",
  "Dann + bin + ich + ... + gegangen.",
  ["dann", "gehen", "nach Hause"],
);
choose(
  "Metne göre Leyla ve kız kardeşi Köln’e hangi araçla gitti?",
  "Trenle.",
  ["Otobüsle.", "Araç belirtilmiyor."],
  "Metindeki “mit dem Zug nach Köln gefahren” ifadesi trenle yolculuk yapıldığını açıkça söyler. Cevabı metindeki kanıttan çıkarıyoruz.",
  "Mit dem Zug = trenle.",
  ["fahren"],
  { contextId: "a2-01-reading" },
);
section = "independent";
// 1–12: anlam, yardımcı seçimi ve biçim farkları.
const choices = [
  [
    "“Vorgestern habe ich Nora besucht.” ne zaman gerçekleşti?",
    "Dünden önceki gün.",
    ["Yarın.", "Geçen ay."],
    "Vorgestern, bugünden iki gün önceyi gösterir. Morgen yarın, letzten Monat geçen ay demektir; metindeki zaman ifadesini değiştiremeyiz.",
    "Vorgestern = dünden önceki gün.",
    ["vorgestern", "besuchen"],
  ],
  [
    "“Evde kaldım.” için doğru cümleyi seç.",
    "Ich bin zu Hause geblieben.",
    ["Ich habe zu Hause geblieben.", "Ich bin nach Hause gegangen."],
    "Bleiben sein alır; zu Hause bulunulan yerdir. Son seçenek eve gitmeyi anlatır, evde kalmayı değil.",
    "Bleiben – ist geblieben; zu Hause = evde.",
    ["bleiben", "zu Hause"],
  ],
  [
    "“Dün bir film izledik.” için doğru yardımcı ve biçimi seç.",
    "Wir haben gestern einen Film gesehen.",
    [
      "Wir sind gestern einen Film gesehen.",
      "Wir haben gestern einen Film geseht.",
    ],
    "Sehen bu kullanımda haben alır ve düzensiz Partizip II gesehen olur. Geseht, düzenli eki yanlış biçimde taşır.",
    "Wir haben ... gesehen.",
    ["sehen"],
  ],
  [
    "“Ihr ___ gestern angekommen.” boşluğuna ne gelir?",
    "seid",
    ["sind", "habt"],
    "Ankommen sein ile kurulur. Ihr için doğru çekim seid’dir; sind başka kişi biçimi, habt ise haben ailesidir.",
    "Ihr seid ... angekommen.",
    ["ankommen"],
  ],
  [
    "Telefonieren fiilinin doğru geçmiş biçimi hangisidir?",
    "telefoniert",
    ["getelefoniert", "telefonieren"],
    "-ieren fiilinde ge- kullanılmaz ve geçmiş biçimi telefoniert olur. Telefonieren mastardır; bu cümle konumunda Partizip II gerekir.",
    "-ieren → -iert, ge- yok.",
    ["telefonieren"],
  ],
  [
    "Besuchen fiilinin doğru Partizip II biçimi hangisidir?",
    "besucht",
    ["gebesucht", "besuchen"],
    "Be- ayrılamayan ön ektir; Partizip II besucht olur. Gebesucht fazladan ge- içerir, besuchen ise mastardır.",
    "Besuchen – hat besucht.",
    ["besuchen"],
  ],
  [
    "“Annemle telefonda konuştum.” anlamındaki doğru cümleyi seç.",
    "Ich habe mit meiner Mutter telefoniert.",
    [
      "Ich bin mit meiner Mutter telefoniert.",
      "Ich habe mit meiner Mutter getelefoniert.",
    ],
    "Telefonieren haben alır ve -ieren kuralıyla telefoniert olur. Mit meiner Mutter konuştuğun kişiyi gösterir.",
    "Ich habe mit ... telefoniert.",
    ["telefonieren"],
  ],
  [
    "“Dün kahve içmedim.” için doğru nötr cümleyi seç.",
    "Ich habe gestern keinen Kaffee getrunken.",
    [
      "Ich habe gestern kein Kaffee getrunken.",
      "Ich bin gestern keinen Kaffee getrunken.",
    ],
    "Kaffee eril nesne olduğu için keinen gerekir. Trinken bu kullanımda haben alır; getrunken düzensiz Partizip II’dir.",
    "Kein → keinen, eril Akkusativ nesnede.",
    ["trinken"],
  ],
  [
    "“Sonra kitap okudum.” cümlesinde hangi sıra doğrudur?",
    "Danach habe ich ein Buch gelesen.",
    ["Danach ich habe ein Buch gelesen.", "Danach habe ich gelesen ein Buch."],
    "Danach ilk ögedir, habe ikinci konuma gelir; gelesen standart ana cümlenin sonundadır. Zaman ögesi öznenin önüne geçebilir.",
    "Danach + yardımcı + özne + ... + Partizip II.",
    ["danach", "lesen"],
  ],
  [
    "“Ne oldu?” sorusunun doğru biçimini seç.",
    "Was ist passiert?",
    ["Was hat passiert?", "Was ist gepassiert?"],
    "Passieren “meydana gelmek” anlamında sein alır. -ieren ile bittiğinden Partizip II’de ge- bulunmaz.",
    "Passieren – ist passiert.",
    ["passieren"],
  ],
  [
    "“Bir mesaj yazdınız.” (ihr) cümlesini seç.",
    "Ihr habt eine Nachricht geschrieben.",
    [
      "Ihr haben eine Nachricht geschrieben.",
      "Ihr seid eine Nachricht geschrieben.",
    ],
    "Ihr için haben çekimi habt’tır. Schreiben bu kullanımda haben ile kurulur; geschrieben Partizip II’dir.",
    "Ihr habt ... geschrieben.",
    ["Nachricht"],
  ],
  [
    "Hangi ifade “eve” yönelmeyi bildirir?",
    "nach Hause",
    ["zu Hause", "gestern"],
    "Nach Hause yönelmeyi, zu Hause bulunulan yeri, gestern ise zamanı gösterir. Eve gitmek ve evde kalmak aynı yapı değildir.",
    "Yön: nach Hause; konum: zu Hause.",
    ["nach Hause", "zu Hause"],
  ],
];
for (const row of choices) choose(...row);
// 13–24: yardımı kaldırarak biçimi hatırlama.
const blanks = [
  [
    "Yalnızca yardımcıyı yaz: Du ___ deine Freundin getroffen.",
    "hast",
    "Treffen burada haben alır. Özne du olduğu için hast gerekir; getroffen değişmeden sona yerleşir.",
    "Du hast ... getroffen.",
    ["treffen"],
  ],
  [
    "Yalnızca yardımcıyı yaz: Er ___ nach Köln gefahren.",
    "ist",
    "Fahren bu örnekte bir yere yolculuk anlatır ve sein alır. Tekil er için doğru biçim ist’tir.",
    "Er ist ... gefahren.",
    ["fahren"],
  ],
  [
    "Yalnızca yardımcıyı yaz: Wir ___ das Frühstück gemacht.",
    "haben",
    "Machen haben ile kurulur. Wir öznesi için haben kullanılır; Frühstück hazırlanmış nesnedir, yardımcıyı değiştirmez.",
    "Wir haben ... gemacht.",
    ["machen", "Frühstück"],
  ],
  [
    "Yalnızca yardımcıyı yaz: Ich ___ um acht aufgestanden.",
    "bin",
    "Aufstehen bu kullanımda sein alır. Ich için bin seçilir; ayrılabilen fiilin geçmiş biçimi aufgestanden olur.",
    "Ich bin ... aufgestanden.",
    ["aufstehen"],
  ],
  [
    "aufräumen fiilini tamamla: Ich habe mein Zimmer ___.",
    "aufgeräumt",
    "Auf- ön ekinden sonra ge- gelir; räum- kökü ve -t ile aufgeräumt oluşur. Bu fiil haben ile kullanılır.",
    "Aufräumen – hat aufgeräumt.",
    ["aufräumen"],
  ],
  [
    "anrufen fiilini tamamla: Nora hat ihre Mutter ___.",
    "angerufen",
    "Anrufen ayrılabilen ve düzensiz bir fiildir. An-ge-rufen birleşerek angerufen olur; annenin aranması anlatılır.",
    "Anrufen – hat angerufen.",
    ["anrufen"],
  ],
  [
    "mitbringen fiilini tamamla: Ich habe einen Kuchen ___.",
    "mitgebracht",
    "Bringen → gebracht karışık fiildir. Ayrılabilen mit- ön ekiyle mitgebracht olur; mitgebringt doğru biçim değildir.",
    "Mitbringen – hat mitgebracht.",
    ["mitbringen"],
  ],
  [
    "erzählen fiilini tamamla: Ada hat von ihrem Wochenende ___.",
    "erzählt",
    "Er- ayrılamayan ön ektir, bu yüzden ge- eklenmez. Erzähl- köküne -t gelerek erzählt oluşur.",
    "Erzählen – hat erzählt.",
    ["erzählen", "Wochenende"],
  ],
  [
    "vergessen fiilini tamamla: Ich habe meinen Schlüssel ___.",
    "vergessen",
    "Bu fiilin mastarı ve Partizip II biçimi aynı görünür: vergessen. Ver- ayrılamayan ön ektir, ge- eklemeyiz.",
    "Vergessen – hat vergessen.",
    ["vergessen"],
  ],
  [
    "verstehen fiilini tamamla: Wir haben die Nachricht ___.",
    "verstanden",
    "Verstehen düzensizdir ve ver- ön eki nedeniyle ge- almaz. Doğru Partizip II verstanden olarak öğrenilir.",
    "Verstehen – hat verstanden.",
    ["verstehen", "Nachricht"],
  ],
  [
    "finden fiilini tamamla: Ich habe meine Tasche ___.",
    "gefunden",
    "Finden güçlü fiildir; kök değişimiyle gefunden olur. Gefindet gibi düzenli tahminler bu fiilde kullanılmaz.",
    "Finden – hat gefunden.",
    ["finden"],
  ],
  [
    "bleiben fiilini tamamla: Wir sind zu Hause ___.",
    "geblieben",
    "Bleiben → geblieben düzensiz biçimdir. Sein alması nedeniyle yardımcı zaten sind olarak verilmiştir; mastarı tekrar yazma.",
    "Bleiben – ist geblieben.",
    ["bleiben"],
  ],
];
for (const row of blanks) blank(...row);
// 25–34: bütün sözcükleri kullanarak cümle çerçevesi.
const orders = [
  [
    "Gestern habe ich einen Ausflug gemacht.",
    "Dün bir gezi yaptım.",
    "Gestern ilk öge, habe ikinci ögedir. Ausflug eril nesne olduğu için einen kullanılır; gemacht sonda kalır.",
    "Zaman + yardımcı + özne + nesne + Partizip II.",
    ["Ausflug", "machen"],
  ],
  [
    "Wir sind am Sonntag zu Hause geblieben.",
    "Pazar günü evde kaldık.",
    "Wir öznesi sind ister. Bleiben sein alır, zu Hause konumu belirtir. Geçmiş biçimi geblieben ana cümlenin sonundadır.",
    "Wir sind ... geblieben.",
    ["bleiben", "zu Hause"],
  ],
  [
    "Danach hat Nora ihre Mutter angerufen.",
    "Ondan sonra Nora annesini aradı.",
    "Danach ilk ögedir; hat ikinci konuma gelir. Nora üçüncü kişi tekildir. Anrufen geçmişte tek sözcükle angerufen olur.",
    "Danach + hat + tekil özne + ... + angerufen.",
    ["danach", "anrufen"],
  ],
  [
    "Ich habe gestern keinen Kaffee getrunken.",
    "Dün kahve içmedim.",
    "Ich ile habe kullanılır. Kaffee eril nesnedir, bu yüzden keinen gerekir; getrunken sonda kalır.",
    "Ich habe ... keinen Kaffee getrunken.",
    ["trinken"],
  ],
  [
    "Hast du am Wochenende eingekauft?",
    "Hafta sonunda alışveriş yaptın mı?",
    "Evet/hayır sorusu yardımcıyla başlar. Du ikinci konumdadır; eingekauft sonda bulunur.",
    "Yardımcı + özne + ... + Partizip II?",
    ["einkaufen", "Wochenende"],
  ],
  [
    "Was habt ihr gestern gemacht?",
    "Dün ne yaptınız?",
    "Was ilk öge, habt ikinci ögedir. Ihr için habt gerekir; standart bilgi sorusunda gemacht sonda kalır.",
    "Was + habt + ihr + ... + gemacht?",
    ["machen"],
  ],
  [
    "Wohin bist du am Samstag gegangen?",
    "Cumartesi nereye gittin?",
    "Wohin yön sorar. Gehen için sein, du için bist seçilir. Am Samstag zaman bilgisi olarak iki fiilin arasında durur.",
    "Wohin + bist + du + ... + gegangen?",
    ["gehen"],
  ],
  [
    "Zuerst haben wir das Frühstück gemacht.",
    "Önce kahvaltıyı hazırladık.",
    "Zuerst başa geldiği için haben ikinci konumdadır. Wir yardımcıdan sonra gelir; gemacht cümleyi kapatır.",
    "Zuerst + haben + wir + ... + gemacht.",
    ["zuerst", "Frühstück"],
  ],
  [
    "Am Abend habe ich eine Nachricht geschrieben.",
    "Akşam bir mesaj yazdım.",
    "Am Abend tek zaman ögesidir. Habe ikinci ögedir; Nachricht dişil nesne olduğu için eine kullanılır.",
    "Zaman ögesi + habe + ich + ... + geschrieben.",
    ["Nachricht"],
  ],
  [
    "Ihr seid mit dem Zug nach Köln gefahren.",
    "Trenle Köln’e gittiniz.",
    "Ihr için sein çekimi seid’dir. Yolculuğu anlatan gefahren sonda; mit dem Zug araç, nach Köln yön bilgisidir.",
    "Ihr seid ... gefahren.",
    ["fahren"],
  ],
];
for (const row of orders) sentence(...row);
// 35–42: tek bir hatayı bulup tüm cümleyi düzeltme.
const repairs = [
  [
    "Ich habe nach Hause gegangen.",
    "Ich bin nach Hause gegangen.",
    "Gehen burada sein alır. Yalnızca habe → bin düzeltmesi gerekir; yer ve Partizip II zaten doğrudur.",
    "Gehen – ist gegangen.",
    ["gehen"],
  ],
  [
    "Ihr haben gestern gelernt.",
    "Ihr habt gestern gelernt.",
    "Ihr öznesi için yardımcı habt olur. Haben çekimini wir veya sie ile karıştırma; gelernt biçimi değişmez.",
    "Ihr + habt.",
    ["lernen"],
  ],
  [
    "Ich habe Nora gebesucht.",
    "Ich habe Nora besucht.",
    "Besuchen fiilindeki be- ayrılamaz; Partizip II ge- almaz. Yardımcı ve nesne doğru, yalnızca gebesucht düzeltilir.",
    "Besuchen → besucht.",
    ["besuchen"],
  ],
  [
    "Wir sind zu Hause gebleibt.",
    "Wir sind zu Hause geblieben.",
    "Yardımcı sind doğrudur; yanlış olan Partizip II’dir. Bleiben fiilinin düzensiz geçmiş biçimi geblieben olur.",
    "Bleiben → geblieben.",
    ["bleiben"],
  ],
  [
    "Ich habe lange getelefoniert.",
    "Ich habe lange telefoniert.",
    "Telefonieren -ieren ile biter ve ge- almaz. Diğer ögeler korunur; getelefoniert yerine telefoniert yazılır.",
    "-ieren → -iert; ge- yok.",
    ["telefonieren"],
  ],
  [
    "Du hast Wasser getrinkt.",
    "Du hast Wasser getrunken.",
    "Trinken düzensizdir, kök değişir ve getrunken olur. Hast yardımcı çekimi zaten doğru olduğu için onu değiştirmiyoruz.",
    "Trinken → getrunken.",
    ["trinken"],
  ],
  [
    "Gestern ich habe eingekauft.",
    "Gestern habe ich eingekauft.",
    "Gestern ilk ögedir; habe ikinci konuma gelmelidir. Özne ich, yardımcıdan sonra yer alır ve eingekauft sonda kalır.",
    "Zaman başta → yardımcı ikinci konumda.",
    ["einkaufen"],
  ],
  [
    "Was du hast gemacht?",
    "Was hast du gemacht?",
    "Soru sözcüğü was ilk ögedir. Yardımcı hast hemen ardından gelmeli; özne du sonra, gemacht en sonda olmalıdır.",
    "Soru ögesi + yardımcı + özne + Partizip II.",
    ["machen"],
  ],
];
for (const [wrong, correct, why, rule, words] of repairs)
  question(
    "blank",
    `Yalnızca hatalı biçimi veya sırayı düzelt; diğer sözcükleri koru. Cümlenin tamamını yaz: ${wrong}`,
    correct,
    why,
    rule,
    [],
    words,
    { kindLabel: "Hata dedektifi" },
  );
// 43–50: metne bağlı, tek kanıtlı okuma soruları.
const reading = [
  [
    "Leyla cumartesi kaçta kalktı?",
    "Saat sekizde.",
    ["Saat dokuzda.", "Metin söylemiyor."],
    "İlk cümlede “um acht aufgestanden” yazıyor. Metindeki açık saat sekizdir; başka bir cümlenin saatini buraya taşımıyoruz.",
    "Um acht = saat sekizde.",
  ],
  [
    "Leyla ilk olarak kiminle kahvaltı yaptı?",
    "Kız kardeşiyle.",
    ["Nora ile.", "Erkek kardeşiyle."],
    "“Mit meiner Schwester gefrühstückt” ifadesi kahvaltıdaki kişiyi belirtir. Nora ile daha sonra Köln’de buluşuluyor.",
    "Mit meiner Schwester = kız kardeşimle.",
  ],
  [
    "Nora ile nerede buluşuldu?",
    "Köln’de.",
    ["Leyla’nın evinde.", "Trende olduğu kesin."],
    "Önce Köln’e gittikleri söyleniyor, sonraki cümlede “Dort” bu yere dönüyor. Trende buluştukları yazmıyor.",
    "Dort, önceki cümlede söylenen yere gönderme yapar.",
  ],
  [
    "Kafeye neden gittiler?",
    "Öğleden sonra yağmur yağdığı için.",
    ["Film izlemek için.", "Bilet almak için."],
    "“Am Nachmittag hat es geregnet. Deshalb ...” iki cümleyi sebep-sonuç ilişkisiyle bağlar. Deshalb bu nedenle demektir.",
    "Geregnet = yağmur yağdı; deshalb = bu nedenle.",
  ],
  [
    "Leyla kafede ne içti?",
    "Çay.",
    ["Kahve.", "Su olduğu kesin."],
    "“Ich habe Tee getrunken” ifadesi çay içildiğini açıkça söyler. Metnin başka bir içecek söylemediği yerde varsayım yapma.",
    "Tee = çay.",
  ],
  [
    "Leyla mesajı kime yazdı?",
    "Erkek kardeşine.",
    ["Nora’nın annesine.", "Komşularına."],
    "“Eine Nachricht an meinen Bruder” mesajın yöneldiği kişiyi gösterir. Nora ise annesini telefonla arar; iki olayı karıştırma.",
    "An meinen Bruder = erkek kardeşime.",
  ],
  [
    "Nora telefonla kimi aradı?",
    "Annesini.",
    ["Leyla’yı.", "Mert’i."],
    "“Nora hat ihre Mutter angerufen” cümlesinde özne Nora, aranan kişi annesidir. Leyla’nın mesajı başka bir olaydır.",
    "Ihre Mutter = onun annesi.",
  ],
  [
    "Leyla akşam eve döndükten sonra ders çalıştı mı?",
    "Hayır; artık ders çalışmadığını söylüyor.",
    ["Evet, iki saat.", "Metin bu konuda hiç bilgi vermiyor."],
    "“Ich habe nicht mehr gelernt” artık ders çalışmadığını belirtir. Nicht mehr olumsuzluğunu görmezden gelirsen anlam tersine döner.",
    "Nicht mehr = artık ... değil / artık ... yapmamak.",
  ],
];
for (const row of reading)
  choose(...row, [], {
    contextId: "a2-01-reading",
    kindLabel: "Metinden kanıt bul",
  });
// 51–56: konuşmayı takip etme ve bilgi çıkarma.
const dialogue = [
  [
    "Ada cumartesi kimi ziyaret etti?",
    "Komşularını.",
    ["Kız kardeşini.", "Mert’in erkek kardeşini."],
    "Ada “meine Nachbarn besucht” diyor. Kız kardeşiyle görüşmesi telefonla ve pazar günü; ziyaret edilen kişiler komşularıdır.",
    "Nachbarn = komşular.",
  ],
  [
    "Ada ve komşuları filmi ne zaman izledi?",
    "Yemek pişirdikten sonra.",
    ["Parka gittikten sonra.", "Telefon görüşmesinden önce olduğu söyleniyor."],
    "“Wir haben gekocht und danach einen Film gesehen.” içindeki danach, filmden önce yemek pişirildiğini gösterir. Diğer ayrıntılar belirtilmiyor.",
    "Danach, önce söylenen olayın ardından demektir.",
  ],
  [
    "Ada pazar günü dışarı çıktı mı?",
    "Hayır, evde kaldı.",
    ["Evet, parka gitti.", "Evet, Köln’e gitti."],
    "Ada “Nein, ich bin zu Hause geblieben” cevabını verir. Parka giden kişi diyaloğun sonunda Mert’tir.",
    "Konuşmacının kim olduğunu izle.",
  ],
  [
    "Ada kız kardeşiyle nasıl görüştü?",
    "Telefonda konuştu.",
    ["Evine gidip ziyaret etti.", "Bir mektup yolladı."],
    "“Mit meiner Schwester telefoniert” telefonda konuşmayı anlatır. Anrufen ve telefonieren benzer konuya ait ama farklı kalıplardır.",
    "Telefonieren = telefonda konuşmak.",
  ],
  [
    "Ada Almanca için ne kadar okudu?",
    "Yirmi dakika.",
    ["İki saat.", "Hiç okumadı."],
    "Ada “zwanzig Minuten gelesen” diyor. Bu süreyi günün tamamıyla veya başka bir kişinin yaptığı işle karıştırma.",
    "Zwanzig Minuten = yirmi dakika.",
  ],
  [
    "Mert parka kiminle gitti?",
    "Erkek kardeşiyle.",
    ["Nora ile.", "Komşularıyla."],
    "Son konuşmada Mert “mit meinem Bruder in den Park gegangen” der. Ada’nın ziyaretinden farklı bir deneyim anlatılır.",
    "Mit meinem Bruder = erkek kardeşimle.",
  ],
];
for (const row of dialogue)
  choose(...row, [], {
    contextId: "a2-01-dialogue",
    kindLabel: "Diyaloğu takip et",
  });
// 57–60: sınırları belirtilmiş üretim ve anlam.
question(
  "tr-de",
  "“Dün alışveriş yaptım.” cümlesini Ich habe ... kalıbıyla yaz. gestern ve einkaufen kullan.",
  "Ich habe gestern eingekauft.",
  "Ich ile habe, einkaufen için eingekauft gerekir. Verilen kalıpta gestern yardımcıyla Partizip II arasına yerleşir.",
  "Ich habe + gestern + eingekauft.",
  [],
  ["einkaufen"],
);
question(
  "tr-de",
  "“Biz evde kaldık.” cümlesini Wir sind ... kalıbıyla yaz. zu Hause ve bleiben kullan.",
  "Wir sind zu Hause geblieben.",
  "Bleiben bu anlamda sein alır ve geçmiş biçimi geblieben olur. Wir için sind, bulunulan yer için zu Hause gerekir.",
  "Wir sind + zu Hause + geblieben.",
  [],
  ["bleiben", "zu Hause"],
);
question(
  "tr-de",
  "“Hafta sonunda ne yaptın?” sorusunu Was hast du ... kalıbıyla yaz. am Wochenende ve machen kullan.",
  "Was hast du am Wochenende gemacht?",
  "Was ilk, hast ikinci ögedir. Am Wochenende zaman ögesi, gemacht ise en sonda bulunan Partizip II’dir.",
  "Was hast du + am Wochenende + gemacht?",
  [],
  ["machen", "Wochenende"],
);
question(
  "de-tr",
  "“Ich habe meinen Schlüssel vergessen.” cümlesinin anlamını seç.",
  "Anahtarımı unuttum.",
  "Vergessen unutmak demektir ve bu fiilin mastarı ile Partizip II biçimi aynı görünür. Gefunden olsaydı bulmak anlamı verirdi.",
  "Vergessen – hat vergessen; finden – hat gefunden.",
  ["Anahtarımı buldum.", "Anahtarımı unuttum.", "Anahtarımı satın aldım."],
  ["vergessen", "finden"],
);
c.summary = {
  takeaways: [
    "Perfekt, yardımcı fiil ve Partizip II’nin birlikte kurduğu yapıdır.",
    "Haben/sein özneye göre çekilir; Partizip II aynı kalır.",
    "Düzenli temel biçim ge- + kök + -t; düzensizleri kalıp halinde öğren.",
    "Gehen ve burada yolculuk anlamındaki fahren sein alır; bleiben de sein alan bir istisnadır.",
    "Ayrılabilen ön eklerde ge- araya gelir; besuchen ve telefonieren ge- almaz.",
    "Ana cümlede yardımcı ikinci, Partizip II son konumdadır.",
    "Evet/hayır sorusu yardımcıyla başlar; bilgi sorusunda soru ögesinden sonra yardımcı gelir.",
    "Nicht eylemi, kein ailesi uygun isim grubunu olumsuzlar; isim hâlini koru.",
    "Zuerst, dann ve danach ile olayları sıraya koy; yardımcıyı ikinci konumda tut.",
    "Metinde söylenmeyen bilgi için tahminini kesin cevap yapma.",
  ],
  vocabulary: records.map((w) => ({
    de: (w.article ? w.article + " " : "") + w.german_word,
    tr: w.turkish_meaning,
  })),
  mistakes: [
    "Yardımcıyı düşürme: Ich habe gelernt.",
    "Hareket var diye her fiile sein seçme; fiilin kullanımını kontrol et.",
    "Ge- her fiilde yok: besucht, telefoniert.",
    "Ihr habt ve ihr seid biçimlerini wir ile karıştırma.",
    "Partizip II’ye kişi eki ekleme.",
    "Gestern ich habe yerine Gestern habe ich yaz.",
    "Nach Hause yön, zu Hause konum bildirir.",
    "Serbest bir çevirinin farklı doğru karşılıkları olabilir; kontrollü soruda verilen kalıbı izle.",
  ],
  examples: [
    "Gestern habe ich einen Spaziergang gemacht.",
    "Danach bin ich nach Hause gegangen.",
    "Hast du am Wochenende deine Freundin getroffen?",
  ],
  writingChecklist: [
    "Hayalî bir gün seçebilir ve özel bilgi vermeyebilirsin.",
    "6–8 cümlede en az iki haben ve iki sein yapısı kullan.",
    "En az bir olumsuz cümle ve bir soru kur.",
    "Zuerst, dann, danach ile zaman sırasını belirt.",
    "Her yardımcıyı özneyle, her Partizip II’yi örneklerle kontrol et.",
    "Serbest yazı bu derste otomatik değerlendirilmez veya puanlanmaz.",
  ],
};
if (
  c.guided.length !== 20 ||
  c.independent.length !== 60 ||
  records.length !== 36
)
  throw Error("İçerik sayıları beklenen kapsamla uyuşmuyor.");
fs.writeFileSync(
  "src/data/courses/a2-01.json",
  JSON.stringify(c, null, 2) + "\n",
);
fs.writeFileSync(
  "src/data/courses/a2-01-vocabulary.json",
  JSON.stringify(records, null, 2) + "\n",
);
console.log(
  `A2 ilk ünite: ${c.steps.length} öğretim adımı, ${c.examples.length} örnek, ${c.guided.length + c.independent.length} soru, ${records.length} kelime.`,
);

const existing = JSON.parse(
  fs.readFileSync("src/data/vocabulary.json", "utf8"),
);
const existingIds = new Set(existing.map((w) => w.id));
const additions = records.filter((w) => !existingIds.has(w.id));
fs.writeFileSync(
  "src/data/vocabulary.json",
  JSON.stringify([...existing, ...additions], null, 2) + "\n",
);
