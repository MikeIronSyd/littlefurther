import { expect, type Locator, type Page, test } from "@playwright/test";
import type { GoalTemplate, LearningPlan, PlanDetail } from "../../src/shared/contracts.js";
import {
  createAccount,
  expectNoHorizontalOverflow,
  openManualDraft,
  respectAuthenticationRateLimit,
  saveManualPlan,
} from "./helpers.js";

test.afterEach(async ({ page: _page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) await respectAuthenticationRateLimit();
});

async function savedDetail(page: Page): Promise<PlanDetail> {
  const plans = await page.request.get("/api/plans");
  expect(plans.ok()).toBe(true);
  const plan = ((await plans.json()) as { plans: LearningPlan[] }).plans[0];
  if (!plan) throw new Error("Expected the synthetic learner's saved plan");
  const detail = await page.request.get(`/api/plans/${plan.id}`);
  expect(detail.ok()).toBe(true);
  return (await detail.json()) as PlanDetail;
}

function expectLearningDataPreserved(before: PlanDetail, after: PlanDetail): void {
  // A deliberate profile-language change updates presentation metadata for all plans.
  // Assert that every other persisted field, including revision and history, is unchanged.
  const { locale: beforeLocale, updatedAt: beforeUpdatedAt, ...beforePlan } = before.plan;
  const { locale: afterLocale, updatedAt: afterUpdatedAt, ...afterPlan } = after.plan;
  expect(beforeLocale).toBe("en");
  expect(afterLocale).toBe("fr");
  expect(Date.parse(afterUpdatedAt)).toBeGreaterThanOrEqual(Date.parse(beforeUpdatedAt));
  expect({ ...after, plan: afterPlan }).toEqual({ ...before, plan: beforePlan });
}

