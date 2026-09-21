"use client";

import { useEffect, useId, useRef } from "react";
import gsap from "gsap";

type ThemeToggleIconProps = {
  isDark: boolean;
};

const RAY_COUNT = 8;
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

// Sun: core centered, full radius, mask parked off-canvas (no clipping).
const SUN = { cx: 12, cy: 12, r: 5, maskCx: 26, maskCy: 6, maskR: 5.5 };
// Moon: core shifts up-right, mask circle overlaps its top-right edge to
// bite a crescent out of it.
const MOON = { cx: 13, cy: 11, r: 6, maskCx: 17.2, maskCy: 6.8, maskR: 5.5 };

export function ThemeToggleIcon({ isDark }: ThemeToggleIconProps) {
  const maskId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const coreRef = useRef<SVGCircleElement>(null);
  const maskCircleRef = useRef<SVGCircleElement>(null);
  const raysRef = useRef<SVGGElement>(null);
  const isFirstRun = useRef(true);
  const rotation = useRef(0);

  // Initial geometry matches `isDark` so the first paint (SSR and pre-effect)
  // already shows the right shape — the effect below only animates changes
  // after that, instead of snapping sun -> moon post-mount.
  const initial = isDark ? MOON : SUN;

  useEffect(() => {
    const svg = svgRef.current;
    const core = coreRef.current;
    const maskCircle = maskCircleRef.current;
    const rays = raysRef.current;
    if (!svg || !core || !maskCircle || !rays) return;

    const target = isDark ? MOON : SUN;
    const duration = isFirstRun.current ? 0 : 0.7;

    rotation.current += 360;

    const tl = gsap.timeline({ defaults: { duration, ease: EASE } });

    tl.to(
      svg,
      { rotate: rotation.current, transformOrigin: "50% 50%" },
      0
    )
      .to(core, { attr: { cx: target.cx, cy: target.cy, r: target.r } }, 0)
      .to(
        maskCircle,
        { attr: { cx: target.maskCx, cy: target.maskCy, r: target.maskR } },
        0
      )
      .to(
        Array.from(rays.children),
        {
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1,
          duration: duration * 0.7,
          stagger: isDark ? 0.015 : 0.03,
          transformOrigin: "12px 12px",
          svgOrigin: "12 12",
        },
        0
      );

    isFirstRun.current = false;
  }, [isDark]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <mask id={maskId} maskUnits="userSpaceOnUse">
        <rect x="0" y="0" width="24" height="24" fill="white" />
        <circle
          ref={maskCircleRef}
          cx={initial.maskCx}
          cy={initial.maskCy}
          r={initial.maskR}
          fill="black"
        />
      </mask>

      <circle
        ref={coreRef}
        cx={initial.cx}
        cy={initial.cy}
        r={initial.r}
        fill="currentColor"
        mask={`url(#${maskId})`}
      />

      <g
        ref={raysRef}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={
          isDark
            ? { opacity: 0, transform: "scale(0)", transformOrigin: "12px 12px" }
            : undefined
        }
      >
        {Array.from({ length: RAY_COUNT }).map((_, i) => {
          const angle = (i / RAY_COUNT) * Math.PI * 2;
          const inner = 8;
          const outer = 10.5;
          const x1 = 12 + Math.cos(angle) * inner;
          const y1 = 12 + Math.sin(angle) * inner;
          const x2 = 12 + Math.cos(angle) * outer;
          const y2 = 12 + Math.sin(angle) * outer;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
    </svg>
  );
}
