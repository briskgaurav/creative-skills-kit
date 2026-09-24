---
name: nextjs-page-transition
description: >-
  Builds a Next.js App Router page transition with GSAP and Lenis. The exit
  animation finishes, the route changes, then the entry animation starts from
  the same visual state the exit ended on. Asks for the user's animation or a
  default fade. Use when the user asks for a Next.js page or route transition,
  or invokes /nextjs-page-transition. App Router only. Depends on gsap and lenis.
category: skill
---

# Next.js Page Transition

Exit, then the route change, then entry. The entry starts where the exit ended.

This skill wires that sequence. It does not invent an animation. The logo scale / rotate cover in older projects is not the default and is not copied unless the user asks for that exact motion.

## Checklist

Post this in chat at the start, and repost it updated after each step.

```
Page transition
- [ ] 1. Confirm App Router, gsap, and lenis
- [ ] 2. Ask: their animation, or the default fade
- [ ] 3. Write PageTransition. Exit ends on HANDOFF. Entry starts on HANDOFF.
- [ ] 4. Mount it inside the Lenis provider, around the layout children
- [ ] 5. Post the usage guide
```

## Scope

- Next.js App Router only (`app/`, `usePathname`, `useRouter` from `next/navigation`).
- Dependencies, and only these: `gsap`, `lenis` (import `useLenis` from `lenis/react`).
- One client component. One context. Call `navigate(href)` to run the transition.

If the project is the Pages Router, stop. Do not adapt this skill to `pages/`.

If `gsap` or `lenis` is missing, stop and name which one. Ask before installing. Install only the missing one of those two. Do not add Motion, Framer Motion, Theatre, or a view-transition package to do this job.

`useLenis()` only works under the Lenis provider. Mount `PageTransition` inside it. If there is no provider, stop and say so. Do not invent a second smooth-scroll setup in this skill.

## Ask before any animation

Ask with the structured question tool when it exists. Otherwise ask in chat. Wait.

1. **I'll describe the animation**
2. **Use the default fade**

Do not write the file before they answer.

If they describe one: restate the seam in two lines, then build that.

```
Exit ends on: full-screen black, panel at y 0
Entry starts on: that same black, panel at y 0
```

If the description never says where the exit ends, ask that one thing. Do not guess the seam.

If they pick the default: fade a full-screen overlay in, change route, fade it out. No logo, no scale, no slide.

## The sequence

This order is fixed. Do not reorder it.

1. **Exit** plays on the current page. Lenis is stopped. The overlay captures pointer events.
2. Exit's timeline `onComplete` runs. Scroll to the top with `lenis.scrollTo(0, { immediate: true, force: true })`. Then `router.push(href)`.
3. **Entry** plays only after the pathname matches the target (or the fallback timer fires). It reveals the new page, then Lenis starts again.

`router.push` is inside the exit timeline's `onComplete`. Never before the exit finishes. Never call the entry from that `onComplete`. The pathname effect starts the entry.

Same href as the current pathname: do nothing. A transition already running: ignore the new click.

## Exit and entry are one seam

`HANDOFF` is the visual state at the cut. Exit's last frame is `HANDOFF`. Entry's first frame is `HANDOFF`.

Wrong: exit fades to black, entry starts from a clear screen and fades to black again.
Right: exit ends fully covered. Entry begins fully covered, then clears.

When a custom animation ends somewhere else (a panel at `y: 0`, a clip at `inset(0%)`, a scale of `1`), put that pose in `HANDOFF`. Entry applies it with `gsap.set` before it tweens away. Do not give entry its own starting pose.

Scroll to the top happens at that seam, after exit, before entry. Keep that call. Do not animate the scroll.

## Overlay layer

Portal the overlay to `document.body`. Do not leave it inside the page tree.

`position: fixed` is trapped by a parent with `transform`, `filter`, or `will-change`. Lenis is often that parent. A shutter inside that parent never covers the viewport.

The overlay's z-index is the highest on the page. Higher than the nav, the cursor, the preloader, and the theme toggle. Set it inline (`zIndex: 10000`), not with a utility that can lose to another stacking context.

Pointer events are `none` while idle and `auto` only during the transition.

## GSAP owns the motion

GSAP is the only writer of each property it tweens. Do not also set that property in a class or an inline style.

`x` and `xPercent` add. A CSS `transform: translateX(-100%)` plus a tween of `xPercent` to `0` leaves the panel off screen. The route still changes, so it looks like the transition never ran.

