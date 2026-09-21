import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listSkills, displayName } from "./lib/skills";
import { CornerSpans } from "./components/CornerSpans";

export default function Home() {
  const skills = listSkills();

  return (
    <div className="flex flex-1 flex-col bg-background font-sans">
      <div className="mx-auto flex w-full max-w-[50vw] flex-1 flex-col gap-10 px-6 py-16 sm:px-16">
        <header className="flex flex-col gap-2">
          <p className="text-text12 font-medium uppercase tracking-wider text-foreground/60">
            creative-skills-kit
          </p>

          <h1 className="text32 mt-4 font-semibold text-balance text-foreground">
            Installable skills and coding standards.
          </h1>

          <p className="max-w-xl text12 text-foreground/60">
            Every skill below lives in this repo&apos;s{" "}
            <span className="text-foreground!">skills/</span> directory.
            Install any of them into a project with the CLI:
          </p>

          <CornerSpans className="mt-4 w-fit" borderClassName="border-foreground">
            <pre className="overflow-x-auto bg-foreground/20 px-[1vw] py-[.4vw] font-sans text-text12 text-foreground">
              npx creative-skills-kit install &lt;slug-name&gt;
            </pre>
          </CornerSpans>
        </header>

        <section className="flex -mt-8  py-10 flex-col gap-2.5">
          <div className="uppercase opacity-60">
            <p className="text12">[ Available Skills : {skills.length} ]</p>
          </div>

          {skills.length === 0 ? (
            <div className="flex items-start gap-3 py-6">
              <p className="text-text12 text-foreground/60">
                Nothing in the registry yet. Add a{" "}
                <span className="text-foreground">SKILL.md</span>{" "}
                under <span className="text-foreground">skills/</span>
                .
              </p>
            </div>
          ) : (
            <div className="mt-2">
              <ul className="divide-y divide-foreground/20">
                {skills.map((skill) => {
                  const meta = [skill.slug, skill.category]
                    .filter(Boolean)
                    .join(" · ");
                  return (
                    <li key={skill.slug}>
                      <Link
                        href={`/skills/${skill.slug}`}
                        className="flex items-start gap-4 py-5"
                      >
                        <div className="flex min-w-0 flex-1 flex-col gap-4">
                          <h3 className="text-text18 font-medium text-foreground">
                            {displayName(skill.name)}
                          </h3>
                          {skill.description && (
                            <p className="text-text12 text-pretty text-foreground/60">
                              {skill.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <p className="text-text12 text-foreground/40">
                              {meta}
                            </p>
                            <ArrowRight
                              className="mt-1 size-4 shrink-0 text-foreground/40"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
