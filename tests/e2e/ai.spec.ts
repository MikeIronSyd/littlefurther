import { randomUUID } from "node:crypto";
import path from "node:path";
import { expect, type Page, test } from "@playwright/test";
import Database from "better-sqlite3";
import { AiSourceStore } from "../../src/server/ai-sources.js";
import type { AiAssistInput, AiAssistResponse } from "../../src/shared/ai-contracts.js";
import type { LearningPlan, LearningSource, PlanDetail } from "../../src/shared/contracts.js";
import {
  createAccount,
  expectNoHorizontalOverflow,
  expectOnlyUiStorage,
  saveManualPlan,
} from "./helpers.js";

const guidance: AiAssistResponse = {
  kind: "guidance",
  title: "A manageable next action",
  summary: "Your earlier effort remains recorded.",
  nextAction: "Read one paragraph and write one sentence.",
  microActions: ["Open your notes", "Read one paragraph"],
};
async function captureAiReview(page: Page, name: string): Promise<void> {
  if (process.env.CAPSTONE_AI_CAPTURE !== "1") return;
  await page.screenshot({
    path: path.resolve(`docs/specs/capstone/designs/ai-assistance/app-${name}.png`),
    fullPage: true,
  });
}
async function aiReady(page: Page): Promise<void> {
  await page.route("**/api/ai/status", (route) =>
    route.fulfill({ json: { available: true, reason: null, model: "synthetic-test-model" } }),
  );
}
async function planDetail(page: Page): Promise<PlanDetail> {
  const plans = (await (await page.request.get("/api/plans")).json()) as { plans: LearningPlan[] };
  return (await (await page.request.get(`/api/plans/${plans.plans[0]?.id}`)).json()) as PlanDetail;
}
function source(title: string, slug: string): LearningSource {
  return {
    id: randomUUID(),
    kind: "web_search",
    title,
    url: `https://developer.mozilla.org/en-US/docs/Learn_web_development/${slug}`,
    publisher: "developer.mozilla.org",
    languageHint: "en",
    observedAt: "2026-10-13T09:00:00.000Z",
    evidence: ["listed", "cited"],
  };
}

