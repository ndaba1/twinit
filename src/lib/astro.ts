import { execa } from "execa";
import { showSuccess } from "../util/index.js";
import detectPackageManager from "../util/pacman.js";

// Add tailwindcss to Astro
export default async function () {
  const pacman = await detectPackageManager();
  pacman.name === "npm" && (pacman.name = "npx");

  console.log("Adding TailwindCSS to Astro...");
  await execa(pacman.name, ["astro", "add", "tailwind"], { stdio: "inherit" });
  showSuccess();
}
