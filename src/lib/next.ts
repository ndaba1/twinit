import fs from "fs-extra";
import path from "path";
import { runGenericTasks } from "../util/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function start(opts: any) {
  await runGenericTasks({
    opts,
    sources: getSources(),
  });
}

function getSources() {
  const dir = process.cwd();

  // Check for a src directory
  if (fs.existsSync(path.join(dir, "src"))) {
    return ["./src/**/*.{js,jsx,ts,tsx}"];
  }

  // Otherwise, use pages, components...
  return ["./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"];
}
