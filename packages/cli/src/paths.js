import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const CLI_PKG_DIR = dirname(dirname(fileURLToPath(import.meta.url))); // packages/cli

/**
 * Resolves where the skill sources live.
 *
 * Precedence:
 *   1. an explicit `--source <dir>` flag
 *   2. a `skills/` folder bundled alongside this package (the shape a
 *      published, standalone npm package will have)
 *   3. the monorepo's root `skills/` folder (local development)
 *
 * @param {{ source?: string }} [opts]
 * @returns {string} absolute path to a skills root
 */
export function resolveSkillsRoot(opts = {}) {
  if (opts.source) {
    const explicit = resolve(process.cwd(), opts.source);
    if (!existsSync(explicit)) {
      throw new Error(`--source directory not found: ${explicit}`);
    }
    return explicit;
  }

  const bundled = join(CLI_PKG_DIR, "skills");
  if (existsSync(bundled)) return bundled;

  const monorepoRoot = resolve(CLI_PKG_DIR, "..", "..", "skills");
  if (existsSync(monorepoRoot)) return monorepoRoot;

  throw new Error(
    "Could not locate a skills/ directory. Pass --source <dir> to point at one explicitly."
  );
}

/**
 * Resolves the target directory skills get installed into.
 * Defaults to `.claude/skills` in the current working directory, matching
 * where Claude Code discovers project-level skills.
 *
 * @param {{ dir?: string }} [opts]
 * @returns {string}
 */
export function resolveInstallTarget(opts = {}) {
  return resolve(process.cwd(), opts.dir ?? ".claude/skills");
}
