import { useId } from "react";
import type { WorldId } from "@/lib/garden/catalog";
const colors = {
  a1: ["#E6F2E5", "#D4E6B9", "#B9D7A2", "#D6E8B2"],
  a2: ["#DFECFC", "#D5E7EB", "#B9DCC4", "#D5EAC9"],
  b1: ["#DBEEDC", "#B3D5C4", "#A4C99E", "#CFE2BD"],
  b2: ["#4A416D", "#A199CB", "#BAB4D3", "#DDD4E8"],
  c1: ["#E7E5FB", "#CCE9E8", "#BCDAD4", "#DCF1E7"],
  c2: ["#FAE4E8", "#EAD7EA", "#D1C7E0", "#F0E1DF"],
} as const;
export function GardenScenery({ world = "a1" }: { world?: WorldId }) {
  const key = useId(),
    sky = `${key}-sky`,
    ground = `${key}-ground`,
    c = colors[world];
  return (
    <svg
      className="playground-scenery"
      viewBox="0 0 1000 760"
      preserveAspectRatio="xMidYMin slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={sky} x2="0" y2="1">
          <stop stopColor={c[0]} />
          <stop offset="1" stopColor={c[1]} />
        </linearGradient>
        <linearGradient id={ground} x2="0" y2="1">
          <stop stopColor={c[2]} />
          <stop offset="1" stopColor={c[3]} />
        </linearGradient>
      </defs>
      <rect width="1000" height="760" rx="30" fill={`url(#${sky})`} />
      {world !== "b2" && (
        <>
          <circle cx="870" cy="75" r="40" fill="#FFE89D" />
          <circle cx="870" cy="75" r="56" fill="#FFE89D" opacity=".2" />
        </>
      )}
      <g fill="#FFFDF5" opacity=".8" className="garden-clouds">
        <path d="M65 91c-9-31 27-44 40-27 10-37 70-28 69 6 34-6 43 32 14 36H79Z" />
        <path d="M610 70c-4-24 24-34 36-19 12-29 51-21 52 4 28 0 32 25 11 30h-85Z" />
      </g>
      <path
        d="M0 195q210-95 430-4 244-120 570-18v587H0Z"
        fill={`url(#${ground})`}
      />
      <path
        d="M0 310q350-140 610-20 230-80 390-40"
        fill="none"
        stroke="#D5E7B9"
        strokeWidth="55"
        opacity=".5"
      />
      <g fill="#84B183" opacity=".55">
        {[45, 140, 315, 490, 705, 900, 960].map((x, i) => (
          <path
            key={x}
            d={`M${x} ${600 + (i % 3) * 45}l-5-18 10 11 8-18-2 24`}
          />
        ))}
      </g>
      {world === "a2" && (
        <g fill="#E4BAE5" stroke="#B491C7" strokeWidth="2">
          {[540, 650, 950].map((x, i) => (
            <g key={x} transform={`translate(${x} ${65 + i * 30}) scale(.8)`}>
              <path d="M0 0C-30-40-48 8-8 15C-25 45 7 45 6 17C35 42 45 9 15 5C50-25 14-45 0 0Z" />
              <path d="M4 0v24" />
            </g>
          ))}
        </g>
      )}
      {world === "b1" && (
        <g>
          {[25, 940].map((x, i) => (
            <g key={x} transform={`translate(${x} ${40 + i * 30})`}>
              <path d="M10 130V35" stroke="#9F927B" strokeWidth="13" />
              <ellipse
                cx="10"
                cy="27"
                rx="58"
                ry="68"
                fill={i ? "#7CA990" : "#90B69B"}
              />
              <ellipse cx="1" cy="7" rx="38" ry="44" fill="#B3D2AE" />
              <circle cx="23" cy="24" r="5" fill="#F4DA8F" />
            </g>
          ))}
        </g>
      )}
      {world === "b2" && (
        <g>
          <circle cx="720" cy="66" r="34" fill="#FFF1BC" />
          <circle cx="734" cy="54" r="30" fill={c[0]} />
          {[350, 440, 590, 710, 950].map((x, i) => (
            <path
              key={x}
              d={`M${x} ${30 + (i % 2) * 34}l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z`}
              fill="#FFF3BE"
            />
          ))}
        </g>
      )}
      {world === "c1" && (
        <g
          fill="#FFF9FC"
          fillOpacity=".14"
          stroke="#FAFFFF"
          strokeWidth="4"
          opacity=".8"
        >
          <path d="M530 188V92Q710-85 920 92v96M530 92h390M610 188V36m100 152V8m110 180V36" />
          <path
            d="m45 154 16-48 20 48-17 23Zm810-13 12-37 15 37-13 18Z"
            fill="#C6B8EF"
            fillOpacity=".8"
          />
        </g>
      )}
      {world === "c2" && (
        <g stroke="#D3AB66" strokeWidth="4">
          <path
            d="M575 190V110Q720-24 865 110v80M600 190V115Q720 4 840 115v75"
            fill="#FDF3DD"
            fillOpacity=".55"
          />
          <path
            d="M600 88v-33m240 33v-33M620 43l16 13 15-25 15 25 16-13-5 35h-52Z"
            fill="#F6D684"
          />
          <path d="M560 190h325" />
          <circle cx="720" cy="69" r="9" fill="#C5A1D7" />
        </g>
      )}
      <g fill="#B6C3A0">
        <ellipse cx="57" cy="372" rx="22" ry="12" />
        <ellipse cx="948" cy="469" rx="17" ry="10" />
        <ellipse cx="75" cy="591" rx="14" ry="8" />
      </g>
      <g fill="#FFFBE5">
        {[75, 180, 850, 935, 70, 930].map((x, i) => (
          <g key={i} transform={`translate(${x} ${235 + i * 58})`}>
            <circle cy="-5" r="5" />
            <circle cx="-5" cy="2" r="5" />
            <circle cx="5" cy="2" r="5" />
            <circle cy="1" r="3" fill="#E3B558" />
          </g>
        ))}
      </g>
      <g className="scenery-butterfly" transform="translate(760 137)">
        <path
          d="M0 0c-36-40-44 14-12 14-23 22 4 38 14 7 21 28 40-1 15-13C49-17 14-36 0 0Z"
          fill="#CAB1E9"
        />
        <path d="M1-2 3 22" stroke="#9A80AF" strokeWidth="3" />
      </g>
      <g transform="translate(62 180)">
        <path d="M0 45V21m17 24V29" stroke="#E2CFA8" strokeWidth="7" />
        <path d="M-19 22q19-44 38 0Z" fill="#E7A5AE" />
        <path d="M4 29q13-28 26 0Z" fill="#D0B1DC" />
        <circle cx="-5" cy="13" r="4" fill="#FFF9DD" />
      </g>
      <g fill="#FFF5B8" className="meadow-sparkles">
        <path d="m510 112 4 10 10 4-10 4-4 10-4-10-10-4 10-4Zm-475 326 3 8 8 3-8 3-3 8-3-8-8-3 8-3Zm916 168 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" />
      </g>
    </svg>
  );
}
