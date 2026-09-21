import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { listSkillSlugs, getSkill, validateSkill } from "@creative-skills-kit/core";
import { resolveSkillsRoot, resolveInstallTarget } from "../paths.js";

/**
 * @param {{ source?: string, dir?: string, force?: boolean, skills: string[] }} opts
 * @returns {boolean} true if every requested skill installed successfully
 */
export function runInstall(opts) {
  const skillsRoot = resolveSkillsRoot(opts);
  const target = resolveInstallTarget(opts);

  const requested = opts.skills.length ? opts.skills : listSkillSlugs(skillsRoot);
  if (requested.length === 0) {
    console.log(`No skills found in ${skillsRoot} and none were named.`);
    return false;
  }

  mkdirSync(target, { recursive: true });

  let allOk = true;
  for (const slug of requested) {
    const result = validateSkill(skillsRoot, slug);
    if (!result.valid) {
      console.error(`[skip] ${slug}: invalid skill`);
      for (const err of result.errors) console.error(`    ${err}`);
      allOk = false;
      continue;
    }

    const skill = getSkill(skillsRoot, slug);
    const destination = join(target, slug);

    if (existsSync(destination) && !opts.force) {
      console.error(`[skip] ${slug}: already installed at ${destination} (use --force to overwrite)`);
      allOk = false;
      continue;
    }

    cpSync(skill.dir, destination, { recursive: true });
    console.log(`[installed] ${slug} -> ${destination}`);
  }

  return allOk;
}