Use `fromTo` for the exit. The `from` pose is the open screen. The `to` pose is `HANDOFF`. Entry `gsap.set`s `HANDOFF`, then tweens away from it. One property per panel. Do not mix `transform` in CSS with `x` or `xPercent`.

## Clicks

`next/link` navigates on its own, after your click handler. That skips the exit.

For an in-app click: `preventDefault`, then `navigate(href)`. Modified clicks (new tab, and so on) stay with the browser. The only `router.push` is the one in the exit timeline's `onComplete`.

## Where the file goes

Match the project's animation folder and extension.

| Project | File |
|---|---|
| `src/animations/LenisSmoothScroll.jsx` | `src/animations/PageTransition.jsx` |
| `app/animations/LenisSmoothScroll.tsx` | `app/animations/PageTransition.tsx` |

If the folder exists under another name, put `PageTransition` beside the Lenis component. Use `.tsx` when the project is TypeScript. Add types. Do not change the sequence.

In the root layout, inside the Lenis provider:

```jsx
<LenisSmoothScroll>
  <PageTransition>{children}</PageTransition>
</LenisSmoothScroll>
```

## The component

Copy this file. The animation block is the only part that changes between the default fade and a custom motion. Leave the routing block alone.

Comments in the file stay. They are how the user edits the motion later without reading the router logic.

```jsx
'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react'
import { createPortal } from 'react-dom'
import { usePathname, useRouter } from 'next/navigation'
import gsap from 'gsap'
import { useLenis } from 'lenis/react'

const TransitionContext = createContext(() => {})

/** Call navigate('/some-route') to run exit, then the route change, then entry. */
export const usePageTransition = () => useContext(TransitionContext)

const normalize = (path) =>
  path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path

/* ─────────────────────────────────────────────────────────────
   ANIMATION — edit this block only.

   Exit plays before the route changes. It must finish on HANDOFF.
   Entry plays after the route changes. It must start from HANDOFF.

   To change the motion, edit EXIT, ENTRY, and the two tweens that
   use them. If the exit should end on a new pose, write that pose
   into HANDOFF. Entry reads HANDOFF, so it will start there too.

   The overlay color is the cover. Change bg-foreground on the root
   div at the bottom of this file to change what the fade covers with.

   GSAP is the only writer of opacity here. Do not also set a
   transform, clip, or second opacity in CSS on this node.
   ───────────────────────────────────────────────────────────── */

const HANDOFF = { opacity: 1 }

const EXIT = {
  duration: 0.55,
  ease: 'power2.inOut',
}

const ENTRY = {
  delay: 0.08, // hold the covered screen for a beat before revealing
  duration: 0.55,
  ease: 'power2.inOut',
}

export default function PageTransition({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const lenis = useLenis()

  const rootRef = useRef(null)
  const busyRef = useRef(false)
  const pendingRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Entry. Assumes the overlay is already sitting on HANDOFF.
  const playEntry = useCallback(() => {
    gsap.set(rootRef.current, { opacity: HANDOFF.opacity })

    const tl = gsap.timeline({
      delay: ENTRY.delay,
      onComplete: () => {
        gsap.set(rootRef.current, { pointerEvents: 'none' })
        lenis?.start()
        busyRef.current = false
      },
    })

    tl.to(rootRef.current, {
      opacity: 0,
      duration: ENTRY.duration,
      ease: ENTRY.ease,
    })

    return tl
  }, [lenis])

  const navigate = useCallback(
    (href) => {
      if (busyRef.current || normalize(href) === normalize(pathname)) return
      busyRef.current = true
      lenis?.stop()

      gsap.set(rootRef.current, { pointerEvents: 'auto' })

      /* ROUTING — do not edit this timeline to invent a second animation.
         The tween below is the exit. onComplete is the seam:
         scroll to top, then change route. Entry starts later,
         from the pathname effect, once the new page is in. */
      const tl = gsap.timeline({
        onComplete: () => {
          lenis?.scrollTo(0, { immediate: true, force: true })
          router.push(href)

          const fallback = setTimeout(() => {
            if (pendingRef.current) {
              pendingRef.current = null
              playEntry()
            }
          }, 1400)

          pendingRef.current = { href: normalize(href), fallback }
        },
      })

      tl.fromTo(
        rootRef.current,
        { opacity: 0 },
        { opacity: HANDOFF.opacity, duration: EXIT.duration, ease: EXIT.ease },
      )
    },
    [router, pathname, lenis, playEntry],
  )

  useEffect(() => {
    const pending = pendingRef.current
    if (!pending) return
    if (normalize(pathname) !== pending.href) return

    clearTimeout(pending.fallback)
    pendingRef.current = null
    // One frame so the new page can paint under the cover.
    requestAnimationFrame(() => playEntry())
  }, [pathname, playEntry])

  const overlay = (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 bg-foreground"
      style={{ zIndex: 10000, opacity: 0 }}
    />
  )

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      {mounted ? createPortal(overlay, document.body) : null}
    </TransitionContext.Provider>
  )
}
```

