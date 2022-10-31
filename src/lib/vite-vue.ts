import { runGenericTasks } from "../util/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function (opts: any) {
  await runGenericTasks({
    opts,
    sources: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    twFile: "tailwind.config.cjs",
  });
}
