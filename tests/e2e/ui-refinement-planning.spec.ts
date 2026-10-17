import { expect, type Page, test } from "@playwright/test";
import type { AiAssistInput, AiAssistResponse } from "../../src/shared/ai-contracts.js";
import type { LearningPlan, PlanDetail } from "../../src/shared/contracts.js";
import { createAccount, expectNoHorizontalOverflow, selectAvailability } from "./helpers.js";

const aiDraft: AiAssistResponse = {
  kind: "plan",
  goal: "Read my notes in small steps",
  outcome: "Explain one short section",
  prerequisites: "My own learning notes",
  steps: [{ title: "Read one paragraph and write a sentence", estimatedMinutes: 5, sourceIds: [] }],
  sources: [],
};

async function aiReady(page: Page): Promise<void> {
  await page.route("**/api/ai/status", (route) =>
    route.fulfill({ json: { available: true, reason: null, model: "synthetic-test-model" } }),
  );
}

async function plans(page: Page): Promise<LearningPlan[]> {
  const response = await page.request.get("/api/plans");
  expect(response.ok()).toBe(true);
  return ((await response.json()) as { plans: LearningPlan[] }).plans;
}

test("UR01/02: native drafting routes preserve entered values and reject a delayed result after switching", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await aiReady(page);
  let release: () => void = () => {};
  let observed: () => void = () => {};
  let settled = false;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  const requested = new Promise<void>((resolve) => {
    observed = resolve;
  });
  let sent: AiAssistInput | null = null;
  await page.route("**/api/ai/assist", async (route) => {
    sent = route.request().postDataJSON() as AiAssistInput;
    observed();
    await pending;
    await route.fulfill({ json: aiDraft }).catch(() => {});
    settled = true;
  });
  await createAccount(page);
  await page.getByRole("button", { name: "Create a learning plan", exact: true }).click();
  const manual = page.getByRole("radio", { name: "Use my topics or a starter", exact: true });
  const ai = page.getByRole("radio", { name: "Draft with AI", exact: true });
  const topics = page.getByLabel("Your topics or sections (optional)", { exact: true });
  await expect(manual).toBeChecked();
  await expect(page.locator(".ai-assistance")).toBeHidden();
  await page.getByLabel("Learning goal", { exact: true }).fill("A plan from my own notes");
  await topics.fill("Keep my original topic");
  await selectAvailability(page, ["2026-10-18"]);
  await manual.focus();
  await page.keyboard.press("ArrowRight");
  await expect(ai).toBeChecked();
  await expect(topics).toBeHidden();
  await expect(topics).toBeDisabled();
  await page.locator(".planning-extras > summary").click();
  await page.getByLabel("What you already know (optional)", { exact: true }).fill("I have notes");
  await page
    .getByLabel("Paste learning material (optional)", { exact: true })
    .fill("A short section");
  await page
    .getByLabel("Reference links (optional)", { exact: true })
    .fill("https://example.test/my-notes");
  await page.getByRole("button", { name: "Draft my plan with AI", exact: true }).click();
  await requested;
  await manual.check();
  release();
  await expect.poll(() => settled).toBe(true);
  await expect(topics).toBeVisible();
  await expect(topics).toHaveValue("Keep my original topic");
  await expect(page.getByRole("button", { name: "Review AI draft", exact: true })).toHaveCount(0);
  expect(sent).toMatchObject({
    action: "plan_draft",
    startingPoint: "I have notes",
    material: "A short section",
    links: ["https://example.test/my-notes"],
  });
  await ai.check();
  await expect(page.getByLabel("What you already know (optional)", { exact: true })).toHaveValue(
    "I have notes",
  );
  await expect(page.getByLabel("Paste learning material (optional)", { exact: true })).toHaveValue(
    "A short section",
  );
  await expect(page.locator(".ai-result")).toBeEmpty();
  await ai.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(manual).toBeChecked();
  await page.getByRole("button", { name: "Review draft steps", exact: true }).click();
  await expect(page.getByLabel("Action", { exact: true })).toHaveValue("Keep my original topic");
  await expect(manual).toBeDisabled();
  await expect(ai).toBeDisabled();
  expect(await plans(page)).toHaveLength(0);
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.getByText("0 of 1 step complete", { exact: true })).toBeVisible();
  expect((await plans(page))[0]?.goal).toBe("A plan from my own notes");
});

