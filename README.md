# Creative Skills Kit

An installable kit of creative skills and coding standards, shipped two ways:

- **CLI installer** (`packages/cli`) — a zero-dependency Node.js package you
  run with `npx` to install, list, and validate skills directly into a
  project's `.claude/skills/` folder.
- **Web registry** (`apps/web`) — a Next.js catalog for browsing, searching,
  and reading skills before you install them.

Both read from the same source of truth: the [`skills/`](./skills) directory
at the repo root.

## Layout

```
skills/            Source of truth. One folder per skill, each with a SKILL.md.
packages/core/     Shared registry/parsing/validation logic (zero deps).
packages/cli/      The `csk` CLI (installer + validator), built on core.
apps/web/          Next.js catalog app, built on core.
```

This is an npm workspaces monorepo — one `npm install` at the root links
everything together.

## Getting started

```bash
npm install

# run the web catalog
npm run dev          # http://localhost:3000

# use the CLI (against the local skills/ registry)
npm run csk -- list
npm run csk -- validate
npm run csk -- install creative-project-setup --dir ./.claude/skills
```

## Installing with npx skills

The [`skills`](https://github.com/vercel-labs/skills) CLI can install directly
from this repo, no publishing required:

```bash
npx skills add briskgaurav/creative-skills-kit --list
npx skills add briskgaurav/creative-skills-kit --skill creative-project-setup -g
```

It reads the same `skills/` directory. Project installs land in
`.claude/skills/` for Claude Code and `.agents/skills/` for Cursor, Codex,
and most others; `-g` installs globally instead.

## Authoring a skill

1. Create `skills/<your-skill-slug>/SKILL.md` (kebab-case slug).
2. Add YAML frontmatter with `name` and `description` (required), plus
   optionally `category`, `tags` (e.g. `[copywriting, brand]`), `version`,
   and `license`. Any other Claude-specific frontmatter fields (e.g.
   `disable-model-invocation`) are preserved on install but ignored by the
   catalog. Write the skill body below the frontmatter, same as any Claude
   Skill.
3. Validate it: `npm run csk -- validate <your-skill-slug>`.
4. It shows up automatically in `csk list` and in the web catalog.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Deploy on Vercel](https://nextjs.org/docs/app/building-your-application/deploying)
