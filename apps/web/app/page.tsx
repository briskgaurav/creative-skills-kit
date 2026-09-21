import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listSkills, displayName } from "./lib/skills";
import { CodeBlock } from "./components/CodeBlock";
import { AskAi } from "./components/AskAi";

export default function Home() {
  const skills = listSkills();

  return (
    <div className="flex flex-1 flex-col bg-background font-sans">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16 sm:px-16">
        <header className="flex flex-col gap-3">
          <p className="text-text12 font-medium uppercase tracking-wider text-foreground/60">
            creative-skills-kit
          </p>

          <h1 className="text-text32 font-semibold text-balance text-foreground">
            Installable skills and coding standards.
          </h1>

          <p className="max-w-xl text-text18 leading-7 text-foreground/60">
            Every skill below lives in this repo&apos;s{" "}
            <code className="rounded border border-foreground/20 bg-background px-1.5 py-0.5 font-mono text-text12">
              skills/
            </code>{" "}
            directory. Install any of them into a project with the CLI:
          </p>

          <div>
            <pre className="overflow-x-auto rounded-lg border border-foreground/20 bg-background px-4 py-3 font-mono text-text12 text-foreground">
              npx creative-skills-kit install &lt;slug&gt;
            </pre>
          </div>
        </header>

        <section className="flex border-foreground/20 border px-8 py-10 flex-col gap-2.5">
          <h2 className="text-text12 font-medium uppercase tracking-wider text-foreground/60">
            [ {skills.length === 1 ? "1 skill" : `${skills.length} skills`} ]
          </h2>

          {skills.length === 0 ? (
            <div className="flex items-start gap-3 py-6">
              <p className="text-text12 text-foreground/60">
                Nothing in the registry yet. Add a{" "}
                <span className="font-mono text-foreground">SKILL.md</span> under{" "}
                <span className="font-mono text-foreground">skills/</span>.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-foreground/20">
              {skills.map((skill) => {
                const meta = [skill.slug, skill.category].filter(Boolean).join(" · ");
                return (
                  <li key={skill.slug}>
                    <Link
                      href={`/skills/${skill.slug}`}
                      className="flex items-start gap-4 py-5"
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <h3 className="text-text18 font-medium text-foreground">
                          {displayName(skill.name)}
                        </h3>
                        {skill.description && (
                          <p className="text-text12 text-pretty text-foreground/60">
                            {skill.description}
                          </p>
                        )}
                        <p className="font-mono text-text12 text-foreground/40">{meta}</p>
                      </div>
                      <ArrowRight
                        className="mt-1 size-4 shrink-0 text-foreground/40"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>

      <footer className="mx-auto w-full max-w-3xl px-6 pb-16 sm:px-16">
        <AskAi />
      </footer>
    </div>
  );
}
