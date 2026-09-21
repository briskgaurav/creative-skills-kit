import { TransitionLink as Link } from "../../components/TransitionLink";
import { notFound } from "next/navigation";
import { listSkills, getSkill } from "../../lib/skills";
import { CodeBlock } from "../../components/CodeBlock";
import { CopyButton } from "../../components/CopyButton";
import { Breadcrumb } from "../../components/Breadcrumb";
import { InstallCommand } from "../../components/InstallCommand";
import { ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return listSkills().map((skill) => ({ slug: skill.slug }));
}

function findSkill(slug: string) {
  try {
    return getSkill(slug);
  } catch {
    return null;
  }
}

/**
 * Skill frontmatter often sets `name` to the directory slug, which reads badly
 * as a heading. Title-case it when it is still slug-shaped; leave real names be.
 */
function displayName(name: string) {
  if (!/^[a-z0-9]+(?:[-_][a-z0-9]+)+$/.test(name)) return name;
  return name.replace(/[-_]+/g, " ").replace(/\b\p{Ll}/gu, (c) => c.toUpperCase());
}

export async function generateMetadata({
  params,
}: Pick<PageProps<"/skills/[slug]">, "params">) {
  const { slug } = await params;
  const skill = findSkill(slug);
  if (!skill) return { title: "Skill not found" };

  return {
    title: `${displayName(skill.name)} — Creative Skills Kit`,
    description: skill.description || undefined,
  };
}

/**
 * First one or two paragraphs of the SKILL.md body, headings stripped —
 * used as a short "what it does" lead-in above the raw source dump.
 */
function leadParagraphs(body: string) {
  const withoutHeadings = body
    .split("\n")
    .filter((line) => !line.trim().startsWith("#"))
    .join("\n");

  return withoutHeadings
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !p.startsWith("```") && !p.startsWith("|") && !p.startsWith("-"))
    .slice(0, 2);
}

export default async function SkillPage({
  params,
}: PageProps<"/skills/[slug]">) {
  const { slug } = await params;

  const skill = findSkill(slug);
  if (!skill) notFound();

  const facts = [
    { label: "Slug", value: skill.slug },
    skill.category && { label: "Category", value: skill.category },
    skill.version && { label: "Version", value: skill.version },
    skill.license && { label: "License", value: skill.license },
  ].filter(Boolean) as { label: string; value: string }[];

  const lead = leadParagraphs(skill.body);
  const lineCount = skill.body.split("\n").length;

  return (
    <div className="flex flex-1 flex-col bg-background font-sans">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16 sm:px-16">
        <Breadcrumb
          labels={{ skills: "Skills", [skill.slug]: displayName(skill.name) }}
          unlinked={["skills"]}
        />

        <header className="flex flex-col gap-4 mt-10">
          <h1 className="text32 font-medium uppercase text-balance text-foreground">
            {displayName(skill.name)}
          </h1>

          {skill.description && (
            <p className="max-w-2xl text12 text-pretty text-foreground/60">
              {skill.description}
            </p>
          )}

          {skill.tags && skill.tags.length > 0 && (
            <p className="text12 text-foreground/40">{skill.tags.join(" · ")}</p>
          )}
        </header>

        {lead.length > 0 && (
          <section className="flex flex-col gap-3 bg-foreground/4 p-6">
            <h2 className="text12 font-medium uppercase tracking-wider text-foreground/60">
              What it does
            </h2>
            <div className="flex max-w-2xl mt-2 flex-col gap-2">
              {lead.map((paragraph, i) => (
                <p key={i} className="text12 text-pretty text-foreground/70">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}

        <section className="flex flex-col gap-4 bg-foreground/4 p-6">
          <div className="flex mb-2 flex-col gap-4">
            <h2 className="text12 font-medium uppercase tracking-wider text-foreground/60">
              Install
            </h2>
            <p className="max-w-2xl text12 text-foreground/60">
              Global installs the skill once for every project. This project
              only copies it into this repo. Pick your agent — the install
              path differs between them.
            </p>
          </div>

          <InstallCommand slug={skill.slug} />
        </section>

        <section className="flex flex-col gap-3 bg-foreground/4 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text12 font-medium uppercase tracking-wider text-foreground/60">
              SKILL.md
            </h2>
            <div className="flex items-center gap-2">
              <span className="text12 text-foreground/40">{lineCount} lines</span>
              <CopyButton text={skill.body} />
            </div>
          </div>
          <CodeBlock
            className="bg-transparent mt-4"
            code={skill.body}
            showHeader={false}
            collapsible
            collapsedHeight={460}
          />
        </section>

        <Link
          href="/"
          className="w-fit text12 text-foreground/60 hover:text-foreground flex gap-2 items-center"
        >
          <ArrowLeft  className="size-4" /> Back
        </Link>
      </main>
    </div>
  );
}
