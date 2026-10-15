import { expect, type Locator, type Page, test } from "@playwright/test";
import type { AiAssistResponse } from "../../src/shared/ai-contracts.js";
import type { LearningPlan, PlanDetail } from "../../src/shared/contracts.js";
import {
  createAccount,
  expectNoHorizontalOverflow,
  saveManualPlan,
  selectAvailability,
} from "./helpers.js";

async function plans(page: Page): Promise<LearningPlan[]> {
  const response = await page.request.get("/api/plans");
  expect(response.ok()).toBe(true);
  return ((await response.json()) as { plans: LearningPlan[] }).plans;
}

async function savedDetail(page: Page): Promise<PlanDetail> {
  const plan = (await plans(page))[0];
  if (!plan) throw new Error("Expected the isolated learner's saved journey");
  const response = await page.request.get(`/api/plans/${plan.id}`);
  expect(response.ok()).toBe(true);
  return (await response.json()) as PlanDetail;
}

async function openManualInput(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Create a learning plan", exact: true }).click();
  await page.getByLabel("Learning goal", { exact: true }).fill("Make progress on my own notes");
  await page
    .getByLabel("Your topics or sections (optional)", { exact: true })
    .fill("Read one section");
}

async function targetAndFocus(page: Page, control: Locator): Promise<void> {
  const box = await control.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await control.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(control).toBeFocused();
  expect(
    await control.evaluate((node) => Number.parseFloat(getComputedStyle(node).outlineWidth)),
  ).toBeGreaterThanOrEqual(2);
}

