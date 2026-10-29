"use client";
import { useState, useEffect } from "react";
import {
  LockKeyhole,
  Check,
  Sprout,
  BookOpen,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { PageHeading } from "@/components/garden/primitives";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LumiMascot } from "@/components/garden/lumi-mascot";
import { useLearning, selectLevel, respond } from "@/lib/learning/store";
import { unitsFor, levelThemes } from "@/lib/learning/curriculum";
import { unitAvailable } from "@/lib/learning/engine";
import { LEVELS, type Level } from "@/lib/learning/types";
import { Flashcards } from "./flashcards";
import { MiniCourse } from "@/components/courses/mini-course";
import { courseById, courseForUnit } from "@/lib/courses/content";
import { useCourseLocation, setCourseLocation } from "@/lib/courses/location";
function WorldIllustration({ level }: { level: Level }) {
  return (
    <svg
      className="learning-world-art"
      viewBox="0 0 600 160"
      aria-hidden="true"
    >
      <path
        d="M0 125q140-80 295-15 160-72 305-9v59H0Z"
        fill="currentColor"
        opacity=".15"
      />
      {level === "A1" || level === "A2" ? (
        <>
          <circle cx="510" cy="45" r="24" fill="#FFE78F" />
          {[80, 190, 430].map((x, i) => (
            <g key={x} transform={`translate(${x} ${74 + (i % 2) * 15})`}>
              <path d="M0 56V12" stroke="#91B48C" strokeWidth="4" />
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse
                  key={a}
                  cx="0"
                  cy="2"
                  rx="8"
                  ry="14"
                  transform={`rotate(${a} 0 12)`}
                  fill={level === "A2" ? "#BEAAE8" : "#F6B5D0"}
                />
              ))}
              <circle cy="12" r="8" fill="#FFE498" />
            </g>
          ))}
        </>
      ) : level === "B1" ? (
        <g fill="#8EB8A0">
          {[65, 170, 435, 530].map((x, i) => (
            <g key={x}>
              <rect x={x - 4} y="85" width="8" height="65" rx="4" />
              <path
                d={`M${x - 35} 110 ${x} ${20 + (i % 2) * 14} ${x + 35} 110Z`}
                opacity=".7"
              />
            </g>
          ))}
        </g>
      ) : level === "B2" ? (
        <>
          <path
            d="M493 18a30 30 0 1 0 35 42 28 28 0 0 1-35-42"
            fill="#F5DEA4"
          />
          <g fill="#C9B9ED">
            <path d="m79 39 3 10 10 3-10 3-3 10-3-10-10-3 10-3m327-23 3 10 10 3-10 3-3 10-3-10-10-3 10-3" />
          </g>
        </>
      ) : level === "C1" ? (
        <g stroke="#A7C9D6" strokeWidth="4" fill="#E1F5F5">
          <path d="M100 145V75l65-45 65 45v70Zm65-115v115m-65-70h130" />
          <path d="m457 40 22 25-22 25-22-25Z" fill="#D7D4F2" />
        </g>
      ) : (
        <g fill="#E9C986" stroke="#D5B677" strokeWidth="3">
          <path d="m90 87-9-45 27 21 22-36 22 36 27-21-9 45Zm0 0h80v17H90Z" />
          <path d="m444 100-5-33 20 15 17-26 17 26 20-15-5 33Z" />
        </g>
      )}
      <path
        d="M262 40c0-19 25-29 38-12 18-15 40 0 36 15 22 0 23 24 1 24h-73c-24-1-23-26-2-27"
        fill="#FFFDF5"
        opacity=".7"
      />
    </svg>
  );
}
export function LevelMap() {
  const learning = useLearning();
  const { state, repository, date, ready } = learning;
  const savedCourse = courseById(useCourseLocation());
  const [viewChoice, setViewChoice] = useState<Level | null>(null);
  const view = viewChoice ?? savedCourse?.level ?? state.level;
  const [selectedId, setSelectedId] = useState("a1-01");
  const [sessionChoice, setSession] = useState<string | null>(null);
  const session = sessionChoice ?? savedCourse?.unitId ?? null;
  useEffect(() => {
    if (session)
      document.getElementById("unite-kartlari")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
  }, [session]);
  const units = unitsFor(view);
  const selected =
    units.find((u) => u.id === (savedCourse?.unitId ?? selectedId)) ?? units[0];
  const miniCourse = courseForUnit(selected.id);
  const words = repository.byUnit(selected.id);
  const unlocked = unitAvailable(state, selected.id);
  const completed = units.filter((u) =>
    state.milestones.includes(u.id + "-words"),
  ).length;
  const availableUnits = units.filter(
    (u) => repository.byUnit(u.id).length > 0,
  ).length;
  function viewLevel(level: Level) {
    setViewChoice(level);
    setSelectedId(unitsFor(level)[0].id);
    setSession(null);
    setCourseLocation(null);
  }
  return (
    <div
      className={`page-content learning-page level-map-page level-theme-${view.toLowerCase()}`}
    >
      <PageHeading
        eyebrow="HER PATİKA YENİ BİR DÜNYA"
        title="Almanca Öğrenme Haritam"
        description="Küçük kelime adımlarından kendine ait bir öğrenme yoluna."
      >
        <span className="learning-local-badge">
          <MapPin size={14} /> Başlangıç düzeyim: {state.level}
        </span>
      </PageHeading>
      <div className="learning-notice" role="status">
        {ready ? learning.notice : "Haritan hazırlanıyor…"}
      </div>
      <nav className="cefr-world-nav" aria-label="CEFR dünyaları">
        {LEVELS.map((level) => (
          <button
            type="button"
            key={level}
            aria-current={view === level ? "page" : undefined}
            onClick={() => viewLevel(level)}
          >
            <span>{levelThemes[level].symbol}</span>
            <strong>{level}</strong>
            <small>{levelThemes[level].name}</small>
            {LEVELS.indexOf(level) > LEVELS.indexOf(state.level) && (
              <LockKeyhole size={12} />
            )}
          </button>
        ))}
      </nav>
      <section className="learning-world-banner">
        <WorldIllustration level={view} />
        <div>
          <p className="eyebrow">{view} · KEŞİF DÜNYAN</p>
          <h2>{levelThemes[view].name}</h2>
          <p>{levelThemes[view].description}</p>
          <span>
            {availableUnits} çalışma ünitesi hazır · {units.length} ünite
          </span>
        </div>
        <div className="map-lumi">
          <LumiMascot expression="encouraging" decorative />
        </div>
      </section>
      <div className="placement-box">
        <div>
          <strong>Almancaya daha önce başladın mı?</strong>
          <p>
            Önceki düzeyleri bitirmeden {view} düzeyinden başlayabilirsin. Bu
            seçim ilerlemeni silmez, önceki dersleri tamamlanmış saymaz.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={!ready || learning.readonly || state.level === view}
          onClick={() => selectLevel(view)}
        >
          {state.level === view
            ? "Seçili başlangıç düzeyin"
            : view + " düzeyinden başla"}
        </Button>
      </div>
      <div className="map-progress-summary">
        <span>
          {completed} / {availableUnits} hazır çalışma ünitesi çalışıldı
        </span>
        <span>CEFR düzeyi tamamlama belgesi değildir.</span>
      </div>
      <Progress
        value={availableUnits ? (completed / availableUnits) * 100 : 0}
        aria-label="Hazır kelime ünitelerinin ilerlemesi"
      />
      <div className="learning-map-layout">
        <section
          className="learning-map-trail"
          aria-label={view + " ünite patikası"}
        >
          <svg
            className="learning-trail-line"
            viewBox="0 0 400 1200"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M200 30C70 90 70 180 200 220S330 360 200 420 60 570 200 620s140 150 0 200-140 140 0 200 140 100 0 160"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="2 24"
            />
          </svg>
          {units.map((unit, i) => {
            const done = state.milestones.includes(unit.id + "-words");
            const open = unitAvailable(state, unit.id);
            const count = repository.byUnit(unit.id).length;
            return (
              <div
                key={unit.id}
                className={`learning-path-row path-position-${i % 4}`}
              >
                <button
                  type="button"
                  className={`learning-node ${done ? "done" : open && count ? "available" : "locked"} ${selected.id === unit.id ? "selected" : ""}`}
                  onClick={() => {
                    setViewChoice(view);
                    setSelectedId(unit.id);
                    if (window.matchMedia("(max-width: 1000px)").matches)
                      requestAnimationFrame(() =>
                        document
                          .getElementById("selected-unit-panel")
                          ?.scrollIntoView({
                            behavior: window.matchMedia(
                              "(prefers-reduced-motion: reduce)",
                            ).matches
                              ? "auto"
                              : "smooth",
                            block: "start",
                          }),
                      );
                    setSession(null);
                    setCourseLocation(null);
                  }}
                  aria-pressed={selected.id === unit.id}
                  aria-label={`${unit.order}. ünite: ${unit.title}; ${done ? "kelime turu çalışıldı" : count === 0 ? "içerik planlanıyor" : open ? "çalışmaya açık" : "önceki üniteyi çalış"}`}
                >
                  {done ? (
                    <Check size={27} />
                  ) : count === 0 || !open ? (
                    <LockKeyhole size={23} />
                  ) : (
                    <Sprout size={28} />
                  )}
                  <span>{unit.order}</span>
                </button>
                <div className="learning-node-label">
                  <strong>{unit.title}</strong>
                  <small>
                    {done
                      ? "Kelime turu çalışıldı ✓"
                      : count > 0
                        ? count +
                          " kelime/ifade · " +
                          (open ? "Hazır" : "Patikada kilitli")
                        : "Ders planı · İçerik hazırlanıyor"}
                  </small>
                </div>
              </div>
            );
          })}
        </section>
        <aside className="unit-detail-panel" id="selected-unit-panel">
          <p className="eyebrow">
            {view} · {selected.order}. ÜNİTE
          </p>
          <h2>{selected.title}</h2>
          <p>{selected.goal}</p>
          <div className="unit-lessons">
            {selected.lessons.map((lesson) => {
              const available =
                (lesson.kind === "vocabulary" && words.length > 0) ||
                (lesson.kind === "planned" && !!miniCourse);
              const done = state.milestones.includes(lesson.id);
              return (
                <div key={lesson.id}>
                  <span
                    className={available ? "lesson-icon ready" : "lesson-icon"}
                  >
                    {done ? (
                      <Check size={19} />
                    ) : available ? (
                      <BookOpen size={19} />
                    ) : (
                      <LockKeyhole size={17} />
                    )}
                  </span>
                  <div>
                    <strong>{lesson.title}</strong>
                    <small>
                      {available
                        ? lesson.kind === "planned" && miniCourse
                          ? `${miniCourse.guided.length} yönlendirmeli + ${miniCourse.independent.length} bağımsız soru · Açıklamalı dersin içinde`
                          : done
                            ? "Kelime turu çalışıldı"
                            : words.length +
                              " özgün kelime/ifade · " +
                              (unlocked
                                ? "Çalışılabilir"
                                : "Önceki üniteyi çalış")
                        : "Planlandı · Etkinlik içeriği henüz yok"}
                    </small>
                  </div>
                </div>
              );
            })}
          </div>
          {words.length > 0 && unlocked ? (
            <Button
              type="button"
              disabled={!ready || learning.readonly}
              onClick={() => {
                setSession(selected.id);
                if (miniCourse) setCourseLocation(miniCourse.id);
              }}
            >
              {miniCourse ? "Açıklamalı dersi aç" : "Kelime patikasını aç"}{" "}
              <ArrowRight size={17} />
            </Button>
          ) : (
            <p className="unit-locked-note">
              {words.length === 0
                ? "Bu ünitenin ders ve kelime içeriği henüz eklenmedi. Bir tamamlanma işareti verilmez."
                : LEVELS.indexOf(view) > LEVELS.indexOf(state.level)
                  ? "Bu düzeyi başlangıç olarak seçebilir veya önceki patikanı sürdürebilirsin."
                  : "Bu düğüm, önceki ünitenin kelimelerini çalışınca açılır."}
            </p>
          )}
          <div className="unit-content-note">
            <strong>Öğrenme planı hakkında</strong>
            <p>
              A1–C2 haritasındaki 60 ünitenin tamamında açıklamalı ders,
              örnekler, metinler ve pratik bulunur. İletişim atölyesi soruları
              aynı dersin “Birlikte Deneyelim” ve “Şimdi Sıra Sende”
              bölümlerindedir. Ortak dil araçları farklı konularda tekrar
              edilir. Dersleri bitirmek tek başına resmî CEFR yeterliği
              kazandığını göstermez.
            </p>
          </div>
        </aside>
      </div>
      {session === selected.id && words.length > 0 && unlocked && (
        <div className="unit-session" id="unite-kartlari">
          {miniCourse ? (
            <MiniCourse
              key={miniCourse.id}
              course={miniCourse}
              disabled={learning.readonly}
            />
          ) : (
            <>
              <h2>{selected.title} · Kelime patikası</h2>
              <Flashcards
                key={session + date}
                title="Ünite kelimeleri"
                words={words}
                answers={state.unitAnswers[session + ":" + date] ?? {}}
                onAnswer={(id, answer) => respond(id, answer, session)}
                disabled={learning.readonly}
              />
            </>
          )}
        </div>
      )}
      <p className="learning-source-note">
        Düzey çerçevesi:{" "}
        <a
          href="https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions"
          target="_blank"
          rel="noreferrer"
        >
          Avrupa Konseyi CEFR betimleyicileri
        </a>
        . Başlıklar özgün öğretim planıdır; resmî sınav müfredatı veya seviye
        sertifikası değildir.
      </p>
    </div>
  );
}
