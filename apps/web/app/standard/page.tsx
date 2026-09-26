import { TransitionLink as Link } from "../components/TransitionLink";
import { CodeBlock } from "../components/CodeBlock";
import { CopyButton } from "../components/CopyButton";
import { Breadcrumb } from "../components/Breadcrumb";
import { CategoryStamp } from "../components/CategoryStamp";
import { readCreativeStandard } from "../lib/standard";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Creative Standard — Creative Skills Kit",
  description:
    "Coding standard for a creative Next.js project. Copy it into a project and the agent follows it.",
};

export default function StandardPage() {
  const markdown = readCreativeStandard();
  const lineCount = markdown.split("\n").length;

  return (
    <div className="flex max-md:mt-10 flex-1 flex-col bg-background font-sans">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16 sm:px-16">
        <Breadcrumb labels={{ standard: "Creative Standard" }} />

        <header className="flex flex-col gap-4 mt-10 max-md:mt-0">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text32 font-medium uppercase text-balance text-foreground">
              Creative Standard
            </h1>
            <CategoryStamp category="standard" />
          </div>
          <p className="max-w-2xl text12 text-pretty text-foreground/60">
            Rules for a creative Next.js project. Copy the file into the project
            root as CREATIVE-STANDARD.md and tell the agent to follow it.
          </p>
        </header>

        <section id="about" className="flex flex-col gap-3 bg-foreground/4 p-6">
          <h2 className="text12 font-medium uppercase tracking-wider text-foreground/60">
            What it does
          </h2>
          <div className="mt-2 flex max-w-2xl flex-col gap-3">
            <p className="text12 text-pretty text-foreground/70">
              The creative standard is the rule file for a Next.js project. Copy
              it in once, as CREATIVE-STANDARD.md at the project root, and point
              the agent at it. Later chats follow the same rules without you
              writing them out again.
            </p>
            <p className="text12 text-pretty text-foreground/70">
              It keeps the work consistent. Animation uses the useGSAP hook, and
              a text split for animation uses GSAP SplitText. Page and layout
              files stay server components. Type sizes and colors come from one
              shared CSS file. Layout uses flex, each block of the page is a
              section with its own id, the hero carries the page h1, and every
              section carries one h2.
            </p>
            <p className="text12 text-pretty text-foreground/70">
              It also keeps files in the right place. GLSL shaders live in
              Shaders, one folder per effect. Images, video, and models live in
              public. Fonts load through next/font. Spacing uses gap and space
              utilities, in the unit the project already uses. Responsive styles
              wait until you ask for them. Shipped code is lint-clean, including
              Tailwind classes.
            </p>
          </div>
        </section>

        <section id="standard" className="flex flex-col gap-3 bg-foreground/4 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text12 font-medium uppercase tracking-wider text-foreground/60">
              CREATIVE-STANDARD.md
            </h2>
            <div className="flex items-center gap-2">
              <span className="text12 text-foreground/40">{lineCount} lines</span>
              <CopyButton text={markdown} />
            </div>
          </div>
          <CodeBlock
            className="bg-transparent mt-4"
            code={markdown}
            showHeader={false}
            collapsible
            collapsedHeight={460}
          />
        </section>

        <Link
          href="/"
          className="w-fit text12 text-foreground/60 hover:text-foreground flex gap-2 items-center"
        >
          <ArrowLeft className="size-4" /> Back
        </Link>
      </main>
    </div>
  );
}
