import { expect, type Locator, type Page, test } from "@playwright/test";
import type { LearningPlan, PlanDetail } from "../../src/shared/contracts.js";
import {
  createAccount,
  openManualDraft,
  respectAuthenticationRateLimit,
  saveManualPlan,
} from "./helpers.js";

test.afterEach(async ({ page: _page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) await respectAuthenticationRateLimit();
});

async function expectFieldError(control: Locator, copy: string | RegExp): Promise<void> {
  await expect(control).toHaveAttribute("aria-invalid", "true");
  const described = (await control.getAttribute("aria-describedby"))?.split(/\s+/) ?? [];
  expect(described.some((id) => id.endsWith("-error"))).toBe(true);
  await expect(control).toHaveAccessibleDescription(copy);
}

async function changeLocale(page: Page, locale: "en" | "fr"): Promise<void> {
  await page.locator(".language-select").selectOption(locale);
}

test("UL02: authentication failure unlocks, preserves input and focuses its generic error", async ({
  page,
}) => {
  await page.goto("/");
  await page.route("**/api/auth/sign-in/email", (route) => route.abort("failed"));
  const email = page.locator('.auth-form input[name="email"]');
  const password = page.locator('.auth-form input[name="password"]');
  await expect(email).toHaveAccessibleName("Email address");
  await expect(password).toHaveAccessibleName("Password");
  await email.fill("synthetic-recovery@example.test");
  await password.fill("Synthetic-private-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).press("Enter");
  const error = page.getByRole("alert");
  await expect(error).toContainText("We could not reach the local server");
  await expect(error).toBeFocused();
  await expect(email).toBeEnabled();
  await expect(password).toHaveValue("Synthetic-private-password");
  await expect(email).toHaveValue("synthetic-recovery@example.test");
  await expect(page.locator(".auth-form")).not.toHaveAttribute("aria-busy", "true");
  await changeLocale(page, "fr");
  await expect(email).toHaveAccessibleName("Adresse e-mail");
  await expect(password).toHaveAccessibleName("Mot de passe");
  await expect(error).toContainText("Impossible de joindre le serveur local");
  await expect(password).toHaveValue("Synthetic-private-password");
});

test("UL01/02/07: real timezone rejection keeps its hint, localizes and recovers field focus", async ({
  page,
}) => {
  await createAccount(page);
  await page.getByLabel("Account", { exact: true }).click();
  await page.getByRole("button", { name: "Preferences", exact: true }).click();
  const timezone = page.locator('.settings-form input[name="timezone"]');
  await expect(timezone).toHaveAccessibleName("Timezone");
  const hint = await timezone.getAttribute("aria-describedby");
  await expect(timezone).toHaveAccessibleDescription(/Choose a suggestion or type a timezone/);
  await timezone.fill("Not/A_Timezone");
  await page
    .getByRole("button", { name: "Save preferences and continue", exact: true })
    .press("Enter");
  await expectFieldError(timezone, /Enter a valid timezone, such as Africa\/Lagos\./);
  await expect(timezone).toBeFocused();
  await expect(timezone).toBeEnabled();
  await expect(timezone).toHaveValue("Not/A_Timezone");
  expect((await timezone.getAttribute("aria-describedby"))?.split(" ")).toContain(hint);
  expect(await (await page.request.get("/api/me")).json()).toMatchObject({
    profile: { timezone: "Africa/Lagos" },
  });
  await changeLocale(page, "fr");
  await expect(timezone).toHaveAccessibleName("Fuseau horaire");
  await expectFieldError(timezone, /Saisissez un fuseau horaire valide, comme Africa\/Lagos\./);
  await timezone.fill("Africa/Nairobi");
  await expect(timezone).not.toHaveAttribute("aria-invalid", "true");
  await expect(timezone).toHaveAttribute("aria-describedby", hint ?? "");
  await expect(timezone).toHaveAccessibleDescription(/Choisissez une suggestion/);
});

test("UL01: reference count and malformed-link guidance differ without losing the reviewed draft", async ({
  page,
}) => {
  await createAccount(page);
  await openManualDraft(page, "My authored goal remains", "My authored action");
  let writes = 0;
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/api/plans" && request.method() === "POST") writes++;
  });
  const references = page.locator('textarea[name="references"]');
  await expect(references).toHaveAccessibleName("Reference links (optional)");
  const hint = await references.getAttribute("aria-describedby");
  const links = Array.from({ length: 11 }, (_, index) => `https://example.test/resource-${index}`);
  await references.fill(links.join("\n"));
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).press("Enter");
  await expectFieldError(references, /Use at most 10 reference links, one per line\./);
  await expect(references).toBeFocused();
  expect(writes).toBe(0);
  await changeLocale(page, "fr");
  await expect(references).toHaveAccessibleName("Liens de référence (facultatifs)");
  await expectFieldError(references, /Utilisez au maximum 10 liens de référence/);
  await references.fill(`https://example.test/${"a".repeat(2049)}`);
  await page.getByRole("button", { name: "Confirmer et enregistrer", exact: true }).press("Enter");
  await expectFieldError(references, /Limitez chaque lien de référence à 2048 caractères\./);
  await expect(references).toBeFocused();
  expect(writes).toBe(0);
  await references.fill("javascript:alert(1)");
  await expect(references).not.toHaveAttribute("aria-invalid", "true");
  await expect(references).toHaveAttribute("aria-describedby", hint ?? "");
  await page.getByRole("button", { name: "Confirmer et enregistrer", exact: true }).press("Enter");
  await expectFieldError(references, /Utilisez des liens absolus http ou https/);
  await expect(references).toBeFocused();
  await references.fill("https://user:password@example.test/private");
  await page.getByRole("button", { name: "Confirmer et enregistrer", exact: true }).press("Enter");
  await expectFieldError(references, /sans identifiant ni mot de passe/);
  expect(writes).toBe(0);
  await expect(page.getByLabel("Objectif d’apprentissage", { exact: true })).toHaveValue(
    "My authored goal remains",
  );
  await expect(page.getByLabel("Action", { exact: true })).toHaveValue("My authored action");
  const accepted = links.slice(0, 9).concat(links[0] ?? "");
  await references.fill(`\n${accepted.join("\n")}\n`);
  await page.getByRole("button", { name: "Confirmer et enregistrer", exact: true }).click();
  await expect(page.getByText("0 étapes terminées sur 1", { exact: true })).toBeVisible();
  expect(writes).toBe(1);
  const plans = (await (await page.request.get("/api/plans")).json()) as { plans: LearningPlan[] };
  expect(plans.plans[0]?.references).toEqual(accepted);
});