async function expectFieldError(control: Locator, copy: string | RegExp): Promise<void> {
  await expect(control).toHaveAttribute("aria-invalid", "true");
  const association = await control.evaluate((element) => {
    const ids = (element.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean);
    return {
      ids,
      alerts: ids
        .map((id) => document.getElementById(id))
        .filter((node) => node?.getAttribute("role") === "alert")
        .map((node) => node?.textContent ?? ""),
    };
  });
  expect(association.ids.length, "The existing hint remains beside the error association").toBe(2);
  expect(association.alerts).toHaveLength(1);
  if (typeof copy === "string") expect(association.alerts[0]).toBe(copy);
  else expect(association.alerts[0]).toMatch(copy);
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

function calendarLabel(date: string, locale: "en" | "fr"): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

async function expectSafeLink(link: Locator, href: string): Promise<void> {
  await expect(link).toHaveAttribute("href", href);
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", /\bnoopener\b/);
  await expect(link).toHaveAttribute("rel", /\bnoreferrer\b/);
}

test("RF01: keyboard moves retain authored row values, position feedback and logical Tab focus", async ({
  page,
}) => {
  await createAccount(page);
  await openManualDraft(page, "My retained goal", "Alpha action\nBravo action\nCharlie action");
  await page.getByLabel("Estimated minutes", { exact: true }).first().fill("17");
  await page.getByLabel("Study date", { exact: true }).first().fill("2026-10-09");
  const form = page.locator("form.editor-form");
  const reorderStatus = form
    .getByRole("status")
    .filter({ hasText: /^(Step moved|Étape déplacée)/ });
  await expect(form).toHaveAccessibleName("Shape a plan you can return to");
  const firstDown = page
    .getByRole("group", { name: "Step 1 of 3", exact: true })
    .getByRole("button", { name: "Move step down", exact: true });
  await firstDown.focus();
  await page.keyboard.press("Enter");
  const middle = page.getByRole("group", { name: "Step 2 of 3", exact: true });
  await expect(middle.getByLabel("Action", { exact: true })).toHaveValue("Alpha action");
  await expect(middle.getByLabel("Study date", { exact: true })).toHaveValue("2026-10-09");
  await expect(middle.getByLabel("Estimated minutes", { exact: true })).toHaveValue("17");
  await expect(middle.getByRole("button", { name: "Move step down", exact: true })).toBeFocused();
  await expect(reorderStatus).toHaveText("Step moved to position 2 of 3.");
  await expect(reorderStatus).toHaveAttribute("aria-live", "polite");
  await page.keyboard.press("Tab");
  await expect(middle.getByRole("button", { name: "Remove", exact: true })).toBeFocused();
  await middle.getByRole("button", { name: "Move step down", exact: true }).focus();
  await page.keyboard.press("Enter");
  const last = page.getByRole("group", { name: "Step 3 of 3", exact: true });
  await expect(last.getByLabel("Action", { exact: true })).toBeFocused();
  await expect(last.getByLabel("Action", { exact: true })).toHaveValue("Alpha action");
  await expect(last.getByRole("button", { name: "Move step down", exact: true })).toBeDisabled();
  expect(
    await page
      .getByLabel("Action", { exact: true })
      .evaluateAll((controls) => controls.map((control) => (control as HTMLInputElement).value)),
  ).toEqual(["Bravo action", "Charlie action", "Alpha action"]);
  await changeLocale(page, "fr");
  await expect(reorderStatus).toHaveText("Étape déplacée à la position 3 sur 3.");
  await page
    .getByRole("group", { name: "Étape 3 sur 3", exact: true })
    .getByRole("button", { name: "Monter l’étape", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  const middleFrench = page.getByRole("group", { name: "Étape 2 sur 3", exact: true });
  await expect(
    middleFrench.getByRole("button", { name: "Monter l’étape", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  const firstFrench = page.getByRole("group", { name: "Étape 1 sur 3", exact: true });
  await expect(firstFrench.getByLabel("Action", { exact: true })).toBeFocused();
  await expect(
    firstFrench.getByRole("button", { name: "Monter l’étape", exact: true }),
  ).toBeDisabled();
  await expect(reorderStatus).toHaveText("Étape déplacée à la position 1 sur 3.");
  await expect(page.getByLabel("Objectif d’apprentissage", { exact: true })).toHaveValue(
    "My retained goal",
  );
});

test("RF01: removal chooses next, previous and empty recovery focus while resetting saved-scope consent", async ({
  page,
}) => {
  await createAccount(page);
  await openManualDraft(page, "Adjust my scope", "Alpha action\nBravo action\nCharlie action");
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.getByText("0 of 3 steps complete", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Edit plan", exact: true }).click();
  await page
    .getByRole("group", { name: "Step 2 of 3", exact: true })
    .getByRole("button", { name: "Remove", exact: true })
    .press("Enter");
  const next = page.getByRole("group", { name: "Step 2 of 2", exact: true });
  await expect(next.getByLabel("Action", { exact: true })).toHaveValue("Charlie action");
  await expect(next.getByRole("button", { name: "Remove", exact: true })).toBeFocused();
  const consent = page.getByRole("checkbox", { name: /I understand that removing/ });
  await expect(consent).not.toBeChecked();
  await consent.check();
  await next.getByRole("button", { name: "Remove", exact: true }).press("Enter");
  const previous = page.getByRole("group", { name: "Step 1 of 1", exact: true });
  await expect(previous.getByLabel("Action", { exact: true })).toHaveValue("Alpha action");
  await expect(previous.getByRole("button", { name: "Remove", exact: true })).toBeFocused();
  await expect(consent).not.toBeChecked();
  await previous.getByRole("button", { name: "Remove", exact: true }).press("Enter");
  const add = page.getByRole("button", { name: "Add a step", exact: true });
  await expect(add).toBeFocused();
  await expect(page.getByText("Step removed. Active steps: 0.", { exact: true })).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Action", { exact: true })).toBeFocused();
  await page.getByLabel("Action", { exact: true }).fill("Replacement authored action");
  await expect(consent).not.toBeChecked();
  await consent.check();
  await page.getByRole("button", { name: "Save revised plan", exact: true }).click();
  await expect(page.getByText("0 of 1 step complete", { exact: true })).toBeVisible();
  const saved = await savedDetail(page);
  expect(saved.plan.steps.map((step) => step.title)).toEqual(["Replacement authored action"]);
  expect(saved.scopeEvents).toHaveLength(1);
});

test("RF02: recorded and no-record rhythm dates localize in place and remain neutral in Activity", async ({
  page,
}) => {
  await createAccount(page);
  await saveManualPlan(page);
  await page.getByRole("button", { name: "Start study session", exact: true }).click();
  await page.getByLabel("Minutes you studied", { exact: true }).fill("4");
  await page.getByRole("button", { name: "Save study session", exact: true }).click();
  await expect(page.getByText("Your study session is saved.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Choose the next action", exact: true }).click();
  const detail = await savedDetail(page);
  expect(detail.progress.studyDates).toHaveLength(1);
  expect(detail.progress.completed).toBe(0);
  const markers = page.locator(".rhythm-strip li");
  await expect(markers).toHaveCount(7);
  const date = detail.progress.studyDates[0];
  if (!date) throw new Error("Expected the actual synthetic study date");
  await expect(markers.filter({ has: page.locator(".rhythm-dot .icon") })).toHaveAttribute(
    "aria-label",
    `${calendarLabel(date, "en")}: Study recorded`,
  );
  const firstDate = detail.progress.rangeStart;
  await expect(markers.first()).toHaveAttribute(
    "aria-label",
    `${calendarLabel(firstDate, "en")}: No study recorded`,
  );
  await expect(page.getByText("1 study day", { exact: true })).toBeVisible();
  await changeLocale(page, "fr");
  await expect(markers.filter({ has: page.locator(".rhythm-dot .icon") })).toHaveAttribute(
    "aria-label",
    `${calendarLabel(date, "fr")}: Étude enregistrée`,
  );
  await expect(markers.first()).toHaveAttribute(
    "aria-label",
    `${calendarLabel(firstDate, "fr")}: Aucune étude enregistrée`,
  );
  await expect(page.getByText("1 jour d’étude", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Activité", exact: true }).click();
  await expect(markers).toHaveCount(7);
  await expect(markers.filter({ has: page.locator(".rhythm-dot .icon") })).toHaveAttribute(
    "aria-label",
    `${calendarLabel(date, "fr")}: Étude enregistrée`,
  );
  await expect(page.getByText("1 séance · 4 minutes étudiées", { exact: true })).toBeVisible();
  expect((await savedDetail(page)).progress).toEqual(detail.progress);
});

test("RF03: curated availability errors are specific, associated and preserve reviewed input on save", async ({
  page,
}) => {
  await createAccount(page);
  let planWrites = 0;
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/api/plans" && request.method() === "POST")
      planWrites++;
  });
  await page.getByRole("button", { name: "Create a learning plan", exact: true }).click();
  await page.getByLabel("Start from", { exact: true }).selectOption("html-first-page@1");
  const availability = page.locator('textarea[name="availability"]');
  await expect(availability).toHaveAccessibleName("Dates you are available");
  const hint = await availability.getAttribute("aria-describedby");
  await page.getByRole("button", { name: "Review draft steps", exact: true }).click();
  await expectFieldError(availability, "Add at least one available date.");
  await expect(availability).toBeFocused();
  await expect(page.getByLabel("Your topics or sections", { exact: true })).toBeHidden();
  await availability.fill("2026-10-08, tomorrow, 2026-02-30");
  await expect(availability).not.toHaveAttribute("aria-invalid", "true");
  await expect(availability).toHaveAttribute("aria-describedby", hint ?? "");
  await page.getByRole("button", { name: "Review draft steps", exact: true }).click();
  await expectFieldError(availability, /Fix these dates: tomorrow, 2026-02-30\./);
  await expect(availability).toHaveValue("2026-10-08, tomorrow, 2026-02-30");
  const tooMany = Array.from({ length: 367 }, (_, offset) => {
    const date = new Date("2026-01-01T12:00:00Z");
    date.setUTCDate(date.getUTCDate() + offset);
    return date.toISOString().slice(0, 10);
  }).join(", ");
  await availability.fill(tooMany);
  await page.getByRole("button", { name: "Review draft steps", exact: true }).click();
  await expectFieldError(availability, "Use at most 366 available dates.");
  await expect(availability).toHaveValue(tooMany);
  await availability.fill("2026-10-08, 2026-10-10");
  await page.getByRole("button", { name: "Review draft steps", exact: true }).click();
  await expect(page.getByLabel("Action", { exact: true })).toHaveCount(8);
  await page.getByLabel("Action", { exact: true }).first().fill("My authored purpose stays");
  await availability.fill("2026-10-08, tomorrow");
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expectFieldError(availability, /Fix these dates: tomorrow\./);
  await expect(availability).toBeFocused();
  await changeLocale(page, "fr");
  await expectFieldError(availability, /Corrigez ces dates : tomorrow\./);
  await expect(page.getByLabel("Action", { exact: true }).first()).toHaveValue(
    "My authored purpose stays",
  );
  await expect(availability).toHaveValue("2026-10-08, tomorrow");
  expect(planWrites).toBe(0);
  await availability.fill("2026-10-08, 2026-10-10");
  await page.getByRole("button", { name: "Confirmer et enregistrer", exact: true }).click();
  await expect(page.getByText("0 étapes terminées sur 8", { exact: true })).toBeVisible();
  expect(planWrites).toBe(1);
  expect((await savedDetail(page)).plan.steps[0]?.title).toBe("My authored purpose stays");
});

test("RF03: manual topic errors localize separately and editing one field retains the other error", async ({
  page,
}) => {
  await createAccount(page);
  await page.getByRole("button", { name: "Create a learning plan", exact: true }).click();
  await page.getByLabel("Learning goal", { exact: true }).fill("My goal keeps its own language");
  const topics = page.locator('textarea[name="topics"]');
  const availability = page.locator('textarea[name="availability"]');
  await expect(topics).toHaveAccessibleName("Your topics or sections");
  await expect(availability).toHaveAccessibleName("Dates you are available");
  await availability.fill("2026-10-08");
  await page.getByRole("button", { name: "Review draft steps", exact: true }).click();
  await expectFieldError(topics, "Add at least one topic or section, one action per line.");
  await expect(topics).toBeFocused();
  await expect(availability).not.toHaveAttribute("aria-invalid", "true");
  await topics.fill(Array.from({ length: 51 }, (_, index) => `Topic ${index + 1}`).join("\n"));
  await page.getByRole("button", { name: "Review draft steps", exact: true }).click();
  await expectFieldError(topics, "Use at most 50 topics or sections, one action per line.");
  const longTopic = "x".repeat(241);
  await topics.fill(`An authored first action\n${longTopic}`);
  await availability.fill("tomorrow");
  await page.getByRole("button", { name: "Review draft steps", exact: true }).click();
  await expectFieldError(topics, "Shorten topics on lines 2 to at most 240 characters each.");
  await expectFieldError(availability, /Fix these dates: tomorrow\./);
  await expect(topics).toBeFocused();
  await changeLocale(page, "fr");
  await expectFieldError(topics, "Limitez les sujets des lignes 2 à 240 caractères chacun.");
  await expect(topics).toHaveValue(`An authored first action\n${longTopic}`);
  await expect(page.getByLabel("Objectif d’apprentissage", { exact: true })).toHaveValue(
    "My goal keeps its own language",
  );
  await topics.fill("An authored first action");
  await expect(topics).not.toHaveAttribute("aria-invalid", "true");
  await expectFieldError(availability, /Corrigez ces dates : tomorrow\./);
  await availability.fill("2026-10-08");
  await page.getByRole("button", { name: "Vérifier les étapes proposées", exact: true }).click();
  await expect(page.getByLabel("Action", { exact: true })).toHaveValue("An authored first action");
  expect(
    ((await (await page.request.get("/api/plans")).json()) as { plans: LearningPlan[] }).plans,
  ).toHaveLength(0);
});

test("RF04: French mobile Edit step follows the selected stable step and preserves dirty-state controls", async ({
  page,
}) => {
  await createAccount(page);
  await openManualDraft(
    page,
    "A selected step stays clear",
    "Already finished\nSelected next action\nLater action",
  );
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.getByText("0 of 3 steps complete", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Start study session", exact: true }).click();
  await page.getByRole("button", { name: "Mark this step complete", exact: true }).click();
  await expect(
    page.getByText("Step completed. Your earlier effort is still recorded.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Choose the next action", exact: true }).click();
  const before = await savedDetail(page);
  const selectedId = before.nextStepId;
  expect(selectedId).toBe(before.plan.steps[1]?.id);
  await changeLocale(page, "fr");
  await page.setViewportSize({ width: 320, height: 720 });
  await page.getByRole("button", { name: "Modifier l’étape", exact: true }).click();
  const selected = page.getByRole("group", { name: "Étape 2 sur 3", exact: true });
  await expect(selected.getByLabel("Action", { exact: true })).toBeFocused();
  await expect(selected.getByLabel("Action", { exact: true })).toHaveValue("Selected next action");
  await expect(
    selected.getByText("Modification de l’étape 2 sur 3.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Action", { exact: true })).toHaveCount(3);
  await expect(page.getByLabel("Action", { exact: true }).first()).toHaveAttribute("readonly", "");
  await selected.getByLabel("Action", { exact: true }).fill("My selected action stays authored");
  await selected.getByRole("button", { name: "Descendre l’étape", exact: true }).press("Enter");
  const moved = page.getByRole("group", { name: "Étape 3 sur 3", exact: true });
  await expect(moved.getByLabel("Action", { exact: true })).toBeFocused();
  await expect(moved.getByText("Modification de l’étape 3 sur 3.", { exact: true })).toBeVisible();
  let warned = false;
  page.once("dialog", async (dialog) => {
    warned = dialog.type() === "confirm";
    await dialog.dismiss();
  });
  await page.getByRole("button", { name: "Annuler", exact: true }).first().click();
  expect(warned).toBe(true);
  await expect(moved.getByLabel("Action", { exact: true })).toHaveValue(
    "My selected action stays authored",
  );
  await expectNoHorizontalOverflow(page);
  page.once("dialog", async (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Annuler", exact: true }).first().click();
  await expect(
    page.getByRole("button", { name: "Modifier le parcours", exact: true }),
  ).toBeVisible();
  expectLearningDataPreserved(before, await savedDetail(page));
  await page.getByRole("button", { name: "Modifier le parcours", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Adaptez votre parcours", exact: true }),
  ).toBeFocused();
  await expect(page.getByText(/Modification de l’étape/)).toHaveCount(0);
});

test("RF05: study exposes localized template and learner references without fetching or changing private inputs", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  // Rendering-only catalog fixture exercises duplicate display URLs without changing the server catalog.
  await page.route("**/api/templates", async (route) => {
    const response = await route.fetch();
    const body = (await response.json()) as { templates: GoalTemplate[] };
    for (const template of body.templates)
      for (const locale of ["en", "fr"] as const) {
        const first = template.sources[locale][0];
        if (first) template.sources[locale].push({ ...first });
      }
    await route.fulfill({ response, json: body });
  });
  await createAccount(page);
  await page.getByRole("button", { name: "Create a learning plan", exact: true }).click();
  await page.getByLabel("Start from", { exact: true }).selectOption("html-first-page@1");
  const reference = "https://example.test/my-own-reference";
  await page
    .getByLabel("Reference links (optional)", { exact: true })
    .fill(`${reference}\n${reference}`);
  await page.getByLabel("Dates you are available", { exact: true }).fill("2026-10-08");
  await page.getByRole("button", { name: "Review draft steps", exact: true }).click();
  await page.getByLabel("Action", { exact: true }).first().fill("My authored page purpose");
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.getByText("0 of 8 steps complete", { exact: true })).toBeVisible();
  const before = await savedDetail(page);
  expect(before.plan.references).toEqual([reference, reference]);
  let externalRequests = 0;
  let journeyWrites = 0;
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!["127.0.0.1", "localhost"].includes(url.hostname)) externalRequests++;
    if (
      url.pathname.startsWith("/api/plans") &&
      ["POST", "PUT", "DELETE"].includes(request.method())
    )
      journeyWrites++;
  });
  await page.getByRole("button", { name: "Start study session", exact: true }).click();
  const resources = page.getByRole("region", { name: "Your references", exact: true });
  await expect(
    resources.getByRole("heading", { name: "Template sources", exact: true }),
  ).toBeVisible();
  await expect(resources.getByRole("link")).toHaveCount(3);
  await expectSafeLink(
    resources.getByRole("link", { name: "MDN — HTML: Creating the content", exact: true }),
    "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Creating_the_content",
  );
  await expectSafeLink(resources.getByRole("link", { name: reference, exact: true }), reference);
  await expect(resources.getByText("Checked 2026-10-07", { exact: true })).toHaveCount(2);
  await expect(
    resources.getByText("Opens an external resource; internet may be needed.", { exact: true }),
  ).toBeVisible();
  const minutes = page.getByLabel("Minutes you studied", { exact: true });
  const reflection = page.getByLabel("Private reflection (optional)", { exact: true });
  await minutes.fill("9");
  await reflection.fill("My private reflection stays in my words");
  await changeLocale(page, "fr");
  const frenchResources = page.getByRole("region", { name: "Vos références", exact: true });
  await expect(
    frenchResources.getByRole("heading", { name: "Sources du modèle", exact: true }),
  ).toBeVisible();
  await expect(frenchResources.getByRole("link")).toHaveCount(3);
  await expectSafeLink(
    frenchResources.getByRole("link", { name: "MDN — HTML : Créer le contenu", exact: true }),
    "https://developer.mozilla.org/fr/docs/Learn_web_development/Getting_started/Your_first_website/Creating_the_content",
  );
  await expect(frenchResources.getByText("Vérifié le 2026-10-07", { exact: true })).toHaveCount(2);
  await expect(
    frenchResources.getByText("Ouvre une ressource externe ; une connexion peut être nécessaire.", {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Passer en mode sombre", exact: true }).click();
  await expect(page.getByLabel("Minutes étudiées", { exact: true })).toHaveValue("9");
  await expect(page.getByLabel("Note privée (facultative)", { exact: true })).toHaveValue(
    "My private reflection stays in my words",
  );
  await expect(
    page.getByRole("heading", { name: "My authored page purpose", exact: true }),
  ).toBeVisible();
  expect(externalRequests).toBe(0);
  expect(journeyWrites).toBe(0);
  expectLearningDataPreserved(before, await savedDetail(page));
});

test("RF05: manual, empty and mismatched-version study resources retain provenance boundaries", async ({
  page,
}) => {
  await createAccount(page);
  await openManualDraft(page);
  const reference = "https://example.test/private-reference";
  await page.getByLabel("Reference links (optional)", { exact: true }).fill(reference);
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.getByText("0 of 2 steps complete", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Start study session", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "Your references", exact: true }).getByRole("link"),
  ).toHaveCount(1);
  await expect(page.getByRole("link", { name: /^MDN/ })).toHaveCount(0);
  await page.getByRole("button", { name: "Choose the next action", exact: true }).click();
  await page.getByRole("button", { name: "Edit plan", exact: true }).click();
  await page.getByLabel("Reference links (optional)", { exact: true }).fill("");
  await page.getByRole("button", { name: "Save revised plan", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Start study session", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Start study session", exact: true }).click();
  await expect(page.getByRole("region", { name: "Your references", exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /^MDN/ })).toHaveCount(0);
  await page.getByRole("button", { name: "Choose the next action", exact: true }).click();
  await page.getByRole("button", { name: "Edit plan", exact: true }).click();
  await page.getByLabel("Reference links (optional)", { exact: true }).fill(reference);
  await page.getByRole("button", { name: "Save revised plan", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Start study session", exact: true }),
  ).toBeVisible();
  const actual = await savedDetail(page);
  // The API cannot create an unknown version. Intercept only detail GET readback for a rendering fixture.
  await page.route(`**/api/plans/${actual.plan.id}`, async (route) => {
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }
    const response = await route.fetch();
    const detail = (await response.json()) as PlanDetail;
    detail.plan.templateId = "html-first-page@1";
    detail.plan.templateVersion = 2;
    await route.fulfill({ response, json: detail });
  });
  await page.reload();
  await page.getByRole("button", { name: "Start study session", exact: true }).click();
  const resources = page.getByRole("region", { name: "Your references", exact: true });
  await expect(
    resources.getByText(
      "Sources for this template version are unavailable. Your own references remain below when provided.",
      { exact: true },
    ),
  ).toBeVisible();
  await expectSafeLink(resources.getByRole("link", { name: reference, exact: true }), reference);
  await expect(page.getByRole("link", { name: /^MDN/ })).toHaveCount(0);
  await changeLocale(page, "fr");
  await expect(
    page.getByText(
      "Les sources de cette version du modèle sont indisponibles. Vos propres références restent ci-dessous si vous en avez ajouté.",
      { exact: true },
    ),
  ).toBeVisible();
  expectLearningDataPreserved(actual, await savedDetail(page));
  expect(actual.plan.templateId).toBeNull();
  expect(actual.plan.templateVersion).toBeNull();
});
