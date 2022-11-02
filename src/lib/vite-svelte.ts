import chalk from "chalk";
import fs from "fs-extra";
import { Listr } from "listr2";
import path from "path";
import { getConfigFiles, runGenericTasks, showSuccess } from "../util/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function (opts: any) {
  await runGenericTasks({
    opts,
    sources: ["./index.html", "./src/**/*.{svelte,js,ts}"],
    cssFile: path.join(process.cwd(), "src", "app.css"),
    twFile: "tailwind.config.cjs",
    showSuccess: false,
  });

  console.log(chalk.cyan("\nRunning additional tasks...\n"));
  const additional = new Listr([
    {
      title: "Updating postcss config...",
      task: async () => await updatePostCssConfig(),
    },
  ]);

  await additional.run();
  const NEXT_STEPS = `${chalk.bold(" Next steps:")}
   1. Update your vite config to resemble the following:
      ${chalk.yellow(`
      import postcss from "./${getConfigFiles().postcssFile}" ${chalk.cyan(
        "// Add this line"
      )}
      import { defineConfig } from 'vite'
      import { svelte } from '@sveltejs/vite-plugin-svelte'

      // https://vitejs.dev/config/
      export default defineConfig({
        plugins: [svelte()],
        css: {   ${chalk.cyan("// Add this line")}
          postcss
        }
      })
`)}
`;
  showSuccess(NEXT_STEPS);
}

async function updatePostCssConfig() {
  const { postcssFile, twFile } = getConfigFiles();
  const data = `
import tailwind from 'tailwindcss'
import tailwindConfig from './${twFile}'
import autoprefixer from 'autoprefixer'

export default {
  plugins:[tailwind(tailwindConfig),autoprefixer]
}
`;

  fs.writeFileSync(path.join(process.cwd(), postcssFile), data, {
    encoding: "utf-8",
  });
}
