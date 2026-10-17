import { randomUUID } from "node:crypto";
import { expect, type Page, test } from "@playwright/test";
import type { LearningPlan, PlanDetail } from "../../src/shared/contracts.js";
import {
  capture,
  createAccount,
  expectNoHorizontalOverflow,
  respectAuthenticationRateLimit,
  saveManualPlan,
} from "./helpers.js";

test.afterEach(async ({ page: _page }, info) => {
  if (info.status !== info.expectedStatus) await respectAuthenticationRateLimit();
});

async function savedDetail(page: Page): Promise<PlanDetail> {
  const result = await page.request.get("/api/plans");
  const plan = ((await result.json()) as { plans: LearningPlan[] }).plans[0];
  if (!plan) throw new Error("Expected an isolated synthetic plan");
  return (await (await page.request.get(`/api/plans/${plan.id}`)).json()) as PlanDetail;
}
async function locale(page: Page, value: "en" | "fr"): Promise<void> {
  const saved = page.waitForResponse(
    (response) => response.url().endsWith("/api/me") && response.request().method() === "PUT",
  );
  await page.getByLabel(/^(Language|Langue)$/).selectOption(value);
  expect((await saved).ok()).toBe(true);
}
async function mutate(page: Page, path: string, data: unknown, method = "POST"): Promise<void> {
  const response = await page.request.fetch(path, {
    method,
    headers: { origin: "http://127.0.0.1:4318" },
    data,
  });
  expect(response.ok(), `${method} ${path}: ${response.status()}`).toBe(true);
}

