import { expect, type Locator, type Page, test } from "@playwright/test";
import type { LearningPlan, PlanDetail } from "../../src/shared/contracts.js";
import { createAccount, expectNoHorizontalOverflow, openManualDraft } from "./helpers.js";

const goal = "Keep learning with recoverable records";

async function createPlan(page: Page, reference = false): Promise<PlanDetail> {
  await createAccount(page, "Lifecycle learner");
  await openManualDraft(page, goal, "Read a short section\nExplain it in my own words");
  if (reference)
    await page
      .getByLabel("Reference links (optional)", { exact: true })
      .fill("https://example.org/course");
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.getByText("0 of 2 steps complete", { exact: true })).toBeVisible();
  return detail(page);
}

async function detail(page: Page, id?: string): Promise<PlanDetail> {
  const plans = (await (await page.request.get("/api/plans")).json()) as { plans: LearningPlan[] };
  const selected = id ?? plans.plans[0]?.id;
  if (!selected) throw new Error("Missing synthetic lifecycle plan");
  const response = await page.request.get(`/api/plans/${selected}`);
  expect(response.ok()).toBe(true);
  return (await response.json()) as PlanDetail;
}

async function journeys(page: Page): Promise<Locator> {
  await page.getByRole("link", { name: "Journeys", exact: true }).click();
  await expect(page.getByLabel("Show plans", { exact: true })).toBeVisible();
  await page.getByLabel("Show plans", { exact: true }).selectOption("active");
  return page
    .locator(".journey-row")
    .filter({ has: page.getByRole("heading", { name: goal, exact: true }) });
}

async function confirmWithin(parent: Locator, name: string): Promise<void> {
  const confirmation = parent.locator(".lifecycle-confirmation");
  await expect(confirmation).toBeVisible();
  await confirmation.getByRole("button", { name, exact: true }).click();
}

