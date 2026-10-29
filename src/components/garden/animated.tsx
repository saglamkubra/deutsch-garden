"use client";
import { MotionConfig, motion } from "motion/react";
import type { ReactNode } from "react";
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      {children}
    </motion.div>
  );
}
export function AnimatedDecorations() {
  return (
    <div className="background-decor" aria-hidden="true">
      <span className="decor-flower">✿</span>
      <span className="decor-star">✧</span>
      <span className="decor-flower second">✿</span>
    </div>
  );
}
