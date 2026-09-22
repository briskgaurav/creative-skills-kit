---
name: creative-project-setup
description: >-
  Scaffolds a new creative Next.js project with optional GSAP, Lenis, Motion, Theatre.js,
  R3F/Three, Lottie, and CMS, then pulls fonts, type sizes, and colors from Figma. Use only
  when explicitly invoked with /creative-project-setup, or when the user asks to set up a new
  creative Next.js / studio site from a Figma file.
category: skill
disable-model-invocation: true
---

# Creative Project Setup

Interactive bootstrap for a new creative Next.js site. Ask first, then scaffold, then wire motion, type, and color.

Do not invent missing defaults. If a later list is still empty, ask.

## When this skill is incomplete

The user will lock more defaults over time. Until then:

1. Ask before assuming.
2. Prefer what is already written in **Locked defaults**.
3. Stop and ask when a **Later** item is required to continue.

## Workflow

Post this checklist **in the chat** at the start, and repost it updated after each step so the user can always see where they are.

```
Creative Project Setup
- [ ] 1. Confirm this is a new project folder (or empty enough to scaffold)
- [ ] 2. Ask setup questions (language, packages, CMS, type units)
- [ ] 3. Ask one by one: project name → Figma → font files
- [ ] 4. Scaffold Next.js
- [ ] 5. Install selected packages (+ CMS if chosen)
- [ ] 6. Set up Lenis if selected
- [ ] 7. Set up fonts from Figma + provided files (or manual fallback)
- [ ] 8. Pull type sizes from Figma (or manual fallback)
- [ ] 9. Pull colors from Figma (or manual fallback)
- [ ] 10. Write tokens into CSS / Tailwind theme
- [ ] 11. Verify the app boots
```

### 1. Confirm the folder

- If the folder already has a Next.js app, do **not** run `create-next-app` again.
- Offer: continue on this app (install + wire only) vs scaffold a sibling folder.

### 2. Ask setup questions

Everything here is asked with the structured question tool, in **two passes** (packages, then the rest — see *How to render this question* below). Do **not** include project name, Figma, or font files here — those are step 3, asked one at a time.

Required questions:

**Language** (single)

- TypeScript *(default)*
- JavaScript

Default if they skip: TypeScript.

**Packages** (multiple selection — they can pick any combination)

Offer each as its own selectable option, with its one-line purpose next to it. Never show a bare npm name with no explanation.

| # | Package | What it's for |
|---|---|---|
| 1 | `gsap` | Timeline animation engine + ScrollTrigger |
| 2 | `@gsap/react` | `useGSAP` hook, safe cleanup in React |
| 3 | `lenis/react` | Smooth scrolling |
| 4 | `motion` | React animation + gestures (`motion/react`) |
| 5 | `@theatre/core` | Keyframe animation runtime |
| 6 | `@theatre/studio` | Visual keyframe editor (dev-only overlay) |
| 7 | `@theatre/r3f` | Theatre bindings for 3D scenes |
| 8 | `@react-three/fiber` | React renderer for Three.js (r3f) |
| 9 | `three` | 3D engine |
| 10 | `@react-three/drei` | R3F helpers: controls, loaders, shaders |
| 11 | `@react-three/postprocessing` | Bloom, DOF, effect passes |
| 12 | `lottie-react` | Play Lottie / After Effects JSON |
| 13 | `howler` | Audio playback |
| 14 | `leva` | Debug GUI sliders for tuning values |
| 15 | `pixi.js` | 2D WebGL canvas |
| 16 | `matter-js` | 2D physics |

**How to render this question**

Packages are **selection-based**. Never print a numbered list and ask the user to type numbers.

The structured question tool caps at 4 options per question and 4 questions per call, so step 2 is **two passes**:

- **Pass A — Packages.** Four multi-select questions, four packages each, in this fixed order. Each option shows the npm name **and** its one-line purpose from the table above.
  - `Packages 1/4` → `gsap`, `@gsap/react`, `lenis/react`, `motion`
  - `Packages 2/4` → `@theatre/core`, `@theatre/studio`, `@theatre/r3f`, `@react-three/fiber`
  - `Packages 3/4` → `three`, `@react-three/drei`, `@react-three/postprocessing`, `lottie-react`
  - `Packages 4/4` → `howler`, `leva`, `pixi.js`, `matter-js`
