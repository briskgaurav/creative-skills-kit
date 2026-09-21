import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parseFrontmatter } from "./frontmatter.js";

/**
 * @typedef {Object} SkillMeta
 * @property {string} slug        Directory name / install identifier.
 * @property {string} name        Display name (frontmatter `name`, falls back to slug).
 * @property {string} description Short description shown in the catalog.
 * @property {string} [category]
 * @property {string[]} [tags]
 * @property {string} [version]
 * @property {string} [license]
 * @property {string} dir         Absolute path to the skill directory.
 * @property {string} body        SKILL.md content after the frontmatter block.
 */

/**
 * Lists every skill folder under `skillsRoot` that contains a SKILL.md file.
 * @param {string} skillsRoot
 * @returns {string[]} sorted slugs
 */
export function listSkillSlugs(skillsRoot) {
  if (!existsSync(skillsRoot)) return [];
  return readdirSync(skillsRoot)
    .filter((entry) => {
      const full = join(skillsRoot, entry);
      return statSync(full).isDirectory() && existsSync(join(full, "SKILL.md"));
    })
    .sort((a, b) => a.localeCompare(b));
}

/**
 * Reads and parses a single skill by directory slug.
 * @param {string} skillsRoot
 * @param {string} slug
 * @returns {SkillMeta}
 */
export function getSkill(skillsRoot, slug) {
  const dir = join(skillsRoot, slug);
  const skillMdPath = join(dir, "SKILL.md");
  if (!existsSync(skillMdPath)) {
    throw new Error(`No SKILL.md found for "${slug}" in ${skillsRoot}`);
  }

  const raw = readFileSync(skillMdPath, "utf8");
  const { data, body } = parseFrontmatter(raw);

  return {
    slug,
    name: typeof data.name === "string" && data.name ? data.name : slug,
    description: typeof data.description === "string" ? data.description : "",
    category: typeof data.category === "string" ? data.category : undefined,
    tags: Array.isArray(data.tags) ? data.tags : undefined,
    version: typeof data.version === "string" ? data.version : undefined,
    license: typeof data.license === "string" ? data.license : undefined,
    dir,
    body: body.trim(),
  };
}

/**
 * Lists every skill's parsed metadata, sorted by slug.
 * @param {string} skillsRoot
 * @returns {SkillMeta[]}
 */
export function listSkills(skillsRoot) {
  return listSkillSlugs(skillsRoot).map((slug) => getSkill(skillsRoot, slug));
}
