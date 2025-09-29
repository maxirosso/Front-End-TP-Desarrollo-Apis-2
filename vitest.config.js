const { defineConfig } = require("cypress");
const viteConfig = require("./vite.config");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig,
    },
  },
});