test("UL01/02: known goal errors associate, while status and ambiguous row errors recover generically", async ({
  page,
}) => {
  await createAccount(page);
  await openManualDraft(page);
  const goal = page.getByLabel("Learning goal", { exact: true });
  await goal.fill("   ");
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).press("Enter");
  await expectFieldError(goal, /Enter a learning goal of 1–160 characters\./);
  await expect(goal).toBeFocused();
  await goal.fill("My preserved draft");
  await expect(goal).not.toHaveAttribute("aria-invalid", "true");
  let failure = { status: 409, code: "stale_revision", field: "goal" };
  await page.route("**/api/plans", async (route) => {
    if (route.request().method() !== "POST") return void (await route.continue());
    await route.fulfill({
      status: failure.status,
      json: { error: { code: failure.code, field: failure.field } },
    });
  });
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).press("Enter");
  await expect(page.getByRole("alert")).toContainText("This plan changed in another window");
  await expect(page.getByRole("alert")).toBeFocused();
  await expect(goal).not.toHaveAttribute("aria-invalid", "true");
  failure = { status: 400, code: "invalid_input", field: "stepTitle" };
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).press("Enter");
  await expect(page.getByRole("alert")).toHaveText("Check that every action has 1–240 characters.");
  await expect(page.getByRole("alert")).toBeFocused();
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
  failure = { status: 400, code: "invalid_input", field: "unknown_field" };
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).press("Enter");
  await expect(page.getByRole("alert")).toHaveText(
    "Check your input and use valid dates, whole minutes, and http or https links.",
  );
  await expect(page.getByRole("alert")).toBeFocused();
  await expect(goal).toHaveValue("My preserved draft");
});

