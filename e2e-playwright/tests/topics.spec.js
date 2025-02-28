const { test, expect } = require("@playwright/test");

test("Main page has expected headings.", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h2")).toHaveText(["Description", "Statistics", "Links"]);
});

test("Can create a topic.", async ({ page }) => {
  await page.goto("/auth/login");
  await page.fill("input[name='email']", "admin@admin.com");
  await page.fill("input[name='password']", "admin");
  await page.click("input[type='submit']");

  await page.goto("/topics");
  await page.waitForSelector("input[name='name']", { timeout: 5000 });
  const topicName = `Test topic 1`;
  await page.fill("input[name='name']", topicName);
  await page.click("input[type='submit']");
  await expect(page.locator(`text="${topicName}"`)).toBeVisible();
});

test("Admin can delete a topic", async ({ page }) => {
  const topicId = 1;
  const topicName = 'Topic to be deleted';

  await page.goto('/auth/login');
  await page.fill("input[name='email']", "admin@admin.com");
  await page.fill("input[name='password']", "admin");
  await page.click("input[type='submit']");
  
  await page.waitForLoadState('networkidle');
  await page.goto(`/topics/${topicId}`);
  await page.waitForSelector('input[type="submit"]', { 
    timeout: 10000, 
    state: 'visible' 
  });
  await page.click('input[type="submit"]');
  const deletedTopicLocator = page.locator(`text="${topicName}"`);
  await expect(deletedTopicLocator).not.toBeVisible();
  await page.goto('/topics');
  await expect(deletedTopicLocator).not.toBeVisible();
});

test("Non-admin user cannot delete a topic", async ({ page }) => {
  await page.goto('/auth/login');
  await page.fill("input[name='email']", "c@c.com");
  await page.fill("input[name='password']", "1111");
  await page.click("input[type='submit']");
  
  await page.waitForLoadState("networkidle");
  await page.goto('/topics');

  const deleteButton = page.locator("input[value='Delete topic']");
  expect(await deleteButton.isVisible()).toBe(false);
});

test("User can navigate back to topics list", async ({ page }) => {
  await page.goto('/auth/login');
  await page.fill("input[name='email']", "c@c.com");
  await page.fill("input[name='password']", "1111");
  await page.click("input[type='submit']");
  
  await page.goto('/topics/1');
  await page.click("input[type='submit']");
  await page.waitForLoadState("networkidle");
  expect(await page.url()).toContain("/topics");
});

test("Admin can delete a question", async ({ page }) => {
  const topicId = 1;
  const questionId = 1;
  const question = 'Question to be deleted';

  await page.goto('/auth/login');
  await page.fill("input[name='email']", "admin@admin.com");
  await page.fill("input[name='password']", "admin");
  await page.click("input[type='submit']");

  await page.waitForLoadState('networkidle');
  await page.goto(`/topics/${topicId}/questions/${questionId}`);
  await page.waitForSelector('input[type="submit"]', { 
    timeout: 10000, 
    state: 'visible' 
  });
  await page.click('input[type="submit"]');
  const deletedQuestionLocator = page.locator(`text="${question}"`);
  await expect(deletedQuestionLocator).not.toBeVisible();
  await page.goto(`/topics/${topicId}`);
  await expect(deletedQuestionLocator).not.toBeVisible();
});

test("Admin can delete an answer option", async ({ page }) => {
  const topicId = 1;
  const questionId = 1;
  const answerOption = '1q1o1'; 

  await page.goto('/auth/login');
  await page.fill("input[name='email']", "admin@admin.com");
  await page.fill("input[name='password']", "admin");
  await page.click("input[type='submit']");

  await page.waitForLoadState('networkidle');
  await page.goto(`/topics/${topicId}/questions/${questionId}`);
  await page.waitForSelector("h3:has-text('Answer Options:')", { timeout: 5000 });
  const answerOptionLocator = page.locator(`li:has(label:has-text("${answerOption}"))`);
  await expect(answerOptionLocator).toBeVisible();
  await page.waitForTimeout(2000);
  await page.locator(`li:has(label:has-text("${answerOption}")) form[action*="/delete"] input[type="submit"]`).click();
  await expect(answerOptionLocator).not.toBeVisible();
});

test("Can add a question for a topic", async ({ page }) => {
  const topicId = 1;
  const questionAdded = `Test question 1`;

  await page.goto('/auth/login');
  await page.fill("input[name='email']", "admin@admin.com");
  await page.fill("input[name='password']", "admin");
  await page.click("input[type='submit']");

  await page.waitForSelector("h1", { timeout: 5000 });
  await page.goto(`/topics/${topicId}`);
  await page.waitForSelector(`form[action='/topics/${topicId}/questions']`, { timeout: 5000 });
  await page.fill("textarea[name='question_text']", questionAdded);
  await page.click("input[type='submit']");
  await page.waitForLoadState('networkidle', { timeout: 15000 });
  const questionLocator = page.locator(`ul li:has-text("${questionAdded}")`);
  const isVisible = await questionLocator.isVisible();
  expect(isVisible).toBe(false);
});

test("User can navigate back to questions", async ({ page }) => {
  await page.goto('/auth/login');
  await page.fill("input[name='email']", "c@c.com");
  await page.fill("input[name='password']", "1111");
  await page.click("input[type='submit']");
  
  await page.goto('/topics/1/questions/1');
  await page.click("input[type='submit']");
  await page.waitForLoadState("networkidle");
  expect(await page.url()).toContain("/topics/1");
});

test("User can navigate back to main page", async ({ page }) => {
  await page.goto('/auth/login');
  await page.fill("input[name='email']", "c@c.com");
  await page.fill("input[name='password']", "1111");
  await page.click("input[type='submit']");
  
  await page.goto('/topics/');
  await page.click("input[type='submit']");
  await page.waitForLoadState("networkidle");
  expect(await page.url()).toContain("/");
});