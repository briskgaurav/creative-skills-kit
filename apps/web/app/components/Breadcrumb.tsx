"use client";

import { Fragment } from "react";
import { TransitionLink as Link } from "./TransitionLink";
import { usePathname } from "next/navigation";

type BreadcrumbProps = {
  /**
   * Pretty labels for path segments that shouldn't be auto-humanised — keyed
   * by the raw segment, e.g. `{ "creative-project-setup": "Creative Project Setup" }`.
   */
  labels?: Record<string, string>;
  /**
   * Segments that have no page of their own, rendered as plain text instead of
   * a link — e.g. `["skills"]`, since `/skills/[slug]` exists but `/skills`
   * does not.
   */
  unlinked?: string[];
  /** Label for the root crumb. */
  homeLabel?: string;
  className?: string;
};

/** Matches slug-shaped text such as `creative-project-setup` or `my_skill`. */
const SLUG_SHAPED = /^[a-z0-9]+(?:[-_][a-z0-9]+)+$/;

/** `creative-project-setup` -> `Creative Project Setup` */
function humanize(segment: string) {
  return segment
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\p{Ll}/gu, (char) => char.toUpperCase());
}

/**
 * Resolves a segment to its display label. An explicit label wins, but a label
 * that is itself still slug-shaped gets humanised too — skill frontmatter often
 * sets `name` to the directory slug.
 */
function toLabel(segment: string, labels?: Record<string, string>) {
  const raw = labels?.[segment] ?? decodeURIComponent(segment);
  return SLUG_SHAPED.test(raw) ? humanize(raw) : raw;
}

/**
 * Route-derived breadcrumb trail. Segments come from `usePathname()`, so any
 * new route — including dynamic ones — gets a trail with no extra wiring.
 */
export function Breadcrumb({
  labels,
  unlinked,
  homeLabel = "Home",
  className = "",
}: BreadcrumbProps) {
  const pathname = usePathname() ?? "/";
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const isCurrent = index === segments.length - 1;
    return {
      label: toLabel(segment, labels),
      href: `/${segments.slice(0, index + 1).join("/")}`,
      // The current page never links to itself, and neither do segments the
      // caller has told us have no route.
      isPlain: isCurrent || Boolean(unlinked?.includes(segment)),
      isCurrent,
    };
  });

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text12">
        <li>
          <Link href="/" className="text-foreground/60 hover:text-foreground">
            {homeLabel}
          </Link>
        </li>

        {crumbs.map((crumb) => (
          <Fragment key={crumb.href}>
            <li aria-hidden="true" className="text-foreground/40">
              /
            </li>
            <li>
              {crumb.isPlain ? (
                <span
                  aria-current={crumb.isCurrent ? "page" : undefined}
                  className={crumb.isCurrent ? "text-foreground" : "text-foreground/60"}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="text-foreground/60 hover:text-foreground">
                  {crumb.label}
                </Link>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