test("PC01/02: calendar selections are explicit, unique, ordered, localized and saved as ISO dates", async ({
  page,
}) => {
  await createAccount(page);
  await openManualInput(page);
  const picker = page.getByRole("group", { name: "Dates you are available", exact: true });
  const date = page.locator('input[name="availabilityDate"]');
  const add = page.getByRole("button", { name: "Add date", exact: true });
  await expect(date).toHaveAttribute("type", "date");
  await expect(date).toHaveAttribute("min", "2000-01-01");
  await expect(date).toHaveAttribute("max", "2100-12-31");
  await expect(picker.getByText("No dates selected yet.", { exact: true })).toBeVisible();
  await add.press("Enter");
  await expect(date).toHaveAttribute("aria-invalid", "true");
  await expect(date).toBeFocused();
  await expect(date).toHaveAccessibleDescription(/Choose a date to add\./);
  await date.fill("1999-12-31");
  await add.press("Enter");
  await expect(date).toHaveAccessibleDescription(
    /Choose a valid date from 2000-01-01 to 2100-12-31\./,
  );
  await expect(picker.locator(".availability-selected > li")).toHaveCount(0);
  await selectAvailability(page, ["2026-10-10", "2026-10-08"]);
  await expect(date).not.toHaveAttribute("aria-invalid", "true");
  await expect(picker.getByText("2 of 366 dates selected", { exact: true })).toBeVisible();
  expect(await picker.locator(".availability-selected button").allTextContents()).toEqual([
    "Remove",
    "Remove",
  ]);
  await expect(picker.locator(".availability-selected button").first()).toHaveAccessibleName(
    "Remove Oct 8, 2026",
  );
  await expect(picker.locator(".availability-selected button").last()).toHaveAccessibleName(
    "Remove Oct 10, 2026",
  );
  await selectAvailability(page, ["2026-10-08"]);
  await expect(picker.locator(".availability-selected > li")).toHaveCount(2);
  await expect(picker.getByRole("status").filter({ hasText: "already selected" })).toHaveText(
    "Oct 8, 2026 is already selected.",
  );
  await date.fill("2026-10-12");
  await expect(picker.locator(".availability-selected > li")).toHaveCount(2);
  await page.getByLabel("Language", { exact: true }).selectOption("fr");
  await expect(date).toHaveAccessibleName("Choisir une date");
  await expect(date).toHaveValue("2026-10-12");
  const frenchPicker = page.getByRole("group", { name: "Vos dates disponibles", exact: true });
  await expect(
    frenchPicker.getByRole("button", { name: "Retirer 8 oct. 2026", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Ajouter la date", exact: true }).press("Enter");
  await expect(frenchPicker.locator(".availability-selected > li")).toHaveCount(3);
  await expect(plans(page)).resolves.toHaveLength(0);
  await page.getByRole("button", { name: "Vérifier les étapes proposées", exact: true }).click();
  await expect(page.getByLabel("Date d’étude", { exact: true })).toHaveValue("2026-10-08");
  await expect(plans(page)).resolves.toHaveLength(0);
  await page.getByRole("button", { name: "Confirmer et enregistrer", exact: true }).click();
  await expect(page.getByText("0 étapes terminées sur 1", { exact: true })).toBeVisible();
  expect((await savedDetail(page)).plan.availabilityDates).toEqual([
    "2026-10-08",
    "2026-10-10",
    "2026-10-12",
  ]);
  await page.reload();
  await page.getByRole("button", { name: "Modifier le parcours", exact: true }).click();
  await expect(page.locator(".availability-selected > li")).toHaveCount(3);
  await expect(
    page.getByRole("button", { name: "Retirer 12 oct. 2026", exact: true }),
  ).toBeVisible();
});

test("PC01/02: pending-date guidance distinguishes choosing from adding in English and French", async ({
  page,
}) => {
  await createAccount(page);
  await openManualInput(page);
  const picker = page.locator(".availability-picker");
  const date = page.locator('input[name="availabilityDate"]');
  for (const locale of ["en", "fr"] as const) {
    if (locale === "fr") await page.getByLabel("Language", { exact: true }).selectOption("fr");
    const empty = picker.getByText(
      locale === "en" ? "No dates selected yet." : "Aucune date sélectionnée.",
      { exact: true },
    );
    const pending = picker.getByText(
      locale === "en"
        ? "Click Add date to include this date."
        : "Cliquez sur Ajouter la date pour inclure cette date.",
      { exact: true },
    );
    const zeroCount = locale === "en" ? "0 of 366 dates selected" : "0 dates sélectionnées sur 366";
    await expect(empty).toBeVisible();
    await expect(pending).toBeHidden();
    await date.fill("2026-10-14");
    await expect(empty).toBeHidden();
    await expect(pending).toBeVisible();
    await expect(picker.locator(".availability-count")).toHaveText(zeroCount);
    await expect(picker.locator(".availability-selected > li")).toHaveCount(0);
    await date.fill("");
    await expect(empty).toBeVisible();
    await expect(pending).toBeHidden();
    await selectAvailability(page, ["2026-10-14"], locale);
    await expect(empty).toBeHidden();
    await expect(pending).toBeHidden();
    await expect(picker.locator(".availability-selected > li")).toHaveCount(1);
    await expect(picker.locator(".availability-count")).toHaveText(
      locale === "en" ? "1 of 366 dates selected" : "1 dates sélectionnées sur 366",
    );
    await picker
      .getByRole("button", {
        name: locale === "en" ? "Remove Oct 14, 2026" : "Retirer 14 oct. 2026",
        exact: true,
      })
      .click();
    await expect(date).toHaveValue("2026-10-14");
    await expect(empty).toBeHidden();
    await expect(pending).toBeVisible();
    await expect(picker.locator(".availability-count")).toHaveText(zeroCount);
    await expect(picker.locator(".availability-selected > li")).toHaveCount(0);
    await date.fill("");
    await expect(empty).toBeVisible();
    await expect(pending).toBeHidden();
  }
  expect(await plans(page)).toHaveLength(0);
});

test("PC01/05: rejected pending calendar input does not block saving selected dates or remain disabled", async ({
  page,
}) => {
  await createAccount(page);
  await openManualInput(page);
  await selectAvailability(page, ["2026-10-14"]);
  const date = page.getByLabel("Choose a date", { exact: true });
  await date.fill("1999-12-31");
  await page.getByRole("button", { name: "Add date", exact: true }).click();
  await expect(date).toHaveAccessibleDescription(
    /Choose a valid date from 2000-01-01 to 2100-12-31\./,
  );
  expect(await date.evaluate((node) => (node as HTMLInputElement).validity.rangeUnderflow)).toBe(
    true,
  );
  await expect(page.locator(".availability-selected > li")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Remove Oct 14, 2026", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Review draft steps", exact: true }).click();
  await expect(page.getByLabel("Study date", { exact: true })).toHaveValue("2026-10-14");
  await expect(date).toHaveValue("1999-12-31");
  await expect(date).toBeEnabled();
  let attempted: unknown;
  await page.route("**/api/plans", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    attempted = route.request().postDataJSON();
    await route.fulfill({ status: 503, json: { error: { code: "synthetic_save_failure" } } });
  });
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.locator(".editor-form").getByRole("alert")).toBeVisible();
  expect(attempted).toMatchObject({
    availabilityDates: ["2026-10-14"],
    steps: [{ scheduledDate: "2026-10-14" }],
  });
  await expect(date).toHaveValue("1999-12-31");
  await expect(date).toBeEnabled();
  await expect(page.locator(".editor-form")).not.toHaveAttribute("aria-busy", "true");
  expect(await plans(page)).toHaveLength(0);
  await page.unroute("**/api/plans");
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.getByText("0 of 1 step complete", { exact: true })).toBeVisible();
  const saved = await savedDetail(page);
  expect(saved.plan.availabilityDates).toEqual(["2026-10-14"]);
  expect(saved.plan.steps[0]?.scheduledDate).toBe("2026-10-14");
});