test("UR01/02: AI route reveals invalid optional links, reviews explicitly and saves only on confirmation", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await aiReady(page);
  let calls = 0;
  await page.route("**/api/ai/assist", (route) => {
    calls += 1;
    return route.fulfill({ json: aiDraft });
  });
  await createAccount(page);
  await page.getByRole("button", { name: "Create a learning plan", exact: true }).click();
  await page.getByLabel("Learning goal", { exact: true }).fill("Read my learning notes");
  await page.getByRole("radio", { name: "Draft with AI", exact: true }).check();
  await selectAvailability(page, ["2026-10-18"]);
  const extras = page.locator(".planning-extras");
  const summary = extras.locator(":scope > summary");
  const references = page.getByLabel("Reference links (optional)", { exact: true });
  await expect(extras).not.toHaveAttribute("open");
  await summary.click();
  await references.fill("not a reference URL");
  await summary.click();
  await page.getByRole("button", { name: "Draft my plan with AI", exact: true }).press("Enter");
  await expect(extras).toHaveAttribute("open", "");
  await expect(references).toBeFocused();
  await expect(references).toHaveAttribute("aria-invalid", "true");
  expect(calls).toBe(0);
  await references.fill("");
  await summary.click();
  await page.getByRole("button", { name: "Draft my plan with AI", exact: true }).click();
  await expect(page.getByRole("button", { name: "Review AI draft", exact: true })).toBeVisible();
  expect(await plans(page)).toHaveLength(0);
  await page.getByRole("button", { name: "Review AI draft", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Review every step", exact: true })).toBeFocused();
  await expect(page.getByRole("radio", { name: "Draft with AI", exact: true })).toBeDisabled();
  await expect(page.locator(".ai-assistance")).toBeHidden();
  await page.getByLabel("Action", { exact: true }).fill("Explain one paragraph in my own words");
  expect(await plans(page)).toHaveLength(0);
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.getByText("0 of 1 step complete", { exact: true })).toBeVisible();
  const saved = (await plans(page))[0];
  expect(saved?.goal).toBe(aiDraft.goal);
  expect(saved?.steps[0]?.title).toBe("Explain one paragraph in my own words");
  expect(calls).toBe(1);
  await page.getByRole("button", { name: "Edit plan", exact: true }).click();
  await expect(page.locator('input[name="draftMethod"]')).toHaveCount(0);
  await expect(page.getByLabel("Start from", { exact: true })).toBeDisabled();
  await expect(page.locator(".ai-assistance")).toHaveCount(0);
});

test("UR02/08: closed optional native/server errors reveal their field and retain a French narrow draft", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await createAccount(page);
  await page.setViewportSize({ width: 320, height: 900 });
  await page.getByLabel("Language", { exact: true }).selectOption("fr");
  await page.getByRole("button", { name: "Créer un parcours", exact: true }).click();
  await page.getByLabel("Objectif d’apprentissage", { exact: true }).fill("Étudier mes notes");
  await page
    .getByLabel("Vos sujets ou sections (facultatif)", { exact: true })
    .fill("Lire une courte section");
  await selectAvailability(page, ["2026-10-18"], "fr");
  const extras = page.locator(".planning-extras");
  const summary = extras.locator(":scope > summary");
  await summary.press("Enter");
  const target = page.locator('input[name="targetDate"]');
  await target.fill("1999-12-31");
  await summary.press("Enter");
  await page.getByRole("button", { name: "Vérifier les étapes proposées", exact: true }).click();
  await page.getByRole("button", { name: "Confirmer et enregistrer", exact: true }).click();
  await expect(extras).toHaveAttribute("open", "");
  await expect(target).toBeFocused();
  await expect(target).toHaveValue("1999-12-31");
  expect(await plans(page)).toHaveLength(0);
  await target.fill("");
  await summary.press("Enter");
  await page.route("**/api/plans", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    await route.fulfill({
      status: 400,
      json: { error: { code: "invalid_input", field: "references", reason: "invalid_link" } },
    });
  });
  await page.getByRole("button", { name: "Confirmer et enregistrer", exact: true }).click();
  const references = page.locator('textarea[name="references"]');
  await expect(extras).toHaveAttribute("open", "");
  await expect(references).toBeFocused();
  await expect(references).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByLabel("Action", { exact: true })).toHaveValue("Lire une courte section");
  await expect(page.getByLabel("Objectif d’apprentissage", { exact: true })).toHaveValue(
    "Étudier mes notes",
  );
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await expectNoHorizontalOverflow(page);
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await expectNoHorizontalOverflow(page);
  for (const control of [
    summary,
    page.getByRole("button", { name: "Confirmer et enregistrer", exact: true }),
  ]) {
    const box = await control.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  expect(await plans(page)).toHaveLength(0);
  await page.unroute("**/api/plans");
  await page.getByRole("button", { name: "Confirmer et enregistrer", exact: true }).click();
  await expect(page.getByText("0 étapes terminées sur 1", { exact: true })).toBeVisible();
  const saved = (await plans(page))[0];
  const detail = await page.request.get(`/api/plans/${saved?.id}`);
  expect(((await detail.json()) as PlanDetail).plan.steps[0]?.title).toBe(
    "Lire une courte section",
  );
});
