export const DEPS = ["tailwindcss", "postcss", "autoprefixer"];

export const DIRECTIVES = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

// A list of common frameworks and their package.json keys
// Add meta-frameworks fist
export const FRAMEWORKS = {
  next: ["next"],
  nuxt: ["nuxt"],
  react: ["react", "react-dom"],
  vue: ["vue"],
  svelte: ["svelte"],
  gatsby: ["gatsby"],
  solid: ["solid-js"],
};
