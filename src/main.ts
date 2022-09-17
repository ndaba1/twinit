#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { detectFramework } from "./util/inspect.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .name("twinit")
  .version("0.1.0")
  .description("A CLI for setting up tailwindcss on your framework of choice")
  .argument("[framework]", "The framework you are using")
  .action(setup);

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
        `Framework not supported! An implementation for the framework: ${framework} could not be found`
      )
    );
    process.exit(1);
  }

  const module = await import(`file://${file}`);
  module.default();
}

program.parse();
