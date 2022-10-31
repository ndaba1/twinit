import fs from "fs-extra";
import path from "path";
import { getGenericTasks, injectGlob, showSuccess } from "../util/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function start(options: any) {
  const tasks = await getGenericTasks(options);

  if (!options.onlyDeps) {
    tasks.add({
      title: "Adding content sources...",
      task: async () => {
        await injectGlob(getSources(), "tailwind.config.js");
      },
    });
  }

  await tasks.run();
  showSuccess();
}

function getSources() {
  const dir = process.cwd();

  // Check for a src directory
  if (fs.existsSync(path.join(dir, "src"))) {
    return ["./src/**/*.{js,jsx,ts,tsx}"];
  }

  // Otherwise, use pages, components...
  return ["./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"];
}
