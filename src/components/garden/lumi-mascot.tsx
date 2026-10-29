import { cn } from "@/lib/utils";
export type LumiExpression =
  "happy" | "excited" | "thinking" | "encouraging" | "celebrating";
const labels: Record<LumiExpression, string> = {
  happy: "Mutlu",
  excited: "Heyecanlı",
  thinking: "Düşünen",
  encouraging: "Cesaret veren",
  celebrating: "Kutlayan",
};
export function LumiMascot({
  expression = "happy",
  className,
  decorative = false,
}: {
  expression?: LumiExpression;
  className?: string;
  decorative?: boolean;
}) {
  const excited = expression === "excited" || expression === "celebrating";
  return (
    <svg
      viewBox="0 0 300 320"
      className={cn("lumi-mascot", `lumi-${expression}`, className)}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : `${labels[expression]} çiçek Lumi`}
      aria-hidden={decorative || undefined}
    >
      <ellipse cx="151" cy="294" rx="69" ry="12" fill="#9471B7" opacity=".12" />
      <g className="lumi-float">
        <path
          d="M151 278c-8-41 7-69 0-115"
          stroke="#739D7B"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <path
          className="lumi-wave"
          d="M147 248c-38 6-65-15-66-37 35-5 61 13 66 37Z"
          fill="#A8D5AC"
          stroke="#79A780"
          strokeWidth="2"
        />
        <path
          d="M154 226c35 0 56-23 58-43-31 0-53 18-58 43Z"
          fill="#A8E6CF"
          stroke="#79A780"
          strokeWidth="2"
        />
        <g
          fill={expression === "thinking" ? "#C7B3F0" : "#FFB7D5"}
          stroke="#FFFFFF"
          strokeWidth="2.5"
        >
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <ellipse
              key={angle}
              cx="150"
              cy="87"
              rx="29"
              ry="44"
              transform={`rotate(${angle} 150 136)`}
            />
          ))}
        </g>
        <circle cx="150" cy="136" r="47" fill="#FFE78F" />
        <circle
          cx="150"
          cy="136"
          r="42"
          stroke="#FFEFAB"
          strokeWidth="2"
          fill="none"
        />
        <g className="lumi-eyes" style={{ transformOrigin: "150px 133px" }}>
          {expression === "encouraging" ? (
            <>
              <path
                d="M123 134q7-10 14 0"
                fill="none"
                stroke="#594668"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <ellipse cx="167" cy="132" rx="5" ry="7" fill="#594668" />
              <circle cx="168" cy="130" r="1.8" fill="white" />
            </>
          ) : expression === "celebrating" ? (
            <g
              fill="none"
              stroke="#594668"
              strokeWidth="4"
              strokeLinecap="round"
            >
              <path d="m123 137 7-7 7 7m23 0 7-7 7 7" />
            </g>
          ) : (
            <>
              <ellipse
                cx="130"
                cy="132"
                rx="5.5"
                ry={excited ? 9 : 7}
                fill="#594668"
              />
              <ellipse
                cx="169"
                cy="132"
                rx="5.5"
                ry={excited ? 9 : 7}
                fill="#594668"
              />
              <g fill="white">
                <circle cx="132" cy="129" r="2" />
                <circle cx="171" cy="129" r="2" />
              </g>
            </>
          )}
        </g>
        <g fill="#F2A0A8" opacity=".8">
          <ellipse cx="119" cy="148" rx="8" ry="4" />
          <ellipse cx="180" cy="148" rx="8" ry="4" />
        </g>
        {excited ? (
          <path d="M139 152q11 23 22 0Z" fill="#76516B" />
        ) : expression === "thinking" ? (
          <>
            <path
              d="M145 157q6-4 12 0"
              stroke="#76516B"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="m160 116 13-2"
              stroke="#76516B"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </>
        ) : (
          <path
            d="M140 153q10 13 21 0"
            stroke="#76516B"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
        )}
        {expression === "thinking" && (
          <text x="223" y="74" fontSize="36" fill="#9472B6" fontWeight="800">
            ?
          </text>
        )}
      </g>
      <g className="lumi-sparkles" fill="#D9B458" aria-hidden="true">
        <path d="m45 86 4 11 11 4-11 4-4 11-4-11-11-4 11-4Zm208 77 4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" />
        {expression === "celebrating" && (
          <>
            <path d="m244 42 5 14 14 5-14 5-5 14-5-14-14-5 14-5ZM54 191l5 14 14 5-14 5-5 14-5-14-14-5 14-5Z" />
            <circle cx="77" cy="55" r="4" />
            <circle cx="229" cy="226" r="5" />
          </>
        )}
      </g>
    </svg>
  );
}
