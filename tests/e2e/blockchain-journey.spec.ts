import { expect, test } from "@playwright/test";

test("view, mine, and validate journey", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Blockchain Visualizer")).toBeVisible();
  await expect(page.getByText("Block #0")).toBeVisible();
  await expect(page.getByLabel("Mine block button")).toBeEnabled();
  await page.getByLabel("Block data input").fill("Alice pays Bob 10");
  await page.getByLabel("Mine block button").click();
  await expect(page.getByText(/Block #\s*1/)).toBeVisible({ timeout: 20000 });
  await page.getByLabel("Edit block 0").click();
  await page.getByLabel("Edit block 0 data").fill("Tampered data");
  await page.getByLabel("Save block 0 edit").click();
  await expect(page.getByText("Chain Invalid")).toBeVisible();
});
