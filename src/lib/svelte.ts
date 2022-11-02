import fs from "fs";
import { Listr } from "listr2";
import path from "path";
import { DEPS } from "../util/constants.js";
import {
  copyDirectives,
  fileExists,
  injectGlob,
  showSuccess,
} from "../util/index.js";
import detectPackageManager from "../util/pacman.js";

export default async function () {
  const files = ["public/index.css", "public/tailwind.css"];
  files.forEach((f) => {
    if (!fileExists(f)) {
      fs.writeFileSync(f, "");
    }
  });

  const pacman = await detectPackageManager();
  const tasks = new Listr([
    {
      title: "Updating package.json...",
      task: async () => {
        await updateScripts();
      },
    },
    {
      title: "Installing dependencies...",
      task: async () => {
        await pacman.install([...DEPS, "concurrently"]);
      },
    },
    {
      title: "Initializing tailwind config...",
      task: async () => {
        await pacman.init();
      },
    },
    {
      title: "Adding tailwind directives and content sources...",
      task: async () => {
        await injectGlob(
          ["./src/**/*.{html,js,svelte,ts}", "./public/index.html"],
          "tailwind.config.js"
        );
        await copyDirectives(
          path.join(process.cwd(), "public", "tailwind.css")
        );
      },
    },
    {
      title: "Updating index.html...",
      task: async () => {
        await updateIndex();
      },
    },
  ]);

  await tasks.run();
  showSuccess();
}

async function updateScripts() {
  const pkgPath = path.join(process.cwd(), "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  pkg.scripts = {
    ...pkg.scripts,
    "dev:css": "tailwind -i public/tailwind.css -o public/index.css -w",
    "build:css": "tailwind -m -i public/tailwind.css -o public/index.css",
    build: "npm run build:css && rollup -c",
    dev: 'concurrently "npm run dev:css" "rollup -c -w"',
  };
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

async function updateIndex() {
  // Update index.html
  const indexPath = path.join(process.cwd(), "public", "index.html");
  const index = fs.readFileSync(indexPath, "utf-8");
  const updatedIndex = index.replace(
    /<meta charset="utf-8">|<meta charset='utf-8'>/,
    '<meta charset="utf-8">\n <link rel="stylesheet" href="/index.css">'
  );
  fs.writeFileSync(indexPath, updatedIndex);
}
