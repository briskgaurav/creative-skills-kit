"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type SegmentedToggleProps = {
  options: string[];
  value: number;
  onChange: (index: number) => void;
  className?: string;
};

/**
 * Pill-style toggle whose active-option background is one real element that
 * slides (translateX) between segments, rather than a class swapped on each
 * button — gives the switch an actual motion cue instead of a hard cut.
 */
export function SegmentedToggle({
  options,
  value,
  onChange,
  className = "",
}: SegmentedToggleProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isFirstRun = useRef(true);

  useGSAP(
    () => {
      const track = trackRef.current;
      const button = buttonRefs.current[value];
      if (!track || !button) return;

      const trackBox = track.getBoundingClientRect();
      const buttonBox = button.getBoundingClientRect();
      const x = buttonBox.left - trackBox.left;
      const width = buttonBox.width;

      if (isFirstRun.current) {
        isFirstRun.current = false;
        gsap.set(indicatorRef.current, { x, width });
        return;
      }

      gsap.to(indicatorRef.current, {
        x,
        width,
        duration: 0.35,
        ease: "power3.out",
      });
    },
    { dependencies: [value] }
  );

  return (
    <div
      ref={trackRef}
      className={`relative flex items-center gap-1 bg-foreground/5 p-0.5 ${className}`}
    >
      <div
        ref={indicatorRef}
        className="absolute inset-y-0.5 left-0 bg-foreground"
        aria-hidden="true"
      />
      {options.map((option, index) => (
        <button
          key={option}
          ref={(el) => {
            buttonRefs.current[index] = el;
          }}
          type="button"
          onClick={() => onChange(index)}
          aria-pressed={value === index}
          className={`relative z-10 cursor-pointer px-3 py-1 text12 transition-colors ${
            value === index
              ? "text-background"
              : "text-foreground/40 hover:text-foreground/70"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
