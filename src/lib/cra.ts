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
      await injectGlob(["./src/**/*.{js,jsx,ts,tsx}"], "tailwind.config.js");
    },
  });

  await tasks.run();
  showSuccess();
}
