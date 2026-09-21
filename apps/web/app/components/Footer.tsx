import Link from "next/link";
import { AskAi } from "./AskAi";
import { CornerSpans } from "./CornerSpans";

export function Footer() {
  return (
    <footer className="mx-auto mb-10 w-full max-w-[50vw] px-16">
      <CornerSpans className="relative flex h-full w-full flex-col items-center gap-6 bg-foreground/4 px-6 py-10">
        <AskAi />
      </CornerSpans>
        <p className="text12 text-center mt-4 text-foreground/40">
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
