// Vite-react similar to CRA with very minor differences
import { runGenericTasks } from "../util/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function (opts: any) {
  await runGenericTasks({
    opts,
    sources: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    twFile: "tailwind.config.cjs",
  });
}
