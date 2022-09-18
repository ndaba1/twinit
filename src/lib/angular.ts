import path from "path";
import { getGenericTasks, injectGlob, showSuccess } from "../util/index.js";

export default async function () {
  const tasks = await getGenericTasks(
    path.join(process.cwd(), "src", "styles.css")
  );

  tasks.add({
    title: "Adding content sources...",
    task: async () => {
      await injectGlob(["./src/**/*.{html,ts}"], "tailwind.config.js");
    },
  });

  await tasks.run();
  showSuccess();
}
