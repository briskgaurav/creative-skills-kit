import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

/**
 * Walks up from `apps/web` to the monorepo root `CREATIVE-STANDARD.md`.
 */
function resolveStandardPath(): string {
  let dir = process.cwd();
  for (let i = 0; i < 5; i++) {
    const candidate = join(dir, "CREATIVE-STANDARD.md");
    if (existsSync(candidate)) return candidate;
    dir = resolve(dir, "..");
  }
  throw new Error("Could not locate CREATIVE-STANDARD.md above " + process.cwd());
}

export function readCreativeStandard() {
  return readFileSync(resolveStandardPath(), "utf8");
}
