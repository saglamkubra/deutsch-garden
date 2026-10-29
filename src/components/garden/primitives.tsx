import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Sprout, Star } from "lucide-react";
export function ColorCard({
  children,
  className,
  tone = "white",
}: {
  children: ReactNode;
  className?: string;
  tone?: string;
}) {
  return (
    <section className={cn("color-card", `tone-${tone}`, className)}>
      {children}
    </section>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">
          <Sprout size={15} />
          {eyebrow}
        </p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {children}
    </div>
  );
}
export function AchievementBadge({
  title,
  caption,
}: {
  title: string;
  caption: string;
}) {
  return (
    <div className="achievement">
      <span className="achievement-medal">
        <Star size={24} fill="currentColor" />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{caption}</p>
      </div>
    </div>
  );
}
export function DemoLabel({
  children = "Örnek veriler",
}: {
  children?: ReactNode;
}) {
  return <span className="demo-label">{children}</span>;
}
