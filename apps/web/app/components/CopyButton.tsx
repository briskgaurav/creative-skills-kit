"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Check, Copy } from "lucide-react";

type CopyButtonProps = {
  text: string;
  className?: string;
};

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

export function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const copyIconRef = useRef<SVGSVGElement>(null);
  const checkIconRef = useRef<SVGSVGElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      gsap.set(checkIconRef.current, { scale: 0, opacity: 0 });
    },
    { scope: buttonRef }
  );

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
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
    <button
      ref={buttonRef}
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
      className={`relative flex size-7 items-center justify-center text-foreground/40 cursor-pointer hover:text-emerald-500 ${className}`}
    >
      <Copy ref={copyIconRef} className="absolute size-3.5" aria-hidden="true" />
      <Check ref={checkIconRef} className="absolute size-3.5" aria-hidden="true" />
    </button>
  );
}
