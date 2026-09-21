import Link from "next/link";
import { AskAi } from "./AskAi";
import { CornerSpans } from "./CornerSpans";

export function Footer() {
  return (
    <footer className="mx-auto mb-10 w-full max-w-[50vw] px-6 sm:px-16 max-md:mb-6 max-md:max-w-full max-md:px-6">
      <CornerSpans className="relative flex h-full w-full flex-col items-center gap-6 bg-foreground/4 px-6 py-10 max-md:gap-4 max-md:px-4 max-md:py-6">
        <AskAi />
      </CornerSpans>
      <p className="mt-4 text-center text12 text-foreground/40 max-md:mt-3">
        Made By{" "}
        <Link
          href="https://github.com/briskgaurav"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground/70 transition-colors hover:text-foreground"
        >
          Gaurav Verma
        </Link>
        , Creative Developer
      </p>
    </footer>
  );
}
