import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { getSkill } from "./registry.js";

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_NAME_LENGTH = 64;
const MAX_DESCRIPTION_LENGTH = 1024;

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid
 * @property {string[]} errors
 * @property {string[]} warnings
 */

/**
 * Validates a skill directory against the creative-skills-kit conventions:
 * kebab-case slug, a SKILL.md with `name` + `description` frontmatter, and
 * reasonable length limits so catalog cards stay readable.
 *
 * @param {string} skillsRoot
 * @param {string} slug
 * @returns {ValidationResult}
 */
export function validateSkill(skillsRoot, slug) {
  const errors = [];
  const warnings = [];
  const dir = join(skillsRoot, slug);

  if (!SLUG_RE.test(slug)) {
    errors.push(`Directory name "${slug}" must be lowercase kebab-case (e.g. "my-skill").`);
  }

  if (!existsSync(dir) || !statSync(dir).isDirectory()) {
    errors.push(`"${slug}" is not a directory under ${skillsRoot}.`);
    return { valid: false, errors, warnings };
  }

  const skillMdPath = join(dir, "SKILL.md");
  if (!existsSync(skillMdPath)) {
    errors.push(`Missing ${slug}/SKILL.md.`);
    return { valid: false, errors, warnings };
  }

  let skill;
  try {
    skill = getSkill(skillsRoot, slug);
  } catch (err) {
    errors.push(`Failed to parse ${slug}/SKILL.md: ${err.message}`);
    return { valid: false, errors, warnings };
  }

  if (!skill.name) {
    errors.push("Frontmatter is missing required field: name.");
  } else if (skill.name.length > MAX_NAME_LENGTH) {
    errors.push(`Frontmatter "name" exceeds ${MAX_NAME_LENGTH} characters.`);
  }

  if (!skill.description) {
    errors.push("Frontmatter is missing required field: description.");
  } else if (skill.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(`Frontmatter "description" exceeds ${MAX_DESCRIPTION_LENGTH} characters.`);
  }

  if (!skill.body) {
    warnings.push("SKILL.md has no body content after the frontmatter block.");
  }

  return { valid: errors.length === 0, errors, warnings };
}
