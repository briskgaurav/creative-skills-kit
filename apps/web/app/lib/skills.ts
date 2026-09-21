import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { listSkills as listSkillsCore, getSkill as getSkillCore } from "@creative-skills-kit/core";

/**
 * Walks up from `apps/web` to find the monorepo's root `skills/` directory.
 * In production this app will typically be deployed with the whole repo
 * checked out, so the relative layout (`apps/web` -> `../../skills`) holds.
 */
function resolveSkillsRoot(): string {
  let dir = process.cwd();
  for (let i = 0; i < 5; i++) {
    const candidate = join(dir, "skills");
    if (existsSync(candidate)) return candidate;
    dir = resolve(dir, "..");
  }
  throw new Error("Could not locate a skills/ directory above " + process.cwd());
}

export function listSkills() {
  return listSkillsCore(resolveSkillsRoot());
}

export function getSkill(slug: string) {
  return getSkillCore(resolveSkillsRoot(), slug);
}

/**
 * Skill frontmatter often sets `name` to the directory slug, which reads badly
 * as a heading. Title-case it when it is still slug-shaped; leave real names be.
 */
export function displayName(name: string) {
  if (!/^[a-z0-9]+(?:[-_][a-z0-9]+)+$/.test(name)) return name;
  return name.replace(/[-_]+/g, " ").replace(/\b\p{Ll}/gu, (c) => c.toUpperCase());
}
