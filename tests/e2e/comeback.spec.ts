import { randomUUID } from "node:crypto";
import { expect, type Page, test } from "@playwright/test";
import type { ComebackConfirmInput, PlanDetail } from "../../src/shared/contracts.js";
import { capture, createAccount, expectNoHorizontalOverflow } from "./helpers.js";

const origin = "http://127.0.0.1:4318";
const acknowledge = "I understand these conflicts. My target and availability will stay unchanged.";

async function mutate<T>(page: Page, endpoint: string, data: unknown, method = "POST"): Promise<T> {
  const response = await page.request.fetch(endpoint, { method, headers: { origin }, data });
  expect(response.ok(), `${method} ${endpoint}: ${response.status()}`).toBe(true);
  return (await response.json()) as T;
}

async function readPlan(page: Page, id: string): Promise<PlanDetail> {
  const response = await page.request.get(`/api/plans/${id}`);
  expect(response.ok()).toBe(true);
  return (await response.json()) as PlanDetail;
}

async function prepare(page: Page): Promise<PlanDetail> {
  await createAccount(page);
  const created = await mutate<PlanDetail>(page, "/api/plans", {
    requestId: randomUUID(),
    goal: "Return to my learning with a realistic schedule",
    templateId: null,
    availabilityDates: ["2026-10-08", "2026-10-10", "2026-10-12"],
    targetDate: "2026-10-14",
    references: [],
    steps: [
      { title: "Read my earlier notes", scheduledDate: "2026-10-08", estimatedMinutes: 10 },
      { title: "Practise the worked example", scheduledDate: "2026-10-10", estimatedMinutes: 15 },
      {
        title: "Explain what I learned in my own words",
        scheduledDate: "2026-10-12",
        estimatedMinutes: 10,
      },
    ],
  });
  const first = created.plan.steps[0];
  expect(first).toBeDefined();
  const studied = await mutate<PlanDetail>(page, `/api/plans/${created.plan.id}/activities`, {
    requestId: randomUUID(),
    revision: created.plan.revision,
    stepId: first?.id,
    minutes: 3,
    reflection: "Synthetic private note kept intact",
  });
  const completed = await mutate<PlanDetail>(page, `/api/plans/${created.plan.id}/completions`, {
    requestId: randomUUID(),
    revision: studied.plan.revision,
    stepId: first?.id,
  });
  await page.reload();
  await expect(page.getByText("1 of 3 steps complete", { exact: true })).toBeVisible();
  return completed;
}

