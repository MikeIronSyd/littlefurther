import { expect, test } from "@playwright/test";
import {
  capture,
  createAccount,
  expectNoHorizontalOverflow,
  expectOnlyUiStorage,
  openManualDraft,
  saveManualPlan,
} from "./helpers.js";

test("AC11b/e: changing language while editing does not invalidate the learner's own saved plan", async ({
  page,
}) => {
  await createAccount(page);
  await saveManualPlan(page);
  await page.getByRole("button", { name: "Edit plan", exact: true }).click();
  await page
    .getByLabel("Learning goal", { exact: true })
    .fill("An edited goal kept across languages");
  await page.setViewportSize({ width: 320, height: 720 });
  await expect(page.locator("main h1")).toHaveText("Adjust your learning plan");
  await expect(page.getByLabel("Learning goal", { exact: true })).toHaveValue(
    "An edited goal kept across languages",
  );
  await expect(page.getByLabel("Learning goal", { exact: true })).toBeFocused();
  await expectNoHorizontalOverflow(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.getByLabel("Language", { exact: true }).selectOption("fr");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByRole("combobox", { name: "Langue", exact: true })).toBeVisible();
  await expect
    .poll(async () => {
      const me = (await (await page.request.get("/api/me")).json()) as {
        profile: { locale: string };
      };
      return me.profile.locale;
    })
    .toBe("fr");
  await expect(page.getByLabel("Objectif d’apprentissage", { exact: true })).toHaveValue(
    "An edited goal kept across languages",
  );
  await page.getByRole("button", { name: "Enregistrer le parcours révisé", exact: true }).click();
  await expect(page.getByText("0 étapes terminées sur 2", { exact: true })).toBeVisible();
  await expect(
    page.getByText("An edited goal kept across languages", { exact: true }).first(),
  ).toBeVisible();
});

test("AC11a/c: device theme changes until an explicit choice, which survives reload", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const themeButton = page.locator(".theme-button");
  await expect(themeButton).toHaveAccessibleName("Switch to light mode");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).colorScheme))
    .toBe("dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(themeButton).toHaveAccessibleName("Switch to dark mode");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await themeButton.click();
  await expect(themeButton).toHaveAccessibleName("Switch to light mode");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expect(themeButton).toHaveAccessibleName("Switch to light mode");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(themeButton).toHaveAccessibleName("Switch to light mode");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expectOnlyUiStorage(page);
});

test("AC11a: invalid saved theme follows device preference instead of applying corrupt state", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("capstone.ui.theme", "invalid-preference"));
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Switch to light mode", exact: true }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(
    page.getByRole("button", { name: "Switch to dark mode", exact: true }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("AC11b/c: blocked preference storage leaves both toggles usable and preserves the draft", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new DOMException("Blocked by acceptance test", "SecurityError");
      },
    });
  });
  await createAccount(page);
  await openManualDraft(page, "This unsaved goal must stay");
  const action = page.getByLabel("Action", { exact: true }).first();
  await action.fill("An unsaved action");
  const route = page.url();
  const themeButton = page.locator(".theme-button");
  const before = await page.locator("html").getAttribute("data-theme");
  await themeButton.click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    before === "dark" ? "light" : "dark",
  );
  await expect(themeButton).toHaveAccessibleName(
    before === "dark" ? "Switch to dark mode" : "Switch to light mode",
  );
  await expect(themeButton).toBeFocused();
  await page.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  const collapsed = page.getByRole("button", { name: "Expand sidebar", exact: true });
  await expect(collapsed).toHaveAttribute("aria-expanded", "false");
  await expect(collapsed).toBeFocused();
  await expect(page.getByText("LittleFurther", { exact: true })).toBeVisible();
  await expect(action).toHaveValue("An unsaved action");
  await expect(page.getByLabel("Learning goal", { exact: true })).toHaveValue(
    "This unsaved goal must stay",
  );
  expect(page.url()).toBe(route);
  await collapsed.click();
  await expect(page.getByRole("button", { name: "Collapse sidebar", exact: true })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});

test("AC11c: desktop sidebar uses directional panel icons, retains links and saves its state", async ({
  page,
}) => {
  await createAccount(page);
  const expanded = page.getByRole("button", { name: "Collapse sidebar", exact: true });
  await expect(expanded).toHaveAttribute("aria-expanded", "true");
  await expect(expanded.locator("svg")).toHaveAttribute("aria-hidden", "true");
  await expect(expanded.locator("svg rect")).toHaveAttribute("width", "18");
  await expect(expanded.locator('svg path[d="m16 15-3-3 3-3"]')).toHaveCount(1);
  await expanded.focus();
  await page.keyboard.press("Enter");
  const collapsed = page.getByRole("button", { name: "Expand sidebar", exact: true });
  await expect(collapsed).toHaveAttribute("aria-expanded", "false");
  await expect(collapsed.locator('svg path[d="m14 9 3 3-3 3"]')).toHaveCount(1);
  await expect(page.getByRole("link", { name: "My learning", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: "Expand sidebar", exact: true })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await expectOnlyUiStorage(page);
});

test("AC11d/e: French 320px drawer contains focus, restores it, and cleans up across resizing", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await createAccount(page);
  await openManualDraft(page, "Mon objectif conservé");
  await page.getByLabel("Action", { exact: true }).first().fill("Mon action conservée");
  await page.getByLabel("Language", { exact: true }).selectOption("fr");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await page.setViewportSize({ width: 320, height: 720 });
  await expect(page.getByRole("combobox", { name: "Langue", exact: true })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await expect(page.getByText("LittleFurther", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Passer en mode sombre", exact: true }).click();
  const opener = page.getByRole("button", { name: "Ouvrir la navigation", exact: true });
  await expect(opener).toHaveAttribute("aria-expanded", "false");
  await opener.click();
  const drawer = page.getByRole("dialog", { name: "Navigation", exact: true });
  await expect(drawer).toBeVisible();
  await capture(page, "mobile-fr-drawer");
  await expect
    .poll(() => drawer.evaluate((element) => element.contains(document.activeElement)))
    .toBe(true);
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press("Tab");
    expect(await drawer.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Shift+Tab");
  expect(await drawer.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await expect(opener).toBeFocused();
  await expect(page.getByLabel("Objectif d’apprentissage", { exact: true })).toHaveValue(
    "Mon objectif conservé",
  );
  await expect(page.getByLabel("Action", { exact: true }).first()).toHaveValue(
    "Mon action conservée",
  );

  await opener.click();
  await drawer.getByRole("button", { name: "Fermer", exact: true }).click();
  await expect(opener).toBeFocused();
  await opener.click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(drawer).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Réduire la barre latérale", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Objectif d’apprentissage", { exact: true }).fill("Toujours modifiable");
  await page.setViewportSize({ width: 320, height: 720 });
  await expect(opener).toHaveAttribute("aria-expanded", "false");
  await expectNoHorizontalOverflow(page);
});
