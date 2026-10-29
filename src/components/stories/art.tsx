import { useId } from "react";
export function StoryArt({
  kind = "garden",
  label = "Masalsı bir hikâye sahnesi",
}: {
  kind?: string;
  label?: string;
}) {
  const id = useId();
  const night = kind === "night",
    cafe = kind === "cafe",
    gift = kind === "gift",
    train = kind === "train",
    town = kind === "town";
  return (
    <svg
      viewBox="0 0 600 360"
      role="img"
      aria-label={label}
      className="story-art"
    >
      <defs>
        <linearGradient id={id} x2="0" y2="1">
          <stop stopColor={night ? "#665498" : cafe ? "#f8cbb6" : "#c6d7f9"} />
          <stop offset="1" stopColor={night ? "#b8a4f4" : "#fff0d7"} />
        </linearGradient>
      </defs>
      <rect width="600" height="360" rx="28" fill={`url(#${id})`} />
      <circle cx="473" cy="70" r="34" fill="#ffe78f" />
      <g fill="#fff9f0" opacity=".8">
        <ellipse cx="114" cy="63" rx="63" ry="19" />
        <ellipse cx="362" cy="101" rx="48" ry="15" />
      </g>
      <path d="M0 262Q135 180 300 265Q468 200 600 250V360H0Z" fill="#a8d9bd" />
      <path d="M0 302Q200 244 386 302T600 280V360H0Z" fill="#86bc9b" />
      {cafe || town ? (
        <g stroke="#79566c" strokeWidth="3" strokeLinejoin="round">
          <path d="M155 143h288v154H155Z" fill="#fff9f0" />
          <path d="M139 145l43-48h236l42 48Z" fill="#bb9bd9" />
          <path d="M145 149h308v30H145Z" fill="#ffb7d5" />
          <path
            d="M146 149v29m42-29v29m42-29v29m42-29v29m42-29v29m42-29v29m42-29v29m42-29v29"
            stroke="#fff9f0"
            strokeWidth="16"
          />
          <rect x="184" y="202" width="70" height="58" rx="10" fill="#a9ddf7" />
          <rect x="345" y="202" width="70" height="58" rx="10" fill="#a9ddf7" />
          <path d="M276 296v-83a23 23 0 0146 0v83" fill="#f5cf9d" />
          <circle cx="311" cy="251" r="3" fill="#79566c" />
          <path d="M219 203v57m-34-28h69m126-29v57m-34-28h69" />
        </g>
      ) : train ? (
        <g stroke="#705c85" strokeWidth="3">
          <path d="M70 260h470" strokeWidth="7" />
          <rect
            x="95"
            y="160"
            width="365"
            height="100"
            rx="24"
            fill="#b8a4f4"
          />
          <path d="M112 220h330v25H112" fill="#ffb7d5" stroke="none" />
          {[120, 195, 270, 345].map((x) => (
            <rect
              key={x}
              x={x}
              y="177"
              width="55"
              height="35"
              rx="9"
              fill="#d8f2ff"
            />
          ))}
          {[158, 397].map((x) => (
            <circle key={x} cx={x} cy="261" r="19" fill="#fff9f0" />
          ))}
          <path d="M470 152v112m-10-112h30" />
          <circle cx="480" cy="141" r="12" fill="#ffe78f" />
        </g>
      ) : gift ? (
        <g stroke="#805979" strokeWidth="3">
          <path d="M206 178h182v118H206Z" fill="#ffb7d5" />
          <rect
            x="194"
            y="162"
            width="207"
            height="34"
            rx="10"
            fill="#f3a5ca"
          />
          <path d="M283 164v131h31V164" fill="#ffe78f" />
          <path
            d="M298 161c-97-2-66-71-26-35l26 35c96-2 67-71 27-35Z"
            fill="#ffe78f"
          />
          <path d="M298 145q-5-57 8-70" fill="none" />
          <path d="M306 88q39-35 52-12-20 31-52 12" fill="#a8e6cf" />
        </g>
      ) : (
        <g>
          <path d="M118 266v-94m370 94v-94" stroke="#8f8562" strokeWidth="16" />
          <ellipse cx="118" cy="150" rx="62" ry="78" fill="#91cba8" />
          <ellipse cx="488" cy="155" rx="66" ry="82" fill="#a8d9ad" />
          <path
            d="M225 288v-110q70-78 140 0v110"
            fill={night ? "#9d8ac7" : "#fff9f0"}
            stroke="#b99acb"
            strokeWidth="5"
          />
          <path d="M264 289v-71q30-40 62 0v71" fill="#edb2cf" />
          <circle cx="315" cy="246" r="5" fill="#fff1b5" />
          <path d="M295 177v-37" stroke="#809c79" strokeWidth="7" />
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx="295"
              cy="115"
              rx="13"
              ry="22"
              fill="#ffb7d5"
              transform={`rotate(${a} 295 135)`}
            />
          ))}
          <circle cx="295" cy="135" r="15" fill="#ffe78f" />
        </g>
      )}
      <path d="M280 360q-26-40 11-62h30q-5 37 58 62" fill="#f6dfbc" />
      {[55, 150, 430, 545].map((x, i) => (
        <g key={x} transform={`translate(${x} ${300 + (i % 2) * 21})`}>
          <path d="M0 24V0" stroke="#608c78" strokeWidth="4" />
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cy="-8"
              rx="6"
              ry="10"
              fill={i % 2 ? "#ffe78f" : "#ffb7d5"}
              transform={`rotate(${a})`}
            />
          ))}
          <circle r="5" fill="#fff9f0" />
        </g>
      ))}
      <g fill="#fff9f0">
        <path d="M74 123l4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" />
        <path d="M516 205l3 8 9 3-9 3-3 8-3-8-8-3 8-3Z" />
      </g>
    </svg>
  );
}
