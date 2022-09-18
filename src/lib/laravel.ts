import chalk from "chalk";
import { execa } from "execa";
import { Listr } from "listr2";
import path from "path";
import { copyDirectives, injectGlob, showSuccess } from "../util/index.js";
import detectPackageManager from "../util/pacman.js";

// setup tailwind on laravel
export default async function () {
  const pacman = await detectPackageManager();

  const tasks = new Listr([
    {
      title: "Installing dependencies...",
      task: async () =>
        await pacman.install(["tailwindcss", "postcss", "autoprefixer"]),
    },
    {
      title: "Initializing tailwind config...",
      task: async () => await execa("npx", ["tailwindcss", "init", "-p"]),
    },
    {
      title: "Adding directives and content sources...",
      task: async () => {
        await injectGlob(
          [
            "./resources/**/*.blade.php",
            "./resources/**/*.js",
            "./resources/**/*.vue",
          ],
          "tailwind.config.js"
        );
        await copyDirectives(
          path.join(process.cwd(), "./resources/css", "app.css")
        );
      },
    },
  ]);

  await tasks.run();
  const NEXT_STEPS = `${chalk.bold(" Next steps:")}
   1. Include ${chalk.yellow(
     "@vite('resources/css/app.css')"
   )} in the head of your blade template(s)
   2. Run ${chalk.yellow("npm run dev")} to start the dev server
   3. Start your php server normally
`;

  showSuccess(NEXT_STEPS);
}
