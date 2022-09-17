import { execaSync } from "execa";
import fs from "fs-extra";
import inquirer from "inquirer";
import path from "path";
import semver from "semver";

class Pacman {
  constructor(private name: string) {}

  async install(args: string[]) {
    const cmd = this.name === "npm" ? "install" : "add";
    const options = ["-D", "--silent", "--loglevel", "error"];
    const result = execaSync(this.name, [cmd, ...options, ...args], {
      stdio: "inherit",
    });
    if (result.failed) {
      throw new Error(result.stderr);
    }
  }
}

export default async function detectPackageManager() {
  const lockfile = getFromLockfile();
  if (lockfile) {
    return new Pacman(lockfile);
  }

  // If no lockfile is found, try to detect the package manager from global installation
  const pacman = getFromGlobalInstallation();
  if (pacman) {
    return new Pacman(pacman);
  }

  // If no package manager is found, prompt the user to choose one
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "pacman",
      message: "Failed to detect a package manager. Please choose one:",
      choices: ["npm", "yarn", "pnpm"],
    },
  ]);

  return new Pacman(answer.pacman);
}

function getFromLockfile() {
  const dir = process.cwd();

  if (fs.existsSync(path.join(dir, "yarn.lock"))) {
    return "yarn";
  } else if (fs.existsSync(path.join(dir, "package-lock.json"))) {
    return "npm";
  } else if (fs.existsSync(path.join(dir, "pnpm-lock.yaml"))) {
    return "pnpm";
  } else {
    return null;
  }
}

function getFromGlobalInstallation() {
  let pacman = null;
  const values = ["yarn", "npm", "pnpm"];
  for (const value of values) {
    try {
      const { stdout } = execaSync(value, ["--version"]);
      semver.valid(String(stdout)) && (pacman = value);
    } catch (error) {
      // Ignore
    }
  }

  return pacman;
}
