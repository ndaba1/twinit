export const DEPS = ["tailwindcss", "postcss", "autoprefixer"];

export const DIRECTIVES = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

// A list of common frameworks and their package.json keys
// Add meta-frameworks first
export const FW_DEPS = {
  next: ["next"],
  nuxt2: ["nuxt"],
  remix: ["@remix-run/react", "@remix-run/serve"],
  "svelte-kit": ["@sveltejs/kit"],
  gatsby: ["gatsby"],
  solid: ["solid-js"],
  svelte: ["svelte"],
  vue: ["vue"],
  react: ["react", "react-dom"],
  angular: ["@angular/core"],
};

// Config files linked to frameworks
export const FW_FILES = {
  phoenix: ["mix.exs"],
  rails: ["Gemfile"],
  django: ["manage.py", "requirements.txt"],
  laravel: ["server.php", "composer.json", "artisan"],
};

export const COMMON_CSS_FILES = [
  "index.css",
  "global.css",
  "styles.css",
  "tailwind.css",
  "style.css",
  "globals.css",
];
