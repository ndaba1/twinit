import chalk from "chalk";
import fs from "fs-extra";
import pkg from "glob";
import { createRequire } from "module";
import path from "path";
import { DIRECTIVES } from "./constants.js";
const { glob } = pkg;

const require = createRequire(import.meta.url);

export async function copyDirectives(file: string) {
  // Write tailwind directives to the index.css/globals.css file
  const directives = DIRECTIVES.trim();
  const data = await fs.readFile(file, "utf8");
  if (!data.includes(directives)) {
    await fs.writeFile(file, directives + "\n\n" + data);
  }
}

export async function injectGlob(globs: string[]) {
  // Import tailwind config file and inject the globs in the `content` field
  const config = require(path.join(process.cwd(), "tailwind.config.js"));
  const sources = config.content || [];
  //  add new sources but only if they don't already exist
  globs.forEach((glob) => {
    if (!sources.includes(glob)) {
      sources.push(glob);
    }
  });
  config.content = sources;
  await fs.writeFile(
    path.join(process.cwd(), "tailwind.config.js"),
    `module.exports = ${JSON.stringify(config, null, 2)}`
  );
}

export function fileExists(file: string) {
  try {
    return fs.existsSync(path.join(process.cwd(), file));
  } catch (error) {
    return false;
  }
}

export function globExists(pattern: string) {
  try {
    return glob.sync(pattern).length > 0;
  } catch (error) {
    return false;
  }
}

export function showSuccess() {
  console.log(
    `${chalk.green(
      "\n Success!"
    )} Tailwindcss has been initialized on your project.\n`
  );
  console.log(chalk.cyan(" Happy tailwind-ing, I guess!\n"));
}
