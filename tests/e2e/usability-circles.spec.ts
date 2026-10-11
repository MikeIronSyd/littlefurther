import { randomUUID } from "node:crypto";
import { expect, type Page, test } from "@playwright/test";
import type { CircleDetail } from "../../src/shared/contracts.js";
import { createAccount, expectNoHorizontalOverflow } from "./helpers.js";

const origin = "http://127.0.0.1:4318";
const circleName = "Usability review circle";

async function mutate<T>(page: Page, path: string, data: unknown): Promise<T> {
  const response = await page.request.post(path, { headers: { origin }, data });
  expect(response.ok()).toBe(true);
  return (await response.json()) as T;
}

async function createCircle(page: Page): Promise<string> {
  await createAccount(page, "Review owner");
  await page.getByRole("button", { name: "Open study circles", exact: true }).click();
  await page.getByLabel("Circle name", { exact: true }).fill(circleName);
  const result = page.waitForResponse(
    (response) => response.url().endsWith("/api/circles") && response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Create a circle", exact: true }).click();
  const created = (await (await result).json()) as { circleId: string };
  await expect(page.locator(".circle-body h1")).toHaveText(circleName);
  return created.circleId;
}

async function refreshCircle(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Refresh circle information", exact: true }).click();
  await expect(page.locator(".circle-body h1")).toHaveText(circleName);
}

test("UL06: circle destinations share a desktop row, wrap in French mobile and retain draft guards", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await createCircle(page);
  const navigation = page.locator(".circle-navigation");
  await expect(navigation.getByRole("button")).toHaveCount(2);
  const back = navigation.getByRole("button", { name: "Back to my learning", exact: true });
  const list = navigation.getByRole("button", { name: "All my circles", exact: true });
  const boxes = await Promise.all([back.boundingBox(), list.boundingBox()]);
  expect(boxes[0]?.y).toBe(boxes[1]?.y);
  for (const control of [back, list]) {
    const box = await control.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(await control.evaluate((node) => getComputedStyle(node).textDecorationLine)).toContain(
      "underline",
    );
  }
  await list.click();
  await expect(page.locator(".circle-body h1")).toHaveText("Study together");
  await expect(navigation.getByRole("button")).toHaveCount(1);
  await page.getByRole("button", { name: "Open circle", exact: true }).click();
  await page.getByRole("button", { name: "Write a shared copy", exact: true }).click();
  const draft = page.getByLabel("Message", { exact: true });
  await draft.fill("Keep this unshared draft.");
  page.once("dialog", (dialog) => dialog.dismiss());
  await navigation.getByRole("button", { name: "Back to circle", exact: true }).click();
  await expect(draft).toHaveValue("Keep this unshared draft.");
  await page.getByLabel("Language", { exact: true }).selectOption("fr");
  await page.setViewportSize({ width: 320, height: 800 });
  const mobileButtons = navigation.getByRole("button");
  const first = await mobileButtons.nth(0).boundingBox();
  const second = await mobileButtons.nth(1).boundingBox();
  expect(first?.x).toBeGreaterThanOrEqual(0);
  expect((second?.x ?? 0) + (second?.width ?? 0)).toBeLessThanOrEqual(320);
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue(
    "Keep this unshared draft.",
  );
  await expectNoHorizontalOverflow(page);
  await page.emulateMedia({ forcedColors: "active" });
  await mobileButtons.nth(1).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(mobileButtons.nth(0)).toBeFocused();
  expect(await mobileButtons.nth(0).evaluate((node) => node.matches(":focus-visible"))).toBe(true);
  expect(
    await mobileButtons.nth(0).evaluate((node) => getComputedStyle(node).outlineStyle),
  ).not.toBe("none");
  await page.emulateMedia({ forcedColors: "none" });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "32px";
  });
  const enlargedFirst = await mobileButtons.nth(0).boundingBox();
  const enlargedSecond = await mobileButtons.nth(1).boundingBox();
  expect(enlargedSecond?.y).toBeGreaterThanOrEqual(
    (enlargedFirst?.y ?? 0) + (enlargedFirst?.height ?? 0),
  );
  await expectNoHorizontalOverflow(page);
  for (const control of await mobileButtons.all()) {
    const box = await control.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeLessThanOrEqual(296);
  }
  page.once("dialog", (dialog) => dialog.accept());
  await navigation.getByRole("button", { name: "Retour au cercle", exact: true }).click();
  await expect(page.locator(".circle-body h1")).toHaveText(circleName);
  await expect(page.locator(".circle-item")).toHaveCount(0);
});

