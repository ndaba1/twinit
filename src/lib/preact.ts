import { runGenericTasks } from "../util/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function start(opts: any) {
  await runGenericTasks({
    opts,
    sources: ["./src/**/*.{js,jsx,ts,tsx}"],
    twFile: "tailwind.config.cjs",
  });
}
