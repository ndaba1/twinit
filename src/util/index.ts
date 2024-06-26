import chalk from "chalk";
import fs from "fs-extra";
import { glob } from "glob";
import inquirer from "inquirer";
import { Listr } from "listr2";
import path from "path";
import { fileURLToPath } from "url";
import { COMMON_CSS_FILES, DEPS, DIRECTIVES } from "./constants.js";
import detectPackageManager from "./pacman.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runGenericTasks(config: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  opts: any;
  cssFile?: string;
  sources: string[];
  twFile?: string;
  showSuccess?: boolean;
}) {
  // eslint-disable-next-line prefer-const
  let { opts, sources, twFile, cssFile } = config;
  if (!cssFile) {
    cssFile = await getCssFilePath();
  }
  if (!fileExists(twFile)) {
    twFile = getConfigFiles().twFile;
  }

  const pacman = await detectPackageManager();
  const tasks = new Listr([]);

  if (!opts.skipDeps) {
    tasks.add({
      title: "Installing dependencies...",
      task: async () => await pacman.install([...DEPS]),
    });
  }
  if (!opts.onlyDeps) {
    tasks.add([
      {
        title: "Initializing tailwind config...",
        task: async () => await pacman.init(),
      },
      {
        title: "Adding tailwind directives...",
        task: async () => await copyDirectives(cssFile),
      },
    ]);

    if (sources) {
      tasks.add({
        title: "Adding content sources...",
        task: async () => {
          await injectGlob(sources, twFile || "tailwind.config.js");
        },
      });
    }
  }

  await tasks.run();
  if (config.showSuccess !== false) {
    showSuccess();
  }
}

export async function getCssFilePath() {
  for (const file of COMMON_CSS_FILES) {
    const dirs = ["src", "styles", "src/styles"];
    const paths = dirs.map((d) => path.join(process.cwd(), d, file));
    const matches = paths.filter((p) => fs.existsSync(p));
    if (matches.length) {
      return matches[0];
    }
  }

  const getFile = async () => {
    const { file } = await inquirer.prompt({
      type: "input",
      name: "file",
      message:
        "Failed to detect your main css file. Please enter the relative path to it:",
    });
    if (fileExists(file)) return file;
    return await getFile();
  };

  return await getFile();
}

export async function copyDirectives(file: string) {
  if (file === "skip") return;
  // Write tailwind directives to the index.css/globals.css file
  const directives = DIRECTIVES.trim();

  if (!fs.existsSync(file)) {
    // Create the file if it doesn't exist
    await fs.createFile(file);
    await fs.writeFile(file, directives);
  } else {
    const data = await fs.readFile(file, "utf8");
    if (!data.includes(directives)) {
      await fs.writeFile(file, directives + "\n\n" + data);
    }
  }
}

export async function injectGlob(globs: string[], cfgFile: string) {
  const configContents = await fs.readFile(
    path.join(process.cwd(), cfgFile),
    "utf8"
  );

  if (!configContents.includes("content")) {
    console.log(
      chalk.red(
        "The tailwind config file does not have a `content` field. Please add it manually and re-run this command."
      )
    );
    process.exit(1);
  }

  const modifiedConfig = configContents.replace(
    /content: \[.*\]/,
    `content: [${globs.map((g) => `'${g}'`).join(", ")}]`
  );

  await fs.writeFile(path.join(process.cwd(), cfgFile), modifiedConfig);
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

export function showSuccess(msg = "") {
  console.log(
    `${chalk.green(
      "\n Success!"
    )} Tailwindcss has been initialized on your project.\n`
  );
  msg && console.log(msg);
  console.log(chalk.cyan(" Happy tailwind-ing, I guess!\n"));
}

export function getImplementedFrameworks() {
  const matches = glob.sync("../lib/*.js", {
    cwd: __dirname,
    absolute: true,
  });

  return matches.map((match) => path.basename(match, ".js"));
}

export function getConfigFiles() {
  let twFile = "tailwind.config.js";
  let postcssFile = "postcss.config.js";
  if (fileExists("tailwind.config.cjs")) {
    twFile = "tailwind.config.cjs";
  }
  if (fileExists("postcss.config.cjs")) {
    postcssFile = "postcss.config.cjs";
  }

  return {
    twFile,
    postcssFile,
  };
}