test("UL03: forty-nine to fifty disables Add with a localized count; removing restores it and row focus", async ({
  page,
}) => {
  await createAccount(page);
  await openManualDraft(
    page,
    "A longer reviewed draft",
    Array.from({ length: 49 }, (_, index) => `Action ${index + 1}`).join("\n"),
  );
  const add = page.getByRole("button", { name: "Add a step", exact: true });
  await expect(add).toBeEnabled();
  await expect(add).toHaveAccessibleDescription(
    "49 of 50 steps. At the limit, remove a step before adding another.",
  );
  await add.press("Enter");
  await expect(page.getByLabel("Action", { exact: true })).toHaveCount(50);
  await expect(add).toBeDisabled();
  await expect(add).toHaveAccessibleDescription(
    "50 of 50 steps. At the limit, remove a step before adding another.",
  );
  const last = page.getByRole("group", { name: "Step 50 of 50", exact: true });
  await expect(last.getByLabel("Action", { exact: true })).toBeFocused();
  await expect(last.getByRole("button", { name: "Move step down", exact: true })).toBeDisabled();
  await changeLocale(page, "fr");
  const frenchAdd = page.getByRole("button", { name: "Ajouter une étape", exact: true });
  await expect(frenchAdd).toHaveAccessibleDescription(
    "50 étapes sur 50. À la limite, retirez une étape avant d’en ajouter une autre.",
  );
  await page
    .getByRole("group", { name: "Étape 50 sur 50", exact: true })
    .getByRole("button", { name: "Retirer", exact: true })
    .press("Enter");
  await expect(page.getByLabel("Action", { exact: true })).toHaveCount(49);
  await expect(frenchAdd).toBeEnabled();
  await expect(frenchAdd).toHaveAccessibleDescription(/^49 étapes sur 50\./);
  await expect(
    page
      .getByRole("group", { name: "Étape 49 sur 49", exact: true })
      .getByRole("button", { name: "Retirer", exact: true }),
  ).toBeFocused();
  expect(
    ((await (await page.request.get("/api/plans")).json()) as { plans: LearningPlan[] }).plans,
  ).toHaveLength(0);
});

test("UL02: a late failed editor save cannot move focus or mark a newer draft invalid", async ({
  page,
}) => {
  await createAccount(page);
  await saveManualPlan(page);
  const plans = (await (await page.request.get("/api/plans")).json()) as { plans: LearningPlan[] };
  const plan = plans.plans[0];
  if (!plan) throw new Error("Expected the isolated saved plan");
  await page.getByRole("button", { name: "Edit plan", exact: true }).click();
  await page.getByLabel("Learning goal", { exact: true }).fill("The older unsaved edit");
  let release = (): void => {};
  let ready = (): void => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const requested = new Promise<void>((resolve) => {
    ready = resolve;
  });
  await page.route(`**/api/plans/${plan.id}`, async (route) => {
    if (route.request().method() !== "PUT") return void (await route.continue());
    ready();
    await gate;
    await route.fulfill({ status: 400, json: { error: { code: "invalid_input", field: "goal" } } });
  });
  await page.getByRole("button", { name: "Save revised plan", exact: true }).press("Enter");
  await requested;
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("link", { name: "Journeys", exact: true }).click();
  await page.getByRole("button", { name: "Create a learning plan", exact: true }).click();
  const goal = page.getByLabel("Learning goal", { exact: true });
  await goal.fill("My newer draft retains focus");
  const delivered = page.waitForResponse(
    (response) =>
      response.request().method() === "PUT" &&
      new URL(response.url()).pathname === `/api/plans/${plan.id}`,
  );
  release();
  await (await delivered).finished();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  await expect(goal).toBeFocused();
  await expect(goal).toHaveValue("My newer draft retains focus");
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(goal).not.toHaveAttribute("aria-invalid", "true");
  const saved = (await (await page.request.get(`/api/plans/${plan.id}`)).json()) as PlanDetail;
  expect(saved.plan.goal).not.toBe("The older unsaved edit");
});

test("UL01/02/07: study failure associates known fields, then generic completion failure preserves private input", async ({
  page,
}) => {
  await createAccount(page);
  await saveManualPlan(page);
  await page.getByRole("button", { name: "Start study session", exact: true }).click();
  const minutes = page.getByLabel("Minutes you studied", { exact: true });
  const reflection = page.getByLabel("Private reflection (optional)", { exact: true });
  await expect(minutes).toHaveValue("10");
  await expect(minutes).toHaveAccessibleDescription(/Time is not measured automatically\./);
  await minutes.fill("9");
  await reflection.fill("My private unsaved reflection");
  await page.route("**/activities", (route) =>
    route.fulfill({ status: 400, json: { error: { code: "invalid_input", field: "minutes" } } }),
  );
  await page.getByRole("button", { name: "Save study session", exact: true }).press("Enter");
  await expectFieldError(minutes, /Enter whole minutes from 1 to 480\./);
  await expect(minutes).toBeFocused();
  await expect(minutes).toBeEnabled();
  await minutes.fill("8");
  await expect(minutes).not.toHaveAttribute("aria-invalid", "true");
  await page.route("**/completions", (route) => route.abort("failed"));
  await page.getByRole("button", { name: "Mark this step complete", exact: true }).press("Enter");
  const error = page.locator(".completion-section").getByRole("alert");
  await expect(error).toContainText("We could not reach the local server");
  await expect(error).toBeFocused();
  await expect(reflection).toHaveValue("My private unsaved reflection");
  await expect(minutes).toHaveValue("8");
  await expect(page.getByRole("button", { name: "Save study session", exact: true })).toBeEnabled();
});
