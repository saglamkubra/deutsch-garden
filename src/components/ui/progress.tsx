"use client";
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
export function Progress({
  className,
  value = 0,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn("progress-track", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="progress-fill"
        style={{
          transform: `translateX(-${100 - Math.min(100, Math.max(0, value ?? 0))}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
}
