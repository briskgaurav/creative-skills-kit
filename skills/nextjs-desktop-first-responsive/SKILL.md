---
name: nextjs-desktop-first-responsive
description: >-
  Makes a Next.js UI responsive with a strict desktop-first process: desktop
  first, then tablet with max-md, then mobile with max-sm. Only two breakpoints,
  md 1025px and sm 768px. Custom global classes (type, color, and any other
  property they already set) are adjusted in globals media queries, never
  overridden on the element. Use when the user asks to make a Next.js page,
  section, or component responsive, or invokes /nextjs-desktop-first-responsive. One section
  at a time: tablet and mobile, then wait for approval before the next section.
  Must not change the desktop UI at viewport >= 1025px. Works as a global skill
  or a project-local skill.
category: workflow
---

# Next.js Desktop First Responsive

Desktop first. Then tablet. Then mobile. One section at a time. Follow this process exactly.

Do not invent a different breakpoint system. Do not ship a responsive pass you do not understand.

## Desktop is frozen

This skill must not change the desktop UI. Not one pixel.

At viewport width `>= 1025px`, the page must render exactly as it did before this skill ran. If a change would show at that width, do not make it.

The only allowed edits:

- Append `max-md:` and `max-sm:` utilities to an existing `className`.
- Add `@media (width < 1025px)` and `@media (width < 768px)` blocks. Leave every declaration outside those queries exactly as it is.
- After the user agrees to a split file, add `max-md:hidden` on the desktop component and a sibling that is `hidden` until `max-md`. That sibling must not be visible at `>= 1025px`.

Forbidden, including "harmless" cleanups:

- Editing, removing, reordering, or reformatting unprefixed classes.
- Editing any class that applies at `>= 1025px` (`sm:`, `md:`, `lg:`, `xl:`, and any other min-width variant).
- Changing desktop copy, tags, DOM order, or wrappers.
- Changing a desktop declaration in globals — the rule body outside the media queries.
- Changing `@theme` tokens the desktop already uses (color, type, spacing, font, existing breakpoints).
- Fixing, aligning, or restyling desktop while doing the responsive pass.

If a section cannot become responsive without touching desktop, stop and ask. Do not touch desktop to make the responsive pass easier.

## Checklist

Post this in chat at the start, and repost it updated after each section.

```
Next.js desktop-first responsive
- [ ] 1. Read globals and how this project styles elements
- [ ] 2. Lock breakpoints only if desktop (>= 1025px) stays identical
- [ ] 3. List sections in page order, then edit only the first
- [ ] 4. That section only: max-md, then max-sm. Desktop untouched.
- [ ] 5. Stop and ask for review
- [ ] 6. Approved → next section. Changes → this section only. Then ask again.
```

## Breakpoints

These two, and no others:

```css
--breakpoint-md: 1025px;
--breakpoint-sm: 768px;
```

| Range | Width | What you write |
|---|---|---|
| Desktop | `>= 1025px` | Unprefixed classes. No breakpoint variant. |
| Tablet | `< 1025px` | `max-md:` or `@media (width < 1025px)` |
| Mobile | `< 768px` | `max-sm:` or `@media (width < 768px)` |

`max-md` already includes mobile. `max-sm` is the extra pass on top of tablet. Mobile and tablet stay almost the same: mobile only changes gaps, padding, font sizes, and spacing.

Put the two variables in the project's existing `@theme` / `@theme inline` block. If there is no `@theme` block, add one. Tailwind v3: set `sm: "768px"` and `md: "1025px"` in `theme.screens` without deleting screens this task is not touching.

If `--breakpoint-sm` or `--breakpoint-md` already exist at different pixel values, stop and ask before replacing them. Show the current values and these two. Do not overwrite silently.

Do not add or change these variables when that would change any style at `>= 1025px`. Do not change any other `@theme` token. Do not clear other breakpoint tokens (`lg`, `xl`, …). Do not *use* them.

Vanilla media queries must use the same cutoffs as the variants, or they will disagree by 1px:

```css
@media (width < 1025px) { }
@media (width < 768px) { }
```

`width < 1025px` matches `max-md`. `width < 768px` matches `max-sm`. Do not write `max-width: 1025px` or `max-width: 768px`.

