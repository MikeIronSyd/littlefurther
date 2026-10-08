import { expect, type Page, test } from "@playwright/test";
import type { LearningPlan, PlanDetail } from "../../src/shared/contracts.js";
import {
  createAccount,
  openManualDraft,
  respectAuthenticationRateLimit,
  saveManualPlan,
} from "./helpers.js";

// A deliberately failing baseline replaces Playwright's worker and resets the
// helper's in-memory clock. Let the real auth bucket cool before that replacement.
test.afterEach(async ({ page: _page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) await respectAuthenticationRateLimit();
});

// Fetch the actual successful server response first. A held response is already
// authorized (and a mutation already persisted), not a request blocked before I/O.
async function holdSuccessfulResponse(page: Page, path: string, method: string) {
  let releaseGate: () => void = () => {};
  let captured: (status: number) => void = () => {};
  const gate = new Promise<void>((resolve) => {
    releaseGate = resolve;
  });
  const ready = new Promise<number>((resolve) => {
    captured = resolve;
  });
  let held = false;
  await page.route(`**${path}`, async (route) => {
    if (held || route.request().method() !== method) {
      await route.continue();
      return;
    }
    held = true;
    const response = await route.fetch();
    captured(response.status());
    await gate;
    await route.fulfill({ response });
  });
  return {
    ready,
    async release(): Promise<void> {
      const delivered = page.waitForResponse(
        (response) =>
          new URL(response.url()).pathname === path && response.request().method() === method,
      );
      releaseGate();
      await (await delivered).finished();
      // Let the response's promise callbacks and their rendering turn complete.
      // Assertions below target synchronous callback effects, not an idle timeout.
      await page.evaluate(
        () =>
          new Promise<void>((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
          }),
      );
    },
  };
}

async function openAccountAction(page: Page, name: string): Promise<void> {
  await page.getByLabel("Account", { exact: true }).click();
  await page.getByRole("button", { name, exact: true }).click();
}

async function firstPlan(page: Page): Promise<LearningPlan> {
  const response = await page.request.get("/api/plans");
  expect(response.ok()).toBe(true);
  const plan = ((await response.json()) as { plans: LearningPlan[] }).plans[0];
  if (!plan) throw new Error("Expected the synthetic learner's saved plan");
  return plan;
}

async function expectDirtyGuard(page: Page, goal: string): Promise<void> {
  let warned = false;
  page.once("dialog", async (dialog) => {
    warned = dialog.type() === "confirm";
    await dialog.dismiss();
  });
  await page.getByRole("link", { name: "Activity", exact: true }).click();
  expect(warned, "Unsaved input in the current editor still requires confirmation").toBe(true);
  await expect(page.getByLabel("Learning goal", { exact: true })).toHaveValue(goal);
}

