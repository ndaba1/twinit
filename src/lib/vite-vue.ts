import { getGenericTasks, injectGlob, showSuccess } from "../util/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function (options: any) {
  const tasks = await getGenericTasks(options);

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