## Only two variants

On every section this skill touches, the only variants you may add are `max-md` and `max-sm`.

Do not add `sm:`, `md:`, `lg:`, `xl:`, `2xl:`, `min-*`, `max-lg:`, `max-xl:`, `max-[768px]:`, container queries, or any other breakpoint.

Do not remove or rewrite a variant that already applies at `>= 1025px`. Leaving an existing `lg:` in place is required when deleting it would move desktop. A variant that applies only below `1025px` may be replaced with `max-md` / `max-sm` inside the current section, and only when the `>= 1025px` render stays identical.

## One section at a time

Never responsive a whole page in one step. A request to "make the page responsive" is a queue of sections, not permission to edit them all.

1. Name the sections in page order, then implement only the first. Inside it: tablet (`max-md` / `width < 1025px`), then mobile (`max-sm` / `width < 768px`). Desktop stays byte-for-byte except appended `max-md:` / `max-sm:` classes and media queries that do not apply at `>= 1025px`.
2. Stop. Post the review block below. Do not open the next section in the same turn. Do not start it in the background.

```
Section ready for review: Hero
  Tablet    max-md — what changed
  Mobile    max-sm — what changed
  Desktop   unchanged (>= 1025px)
Approve this section?
```

3. Wait for the user.
   - **Approved** → the next section only, then this same review. One section per turn.
   - **Changes** → edit that same section only, then ask again. Do not advance.
   - **Skip** → revert that section's responsive edits, then wait before the following one.

Skip a variant when the value does not change. Do not write `max-md` or `max-sm` that repeat the desktop value.

Do not jump to mobile before tablet inside the section. Do not build mobile-first (`sm:` / `md:` min-width). Do not batch sections to save turns.

## Before editing

Read the global stylesheet (`app/globals.css`, `src/app/globals.css`, or whatever this project uses) and the section you are about to touch.

Decide per property, from how desktop is already written:

- Desktop value comes from a **custom class** in globals (`.text22`, a color class, anything else defined there) → responsive goes in that class's media queries. The JSX class list stays the same.
- Desktop value is a **Tailwind utility** on the element → responsive is `max-md:` / `max-sm:` on that element.
- Desktop value is in a **CSS module or component CSS file** → media queries in that file, at `width < 1025px` and `width < 768px`.
- A shared font size or color is missing from globals and should be a class → you may add that class. Font sizes and colors only. Then responsive it in globals.

Do not convert a vanilla project to Tailwind, or a Tailwind project to vanilla, as part of making it responsive.

## Global classes

If the element uses a custom class from globals, add the responsive value in media queries on that class. Do not override it in JSX. Do not edit the desktop declarations in that class.

Wrong:

```jsx
<p className="text22 max-md:text-[22vw]! max-sm:text-[5vw]">HELLO TEST</p>
```

Right — JSX stays `className="text22"`. Globals:

```css
.text22 {
  font-size: 1.5vw;
}

@media (width < 1025px) {
  .text22 {
    font-size: 4vw;
  }
}

@media (width < 768px) {
  .text22 {
    font-size: 5vw;
  }
}
```

This is not only font size. Color, letter-spacing, line-height, or any other property that custom class already owns is changed in the same media queries. Never stack a utility, `!`, or arbitrary value on the element to beat the class.

One source of truth per property. Do not set it in globals and again with `max-md:` / `max-sm:`.

New classes in globals are allowed only when globals do not already have a class for that font size or color. New classes are font sizes and colors only. No layout, spacing, gap, or component classes in globals.

Do not add a global class for a one-off. Do not add a media query that sets the same value the desktop rule already has.

## Spacing and layout

If desktop lays a section out with flex plus `gap`, `space-x`, or `space-y`:

- Keep flex. Do not switch that section to grid.
- Keep grid if desktop is already grid. Do not switch it to flex either.
- Do not replace those gaps with margin or padding.
- Change the same utility, at the same kind of value: `gap-[2vw]`, `max-md:gap-[4vw]`, `max-sm:space-y-[5vw]`.

Stacking a row is still flex: `max-md:flex-col` is fine. `max-md:grid` is not, when desktop is flex.

