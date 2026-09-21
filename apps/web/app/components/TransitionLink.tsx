"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { startPageTransition } from "../theme/viewTransition";

type TransitionLinkProps = ComponentProps<typeof Link>;

/**
 * Drop-in `next/link` that cross-fades between routes: the outgoing page
 * fades out as the incoming one fades in. Falls back to a plain client
 * navigation when the browser has no View Transitions API or the user
 * prefers reduced motion.
 */
export function TransitionLink({ onClick, ...props }: TransitionLinkProps) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    // Leave modified clicks (new tab/window, middle click) and external or
    // download links to the browser.
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    const href = typeof props.href === "string" ? props.href : null;
    if (!href || !href.startsWith("/")) return;

    if (window.location.pathname === href) return;

    const started = startPageTransition(() => router.push(href));

    // `startPageTransition` returns false when it did nothing, in which case
    // the default <Link> behaviour should still run.
    if (started) event.preventDefault();
  };

  return <Link {...props} onClick={handleClick} />;
}
