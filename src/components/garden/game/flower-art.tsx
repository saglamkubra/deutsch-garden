import {
  flowerById,
  type FlowerId,
  type DecorationId,
} from "@/lib/garden/catalog";
import type { GrowthStage } from "@/lib/garden/model";
export function FlowerArt({
  species,
  stage,
  decorative = true,
}: {
  species: FlowerId;
  stage: GrowthStage;
  decorative?: boolean;
}) {
  const f = flowerById(species);
  return (
    <svg
      viewBox="0 0 120 140"
      className={`game-flower flower-${species} stage-${stage}`}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : f.name}
    >
      <ellipse cx="60" cy="129" rx="29" ry="5" fill="#615A5230" />
      {stage === "seed" ? (
        <>
          <path d="M30 127q30-13 60 0" fill="#A07D65" />
          <ellipse
            cx="60"
            cy="120"
            rx="7"
            ry="10"
            transform="rotate(30 60 120)"
            fill="#D7AD79"
          />
          <path d="m56 124 7-9" stroke="#F7D7A2" strokeWidth="2" />
          <circle cx="82" cy="111" r="2" fill="#E5CBA8" />
        </>
      ) : (
        <g className="plant-sway">
          <path
            d={stage === "sprout" ? "M60 124V99" : "M60 124V53"}
            stroke="#6D9D74"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d={
              stage === "sprout"
                ? "M59 112c-17 0-24-10-23-18 16 0 23 8 23 18Zm3-10c13-1 21-11 20-18-14 0-20 10-20 18Z"
                : "M59 106c-24 1-33-15-33-24 22 0 32 11 33 24Zm3-18c20-1 31-14 31-24-20-1-29 12-31 24Z"
            }
            fill="#93C393"
          />
          {stage === "growing" && (
            <>
              <path
                d="M60 84V59m0 13q-20 0-19-17 17 0 19 17m1-10q17-14 22-1-9 11-22 1"
                fill="#A8CE95"
                stroke="#7FAB7D"
                strokeWidth="3"
              />
              <circle cx="60" cy="56" r="4" fill="#B7DCA6" />
            </>
          )}
          {stage === "bud" && (
            <>
              <path
                d="M47 64q-4-25 13-31 18 6 13 31-12 14-26 0Z"
                fill={f.color}
              />
              <path
                d="m50 59 10 9 10-9"
                stroke="#79A77D"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}
          {stage === "bloom" && (
            <g className="flower-head">
              {species === "birthday-star" && (
                <g className="birthday-flower-glow">
                  <path
                    d="m60 13 12 24 27-4-13 24 13 24-27-4-12 24-12-24-27 4 13-24-13-24 27 4Z"
                    fill={f.color}
                    stroke={f.accent}
                    strokeWidth="2"
                  />
                  <path
                    d="m60 21 4 24 23-6-17 17 17 17-23-5-4 24-4-24-23 5 17-17-17-17 23 6Z"
                    fill="#FFE7F2"
                  />
                  <circle cx="60" cy="56" r="15" fill={f.center} />
                  <path
                    d="m60 44 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z"
                    fill="#E9BA60"
                  />
                  <path
                    d="m92 16 2 6 6 2-6 2-2 6-2-6-6-2 6-2ZM23 82l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"
                    fill="#EBCB7D"
                  />
                </g>
              )}
              {species === "starlily" && (
                <>
                  <path
                    d="m60 18 10 24 25-4-15 21 15 21-25-4-10 24-10-24-25 4 15-21-15-21 25 4Z"
                    fill={f.color}
                    stroke={f.accent}
                    strokeWidth="2"
                  />
                  <path
                    d="m60 27 1 53m-24-35 43 28m2-28L40 73"
                    stroke="#F3DFFB"
                    strokeWidth="2"
                  />
                  <circle cx="60" cy="59" r="10" fill={f.center} />
                  <path
                    d="m91 14 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z"
                    fill="#FFE78F"
                  />
                </>
              )}
              {species === "forgetmenot" && (
                <>
                  {[
                    [43, 43],
                    [77, 40],
                    [60, 70],
                  ].map(([x, y]) => (
                    <g key={x}>
                      {[0, 72, 144, 216, 288].map((angle) => (
                        <ellipse
                          key={angle}
                          cx={x}
                          cy={y - 10}
                          rx="7"
                          ry="10"
                          transform={`rotate(${angle} ${x} ${y})`}
                          fill={f.color}
                          stroke={f.accent}
                          strokeWidth=".7"
                        />
                      ))}
                      <circle cx={x} cy={y} r="5" fill={f.center} />
                    </g>
                  ))}
                </>
              )}
              {(species === "moonflower" || species === "royal") && (
                <>
                  <path
                    d="m60 17 10 22 24-4-11 22 11 22-24-4-10 22-10-22-24 4 11-22-11-22 24 4Z"
                    fill={f.color}
                    stroke={f.accent}
                    strokeWidth="2"
                  />
                  <circle cx="60" cy="56" r="13" fill={f.center} />
                  {species === "royal" ? (
                    <path
                      d="m46 19-5-15 12 7 7-10 7 10 12-7-5 15Z"
                      fill="#EAC777"
                    />
                  ) : (
                    <path
                      d="m90 12 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z"
                      fill="#FFE78F"
                    />
                  )}
                  <path
                    d="M55 59q5 4 10 0"
                    fill="none"
                    stroke={f.accent}
                    strokeWidth="2"
                  />
                </>
              )}
              {species === "daisy" && (
                <>
                  <g fill={f.color}>
                    {Array.from({ length: 10 }, (_, i) => (
                      <ellipse
                        key={i}
                        cx="60"
                        cy="32"
                        rx="7"
                        ry="18"
                        transform={`rotate(${i * 36} 60 52)`}
                      />
                    ))}
                  </g>
                  <circle cx="60" cy="52" r="15" fill={f.center} />
                  <g fill="#BA9047">
                    <circle cx="55" cy="49" r="1.6" />
                    <circle cx="65" cy="49" r="1.6" />
                  </g>
                  <path
                    d="M56 56q4 4 8 0"
                    fill="none"
                    stroke="#BA9047"
                    strokeWidth="1.5"
                  />
                </>
              )}
              {species === "tulip" && (
                <>
                  <path
                    d="M35 35 49 44 60 28 71 44 86 35c1 31-7 47-26 47S34 65 35 35Z"
                    fill={f.color}
                  />
                  <path
                    d="M60 37v39M40 44q2 25 17 32"
                    stroke={f.accent}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}
              {species === "rose" && (
                <>
                  <path
                    d="m60 25 17 3 4 13 12 8-6 19-17 9-18-2-15-9-4-18 10-17Z"
                    fill={f.color}
                  />
                  <path
                    d="M43 42q28-21 35 5 4 17-19 19-21-3-13-17 12-15 23-2 6 12-10 11-9-3-2-8"
                    stroke={f.center}
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="m45 73 15 7 14-7"
                    stroke="#6D9D74"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}
              {species === "sunflower" && (
                <>
                  <g fill={f.color}>
                    {Array.from({ length: 12 }, (_, i) => (
                      <ellipse
                        key={i}
                        cx="60"
                        cy="26"
                        rx="7"
                        ry="15"
                        transform={`rotate(${i * 30} 60 51)`}
                      />
                    ))}
                  </g>
                  <circle cx="60" cy="51" r="20" fill={f.center} />
                  <circle
                    cx="60"
                    cy="51"
                    r="15"
                    fill="none"
                    stroke="#C99C6C"
                    strokeWidth="2"
                    strokeDasharray="2 4"
                  />
                  <path
                    d="M53 55q7 8 14 0"
                    stroke="#77553E"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </>
              )}
              {species === "lavender" && (
                <>
                  <path
                    d="m60 92-15-47m15 43 15-48M60 81V25"
                    stroke="#6D9D74"
                    strokeWidth="3"
                  />
                  {[0, 1, 2, 3, 4].map((i) => (
                    <g key={i} fill={i % 2 ? f.center : f.color}>
                      <ellipse
                        cx="55"
                        cy={32 + i * 9}
                        rx="6"
                        ry="5"
                        transform={`rotate(-25 55 ${32 + i * 9})`}
                      />
                      <ellipse cx="65" cy={28 + i * 9} rx="6" ry="5" />
                      {i < 4 && (
                        <>
                          <ellipse
                            cx={41 + i * 2.5}
                            cy={43 + i * 9}
                            rx="5"
                            ry="5"
                          />
                          <ellipse
                            cx={78 - i * 2.5}
                            cy={41 + i * 9}
                            rx="5"
                            ry="5"
                          />
                        </>
                      )}
                    </g>
                  ))}
                </>
              )}
              {species === "cherry" && (
                <>
                  <path
                    d="M60 91V44m0 24-22-17m22 8 22-22"
                    stroke="#A07B75"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {[
                    [40, 45, 13],
                    [77, 38, 15],
                    [59, 65, 11],
                  ].map(([x, y, r]) => (
                    <g key={x}>
                      {[0, 72, 144, 216, 288].map((angle) => (
                        <ellipse
                          key={angle}
                          cx={x}
                          cy={y - r * 0.65}
                          rx={r * 0.5}
                          ry={r * 0.65}
                          transform={`rotate(${angle} ${x} ${y})`}
                          fill={f.color}
                        />
                      ))}
                      <circle cx={x} cy={y} r="4" fill={f.center} />
                      <circle cx={x + 2} cy={y - 2} r="1.5" fill="#FFF5D9" />
                    </g>
                  ))}
                </>
              )}
            </g>
          )}
        </g>
      )}
    </svg>
  );
}
export function DecorationArt({ kind }: { kind: DecorationId }) {
  return (
    <svg
      viewBox="0 0 100 95"
      className={`decoration-art decoration-${kind}`}
      aria-hidden="true"
    >
      {kind === "birthday-arch" && (
        <>
          <circle
            cx="50"
            cy="47"
            r="31"
            fill="none"
            stroke="#A8C99D"
            strokeWidth="8"
          />
          {[
            [22, 29],
            [41, 16],
            [66, 20],
            [79, 45],
            [69, 69],
            [29, 68],
          ].map(([x, y], i) => (
            <g
              key={x}
              transform={`translate(${x} ${y})`}
              fill={i % 2 ? "#D9BCEB" : "#FFB7D5"}
            >
              <circle cy="-5" r="6" />
              <circle cx="-5" cy="2" r="6" />
              <circle cx="5" cy="2" r="6" />
              <circle cy="1" r="3" fill="#FFE78F" />
            </g>
          ))}
          <path d="m44 75-9 19 14-6 7 7 1-22" fill="#E7C1E0" />
          <path d="m50 75 13 20 3-11 14 3-18-16" fill="#CAB3E8" />
          <path
            d="M49 76c-30-20-22-33-10-22l12 17c29-24 34-10 19 2Z"
            fill="#FFD5E5"
          />
        </>
      )}
      {kind === "mint-pot" && (
        <>
          <path
            d="m22 50 9 37h38l9-37"
            fill="#A8E6CF"
            stroke="#78BBA7"
            strokeWidth="2"
          />
          <rect x="18" y="43" width="64" height="14" rx="6" fill="#C9F3E5" />
          <path
            d="M35 73q-3-12 6-12 5-10 13-2 13-4 13 10-12 10-32 4Z"
            fill="#FFF9F0"
          />
          <path
            d="M50 43V18m0 13Q23 35 28 14q19-2 22 17m0-9q24-17 25 4-16 8-25-4"
            fill="#92C68D"
          />
        </>
      )}
      {kind === "pink-butterfly" && (
        <>
          <path d="M50 85V47" stroke="#A38A73" strokeWidth="3" />
          <path
            d="M50 39C18-5 1 42 35 47 9 76 44 87 50 55c12 31 45 12 17-9C104 32 74 0 50 39Z"
            fill="#FFB7D5"
            stroke="#D38CA9"
            strokeWidth="2"
          />
          <path
            d="M50 34v28m0-27-7-10m7 10 7-10"
            stroke="#917495"
            strokeWidth="3"
          />
          <circle cx="29" cy="30" r="5" fill="#FFE78F" />
          <circle cx="73" cy="31" r="5" fill="#FFE78F" />
        </>
      )}
      {kind === "magic-tree" && (
        <>
          <path d="M44 88V45h12v43" fill="#B7957E" />
          <path d="m50 67-17-17m17 6 19-16" stroke="#B7957E" strokeWidth="5" />
          <path
            d="M18 49C-1 27 26 9 37 17 45-7 76 8 75 21c31 5 23 38-1 35-16 20-43 8-43-1-8 5-18-1-13-6Z"
            fill="#B8A4F4"
          />
          <path
            d="m33 26 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1m36 8 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"
            fill="#FFE78F"
          />
        </>
      )}
      {kind === "crystal" && (
        <>
          <path
            d="m13 64 12-25 17 16-5 31Z"
            fill="#A9DDF7"
            stroke="#83B9D0"
            strokeWidth="2"
          />
          <path
            d="m35 43 18-31 18 28-8 48-26-2Z"
            fill="#CAB8F2"
            stroke="#A28ACD"
            strokeWidth="2"
          />
          <path
            d="m53 12 2 76M35 43l20 7 16-10"
            fill="none"
            stroke="#F2E9FF"
            strokeWidth="2"
          />
          <path d="m66 61 13-20 12 24-6 23-22-1Z" fill="#FFB7D5" />
          <path d="m19 17 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#FFE78F" />
        </>
      )}
      {kind === "royal-gate" && (
        <>
          <path
            d="M20 88V43a30 30 0 0 1 60 0v45h-9V43a21 21 0 0 0-42 0v45Z"
            fill="#C6AFE9"
            stroke="#A68AC8"
            strokeWidth="2"
          />
          <path d="m35 21-5-16 13 6 7-10 7 10 13-6-5 16Z" fill="#FFE78F" />
          <path d="M12 87h24m28 0h24" stroke="#B59A7D" strokeWidth="4" />
          <path
            d="M23 72Q1 53 15 51q12 1 8 21m53-10q24-25 17-6-10 15-17 6"
            fill="#A8C78F"
          />
        </>
      )}
      {kind === "pumpkin" && (
        <>
          <path
            d="M49 31q-6-15 10-20"
            stroke="#83A578"
            strokeWidth="7"
            fill="none"
          />
          <ellipse
            cx="50"
            cy="58"
            rx="37"
            ry="30"
            fill="#FFCEB4"
            stroke="#D9A181"
            strokeWidth="2"
          />
          <ellipse
            cx="50"
            cy="58"
            rx="24"
            ry="30"
            fill="none"
            stroke="#E9AF8F"
            strokeWidth="3"
          />
          <ellipse
            cx="50"
            cy="58"
            rx="10"
            ry="30"
            fill="none"
            stroke="#E9AF8F"
            strokeWidth="2"
          />
          <path
            d="M40 64q10 11 20 0"
            fill="none"
            stroke="#AA8069"
            strokeWidth="2"
          />
        </>
      )}
      {kind === "lantern" && (
        <>
          <path
            d="M39 23V17a11 11 0 0 1 22 0v6"
            fill="none"
            stroke="#AC967B"
            strokeWidth="4"
          />
          <path
            d="m24 31 13-10h26l13 10-6 50H30Z"
            fill="#FFEFB4"
            stroke="#C7A87B"
            strokeWidth="3"
          />
          <path
            d="m50 37 5 10 12 2-9 8 2 12-10-6-10 6 2-12-9-8 12-2Z"
            fill="#F1C869"
          />
          <path d="M25 32h50M26 83h48" stroke="#C7A87B" strokeWidth="5" />
        </>
      )}
      {kind === "snowglobe" && (
        <>
          <circle
            cx="50"
            cy="43"
            r="33"
            fill="#DAEFFA"
            stroke="#B2D5E8"
            strokeWidth="3"
          />
          <path d="m50 19-18 30h9l-15 17h48L59 49h9Z" fill="#9DC9B0" />
          <path d="M25 75h50l7 13H18Z" fill="#C8B1E9" />
          <circle cx="30" cy="30" r="3" fill="white" />
          <circle cx="68" cy="45" r="3" fill="white" />
        </>
      )}
      {kind === "fence" && (
        <g fill="#D6B18A" stroke="#AE8D6C" strokeWidth="2">
          <path d="M12 52h76v10H12Zm0 19h76v9H12Z" />
          {[18, 44, 70].map((x) => (
            <path key={x} d={`M${x} 87V40l6-8 6 8v47Z`} />
          ))}
        </g>
      )}
      {kind === "mushroom" && (
        <>
          <path
            d="m43 47-6 39q13 7 26 0l-6-39"
            fill="#FFF1DA"
            stroke="#CCB5A0"
            strokeWidth="2"
          />
          <path d="M13 53c2-52 72-52 75 0q-38 15-75 0Z" fill="#EDA1AC" />
          <g fill="#FFF1D9">
            <circle cx="34" cy="35" r="7" />
            <circle cx="64" cy="30" r="6" />
            <circle cx="75" cy="48" r="4" />
            <circle cx="50" cy="50" r="5" />
          </g>
        </>
      )}
      {kind === "stone" && (
        <>
          <path
            d="M14 72 27 48l35-9 24 20 4 22-65 7Z"
            fill="#BCC8C9"
            stroke="#9AABAD"
            strokeWidth="2"
          />
          <path d="M48 59c-10-10-22 5 2 17 24-15 12-29-2-17Z" fill="#E7C0CB" />
          <path
            d="m28 61 10-10"
            stroke="#D7E0DD"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      )}
      {kind === "butterfly" && (
        <>
          <path d="M50 84V50" stroke="#A28D77" strokeWidth="3" />
          <g className="garden-butterfly">
            <path
              d="M50 39C19 1 0 46 36 48 7 77 42 87 50 55c17 31 41 4 15-10C99 27 68 4 50 39Z"
              fill="#B9A5E7"
            />
            <path
              d="m50 37 1 20m-1-20-6-9m6 9 7-8"
              stroke="#806A9F"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        </>
      )}
      {kind === "pot" && (
        <>
          <path
            d="m23 52 8 36h38l8-36"
            fill="#E6A392"
            stroke="#CB897D"
            strokeWidth="2"
          />
          <rect x="20" y="48" width="60" height="13" rx="5" fill="#F3BAA8" />
          <path
            d="M50 48V20m0 18C26 38 29 15 50 33m1-7C73 5 78 33 51 36"
            fill="#A9CD96"
            stroke="#83AA7B"
            strokeWidth="3"
          />
          <path
            d="M42 72q8 8 16 0"
            stroke="#B57569"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
