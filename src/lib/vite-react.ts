// Vite-react similar to CRA with very minor differences
import path from "path";
import { getGenericTasks, injectGlob, showSuccess } from "../util/index.js";

export default async function () {
  const tasks = await getGenericTasks(
    path.join(process.cwd(), "src", "index.css")
  );

  tasks.add({
    title: "Adding content sources...",
    task: async () => {
      await injectGlob(
        ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
        "tailwind.config.cjs"
      );
    },
  });

  await tasks.run();
  showSuccess();
}
