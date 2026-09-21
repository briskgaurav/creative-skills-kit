"use client";

import React from "react";
import { CornerSpans } from "./CornerSpans";

type TextWithBackgroundProps = {
  children: React.ReactNode;
  scramble?: boolean;
};

export default function TextWithBackground({
  children = "TEXT",
  scramble = false,
}: TextWithBackgroundProps) {
  return (
    <CornerSpans
      {...(scramble ? { "data-scramble": true } : {})}
      className="w-fit text-[.95vw] text-white max-md:text-[3vw]"
    >
      <div className="relative flex items-center justify-center rounded-none bg-zinc-800 px-[1vw] py-[.4vw] pt-[.5vw] max-md:px-[2.6vw] max-md:py-[1.5vw]">
        <p>{children}</p>
      </div>
    </CornerSpans>
  );
}
