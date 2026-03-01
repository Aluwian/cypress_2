const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://qamid.tmweb.ru/client/index.php',
    projectId: "ad2g4y"
  },
});
