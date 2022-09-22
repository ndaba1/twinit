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
  "svelte-kit": ["dev:@sveltejs/kit", "dev:svelte"],
  gatsby: ["gatsby"],
  astro: ["astro"],
  solid: ["solid-js"],
  svelte: ["svelte"],
  vue: ["vue"],
  react: ["react", "react-dom"],
  preact: ["preact", "preact-render-to-string"],
  lit: ["lit"],
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
