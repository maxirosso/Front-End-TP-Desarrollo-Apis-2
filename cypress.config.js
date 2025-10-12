const { defineConfig } = require("cypress");
const { startDevServer } = require("@cypress/vite-dev-server");

module.exports = defineConfig({
  component: {
    devServer({ cypressConfig, devServerConfig }) {
      return startDevServer({
        options: devServerConfig,
        viteConfig: require("./vite.config"),
      });
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