test("AI02/07/10: AI plan remains a source-associated editable draft, with bilingual mobile controls", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await aiReady(page);
  await createAccount(page);
  const first = source("HTML first steps", "Core/Structuring_content");
  const second = source("CSS first steps", "Core/Styling_basics");
  const result: AiAssistResponse = {
    kind: "plan",
    goal: "Build a small web page",
    outcome: "A reviewed first page",
    prerequisites: "A text editor",
    steps: [
      { title: "Write a heading", estimatedMinutes: 5, sourceIds: [first.id] },
      { title: "Style one paragraph", estimatedMinutes: 10, sourceIds: [second.id] },
    ],
    sources: [first, second],
  };
  let sent: AiAssistInput | null = null;
  await page.route("**/api/ai/assist", async (route) => {
    sent = route.request().postDataJSON() as AiAssistInput;
    await route.fulfill({ json: result });
  });
  await page.getByRole("button", { name: "Create a learning plan", exact: true }).click();
  await page.getByLabel("Learning goal", { exact: true }).fill("My first web page");
  await page.getByLabel("Dates you are available", { exact: true }).fill("2026-10-13, 2026-10-14");
  await page
    .getByLabel("What you already know (optional)", { exact: true })
    .fill("I know how to use a browser");
  await page
    .getByLabel("Paste learning material (optional)", { exact: true })
    .fill("A heading labels a section.");
  await expect(
    page.getByLabel("Search the web for credible learning resources", { exact: true }),
  ).toBeChecked();
  await page.getByRole("button", { name: "Draft my plan with AI", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Use this draft for review", exact: true }),
  ).toBeVisible();
  expect(sent).toMatchObject({
    action: "plan_draft",
    goal: "My first web page",
    search: true,
    startingPoint: "I know how to use a browser",
    material: "A heading labels a section.",
    locale: "en",
  });
  await expect(page.getByLabel("Learning goal", { exact: true })).toHaveValue("My first web page");
  expect(
    ((await (await page.request.get("/api/plans")).json()) as { plans: LearningPlan[] }).plans,
  ).toHaveLength(0);
  await captureAiReview(page, "plan-desktop-light-en");
  await expect(
    page
      .locator(".ai-plan-preview > li")
      .first()
      .getByRole("link", { name: first.title ?? "" }),
  ).toHaveAttribute("href", first.url);
  await page.getByRole("button", { name: "Use this draft for review", exact: true }).click();
  await expect(page.getByLabel("Action", { exact: true }).first()).toHaveValue("Write a heading");
  await page.getByLabel("Action", { exact: true }).first().fill("Write a descriptive heading");
  await page.getByRole("button", { name: "Move step down", exact: true }).first().click();
  await expect(
    page
      .locator(".draft-step")
      .last()
      .getByRole("link", { name: first.title ?? "" }),
  ).toHaveAttribute("href", first.url);
  await page.getByRole("button", { name: "Remove", exact: true }).first().click();
  await page
    .getByLabel("Reference links (optional)", { exact: true })
    .fill(`${first.url}\nnot-a-url\n${second.url}`);
  await page.getByRole("button", { name: `Remove source: ${second.title}`, exact: true }).click();
  await expect(page.getByLabel("Reference links (optional)", { exact: true })).toHaveValue(
    `${first.url}\nnot-a-url`,
  );
  await page.getByLabel("Reference links (optional)", { exact: true }).fill(first.url);
  await expect(
    page.locator(".draft-step").getByRole("link", { name: first.title ?? "" }),
  ).toHaveAttribute("href", first.url);
  let savedBody: { sourceIds: string[]; steps: { title: string; sourceIds: string[] }[] } | null =
    null;
  let releaseAi = (): void => {};
  let releaseSave = (): void => {};
  const aiGate = new Promise<void>((resolve) => {
    releaseAi = resolve;
  });
  const saveGate = new Promise<void>((resolve) => {
    releaseSave = resolve;
  });
  await page.unroute("**/api/ai/assist");
  await page.route("**/api/ai/assist", async (route) => {
    await aiGate;
    try {
      await route.fulfill({ json: result });
    } catch {}
  });
  await page.route("**/api/plans", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    savedBody = route.request().postDataJSON() as typeof savedBody;
    await saveGate;
    await route.fulfill({ status: 400, json: { error: { code: "source_unavailable" } } });
  });
  await page.getByRole("button", { name: "Draft my plan with AI", exact: true }).click();
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.locator(".editor-form")).toHaveAttribute("aria-busy", "true");
  releaseAi();
  await expect(
    page.getByRole("button", { name: "Draft my plan with AI", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Use this draft for review", exact: true }),
  ).toHaveCount(0);
  releaseSave();
  await expect(page.getByRole("alert")).toBeVisible();
  expect(savedBody).toMatchObject({
    sourceIds: [first.id],
    steps: [{ title: "Write a descriptive heading", sourceIds: [first.id] }],
  });
  await expect(page.getByLabel("Action", { exact: true })).toHaveValue(
    "Write a descriptive heading",
  );
  await page.setViewportSize({ width: 320, height: 720 });
  await expectNoHorizontalOverflow(page);
  await page.getByRole("button", { name: "Switch to dark mode", exact: true }).click();
  await page.getByLabel("Language", { exact: true }).selectOption("fr");
  await expect(page.getByLabel("Ce que vous savez déjà (facultatif)", { exact: true })).toHaveValue(
    "I know how to use a browser",
  );
  await expect(
    page.getByText("Présent dans la recherche · Cité dans la recherche", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: `Retirer la source: ${first.title}`, exact: true }),
  ).toBeVisible();
  await captureAiReview(page, "editor-mobile-dark-fr");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await expectNoHorizontalOverflow(page);
  const target = await page
    .getByRole("button", { name: "Préparer mon programme avec l’IA", exact: true })
    .boundingBox();
  expect(target?.width).toBeGreaterThanOrEqual(44);
  expect(target?.height).toBeGreaterThanOrEqual(44);
  await captureAiReview(page, "editor-mobile-dark-fr-enlarged");
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await expect(
    page.getByRole("button", { name: "Préparer mon programme avec l’IA", exact: true }),
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await captureAiReview(page, "editor-mobile-fr-forced-colours");
  await expectOnlyUiStorage(page);
  // Seed only this test server's isolated source drafts, with the production validator.
  // Browser AI is mocked; no test endpoint or provider request is introduced.
  const owner = (await (await page.request.get("/api/me")).json()) as { user: { id: string } };
  const database = new Database(path.resolve(".local/e2e-data/capstone.sqlite"));
  try {
    new AiSourceStore(database, () => new Date()).stage(owner.user.id, [first]);
  } finally {
    database.close();
  }
  await page.unroute("**/api/plans");
  await page.getByRole("button", { name: "Confirmer et enregistrer", exact: true }).click();
  await expect(page.getByText("0 étapes terminées sur 1", { exact: true })).toBeVisible();
  const saved = await planDetail(page);
  expect(saved.plan.sources).toEqual([first]);
  expect(saved.plan.steps[0]?.sourceIds).toEqual([first.id]);
  await page.reload();
  await expect(
    page.locator(".path-source-links").getByRole("link", { name: first.title ?? "" }),
  ).toHaveAttribute("href", first.url);
  expect((await planDetail(page)).plan.sources).toEqual([first]);
});

