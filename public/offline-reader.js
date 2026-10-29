/* Public educational review only; never caches account or private API data. */
(() => {
  "use strict";
  const CACHE = "deutsch-garden-learning-v1";
  const $ = (id) => document.getElementById(id);
  let pack = null,
    busy = false;
  const message = (s) => {
    $("status").textContent = s;
  };
  const node = (tag, text) => {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = String(text);
    return n;
  };
  const publicAudio = (p) =>
    typeof p === "string" &&
    /^\/audio\/(courses|course-examples|course-extension|stories|stories-comedy|listening|listening-complete)\/[a-zA-Z0-9_.-]+\.(mp3|wav)$/.test(
      p,
    );
  async function boot() {
    if ("serviceWorker" in navigator) {
      await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
    }
  }
  boot().catch(() =>
    message(
      "Çevrimdışı açılış için HTTPS veya yerel geliştirme adresi gerekir.",
    ),
  );
  async function load(download) {
    if (busy) return;
    busy = true;
    try {
      if (!("caches" in window))
        throw Error("Bu tarayıcı çevrimdışı dosya saklamayı desteklemiyor.");
      const level = $("level").value,
        path = "/offline-packs/" + level + ".json",
        cache = await caches.open(CACHE);
      let response = download
        ? await fetch(path, { credentials: "omit", cache: "no-store" })
        : await cache.match(path);
      if (!response || !response.ok)
        throw Error("Bu düzey henüz indirilmedi veya bağlantı kurulamadı.");
      const data = await response.clone().json();
      if (
        data.version !== 1 ||
        data.level !== level ||
        !Array.isArray(data.courses) ||
        data.courses.length !== 10
      )
        throw Error("Paket doğrulanamadı; önceki paket değiştirilmedi.");
      if (download) {
        for (const url of ["/cevrimdisi.html", "/offline-reader.js"]) {
          const r = await fetch(url, {
            credentials: "omit",
            cache: "no-store",
          });
          if (!r.ok) throw Error("Okuma ekranı indirilemedi.");
          await cache.put(url, r);
        }
        await cache.put(path, response);
      }
      pack = data;
      $("lesson").replaceChildren();
      $("list").replaceChildren(
        ...data.courses.map((c) => {
          const b = node("button", c.title);
          b.onclick = () => render(c);
          return b;
        }),
      );
      message(
        level +
          " · " +
          data.courses.length +
          " ders " +
          (download ? "indirildi." : "cihazdan açıldı."),
      );
    } catch (e) {
      message(e.message || "Paket açılamadı.");
    } finally {
      busy = false;
    }
  }
  function section(title) {
    const e = node("section");
    e.append(node("h2", title));
    $("lesson").append(e);
    return e;
  }
  function audioFor(id) {
    return pack.audio?.examples?.[id] ?? pack.audio?.[id] ?? null;
  }
  async function downloadAudio(c) {
    if (busy) return;
    busy = true;
    try {
      const cache = await caches.open(CACHE);
      const urls = [
        ...new Set(
          c.examples.map((e) => audioFor(e.id)?.url).filter(publicAudio),
        ),
      ];
      if (!urls.length)
        throw Error("Bu dersin paketinde ses kaydı bulunamadı.");
      message("Sesler indiriliyor · 0 / " + urls.length);
      for (let i = 0; i < urls.length; i++) {
        const r = await fetch(urls[i], { credentials: "omit" });
        if (!r.ok || !r.headers.get("content-type")?.startsWith("audio/"))
          throw Error("Bir ses dosyası indirilemedi; önceki dosyalar korundu.");
        await cache.put(urls[i], r);
        message("Sesler indiriliyor · " + (i + 1) + " / " + urls.length);
      }
      message(urls.length + " ses dosyası indirildi.");
    } catch (e) {
      message(e.message);
    } finally {
      busy = false;
    }
  }
  function render(c) {
    $("lesson").replaceChildren();
    let s = section(c.title);
    s.append(node("p", c.goal));
    const b = node("button", "Bu dersin örnek seslerini indir");
    b.onclick = () => downloadAudio(c);
    s.append(b);
    if (c.studyPlan)
      for (const item of c.studyPlan.objectives ?? [])
        s.append(node("p", "🌱 " + item));
    for (const step of c.steps) {
      s = section(step.title);
      for (const [key, label] of [
        ["introduction", "Giriş"],
        ["rule", "Kural"],
        ["usage", "Nasıl kullanılır?"],
        ["structure", "Yapı"],
        ["mistake", "Sık yapılan hata"],
        ["memory", "Akılda tut"],
      ])
        if (step[key]) {
          s.append(node("h3", label), node("p", step[key]));
        }
      for (const d of step.details ?? [])
        s.append(node("h3", d.title), node("p", d.body));
      if (step.table) {
        const wrap = node("div");
        wrap.className = "table";
        const t = node("table");
        for (const row of step.table.rows) {
          const tr = node("tr");
          for (const cell of row) tr.append(node("td", cell));
          t.append(tr);
        }
        wrap.append(t);
        s.append(wrap);
      }
    }
    s = section("Açıklamalı örnekler");
    for (const e of c.examples) {
      const a = node("article"),
        de = node("blockquote", e.de);
      de.lang = "de";
      a.append(de, node("p", e.tr), node("p", e.explanation));
      const source = audioFor(e.id);
      if (source && publicAudio(source.url)) {
        const player = node("audio");
        player.controls = true;
        player.preload = "none";
        player.src = source.url;
        player.setAttribute("aria-label", "Almanca örneği dinle");
        a.append(player);
      }
      s.append(a);
    }
    for (const text of c.texts ?? []) {
      s = section(text.title);
      const de = node("blockquote", text.de);
      de.lang = "de";
      s.append(de, node("p", text.tr), node("p", text.notes));
    }
    s = section("Sorularla pekiştir");
    for (const q of [...c.guided, ...c.independent]) {
      const d = node("details");
      d.append(node("summary", q.prompt));
      if (q.type !== "matching") {
        const choice = q.options?.length && q.type !== "sentence";
        const select = node(choice ? "select" : "input");
        select.setAttribute("aria-label", q.prompt);
        if (choice) select.append(node("option", "Bir yanıt seç"));
        else {
          select.type = "text";
          select.placeholder = "Yanıtını yaz";
        }
        for (const o of choice ? q.options : []) {
          const opt = node("option", o);
          opt.value = o;
          select.append(opt);
        }
        const feedback = node("p");
        feedback.className = "feedback";
        const check = node("button", "Yanıtımı kontrol et");
        check.onclick = () => {
          const normalize = (x) =>
            x
              .normalize("NFKC")
              .trim()
              .toLocaleLowerCase("de")
              .replace(/[.!?]+$/, "");
          const correct = q.accepted.some(
            (a) => normalize(a) === normalize(select.value),
          );
          feedback.textContent =
            (correct
              ? "Doğru! "
              : "Tekrar incele. Doğru yanıt: " +
                q.accepted.join(" / ") +
                ". ") + q.explanation;
        };
        d.append(select, check, feedback);
      } else d.append(node("p", "Önce kendin çöz; ardından açıklamayı aç."));
      const solution = node("details");
      solution.append(
        node("summary", "Çözüm ve öğretmen açıklaması"),
        node("p", q.accepted.join(" / ")),
        node("p", q.explanation),
      );
      d.append(solution);
      s.append(d);
    }
    s = section("Dersi toparlayalım");
    for (const t of c.summary.takeaways) s.append(node("p", "🌷 " + t));
    for (const t of c.summary.mistakes) s.append(node("p", "Dikkat: " + t));
    $("lesson").scrollIntoView({ block: "start" });
  }
  $("download").onclick = () => load(true);
  $("open").onclick = () => load(false);
  $("remove").onclick = async () => {
    if (
      !confirm(
        "Bu düzeyin cihazdaki genel ders paketi kaldırılsın mı? Hesap ilerlemen silinmez.",
      )
    )
      return;
    const cache = await caches.open(CACHE);
    await cache.delete("/offline-packs/" + $("level").value + ".json");
    message(
      "Bu düzeyin paketi kaldırıldı. İndirdiğin ortak ses dosyaları korunur.",
    );
  };
})();
