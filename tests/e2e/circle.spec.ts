import { randomUUID } from "node:crypto";
import { expect, type Page, test } from "@playwright/test";
import type {
  CircleDetail,
  CircleInviteCreated,
  PlanDetail,
  ShareCircleItemInput,
} from "../../src/shared/contracts.js";
import {
  capture,
  createAccount,
  expectNoHorizontalOverflow,
  expectOnlyUiStorage,
  saveManualPlan,
} from "./helpers.js";

const origin = "http://127.0.0.1:4318";
const circleName = "Small steps together";
const commitment = "I will read one section and write a short explanation.";

async function mutate<T>(page: Page, path: string, data: unknown, method = "POST"): Promise<T> {
  const response = await page.request.fetch(path, { method, headers: { origin }, data });
  expect(response.ok(), `${method} ${path}: ${response.status()}`).toBe(true);
  return (await response.json()) as T;
}

async function detail(page: Page, id: string): Promise<CircleDetail> {
  const response = await page.request.get(`/api/circles/${id}`);
  expect(response.ok()).toBe(true);
  return (await response.json()) as CircleDetail;
}

async function openCircles(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Open study circles", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Study together", exact: true })).toBeVisible();
}

async function createCircle(page: Page): Promise<string> {
  await openCircles(page);
  await page.getByLabel("Circle name", { exact: true }).fill(circleName);
  const result = page.waitForResponse(
    (response) => response.url().endsWith("/api/circles") && response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Create a circle", exact: true }).click();
  const created = (await (await result).json()) as { circleId: string };
  await expect(page.getByRole("heading", { name: circleName, exact: true }).first()).toBeVisible();
  return created.circleId;
}

async function compose(page: Page, text = commitment, kind = "commitment"): Promise<void> {
  await page.getByRole("button", { name: "Write a shared copy", exact: true }).click();
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue("");
  await page.getByLabel("Copy type", { exact: true }).selectOption(kind);
  await page.getByLabel("Message", { exact: true }).fill(text);
  await page.getByRole("button", { name: "Preview copy", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "What your circle will see", exact: true }),
  ).toBeFocused();
  await expect(page.locator(".circle-preview-copy .circle-message")).toHaveText(text.trim());
}

async function joinPeer(owner: Page, peer: Page, id: string): Promise<void> {
  await createAccount(peer, "Circle peer");
  const invitation = await mutate<CircleInviteCreated>(owner, `/api/circles/${id}/invites`, {
    requestId: randomUUID(),
  });
  expect(invitation.token).toBeTruthy();
  await openCircles(peer);
  await peer.getByLabel("Invitation code", { exact: true }).fill(invitation.token ?? "");
  await peer.getByRole("button", { name: "Join a circle", exact: true }).click();
  await expect(peer.getByRole("heading", { name: circleName, exact: true }).first()).toBeVisible();
}

