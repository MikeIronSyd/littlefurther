import { expect, type Dialog, type Locator, type Page, test } from "@playwright/test";
import type {
  CircleDetail,
  LearningPlan,
  MeResponse,
  PlanDetail,
} from "../../src/shared/contracts.js";
import {
  createAccount,
  openManualDraft,
  respectAuthenticationRateLimit,
  saveManualPlan,
} from "./helpers.js";

const leaveMessage = "Leave this form and discard your unsaved input?";
const savedMessage = "Your plan is saved. Choose your next step when you are ready.";

test.afterEach(async ({ page: _page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) await respectAuthenticationRateLimit();
});

async function readPlans(page: Page): Promise<LearningPlan[]> {
  const response = await page.request.get("/api/plans");
  expect(response.ok()).toBe(true);
  return ((await response.json()) as { plans: LearningPlan[] }).plans;
}

async function readPlan(page: Page): Promise<PlanDetail> {
  const plans = await readPlans(page);
  const plan = plans[0];
  if (!plan) throw new Error("Expected a plan created through the synthetic learner's form");
  const response = await page.request.get(`/api/plans/${plan.id}`);
  expect(response.ok()).toBe(true);
  return (await response.json()) as PlanDetail;
}

async function readMe(page: Page): Promise<MeResponse> {
  const response = await page.request.get("/api/me");
  expect(response.ok()).toBe(true);
  return (await response.json()) as MeResponse;
}

async function readCircle(page: Page, id: string): Promise<CircleDetail> {
  const response = await page.request.get(`/api/circles/${id}`);
  expect(response.ok()).toBe(true);
  return (await response.json()) as CircleDetail;
}

async function accountPreferences(page: Page): Promise<void> {
  await page.getByLabel("Account", { exact: true }).click();
  await page.getByRole("button", { name: "Preferences", exact: true }).click();
  await expect(page.getByLabel("Timezone", { exact: true })).toBeVisible();
}

async function nativeConfirm(
  page: Page,
  action: () => Promise<unknown>,
  accept: boolean,
): Promise<void> {
  let observed: { type: string; message: string } | undefined;
  page.once("dialog", async (dialog) => {
    observed = { type: dialog.type(), message: dialog.message() };
    if (accept) await dialog.accept();
    else await dialog.dismiss();
  });
  await action();
  expect(observed).toEqual({ type: "confirm", message: leaveMessage });
}

async function cancelNativeReload(page: Page, control: Locator, value: string): Promise<void> {
  // This is an actual browser beforeunload event, not a replacement for confirm
  // or a dispatched DOM event. A cancelled reload normally rejects ERR_ABORTED;
  // bound the navigation wait because browser versions can leave it pending.
  const before = page.url();
  const observed = page.waitForEvent("dialog");
  const reload = page.reload({ timeout: 5_000 }).catch(() => null);
  const dialog = await observed;
  const type = dialog.type();
  await dialog.dismiss();
  await reload;
  expect(type).toBe("beforeunload");
  expect(page.url()).toBe(before);
  await expect(control).toHaveValue(value);
}

async function noNativeWarning(page: Page, action: () => Promise<unknown>): Promise<void> {
  const unexpected: string[] = [];
  const dismiss = async (dialog: Dialog): Promise<void> => {
    unexpected.push(dialog.type());
    await dialog.dismiss();
  };
  page.on("dialog", dismiss);
  try {
    await action();
    await expect(page.getByRole("heading", { name: "Activity", exact: true })).toBeVisible();
  } finally {
    page.off("dialog", dismiss);
  }
  expect(unexpected, "Saved work must not trigger an unsaved-input warning").toEqual([]);
}

async function changeLocale(page: Page, locale: "en" | "fr"): Promise<void> {
  const saved = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/api/me" && response.request().method() === "PUT",
  );
  await page.getByRole("combobox", { name: /^(Language|Langue)$/ }).selectOption(locale);
  expect((await saved).status()).toBe(200);
  await expect(page.locator("html")).toHaveAttribute("lang", locale);
}