Padding and margin that are already real inset or section offset on desktop stay padding and margin. Give them responsive variants of the same value type. The ban is using margin or padding *instead of* `gap` / `space-x` / `space-y`.

## Value types

Match the desktop value type **per property**. Do not convert units while making it responsive.

| Desktop | Responsive |
|---|---|
| Tailwind scale: `p-10`, `gap-6`, `text-lg`, `w-full` | Tailwind scale: `max-md:p-6`, `max-sm:gap-4` |
| Arbitrary `vw`: `p-[10vw]`, `gap-[2vw]` | Arbitrary `vw`: `max-md:p-[6vw]`, `max-sm:gap-[4vw]` |
| Arbitrary `rem`: `p-[2rem]` | Arbitrary `rem`: `max-md:p-[1.5rem]` |
| Arbitrary `px`: `gap-[24px]` | Arbitrary `px`: `max-md:gap-[16px]` |

`p-10` must not become `max-md:p-[4vw]`. `p-[10vw]` must not become `max-md:p-6` or `max-md:p-[2rem]`.

If one element mixes types (`gap-[2vw] p-10`), each property keeps its own type.

The same rule applies inside vanilla media queries. A desktop `font-size: 1.5vw` stays `vw` at both breakpoints. A desktop `padding: 2rem` stays `rem`.

## What mobile is allowed to change

Tablet (`max-md` / `width < 1025px`) is where layout changes: stack, widths, wrapping, what is hidden.

Mobile (`max-sm` / `width < 768px`) is a tighter pass on that tablet layout: gaps, padding, font sizes, spacing. Do not build a third layout at `max-sm` unless the tablet layout actually breaks on a narrow screen. If it breaks, fix spacing and type first. If the structure itself cannot work, treat it as a complex section and ask.

## Complex sections

If a section is too complex to make responsive in the same component, stop on that section. Do not hack it.

Too complex means: tablet needs a different DOM than desktop, you would be rewriting the section, or you do not understand how it is built. Stacking flex, changing gaps, hiding a decorative piece — those are not too complex. When unsure, ask. Do not guess.

Ask with the structured question tool when it exists. Otherwise ask in chat. This ask replaces the review block for that section. Wait for the answer. Do not edit the section, and do not start the next one, until they pick.

Options, in this order:

1. **Create `{Name}Responsive.{jsx|tsx}`** — same directory, same extension as the desktop file. `Hero.tsx` → `HeroResponsive.tsx`. `Hero.jsx` → `HeroResponsive.jsx`.
2. **Skip this section** — leave it untouched. The user will do it manually.

Only create the second file after they pick option 1. If they skip, do not change that section at all. Continue with the other sections.

When they pick the split file:

- Desktop file stays the desktop UI. At the usage site: `max-md:hidden`.
- Responsive file is hidden on desktop and shown from tablet down: `hidden max-md:block` or `hidden max-md:flex`, matching the desktop root's display.
- Do not use `md:hidden` or `md:block`. Those are min-width variants.
- Inside the responsive file, unprefixed classes are the tablet layout (this file is not on screen at desktop). `max-sm:` is the mobile pass. Do not also invent a desktop layout in that file.
- Pass the same props through so the parent can render both.

```tsx
<Hero className="max-md:hidden" />
<HeroResponsive className="hidden max-md:flex" />
```

## Animation

Only for a GSAP animation that already belongs to the section you are making responsive.

If the desktop tween still reads correctly at tablet and mobile, leave it. Do not add `gsap.matchMedia`. Do not add GSAP to a section that does not have it.

Add `gsap.matchMedia` only when the motion itself must change (distance, trigger, or it must not run). Layout and spacing stay in CSS.

Breakpoints, non-overlapping:

| Range | Condition |
|---|---|
| Desktop | `(min-width: 1025px)` |
| Tablet only | `(max-width: 1024px) and (min-width: 768px)` |
| Mobile only | `(max-width: 767px)` |
| Tablet and mobile, same motion | `(max-width: 1024px)` — do not also add the mobile query |

