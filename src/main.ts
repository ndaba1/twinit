#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";
import fs from "fs-extra";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import { getImplementedFrameworks } from "./util/index.js";
import { detectFramework } from "./util/inspect.js";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { name, description } = require(path.join(
  __dirname,
  "../",
  "package.json"
));

program
  .name(name)
  .version("0.0.2")
  .description(description)
  .argument("[framework]", "The framework you are using")
  .option("-s, --skip-deps", "skip installing tailwindcss dependencies")
  .option(
    "-d, --only-deps",
    "install tailwind deps without initializing config files"
  )
  .action(setup);

program
  .command("list")
  .description("List the supported frameworks")
  .action(() => {
    const frameworks = getImplementedFrameworks();
    console.log(chalk.green.bold("Supported frameworks:"));
    console.log(frameworks.join("\n"));
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function setup(fw: string, options: any) {
  let framework = fw;
  if (!fw) {
    const detected = await detectFramework();
    framework = detected;
  }

  const file = path.join(__dirname, "lib", `${framework}.js`);
  if (!fs.existsSync(file)) {
    console.log(
      chalk.red(
        `  Framework not supported! An implementation for the framework: ${chalk.yellow(
          framework
        )} could not be found.\n\n `
      ),
      "Run: `twinit list` to see a list of the supported frameworks."
    );
    process.exit(1);
  }

  const module = await import(`file://${file}`);
  module.default(options);
}

program.parse();
