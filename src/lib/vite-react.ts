// Vite-react similar to CRA with very minor differences
import {
  getCssFilePath,
  getGenericTasks,
  injectGlob,
  showSuccess,
} from "../util/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function (options: any) {
  const tasks = await getGenericTasks(await getCssFilePath(), options);

  if (!options.onlyDeps) {
    tasks.add({
      title: "Adding content sources...",
      task: async () => {
        await injectGlob(
          ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
          "tailwind.config.cjs"
        );
      },
    });
  }

  await tasks.run();
  showSuccess();
}
