import { TransitionLink as Link } from "./components/TransitionLink";
import { ArrowRight } from "lucide-react";
import { listSkills, displayName } from "./lib/skills";
import { CornerSpans } from "./components/CornerSpans";
import { CopyButton } from "./components/CopyButton";

const INSTALL_COMMAND = "npx creative-skills-kit install <slug-name>";

export default function Home() {
  const skills = listSkills();

  return (
    <div className="flex flex-1 max-md:mt-10 flex-col bg-background font-sans">
      <div className="mx-auto max-md:max-w-[100vw] flex w-full max-w-[50vw] flex-1 flex-col gap-10 px-6 py-16 sm:px-16">
        <header className="flex flex-col gap-2">
          <p className="text-text12 font-medium uppercase tracking-wider text-foreground/60">
            creative-skills-kit
          </p>

          <h1 className="text32 mt-4 font-medium uppercase text-balance text-foreground">
            Installable skills and coding standards.
          </h1>

          <p className="max-w-xl text12 text-foreground/60">
            Every skill below lives in this repo&apos;s{" "}
            <span className="text-foreground!">skills/</span> directory.
            Install any of them into a project with the CLI:
          </p>

          <div className="mt-4 flex w-fit max-w-full items-center gap-4 max-md:gap-2">
            <CornerSpans className="min-w-0 w-fit max-w-full" borderClassName="border-foreground">
              <pre className="overflow-x-auto bg-foreground/20 px-[1vw] py-[.4vw] font-sans text-text12 text-foreground max-md:px-3 max-md:py-2">
                {INSTALL_COMMAND}
              </pre>
            </CornerSpans>
            <CopyButton
              text={INSTALL_COMMAND}
              className="size-[1.4vw]! shrink-0 max-md:size-5!"
              iconClassName="size-full!"
            />
          </div>
        </header>

        <section className="flex -mt-8  pt-10 flex-col gap-2.5">
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
