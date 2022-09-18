#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";
import fs from "fs-extra";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import { FW_DEPS, FW_FILES } from "./util/constants.js";
import { detectFramework } from "./util/inspect.js";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { name, version, description } = require(path.join(
  __dirname,
  "../",
  "package.json"
));

program
  .name(name)
  .version(version)
  .description(description)
  .argument("[framework]", "The framework you are using")
  .action(setup);

program
  .command("list")
  .description("List the supported frameworks")
  .action(() => {
    console.log([...Object.keys(FW_DEPS), ...Object.keys(FW_FILES)].join("\n"));
  });

async function setup(fw: string) {
  let framework = fw;
  if (!fw) {
    const detected = await detectFramework();
    framework = detected;
  }

  const file = path.join(__dirname, "lib", `${framework}.js`);
  if (!fs.existsSync(file)) {
    console.log(
      chalk.red(
        `Framework not supported! An implementation for the framework: ${framework} could not be found.\n `
      ),
      "Run: `twinit list` to see a list of the supported frameworks."
    );
    process.exit(1);
  }

  const module = await import(`file://${file}`);
  module.default();
}

program.parse();