test("SC02/03/06: two real accounts deliberately share copies and encouragement while private work stays private", async ({
  page,
  browser,
}) => {
  test.setTimeout(90000);
  await createAccount(page, "Circle owner");
  await expect(page.getByRole("button", { name: "Open study circles", exact: true })).toBeVisible();
  await saveManualPlan(page);
  const plans = (await (await page.request.get("/api/plans")).json()) as {
    plans: { id: string }[];
  };
  const planId = plans.plans[0]?.id;
  expect(planId).toBeTruthy();
  const privatePlan = (await (await page.request.get(`/api/plans/${planId}`)).json()) as PlanDetail;
  await mutate(page, `/api/plans/${planId}/activities`, {
    requestId: randomUUID(),
    stepId: privatePlan.plan.steps[0]?.id,
    minutes: 5,
    reflection: "This private reflection is never shared.",
  });
  const id = await createCircle(page);
  await page.getByText("Invitations", { exact: true }).click();
  await page.getByRole("button", { name: "Create invitation", exact: true }).click();
  const code = page.getByLabel("New invitation code", { exact: true });
  await expect(code).toHaveValue(/^[A-Za-z0-9_-]{43}$/);
  const token = await code.inputValue();
  expect(page.url()).not.toContain(token);
  await expectOnlyUiStorage(page);
  expect(await page.evaluate(() => Object.keys(sessionStorage))).toEqual([]);
  const peerContext = await browser.newContext();
  const peer = await peerContext.newPage();
  try {
    await createAccount(peer, "Circle peer");
    await openCircles(peer);
    await expect(peer.getByText(/Joining makes your display name visible/)).toBeVisible();
    await peer.getByLabel("Invitation code", { exact: true }).fill(token);
    await peer.getByRole("button", { name: "Join a circle", exact: true }).click();
    await expect(
      peer.getByRole("heading", { name: circleName, exact: true }).first(),
    ).toBeVisible();
    await page.getByRole("button", { name: "Refresh circle information", exact: true }).click();
    await compose(page, `  ${commitment}  `);
    expect((await detail(peer, id)).items).toEqual([]);
    await expect(
      page.getByText("Your plan, resources, private reflections and other activity stay private.", {
        exact: true,
      }),
    ).toBeVisible();
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    expect((await detail(peer, id)).items).toEqual([]);
    await compose(page);
    await page.getByRole("button", { name: "Share commitment", exact: true }).click();
    await expect(page.locator(".circle-item .circle-message")).toHaveText(commitment);
    await peer.getByRole("button", { name: "Refresh circle information", exact: true }).click();
    await peer
      .getByLabel("Preset encouragement", { exact: true })
      .selectOption("small_steps_count");
    await peer.getByRole("button", { name: "Send encouragement", exact: true }).click();
    await expect(peer.locator(".circle-encouragements")).toContainText("Circle peer");
    const sharedBefore = await detail(peer, id);
    expect(sharedBefore.items).toHaveLength(1);
    expect(sharedBefore.items[0]?.encouragements[0]?.preset).toBe("small_steps_count");
    const publicJson = JSON.stringify(sharedBefore);
    expect(publicJson).not.toContain("This private reflection is never shared.");
    expect(publicJson).not.toContain(privatePlan.plan.goal);
    expect(publicJson).not.toContain(planId ?? "missing-plan");
    const savedPrivate = (await (
      await page.request.get(`/api/plans/${planId}`)
    ).json()) as PlanDetail;
    await mutate(
      page,
      `/api/plans/${planId}`,
      {
        requestId: randomUUID(),
        revision: savedPrivate.plan.revision,
        goal: "Changed private goal",
        availabilityDates: savedPrivate.plan.availabilityDates,
        targetDate: savedPrivate.plan.targetDate,
        references: savedPrivate.plan.references,
        steps: savedPrivate.plan.steps.map(
          ({ id: stepId, title, scheduledDate, estimatedMinutes }) => ({
            id: stepId,
            title,
            scheduledDate,
            estimatedMinutes,
          }),
        ),
      },
      "PUT",
    );
    expect((await detail(peer, id)).items).toEqual(sharedBefore.items);
    await compose(peer, "I studied for five minutes today.", "check_in");
    await peer.getByRole("button", { name: "Share check-in", exact: true }).click();
    await expect(peer.locator(".circle-item")).toHaveCount(2);
    await peer.reload();
    await openCircles(peer);
    await peer.getByRole("button", { name: "Open circle", exact: true }).click();
    await expect(peer.locator(".circle-item")).toHaveCount(2);
    await expectOnlyUiStorage(peer);
    await page.getByRole("button", { name: "Refresh circle information", exact: true }).click();
    await page.getByRole("button", { name: "Delete my shared copy", exact: true }).click();
    expect((await detail(peer, id)).items).toHaveLength(2);
    await page.getByRole("button", { name: "Confirm copy deletion", exact: true }).click();
    await expect(page.locator(".circle-item")).toHaveCount(1);
    const remaining = await detail(peer, id);
    expect(remaining.items[0]?.text).toBe("I studied for five minutes today.");
    expect(remaining.items[0]?.encouragements).toEqual([]);
  } finally {
    await peerContext.close();
  }
});