`(max-width: 1024px)` and `(max-width: 767px)` both match a phone. GSAP runs every matching callback. If tablet and mobile differ, use the non-overlapping rows. If they share one animation, use a single `(max-width: 1024px)` callback.

Create tweens and ScrollTriggers inside the matching callback so `matchMedia` can revert them. Clean up with `mm.revert()`.

```jsx
useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 1025px)", () => {
    gsap.to(".hero-title", { y: 80 });
  });

  mm.add("(max-width: 1024px)", () => {
    gsap.to(".hero-title", { y: 24 });
  });

  return () => mm.revert();
});
```

If both a desktop component and a `*Responsive` component stay mounted, each animation must run only in the range where its component is visible. A tween on `display: none` will measure the wrong box.

## Do not

- Do not change the desktop UI. Not one pixel at `>= 1025px`.
- Do not responsive more than the current section before the user approves it.
- Do not write new copy, sections, or comments to explain the responsive pass.
- Do not add wrappers except the split-file pair the user agreed to.
- Do not create global classes other than missing font-size or color classes.
- Do not override a global class from JSX.
- Do not edit a desktop declaration in globals. Add media queries only.
- Do not add any breakpoint variant except `max-md` and `max-sm`.
- Do not remove a class that applies at `>= 1025px`.
- Do not swap flex and grid.
- Do not fake `gap` / `space-x` / `space-y` with margin or padding.
- Do not change value types (`p-10` ↔ `p-[10vw]` ↔ `p-[2rem]`).
- Do not add `gsap.matchMedia` when the desktop animation is fine.
- Do not responsive a section you do not understand. Ask, or skip it when they say skip.

## Finish

After each section, post only the review block from **One section at a time**. Wait.

After the user approves the last section, one closing block. Only lines that are true:

```
Responsive pass
  Breakpoints   md 1025px · sm 768px
  Desktop       unchanged (>= 1025px)
  Approved      Hero, Footer
  Globals       .text22 .text12 — media queries only, desktop rules unchanged
  Split files   none
  Skipped       Marquee — manual
  Animation     Hero left as desktop (no matchMedia)
```

## Locked defaults

- Skill invoke: `/nextjs-desktop-first-responsive`
- Also applies when the user asks to make a Next.js page, section, or component responsive
- Scope: user-global or project-local (same rules either way)
- Desktop: frozen. Not one pixel at `>= 1025px`. No edits to rules or classes that apply there.
- Flow: one section (tablet `max-md`, then mobile `max-sm`), stop, review, wait. Next section only after approval. Never a full page in one step.
- Order inside a section: desktop untouched → tablet (`max-md`) → mobile (`max-sm`)
- Breakpoints: `--breakpoint-md: 1025px`, `--breakpoint-sm: 768px`
- Variants allowed: `max-md`, `max-sm` only
- Vanilla queries: `@media (width < 1025px)` and `@media (width < 768px)`
- Mobile pass: gaps, padding, font sizes, spacing on top of the tablet layout
- Global classes: responsive in the global stylesheet, never overridden on the element
- New global classes: font sizes and colors only, and only if globals do not already have them
- Value types: match desktop per property (Tailwind scale, or the same arbitrary unit)
- Flex stays flex. Gap and space utilities stay gap and space utilities
- Complex section: ask, then `{FileName}Responsive.jsx` / `.tsx`, or skip. Never both, never unasked
- GSAP `matchMedia` only when that section's animation must change

## Install

Global (every project):

```bash
npx creative-skills-kit install nextjs-desktop-first-responsive --dir ~/.cursor/skills
npx creative-skills-kit install nextjs-desktop-first-responsive --dir ~/.claude/skills
```

This project only:

```bash
npx creative-skills-kit install nextjs-desktop-first-responsive --dir .agents/skills
npx creative-skills-kit install nextjs-desktop-first-responsive
```

Cursor's project install path is `.agents/skills/`, not `.cursor/skills/`. Do not put this skill in `~/.cursor/skills-cursor/`.

Edit the copy in this repo. Installed copies are what the CLI wrote.

## Credits

Gaurav Verma, creative dev  
Portfolio: [briskgaurav.in](https://briskgaurav.in)  
GitHub: [github.com/briskgaurav](https://github.com/briskgaurav)
