export const DEPS = ["tailwindcss", "postcss", "autoprefixer"];

export const DIRECTIVES = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

// A list of common frameworks and their package.json keys
export const FRAMEWORKS = {
  react: ["react", "react-dom"],
  vue: ["vue"],
  svelte: ["svelte"],
  next: ["next"],
  gatsby: ["gatsby"],
  nuxt: ["nuxt"],
  sapper: ["sapper"],
};
