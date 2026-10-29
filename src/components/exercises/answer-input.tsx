"use client";
import { useState } from "react";
import type { Question } from "@/lib/exercises/types";
import { normalize } from "@/lib/exercises/generate";
import { Button } from "@/components/ui/button";
import { Check, RotateCcw, Undo2 } from "lucide-react";
export function AnswerInput({
  question: q,
  onSubmit,
  locked = false,
  savedValue = "",
}: {
  question: Question;
  onSubmit: (value: string) => void;
  locked?: boolean;
  savedValue?: string;
}) {
  const [value, setValue] = useState(savedValue);
  const [selected, setSelected] = useState<number[]>(() => {
    const used: number[] = [];
    for (const word of normalize(savedValue).split(" ")) {
      const i =
        q.tiles?.findIndex(
          (t, n) => normalize(t) === word && !used.includes(n),
        ) ?? -1;
      if (i >= 0) used.push(i);
    }
    return used;
  });
  const sentence = q.type === "sentence",
    typed = q.options.length === 0 && !sentence;
  const answer = sentence ? selected.map((i) => q.tiles?.[i]).join(" ") : value;
  return (
    <div className="grammar-answer-input">
      <p className="grammar-question-prompt">{q.prompt}</p>
      {sentence ? (
        <>
          <div
            className="grammar-sentence-zone"
            aria-label="Oluşturduğun cümle"
          >
            {selected.length ? (
              selected.map((index, n) => (
                <button
                  lang="de"
                  disabled={locked}
                  key={index}
                  onClick={() =>
                    setSelected(selected.filter((_, i) => i !== n))
                  }
                >
                  {q.tiles?.[index]}
                </button>
              ))
            ) : (
              <span>Sözcüklere dokun, cümlen filizlensin…</span>
            )}
          </div>
          <div className="grammar-word-bank">
            {q.tiles?.map((tile, i) => (
              <button
                key={i}
                lang="de"
                disabled={locked || selected.includes(i)}
                onClick={() => setSelected([...selected, i])}
              >
                {tile}
              </button>
            ))}
          </div>
          <div className="grammar-input-tools">
            <Button
              variant="outline"
              disabled={locked || !selected.length}
              onClick={() => setSelected(selected.slice(0, -1))}
            >
              <Undo2 size={15} />
              Geri al
            </Button>
            <Button
              variant="outline"
              disabled={locked || !selected.length}
              onClick={() => setSelected([])}
            >
              <RotateCcw size={15} />
              Sıfırla
            </Button>
          </div>
        </>
      ) : typed ? (
        <label className="grammar-typed-label">
          Almanca yanıtın
          <input
            lang="de"
            value={value}
            disabled={locked}
            spellCheck={false}
            autoComplete="off"
            placeholder="Yalnızca istenen bölümü yaz…"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && answer.trim() && !locked)
                onSubmit(answer);
            }}
          />
        </label>
      ) : (
        <div className="grammar-answer-options">
          {q.options.map((option, i) => (
            <button
              key={option}
              disabled={locked}
              aria-pressed={value === option}
              onClick={() => setValue(option)}
            >
              <span>{String.fromCharCode(65 + i)}</span>
              {option}
              {value === option && <Check size={17} />}
            </button>
          ))}
        </div>
      )}
      <Button
        className="grammar-check-button"
        disabled={
          locked ||
          !answer.trim() ||
          (sentence && selected.length !== q.tiles?.length)
        }
        onClick={() => onSubmit(answer)}
      >
        <Check size={17} />
        Yanıtımı kontrol et
      </Button>
    </div>
  );
}
