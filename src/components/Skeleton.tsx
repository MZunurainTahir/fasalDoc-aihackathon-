import type { CSSProperties } from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  style?: CSSProperties;
}

/**
 * Reusable shimmer skeleton loader.
 * Use it while async data is loading to improve perceived performance.
 */
export function Skeleton({ className = "", width, height, circle, style }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer bg-gradient-to-r from-border via-bg-secondary to-border bg-[length:200%_100%] ${
        circle ? "rounded-full" : "rounded-lg"
      } ${className}`}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`p-4 rounded-2xl border border-border bg-bg-elevated shadow-sm ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <Skeleton circle width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton height={14} className="w-3/5" />
          <Skeleton height={10} className="w-2/5" />
        </div>
      </div>
      <Skeleton height={10} className="w-full mb-2" />
      <Skeleton height={10} className="w-4/5" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
