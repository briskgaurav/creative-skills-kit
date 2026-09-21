import { runList } from "./commands/list.js";
import { runInstall } from "./commands/install.js";
import { runValidate } from "./commands/validate.js";

const HELP = `csk - creative-skills-kit installer

Usage:
  csk list [--source <dir>] [--json]
  csk install <slug> [<slug>...] [--source <dir>] [--dir <target>] [--force]
  csk validate [<slug>...] [--source <dir>]
  csk help

Commands:
  list       Show every skill available in the registry.
  install    Copy one or more skills into --dir (default: .claude/skills).
  validate   Check skill(s) against the SKILL.md frontmatter conventions.

Options:
  --source <dir>   Skills registry to read from (defaults to the bundled
                    skills/ folder, or the monorepo root skills/ in dev).
  --dir <target>   Install destination (default: ./.claude/skills).
  --force          Overwrite an already-installed skill.
  --json           (list only) print machine-readable JSON.
`;

/**
 * @param {string[]} argv  process.argv.slice(2)
 */
export function main(argv) {
  const [command, ...rest] = argv;
  const { positionals, flags } = parseArgs(rest);

  switch (command) {
    case "list":
      runList({ source: flags.source, json: Boolean(flags.json) });
      return;

    case "install": {
      const ok = runInstall({
        source: flags.source,
        dir: flags.dir,
        force: Boolean(flags.force),
        skills: positionals,
      });
      if (!ok) process.exitCode = 1;
      return;
    }

    case "validate": {
      const ok = runValidate({ source: flags.source, skills: positionals });
      if (!ok) process.exitCode = 1;
      return;
    }

    case "help":
    case "--help":
    case "-h":
    case undefined:
      console.log(HELP);
      return;

    default:
      console.error(`Unknown command: ${command}\n`);
      console.log(HELP);
      process.exitCode = 1;
  }
}

/**
 * Tiny flag parser: `--flag value` or `--flag` (boolean) plus positionals.
 * @param {string[]} args
 */
function parseArgs(args) {
  const positionals = [];
  const flags = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positionals.push(arg);
    }
  }

  return { positionals, flags };
}