test("PC02: native-picker fallback and calendar actions retain keyboard, size and responsive access", async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLInputElement.prototype.showPicker = () => {
      throw new DOMException("Synthetic native picker unavailable", "NotAllowedError");
    };
  });
  await createAccount(page);
  await openManualInput(page);
  const date = page.locator('input[name="availabilityDate"]');
  await page.getByRole("button", { name: "Open calendar", exact: true }).press("Enter");
  await expect(date).toBeFocused();
  await selectAvailability(page, ["2026-10-08", "2026-10-10", "2026-10-12"]);
  await page.getByRole("button", { name: "Remove Oct 10, 2026", exact: true }).press("Enter");
  await expect(
    page.getByRole("button", { name: "Remove Oct 12, 2026", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Remove Oct 12, 2026", exact: true }).press("Enter");
  await expect(page.getByRole("button", { name: "Remove Oct 8, 2026", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Remove Oct 8, 2026", exact: true }).press("Enter");
  await expect(date).toBeFocused();
  await selectAvailability(page, ["2026-10-08"]);
  for (const theme of ["light", "dark"] as const) {
    if ((await page.locator("html").getAttribute("data-theme")) !== theme)
      await page
        .getByRole("button", {
          name: theme === "dark" ? "Switch to dark mode" : "Switch to light mode",
          exact: true,
        })
        .click();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expectNoHorizontalOverflow(page);
    await page.setViewportSize({ width: 320, height: 720 });
    await expectNoHorizontalOverflow(page);
    for (const name of ["Open calendar", "Add date", "Remove Oct 8, 2026"])
      await targetAndFocus(page, page.getByRole("button", { name, exact: true }));
  }
  await date.fill("2026-10-14");
  await page.getByLabel("Language", { exact: true }).selectOption("fr");
  await expect(date).toHaveValue("2026-10-14");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await expectNoHorizontalOverflow(page);
  for (const name of ["Ouvrir le calendrier", "Ajouter la date", "Retirer 8 oct. 2026"])
    await targetAndFocus(page, page.getByRole("button", { name, exact: true }));
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await expectNoHorizontalOverflow(page);
  await targetAndFocus(page, page.getByRole("button", { name: "Ajouter la date", exact: true }));
  await page.getByRole("button", { name: "Ajouter la date", exact: true }).press("Enter");
  await expect(
    page.getByRole("button", { name: "Retirer 14 oct. 2026", exact: true }),
  ).toBeVisible();
  await expect(date).toHaveValue("2026-10-14");
});

test("PC01: the actual Edge native calendar accepts a keyboard-selected day", async ({ page }) => {
  await createAccount(page);
  await openManualInput(page);
  const date = page.getByLabel("Choose a date", { exact: true });
  await date.fill("2026-10-14");
  await page.getByRole("button", { name: "Open calendar", exact: true }).press("Enter");
  await page.screenshot({ path: ".local/planning-calendar/native-app-popup.png" });
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(date).toHaveValue("2026-10-15");
  await page.getByRole("button", { name: "Add date", exact: true }).press("Enter");
  await expect(
    page.getByRole("button", { name: "Remove Oct 15, 2026", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".availability-selected > li")).toHaveCount(1);
  expect(await plans(page)).toHaveLength(0);
});

test("PC02: 366-date selection limit is explained and removal restores Add without changing other dates", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await createAccount(page);
  await openManualInput(page);
  const dates = Array.from({ length: 366 }, (_, offset) => {
    const date = new Date("2026-01-01T12:00:00Z");
    date.setUTCDate(date.getUTCDate() + offset);
    return date.toISOString().slice(0, 10);
  });
  await selectAvailability(page, dates);
  const add = page.getByRole("button", { name: "Add date", exact: true });
  await expect(page.locator(".availability-selected > li")).toHaveCount(366);
  await expect(add).toBeDisabled();
  await expect(add).toHaveAccessibleDescription(/366 of 366 dates selected/);
  await page.getByRole("button", { name: "Remove Jan 1, 2027", exact: true }).press("Enter");
  await expect(page.locator(".availability-selected > li")).toHaveCount(365);
  await expect(add).toBeEnabled();
  await expect(
    page.getByRole("button", { name: "Remove Dec 31, 2026", exact: true }),
  ).toBeFocused();
  await selectAvailability(page, ["2027-01-01"]);
  await expect(page.locator(".availability-selected > li")).toHaveCount(366);
  await expect(add).toBeDisabled();
  await expect(plans(page)).resolves.toHaveLength(0);
});

test("PC04: discarding or changing an AI proposal restores manual input; pending AI cannot replace manual review", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.route("**/api/ai/status", (route) =>
    route.fulfill({ json: { available: true, reason: null, model: "synthetic-test-model" } }),
  );
  const generated: AiAssistResponse = {
    kind: "plan",
    goal: "Generated first segment",
    outcome: "Read one short section",
    prerequisites: "My own notes",
    steps: [{ title: "An AI proposed action", estimatedMinutes: 5, sourceIds: [] }],
    sources: [],
  };
  await page.route("**/api/ai/assist", (route) => route.fulfill({ json: generated }));
  await createAccount(page);
  await openManualInput(page);
  await selectAvailability(page, ["2026-10-08"]);
  const topics = page.locator('textarea[name="topics"]');
  const manualReview = page.getByRole("button", { name: "Review draft steps", exact: true });
  const run = page.getByRole("button", { name: "Draft my plan with AI", exact: true });
  const reviewAi = page.getByRole("button", { name: "Review AI draft", exact: true });
  await run.click();
  await expect(reviewAi).toBeVisible();
  await expect(topics).toBeHidden();
  await expect(manualReview).toBeHidden();
  await page.getByRole("button", { name: "Discard suggestion", exact: true }).click();
  await expect(topics).toBeVisible();
  await expect(topics).toHaveValue("Read one section");
  await expect(manualReview).toBeVisible();
  await expect(reviewAi).toHaveCount(0);
  await page.unroute("**/api/ai/assist");
  await page.route("**/api/ai/assist", (route) =>
    route.fulfill({ json: { kind: "insufficient", reason: "Please clarify the subject" } }),
  );
  await run.click();
  await expect(page.locator(".ai-result")).toContainText("Please clarify the subject");
  await expect(topics).toBeVisible();
  await expect(manualReview).toBeVisible();
  await expect(reviewAi).toHaveCount(0);
  await page.unroute("**/api/ai/assist");
  await page.route("**/api/ai/assist", (route) => route.fulfill({ json: generated }));
  await run.click();
  await expect(reviewAi).toBeVisible();
  await page.getByLabel("Language", { exact: true }).selectOption("fr");
  await expect(reviewAi).toHaveCount(0);
  await expect(topics).toBeVisible();
  await expect(topics).toHaveValue("Read one section");
  await expect(
    page.getByRole("button", { name: "Vérifier les étapes proposées", exact: true }),
  ).toBeVisible();
  await expect(page.locator('input[name="availabilityDate"]')).toHaveValue("2026-10-08");
  await expect(page.locator(".availability-selected > li")).toHaveCount(1);
  await page.getByRole("button", { name: "Préparer mon programme avec l’IA", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Vérifier le brouillon de l’IA", exact: true }),
  ).toBeVisible();
  await expect(topics).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Vérifier les étapes proposées", exact: true }),
  ).toBeHidden();
  await page.getByLabel("Langue", { exact: true }).selectOption("en");
  await expect(manualReview).toBeVisible();
  await expect(reviewAi).toHaveCount(0);
  await run.click();
  await expect(reviewAi).toBeVisible();
  await selectAvailability(page, ["2026-10-10"]);
  await expect(reviewAi).toHaveCount(0);
  await expect(manualReview).toBeVisible();
  await expect(topics).toHaveValue("Read one section");
  await page.unroute("**/api/ai/assist");
  let release = (): void => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/ai/assist", async (route) => {
    await gate;
    try {
      await route.fulfill({ json: generated });
    } catch {}
  });
  await run.click();
  await expect(page.getByRole("button", { name: "Cancel AI request", exact: true })).toBeVisible();
  await manualReview.click();
  await expect(page.getByLabel("Action", { exact: true })).toHaveValue("Read one section");
  release();
  await expect(page.getByRole("button", { name: "Cancel AI request", exact: true })).toBeHidden();
  await expect(reviewAi).toHaveCount(0);
  await expect(page.getByLabel("Action", { exact: true })).toHaveValue("Read one section");
  await expect(plans(page)).resolves.toHaveLength(0);
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.getByText("0 of 1 step complete", { exact: true })).toBeVisible();
  const saved = await savedDetail(page);
  expect(saved.plan.steps.map((step) => step.title)).toEqual(["Read one section"]);
  expect(saved.plan.sources ?? []).toEqual([]);
});

