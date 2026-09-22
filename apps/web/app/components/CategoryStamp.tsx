import { CornerSpans } from "./CornerSpans";

export function CategoryStamp({ category }: { category: string }) {
  return (
    <CornerSpans className="shrink-0" borderClassName="border-foreground/50">
      <span className="block bg-foreground px-[0.4vw] py-[0.08vw] text-[0.7vw] uppercase tracking-wider text-background max-md:px-1.5 max-md:py-0.5 max-md:text-[2.4vw]">
        {category}
      </span>
    </CornerSpans>
  );
}
