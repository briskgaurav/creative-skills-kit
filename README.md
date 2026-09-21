# Creative Skills Kit

Installable skills and coding standards for **Claude**, **Cursor**, and other AI agents.

Repo: [github.com/briskgaurav/creative-skills-kit](https://github.com/briskgaurav/creative-skills-kit)

---

## What is this?

A skill is a `SKILL.md` file your agent can follow — like a coding standard, a project setup guide, or a workflow.

This kit:

1. Keeps those skills in one place
2. Lets you install any of them into a project with one command

---

## Install a skill

Pick a skill name (slug), then run:

```bash
npx creative-skills-kit install creative-project-setup
```

That copies it into `.claude/skills/` (Claude Code, this project).

**Cursor** — same skill, different folder:

```bash
npx creative-skills-kit install creative-project-setup --dir .agents/skills
```

**See every skill:**

```bash
npx creative-skills-kit list
```

Already installed? Add `--force` to overwrite.

---

## Install from GitHub

Same skills, straight from this repo:

```bash
npx skills add briskgaurav/creative-skills-kit --list
npx skills add briskgaurav/creative-skills-kit --skill creative-project-setup
```

---

## Add your own skill

1. Create `skills/my-skill-name/SKILL.md`
2. Add this at the top:

```yaml
---
name: My Skill Name
description: What this skill is for.
---
```

3. Write the skill below that, then check it:

```bash
npx creative-skills-kit validate my-skill-name
```

---

## This repo

```
skills/         the skills (one folder each)
packages/cli/   the installer: npx creative-skills-kit
packages/core/  shared parsing / validation
apps/web/       the catalog website
```

```bash
npm install
npm run dev    # catalog → http://localhost:3000
```

npm: [creative-skills-kit](https://www.npmjs.com/package/creative-skills-kit)

---

Made by **Gaurav Verma**, creative developer  
[github.com/briskgaurav](https://github.com/briskgaurav) · [github.com/briskgaurav/creative-skills-kit](https://github.com/briskgaurav/creative-skills-kit)
