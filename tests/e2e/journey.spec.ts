import { mkdir, writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import type { LearningPlan, PlanDetail } from "../../src/shared/contracts.js";
import {
  createAccount,
  expectNoHorizontalOverflow,
  expectOnlyUiStorage,
  openManualDraft,
  respectAuthenticationRateLimit,
  saveManualPlan,
} from "./helpers.js";

test("AC01/03/05/09/10: reviewed manual plan, study and explicit completion survive refresh", async ({
  page,
}) => {
  await createAccount(page);
  await openManualDraft(page);
  const draftPlans = await page.request.get("/api/plans");
  expect(draftPlans.ok()).toBe(true);
  expect(((await draftPlans.json()) as { plans: LearningPlan[] }).plans).toHaveLength(0);

  await page
    .getByLabel("Action", { exact: true })
    .first()
    .fill("Explain the first section in my own words");
  await page.getByLabel("Estimated minutes", { exact: true }).first().fill("12");
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.getByText("0 of 2 steps complete", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Explain the first section in my own words", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByText("Estimated 12 minutes", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Start study session", exact: true }).click();
  await page.getByLabel("Minutes you studied", { exact: true }).fill("5");
  await page.getByRole("button", { name: "Save study session", exact: true }).click();
  await expect(page.getByText("Your study session is saved.", { exact: true })).toBeVisible();
  const plansResponse = await page.request.get("/api/plans");
  const plan = ((await plansResponse.json()) as { plans: LearningPlan[] }).plans[0];
  expect(plan).toBeDefined();
  const detailResponse = await page.request.get(`/api/plans/${plan?.id}`);
  const afterStudy = (await detailResponse.json()) as PlanDetail;
  expect(afterStudy.progress.completed).toBe(0);
  expect(afterStudy.progress.studiedMinutes).toBe(5);
  expect(afterStudy.progress.studyDayCount).toBe(1);
  expect(afterStudy.activities[0]?.reflection).toBeNull();

  await page.getByRole("button", { name: "Mark this step complete", exact: true }).click();
  await expect(
    page.getByText("Step completed. Your earlier effort is still recorded.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Choose the next action", exact: true }).click();
  await expect(page.getByText("1 of 2 steps complete", { exact: true })).toBeVisible();
  await expect(page.getByText("Write a short explanation", { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText("1 of 2 steps complete", { exact: true })).toBeVisible();
  await expect(page.getByText("1 session · 5 minutes studied", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Completion is self-reported work, not a measure of mastery.", { exact: true }),
  ).toBeVisible();
  await expectOnlyUiStorage(page);
});

test("AC11e: fifty-step plans retain readable progress and reachable actions at 320px", async ({
  page,
}) => {
  await createAccount(page);
  await page.setViewportSize({ width: 320, height: 720 });
  const topics = Array.from(
    { length: 50 },
    (_, index) => `Topic ${index + 1} — read and summarize this section`,
  ).join("\n");
  await openManualDraft(page, "A longer learner-supplied course", topics);
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.getByText("0 of 50 steps complete", { exact: true })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  const lastAction = page.getByRole("button", {
    name: /Topic 50 — read and summarize this section/,
  });
  await lastAction.scrollIntoViewIfNeeded();
  await lastAction.click();
  await expect(
    page.getByRole("heading", { name: "Topic 50 — read and summarize this section", exact: true }),
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("AC01/10/11b: a failed save preserves the editable plan and never claims success", async ({
  page,
}) => {
  await createAccount(page);
  await openManualDraft(page, "Preserve my unsaved plan");
  await page.route("**/api/plans", async (route) => {
    if (route.request().method() === "POST") await route.abort("failed");
    else await route.continue();
  });
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("We could not reach the local server");
  await expect(page.getByLabel("Learning goal", { exact: true })).toHaveValue(
    "Preserve my unsaved plan",
  );
  await expect(page.getByLabel("Action", { exact: true }).first()).toHaveValue(
    "Read the first section",
  );
  expect(
    ((await (await page.request.get("/api/plans")).json()) as { plans: LearningPlan[] }).plans,
  ).toHaveLength(0);
  await expect(
    page.getByText("Your plan is saved. Choose your next step when you are ready.", {
      exact: true,
    }),
  ).toHaveCount(0);
  await page.unroute("**/api/plans");
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.getByText("0 of 2 steps complete", { exact: true })).toBeVisible();
});

test("AC09: supplied learning text is rendered literally and unsafe reference links cannot be saved", async ({
  page,
}) => {
  await createAccount(page);
  await page.getByRole("button", { name: "Create a learning plan", exact: true }).click();
  await page.getByLabel("Learning goal", { exact: true }).fill("Test plain text");
  await page
    .getByLabel("Your topics or sections", { exact: true })
    .fill('<img src=x onerror="document.body.dataset.injected=1">');
  await page.getByLabel("Dates you are available", { exact: true }).fill("2026-10-08");
  await page.getByLabel("Reference links (optional)", { exact: true }).fill("javascript:alert(1)");
  await page.getByRole("button", { name: "Review draft steps", exact: true }).click();
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  expect(
    ((await (await page.request.get("/api/plans")).json()) as { plans: LearningPlan[] }).plans,
  ).toHaveLength(0);
  await page
    .getByLabel("Reference links (optional)", { exact: true })
    .fill("https://example.test/reference");
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(
    page
      .getByText('<img src=x onerror="document.body.dataset.injected=1">', { exact: true })
      .first(),
  ).toBeVisible();
  expect(await page.locator("body").getAttribute("data-injected")).toBeNull();
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
});

test("AC09: sign out removes access to the saved private journey", async ({ page }) => {
  const account = await createAccount(page);
  await saveManualPlan(page);
  const accountDisclosure = page.getByLabel("Account", { exact: true });
  await accountDisclosure.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Keep learning, even when life interrupts.", exact: true }),
  ).toBeVisible();
  expect((await page.request.get("/api/plans")).status()).toBe(401);
  await page.getByLabel("Email address", { exact: true }).fill(account.email);
  await page.getByLabel("Password", { exact: true }).fill(account.password);
  await respectAuthenticationRateLimit();
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByText("0 of 2 steps complete", { exact: true })).toBeVisible();
});

test("AC01/05: removing a completed step changes active scope while retaining history", async ({
  page,
}) => {
  await createAccount(page);
  await saveManualPlan(page);
  await page.getByRole("button", { name: "Start study session", exact: true }).click();
  await page.getByLabel("Minutes you studied", { exact: true }).fill("5");
  await page.getByRole("button", { name: "Save study session", exact: true }).click();
  await expect(page.getByText("Your study session is saved.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Mark this step complete", exact: true }).click();
  await expect(
    page.getByText("Step completed. Your earlier effort is still recorded.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Choose the next action", exact: true }).click();
  await page.getByRole("button", { name: "Edit plan", exact: true }).click();
  await expect(page.getByLabel("Action", { exact: true }).first()).toHaveAttribute("readonly", "");
  await page
    .getByRole("group", { name: "Step 1 of 2", exact: true })
    .getByRole("button", { name: "Remove", exact: true })
    .click();
  await page.getByRole("checkbox", { name: /I understand that removing 1 step changes/ }).check();
  await page.getByRole("button", { name: "Save revised plan", exact: true }).click();
  await expect(page.getByText("0 of 1 step complete", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("0 of 1 step complete", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Activity", exact: true }).click();
  await expect(page.getByText("1 completion recorded in history", { exact: true })).toBeVisible();
  await expect(page.getByText("1 session · 5 minutes studied", { exact: true })).toBeVisible();
});

test("AC03/10: completing a step does not silently discard an unsaved private reflection", async ({
  page,
}) => {
  await createAccount(page);
  await saveManualPlan(page);
  await page.getByRole("button", { name: "Start study session", exact: true }).click();
  await page
    .getByLabel("Private reflection (optional)", { exact: true })
    .fill("An unsaved private note");
  await page.getByRole("button", { name: "Mark this step complete", exact: true }).click();
  await expect(
    page.getByText("Step completed. Your earlier effort is still recorded.", { exact: true }),
  ).toBeVisible();
  let warned = false;
  page.once("dialog", async (dialog) => {
    warned = dialog.type() === "confirm";
    await dialog.dismiss();
  });
  await page.getByRole("button", { name: "Choose the next action", exact: true }).click();
  expect(warned).toBe(true);
  await expect(page.getByLabel("Private reflection (optional)", { exact: true })).toHaveValue(
    "An unsaved private note",
  );
  await page.getByRole("button", { name: "Save study session", exact: true }).click();
  await expect(page.getByText("Your study session is saved.", { exact: true })).toBeVisible();
});

test("AC02: supported template keeps sources, prerequisites and an editable review before saving", async ({
  page,
}) => {
  await createAccount(page);
  await page.getByRole("button", { name: "Create a learning plan", exact: true }).click();
  await page
    .getByLabel("Start from", { exact: true })
    .selectOption({ label: "Build a simple web page" });
  await expect(page.getByRole("heading", { name: "Before you start", exact: true })).toBeVisible();
  await expect(page.getByText(/Basic familiarity with your computer/)).toBeVisible();
  await expect(
    page.getByRole("link", { name: "MDN — HTML: Creating the content", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Creating_the_content",
  );
  await page.getByLabel("Dates you are available", { exact: true }).fill("2026-10-08, 2026-10-10");
  await page.getByRole("button", { name: "Review draft steps", exact: true }).click();
  await expect(page.getByLabel("Action", { exact: true })).toHaveCount(8);
  await page
    .getByLabel("Action", { exact: true })
    .first()
    .fill("Choose a page purpose I care about");
  expect(
    ((await (await page.request.get("/api/plans")).json()) as { plans: LearningPlan[] }).plans,
  ).toHaveLength(0);
  await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
  await expect(page.getByText("0 of 8 steps complete", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Choose a page purpose I care about", { exact: true }).first(),
  ).toBeVisible();
});

test("AC10: core journey works with non-loopback browser requests blocked and local server running", async ({
  page,
}) => {
  let loopbackRequests = 0;
  let blockedRequests = 0;
  await page.route("**/*", async (route) => {
    const hostname = new URL(route.request().url()).hostname;
    if (hostname === "127.0.0.1" || hostname === "localhost") {
      loopbackRequests++;
      await route.continue();
    } else {
      blockedRequests++;
      await route.abort("internetdisconnected");
    }
  });
  await createAccount(page);
  await saveManualPlan(page);
  await page.reload();
  await expect(page.getByText("0 of 2 steps complete", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Start study session", exact: true }).click();
  await page.getByLabel("Minutes you studied", { exact: true }).fill("5");
  await page.getByRole("button", { name: "Save study session", exact: true }).click();
  await expect(page.getByText("Your study session is saved.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Choose the next action", exact: true }).click();
  await page.reload();
  await expect(page.getByText("1 session · 5 minutes studied", { exact: true })).toBeVisible();
  await expect(page.getByText("0 of 2 steps complete", { exact: true })).toBeVisible();
  expect(loopbackRequests).toBeGreaterThan(0);
  expect(
    blockedRequests,
    "The local journey must not request external runtime assets or services",
  ).toBe(0);
  await mkdir(".local/e2e-captures", { recursive: true });
  await writeFile(
    ".local/e2e-captures/network-boundary.json",
    JSON.stringify(
      {
        condition:
          "Playwright intercepted all browser requests and allowed loopback only; local server stayed running. Physical internet was not disconnected.",
        loopbackRequests,
        nonLoopbackAttemptsBlocked: blockedRequests,
        result: "account, profile, plan, reload, study save and reload completed",
      },
      null,
      2,
    ),
  );
});
