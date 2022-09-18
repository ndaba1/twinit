import fs from "fs-extra";
import { Listr } from "listr2";
import { createRequire } from "module";
import path from "path";
import { showSuccess } from "../util/index.js";
import detectPackageManager from "../util/pacman.js";

const require = createRequire(import.meta.url);

// Install tailwindcss on nuxt
export default async function () {
  // quite simple: add plugin
  const pacman = await detectPackageManager();

  const tasks = new Listr([
    {
      title: "Installing nuxt-tailwind plugin...",
      task: async () => await pacman.install(["@nuxtjs/tailwindcss"]),
    },
    {
      title: "Updating nuxt.config.js...",
      task: async () => {
        await updateNuxtConfig();
      },
    },
  ]);

  await tasks.run();
  showSuccess();
}

async function updateNuxtConfig() {
  // TODO: Review this
  const nuxtConfigPath = path.join(process.cwd(), "nuxt.config.js");
  // weird hack to replace the module.exports with export default and vice versa
  let contents = await fs.readFile(nuxtConfigPath, "utf-8");
  contents = contents.replace("export default", "module.exports =");
  // write contents to temp file
  const tempPath = path.join(process.cwd(), "temp.js");
  await fs.createFile(tempPath);
  await fs.writeFile(tempPath, contents);

  const nuxtConfig = require(tempPath);
  nuxtConfig.buildModules.push("@nuxtjs/tailwindcss");

  await fs.writeFile(
    nuxtConfigPath,
    "export default " + JSON.stringify(nuxtConfig, null, 2)
  );

  await fs.remove(tempPath);
}
