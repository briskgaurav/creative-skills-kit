import { AskAi } from "./AskAi";
import { CornerSpans } from "./CornerSpans";

export function Footer() {
  return (
    <footer className="mx-auto mb-10 w-full max-w-[50vw] ">
      <CornerSpans className="relative h-full w-full px-6 bg-foreground/1 py-10">
        <AskAi />
      </CornerSpans>
    </footer>
  );
}
