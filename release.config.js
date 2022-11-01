// eslint-disable-next-line no-undef
module.exports = {
  branches: "main",
  repositoryURL: "https://github.com/ndaba1/twinit",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    "@semantic-release/github",
  ],
};
