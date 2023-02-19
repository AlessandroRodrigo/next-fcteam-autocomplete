import { test, expect } from "@playwright/test";

test("should create appointments for a date interval", async ({ page }) => {
  await page.route("**/v1/users/**", (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([
        {
          _id: "60c7b1f9b9d3a00015e9b1b0",
          company: "60c7b1f9b9d3a00015e9b1af",
          name: "John Doe",
        },
      ]),
    });
  });

  await page.route("**/projects**", (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([
        {
          name: "Test project",
          _id: "60c7b1f9b9d3a00015e9b1b0",
        },
      ]),
    });
  });

  await page.route("**/customers**", (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([
        {
          name: "Test customer",
          company: "60c7b1f9b9d3a00015e9b1b0",
        },
      ]),
    });
  });

  await page.route("**/appointments**", (route) => {
    route.fulfill({
      status: 200,
    });
  });

  await page.goto("http://localhost:3000");
  const tokenInput = await page.getByPlaceholder(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  );
  const descriptionInput = await page.getByPlaceholder(
    "Ex.: Meeting with client, Worked on project, etc."
  );
  const dateInput = await page.getByPlaceholder("Pick dates range");

  const customerSelect = await page.getByRole("searchbox", {
    name: "Choose customer",
  });

  const projectSelect = await page.getByRole("searchbox", {
    name: "Choose project",
  });

  await tokenInput.click();
  await tokenInput.fill("test");

  await customerSelect.click();
  await page.getByText("Test customer").click();

  await projectSelect.click();
  await page.getByText("Test project").click();

  await descriptionInput.click();
  await descriptionInput.fill("Test description");

  await dateInput.click();
  await page.locator(".mantine-DateRangePicker-calendarHeaderLevel").click();
  await page.locator(".mantine-DateRangePicker-calendarHeaderLevel").click();
  await page.getByRole("button", { name: "2023" }).click();
  await page.getByRole("button", { name: "Feb" }).click();
  await page.getByRole("button", { name: "15" }).click();
  await page.getByRole("button", { name: "17" }).click();

  await page.getByPlaceholder("--").nth(0).fill("8");
  await page.getByPlaceholder("--").nth(1).fill("00");
  await page.getByPlaceholder("--").nth(2).fill("12");
  await page.getByPlaceholder("--").nth(3).fill("00");

  await page.getByRole("button", { name: "Create appointments" }).click();

  await page.waitForSelector("text=Appointment created");

  expect(await page.isVisible("text=Appointment created")).toBe(true);
});
