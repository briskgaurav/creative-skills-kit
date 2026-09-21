import type { HTMLAttributes } from "react";

type CornerSpansProps = HTMLAttributes<HTMLDivElement> & {
  borderClassName?: string;
};

const size =
  "pointer-events-none absolute block h-[0.3vw] w-[0.3vw] max-md:h-[1vw] max-md:w-[1vw]";

export function CornerSpans({
  children,
  className = "",
  borderClassName = "border-zinc-500",
  ...props
}: CornerSpansProps) {
  return (
    <div className={`relative p-[.2vw] max-md:p-0.5 ${className}`} {...props}>
      <span
        aria-hidden
        className={`${size} top-0 left-0 max-md:top-[-.5vw] max-md:left-[-.5vw] border-t border-l ${borderClassName}`}
      />
      <span
        aria-hidden
        className={`${size} top-0 right-0 max-md:top-[-.5vw] max-md:right-[-.5vw] border-t border-r ${borderClassName}`}
      />
      <span
        aria-hidden
        className={`${size} bottom-0 left-0 max-md:bottom-[-.5vw] max-md:left-[-.5vw] border-b border-l ${borderClassName}`}
      />
      <span
        aria-hidden
        className={`${size} bottom-0 right-0 max-md:bottom-[-.5vw] max-md:right-[-.5vw] border-b border-r ${borderClassName}`}
      />
      {children}
    </div>
  );
}
