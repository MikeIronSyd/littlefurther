import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { expect, type Locator, type Page } from "@playwright/test";

export interface SyntheticAccount {
  email: string;
  password: string;
}

export async function capture(page: Page, name: string): Promise<void> {
  await mkdir(".local/e2e-captures", { recursive: true });
  await page.screenshot({ path: `.local/e2e-captures/${name}.png`, fullPage: true });
}

let lastAuthenticationFinished = 0;

export async function respectAuthenticationRateLimit(): Promise<void> {
  // Better Auth resets its three-attempt bucket after ten seconds of inactivity
  // from the last allowed request. Respect that boundary without weakening auth.
  const delay = 10_100 - (Date.now() - lastAuthenticationFinished);
  if (delay > 0) await new Promise<void>((resolve) => setTimeout(resolve, delay));
  lastAuthenticationFinished = Date.now();
}

export async function createAccount(
  page: Page,
  displayName = "Browser learner",
): Promise<SyntheticAccount> {
  await respectAuthenticationRateLimit();
  const account = {
    email: `browser-${randomUUID()}@example.test`,
    password: `Synthetic-${randomUUID()}`,
  };
  await page.goto("/");
  await page.getByRole("button", { name: "New here? Create an account", exact: true }).click();
  await page.getByLabel("Display name", { exact: true }).fill(displayName);
  await page.getByLabel("Email address", { exact: true }).fill(account.email);
  await page.getByLabel("Password", { exact: true }).fill(account.password);
  await page.getByRole("button", { name: "Create an account", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Make the dates work for you" })).toBeVisible();
  await page.getByLabel("Timezone", { exact: true }).fill("Africa/Lagos");
  await page.getByRole("button", { name: "Save preferences and continue", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Create a learning plan", exact: true }),
  ).toBeVisible();
  lastAuthenticationFinished = Date.now();
  return account;
}

export async function openManualDraft(
  page: Page,
  goal = "Review my learning notes",
  topics = "Read the first section\nWrite a short explanation",
): Promise<void> {
  await page.getByRole("button", { name: "Create a learning plan", exact: true }).click();
  await page.getByLabel("Learning goal", { exact: true }).fill(goal);
  await page.getByRole("radio", { name: "Use my topics or a starter", exact: true }).check();
  await page
    .getByLabel("Start from", { exact: true })
    .selectOption({ label: "My own topics or course sections" });
  await page.getByLabel("Your topics or sections (optional)", { exact: true }).fill(topics);
  await selectAvailability(page, ["2026-10-08", "2026-10-10"]);
  await page.getByRole("button", { name: "Review draft steps", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Review every step", exact: true })).toBeVisible();
}

// Operate native disclosure summaries, rather than force-filling hidden controls.
export async function revealDetails(control: Locator): Promise<void> {
  const closedAncestor = control.locator("xpath=ancestor::details[not(@open)][last()]");
  while (await closedAncestor.count()) {
    await closedAncestor.locator(":scope > summary").click();
  }
  await expect(control).toBeVisible();
}

export async function openManagement(parent: Locator): Promise<void> {
  const disclosure = parent.locator("details.lifecycle-management").first();
  await expect(disclosure).toBeVisible();
  if (!(await disclosure.evaluate((node) => (node as HTMLDetailsElement).open)))
    await disclosure.locator(":scope > summary").click();
  await expect(disclosure).toHaveAttribute("open", "");
}

export function contextualAction(label: string): RegExp {
  return new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}: `);
}

export async function selectAvailability(
  page: Page,
  dates: string[],
  locale: "en" | "fr" = "en",
): Promise<void> {
  // Filling a native date value represents the operating system's selection.
  // Opening/using the actual native popup is verified separately in browser review.
  const date = page.getByLabel(locale === "fr" ? "Choisir une date" : "Choose a date", {
    exact: true,
  });
  const add = page.getByRole("button", {
    name: locale === "fr" ? "Ajouter la date" : "Add date",
    exact: true,
  });
  for (const value of dates) {
    await date.fill(value);
    await add.click();
  }
}

export async function saveManualPlan(page: Page): Promise<void> {
  await openManualDraft(page);
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.getByText("0 of 2 steps complete", { exact: true })).toBeVisible();
}

export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport + 1);
  expect(widths.body).toBeLessThanOrEqual(widths.viewport + 1);
}

export async function expectOnlyUiStorage(page: Page): Promise<void> {
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys.every((key) => ["capstone.ui.theme", "capstone.ui.sidebar"].includes(key))).toBe(
    true,
  );
}
