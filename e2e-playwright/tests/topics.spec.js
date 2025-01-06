const { test, expect } = require("@playwright/test");

test("Main page has expected headings.", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h2")).toHaveText(["Description", "Statistics", "Links"]);
});