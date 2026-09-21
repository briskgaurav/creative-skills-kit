"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CodeBlock } from "./CodeBlock";
import { SegmentedToggle } from "./SegmentedToggle";

type Ide = {
  label: string;
  /** --dir path used for a global (user-wide) install. */
  globalDir: string;
  /** --dir path used for a project-local install, or undefined for the CLI default. */
  projectDir?: string;
};

const IDES: Ide[] = [
  {
    label: "Claude",
    globalDir: "~/.claude/skills",
  },
  {
    label: "Cursor",
    globalDir: "~/.cursor/skills",
    projectDir: ".agents/skills",
  },
  {
    label: "Other",
    globalDir: "<path-to-your-agent's-global-skills-dir>",
    projectDir: "<path-to-your-agent's-project-skills-dir>",
  },
];

const SCOPES = ["Global", "This project"];

export function InstallCommand({ slug }: { slug: string }) {
  const [ideIndex, setIdeIndex] = useState(0);
  const [scopeIndex, setScopeIndex] = useState(0);

  const ide = IDES[ideIndex];
  const isGlobal = scopeIndex === 0;

  const dir = isGlobal ? ide.globalDir : ide.projectDir;
  const code = dir
    ? `npx creative-skills-kit install ${slug} --dir ${dir}`
    : `npx creative-skills-kit install ${slug}`;

  const belowRef = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);

  // Smoothly resizes the region below the toggles instead of snapping —
  // the command's length changes with the selected IDE/scope.
  useGSAP(
    () => {
      const el = belowRef.current;
      if (!el) return;

      const measured = el.scrollHeight;

      if (isFirstRun.current) {
        isFirstRun.current = false;
        gsap.set(el, { height: measured });
        return;
      }

      gsap.to(el, {
        height: measured,
        duration: 0.35,
        ease: "power2.inOut",
      });
    },
    { dependencies: [code] }
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <SegmentedToggle options={IDES.map((i) => i.label)} value={ideIndex} onChange={setIdeIndex} />
        <SegmentedToggle options={SCOPES} value={scopeIndex} onChange={setScopeIndex} />
      </div>

      <div ref={belowRef} className="overflow-hidden">
        <CodeBlock label="terminal" code={code} />
      </div>
    </div>
  );
}
