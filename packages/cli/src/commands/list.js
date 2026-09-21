import { listSkills } from "@creative-skills-kit/core";
import { resolveSkillsRoot } from "../paths.js";

/**
 * @param {{ source?: string, json?: boolean }} opts
 */
export function runList(opts) {
  const skillsRoot = resolveSkillsRoot(opts);
  const skills = listSkills(skillsRoot);

  if (opts.json) {
    console.log(JSON.stringify(skills, null, 2));
    return;
  }

  if (skills.length === 0) {
    console.log(`No skills found in ${skillsRoot}`);
    return;
  }

  console.log(`Skills available in ${skillsRoot}:\n`);
  for (const skill of skills) {
    const tag = skill.category ? ` [${skill.category}]` : "";
    console.log(`  ${skill.slug}${tag}`);
    if (skill.description) {
      console.log(`    ${skill.description}`);
    }
  }
  console.log(`\n${skills.length} skill(s). Install with: csk install <slug> [<slug>...]`);
}
