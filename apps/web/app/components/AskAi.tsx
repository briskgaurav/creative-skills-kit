const AGENTS = [
  {
    name: "Claude",
    icon: "/icons/claude.png",
    prompt: `Read the Creative Skills Kit in this repository. Explain how to author, validate, and install a custom Claude skill (SKILL.md) using the core package and CLI.`,
    href: (q: string) => `https://claude.ai/new?q=${q}`,
  },
  {
    name: "Gemini",
    icon: "/icons/gemini.png",
    prompt: `Review the Creative Skills Kit and explain how to leverage its coding standards templates with Google Gemini in an enterprise environment.`,
    href: (q: string) => `https://gemini.google.com/app?q=${q}`,
  },
  {
    name: "ChatGPT",
    icon: "/icons/gpt.png",
    prompt: `Analyze this monorepo structure containing npm workspaces, packages/core, packages/cli, and apps/web. Explain how they share the same skills/ registry.`,
    href: (q: string) => `https://chatgpt.com/?q=${q}`,
  },
  {
    name: "Perplexity",
    icon: "/icons/perp.png",
    prompt: `Review the Creative Skills Kit in this repository. Explain how I can use its custom skills and CLI to enforce team coding standards and speed up development.`,
    href: (q: string) => `https://www.perplexity.ai/search?q=${q}`,
  },
] as const;

export function AskAi() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl text-center gap-4 max-md:gap-3">
      <h2 className="text12 font-light tracking-wide text-foreground/60 capatilize">
        Ask AI About This Package
      </h2>

      <div className="flex flex-wrap items-center justify-center gap-4 max-md:gap-3">
        {AGENTS.map((agent) => (
          <a
            key={agent.name}
            href={agent.href(encodeURIComponent(agent.prompt))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ask ${agent.name}`}
            className="group relative size-[2.2vw] shrink-0 transition-transform active:scale-95 focus:outline-none max-md:size-10"
          >
            <div className="absolute inset-0 flex cursor-pointer items-center justify-center overflow-hidden rounded-xl transition-transform duration-300">
              <img
                src={agent.icon}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                className="pointer-events-none select-none"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