for (const [theme, language] of [
  ["light", "en"],
  ["dark", "fr"],
] as const) {
  test(`UL04–07: compact learning, retained record types and full consent targets in ${theme}/${language}`, async ({
    page,
  }) => {
    test.setTimeout(90_000);
    await page.emulateMedia({ colorScheme: theme });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await createAccount(page);
    await saveManualPlan(page);
    if (language === "fr") await locale(page, "fr");
    const intro = page.locator(".learning-introduction h1");
    const step = page.locator(".next-band h2");
    expect(await intro.evaluate((node) => Number.parseFloat(getComputedStyle(node).fontSize))).toBe(
      28,
    );
    expect(
      await step.evaluate((node) => Number.parseFloat(getComputedStyle(node).fontSize)),
    ).toBeGreaterThan(28);
    await capture(page, `usability-learning-desktop-${theme}`);
    await page.setViewportSize({ width: 320, height: 800 });
    await expectNoHorizontalOverflow(page);
    expect(await intro.evaluate((node) => Number.parseFloat(getComputedStyle(node).fontSize))).toBe(
      24,
    );
    const action = page.locator(".study-primary");
    const actionY = await action.evaluate(
      (node) => node.getBoundingClientRect().top + window.scrollY,
    );
    // This short authored fixture retains all preamble controls, with the task in the first viewport.
    expect(actionY).toBeLessThan(600);
    await capture(page, `usability-learning-mobile-${theme}`);
    await page
      .getByRole("button", {
        name: language === "en" ? "Edit plan" : "Modifier le parcours",
        exact: true,
      })
      .click();
    await page
      .locator(".draft-step .row-actions button")
      .filter({ hasText: language === "en" ? /^Remove$/ : /^Retirer$/ })
      .first()
      .click();
    const consent = page.locator(".checkbox-field");
    await expect(consent).toBeVisible();
    expect((await consent.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    const checkbox = consent.locator('input[type="checkbox"]');
    const glyph = await checkbox.boundingBox();
    expect(glyph?.width).toBe(22);
    expect(glyph?.height).toBe(22);
    await consent.locator("span").click();
    await expect(checkbox).toBeChecked();
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    await page.emulateMedia({ forcedColors: "active" });
    await expectNoHorizontalOverflow(page);
    expect((await consent.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    await checkbox.focus();
    await page.keyboard.press("Space");
    await expect(checkbox).not.toBeChecked();
    await capture(page, `usability-consent-mobile-enlarged-forced-${theme}`);
    await page.emulateMedia({ forcedColors: "none" });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "";
    });
    page.once("dialog", (dialog) => dialog.accept());
    await page
      .locator(".page-heading")
      .getByRole("button", { name: language === "en" ? "Cancel" : "Annuler", exact: true })
      .click();
    await expect(page.locator(".study-primary")).toBeVisible();
    let detail = await savedDetail(page);
    await mutate(page, `/api/plans/${detail.plan.id}/activities`, {
      requestId: randomUUID(),
      revision: detail.plan.revision,
      stepId: detail.plan.steps[0]?.id,
      minutes: 7,
      reflection: "Private synthetic retained note",
    });
    detail = await savedDetail(page);
    await mutate(page, `/api/plans/${detail.plan.id}/completions`, {
      requestId: randomUUID(),
      revision: detail.plan.revision,
      stepId: detail.plan.steps[0]?.id,
    });
    detail = await savedDetail(page);
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
        steps: [
          ...detail.plan.steps.map(({ id, title, scheduledDate, estimatedMinutes }) => ({
            id,
            title,
            scheduledDate,
            estimatedMinutes,
          })),
          { title: "A third small action", scheduledDate: "2026-10-10", estimatedMinutes: 10 },
        ],
      },
      "PUT",
    );
    const before = await savedDetail(page);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page
      .getByRole("link", { name: language === "en" ? "Activity" : "Activité", exact: true })
      .click();
    await expect(page.locator(".activity-history > .activity-records")).toHaveCount(3);
    await expect(
      page.locator(".removed-steps").getByRole("heading", {
        name: language === "en" ? "Removed steps" : "Étapes retirées",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: language === "en" ? "Completion history" : "Historique des validations",
        exact: true,
        level: 3,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: language === "en" ? "Scope changes" : "Modifications du parcours",
        exact: true,
        level: 3,
      }),
    ).toBeVisible();
    await expect(page.locator(".history-entry h4")).toHaveCount(2);
    await expect(page.locator(".reflection-label")).toHaveText(
      language === "en" ? "Private reflection" : "Note privée",
    );
    const width = await page.locator(".activity-layout").evaluate((node) => ({
      width: node.getBoundingClientRect().width,
      parent: node.parentElement?.getBoundingClientRect().width ?? 0,
    }));
    expect(width.width).toBeLessThan(width.parent);
    await capture(page, `usability-activity-desktop-${theme}`);
    await page.setViewportSize({ width: 320, height: 800 });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    await expectNoHorizontalOverflow(page);
    await capture(page, `usability-activity-mobile-enlarged-${theme}`);
    expect(await savedDetail(page)).toEqual(before);
  });

  test(`UL01/02/07: study errors retain input, specific hints and keyboard recovery in ${language}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: theme });
    await createAccount(page);
    await saveManualPlan(page);
    if (language === "fr") await locale(page, "fr");
    await page.locator(".study-primary").click();
    const minutes = page.locator('input[name="studiedMinutes"]');
    const reflection = page.locator('textarea[name="reflection"]');
    await expect(minutes).toHaveValue("10");
    await expect(page.locator(".study-summary .hint")).toContainText("10");
    const hints = (await minutes.getAttribute("aria-describedby")) ?? "";
    expect(hints).toContain("-hint");
    await reflection.fill("Keep this private draft");
    let field = "minutes";
    await page.route("**/activities", (route) =>
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: { code: "invalid_input", field } }),
      }),
    );
    const save = page.getByRole("button", {
      name: language === "en" ? "Save study session" : "Enregistrer la séance",
      exact: true,
    });
    await save.focus();
    await page.keyboard.press("Enter");
    await expect(minutes).toBeFocused();
    await expect(minutes).toHaveAttribute("aria-invalid", "true");
    expect(await minutes.getAttribute("aria-describedby")).toContain(hints);
    await expect(reflection).toHaveValue("Keep this private draft");
    await expect(page.locator(".study-form")).not.toHaveAttribute("aria-busy");
    await minutes.fill("12");
    await expect(minutes).not.toHaveAttribute("aria-invalid");
    field = "reflection";
    await save.focus();
    await page.keyboard.press("Enter");
    await expect(reflection).toBeFocused();
    await expect(reflection).toHaveAttribute("aria-invalid", "true");
    await reflection.fill("Corrected private draft");
    await expect(reflection).not.toHaveAttribute("aria-invalid");
    await page.route("**/completions", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: '{"error":{"code":"UNEXPECTED"}}',
      }),
    );
    const complete = page.getByRole("button", {
      name: language === "en" ? "Mark this step complete" : "Marquer cette étape comme terminée",
      exact: true,
    });
    await complete.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".completion-section [role=alert]")).toBeFocused();
    await expect(complete).toBeEnabled();
    await expect(save).toBeEnabled();
    await expect(minutes).toHaveValue("12");
    await expect(reflection).toHaveValue("Corrected private draft");
    const detail = await savedDetail(page);
    expect(detail.activities).toHaveLength(0);
    expect(detail.completions).toHaveLength(0);
  });
}

test("UL02: a delayed study failure cannot steal focus or add errors after navigation", async ({
  page,
}) => {
  await createAccount(page);
  await saveManualPlan(page);
  await page.locator(".study-primary").click();
  await page.locator('textarea[name="reflection"]').fill("Discard this isolated draft");
  let release: () => void = () => {};
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  let started: () => void = () => {};
  const pending = new Promise<void>((resolve) => {
    started = resolve;
  });
  await page.route("**/activities", async (route) => {
    started();
    await held;
    await route.fulfill({
      status: 400,
      contentType: "application/json",
      body: '{"error":{"code":"invalid_input","field":"minutes"}}',
    });
  });
  await page.getByRole("button", { name: "Save study session", exact: true }).click();
  await pending;
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("link", { name: "Activity", exact: true }).click();
  const heading = page.getByRole("heading", { name: "Activity", exact: true });
  await expect(heading).toBeFocused();
  const response = page.waitForResponse((value) => value.url().endsWith("/activities"));
  release();
  await response;
  await expect(heading).toBeFocused();
  await expect(page.locator(".study-form")).toHaveCount(0);
  await expect(page.locator("main [role=alert]")).toHaveCount(0);
});
