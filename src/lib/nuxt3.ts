import chalk from "chalk";
import { Listr } from "listr2";
import { showSuccess } from "../util/index.js";
import detectPackageManager from "../util/pacman.js";

export default async function () {
  const pacman = await detectPackageManager();
  const tasks = new Listr([
    {
      title: "Installing dependencies...",
      task: async () => await pacman.install(["@nuxtjs/tailwindcss"]),
    },
  ]);

  await tasks.run();
  const NEXT_STEPS = `${chalk.bold(" Next steps:")}
   1. Make sure your nuxt.config resembles the following:
      ${chalk.yellow(
        `export default defineNuxtConfig {
          modules: ['@nuxtjs/tailwindcss']
      }`
      )}
   2. You can visit ${chalk.yellow(
     `https://tailwindcss.nuxtjs.org/getting-started/setup`
   )}
      to see how you can customize your tailwind config
`;
  showSuccess(NEXT_STEPS);
}
