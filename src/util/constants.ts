export const DEPS = ["tailwindcss", "postcss", "autoprefixer"];

export const DIRECTIVES = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

// A list of common frameworks and their package.json keys
// Add meta-frameworks first
export const FRAMEWORKS = {
  next: ["next"],
  nuxt: ["nuxt"],
  gatsby: ["gatsby"],
  svelte: ["svelte"],
  solid: ["solid-js"],
  vue: ["vue"],
  react: ["react", "react-dom"],
  angular: ["@angular/core"],
};

export const COMMON_CSS_FILES = [
  "index.css",
  "global.css",
  "styles.css",
  "tailwind.css",
  "style.css",
  "globals.css",
];