async function preview(page: Page, date = "2026-10-13"): Promise<void> {
  await page.getByRole("button", { name: "Review restart dates", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Review your revised schedule", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Restart date", { exact: true }).fill(date);
  await page.getByRole("button", { name: "Preview revised dates", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Current and proposed dates", exact: true }),
  ).toBeVisible();
}

test("CB01/02/03/05: preview, cancel, acknowledged confirmation and five-minute return preserve previous work", async ({
  page,
}) => {
  const before = await prepare(page);
  await preview(page);
  await expect(page.locator(".comeback-date-row")).toHaveCount(2);
  await expect(page.locator('.comeback-date-row time[datetime="2026-10-10"]')).toBeVisible();
  await expect(page.locator('.comeback-date-row time[datetime="2026-10-13"]')).toBeVisible();
  await expect(page.locator('.comeback-date-row time[datetime="2026-10-15"]')).toBeVisible();
  await expect(page.getByText(/is after your target date/)).toBeVisible();
  await expect(page.getByText(/is outside your available dates/)).toHaveCount(2);
  await expect(
    page.getByRole("button", { name: "Apply revised plan", exact: true }),
  ).toBeDisabled();
  expect(await readPlan(page, before.plan.id)).toEqual(before);
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByText("1 of 3 steps complete", { exact: true })).toBeVisible();
  expect(await readPlan(page, before.plan.id)).toEqual(before);

  await preview(page);
  await page.getByRole("checkbox", { name: acknowledge, exact: true }).check();
  await page.getByRole("button", { name: "Apply revised plan", exact: true }).click();
  await expect(page.getByText("1 of 3 steps complete", { exact: true })).toBeVisible();
  await page.reload();
  const saved = await readPlan(page, before.plan.id);
  expect(saved.plan.steps.map((step) => step.scheduledDate)).toEqual([
    "2026-10-08",
    "2026-10-13",
    "2026-10-15",
  ]);
  expect(saved.plan.revision).toBe(before.plan.revision + 1);
  expect(saved.plan.steps[0]).toEqual(before.plan.steps[0]);
  expect(saved.plan.targetDate).toEqual(before.plan.targetDate);
  expect(saved.plan.availabilityDates).toEqual(before.plan.availabilityDates);
  expect(saved.activities).toEqual(before.activities);
  expect(saved.completions).toEqual(before.completions);
  expect(saved.scopeEvents).toEqual(before.scopeEvents);

  await page.getByRole("button", { name: "Try a 5-minute restart", exact: true }).click();
  await expect(page.getByLabel("Minutes you studied", { exact: true })).toHaveValue("5");
  await page.getByRole("button", { name: "Save study session", exact: true }).click();
  await expect(page.getByText("Your study session is saved.", { exact: true })).toBeVisible();
  const studied = await readPlan(page, before.plan.id);
  expect(studied.progress.completed).toBe(1);
  expect(studied.progress.studiedMinutes).toBe(8);
  expect(studied.plan.revision).toBe(saved.plan.revision + 1);
});

test("CB03: Amber preview retains dates in light, dark and French mobile layouts", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await prepare(page);
  await preview(page);
  await expectNoHorizontalOverflow(page);
  await expect(
    page.getByRole("heading", { name: "Current and proposed dates", exact: true }),
  ).toBeFocused();
  await capture(page, "comeback-desktop-light");
  await page.getByRole("button", { name: "Switch to dark mode", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByLabel("Restart date", { exact: true })).toHaveValue("2026-10-13");
  await capture(page, "comeback-desktop-dark");
  await page.getByRole("button", { name: "Switch to light mode", exact: true }).click();
  await page.getByLabel("Language", { exact: true }).selectOption("fr");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByLabel("Date de reprise", { exact: true })).toHaveValue("2026-10-13");
  await expect(
    page.getByRole("heading", { name: "Dates actuelles et proposées", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Appliquer le parcours révisé", exact: true }),
  ).toBeDisabled();
  await expectNoHorizontalOverflow(page);
  await capture(page, "comeback-mobile-fr");
  await page.setViewportSize({ width: 320, height: 720 });
  await expectNoHorizontalOverflow(page);
  await capture(page, "comeback-mobile-fr-320");
  const checkbox = page.getByRole("checkbox", {
    name: "Je comprends ces conflits. Ma date cible et mes disponibilités restent inchangées.",
    exact: true,
  });
  await checkbox.focus();
  await page.keyboard.press("Space");
  await expect(checkbox).toBeChecked();
  await page.getByRole("button", { name: "Appliquer le parcours révisé", exact: true }).click();
  await expect(page.getByText("1 étape terminée sur 3", { exact: true })).toBeVisible();
});

test("CB03/04: changing a date invalidates preview and zero shift cannot be applied", async ({
  page,
}) => {
  const before = await prepare(page);
  await preview(page);
  await page.getByRole("checkbox", { name: acknowledge, exact: true }).check();
  const date = page.getByLabel("Restart date", { exact: true });
  await date.fill("2026-10-10");
  await expect(page.getByRole("button", { name: "Apply revised plan", exact: true })).toBeHidden();
  await page.getByRole("button", { name: "Preview revised dates", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Current and proposed dates", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Apply revised plan", exact: true }),
  ).toBeDisabled();
  expect(await readPlan(page, before.plan.id)).toEqual(before);
  await date.fill("2100-12-31");
  await page.getByRole("button", { name: "Preview revised dates", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(date).toHaveValue("2100-12-31");
  expect(await readPlan(page, before.plan.id)).toEqual(before);
});

test("CB02/04: stale confirmation requires a new preview after another completion", async ({
  page,
}) => {
  const before = await prepare(page);
  await preview(page);
  await page.getByRole("checkbox", { name: acknowledge, exact: true }).check();
  const concurrent = await mutate<PlanDetail>(page, `/api/plans/${before.plan.id}/completions`, {
    requestId: randomUUID(),
    revision: before.plan.revision,
    stepId: before.plan.steps[1]?.id,
  });
  await page.getByRole("button", { name: "Apply revised plan", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(/changed/);
  expect((await readPlan(page, before.plan.id)).plan).toEqual(concurrent.plan);
  await page.getByRole("button", { name: "Reload saved plan", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Review your revised schedule", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Preview revised dates", exact: true }).click();
  await expect(page.locator(".comeback-date-row")).toHaveCount(1);
  await expect(page.locator('.comeback-date-row time[datetime="2026-10-12"]')).toBeVisible();
  expect((await readPlan(page, before.plan.id)).plan).toEqual(concurrent.plan);
});

test("CB04: lost confirmation response retries the identical receipt without moving dates twice", async ({
  page,
}) => {
  const before = await prepare(page);
  await preview(page);
  await page.getByRole("checkbox", { name: acknowledge, exact: true }).check();
  const requests: ComebackConfirmInput[] = [];
  const endpoint = `**/api/plans/${before.plan.id}/comeback/confirm`;
  await page.route(endpoint, async (route) => {
    requests.push(route.request().postDataJSON() as ComebackConfirmInput);
    if (requests.length === 1) {
      const saved = await route.fetch();
      expect(saved.ok()).toBe(true);
      await route.abort("failed");
    } else await route.continue();
  });
  await page.getByRole("button", { name: "Apply revised plan", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(/may have/);
  await expect(page.getByLabel("Restart date", { exact: true })).toHaveValue("2026-10-13");
  const once = await readPlan(page, before.plan.id);
  expect(once.plan.revision).toBe(before.plan.revision + 1);
  const intervening = await mutate<PlanDetail>(
    page,
    `/api/plans/${before.plan.id}`,
    {
      requestId: randomUUID(),
      revision: once.plan.revision,
      goal: "Keep my latest learning goal",
      availabilityDates: once.plan.availabilityDates,
      targetDate: once.plan.targetDate,
      references: once.plan.references,
      steps: once.plan.steps.map(({ id, title, scheduledDate, estimatedMinutes }) => ({
        id,
        title,
        scheduledDate,
        estimatedMinutes,
      })),
    },
    "PUT",
  );
  await page.getByRole("button", { name: "Retry the same change", exact: true }).click();
  await expect(page.getByText("1 of 3 steps complete", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: intervening.plan.goal, exact: true }),
  ).toBeVisible();
  expect(requests).toHaveLength(2);
  expect(requests[1]).toEqual(requests[0]);
  expect((await readPlan(page, before.plan.id)).plan).toEqual(intervening.plan);
  await page.unroute(endpoint);
});

test("CB04: a saved confirmation with failed readback retries only the latest plan read", async ({
  page,
}) => {
  const before = await prepare(page);
  await preview(page);
  await page.getByRole("checkbox", { name: acknowledge, exact: true }).check();
  let confirmations = 0;
  const confirmEndpoint = `**/api/plans/${before.plan.id}/comeback/confirm`;
  const detailEndpoint = `**/api/plans/${before.plan.id}`;
  await page.route(confirmEndpoint, async (route) => {
    confirmations += 1;
    const response = await route.fetch();
    expect(response.ok()).toBe(true);
    await route.fulfill({ response });
  });
  await page.route(detailEndpoint, async (route) => {
    if (route.request().method() === "GET") await route.abort("failed");
    else await route.continue();
  });
  await page.getByRole("button", { name: "Apply revised plan", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(/saved/);
  const saved = await readPlan(page, before.plan.id);
  expect(saved.plan.revision).toBe(before.plan.revision + 1);
  await expect(page.getByRole("button", { name: "Open saved plan", exact: true })).toBeVisible();
  await page.unroute(detailEndpoint);
  await page.getByRole("button", { name: "Open saved plan", exact: true }).click();
  await expect(page.getByText("1 of 3 steps complete", { exact: true })).toBeVisible();
  expect(confirmations).toBe(1);
  expect((await readPlan(page, before.plan.id)).plan).toEqual(saved.plan);
  await page.unroute(confirmEndpoint);
});

test("CB04: pending preview and confirmation never replace a different screen", async ({
  page,
}) => {
  const before = await prepare(page);
  await page.getByRole("button", { name: "Review restart dates", exact: true }).click();
  await page.getByLabel("Restart date", { exact: true }).fill("2026-10-13");
  const previewEndpoint = `**/api/plans/${before.plan.id}/comeback/preview`;
  let releasePreview: () => void = () => {};
  const previewGate = new Promise<void>((resolve) => {
    releasePreview = resolve;
  });
  await page.route(previewEndpoint, async (route) => {
    await previewGate;
    await route.continue();
  });
  const pendingPreview = page.waitForResponse((response) =>
    response.url().endsWith("/comeback/preview"),
  );
  await page.getByRole("button", { name: "Preview revised dates", exact: true }).click();
  await page.getByRole("link", { name: "Activity", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Activity", exact: true })).toBeVisible();
  releasePreview();
  await pendingPreview;
  await expect(page.getByRole("heading", { name: "Activity", exact: true })).toBeVisible();
  await page.unroute(previewEndpoint);
  await page.getByRole("link", { name: "My learning", exact: true }).click();
  await preview(page);
  await page.getByRole("checkbox", { name: acknowledge, exact: true }).check();
  let releaseConfirm: () => void = () => {};
  const confirmGate = new Promise<void>((resolve) => {
    releaseConfirm = resolve;
  });
  const confirmEndpoint = `**/api/plans/${before.plan.id}/comeback/confirm`;
  await page.route(confirmEndpoint, async (route) => {
    await confirmGate;
    await route.continue();
  });
  const pendingConfirm = page.waitForResponse((response) =>
    response.url().endsWith("/comeback/confirm"),
  );
  await page.getByRole("button", { name: "Apply revised plan", exact: true }).click();
  await page.getByRole("link", { name: "Journeys", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Journeys", exact: true })).toBeVisible();
  releaseConfirm();
  await pendingConfirm;
  await expect(page.getByRole("heading", { name: "Journeys", exact: true })).toBeVisible();
  await page.unroute(confirmEndpoint);
  expect((await readPlan(page, before.plan.id)).plan.revision).toBe(before.plan.revision + 1);
});

test("CB03: empty and all-complete plans have no enabled restart schedule", async ({ page }) => {
  let detail = await prepare(page);
  for (const step of detail.plan.steps.filter((item) => item.completedAt === null)) {
    detail = await mutate<PlanDetail>(page, `/api/plans/${detail.plan.id}/completions`, {
      requestId: randomUUID(),
      revision: detail.plan.revision,
      stepId: step.id,
    });
  }
  await page.reload();
  await expect(page.getByText("3 of 3 steps complete", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Review restart dates", exact: true })).toHaveCount(
    0,
  );
  await mutate(
    page,
    `/api/plans/${detail.plan.id}`,
    {
      requestId: randomUUID(),
      revision: detail.plan.revision,
      goal: detail.plan.goal,
      availabilityDates: detail.plan.availabilityDates,
      targetDate: detail.plan.targetDate,
      references: detail.plan.references,
      steps: [],
    },
    "PUT",
  );
  await page.reload();
  await expect(page.getByText("0 of 0 steps complete", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Review restart dates", exact: true })).toHaveCount(
    0,
  );
  expect((await readPlan(page, detail.plan.id)).completions).toHaveLength(3);
});
