import { execa } from "execa";
import fs from "fs-extra";
import { Listr } from "listr2";
import path from "path";
import { copyDirectives, injectGlob, showSuccess } from "../util/index.js";
import detectPackageManager from "../util/pacman.js";

export default async function start() {
  const pacman = await detectPackageManager();

  // setup listr tasks
  const tasks = new Listr([
    {
      title: "Installing dependencies...",
      task: async () =>
        await pacman.install(["tailwindcss", "postcss", "autoprefixer"]),
    },
    {
      title: "Initializing tailwind config...",
      task: async () => await execa("npx", ["tailwindcss", "init", "-p"]),
    },
    {
      title: "Copying tailwind directives...",
      task: async () => await copyDirectives(getCssFile()),
    },
    {
      title: "Adding content sources...",
      task: async () => {
        await injectGlob(["./src/**/*.{js,jsx,ts,tsx}"]);
      },
    },
  ]);

  await tasks.run();
  showSuccess();
}

function getCssFile() {
  const files = ["index.css", "global.css", "styles.css"];
  for (const file of files) {
    const p = path.join(process.cwd(), "src", file);
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}
