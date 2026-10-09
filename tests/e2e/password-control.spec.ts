import { expect, type Page, test } from "@playwright/test";
import {
  createAccount,
  expectNoHorizontalOverflow,
  expectOnlyUiStorage,
  respectAuthenticationRateLimit,
} from "./helpers.js";

// A failed test replaces the worker and its helper clock. Preserve the real
// authentication cooldown rather than cascading rate-limit fixture failures.
test.afterEach(async ({ page: _page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) await respectAuthenticationRateLimit();
});

async function expectPasswordTargetFits(page: Page): Promise<void> {
  const password = page.locator('input[name="password"]');
  const action = await page.locator(".password-reveal").boundingBox();
  const control = await password.boundingBox();
  expect(action).not.toBeNull();
  expect(control).not.toBeNull();
  if (!action || !control) throw new Error("Password control is not rendered");
  expect(action.width).toBeGreaterThanOrEqual(44);
  expect(action.height).toBeGreaterThanOrEqual(44);
  expect(action.x).toBeGreaterThanOrEqual(control.x);
  expect(action.x + action.width).toBeLessThanOrEqual(control.x + control.width);
  expect(
    await password.evaluate((element) => Number.parseFloat(getComputedStyle(element).paddingRight)),
    "Password text has reserved space for the reveal action",
  ).toBeGreaterThanOrEqual(action.width);
  await expectNoHorizontalOverflow(page);
}

test("PV01/02: both forms retain one validated field while Enter and Space toggle without submitting", async ({
  page,
}) => {
  const submissions: string[] = [];
  await page.route("**/api/auth/**", async (route) => {
    submissions.push(new URL(route.request().url()).pathname);
    await route.fulfill({ status: 401, json: { code: "SYNTHETIC_REJECTED" } });
  });
  await page.goto("/");

  for (const signUp of [false, true]) {
    if (signUp)
      await page.getByRole("button", { name: "New here? Create an account", exact: true }).click();
    const password = page.getByLabel("Password", { exact: true });
    const reveal = page.locator(".password-reveal");
    const original = await password.elementHandle();
    const id = await password.getAttribute("id");
    const hint = await password.getAttribute("aria-describedby");
    expect(id).toBeTruthy();
    expect(hint).toBeTruthy();
    await expect(page.locator(`label[for="${id}"]`)).toHaveText("Password");
    await expect(page.locator(`[id="${hint}"]`)).toHaveText("Use 8–128 characters.");
    await expect(password).toHaveAttribute("type", "password");
    await expect(password).toHaveAttribute("name", "password");
    await expect(password).toHaveAttribute(
      "autocomplete",
      signUp ? "new-password" : "current-password",
    );
    await expect(password).toHaveJSProperty("required", true);
    await expect(password).toHaveAttribute("minlength", "8");
    await expect(password).toHaveAttribute("maxlength", "128");
    expect(await password.evaluate((element: HTMLInputElement) => element.checkValidity())).toBe(
      false,
    );
    await expect(reveal).toHaveAccessibleName("Show password");
    await expect(reveal).toHaveAttribute("title", "Show password");
    await expect(reveal).toHaveAttribute("type", "button");
    await expect(reveal).not.toHaveAttribute("aria-pressed", /.*/);
    await expect(reveal.locator("svg")).toHaveAttribute("aria-hidden", "true");
    await expect(reveal.locator("svg")).toHaveAttribute("focusable", "false");
    const eye = await reveal.locator("svg").innerHTML();
    await expectPasswordTargetFits(page);

    if (signUp) await page.getByLabel("Display name", { exact: true }).fill("Synthetic learner");
    await page.getByLabel("Email address", { exact: true }).fill("keyboard@example.test");
    await password.fill("Synthetic-password-0123");
    await password.evaluate((element: HTMLInputElement) =>
      element.setSelectionRange(2, 9, "backward"),
    );
    await page.keyboard.press("Tab");
    await expect(reveal).toBeFocused();
    expect(
      await reveal.evaluate((element) => Number.parseFloat(getComputedStyle(element).outlineWidth)),
    ).toBeGreaterThanOrEqual(2);
    await page.keyboard.press("Enter");
    await expect(password).toHaveAttribute("type", "text");
    await expect(reveal).toHaveAccessibleName("Hide password");
    await expect(reveal).toHaveAttribute("title", "Hide password");
    await expect(reveal).toBeFocused();
    expect(await reveal.locator("svg").innerHTML()).not.toBe(eye);
    await expect(password).toHaveJSProperty("selectionStart", 2);
    await expect(password).toHaveJSProperty("selectionEnd", 9);
    await expect(password).toHaveJSProperty("selectionDirection", "backward");
    await page.keyboard.press("Space");
    await expect(password).toHaveAttribute("type", "password");
    await expect(reveal).toHaveAccessibleName("Show password");
    await expect(reveal).toBeFocused();
    await expect(reveal.locator("svg")).toHaveJSProperty("innerHTML", eye);
    await expect(password).toHaveValue("Synthetic-password-0123");
    await expect(password).toHaveJSProperty("selectionStart", 2);
    await expect(password).toHaveJSProperty("selectionEnd", 9);
    await expect(password).toHaveJSProperty("selectionDirection", "backward");
    await expect(password).toHaveAttribute("id", id ?? "");
    await expect(password).toHaveAttribute("aria-describedby", hint ?? "");
    expect(
      await original?.evaluate(
        (element) => element === document.querySelector('input[name="password"]'),
      ),
    ).toBe(true);
    expect(await password.evaluate((element: HTMLInputElement) => element.checkValidity())).toBe(
      true,
    );
    await original?.dispose();
    expect(submissions, "Reveal activation never sends an authentication request").toEqual([]);
  }
});

