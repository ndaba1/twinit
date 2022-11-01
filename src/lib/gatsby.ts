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

// Gatsbyjs implementation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function (options: any = {}) {
  const pacman = await detectPackageManager();
  const tasks = new Listr([]);

  if (!options.skipDeps) {
    tasks.add({
      title: "Installing dependencies...",
      task: async () => {
        await pacman.install([...DEPS, "gatsby-plugin-postcss"]);
      },
    });
  }

  if (!options.onlyDeps) {
    tasks.add([
      {
        title: "Initializing tailwind config...",
        task: async () => {
          await execa("npx", ["tailwindcss", "init", "-p"]);
        },
      },
      {
        title: "Adding tailwind directives...",
        task: async () => {
          await copyDirectives(
            path.join(process.cwd(), "src", "styles", "globals.css")
          );
        },
      },
      {
        title: "Adding content sources...",
        task: async () => {
          await injectGlob(
            ["./src/**/*.{js,jsx,ts,tsx}"],
            "tailwind.config.js"
          );
        },
      },
      {
        title: "Modifying gatsby config...",
        task: async () => {
          await modifyGatsbyConfig();
          await modifyGatsbyBrowser();
        },
      },
    ]);
  }

  await tasks.run();
  showSuccess();
}

async function modifyGatsbyConfig() {
  const matches = glob.sync("./gatsby-config.{js,cjs,mjs,ts}");
  if (matches.length === 0) {
    throw new Error("Failed to detect gatsby config file.");
  }
  const configPath = path.join(process.cwd(), matches[0]);
  const gatsbyConfig = require(configPath);

  gatsbyConfig.plugins.unshift("gatsby-plugin-postcss");
  await fs.writeFile(
    configPath,
    `module.exports = ${JSON.stringify(gatsbyConfig, null, 2)}`
  );
}

async function modifyGatsbyBrowser() {
  const matches = glob.sync("./gatsby-browser.{js,cjs,mjs,ts}");
  if (matches.length === 0) {
    throw new Error("Failed to detect gatsby browser file.");
  }
  const browserPath = path.join(process.cwd(), matches[0]);
  if (fs.existsSync(browserPath)) {
    const browserFile = await fs.readFile(browserPath, "utf-8");
    if (browserFile.includes("import './src/styles/globals.css';")) {
      return;
    } else {
      await fs.writeFile(
        browserPath,
        `import './src/styles/globals.css';\n${browserFile}`
      );
    }
  } else {
    await fs.writeFile(browserPath, "import './src/styles/globals.css';");
  }
}
