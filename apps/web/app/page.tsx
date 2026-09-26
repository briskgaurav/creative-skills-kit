import { TransitionLink as Link } from "./components/TransitionLink";
import { listSkills, displayName } from "./lib/skills";
import { CornerSpans } from "./components/CornerSpans";
import { CategoryStamp } from "./components/CategoryStamp";
import { CopyButton } from "./components/CopyButton";

const INSTALL_COMMAND = "npx creative-skills-kit install <slug-name>";

export default function Home() {
  const skills = listSkills();

  return (
    <div className="flex flex-1 max-md:mt-10 flex-col bg-background font-sans">
      <div className="mx-auto max-md:max-w-[100vw] flex w-full max-w-[50vw] flex-1 flex-col gap-10 px-6 py-16 sm:px-16">
        <header className="flex flex-col gap-2">
          <p className="text-text12 font-medium uppercase tracking-wider text-foreground/60">
            creative skills kit
          </p>

          <h1 className="text32 mt-4 font-medium uppercase text-balance text-foreground">
            Build creative Sites without teaching the agent twice.
          </h1>


          <p className="mt-4 max-w-xl text12 text-foreground/60">
            A library for AI agents. The standard holds the strict rules a
            creative site needs. Install a skill for a complex or repetitive
            task. The agent does it right away :)
          </p>

          <p className="mt-4 max-w-xl text12 text-foreground/60">
            <a
              href="https://in.linkedin.com/in/briskgaurav"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground transition-colors hover:text-emerald-400"
            >
              Gaurav Verma
            </a>
            , A Creative Developer, built these rules and skills for the sites
            he ships. Other developers ran them on their own projects. The
            repeat tasks took less time. Use them whole, or edit the part that
            does not fit.
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

        <section id="standard" className="flex -mt-8 pt-10 flex-col gap-2.5">
          <div className="uppercase opacity-60">
            <p className="text12">[ Standard ]</p>
          </div>
          <ul className="mt-2 flex flex-col gap-[1vw] max-md:gap-4">
            <li>
              <Link
                href="/standard"
                className="flex w-full flex-col gap-4 bg-foreground/4 px-[1.6vw] py-[1.4vw] transition-all duration-300 hover:bg-foreground/8 max-md:gap-3 max-md:px-5 max-md:py-5"
              >
                <h2 className="text-text18 text-foreground">Creative Standard</h2>
                <p className="text12 text-pretty text-foreground/60">
                  Strict rules a creative site keeps on every page. Animation, type,
                  color, spacing, and layout stay consistent. Files land in the
                  right place. Copy it in, and the agent follows it.
                </p>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-text12 text-foreground/40">CREATIVE-STANDARD.md</p>
                  <CategoryStamp category="standard" />
                </div>
              </Link>
            </li>
          </ul>
        </section>

        <section id="kit" className="flex flex-col gap-2.5">
          <div className="uppercase opacity-60">
            <p className="text12">[ SKILLS ]</p>
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
            <ul className="mt-2 flex flex-col gap-[1vw] max-md:gap-4">
              {skills.map((skill) => {
                return (
                  <li key={skill.slug}>
                    <Link
                      href={`/skills/${skill.slug}`}
                      className="flex w-full flex-col gap-4 bg-foreground/4 px-[1.6vw] py-[1.4vw] transition-all duration-300 hover:bg-foreground/8 max-md:gap-3 max-md:px-5 max-md:py-5"
                    >
                      <h3 className="text-text18 text-foreground">
                        {displayName(skill.name)}
                      </h3>
                      {skill.description && (
                        <p className="text12 text-pretty text-foreground/60">
                          {skill.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-text12 text-foreground/40">
                          {skill.slug}
                        </p>
                        {skill.category && (
                          <CategoryStamp category={skill.category} />
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
