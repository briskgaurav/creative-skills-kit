import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const cliDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoSkills = join(cliDir, "..", "..", "skills");
const bundled = join(cliDir, "skills");

if (!existsSync(repoSkills)) {
  throw new Error(`skills/ not found at ${repoSkills}`);
}

rmSync(bundled, { recursive: true, force: true });
cpSync(repoSkills, bundled, { recursive: true });
console.log(`Bundled ${repoSkills} -> ${bundled}`);
