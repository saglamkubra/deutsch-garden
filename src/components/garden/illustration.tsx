import { useId } from "react";
export function GardenIllustration({ small = false }: { small?: boolean }) {
  const id = useId().replaceAll(":", "");
  return (
    <svg
      className={small ? "garden-art small" : "garden-art"}
      viewBox="0 0 600 350"
      fill="none"
      role="img"
      aria-label="Gülümseyen papatya ve kelebeklerle dolu masalsı bir bahçe"
    >
      <defs>
        <linearGradient
          id={id}
          x1="300"
          y1="200"
          x2="300"
          y2="350"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D6EDBD" />
          <stop offset="1" stopColor="#A8D9AF" />
        </linearGradient>
      </defs>
      <circle cx="475" cy="66" r="36" fill="#FFE99E" />
      <path
        d="M70 96c0-15 13-24 25-18 6-22 40-23 47 0 22-2 30 24 12 28H82c-8 0-12-4-12-10ZM342 47c-1-12 12-21 23-16 10-20 35-14 37 1 19-3 29 18 12 24h-63c-6 0-9-4-9-9Z"
        fill="white"
        opacity=".75"
      />
      <path
        d="M26 295c77-69 160-77 243-46 85-80 235-56 302 40l20 61H6Z"
        fill={`url(#${id})`}
      />
      <ellipse
        cx="324"
        cy="329"
        rx="227"
        ry="20"
        fill="#8FC99B"
        opacity=".35"
      />
      <path
        d="M324 306c-11-56 18-98 9-154M213 310c-3-36-17-57-17-94M425 312c-8-31 12-58 9-90"
        stroke="#638F68"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M325 258c-40 6-59-19-59-33 37-7 56 8 59 33ZM332 228c35 5 56-18 59-34-34-5-55 11-59 34ZM209 281c-29-1-40-17-42-29 28-3 40 10 42 29ZM428 280c26 2 44-15 46-27-26-4-44 8-46 27Z"
        fill="#77AD77"
      />
      <g className="flower-sway" style={{ transformOrigin: "333px 304px" }}>
        <g fill="#FFFDF4">
          <ellipse cx="332" cy="119" rx="17" ry="34" />
          <ellipse cx="332" cy="185" rx="17" ry="34" />
          <ellipse cx="300" cy="152" rx="34" ry="17" />
          <ellipse cx="365" cy="152" rx="34" ry="17" />
          <ellipse
            cx="309"
            cy="128"
            rx="17"
            ry="31"
            transform="rotate(-45 309 128)"
          />
          <ellipse
            cx="356"
            cy="176"
            rx="17"
            ry="31"
            transform="rotate(-45 356 176)"
          />
          <ellipse
            cx="356"
            cy="128"
            rx="17"
            ry="31"
            transform="rotate(45 356 128)"
          />
          <ellipse
            cx="309"
            cy="176"
            rx="17"
            ry="31"
            transform="rotate(45 309 176)"
          />
        </g>
        <circle cx="333" cy="152" r="29" fill="#F7C959" />
        <circle cx="324" cy="150" r="3" fill="#5A4942" />
        <circle cx="342" cy="150" r="3" fill="#5A4942" />
        <path
          d="M327 160q6 7 12 0"
          stroke="#5A4942"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <ellipse cx="316" cy="159" rx="4" ry="2.5" fill="#EBA07B" />
        <ellipse cx="350" cy="159" rx="4" ry="2.5" fill="#EBA07B" />
      </g>
      <g fill="#F6AACA">
        <circle cx="194" cy="198" r="15" />
        <circle cx="176" cy="211" r="15" />
        <circle cx="184" cy="231" r="15" />
        <circle cx="206" cy="231" r="15" />
        <circle cx="214" cy="211" r="15" />
      </g>
      <circle cx="195" cy="216" r="12" fill="#FFE49C" />
      <g fill="#B9A4E9">
        <circle cx="434" cy="201" r="13" />
        <circle cx="418" cy="214" r="13" />
        <circle cx="425" cy="232" r="13" />
        <circle cx="445" cy="232" r="13" />
        <circle cx="450" cy="214" r="13" />
      </g>
      <circle cx="434" cy="218" r="10" fill="#FFF2AF" />
      <path
        d="M95 318v-35m0 17c-22 0-28-13-28-20 20 0 28 9 28 20Zm1-9c24 0 30-15 28-24-21 2-28 12-28 24Z"
        stroke="#6A9E72"
        strokeWidth="5"
        fill="#8ABF89"
        strokeLinejoin="round"
      />
      <g className="butterfly">
        <path
          d="M220 106c-37-42-54 8-20 15-31 22 2 42 20 6 20 32 47 4 17-11 33-20 2-47-17-10Z"
          fill="#C8B8F0"
        />
        <path
          d="m220 105 1 23m0-24-5-7m5 7 5-7"
          stroke="#8773A5"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      <g fill="#F6CE70">
        <path d="m120 148 3 9 10 3-10 3-3 10-3-10-10-3 10-3ZM410 99l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" />
      </g>
      <g fill="#FFFAE7">
        <circle cx="155" cy="308" r="5" />
        <circle cx="150" cy="316" r="5" />
        <circle cx="160" cy="316" r="5" />
        <circle cx="504" cy="304" r="5" />
        <circle cx="499" cy="312" r="5" />
        <circle cx="509" cy="312" r="5" />
      </g>
      <g fill="#E6B952">
        <circle cx="155" cy="313" r="3" />
        <circle cx="504" cy="309" r="3" />
      </g>
      <path d="M455 325h43l-5-23h-33Z" fill="#EAAE98" />
      <path
        d="M478 302v-22m0 9c-16-1-20-11-19-16 14 0 19 7 19 16Zm0-8c15 0 22-11 20-18-14 1-20 9-20 18Z"
        fill="#7EAF78"
        stroke="#7EAF78"
        strokeWidth="3"
      />
    </svg>
  );
}