- **Pass B — Language, Need a CMS?, which CMS, Type sizing.** One structured pass, four questions.

All 16 packages appear as selectable options every run, in the order above. The four groups exist only because of the widget's option cap — do not rename them into stacks or categories, do not trim the list, and do not drop a group because it looks unrelated to the project. Selecting nothing in a group is valid.

Install mapping:

| User picked | npm install |
|---|---|
| `gsap` | `gsap` |
| `@gsap/react` | `@gsap/react` **and** `gsap` (peer — install `gsap` even if they did not tick it) |
| `lenis/react` | `lenis` (import from `lenis/react`) |
| `motion` | `motion` (import from `motion/react`) |
| `@theatre/core` | `@theatre/core` |
| `@theatre/studio` | `@theatre/studio` **and** `@theatre/core` |
| `@theatre/r3f` | `@theatre/r3f` **and** `@theatre/core` |
| `@react-three/fiber` (r3f) | `@react-three/fiber` **and** `three` |
| `three` | `three` |
| `@react-three/drei` (drei) | `@react-three/drei` **and** `@react-three/fiber` **and** `three` |
| `@react-three/postprocessing` | `@react-three/postprocessing` **and** `@react-three/fiber` **and** `three` |
| `lottie-react` | `lottie-react` |
| `howler` | `howler` — if TypeScript, also `@types/howler` |
| `leva` | `leva` |
| `pixi.js` | `pixi.js` |
| `matter-js` | `matter-js` — if TypeScript, also `@types/matter-js` |

Do not install a package they did not select, except required peers in the table above. Deduplicate installs (one `three`, one `@react-three/fiber`, one `@theatre/core`, etc.).

3D packages are **install only** unless the user asks for a scene. Do not scaffold a Canvas / R3F scene by default. Same for Motion, Theatre, Lottie, Howler, Leva, Pixi, and Matter — install only, no demo wiring, unless asked.

**Need a CMS?** (single)

- Yes
- No

**Which CMS** (single) — asked in the same pass, right after *Need a CMS?*. Because both questions are on screen at once, this one must carry an explicit escape hatch for anyone who just answered **No**:

- Payload
- Sanity
- Skip this step — no CMS needed

Treat **Skip this step** exactly like *Need a CMS? → No*. If the two answers disagree (*No* plus a CMS pick, or *Yes* plus *Skip*), the answer that means **no CMS wins** — do not re-ask to resolve it, just continue without a CMS.

Do not install Payload or Sanity unless they said Yes **and** picked Payload or Sanity.

**Type sizing** (single)

- `rem` *(default)* — sizes stay tied to root font size
- Fluid `vw` — sizes scale with viewport width (creative/Figma-style)

Default if they skip: `rem`. Values must be **only** `rem` or `vw` — no `px`, no `clamp()`.

### 3. Collect project name, Figma, fonts — one at a time

Ask these **one by one**. Wait for the answer before the next question. Never batch them in one message, one form, or one structured-question pass.

Each ask is one short question plus an example of an accepted answer — nothing else.

**3a. Project name** (first)

Ask: what is the project name?

> e.g. `atlas-studio`, `Nova Films`

Use it for `package.json` / site `title` / `description`, and as the folder name if scaffolding a new app. Do not invent a name from the current folder unless they skip.

**3b. Figma file** (second, after they answer 3a)

Ask them to drop / attach / paste the **Figma file** (link, file key, or pick via Figma MCP).

> e.g. `https://figma.com/design/AbC123.../Studio-Site`, or the file key `AbC123...`, or attach the file

Do **not** ask the user to name font families yet. Fonts come from Figma when MCP works.

If Figma MCP is missing or needs auth: tell them to connect it, wait, then retry. If it still fails, go to **Figma fallback** (below) instead of inventing tokens.

**3c. Font files** (third, after they answer 3b)

Ask for the **location of font files** (folder path, or drop `.woff2` / `.woff` / `.ttf` / `.otf`).

> e.g. `./fonts`, `D:\Assets\Suisse`, or drop the files here

Skip 3c only if Figma already resolved every family as Google Fonts (no local files needed). If Figma named a custom / desktop font, 3c is required. Do not substitute Inter/Arial.

Then (when Figma succeeded):

- Read family names from Figma text styles.
- If a family is on Google Fonts, load it with `next/font/google` (AI can do this without local files).
- If it is a custom / desktop font, use the files they provided with `next/font/local`.