test("AI03/04/05: study, restart and progress help preserve explicit save and deterministic facts", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await aiReady(page);
  await createAccount(page);
  await saveManualPlan(page);
  const sent: AiAssistInput[] = [];
  await page.route("**/api/ai/assist", async (route) => {
    sent.push(route.request().postDataJSON() as AiAssistInput);
    await route.fulfill({ json: guidance });
  });
  const before = await planDetail(page);
  await page.getByRole("button", { name: "Start study session", exact: true }).click();
  await page.getByRole("button", { name: "Make this step smaller", exact: true }).click();
  await expect(
    page.locator(".ai-micro-actions").getByText("Read one paragraph", { exact: true }),
  ).toBeVisible();
  expect((await planDetail(page)).plan).toEqual(before.plan);
  await page
    .getByLabel("Private reflection (optional)", { exact: true })
    .fill("My original private thought");
  await expect(
    page.getByLabel("Include this reflection draft in study help", { exact: true }),
  ).not.toBeChecked();
  await page.getByRole("button", { name: "Help me study and reflect", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Use this suggestion in my reflection", exact: true }),
  ).toBeVisible();
  expect(sent.at(-1)).toMatchObject({ action: "study_reflection" });
  expect(sent.at(-1)).not.toHaveProperty("reflection");
  await expect(page.getByLabel("Private reflection (optional)", { exact: true })).toHaveValue(
    "My original private thought",
  );
  await page.getByLabel("Include this reflection draft in study help", { exact: true }).check();
  await page.getByRole("button", { name: "Help me study and reflect", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Use this suggestion in my reflection", exact: true }),
  ).toBeVisible();
  expect(sent.at(-1)).toMatchObject({ reflection: "My original private thought" });
  await captureAiReview(page, "study-desktop-light-en");
  await page
    .getByRole("button", { name: "Use this suggestion in my reflection", exact: true })
    .click();
  await expect(page.locator(".ai-original-reflection")).toContainText(
    "My original private thought",
  );
  expect((await planDetail(page)).activities).toHaveLength(0);
  await page.getByRole("button", { name: "Save study session", exact: true }).click();
  await expect(page.getByText("Your study session is saved.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Choose the next action", exact: true }).click();
  const saved = await planDetail(page);
  await page.getByRole("button", { name: "Review restart dates", exact: true }).click();
  await page.getByRole("button", { name: "Help me restart", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: guidance.kind === "guidance" ? guidance.title : "",
      exact: true,
    }),
  ).toBeVisible();
  expect(sent.at(-1)).toMatchObject({ action: "comeback_help", minutes: 5 });
  expect((await planDetail(page)).plan).toEqual(saved.plan);
  await captureAiReview(page, "comeback-desktop-light-en");
  await page.getByRole("button", { name: "Back to my learning", exact: true }).click();
  await page.getByRole("button", { name: "Summarize my progress", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: guidance.kind === "guidance" ? guidance.title : "",
      exact: true,
    }),
  ).toBeVisible();
  expect(sent.at(-1)).toMatchObject({ action: "progress_recap" });
  await expect(page.getByText("0 of 2 steps complete", { exact: true })).toBeVisible();
  expect((await planDetail(page)).progress).toEqual(saved.progress);
  await captureAiReview(page, "progress-desktop-light-en");
});

