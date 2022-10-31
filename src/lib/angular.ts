import path from "path";
import { runGenericTasks } from "../util/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function (opts: any) {
  await runGenericTasks({
    opts,
    sources: ["./src/**/*.{html,ts}"],
    cssFile: path.join(process.cwd(), "src", "styles.css"),
  });
}
