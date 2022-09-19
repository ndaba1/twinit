import chalk from "chalk";
import { execa } from "execa";
import fs from "fs-extra";
import { Listr } from "listr2";
import path from "path";
import { copyDirectives, injectGlob, showSuccess } from "../util/index.js";
import detectPackageManager from "../util/pacman.js";

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
      title: "Adding tailwind directives and content sources...",
      task: async () => {
        await copyDirectives(path.join(process.cwd(), "src", "app.css"));
        await injectGlob(
          ["./src/**/*.{html,js,svelte,ts}"],
          "tailwind.config.cjs"
        );
      },
    },
    {
      title: "Modifying Svelte layout...",
      task: async () => {
        await modifyLayout();
      },
    },
  ]);

  await tasks.run();

  const NEXT_STEPS = `${chalk.bold(" Next steps:")}
   1. Make sure:
    ${chalk.yellow(`preprocess: [
      preprocess({
        postcss: true,
      }),
    ],`)}
    is present in your svelte.config.js
`;

  showSuccess(NEXT_STEPS);
}

async function modifyLayout() {
  const layout = path.join(process.cwd(), "src", "routes", "+layout.svelte");
  if (!fs.existsSync(layout)) {
    const body = `<script> import '../app.css'; </script>'\n <slot />`;
    fs.writeFileSync(layout, body);
    return;
  }
  const body = fs.readFileSync(layout, "utf-8");
  if (body.includes("../app.css")) {
    return;
  }
  const newBody = body.replace("<script>", `<script>\n import '../app.css'\n`);
  fs.writeFileSync(layout, newBody);
}
