import { expect, type Page, test } from "@playwright/test";
import type { LearningPlan, PlanDetail } from "../../src/shared/contracts.js";
import {
  contextualAction,
  createAccount,
  openManagement,
  openManualDraft,
  respectAuthenticationRateLimit,
} from "./helpers.js";

test.afterEach(async ({ page: _page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) await respectAuthenticationRateLimit();
});

async function saveSingleStep(page: Page, goal: string): Promise<void> {
  await openManualDraft(page, goal, "Read one small section");
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.getByText("0 of 1 step complete", { exact: true })).toBeVisible();
}

async function plans(page: Page): Promise<LearningPlan[]> {
  const response = await page.request.get("/api/plans");
  expect(response.ok()).toBe(true);
  return ((await response.json()) as { plans: LearningPlan[] }).plans;
}

test("UR07: cancelling dirty journey switching restores the selected journey and preserves its confirmation", async ({
  page,
}) => {
  await createAccount(page);
  await saveSingleStep(page, "First retained journey");
  await page.getByRole("link", { name: "Journeys", exact: true }).click();
  await saveSingleStep(page, "Second retained journey");
  await page.getByRole("button", { name: "Start study session", exact: true }).click();
  await page.getByRole("button", { name: "Mark this step complete", exact: true }).click();
  await expect(
    page.getByText("Step completed. Your earlier effort is still recorded.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Choose the next action", exact: true }).click();
  const before = await plans(page);
  const first = before.find((plan) => plan.goal === "First retained journey");
  const second = before.find((plan) => plan.goal === "Second retained journey");
  if (!first || !second) throw new Error("Expected both isolated journeys");
  const saved = await page.request.get(`/api/plans/${second.id}`);
  const secondBefore = (await saved.json()) as PlanDetail;
  const completed = page.locator(".path-step.completed");
  await openManagement(completed);
  await completed.getByRole("button", { name: contextualAction("Mark as unfinished") }).click();
  const confirmation = completed.locator(".lifecycle-confirmation");
  await expect(confirmation).toBeVisible();
  let dismissals = 0;
  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm");
    dismissals += 1;
    await dialog.dismiss();
  });
  const selection = page.getByRole("combobox", { name: "Choose a journey", exact: true });
  await selection.selectOption(first.id);
  expect(dismissals).toBe(1);
  await expect(selection).toHaveValue(second.id);
  await expect(page.getByRole("heading", { name: second.goal, exact: true })).toBeVisible();
  await expect(confirmation).toBeVisible();
  expect((await (await page.request.get(`/api/plans/${second.id}`)).json()) as PlanDetail).toEqual(
    secondBefore,
  );
  await confirmation.getByRole("button", { name: contextualAction("Cancel") }).click();
  await selection.selectOption(first.id);
  await expect(selection).toHaveValue(first.id);
  await expect(page.getByRole("heading", { name: first.goal, exact: true })).toBeVisible();
});

test("UR07: account Escape restores summary focus; outside pointer and focus preserve the outside control", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await createAccount(page);
  const summary = page.getByLabel("Account", { exact: true });
  const popover = page.locator(".account-menu");
  await summary.click();
  await page.getByRole("button", { name: "Preferences", exact: true }).focus();
  await page.keyboard.press("Escape");
  await expect(popover).not.toHaveAttribute("open", "");
  await expect(summary).toBeFocused();
  await summary.click();
  const theme = page.getByRole("button", { name: "Switch to dark mode", exact: true });
  await theme.click();
  await expect(popover).not.toHaveAttribute("open", "");
  await expect(
    page.getByRole("button", { name: "Switch to light mode", exact: true }),
  ).toBeFocused();
  await summary.click();
  const language = page.getByRole("combobox", { name: "Language", exact: true });
  await language.focus();
  await expect(popover).not.toHaveAttribute("open", "");
  await expect(language).toBeFocused();
  await expect(
    page.getByRole("button", { name: "Create a learning plan", exact: true }),
  ).toBeVisible();
});

test("UR06/07: contextual management keeps Open prominent and confirmation visible after its triggers collapse", async ({
  page,
}) => {
  await createAccount(page);
  const goal = "Manage a clearly named journey";
  await saveSingleStep(page, goal);
  await page.getByRole("link", { name: "Journeys", exact: true }).click();
  const row = page.locator(".journey-row");
  const disclosure = row.locator("details.lifecycle-management");
  const summary = disclosure.locator(":scope > summary");
  await expect(summary).toHaveAccessibleName(`Manage plan: ${goal}`);
  await expect(
    row.getByRole("button", { name: `Open journey: ${goal}`, exact: true }),
  ).toBeVisible();
  await expect(disclosure).not.toHaveAttribute("open", "");
  await expect(
    row.getByRole("button", { name: `Archive plan: ${goal}`, exact: true }),
  ).toBeHidden();
  await summary.press("Enter");
  const archive = disclosure.getByRole("button", { name: `Archive plan: ${goal}`, exact: true });
  const language = page.getByRole("combobox", { name: /^(Language|Langue)$/ });
  const expectVisibleActionLabels = async (locale: "en" | "fr"): Promise<void> => {
    for (const [parent, label] of [
      [row, locale === "en" ? "Open journey" : "Ouvrir le parcours"],
      [disclosure, locale === "en" ? "Archive plan" : "Archiver le programme"],
      [disclosure, locale === "en" ? "Delete permanently" : "Supprimer définitivement"],
    ] as const) {
      const control = parent.getByRole("button", { name: `${label}: ${goal}`, exact: true });
      await expect(control).toBeVisible();
      // The contextual accessible name must not replace the visible translation binding.
      await expect(control).toHaveText(label);
    }
  };
  await expectVisibleActionLabels("en");
  await language.selectOption("fr");
  await expect(summary).toHaveAccessibleName(`Gérer le programme : ${goal}`);
  await expectVisibleActionLabels("fr");
  await language.selectOption("en");
  await expect(summary).toHaveAccessibleName(`Manage plan: ${goal}`);
  await expectVisibleActionLabels("en");
  await archive.click();
  const confirmation = row.locator(".lifecycle-confirmation");
  await expect(confirmation).toBeVisible();
  expect(await confirmation.locator("xpath=ancestor::details").count()).toBe(0);
  await expect(
    confirmation.getByRole("button", { name: `Archive plan: ${goal}`, exact: true }),
  ).toBeVisible();
  await language.selectOption("fr");
  await expectVisibleActionLabels("fr");
  await expect(
    confirmation.getByRole("button", { name: `Archiver le programme: ${goal}`, exact: true }),
  ).toHaveText("Archiver le programme");
  await expect(
    confirmation.getByRole("button", { name: `Annuler: ${goal}`, exact: true }),
  ).toHaveText("Annuler");
  await language.selectOption("en");
  await expectVisibleActionLabels("en");
  await expect(
    confirmation.getByRole("button", { name: `Archive plan: ${goal}`, exact: true }),
  ).toHaveText("Archive plan");
  await expect(
    confirmation.getByRole("button", { name: `Cancel: ${goal}`, exact: true }),
  ).toHaveText("Cancel");
  await summary.press("Enter");
  await expect(disclosure).not.toHaveAttribute("open", "");
  await expect(confirmation).toBeVisible();
  await confirmation.getByRole("button", { name: `Cancel: ${goal}`, exact: true }).click();
  await expect(confirmation).toHaveCount(0);
  await expect(disclosure).toHaveAttribute("open", "");
  await expect(archive).toBeFocused();
  expect((await plans(page)).find((plan) => plan.goal === goal)?.archivedAt).toBeNull();
});