test("PV01/03/04: locale and theme retain visible input at desktop and 320px; fresh forms and reload mask it", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const password = page.locator('input[name="password"]');
  const reveal = page.locator(".password-reveal");
  const theme = page.locator(".theme-button");
  const language = page.locator(".language-select");
  await password.fill("Synthetic-private-entry");
  const original = await password.elementHandle();
  await reveal.click();
  await password.evaluate((element: HTMLInputElement) =>
    element.setSelectionRange(3, 11, "forward"),
  );
  await theme.click();
  await language.selectOption("fr");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(reveal).toHaveAccessibleName("Masquer le mot de passe");
  await expect(reveal).toHaveAttribute("title", "Masquer le mot de passe");
  await expect(password).toHaveAttribute("type", "text");
  await expect(password).toHaveValue("Synthetic-private-entry");
  await expect(password).toHaveJSProperty("selectionStart", 3);
  await expect(password).toHaveJSProperty("selectionEnd", 11);
  expect(await original?.evaluate((element) => element.isConnected)).toBe(true);
  await original?.dispose();
  await expectPasswordTargetFits(page);

  await page.setViewportSize({ width: 320, height: 720 });
  await expectPasswordTargetFits(page);
  await theme.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(password).toHaveAttribute("type", "text");
  await expectPasswordTargetFits(page);
  await reveal.click();
  await expect(reveal).toHaveAccessibleName("Afficher le mot de passe");
  await expect(reveal).toHaveAttribute("title", "Afficher le mot de passe");
  await reveal.click();
  await page
    .getByRole("button", { name: "Première visite ? Créer un compte", exact: true })
    .click();
  await expect(password).toHaveAttribute("type", "password");
  await expect(password).toHaveAttribute("autocomplete", "new-password");
  await expect(password).toHaveValue("");
  await expect(reveal).toHaveAccessibleName("Afficher le mot de passe");
  await expectPasswordTargetFits(page);
  await password.fill("Synthetic-signup-entry");
  await reveal.click();
  await theme.click();
  await language.selectOption("en");
  await expect(password).toHaveAttribute("type", "text");
  await expect(password).toHaveValue("Synthetic-signup-entry");
  await expect(reveal).toHaveAccessibleName("Hide password");
  await expectPasswordTargetFits(page);
  await page.getByRole("button", { name: "Already have an account? Sign in", exact: true }).click();
  await expect(password).toHaveAttribute("type", "password");
  await expect(password).toHaveValue("");
  await password.fill("Synthetic-before-reload");
  await reveal.click();
  await expectOnlyUiStorage(page);
  await page.reload();
  await expect(password).toHaveAttribute("type", "password");
  await expect(password).toHaveValue("");
  await expect(reveal).toHaveAccessibleName("Show password");
  await expectOnlyUiStorage(page);
});