### 4. Scaffold Next.js

**Recap first.** Before the first long-running command, print one short block and wait for a yes:

```
Ready to set up:
  Project      atlas-studio
  Folder       D:\Codes\atlas-studio (new)
  Language     TypeScript
  Packages     gsap, @gsap/react, lenis/react  (+ peers: —)
  CMS          Sanity
  Type units   rem
  Figma        Studio-Site (read OK)
Proceed?
```

List peers explicitly so nothing installed is a surprise. If they change something, update and re-print — do not re-run step 2 or 3.

Then use the current `create-next-app` defaults that match the answers:

- App Router
- chosen language
- Tailwind CSS
- no extra opinionated UI kit unless the user asked

If they already have an app, skip this step.

### 5. Install selected packages

Install only what step 2 selected, plus the CMS if chosen.

**CMS extras (only if picked)**

- Payload → official Payload Next.js install path for the current Next version. Do not invent a partial Payload setup.
- Sanity → official `next-sanity` / Sanity studio path. Do not invent a partial Sanity setup.

Pin to current major versions.

### 6. Set up Lenis (only if `lenis/react` was selected)

Put the wrapper in `src/animations/` — motion code, not a generic util.

| Language | Path |
|---|---|
| JavaScript | `src/animations/LenisSmoothScroll.jsx` |
| TypeScript | `src/animations/LenisSmoothScroll.tsx` |

- Wrap frontend `layout` children with `<LenisSmoothScroll>`.
- If `gsap` is also selected, copy the **GSAP + Lenis** file below verbatim (only add types for `.tsx`).
- If Lenis is selected **without** GSAP, use the same `ReactLenis` options but drop GSAP imports, `ScrollTrigger`, the ticker `useEffect`, and set `autoRaf: true` (omit `autoRaf: false`).

Do not rewrite the Lenis API unless the installed `lenis` version requires it. If `lenis/react` was not selected, skip this step.

**GSAP + Lenis (canonical):**

```jsx
"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

const LenisSmoothScroll = ({
  children,
  duration = 1.5,
  lerp = 0.075,
  smoothWheel = true,
  wheelMultiplier = 0.8,
  touchMultiplier = 0.9,
}) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    function update(time) {
      const lenis = lenisRef.current?.lenis;
      if (!lenis) return;
      lenis.raf(time * 1000);
      ScrollTrigger.update();
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        duration,
        lerp,
        smoothWheel,
        smoothTouch: true,
        syncTouch: true,
        wheelMultiplier,
        touchMultiplier,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
      ref={lenisRef}
    >
      {children}
    </ReactLenis>
  );
};

export default LenisSmoothScroll;
```

### 7. Set up fonts

1. Families = names from Figma, not guessed — unless **Figma fallback** already collected them from the user.
2. Load Google fonts with `next/font/google`; load provided files with `next/font/local`.
3. Expose them as CSS variables on `<html>`.
4. Map them in Tailwind `@theme` (`--font-sans`, extra display fonts as needed).

If Figma did not yield family names, stop and run **Figma fallback → Fonts**. Do not leave Geist/Inter/Arial in place.

### 8. Type sizes from Figma

Use Figma MCP. Do not guess type scale.

Name every size from the Figma **pixel** value: `--text160`, `--text120`, `--text64`, `--text24`. One unique px size → one variable. Do not use `--text-h1` / `--text-display`.

Units: **only** `rem` or `vw` (whatever they picked in step 2). No `px`. No `clamp()`.

1. Collect unique font sizes from the file (round to nearest px for the name).
2. `rem`: `--text160: 10rem;` because `160 / 16 = 10`.
3. `vw`: ask frame width if unclear (usually 1440 or 1920). `--text160: 11.1111vw;` because `(160 / 1440) * 100`.
4. Write every unique size, not a guessed heading scale.

```css
:root {
  --text160: 10rem;
  --text120: 7.5rem;
  --text64: 4rem;
  --text24: 1.5rem;
}

@theme inline {
  --text-160: var(--text160);
  --text-120: var(--text120);
  --text-64: var(--text64);
  --text-24: var(--text24);
}
```

Use as `text-160` in className, or `var(--text160)` in CSS. Values in the example are `rem`; swap to `vw` if they chose fluid.

