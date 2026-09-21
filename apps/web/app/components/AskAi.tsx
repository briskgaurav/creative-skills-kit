"use client";

// Fixed the names: Perplexity, Claude, ChatGPT, Gemini assignments and icons.

const PROMPTS = {
  Cursor: `Review the Creative Skills Kit in this repository. Explain how I can use its custom skills within Cursor to enforce team coding standards and speed up development.`,
  Claude: `Read the Creative Skills Kit in this repository. Explain how to author, validate, and install a custom Claude skill (SKILL.md) using the core package and CLI.`,
  ChatGPT: `Analyze this monorepo structure containing npm workspaces, packages/core, packages/cli, and apps/web. Explain how they share the same skills/ registry.`,
  Gemini: `Review the Creative Skills Kit and explain how to leverage its coding standards templates with Google Gemini in an enterprise environment.`,
};

const ICONS: Record<string, string> = {
  Cursor: "/icons/claude.png",
  Claude: "/icons/gemini.png",
  ChatGPT: "/icons/gpt.png",
  Gemini: "/icons/perp.png",
};

export function AskAi() {
  const handleCopy = (name: keyof typeof PROMPTS) => {
    navigator.clipboard.writeText(PROMPTS[name]);
  };

  return (
    <section className="relative flex flex-col items-center justify-center rounded-2xl  text-center gap-4 overflow-hidden">
      <h2 className="text-text12 font-light text-foreground/60 tracking-wide capatilize">
        Ask AI About This Package
      </h2>
      
      <div className="flex items-center justify-center gap-4">
        {(Object.keys(PROMPTS) as Array<keyof typeof PROMPTS>).map((name) => {
          const iconSrc = ICONS[name] || "/icons/ai.svg";
          return (
            <button
              key={name}
              type="button"
              onClick={() => handleCopy(name)}
              className="group relative size-10 shrink-0 transition-transform active:scale-95 focus:outline-none"
            >
              <div className="absolute inset-0 rounded-xl overflow-hidden transition-transform duration-300 cursor-pointer flex items-center justify-center">
                <img
                  src={iconSrc}
                  alt={name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  className="pointer-events-none select-none"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
