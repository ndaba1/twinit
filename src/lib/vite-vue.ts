import {
  getCssFilePath,
  getGenericTasks,
  injectGlob,
  showSuccess,
} from "../util/index.js";

export default async function () {
  const tasks = await getGenericTasks(await getCssFilePath());

  tasks.add({
    title: "Adding content sources...",
    task: async () => {
      await injectGlob(
        ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
        "tailwind.config.cjs"
      );
    },
  });

  await tasks.run();
  showSuccess();
}