If Figma MCP fails, times out, hits a tool-call / View-seat limit, returns a dump too large to read, or yields no sizes: do **not** fake sizes and do **not** leave a `PENDING` comment. Stop and run **Figma fallback → Type sizes**.

### 9. Colors from Figma

Use Figma MCP. Do not invent a palette.

1. Prefer color styles / variables from the file.
2. If none exist, sample from the selected frame (background, text, accent).
3. Write semantic CSS variables, not raw Figma names dumped into the UI.

Minimum tokens:

```css
--background: ...;
--foreground: ...;
--primary: ...;
```

Add extra tokens only when Figma has them (muted, border, inverse, etc.).

Map into Tailwind v4 `@theme inline` as `--color-background`, `--color-foreground`, `--color-primary`.

If Figma MCP fails, times out, hits a tool-call / View-seat limit, or yields no palette: do **not** invent colors and do **not** leave default black/white. Stop and run **Figma fallback → Colors**.

**Echo what Figma gave you** — print this before step 10 writes anything, so the user can check it against the file:

```
From Figma (Studio-Site):
  Fonts    Suisse Int'l (local) · Instrument Serif (Google)
  Colors   --background #0B0B0B · --foreground #F2F0EB · --primary #FF4A1C
  Sizes    160, 120, 64, 24  →  rem  (10, 7.5, 4, 1.5)
  Frame    1440
```

Say plainly which pieces came from Figma and which came from their answers. If anything looks wrong to them, fix it here — not after it is baked into `globals.css`.

### Figma fallback (when fetch fails)

Use this when Figma MCP is missing, needs auth and retry still fails, hits a rate / tool-call limit, returns unreadable dumps, or only partially succeeds (e.g. colors yes, sizes no).

Say what failed in one plain line ("Figma returned the colors but not the text styles") — no internal error dumps, no tool jargon.

Keep whatever Figma **did** return. Ask **only** for the missing pieces, **one at a time**, waiting for each answer. Never ask fonts + colors + sizes in the same message.

Order — skip a step if that piece already succeeded:

**1. Fonts**

Ask for family names **and** file locations (folder path, or drop `.woff2` / `.woff` / `.ttf` / `.otf`). Google Fonts may be family name only. Do not guess names.

**2. Colors**

After fonts are answered, ask for hex (or Figma token) values. Minimum: `--background`, `--foreground`, `--primary`. Extra tokens only if they paste them.

**3. Type sizes**

After colors are answered, ask for the unique **pixel** sizes from the design (e.g. `160, 120, 64, 24`). Convert with the step 2 unit (`rem` or `vw`) and name them `--text{px}`. If they chose `vw` and frame width is unknown, ask for frame width in this same size step (1440 or 1920 typical) — still one wait, then write tokens.

Do not continue scaffolding tokens until the missing piece is answered.

### 10. Write tokens

- Put color + type tokens in `globals.css`.
- Keep `:root` for raw values and `@theme inline` for Tailwind.
- Do not leave `Arial, Helvetica, sans-serif` as the body font after fonts are loaded.

### 11. Verify

- Install succeeded.
- App starts (`npm run dev` or equivalent).
- Lenis lives at `src/animations/LenisSmoothScroll` and is in the layout only if Lenis was selected.
- Tokens exist in CSS.
- CMS admin / studio is reachable only if a CMS was selected.
- If verification tools are available, open the homepage and check it renders.

**Then stop the dev server you started.** Next.js 16 allows only one dev server per
project directory, enforced by a lock file at `.next/dev/lock` — not by the port. A
server left running makes the user's own `npm run dev` fail with
`⨯ Another next dev server is already running.`, and the PID in that message is often
stale, so the `taskkill` it suggests does nothing.

Tear down what you started, in this order:

1. Kill the whole process tree, not just the listener. `npm run dev` spawns an
   `npm-cli.js` shell → a `next dev` wrapper → a `start-server.js` child that actually
   holds the port. Killing only the child leaves the parents alive and the lock held.
   - Windows: `taskkill /PID <npm-pid> /T /F`
   - macOS / Linux: `kill -- -<npm-pgid>`
2. Confirm the port is free (`netstat -ano | grep :3000`, or `lsof -i :3000`).
3. If `.next/dev/lock` still exists, delete it — a force-killed server does not clean
   up its own lock, and the stale file alone will block the next start.

