# creative-skills-kit

Installable skills and coding standards for Claude, Cursor, and other agents.

```bash
npx creative-skills-kit install creative-project-setup
```

Source: [github.com/briskgaurav/creative-skills-kit](https://github.com/briskgaurav/creative-skills-kit)

## Install

```bash
npx creative-skills-kit list

# Claude Code (this project)
npx creative-skills-kit install creative-project-setup

# Cursor (this project)
npx creative-skills-kit install creative-project-setup --dir .agents/skills

# overwrite
npx creative-skills-kit install creative-project-setup --force
```

Global:

```bash
npx creative-skills-kit install creative-project-setup --dir ~/.claude/skills
npx creative-skills-kit install creative-project-setup --dir ~/.cursor/skills
```

Or from GitHub:

```bash
npx skills add briskgaurav/creative-skills-kit --skill creative-project-setup
```

## Commands

```text
npx creative-skills-kit list
npx creative-skills-kit install <slug> [--dir <folder>] [--force]
npx creative-skills-kit validate [slug]
npx creative-skills-kit help
```

---

Made by **Gaurav Verma**, Creative Developer  
[github.com/briskgaurav](https://github.com/briskgaurav)
