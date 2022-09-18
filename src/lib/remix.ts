import { execa } from "execa";
import fs from "fs-extra";
import pkg from "glob";
import { Listr } from "listr2";
import { createRequire } from "module";
import path from "path";
import { DEPS } from "../util/constants.js";
import { copyDirectives, injectGlob, showSuccess } from "../util/index.js";
import detectPackageManager from "../util/pacman.js";
const { glob } = pkg;

const require = createRequire(import.meta.url);

export default async function () {
  const pacman = await detectPackageManager();
  const tasks = new Listr([
    {
      title: "Updating package.json scripts...",
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
        await execa("npx", ["tailwindcss", "init"]);
      },
    },
    {
      title: "Adding directives and content sources...",
      task: async () => {
        await copyDirectives(path.join(process.cwd(), "./styles", "app.css"));
        await injectGlob(["./app/**/*.{js,ts,jsx,tsx}"], "tailwind.config.js");
      },
    },
    {
      title: "Updating root.jsx...",
      task: async () => {
        await updateRoot();
      },
    },
  ]);

  await tasks.run();
  showSuccess();
}

async function updateScripts() {
  // Update scripts
  const packageJson = require(path.join(process.cwd(), "package.json"));
  packageJson.scripts = {
    ...packageJson.scripts,
    build: "npm run build:css && remix build",
    "build:css": "tailwindcss -m -i ./styles/app.css -o app/styles/app.css",
    dev: 'concurrently "npm run dev:css" "remix dev"',
    "dev:css": "tailwindcss -w -i ./styles/app.css -o app/styles/app.css",
  };
  await fs.writeFile(
    path.join(process.cwd(), "package.json"),
    JSON.stringify(packageJson, null, 2)
  );
}

async function updateRoot() {
  // Update root.jsx
  const matches = glob.sync("./app/root.{jsx,tsx}");
  if (matches.length === 0) {
    throw new Error("Could not find root file");
  }
  const rootFile = matches[0];
  const rootFilePath = path.join(process.cwd(), rootFile);
  let root = await fs.readFile(rootFilePath, "utf-8");

  // Add import statement
  const importStatement = `import styles from "./styles/app.css"`;

  // Add export statement
  const exportStatement = `
export function links() {
  return [{ rel: "stylesheet", href: styles }]
}
`;

  if (!root.includes(importStatement)) {
    root = importStatement + "\n" + root;
  }

  if (!root.includes(exportStatement)) {
    root = root + exportStatement;
  }

  await fs.writeFile(rootFilePath, root);
}