test("AI06: circle wording sends own draft only and invalidates an approved preview before sharing", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await aiReady(page);
  await createAccount(page);
  await page.getByRole("button", { name: "Open study circles", exact: true }).click();
  await page.getByLabel("Circle name", { exact: true }).fill("Synthetic AI circle");
  await page.getByRole("button", { name: "Create a circle", exact: true }).click();
  await page.getByRole("button", { name: "Write a shared copy", exact: true }).click();
  await page.getByLabel("Message", { exact: true }).fill("I hope to read today");
  await page.getByRole("button", { name: "Preview copy", exact: true }).click();
  await expect(page.getByRole("button", { name: "Share commitment", exact: true })).toBeVisible();
  let sent: unknown;
  await page.route("**/api/ai/assist", async (route) => {
    sent = route.request().postDataJSON();
    await route.fulfill({
      json: { kind: "circle", text: "I will read one paragraph when I have time." },
    });
  });
  await page.getByRole("button", { name: "Help me phrase this", exact: true }).click();
  await expect(page.getByRole("button", { name: "Use this wording", exact: true })).toBeVisible();
  await captureAiReview(page, "circle-desktop-light-en");
  expect(Object.keys(sent as object).sort()).toEqual([
    "action",
    "circleId",
    "draft",
    "kind",
    "locale",
  ]);
  await page.getByRole("button", { name: "Use this wording", exact: true }).click();
  await expect(page.getByRole("button", { name: "Share commitment", exact: true })).toBeHidden();
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue(
    "I will read one paragraph when I have time.",
  );
  const circles = (await (await page.request.get("/api/circles")).json()) as {
    circles: { id: string }[];
  };
  const id = circles.circles[0]?.id;
  expect(
    ((await (await page.request.get(`/api/circles/${id}`)).json()) as { items: unknown[] }).items,
  ).toHaveLength(0);
  await page.getByRole("button", { name: "Preview copy", exact: true }).click();
  await expect(page.locator(".circle-preview-copy .circle-message")).toHaveText(
    "I will read one paragraph when I have time.",
  );
  let releaseAi = (): void => {};
  let releaseShare = (): void => {};
  const aiGate = new Promise<void>((resolve) => {
    releaseAi = resolve;
  });
  const shareGate = new Promise<void>((resolve) => {
    releaseShare = resolve;
  });
  await page.unroute("**/api/ai/assist");
  await page.route("**/api/ai/assist", async (route) => {
    await aiGate;
    try {
      await route.fulfill({
        json: { kind: "circle", text: "A late replacement must not be shared." },
      });
    } catch {}
  });
  await page.route("**/api/circles/*/items", async (route) => {
    await shareGate;
    await route.continue();
  });
  await page.getByRole("button", { name: "Help me phrase this", exact: true }).click();
  await page.getByRole("button", { name: "Share commitment", exact: true }).click();
  await expect(page.locator(".circle-body")).toHaveAttribute("aria-busy", "true");
  releaseAi();
  await expect(
    page.getByRole("button", { name: "Help me phrase this", exact: true }),
  ).toBeDisabled();
  await expect(page.getByRole("button", { name: "Use this wording", exact: true })).toHaveCount(0);
  releaseShare();
  await expect(page.locator(".circle-item .circle-message")).toHaveText(
    "I will read one paragraph when I have time.",
  );
});

test("AI08/09/10: errors, cancellation, changed inputs and session expiry preserve manual work", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await aiReady(page);
  await createAccount(page);
  await page.getByRole("button", { name: "Create a learning plan", exact: true }).click();
  await page.getByLabel("Learning goal", { exact: true }).fill("Keep my manual input");
  await page.getByLabel("Dates you are available", { exact: true }).fill("2026-10-13");
  await page.getByLabel("Your topics or sections", { exact: true }).fill("Read one section");
  const run = page.getByRole("button", { name: "Draft my plan with AI", exact: true });
  for (const code of ["ai_quota", "ai_refused", "ai_invalid_output", "ai_timeout"]) {
    await page.route("**/api/ai/assist", (route) =>
      route.fulfill({ status: 503, json: { error: { code } } }),
    );
    await run.click();
    await expect(page.locator(".ai-assistance [role=alert]")).toBeVisible();
    await expect(page.getByLabel("Learning goal", { exact: true })).toHaveValue(
      "Keep my manual input",
    );
    await expect(
      page.getByRole("button", { name: "Review draft steps", exact: true }),
    ).toBeEnabled();
    await page.unroute("**/api/ai/assist");
  }
  let release = (): void => {};
  let gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/ai/assist", async (route) => {
    await gate;
    try {
      await route.fulfill({
        json: { kind: "insufficient", reason: "Late response must not appear" },
      });
    } catch {}
  });
  await run.click();
  await expect(page.getByRole("button", { name: "Cancel AI request", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Cancel AI request", exact: true }).click();
  await expect(run).toBeFocused();
  release();
  await expect(page.getByText("Late response must not appear", { exact: true })).toHaveCount(0);
  gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await run.click();
  await page.getByLabel("Learning goal", { exact: true }).fill("A revised goal");
  release();
  await expect(
    page.getByText("The input changed. Request a new suggestion when ready.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Late response must not appear", { exact: true })).toHaveCount(0);
  await page.unroute("**/api/ai/assist");
  await page.route("**/api/ai/assist", (route) =>
    route.fulfill({ status: 401, json: { error: { code: "unauthenticated" } } }),
  );
  await run.click();
  await expect(page.getByRole("heading", { name: "Sign in", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Collapse sidebar", exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Email address", { exact: true })).toBeVisible();
});