test("P08 AC09: a previously authorized plan response cannot restore private content after sign-out", async ({
  page,
}) => {
  await createAccount(page);
  await saveManualPlan(page);
  const plan = await firstPlan(page);
  const delayed = await holdSuccessfulResponse(page, `/api/plans/${plan.id}`, "GET");
  await page.getByRole("link", { name: "Activity", exact: true }).click();
  expect(await delayed.ready).toBe(200);
  await openAccountAction(page, "Sign out");
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeVisible();
  expect((await page.request.get("/api/plans")).status()).toBe(401);
  await delayed.release();
  await expect(page.getByRole("heading", { name: plan.goal, exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeVisible();
  await expect(page.getByLabel("Account", { exact: true })).toBeHidden();
});

test("P08 AC01/10: late editor success leaves the selected screen and a new draft intact", async ({
  page,
}) => {
  await createAccount(page);
  await saveManualPlan(page);
  const plan = await firstPlan(page);
  await page.getByRole("button", { name: "Edit plan", exact: true }).click();
  await page.getByLabel("Learning goal", { exact: true }).fill("An already saved revision");
  const delayed = await holdSuccessfulResponse(page, `/api/plans/${plan.id}`, "PUT");
  await page.getByRole("button", { name: "Save revised plan", exact: true }).click();
  expect(await delayed.ready).toBe(200);
  expect(
    (await (await page.request.get(`/api/plans/${plan.id}`)).json()) as PlanDetail,
  ).toMatchObject({
    plan: { goal: "An already saved revision" },
  });
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("link", { name: "Journeys", exact: true }).click();
  await page.getByRole("button", { name: "Create a learning plan", exact: true }).click();
  await page.getByLabel("Learning goal", { exact: true }).fill("My newer unsaved goal");
  await delayed.release();
  await expect(page.getByRole("link", { name: "Journeys", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expectDirtyGuard(page, "My newer unsaved goal");
});

test("P08 AC03/10: a detached study save cannot clear a newer editor's dirty guard", async ({
  page,
}) => {
  await createAccount(page);
  await saveManualPlan(page);
  const plan = await firstPlan(page);
  await page.getByRole("button", { name: "Start study session", exact: true }).click();
  await page
    .getByLabel("Private reflection (optional)", { exact: true })
    .fill("Saved earlier reflection");
  const delayed = await holdSuccessfulResponse(page, `/api/plans/${plan.id}/activities`, "POST");
  await page.getByRole("button", { name: "Save study session", exact: true }).click();
  expect(await delayed.ready).toBe(200);
  const saved = (await (await page.request.get(`/api/plans/${plan.id}`)).json()) as PlanDetail;
  expect(saved.activities).toHaveLength(1);
  expect(saved.activities[0]?.reflection).toBe("Saved earlier reflection");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("link", { name: "Journeys", exact: true }).click();
  await page.getByRole("button", { name: "Create a learning plan", exact: true }).click();
  await page.getByLabel("Learning goal", { exact: true }).fill("Keep this new draft protected");
  await delayed.release();
  await expectDirtyGuard(page, "Keep this new draft protected");
});

test("P08 AC09: a delayed profile save cannot restore signed-out identity", async ({ page }) => {
  await createAccount(page);
  await saveManualPlan(page);
  await openAccountAction(page, "Preferences");
  await page.getByLabel("Timezone", { exact: true }).fill("Africa/Nairobi");
  const delayed = await holdSuccessfulResponse(page, "/api/me", "PUT");
  await page.getByRole("button", { name: "Save preferences and continue", exact: true }).click();
  expect(await delayed.ready).toBe(200);
  page.once("dialog", (dialog) => dialog.accept());
  await openAccountAction(page, "Sign out");
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeVisible();
  await delayed.release();
  await expect(page.getByLabel("Account", { exact: true })).toBeHidden();
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeVisible();
  await expect(page.locator(".global-status")).not.toContainText("saved");
  expect((await page.request.get("/api/me")).status()).toBe(401);
});

test("P08 AC10: a late profile save cannot replace a new plan draft or clear its guard", async ({
  page,
}) => {
  await createAccount(page);
  await saveManualPlan(page);
  await openAccountAction(page, "Preferences");
  await page.getByLabel("Timezone", { exact: true }).fill("Africa/Nairobi");
  const delayed = await holdSuccessfulResponse(page, "/api/me", "PUT");
  await page.getByRole("button", { name: "Save preferences and continue", exact: true }).click();
  expect(await delayed.ready).toBe(200);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("link", { name: "Journeys", exact: true }).click();
  await page.getByRole("button", { name: "Create a learning plan", exact: true }).click();
  await page.getByLabel("Learning goal", { exact: true }).fill("Draft after updating preferences");
  await delayed.release();
  await expectDirtyGuard(page, "Draft after updating preferences");
});

test("P08 AC09/11: a delayed locale save cannot restore signed-out account controls", async ({
  page,
}) => {
  await createAccount(page);
  const delayed = await holdSuccessfulResponse(page, "/api/me", "PUT");
  await page.getByLabel("Language", { exact: true }).selectOption("fr");
  expect(await delayed.ready).toBe(200);
  await page.getByLabel("Compte", { exact: true }).click();
  await page.getByRole("button", { name: "Se déconnecter", exact: true }).click();
  await expect(page.getByRole("button", { name: "Se connecter", exact: true })).toBeVisible();
  await delayed.release();
  await expect(page.getByLabel("Compte", { exact: true })).toBeHidden();
  await expect(page.getByRole("button", { name: "Se connecter", exact: true })).toBeVisible();
  expect((await page.request.get("/api/me")).status()).toBe(401);
});

test("P08 AC09/10: failed sign-out reports failure and retains the current unsaved form guard", async ({
  page,
}) => {
  await createAccount(page);
  await openManualDraft(page, "Keep my input after a failed sign-out");
  await page.route("**/api/auth/sign-out", (route) => route.abort("failed"));
  page.once("dialog", (dialog) => dialog.accept());
  await openAccountAction(page, "Sign out");
  await expect(page.locator(".global-status")).toContainText("We could not reach the local server");
  await expect(page.getByLabel("Account", { exact: true })).toBeVisible();
  expect((await page.request.get("/api/me")).status()).toBe(200);
  await expectDirtyGuard(page, "Keep my input after a failed sign-out");
});

test("P08 AC11: switching locale in place preserves learner draft values and focusable controls", async ({
  page,
}) => {
  await createAccount(page);
  await openManualDraft(page, "My own words stay as written");
  const goal = page.locator('input[name="goal"]');
  const action = page.locator('input[name="title-0"]');
  await action.fill("My learner-authored action");
  const savedLocale = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/api/me" && response.request().method() === "PUT",
  );
  await page.getByLabel("Language", { exact: true }).selectOption("fr");
  expect((await savedLocale).status()).toBe(200);
  await expect(goal).toHaveValue("My own words stay as written");
  await expect(action).toHaveValue("My learner-authored action");
  await expect(
    page.getByRole("button", { name: "Confirmer et enregistrer", exact: true }),
  ).toBeVisible();
  await action.focus();
  await expect(action).toBeFocused();
  await page.getByLabel("Langue", { exact: true }).selectOption("en");
  await expectDirtyGuard(page, "My own words stay as written");
});

test("P08 AC11: saving a new plan from Journeys keeps the URL and reload destination consistent", async ({
  page,
}) => {
  await createAccount(page);
  await saveManualPlan(page);
  await page.getByRole("link", { name: "Journeys", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Journeys", exact: true })).toBeVisible();
  await openManualDraft(page, "A second learning journey");
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.getByRole("link", { name: "My learning", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(page).toHaveURL(/#learning$/);
  await page.reload();
  await expect(page.getByRole("link", { name: "My learning", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(
    page.getByRole("button", { name: "Start study session", exact: true }),
  ).toBeVisible();
});

test("P08 AC04/11: changing language during a delayed profile save preserves the saved timezone", async ({
  page,
}) => {
  await createAccount(page);
  await openAccountAction(page, "Preferences");
  await page.getByLabel("Timezone", { exact: true }).fill("America/New_York");
  const delayed = await holdSuccessfulResponse(page, "/api/me", "PUT");
  await page.getByRole("button", { name: "Save preferences and continue", exact: true }).click();
  expect(await delayed.ready).toBe(200);
  expect(await (await page.request.get("/api/me")).json()).toMatchObject({
    profile: { timezone: "America/New_York", locale: "en" },
  });
  const localeSaved = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/api/me" &&
      response.request().method() === "PUT" &&
      (response.request().postDataJSON() as { locale?: string }).locale === "fr",
  );
  await page.getByLabel("Language", { exact: true }).selectOption("fr");
  await delayed.release();
  expect((await localeSaved).status()).toBe(200);
  expect(await (await page.request.get("/api/me")).json()).toMatchObject({
    profile: { timezone: "America/New_York", locale: "fr" },
  });
  await page.reload();
  await page.getByLabel("Compte", { exact: true }).click();
  await page.getByRole("button", { name: "Préférences", exact: true }).click();
  await expect(page.locator('input[name="timezone"]')).toHaveValue("America/New_York");
  await expect(page.getByLabel("Langue", { exact: true })).toHaveValue("fr");
});

test("P08 AC04/10: a lost profile response cannot make the next locale write revert saved preferences", async ({
  page,
}) => {
  await createAccount(page);
  await openAccountAction(page, "Preferences");
  await page.getByLabel("Timezone", { exact: true }).fill("America/New_York");
  let loseFirstSave = true;
  await page.route("**/api/me", async (route) => {
    if (route.request().method() === "PUT" && loseFirstSave) {
      loseFirstSave = false;
      const saved = await route.fetch();
      expect(saved.status()).toBe(200);
      await route.abort("failed");
    } else await route.continue();
  });
  await page.getByRole("button", { name: "Save preferences and continue", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("We could not reach the local server");
  expect(await (await page.request.get("/api/me")).json()).toMatchObject({
    profile: { timezone: "America/New_York", locale: "en" },
  });
  const localeSaved = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/api/me" && response.request().method() === "PUT",
  );
  await page.getByLabel("Language", { exact: true }).selectOption("fr");
  expect((await localeSaved).status()).toBe(200);
  expect(await (await page.request.get("/api/me")).json()).toMatchObject({
    profile: { timezone: "America/New_York", locale: "fr" },
  });
  let warned = false;
  page.once("dialog", async (dialog) => {
    warned = dialog.type() === "confirm";
    await dialog.dismiss();
  });
  await page.getByRole("link", { name: "Activité", exact: true }).click();
  expect(warned).toBe(true);
  await expect(page.locator('input[name="timezone"]')).toHaveValue("America/New_York");
});

test("P08 AC10/11: failed profile readback prevents a stale write and does not poison a later language save", async ({
  page,
}) => {
  await createAccount(page);
  let failReadback = true;
  let writes = 0;
  await page.route("**/api/me", async (route) => {
    if (route.request().method() === "GET" && failReadback) {
      failReadback = false;
      await route.abort("failed");
    } else {
      if (route.request().method() === "PUT") writes += 1;
      await route.continue();
    }
  });
  await page.getByLabel("Language", { exact: true }).selectOption("fr");
  await expect(page.locator(".global-status")).toContainText("serveur local");
  expect(writes).toBe(0);
  expect(await (await page.request.get("/api/me")).json()).toMatchObject({
    profile: { timezone: "Africa/Lagos", locale: "en" },
  });
  const retrySaved = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/api/me" && response.request().method() === "PUT",
  );
  await page.getByLabel("Langue", { exact: true }).selectOption("en");
  expect((await retrySaved).status()).toBe(200);
  expect(writes).toBe(1);
  await expect(page.locator(".global-status")).toBeEmpty();
  await expect(page.getByLabel("Account", { exact: true })).toBeVisible();
});