test("PV03: pending sign-in and sign-up disable reveal, preserve payloads, and restore controls after failure", async ({
  page,
}) => {
  await page.goto("/");
  for (const signUp of [false, true]) {
    if (signUp)
      await page.getByRole("button", { name: "New here? Create an account", exact: true }).click();
    const password = page.locator('input[name="password"]');
    const reveal = page.locator(".password-reveal");
    const endpoint = signUp ? "sign-up" : "sign-in";
    let payload: unknown;
    let release: () => void = () => {};
    let captured: () => void = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const ready = new Promise<void>((resolve) => {
      captured = resolve;
    });
    const pattern = `**/api/auth/${endpoint}/email`;
    await page.route(pattern, async (route) => {
      payload = route.request().postDataJSON();
      captured();
      await gate;
      await route.fulfill({ status: 401, json: { code: "SYNTHETIC_REJECTED" } });
    });
    try {
      if (signUp)
        await page.getByLabel("Display name", { exact: true }).fill("  Synthetic learner  ");
      await page.getByLabel("Email address", { exact: true }).fill("failure@example.test");
      await password.fill("  Synthetic-visible-password  ");
      await reveal.click();
      await page
        .getByRole("button", { name: signUp ? "Create an account" : "Sign in", exact: true })
        .click();
      await ready;
      await expect(page.locator(".auth-form")).toHaveAttribute("aria-busy", "true");
      await expect(reveal).toBeDisabled();
      await expect(password).toBeDisabled();
      await reveal.evaluate((element: HTMLButtonElement) => element.click());
      await expect(password).toHaveAttribute("type", "text");
      expect(payload).toEqual({
        ...(signUp ? { name: "Synthetic learner" } : {}),
        email: "failure@example.test",
        password: "  Synthetic-visible-password  ",
      });
      release();
      await expect(page.getByRole("alert")).toBeVisible();
      await expect(page.locator(".auth-form")).not.toHaveAttribute("aria-busy", /.*/);
      await expect(reveal).toBeEnabled();
      await expect(password).toBeEnabled();
      await expect(password).toHaveValue("  Synthetic-visible-password  ");
      await expect(password).toHaveAttribute("type", "text");
      await expect(reveal).toHaveAccessibleName("Hide password");
      await reveal.click();
      await expect(password).toHaveAttribute("type", "password");
    } finally {
      release();
      await page.unroute(pattern);
    }
  }
});

test("PV01/03: a revealed password signs into a real synthetic account and sign-out resets the field", async ({
  page,
}) => {
  const account = await createAccount(page, "Password-control learner");
  await page.getByLabel("Account", { exact: true }).click();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  const password = page.getByLabel("Password", { exact: true });
  const reveal = page.locator(".password-reveal");
  await expect(password).toHaveAttribute("type", "password");
  await page.getByLabel("Email address", { exact: true }).fill(account.email);
  await password.fill(account.password);
  await reveal.click();
  await expect(password).toHaveAttribute("type", "text");
  await respectAuthenticationRateLimit();
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Create a learning plan", exact: true }),
  ).toBeVisible();
  expect((await page.request.get("/api/me")).status()).toBe(200);
  await page.getByLabel("Account", { exact: true }).click();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(password).toHaveAttribute("type", "password");
  await expect(password).toHaveValue("");
  await expect(reveal).toHaveAccessibleName("Show password");
  await expectOnlyUiStorage(page);
});
