import { getGenericTasks, injectGlob, showSuccess } from "../util/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function start(options: any) {
  const tasks = await getGenericTasks(options);

  if (!options.onlyDeps) {
    tasks.add({
      title: "Adding content sources...",
      task: async () => {
        await injectGlob(["./src/**/*.{js,jsx,ts,tsx}"], "tailwind.config.js");
      },
    });
  }

  await tasks.run();
  showSuccess();
}
