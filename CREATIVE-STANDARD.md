# Creative Standard

## Animation

Use the `useGSAP` hook for animation.

If animation is set up inside `useEffect`, wrap it in `gsap.context()` and revert that context in the effect cleanup.

Text split for animation uses GSAP's SplitText plugin. Register it with `gsap.registerPlugin(SplitText)`, split through that plugin, and revert the split on cleanup.

For animation only, a custom splitter written in JavaScript is not used. That includes splitting a string by hand and wrapping characters, words, or lines in elements yourself. Splitting text for anything other than animation is unaffected.

## Client boundary

Page files and layout files never contain `"use client"`.

This covers `page.js`, `page.jsx`, `page.ts`, `page.tsx`, and the matching `layout.*` files.

## Type and color

Text sizes and colors come from one common file. That file is `globals.css`, or one custom CSS file the user made for the project. The whole project uses that same file.

Use the variables from that file.

Arbitrary Tailwind values are not used:

- `text-[10vw]`
- `text-[#00ff00]`
- any other `text-[...]`, `bg-[...]`, or color written as a raw value on a class



## Shaders

GLSL shaders live in `Shaders/<effect-name>/`.

Each effect has its own folder. Every shader for that effect is a file inside it: fragment, vertex, fluid vertex, and the rest.

Shader source is not written inline in a component.

TSL (Three.js Shading Language) may be written directly in the component.

## Breakpoints

If `globals.css` defines breakpoints, they are:

- `md` at `1025px`
- `sm` at `768px`

Responsive styles are not added until the user asks for them.

## Spacing

For spacing between elements, use `space-y`, `space-x`, `gap-x`, and `gap-y`.

Single-side utilities (`ml`, `pl`, `pt`, `pb`, `mb`) are used only when that side spacing is actually required.

Match the unit the project already uses. Check the other files first.

- The project uses `vw`: write `vw`.
- The project uses `rem`: write `rem`.
- The project uses the default Tailwind scale: use that scale.



## Layout

Use flex before grid.

## Semantics

Use semantic tags.

- Each block of the page is a `<section>`.
- Each section contains one `<h2>`.
- The top hero section contains the page's one `<h1>`.
- Each section has its own id: `hero`, `service`, and so on, used as `#hero`, `#service`.



## Assets

Images, video, models, and other assets live in `public/`.

Fonts are the exception. They live on a path Next.js font loading supports, and they load through `next/font`.

## Lint

Shipped code has no lint errors.

Check every lint error and fix it. Tailwind class errors included.