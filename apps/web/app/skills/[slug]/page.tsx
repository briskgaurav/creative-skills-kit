import Link from "next/link";
import { notFound } from "next/navigation";
import { listSkills, getSkill } from "../../lib/skills";
import { CodeBlock } from "../../components/CodeBlock";
import { Breadcrumb } from "../../components/Breadcrumb";

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

export default async function SkillPage({
  params,
}: PageProps<"/skills/[slug]">) {
  const { slug } = await params;

  const skill = findSkill(slug);
  if (!skill) notFound();

  const facts = [
    { label: "Slug", value: skill.slug, mono: true },
    skill.category && { label: "Category", value: skill.category },
    skill.version && { label: "Version", value: skill.version, mono: true },
    skill.license && { label: "License", value: skill.license },
  ].filter(Boolean) as { label: string; value: string; mono?: boolean }[];

  return (
    <div className="flex flex-1 flex-col bg-background font-sans">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16 sm:px-16">
        <Breadcrumb
          labels={{ skills: "Skills", [skill.slug]: displayName(skill.name) }}
          unlinked={["skills"]}
        />

        <header className="flex flex-col gap-4">
          <h1 className="text-text32 font-semibold text-balance text-foreground">
            {displayName(skill.name)}
          </h1>

          {skill.description && (
            <p className="max-w-2xl text-text18 text-pretty text-foreground/60">
              {skill.description}
            </p>
          )}

          {skill.tags && skill.tags.length > 0 && (
            <p className="text-text12 text-foreground/40">{skill.tags.join(" · ")}</p>
          )}
        </header>

        <dl className="flex flex-wrap gap-x-10 gap-y-4 border-y border-foreground/20 py-4">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-0.5">
              <dt className="text-text12 text-foreground/40">{fact.label}</dt>
              <dd className={`text-text12 text-foreground ${fact.mono ? "font-mono" : ""}`}>
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        <section className="flex flex-col gap-2.5">
          <h2 className="text-text12 font-medium uppercase tracking-wider text-foreground/60">
            Install
          </h2>
          <CodeBlock
            label="terminal"
            code={`npx creative-skills-kit install ${skill.slug}`}
          />
        </section>

        <section className="flex flex-col gap-2.5">
          <h2 className="text-text12 font-medium uppercase tracking-wider text-foreground/60">
            SKILL.md
          </h2>
          <CodeBlock
            label="SKILL.md"
            code={skill.body}
            collapsible
            collapsedHeight={460}
          />
        </section>

        <Link href="/" className="w-fit text-text12 text-foreground/60 hover:text-foreground">
          ← All skills
        </Link>
      </main>
    </div>
  );
}