test("SC04/05: owner removal clears denied peer content and owner closure preserves private learning", async ({
  page,
  browser,
}) => {
  test.setTimeout(90000);
  await createAccount(page, "Circle owner");
  await saveManualPlan(page);
  const before = await (await page.request.get("/api/plans")).json();
  const id = await createCircle(page);
  const context = await browser.newContext();
  const peer = await context.newPage();
  try {
    await joinPeer(page, peer, id);
    await compose(peer, "Shared only while I belong.", "check_in");
    await peer.getByRole("button", { name: "Share check-in", exact: true }).click();
    await expect(peer.locator(".circle-item .circle-message")).toHaveText(
      "Shared only while I belong.",
    );
    await page.getByRole("button", { name: "Refresh circle information", exact: true }).click();
    await page.getByText("Members and circle settings", { exact: true }).click();
    await page.getByRole("button", { name: "Remove member", exact: true }).click();
    expect((await detail(peer, id)).circle.memberCount).toBe(2);
    await page.getByRole("button", { name: "Confirm member removal", exact: true }).click();
    await expect(page.locator(".circle-item")).toHaveCount(0);
    await peer.getByRole("button", { name: "Refresh circle information", exact: true }).click();
    await expect(peer.getByRole("alert")).toContainText(
      "previously displayed content has been cleared",
    );
    await expect(peer.getByText("Shared only while I belong.", { exact: true })).toHaveCount(0);
    expect((await peer.request.get(`/api/circles/${id}`)).status()).toBe(404);
    await page.getByText("Members and circle settings", { exact: true }).click();
    await page.getByRole("button", { name: "Close circle", exact: true }).click();
    expect((await detail(page, id)).circle.memberCount).toBe(1);
    await page.getByRole("button", { name: "Confirm circle closure", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Study together", exact: true })).toBeVisible();
    expect(await (await page.request.get("/api/circles")).json()).toEqual({ circles: [] });
    expect(await (await page.request.get("/api/plans")).json()).toEqual(before);
  } finally {
    await context.close();
  }
});

test("SC02/05: lost invitation response returns no raw code on retry and can be revoked explicitly", async ({
  page,
}) => {
  await createAccount(page);
  const id = await createCircle(page);
  await page.getByText("Invitations", { exact: true }).click();
  const endpoint = `**/api/circles/${id}/invites`;
  const requests: unknown[] = [];
  await page.route(endpoint, async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }
    requests.push(route.request().postDataJSON());
    if (requests.length === 1) {
      expect((await route.fetch()).ok()).toBe(true);
      await route.abort("failed");
    } else await route.continue();
  });
  await page.getByRole("button", { name: "Create invitation", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("may have been saved");
  await page.getByRole("button", { name: "Retry the same action", exact: true }).click();
  await expect(page.getByText(/its code is no longer available/)).toBeVisible();
  await expect(page.getByLabel("New invitation code", { exact: true })).toHaveCount(0);
  expect(requests).toHaveLength(2);
  expect(requests[1]).toEqual(requests[0]);
  await page.getByRole("button", { name: "Revoke invitation", exact: true }).click();
  const before = await (await page.request.get(`/api/circles/${id}/invites`)).json();
  expect(before.invites).toHaveLength(1);
  await page.getByRole("button", { name: "Confirm revocation", exact: true }).click();
  await expect(page.getByText("No active unused invitations.", { exact: true })).toBeVisible();
  await page.unroute(endpoint);
});

test("SC03/05: uncertain shared copy retries the same request and never duplicates the copy", async ({
  page,
}) => {
  await createAccount(page);
  const id = await createCircle(page);
  await compose(page);
  const endpoint = `**/api/circles/${id}/items`;
  const requests: ShareCircleItemInput[] = [];
  await page.route(endpoint, async (route) => {
    requests.push(route.request().postDataJSON() as ShareCircleItemInput);
    if (requests.length === 1) {
      expect((await route.fetch()).ok()).toBe(true);
      await route.abort("failed");
    } else await route.continue();
  });
  await page.getByRole("button", { name: "Share commitment", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("may have been saved");
  await expect(page.getByLabel("Message", { exact: true })).toBeDisabled();
  expect((await detail(page, id)).items).toHaveLength(1);
  await page.getByRole("button", { name: "Retry the same action", exact: true }).click();
  await expect(page.locator(".circle-item .circle-message")).toHaveText(commitment);
  expect(requests).toHaveLength(2);
  expect(requests[1]).toEqual(requests[0]);
  expect((await detail(page, id)).items).toHaveLength(1);
  await page.unroute(endpoint);
});

test("SC05: saved shared copy with failed readback refreshes without resubmitting", async ({
  page,
}) => {
  await createAccount(page);
  const id = await createCircle(page);
  await compose(page);
  let posts = 0;
  const endpoint = `**/api/circles/${id}/items`;
  const readEndpoint = `**/api/circles/${id}`;
  await page.route(endpoint, async (route) => {
    posts += 1;
    await route.continue();
  });
  await page.route(readEndpoint, async (route) => route.abort("failed"));
  await page.getByRole("button", { name: "Share commitment", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("was saved");
  expect((await detail(page, id)).items).toHaveLength(1);
  await page.unroute(readEndpoint);
  await page.getByRole("button", { name: "Refresh circle information", exact: true }).click();
  await expect(page.locator(".circle-item .circle-message")).toHaveText(commitment);
  expect(posts).toBe(1);
  await page.unroute(endpoint);
});

test("SC05: a missing copy on deletion retry reconciles without falsely reporting lost circle access", async ({
  page,
}) => {
  await createAccount(page);
  const id = await createCircle(page);
  await compose(page);
  await page.getByRole("button", { name: "Share commitment", exact: true }).click();
  await expect(page.locator(".circle-item")).toHaveCount(1);
  const item = (await detail(page, id)).items[0];
  expect(item).toBeDefined();
  const endpoint = `**/api/circles/${id}/items/${item?.id}/delete`;
  const requests: unknown[] = [];
  await page.route(endpoint, async (route) => {
    requests.push(route.request().postDataJSON());
    if (requests.length === 1) {
      expect((await route.fetch()).ok()).toBe(true);
      await route.abort("failed");
    } else await route.continue();
  });
  await page.getByRole("button", { name: "Delete my shared copy", exact: true }).click();
  await page.getByRole("button", { name: "Confirm copy deletion", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("may have been saved");
  await page.getByRole("button", { name: "Retry the same action", exact: true }).click();
  await expect(page.locator(".circle-item")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Write a shared copy", exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/This circle is no longer available to this account/)).toHaveCount(0);
  expect((await detail(page, id)).circle.role).toBe("owner");
  expect(requests).toHaveLength(2);
  expect(requests[1]).toEqual(requests[0]);
  await page.unroute(endpoint);
});

test("SC05: late circle read and write responses cannot replace another route", async ({
  page,
}) => {
  await createAccount(page);
  await saveManualPlan(page);
  const id = await createCircle(page);
  const readEndpoint = `**/api/circles/${id}`;
  let releaseRead: () => void = () => {};
  const readGate = new Promise<void>((resolve) => {
    releaseRead = resolve;
  });
  await page.route(readEndpoint, async (route) => {
    await readGate;
    await route.continue();
  });
  const pendingRead = page.waitForResponse((response) =>
    response.url().endsWith(`/api/circles/${id}`),
  );
  await page.getByRole("button", { name: "Refresh circle information", exact: true }).click();
  await page.getByRole("link", { name: "Activity", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Activity", exact: true })).toBeVisible();
  releaseRead();
  await pendingRead;
  await expect(page.getByRole("heading", { name: "Activity", exact: true })).toBeVisible();
  await page.unroute(readEndpoint);
  await page.getByRole("link", { name: "My learning", exact: true }).click();
  await openCircles(page);
  await page.getByRole("button", { name: "Open circle", exact: true }).click();
  await compose(page);
  const writeEndpoint = `**/api/circles/${id}/items`;
  let releaseWrite: () => void = () => {};
  const writeGate = new Promise<void>((resolve) => {
    releaseWrite = resolve;
  });
  await page.route(writeEndpoint, async (route) => {
    await writeGate;
    await route.continue();
  });
  const pendingWrite = page.waitForResponse((response) =>
    response.url().endsWith(`/api/circles/${id}/items`),
  );
  await page.getByRole("button", { name: "Share commitment", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("link", { name: "Journeys", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Journeys", exact: true })).toBeVisible();
  releaseWrite();
  await pendingWrite;
  await expect(page.getByRole("heading", { name: "Journeys", exact: true })).toBeVisible();
  expect((await detail(page, id)).items).toHaveLength(1);
  await page.unroute(writeEndpoint);
  await page.getByRole("link", { name: "My learning", exact: true }).click();
  await openCircles(page);
  const joinInput = page.getByLabel("Invitation code", { exact: true });
  await joinInput.fill("A".repeat(43));
  const detachedInput = await joinInput.elementHandle();
  expect(detachedInput).not.toBeNull();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("link", { name: "Journeys", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Journeys", exact: true })).toBeVisible();
  expect(await detachedInput?.evaluate((input) => (input as HTMLInputElement).value)).toBe("");
  await detachedInput?.dispose();
});

test("SC03/05: explicit preview survives theme/language changes and reflows in French at 320px", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await createAccount(page, "Circle owner");
  const id = await createCircle(page);
  const literal = "<img src=x onerror=alert(1)> I will take one small step.";
  await compose(page, literal);
  await expect(page.locator(".circle-preview-copy img")).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  await capture(page, "circle-desktop-light");
  await page.getByRole("button", { name: "Dark mode", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue(literal);
  await capture(page, "circle-desktop-dark");
  await page.getByLabel("Language", { exact: true }).selectOption("fr");
  await page.setViewportSize({ width: 320, height: 720 });
  await expect(
    page.getByRole("heading", { name: "Ce que votre cercle verra", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue(literal);
  await expectNoHorizontalOverflow(page);
  await capture(page, "circle-mobile-fr-320-dark");
  await page.getByRole("button", { name: "Mode sombre", exact: true }).click();
  await capture(page, "circle-mobile-fr-320-light");
  await page.getByLabel("Message", { exact: true }).fill("Je vais lire une section.");
  await expect(
    page.getByRole("button", { name: "Partager l’engagement", exact: true }),
  ).toBeHidden();
  await page.getByRole("button", { name: "Aperçu de la copie", exact: true }).click();
  const share = page.getByRole("button", { name: "Partager l’engagement", exact: true });
  await share.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".circle-item .circle-message")).toHaveText(
    "Je vais lire une section.",
  );
  expect((await detail(page, id)).items).toHaveLength(1);
  await expectOnlyUiStorage(page);
});

test("SC04/05: lost leave response reconciles to the circle list without retaining shared content", async ({
  page,
  browser,
}) => {
  test.setTimeout(90000);
  await createAccount(page, "Circle owner");
  const id = await createCircle(page);
  const context = await browser.newContext();
  const peer = await context.newPage();
  try {
    await joinPeer(page, peer, id);
    await compose(peer, "A copy to withdraw.", "check_in");
    await peer.getByRole("button", { name: "Share check-in", exact: true }).click();
    await expect(peer.locator(".circle-item")).toHaveCount(1);
    await peer.getByText("Members and circle settings", { exact: true }).click();
    await peer.getByRole("button", { name: "Leave circle", exact: true }).click();
    expect((await detail(page, id)).circle.memberCount).toBe(2);
    await peer.route(`**/api/circles/${id}/leave`, async (route) => {
      expect((await route.fetch()).ok()).toBe(true);
      await route.abort("failed");
    });
    await peer.getByRole("button", { name: "Confirm leaving", exact: true }).click();
    await expect(peer.getByRole("alert")).toContainText("may have been saved");
    await peer.getByRole("button", { name: "Check saved information", exact: true }).click();
    await expect(peer.getByRole("heading", { name: "Study together", exact: true })).toBeVisible();
    await expect(peer.getByText("A copy to withdraw.", { exact: true })).toHaveCount(0);
    expect((await detail(page, id)).items).toEqual([]);
    expect((await detail(page, id)).circle.memberCount).toBe(1);
  } finally {
    await context.close();
  }
});
