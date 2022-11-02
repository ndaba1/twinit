// Inspect package.json for the framework
// If inspecting package.json fails, ask the user to provide the framework
import chalk from "chalk";
import fs from "fs-extra";
import inquirer from "inquirer";
import { createRequire } from "module";
import path from "path";
import { FW_DEPS, FW_FILES } from "./constants.js";
import { getImplementedFrameworks, globExists } from "./index.js";

const require = createRequire(import.meta.url);

// If the framework is not supported, show an error message
export async function detectFramework() {
  let framework = null;
  const dir = process.cwd();
  const file = path.join(dir, "package.json");

  // Wrap in try/catch in case the file does not exist
  try {
    // Trying to detect framework from package.json
    const pkg = require(file);

    Object.keys(FW_DEPS).some((fw) => {
      const keys: string[] = FW_DEPS[fw];
      const found = keys.some((key) => {
        if (key.includes("dev:")) {
          key = key.replace("dev:", "");
          return pkg.devDependencies && pkg.devDependencies[key];
        }
        return pkg.dependencies && pkg.dependencies[key];
      });
      if (found) {
        console.log(chalk.cyan(`Detected framework is: ${chalk.yellow(fw)}`));
        framework = resolveFramework(fw);

        return true;
      }
    });
  } catch (error) {
    // Ignore
  }

  Object.keys(FW_FILES).some((fw) => {
    const files: string[] = FW_FILES[fw];
    const found = files.some((f) => fs.existsSync(path.join(process.cwd(), f)));
    if (found) {
      console.log(chalk.cyan(`Detected framework is: ${chalk.yellow(fw)}`));
      framework = fw;
      return true;
    }
  });

  if (framework) {
    return framework;
  }

  // If no framework is found, prompt the user to choose one
  const fw = await inquirer.prompt([
    {
      type: "list",
      name: "framework",
      required: true,
      message: "Failed to detect a framework. Please choose one:",
      choices: getImplementedFrameworks(),
    },
  ]);

  return resolveFramework(fw.framework);
}

function resolveFramework(fw: string) {
  const usingVite = globExists("vite.config.{js,ts}");
  if (fw === "react" && usingVite) return "vite-react";
  if (fw === "vue" && usingVite) return "vite-vue";
  if (fw === "svelte" && usingVite) return "vite-svelte";
  if (fw === "react") return "cra";

  return fw;
}
