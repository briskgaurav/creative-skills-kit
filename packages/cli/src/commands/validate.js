import { listSkillSlugs, validateSkill } from "@creative-skills-kit/core";
import { resolveSkillsRoot } from "../paths.js";

/**
 * @param {{ source?: string, skills?: string[] }} opts
 * @returns {boolean} true if every checked skill is valid
 */
export function runValidate(opts) {
  const skillsRoot = resolveSkillsRoot(opts);
  const slugs = opts.skills && opts.skills.length ? opts.skills : listSkillSlugs(skillsRoot);

  if (slugs.length === 0) {
    console.log(`No skills found in ${skillsRoot}`);
    return true;
  }

  let allValid = true;
  for (const slug of slugs) {
    const result = validateSkill(skillsRoot, slug);
    allValid = allValid && result.valid;

    const status = result.valid ? "PASS" : "FAIL";
    console.log(`[${status}] ${slug}`);
    for (const err of result.errors) console.log(`    error:   ${err}`);
    for (const warn of result.warnings) console.log(`    warning: ${warn}`);
  }

  console.log(
    allValid
      ? `\n${slugs.length} skill(s) valid.`
      : `\nValidation failed. Fix the errors above before publishing.`
  );

  return allValid;
}
