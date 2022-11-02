import chalk from "chalk";
import fs from "fs-extra";
import { Listr } from "listr2";
import path from "path";
import { runGenericTasks, showSuccess } from "../util/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function (opts: any) {
  await runGenericTasks({
    opts,
    sources: ["./src/**/*.{html,js,svelte,ts}"],
    showSuccess: false,
    cssFile: path.join(process.cwd(), "src", "app.css"),
  });

  console.log(chalk.cyan("\nRunning additional tasks...\n"));
  const tasks = new Listr([
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
