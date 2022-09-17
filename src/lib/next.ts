import fs from "fs-extra";
import path from "path";
import {
  getCssFilePath,
  getGenericTasks,
  injectGlob,
  showSuccess,
} from "../util/index.js";

export default async function start() {
  const tasks = await getGenericTasks(await getCssFilePath());
  tasks.add({
    title: "Adding content sources...",
    task: async () => {
      await injectGlob(getSources(), "tailwind.config.js");
    },
  });

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
