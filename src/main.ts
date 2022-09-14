#!/usr/bin/env node

import { program } from "commander";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .name("twinit")
  .version("0.1.0")
  .description("A CLI for setting up tailwindcss on your framework of choice")
  .argument("[framework]", "The framework you are using")
  .action(setup);

async function setup(fw) {
  if (!fw) {
    console.log("No preset provided, detecting...");
    // try to detect the framework
    return;
  }

  const file = path.join(__dirname, "lib", `${fw}.js`);
  if (!fs.existsSync(file)) {
    console.log("Framework not supported!");
    process.exit(1);
  }

  const module = await import(`file://${file}`);
  console.log(module);
}

program.parse();
