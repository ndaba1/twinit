import fs from "fs-extra";
import { DIRECTIVES } from "./constants.js";

export async function copyDirectives(file: string) {
  // Write tailwind directives to the index.css/globals.css file
  const data = await fs.readFile(file, "utf8");
  await fs.writeFile(file, DIRECTIVES.trim() + "\n" + data);
}
