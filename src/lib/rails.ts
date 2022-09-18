import chalk from "chalk";
import { execa } from "execa";
import { Listr } from "listr2";
import { copyDirectives, showSuccess } from "../util/index.js";

export default async function () {
  const tasks = new Listr([
    {
      title: "Installing tailwindcss-rails gem...",
      task: async () => {
        await execa("./bin/bundle", ["add", "tailwindcss-rails"]);
        await execa("./bin/rails", ["tailwindcss:install"]);
      },
    },
    {
      title: "Adding tailwind directives...",
      task: async () => {
        await copyDirectives(
          "./app/assets/stylesheets/application.tailwind.css"
        );
      },
    },
  ]);

  await tasks.run();
  showSuccess(` Start your app by running: ${chalk.yellow("`./bin/dev`")}`);
}