### Custom animation

Replace the tweens. Keep `HANDOFF`, the exit `onComplete`, the pathname effect, the busy lock, the portal, and the Lenis stop / start / scroll-to-top.

Extra nodes (a panel, a mark) go inside the portaled overlay. Give them refs. Exit uses `fromTo`: `from` is the open pose, `to` is `HANDOFF`. Entry `gsap.set`s `HANDOFF`, then tweens away. One GSAP property per node. Do not also set that property in CSS. Do not mix a CSS `transform` with `x` or `xPercent`.

Do not animate between exit and entry. The route change is the cut. The screen stays on `HANDOFF` across that cut.

## After it is wired

Post this guide, with the real path and the real seam filled in. Then stop.

```
Page transition
  File     app/animations/PageTransition.tsx
  Seam     exit ends covered → entry starts covered

How it runs
  1. Exit plays on the current page and ends on the handoff state
  2. Scroll jumps to the top
  3. The route changes
  4. Entry starts from that same state and reveals the new page

Use it
  import { usePageTransition } from '@/animations/PageTransition'

  const navigate = usePageTransition()
  navigate('/work')

  Link and router.push skip the exit. preventDefault, then navigate.

Edit the motion
  Open the ANIMATION block at the top of that file.
  EXIT is how the old page leaves. ENTRY is how the new page arrives.
  HANDOFF is the pose both share. Change the exit's ending pose there,
  and the entry will start from it.
```

Use the project's real import path. Only claim the seam that was actually written.

## Do not

- Do not run entry before `router.push`.
- Do not call `router.push` before the exit timeline completes.
- Do not start entry from a different pose than the one exit ended on.
- Do not skip the scroll-to-top at the seam.
- Do not let `<Link>` or `router.push` perform the route change. `preventDefault`, then `navigate`.
- Do not leave the overlay inside a transformed parent. Portal it to `document.body`.
- Do not give the overlay a z-index that can sit under the nav, cursor, or preloader.
- Do not set a tweened property in CSS as well as in GSAP. Do not mix CSS `transform` with `x` or `xPercent`.
- Do not play an intro on first load.
- Do not copy a logo zoom, loader, or any motion the user did not ask for.
- Do not add an animation library other than `gsap` and `lenis`.
- Do not build this on the Pages Router.

## Locked defaults

- Skill invoke: `/nextjs-page-transition`
- Also applies when the user asks for a Next.js page or route transition
- App Router only
- Dependencies: `gsap`, `lenis` (`useLenis` from `lenis/react`)
- Order: exit → scroll to top → `router.push` → entry
- Seam: one `HANDOFF` pose. Exit ends there. Entry starts there.
- Ask first: their animation, or the default fade. Wait.
- Default fade: overlay opacity `0 → 1`, route change, opacity `1 → 0`
- File: `PageTransition` beside the existing Lenis component
- Mount: inside the Lenis provider, around layout `children`
- API: `preventDefault`, then `usePageTransition()` / `navigate(href)`. The only `router.push` is in the exit `onComplete`
- Overlay: portaled to `document.body`, `zIndex: 10000`, above nav, cursor, and preloader
- Motion: GSAP alone writes each tweened property. Exit is `fromTo` onto `HANDOFF`. No CSS transform mixed with `x` or `xPercent`
- After wiring: post the usage guide, then stop

## Install

Global (every project):

```bash
npx creative-skills-kit install nextjs-page-transition --dir ~/.cursor/skills
npx creative-skills-kit install nextjs-page-transition --dir ~/.claude/skills
```

This project only:

```bash
npx creative-skills-kit install nextjs-page-transition --dir .agents/skills
npx creative-skills-kit install nextjs-page-transition
```

Cursor's project install path is `.agents/skills/`, not `.cursor/skills/`. Do not put this skill in `~/.cursor/skills-cursor/`.

## Credits

Gaurav Verma, creative dev  
Portfolio: [briskgaurav.in](https://briskgaurav.in)  
GitHub: [github.com/briskgaurav](https://github.com/briskgaurav)
