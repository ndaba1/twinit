// Inspect package.json for the framework
// If inspecting package.json fails, ask the user to provide the framework
// If successful, run the setup for the framework

import inquirer from "inquirer";
import path from "path";

// A list of common frameworks and their package.json keys
const frameworks = {
  react: ["react", "react-dom"],
  vue: ["vue"],
  svelte: ["svelte"],
  next: ["next"],
  gatsby: ["gatsby"],
  nuxt: ["nuxt"],
  sapper: ["sapper"],
};

// If the framework is not supported, show an error message
export async function detectFramework() {
  let framework = null;
  const dir = process.cwd();
  const file = path.join(dir, "package.json");

  // Wrap in try/catch in case the file does not exist
  try {
    const pkg = await import(`file://${file}`);
    console.log(pkg);

    Object.keys(frameworks).forEach((fw) => {
      const keys: string[] = frameworks[fw];
      const found = keys.some((key) => pkg.dependencies[key] !== undefined);
      if (found) {
        console.log(`Found ${fw}`);
        framework = fw;
      }
    });
  } catch (error) {
    // Ignore
  }

  if (framework) {
    return framework;
  }

  // If no framework is found, prompt the user to choose one
  const fw = await inquirer.prompt([
    {
      type: "list",
      name: "framework",
      message: "Failed to detect a framework. Please choose one:",
      choices: Object.keys(frameworks),
    },
  ]);

  return fw.framework;
}