If you deliberately leave the server running instead, do not print the `Dev` line below
as-is. Say it is already up, with the real port and PID:
`Dev  already running → http://localhost:3000 (PID 22308, ctrl+c to stop)`

Finish with one block — what exists, and what was deliberately not done:

```
atlas-studio is ready.
  Dev        npm run dev → http://localhost:3000
  Studio     http://localhost:3000/studio
  Fonts      src/app/layout.tsx  (Suisse Int'l, Instrument Serif)
  Tokens     src/app/globals.css (3 colors, 4 sizes)
  Lenis      src/animations/LenisSmoothScroll.tsx (wrapped in layout)
  Installed  gsap, @gsap/react, lenis, next-sanity
  Not done   no 3D scene, no page transitions — ask when you want them wired
```

Only list what is actually true for this run. Skip any line that does not apply.

## Locked defaults

Update this block as the user decides things. Agent must treat this as source of truth.

- Skill invoke: `/creative-project-setup`
- Scope: user-global (Cursor + Claude), not project-specific
- Next.js: App Router, Tailwind v4
- Language default: TypeScript
- Packages: asked every time (multi-select: `gsap`, `@gsap/react`, `lenis/react`, `motion`, `@theatre/core`, `@theatre/studio`, `@theatre/r3f`, `@react-three/fiber`, `three`, `@react-three/drei`, `@react-three/postprocessing`, `lottie-react`, `howler`, `leva`, `pixi.js`, `matter-js`)
- Packages question: selection-based — 4 multi-select questions × 4 options in the structured question tool, all 16 packages every run, each with its purpose line; never a typed numbered list
- Checklist: posted in chat and reposted updated after each step
- Recap + confirm before scaffolding / installing; peers listed explicitly
- Figma summary echoed before tokens are written; final summary block at the end
- Fonts: from Figma + user-provided files (never guessed names)
- Color tokens: `--background`, `--foreground`, `--primary`
- CMS: asked every time (No, or Yes → Payload / Sanity / Skip this step — no CMS needed)
- Type sizing: asked every time (`rem` or fluid `vw`)
- Type token names: `--text{px}` (`--text160`, `--text120`) — units `rem` or `vw` only
- Lenis file: `src/animations/LenisSmoothScroll.jsx` / `.tsx`
- Figma file: user drops it each run
- Sequential collect: project name, then Figma, then font files — never in one batch
- Figma failure: ask missing fonts, then colors, then type sizes — one at a time; no invented tokens, no `PENDING` placeholders

## Later

User will list more here. Until filled, ask.

- Extra npm packages beyond the motion + R3F options
- Folder conventions for sections/components (animations folder is already locked)
- Default Figma file if they always use the same one
- ScrollTrigger / page-transition defaults
- Wiring for Motion / Theatre / Lottie / Howler / Leva / Pixi / Matter (currently install-only)

## Rules

- Step 2 is two structured passes: packages (4 multi-select questions × 4 options), then language + CMS + which CMS + type units. Never ask the user to type package numbers or names.
- Step 3 is **not** that pass. Ask **project name**, then **Figma**, then **font files** — one question, wait, next. Never combine those three.
- If Figma fetch fails for fonts, colors, or sizes: ask the missing pieces **one by one** (fonts → colors → sizes). Never batch the fallback. Never invent. Never leave `PENDING` comments.
- Never overwrite an existing Next app with `create-next-app`.
- Never skip Figma MCP and hardcode type/color "from typical creative sites".
- Never invent font names. Wait for Figma, font files, or the fallback answers.
- Never name type tokens semantically (`--text-h1`). Always `--text{px}`.
- Never use `px` or `clamp()` in type tokens — `rem` or `vw` only.
- Never show a package as a bare npm name with no purpose line.
- Never start a long-running install or scaffold before the recap is confirmed.
- Never put custom skills in `~/.cursor/skills-cursor/`.
- This skill is user-global. Install it with
  `npx skills add briskgaurav/creative-skills-kit --skill creative-project-setup -g`,
  which symlinks one canonical copy into every selected agent — edit the source
  in the repo, not the installed copies.
  - Cursor global: `~/.cursor/skills/creative-project-setup/`
  - Claude global: `~/.claude/skills/creative-project-setup/`
  - In a *project* install, Cursor reads `.agents/skills/`, not `.cursor/skills/`.