test("LC01: archive, readonly view, restore and deliberate last-plan deletion use visible controls", async ({
  page,
}) => {
  const created = await createPlan(page);
  let row = await journeys(page);
  await row.getByRole("button", { name: "Archive plan", exact: true }).click();
  await confirmWithin(row, "Archive plan");
  await expect(page.getByLabel("Show plans", { exact: true })).toHaveValue("archived");
  await expect(page.locator(".journey-row")).toHaveCount(1);
  await page.getByLabel("Show plans", { exact: true }).selectOption("active");
  await expect(page.locator(".journey-row")).toHaveCount(0);
  expect((await page.request.get("/api/plans")).ok()).toBe(true);
  await page.getByLabel("Show plans", { exact: true }).selectOption("archived");
  row = page.locator(".journey-row");
  await expect(row.getByRole("heading", { name: goal, exact: true })).toBeVisible();
  const archived = await detail(page, created.plan.id);
  const language = page.getByRole("combobox", { name: /^(Language|Langue)$/ });
  await language.focus();
  await language.selectOption("fr");
  await expect(row).toContainText(
    new Intl.DateTimeFormat("fr", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Africa/Lagos",
    }).format(new Date(archived.plan.archivedAt ?? "")),
  );
  await expect(language).toBeFocused();
  await language.selectOption("en");
  await row.getByRole("button", { name: "View archived plan", exact: true }).click();
  const archivedBack = page
    .locator(".archived-plan-view > .page-heading")
    .getByRole("button", { name: "Back", exact: true });
  const backBounds = await archivedBack.boundingBox();
  expect(backBounds?.width).toBeGreaterThanOrEqual(44);
  expect(backBounds?.height).toBeGreaterThanOrEqual(44);
  await expect(page.getByRole("button", { name: "Start study session", exact: true })).toHaveCount(
    0,
  );
  await expect(page.getByRole("button", { name: "Edit plan", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Delete study session", exact: true })).toHaveCount(
    0,
  );
  await page.getByRole("button", { name: "Restore plan", exact: true }).click();
  await page
    .locator(".lifecycle-confirmation")
    .getByRole("button", { name: "Restore plan", exact: true })
    .click();
  await expect(page.getByText("0 of 2 steps complete", { exact: true })).toBeVisible();
  const restored = await detail(page, created.plan.id);
  expect(restored.plan.archivedAt).toBeNull();
  expect(restored.plan.steps).toEqual(created.plan.steps);
  row = await journeys(page);
  const remove = row.getByRole("button", { name: "Delete permanently", exact: true });
  await remove.click();
  const form = row.locator(".lifecycle-confirmation");
  const finalDelete = form.getByRole("button", { name: "Delete permanently", exact: true });
  await expect(finalDelete).toBeDisabled();
  await form.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(remove).toBeFocused();
  await remove.click();
  await form.getByRole("checkbox").check();
  await finalDelete.click();
  await expect(page.locator(".journey-row")).toHaveCount(0);
  expect((await page.request.get(`/api/plans/${created.plan.id}`)).status()).toBe(404);
  await page.reload();
  await expect(page.getByLabel("Show plans", { exact: true })).toBeVisible();
  await expect(page.locator(".journey-row")).toHaveCount(0);
});

test("LC02/03: reflection removal, completion correction and session deletion preserve their separate meanings", async ({
  page,
}) => {
  const created = await createPlan(page);
  await page.getByRole("button", { name: "Start study session", exact: true }).click();
  await page.getByLabel("Minutes you studied", { exact: true }).fill("5");
  await page
    .getByLabel("Private reflection (optional)", { exact: true })
    .fill("Private lifecycle note to remove");
  await page.getByRole("button", { name: "Save study session", exact: true }).click();
  await expect(page.getByText("Your study session is saved.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Mark this step complete", exact: true }).click();
  await page.getByRole("button", { name: "Choose the next action", exact: true }).click();
  await page.getByRole("link", { name: "Activity", exact: true }).click();
  const session = page
    .locator(".history-entry")
    .filter({ has: page.getByRole("button", { name: "Delete study session", exact: true }) });
  await session.getByRole("button", { name: "Remove private reflection", exact: true }).click();
  await confirmWithin(session, "Remove private reflection");
  let current = await detail(page, created.plan.id);
  expect(current.activities[0]?.reflection).toBeNull();
  expect(current.progress.studiedMinutes).toBe(5);
  expect(current.progress.completed).toBe(1);
  await expect(page.getByText("Private lifecycle note to remove", { exact: true })).toHaveCount(0);
  const completion = page
    .locator(".history-entry")
    .filter({ has: page.getByRole("button", { name: "Mark as unfinished", exact: true }) });
  await completion.getByRole("button", { name: "Mark as unfinished", exact: true }).click();
  await confirmWithin(completion, "Mark as unfinished");
  await expect(page.getByText("Completion corrected", { exact: true })).toBeVisible();
  current = await detail(page, created.plan.id);
  expect(current.progress.completed).toBe(0);
  expect(current.progress.cumulativeCompletions).toBe(0);
  expect(current.completions[0]?.correctedAt).toBeTruthy();
  await page.getByRole("link", { name: "My learning", exact: true }).click();
  await page.getByRole("button", { name: "Start study session", exact: true }).click();
  await page.getByRole("button", { name: "Mark this step complete", exact: true }).click();
  await page.getByRole("button", { name: "Choose the next action", exact: true }).click();
  await page.getByRole("link", { name: "Activity", exact: true }).click();
  await session.getByRole("button", { name: "Delete study session", exact: true }).click();
  await confirmWithin(session, "Delete study session");
  current = await detail(page, created.plan.id);
  expect(current.activities).toHaveLength(0);
  expect(current.progress.studiedMinutes).toBe(0);
  expect(current.progress.studyDayCount).toBe(0);
  expect(current.progress.completed).toBe(1);
  expect(current.completions).toHaveLength(2);
  expect(current.progress.cumulativeCompletions).toBe(1);
});

test("LC04: removed-step preview chooses historical links and never restores a deleted private session", async ({
  page,
}) => {
  const created = await createPlan(page, true);
  await page.getByRole("button", { name: "Start study session", exact: true }).click();
  await page.getByLabel("Minutes you studied", { exact: true }).fill("5");
  await page
    .getByLabel("Private reflection (optional)", { exact: true })
    .fill("Never resurrect this removed note");
  await page.getByRole("button", { name: "Save study session", exact: true }).click();
  await page.getByRole("button", { name: "Choose the next action", exact: true }).click();
  await page.getByRole("button", { name: "Edit plan", exact: true }).click();
  await page.getByLabel("Reference links (optional)", { exact: true }).fill("");
  await page.locator(".availability-selected button").first().click();
  await page
    .locator(".draft-step")
    .first()
    .getByRole("button", { name: "Remove", exact: true })
    .click();
  await page.locator('input[name="confirmRemoval"]').check();
  await page.getByRole("button", { name: "Save revised plan", exact: true }).click();
  await page.getByRole("link", { name: "Activity", exact: true }).click();
  const session = page
    .locator(".history-entry")
    .filter({ has: page.getByRole("button", { name: "Delete study session", exact: true }) });
  await session.getByRole("button", { name: "Delete study session", exact: true }).click();
  await confirmWithin(session, "Delete study session");
  const removed = page.locator(".removed-steps");
  await removed.getByRole("button", { name: "Review step restoration", exact: true }).click();
  const link = removed.getByRole("checkbox", { name: "https://example.org/course", exact: true });
  await expect(link).not.toBeChecked();
  await link.check();
  const conflicts = removed.getByRole("checkbox", {
    name: "I acknowledge the schedule conflicts shown above.",
    exact: true,
  });
  await expect(conflicts).not.toBeChecked();
  await expect(removed.getByRole("button", { name: "Restore step", exact: true })).toBeDisabled();
  expect((await detail(page, created.plan.id)).plan.steps).toHaveLength(1);
  await conflicts.check();
  await expect(removed.getByRole("button", { name: "Restore step", exact: true })).toBeEnabled();
  await removed.getByRole("button", { name: "Restore step", exact: true }).click();
  const current = await detail(page, created.plan.id);
  expect(current.plan.steps.map((step) => step.id)).toEqual([
    created.plan.steps[1]?.id,
    created.plan.steps[0]?.id,
  ]);
  expect(current.plan.steps[1]?.scheduledDate).toBe(created.plan.steps[0]?.scheduledDate);
  expect(current.plan.references).toEqual(["https://example.org/course"]);
  expect(current.activities).toHaveLength(0);
  expect(current.scopeEvents.some((event) => event.kind === "restore")).toBe(true);
  await expect(page.getByText("Never resurrect this removed note", { exact: true })).toHaveCount(0);
  await page.reload();
  expect((await detail(page, created.plan.id)).activities).toHaveLength(0);
});

test("LC06: uncertain deletion retains confirmation and retries the same request without duplicate work", async ({
  page,
}) => {
  const created = await createPlan(page);
  const bodies: { requestId: string }[] = [];
  await page.route(`**/api/plans/${created.plan.id}/delete`, async (route) => {
    bodies.push(route.request().postDataJSON() as { requestId: string });
    if (bodies.length === 1) await route.abort("failed");
    else await route.continue();
  });
  const row = await journeys(page);
  await row.getByRole("button", { name: "Delete permanently", exact: true }).click();
  await row.locator(".lifecycle-confirmation").getByRole("checkbox").check();
  await confirmWithin(row, "Delete permanently");
  await expect(page.getByRole("button", { name: /Retry/, exact: false })).toBeVisible();
  expect((await page.request.get(`/api/plans/${created.plan.id}`)).status()).toBe(200);
  await page.getByRole("button", { name: /Retry/, exact: false }).click();
  await expect(page.locator(".journey-row")).toHaveCount(0);
  expect(bodies).toHaveLength(2);
  expect(bodies[0]?.requestId).toBe(bodies[1]?.requestId);
  expect((await page.request.get(`/api/plans/${created.plan.id}`)).status()).toBe(404);
});

test("LC07: contextual controls retain readable keyboard targets in both themes, languages and narrow layouts", async ({
  page,
}) => {
  await createPlan(page);
  await journeys(page);
  for (const locale of ["en", "fr"] as const) {
    await page.getByRole("combobox", { name: /^(Language|Langue)$/ }).selectOption(locale);
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const theme of ["light", "dark"]) {
        const switchLabel =
          locale === "en"
            ? theme === "dark"
              ? "Switch to dark mode"
              : "Switch to light mode"
            : theme === "dark"
              ? "Passer en mode sombre"
              : "Passer en mode clair";
        const themeControl = page.getByRole("button", { name: switchLabel, exact: true });
        if (await themeControl.count()) await themeControl.click();
        await expectNoHorizontalOverflow(page);
        const archive = page.getByRole("button", {
          name: locale === "en" ? "Archive plan" : "Archiver le programme",
          exact: true,
        });
        await archive.focus();
        await expect(archive).toBeFocused();
        expect((await archive.boundingBox())?.height).toBeGreaterThanOrEqual(44);
      }
    }
  }
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await expectNoHorizontalOverflow(page);
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await expectNoHorizontalOverflow(page);
});