test("RC01: save success belongs to the resulting view, not a later unsaved editor", async ({
  page,
}) => {
  await createAccount(page);
  await saveManualPlan(page);
  const status = page.locator(".global-status");
  await expect(status).toHaveText(savedMessage);
  await page.getByRole("button", { name: "Edit plan", exact: true }).click();
  await expect(status).toBeEmpty();
  await page.getByLabel("Learning goal", { exact: true }).fill("A deliberately saved revision");
  await page.getByRole("button", { name: "Save revised plan", exact: true }).click();
  await expect(status).toHaveText(savedMessage);
  await page.getByRole("link", { name: "Activity", exact: true }).click();
  await expect(status).toBeEmpty();
  await page.getByRole("link", { name: "My learning", exact: true }).click();
  await page.getByRole("button", { name: "Edit plan", exact: true }).click();
  await page.getByRole("button", { name: "Save revised plan", exact: true }).click();
  await expect(status).toHaveText(savedMessage);
  await page.getByRole("link", { name: "Journeys", exact: true }).click();
  await expect(status).toBeEmpty();
  await openManualDraft(page, "A new unsaved goal after earlier success");
  await expect(status).toBeEmpty();
  expect(await readPlans(page)).toHaveLength(1);
  await nativeConfirm(
    page,
    () => page.getByRole("link", { name: "Activity", exact: true }).click(),
    false,
  );
  await expect(page.getByLabel("Learning goal", { exact: true })).toHaveValue(
    "A new unsaved goal after earlier success",
  );
  await expect(status).toBeEmpty();
  expect(await readPlans(page)).toHaveLength(1);
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(status).toHaveText(savedMessage);
  expect(await readPlans(page)).toHaveLength(2);
});