test("PC05: changing availability preserves completed dates, authored steps and retained history", async ({
  page,
}) => {
  await createAccount(page);
  await saveManualPlan(page);
  await page.getByRole("button", { name: "Start study session", exact: true }).click();
  await page.getByLabel("Minutes you studied", { exact: true }).fill("4");
  await page.getByLabel("Private reflection (optional)", { exact: true }).fill("Keep my evidence");
  await page.getByRole("button", { name: "Save study session", exact: true }).click();
  await expect(page.getByText("Your study session is saved.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Mark this step complete", exact: true }).click();
  await expect(
    page.getByText("Step completed. Your earlier effort is still recorded.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Choose the next action", exact: true }).click();
  const before = await savedDetail(page);
  await page.getByRole("button", { name: "Edit plan", exact: true }).click();
  await page.getByLabel("Action", { exact: true }).last().fill("My authored next step");
  await page.getByRole("button", { name: "Remove Oct 10, 2026", exact: true }).click();
  await selectAvailability(page, ["2026-10-14"]);
  await expect(page.getByLabel("Study date", { exact: true }).first()).toHaveValue("2026-10-08");
  await expect(page.getByLabel("Study date", { exact: true }).first()).toHaveAttribute(
    "readonly",
    "",
  );
  await expect(page.getByLabel("Study date", { exact: true }).last()).toHaveValue("2026-10-10");
  await expect(page.locator(".draft-warnings")).toContainText("is outside your available dates");
  await expect(page.getByLabel("Action", { exact: true }).last()).toHaveValue(
    "My authored next step",
  );
  await page.getByRole("button", { name: "Save revised plan", exact: true }).click();
  await expect(page.getByText("1 of 2 steps complete", { exact: true })).toBeVisible();
  const after = await savedDetail(page);
  expect(after.plan.availabilityDates).toEqual(["2026-10-08", "2026-10-14"]);
  expect(after.plan.steps[0]).toEqual(before.plan.steps[0]);
  expect(after.plan.steps[1]?.scheduledDate).toBe(before.plan.steps[1]?.scheduledDate);
  expect(after.activities).toEqual(before.activities);
  expect(after.completions).toEqual(before.completions);
});
