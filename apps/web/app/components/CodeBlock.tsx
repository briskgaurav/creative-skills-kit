"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CopyButton } from "./CopyButton";

type CodeBlockProps = {
  code: string;
  /** Small caption shown in the panel header. */
  label?: string;
  /** Hide the label + copy row (use when copy lives outside the panel). */
  showHeader?: boolean;
  /** Clamp tall content to `collapsedHeight` behind a "show all" toggle. */
  collapsible?: boolean;
  collapsedHeight?: number;
  className?: string;
};

/**
 * A copyable code/text panel with an animated copy button (GSAP-powered icon
 * swap, optional collapse for long content.
 */
export function CodeBlock({
  code,
  label,
  showHeader = true,
  collapsible = false,
  collapsedHeight = 420,
  className = "",
}: CodeBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);

  const lineCount = code.split("\n").length;
  const overflows = fullHeight !== null && fullHeight > collapsedHeight + 24;

  // Measures the panel on mount, then animates between clamped and full height.
  useGSAP(
    () => {
      const el = scrollRef.current;
      if (!el || !collapsible) return;

      const measured = el.scrollHeight;

      if (isFirstRun.current) {
        isFirstRun.current = false;
        setFullHeight(measured);
        if (measured > collapsedHeight + 24) {
          gsap.set(el, { height: collapsedHeight });
        }
        return;
      }

      gsap.to(el, {
        height: expanded ? measured : collapsedHeight,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          if (expanded) gsap.set(el, { height: "auto" });
        },
      });
    },
    { scope: containerRef, dependencies: [expanded] }
  );

  return (
    <div ref={containerRef} className={`bg-foreground/4 ${className}`}>
      {showHeader && (
        <div className="flex items-center gap-3 px-4 py-2.5">
          {label && (
            <span className="text12 text-foreground/40">{label}</span>
          )}
          <CopyButton text={code} className="ml-auto" />
        </div>
      )}

      <div ref={scrollRef} className="overflow-hidden">
        <pre className={`overflow-x-auto whitespace-pre-wrap text12 text-foreground ${showHeader ? "px-4 pb-4" : ""}`}>
          {code}
        </pre>
      </div>

      {collapsible && overflows && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className={`mt-3 w-fit cursor-pointer bg-foreground/8 px-3 py-1.5 text12 text-foreground/60 ${showHeader ? "mx-4" : ""}`}
        >
          {expanded ? "Collapse" : `Show all ${lineCount} lines`}
        </button>
      )}
    </div>
  );
}
