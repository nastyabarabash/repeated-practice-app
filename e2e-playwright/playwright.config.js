module.exports = {
  timeout: 10000,
  retries: 0,
  reporter: "list",
  workers: 5,
  use: {
    baseURL: "http://localhost:7777",
    headless: true,
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: "e2e-headless-chromium",
      use: {
        browserName: "chromium",
      },
    },
  ],
  testDir: "./tests",
  testMatch: ["**/*.spec.js"],
};