test("UL04: repeated destructive actions and their confirmation controls include visible row context", async ({
  page,
}) => {
  const id = await createCircle(page);
  for (const copy of ["Read the short introduction.", "Reflect on the worked example."])
    await mutate(page, `/api/circles/${id}/items`, {
      requestId: randomUUID(),
      kind: "commitment",
      text: copy,
    });
  await mutate(page, `/api/circles/${id}/invites`, { requestId: randomUUID() });
  // Read-only rendering fixture: existing real-account circle with two synthetic display rows.
  // This tests naming, not membership authorization; no removal request is submitted.
  await page.route(`**/api/circles/${id}`, async (route) => {
    const response = await route.fetch();
    const detail = (await response.json()) as CircleDetail;
    detail.members.push(
      ...["Amina", "Léa"].map((displayName) => ({
        id: randomUUID(),
        displayName,
        role: "member" as const,
        isSelf: false,
        joinedAt: detail.circle.createdAt,
      })),
    );
    await route.fulfill({ response, json: detail });
  });
  await refreshCircle(page);
  for (const copy of ["Read the short introduction.", "Reflect on the worked example."]) {
    const row = page.locator(".circle-item").filter({ has: page.getByText(copy, { exact: true }) });
    const trigger = row.getByRole("button", { name: /^Delete my shared copy / });
    await expect(trigger).toHaveAccessibleName(
      new RegExp(
        `^Delete my shared copy ${copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} Review owner`,
      ),
    );
    const contextIds = await trigger.getAttribute("aria-labelledby");
    await trigger.click();
    await expect(row.getByRole("button", { name: /^Confirm copy deletion / })).toHaveAccessibleName(
      new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
    await row.getByRole("button", { name: /^Cancel / }).click();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-labelledby", contextIds ?? "");
  }
  await page.getByText("Members and circle settings", { exact: true }).click();
  for (const name of ["Amina", "Léa"]) {
    const trigger = page.getByRole("button", { name: `Remove member ${name}`, exact: true });
    await trigger.click();
    await expect(
      page.getByRole("button", { name: `Confirm member removal ${name}`, exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: `Cancel ${name}`, exact: true }).click();
    await expect(trigger).toBeFocused();
  }
  await page.getByText("Invitations", { exact: true }).click();
  const invite = page.locator(".circle-invite");
  const expiry = (await invite.locator("p").textContent())?.trim() ?? "";
  await invite.getByRole("button", { name: `Revoke invitation ${expiry}`, exact: true }).click();
  await expect(
    invite.getByRole("button", { name: `Confirm revocation ${expiry}`, exact: true }),
  ).toBeVisible();
  await page.getByLabel("Language", { exact: true }).selectOption("fr");
  const frenchExpiry = (await invite.locator("p.hint").textContent())?.trim() ?? "";
  await expect(
    invite.getByRole("button", { name: `Confirmer la révocation ${frenchExpiry}`, exact: true }),
  ).toBeVisible();
  await invite.getByRole("button", { name: `Annuler ${frenchExpiry}`, exact: true }).click();
  await expect(
    invite.getByRole("button", { name: `Révoquer l’invitation ${frenchExpiry}`, exact: true }),
  ).toBeFocused();
  await page.getByLabel("Langue", { exact: true }).selectOption("en");
  await expect(
    invite.getByRole("button", { name: `Revoke invitation ${expiry}`, exact: true }),
  ).toBeVisible();
  expect(
    ((await (await page.request.get(`/api/circles/${id}`)).json()) as CircleDetail).items,
  ).toHaveLength(2);
});

test("UL04/06: circle navigation remains disabled through a pending and uncertain write and clears stale destinations on denial", async ({
  page,
}) => {
  const id = await createCircle(page);
  await page.getByRole("button", { name: "Write a shared copy", exact: true }).click();
  await page.getByLabel("Message", { exact: true }).fill("An uncertain synthetic commitment.");
  await page.getByRole("button", { name: "Preview copy", exact: true }).click();
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(`**/api/circles/${id}/items`, async (route) => {
    await gate;
    await route.abort("failed");
  });
  await page.getByRole("button", { name: "Share commitment", exact: true }).click();
  const navigation = page.locator(".circle-navigation");
  for (const button of await navigation.getByRole("button").all())
    await expect(button).toBeDisabled();
  release();
  await expect(page.getByRole("alert")).toContainText("may have been saved");
  for (const button of await navigation.getByRole("button").all())
    await expect(button).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Retry the same action", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Check saved information", exact: true }).click();
  await expect(page.locator(".circle-body h1")).toHaveText(circleName);
  for (const button of await navigation.getByRole("button").all())
    await expect(button).toBeEnabled();
  await expect(page.locator(".circle-item")).toHaveCount(0);
  await page.route(`**/api/circles/${id}`, async (route) => {
    await route.fulfill({ status: 403, json: { error: { code: "forbidden" } } });
  });
  await page.getByRole("button", { name: "Refresh circle information", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "previously displayed content has been cleared",
  );
  await expect(navigation.getByRole("button")).toHaveCount(1);
  await expect(
    navigation.getByRole("button", { name: "Back to my learning", exact: true }),
  ).toBeEnabled();
  await expect(navigation.getByRole("button", { name: "All my circles", exact: true })).toHaveCount(
    0,
  );
  await expect(navigation.getByRole("button", { name: "Back to circle", exact: true })).toHaveCount(
    0,
  );
});
