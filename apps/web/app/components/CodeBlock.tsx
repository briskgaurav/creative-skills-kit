"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Check, Copy } from "lucide-react";

type CodeBlockProps = {
  code: string;
  /** Small caption shown in the panel header. */
  label?: string;
  /** Clamp tall content to `collapsedHeight` behind a "show all" toggle. */
  collapsible?: boolean;
  collapsedHeight?: number;
  className?: string;
};

/** Copies text via the async Clipboard API, falling back to a hidden textarea + execCommand. */
async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to the legacy fallback below
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(textarea);
  return ok;
}

/**
 * A copyable code/text panel with an animated copy button (GSAP-powered icon
 * swap, optional collapse for long content.
 */
export function CodeBlock({
  code,
  label,
  collapsible = false,
  collapsedHeight = 420,
  className = "",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const copyIconRef = useRef<SVGSVGElement>(null);
  const checkIconRef = useRef<SVGSVGElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isFirstRun = useRef(true);

  const lineCount = code.split("\n").length;
  const overflows = fullHeight !== null && fullHeight > collapsedHeight + 24;

  useGSAP(
    () => {
      gsap.set(checkIconRef.current, { scale: 0, opacity: 0 });
    },
    { scope: containerRef }
  );

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

  const handleCopy = async () => {
    const ok = await copyToClipboard(code);
    if (!ok) return;

    setCopied(true);
    timelineRef.current?.kill();

    timelineRef.current = gsap
      .timeline({ onComplete: () => setCopied(false) })
      .to(buttonRef.current, { scale: 0.88, duration: 0.09, ease: "power1.out" })
      .to(buttonRef.current, { scale: 1, duration: 0.3, ease: "back.out(3)" })
      .to(copyIconRef.current, { scale: 0, opacity: 0, duration: 0.15, ease: "power1.in" }, "<")
      .to(checkIconRef.current, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(4)" }, "<0.05")
      .to(checkIconRef.current, { scale: 0, opacity: 0, duration: 0.15, delay: 0.9 }, "<")
      .to(copyIconRef.current, { scale: 1, opacity: 1, duration: 0.2 }, "<0.05");
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden  border border-foreground/20  ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-foreground/20 px-4 py-2">
        {label && (
          <span className="font-mono text-text12 text-foreground/60">{label}</span>
        )}
        <button
          ref={buttonRef}
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
          className="relative ml-auto flex size-7 items-center justify-center  text-foreground/60 cursor-pointer hover:text-foreground"
        >
          <Copy ref={copyIconRef} className="absolute size-3.5" aria-hidden="true" />
          <Check ref={checkIconRef} className="absolute size-3.5" aria-hidden="true" />
        </button>
      </div>

      <div ref={scrollRef} className="overflow-hidden">
        <pre className="overflow-x-auto whitespace-pre-wrap px-4 py-3.5 font-mono text-text12 text-foreground">
          {code}
        </pre>
      </div>

      {collapsible && overflows && (
        <div
          className={`absolute inset-x-0 bottom-0 flex justify-center pb-3 ${
            expanded ? "" : "bg-linear-to-t from-background to-transparent pt-10"
          }`}
        >
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="border cursor-pointer border-foreground/20 bg-background px-3 py-2 text-text12 text-foreground/60 hover:text-foreground"
          >
            {expanded ? "Collapse" : `Show all ${lineCount} lines`}
          </button>
        </div>
      )}
    </div>
  );
}
