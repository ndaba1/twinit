import path from "path";
import { getGenericTasks, injectGlob, showSuccess } from "../util/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function (options: any) {
  const tasks = await getGenericTasks(
    options,
    path.join(process.cwd(), "src", "styles.css")
  );

  if (!options.onlyDeps) {
    tasks.add({
      title: "Adding content sources...",
      task: async () => {
        await injectGlob(["./src/**/*.{html,ts}"], "tailwind.config.js");
      },
    });
  }

  await tasks.run();
  showSuccess();
}
