import { mkdir, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { SKILL_BUNDLE, SKILL_NAME } from "./skill-bundle.ts";

export const targetSkillDir = (baseDir: string): string => join(baseDir, SKILL_NAME);

export const skillExists = async (baseDir: string): Promise<boolean> => {
  try {
    await stat(targetSkillDir(baseDir));
    return true;
  } catch {
    return false;
  }
};

export const writeBundle = async (baseDir: string): Promise<readonly string[]> => {
  const root = targetSkillDir(baseDir);
  await Promise.all(
    SKILL_BUNDLE.map(async (f) => {
      const dest = join(root, f.relativePath);
      await mkdir(dirname(dest), { recursive: true });
      await writeFile(dest, f.contents);
    }),
  );
  return SKILL_BUNDLE.map((f) => join(root, f.relativePath));
};