test("RC01: a confirmed Comeback announces success until the learner opens another view", async ({
  page,
}) => {
  await createAccount(page);
  await saveManualPlan(page);
  const before = await readPlan(page);
  await page.getByRole("button", { name: "Review restart dates", exact: true }).click();
  await expect(page.locator(".global-status")).toBeEmpty();
  await page.getByLabel("Restart date", { exact: true }).fill("2026-10-14");
  await page.getByRole("button", { name: "Preview revised dates", exact: true }).click();
  await page
    .getByRole("checkbox", {
      name: "I understand these conflicts. My target and availability will stay unchanged.",
      exact: true,
    })
    .check();
  await page.getByRole("button", { name: "Apply revised plan", exact: true }).click();
  await expect(page.locator(".global-status")).toHaveText(
    "Your revised dates are saved. Your completed work and earlier effort are unchanged.",
  );
  const after = await readPlan(page);
  expect(after.plan.steps.map((step) => step.scheduledDate)).toEqual(["2026-10-14", "2026-10-16"]);
  expect(after.activities).toEqual(before.activities);
  expect(after.completions).toEqual(before.completions);
  await page.getByRole("button", { name: "Open study circles", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Study together", exact: true })).toBeVisible();
  await expect(page.locator(".global-status")).toBeEmpty();
});

test("RC02: removal consent uses bilingual one/many wording without losing edits or consent state", async ({
  page,
}) => {
  await createAccount(page);
  await openManualDraft(
    page,
    "Adjust my scope clearly",
    "Alpha action\nBravo action\nCharlie action",
  );
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.getByText("0 of 3 steps complete", { exact: true })).toBeVisible();
  const before = await readPlan(page);
  await page.getByRole("button", { name: "Edit plan", exact: true }).click();
  const consent = page.locator('input[name="confirmRemoval"]');
  await expect(consent).toBeHidden();
  await expect(consent).not.toHaveAttribute("required");
  await page.getByLabel("Action", { exact: true }).last().fill("My retained authored action");
  await page.getByRole("button", { name: "Remove", exact: true }).first().click();
  await expect(consent).toHaveAccessibleName(
    "I understand that removing 1 step changes the active scope. Earlier work remains in history.",
  );
  await expect(consent).toHaveAttribute("required", "");
  await expect(consent).not.toBeChecked();
  await consent.check();
  await changeLocale(page, "fr");
  await expect(consent).toHaveAccessibleName(
    "Je comprends que le retrait de 1 étape modifie le parcours actif. Le travail antérieur reste dans l’historique.",
  );
  await expect(consent).toBeChecked();
  await expect(page.getByLabel("Action", { exact: true }).last()).toHaveValue(
    "My retained authored action",
  );
  await page.getByRole("button", { name: "Retirer", exact: true }).first().click();
  await expect(consent).toHaveAccessibleName(
    "Je comprends que le retrait de 2 étapes modifie le parcours actif. Le travail antérieur reste dans l’historique.",
  );
  await expect(consent).not.toBeChecked();
  await changeLocale(page, "en");
  await expect(consent).toHaveAccessibleName(
    "I understand that removing 2 steps changes the active scope. Earlier work remains in history.",
  );
  await expect(page.getByLabel("Action", { exact: true })).toHaveValue(
    "My retained authored action",
  );
  expect((await readPlan(page)).plan.steps).toHaveLength(3);
  await consent.check();
  await page.getByRole("button", { name: "Save revised plan", exact: true }).click();
  await expect(page.getByText("0 of 1 step complete", { exact: true })).toBeVisible();
  const after = await readPlan(page);
  expect(after.plan.steps.map((step) => step.title)).toEqual(["My retained authored action"]);
  expect(after.activities).toEqual(before.activities);
  expect(after.completions).toEqual(before.completions);
  expect(after.scopeEvents).toHaveLength(1);
});

for (const kind of ["plan", "study", "circle", "preferences"] as const) {
  test(`RC03: ${kind} native Cancel/reload retain the draft; discard preserves saved work; saving clears the guard`, async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await createAccount(page);
    await saveManualPlan(page);
    const initial = await readPlan(page);
    const draft = `Unpublished ${kind} draft for native-dialog verification`;
    let circleId = "";
    const open = async (): Promise<Locator> => {
      if (kind === "plan") {
        await page.getByRole("button", { name: "Edit plan", exact: true }).click();
        return page.getByLabel("Action", { exact: true }).first();
      }
      if (kind === "study") {
        await page.getByRole("button", { name: "Start study session", exact: true }).click();
        return page.getByLabel("Private reflection (optional)", { exact: true });
      }
      if (kind === "preferences") {
        await accountPreferences(page);
        return page.getByLabel("Timezone", { exact: true });
      }
      await page.getByRole("button", { name: "Open study circles", exact: true }).click();
      if (!circleId) {
        await page.getByLabel("Circle name", { exact: true }).fill("Native guard rehearsal circle");
        const created = page.waitForResponse(
          (response) =>
            new URL(response.url()).pathname === "/api/circles" &&
            response.request().method() === "POST",
        );
        await page.getByRole("button", { name: "Create a circle", exact: true }).click();
        circleId = ((await (await created).json()) as { circleId: string }).circleId;
      } else await page.getByRole("button", { name: "Open circle", exact: true }).click();
      await expect(
        page.getByRole("heading", { name: "Native guard rehearsal circle", level: 1, exact: true }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Write a shared copy", exact: true }).click();
      return page.getByLabel("Message", { exact: true });
    };
    const control = await open();
    await expect(page.locator(".global-status")).toBeEmpty();
    const value = kind === "preferences" ? "Africa/Nairobi" : draft;
    await control.fill(value);
    const activity = () => page.getByRole("link", { name: "Activity", exact: true }).click();
    await nativeConfirm(page, activity, false);
    await expect(control).toHaveValue(value);
    await cancelNativeReload(page, control, value);
    await nativeConfirm(page, activity, true);
    await expect(page.getByRole("heading", { name: "Activity", exact: true })).toBeVisible();
    const discarded = await readPlan(page);
    expect(discarded.plan).toEqual(initial.plan);
    expect(discarded.activities).toEqual(initial.activities);
    expect(discarded.completions).toEqual(initial.completions);
    expect((await readMe(page)).profile?.timezone).toBe("Africa/Lagos");
    if (kind === "circle") expect((await readCircle(page, circleId)).items).toEqual([]);

    await page.getByRole("link", { name: "My learning", exact: true }).click();
    const savedControl = await open();
    const savedValue =
      kind === "preferences" ? "Africa/Nairobi" : `Deliberately saved ${kind} text`;
    await savedControl.fill(savedValue);
    if (kind === "plan") {
      await page.getByRole("button", { name: "Save revised plan", exact: true }).click();
      await expect(page.locator(".global-status")).toHaveText(savedMessage);
      expect((await readPlan(page)).plan.steps[0]?.title).toBe(savedValue);
    } else if (kind === "study") {
      await page.getByLabel("Minutes you studied", { exact: true }).fill("5");
      await page.getByRole("button", { name: "Save study session", exact: true }).click();
      await expect(page.getByText("Your study session is saved.", { exact: true })).toBeVisible();
      const saved = await readPlan(page);
      expect(saved.activities).toHaveLength(1);
      expect(saved.activities[0]?.reflection).toBe(savedValue);
      expect(saved.progress.completed).toBe(0);
    } else if (kind === "preferences") {
      await page
        .getByRole("button", { name: "Save preferences and continue", exact: true })
        .click();
      await expect(page.locator(".global-status")).toHaveText("Preferences saved.");
      expect((await readMe(page)).profile?.timezone).toBe(savedValue);
    } else {
      await page.getByRole("button", { name: "Preview copy", exact: true }).click();
      expect((await readCircle(page, circleId)).items).toEqual([]);
      await page.getByRole("button", { name: "Share commitment", exact: true }).click();
      await expect(page.locator(".circle-item .circle-message")).toHaveText(savedValue);
      const saved = await readCircle(page, circleId);
      expect(saved.items).toHaveLength(1);
      expect(saved.items[0]?.text).toBe(savedValue);
    }
    await noNativeWarning(page, activity);
    await expect(page.locator(".global-status")).toBeEmpty();
    await noNativeWarning(page, () => page.reload());
  });
}

test("RC03: completion keeps an unsaved private reflection guarded until its separate study save", async ({
  page,
}) => {
  await createAccount(page);
  await saveManualPlan(page);
  await page.getByRole("button", { name: "Start study session", exact: true }).click();
  const reflection = page.getByLabel("Private reflection (optional)", { exact: true });
  const text = "My private explanation remains unsaved after completion";
  await reflection.fill(text);
  await page.getByRole("button", { name: "Mark this step complete", exact: true }).click();
  await expect(
    page.getByText("Step completed. Your earlier effort is still recorded.", { exact: true }),
  ).toBeVisible();
  const completed = await readPlan(page);
  expect(completed.progress.completed).toBe(1);
  expect(completed.activities).toEqual([]);
  await nativeConfirm(
    page,
    () => page.getByRole("button", { name: "Choose the next action", exact: true }).click(),
    false,
  );
  await expect(reflection).toHaveValue(text);
  await cancelNativeReload(page, reflection, text);
  await page.getByLabel("Minutes you studied", { exact: true }).fill("5");
  await page.getByRole("button", { name: "Save study session", exact: true }).click();
  await expect(page.getByText("Your study session is saved.", { exact: true })).toBeVisible();
  const studied = await readPlan(page);
  expect(studied.progress.completed).toBe(1);
  expect(studied.activities).toHaveLength(1);
  expect(studied.activities[0]?.reflection).toBe(text);
  await noNativeWarning(page, () =>
    page.getByRole("link", { name: "Activity", exact: true }).click(),
  );
  await noNativeWarning(page, () => page.reload());
});
