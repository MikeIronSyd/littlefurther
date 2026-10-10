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

async function expectLittleFurtherBrand(page: Page): Promise<void> {
  const brand = page.locator(".brand");
  const name = brand.locator(".brand-name");
  const mark = brand.locator("svg.brand-mark");
  const path = mark.locator("path");
  const dark = (await page.locator("html").getAttribute("data-theme")) === "dark";
  await expect(page).toHaveTitle("LittleFurther");
  await expect(brand).toHaveCount(1);
  await expect(name).toBeVisible();
  await expect(name).toHaveText("LittleFurther");
  await expect(name).toHaveCSS("font-weight", "650");
  await expect(name).toHaveCSS("color", dark ? "rgb(226, 234, 244)" : "rgb(20, 38, 61)");
  await expect(mark).toHaveAttribute("viewBox", "0 0 32 32");
  await expect(mark).toHaveAttribute("aria-hidden", "true");
  await expect(mark).toHaveAttribute("focusable", "false");
  await expect(path).toHaveCount(1);
  await expect(path).toHaveAttribute("d", "M5 7V25H17V7H27M17 15H25");
  await expect(path).toHaveCSS("fill", "none");
  await expect(path).toHaveCSS("stroke-width", "4px");
  await expect(path).toHaveCSS("stroke-linecap", "round");
  await expect(path).toHaveCSS("stroke-linejoin", "round");
  await expect(path).toHaveCSS("stroke", dark ? "rgb(242, 181, 45)" : "rgb(20, 38, 61)");
  await expect(brand.locator("a, button, input, select, textarea, [tabindex]")).toHaveCount(0);

  const layout = await brand.evaluate((element) => {
    const header = element.closest("header");
    const wordmark = element.querySelector<HTMLElement>(".brand-name");
    const svg = element.querySelector<SVGSVGElement>("svg.brand-mark");
    if (!header || !wordmark || !svg) throw new Error("The complete header brand is missing");
    const bounds = element.getBoundingClientRect();
    const headerBounds = header.getBoundingClientRect();
    const within = (child: DOMRect, parent: DOMRect): boolean =>
      child.left >= parent.left - 0.5 &&
      child.right <= parent.right + 0.5 &&
      child.top >= parent.top - 0.5 &&
      child.bottom <= parent.bottom + 0.5;
    const inViewport = (box: DOMRect): boolean =>
      box.left >= 0 && box.right <= document.documentElement.clientWidth + 0.5;
    const markBounds = svg.getBoundingClientRect();
    const walker = document.createTreeWalker(wordmark, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) nodes.push(node as Text);
    const wordsRemainWhole = (
      [
        [0, 6],
        [6, 13],
      ] as const
    ).every(([start, end]) => {
      const range = document.createRange();
      let offset = 0;
      for (const node of nodes) {
        if (start >= offset && start < offset + node.length) range.setStart(node, start - offset);
        if (end > offset && end <= offset + node.length) range.setEnd(node, end - offset);
        offset += node.length;
      }
      const rectangles = [...range.getClientRects()].filter((box) => box.width > 0);
      const first = rectangles[0];
      return (
        Boolean(first) && rectangles.every((box) => box.top === first?.top && within(box, bounds))
      );
    });
    const opportunity = wordmark.querySelector("wbr");
    const beforeBreak = document.createRange();
    beforeBreak.selectNodeContents(wordmark);
    if (opportunity) beforeBreak.setEndBefore(opportunity);
    const controls = [
      ...header.querySelectorAll<HTMLElement>(
        ".nav-trigger, .language-select, .theme-button, .account-summary",
      ),
    ].filter((control) => control.getClientRects().length > 0);
    return {
      outsideNavigation: !element.closest("aside, nav"),
      contained:
        within(bounds, headerBounds) &&
        within(markBounds, bounds) &&
        within(wordmark.getBoundingClientRect(), bounds) &&
        inViewport(bounds) &&
        wordmark.scrollWidth <= wordmark.clientWidth + 1,
      wordsRemainWhole,
      breakAtBoundary:
        wordmark.querySelectorAll("wbr").length <= 1 &&
        (!opportunity || beforeBreak.toString() === "Little"),
      controlsFit: controls.every((control) => {
        const box = control.getBoundingClientRect();
        const overlaps =
          bounds.left < box.right &&
          bounds.right > box.left &&
          bounds.top < box.bottom &&
          bounds.bottom > box.top;
        return within(box, headerBounds) && inViewport(box) && !overlaps;
      }),
      markWidth: markBounds.width,
      markHeight: markBounds.height,
    };
  });
  expect(layout.outsideNavigation, "The identity remains outside collapsible navigation").toBe(
    true,
  );
  expect(layout.contained, "The complete name and mark remain inside the visible header").toBe(
    true,
  );
  expect(layout.wordsRemainWhole, "Little and Further are individually readable on one line").toBe(
    true,
  );
  expect(layout.breakAtBoundary, "An optional word break occurs only after Little").toBe(true);
  expect(layout.controlsFit, "The brand and visible header controls do not overlap").toBe(true);
  const markSize = (page.viewportSize()?.width ?? 0) < 800 ? 29 : 32;
  expect(layout.markWidth).toBe(markSize);
  expect(layout.markHeight).toBe(markSize);
}

async function expectBrandInBothThemes(page: Page): Promise<void> {
  for (const theme of ["light", "dark"]) {
    if ((await page.locator("html").getAttribute("data-theme")) !== theme)
      await page.locator(".theme-button").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expectLittleFurtherBrand(page);
  }
}

async function expectSignedOutShell(page: Page): Promise<void> {
  await expect(page.locator(".sidebar")).toBeHidden();
  await expect(page.locator(".nav-trigger")).toBeHidden();
  await expect(page.locator(".account-menu")).toBeHidden();
  await expect(page.locator(".mobile-drawer")).toBeHidden();
  await expect(page.getByRole("navigation")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "My learning", exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Journeys", exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Activity", exact: true })).toHaveCount(0);
  const width = page.viewportSize()?.width;
  const column = await page.locator(".main-column").boundingBox();
  expect(column).not.toBeNull();
  expect(column?.x, "The main column begins at the viewport edge without an empty rail").toBe(0);
  expect(column?.width, "The signed-out frame reclaims the whole available width").toBe(width);
  await expectNoHorizontalOverflow(page);
}

for (const width of [1440, 320]) {
  test(`AS01: sign-in and sign-up have a focused full-width shell at ${width}px`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.setViewportSize({ width, height: width === 320 ? 720 : 1000 });
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeVisible();
    await expectLittleFurtherBrand(page);
    await expect(page.getByRole("combobox", { name: "Language", exact: true })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Switch to dark mode", exact: true }),
    ).toBeVisible();
    await expect(page.getByLabel("Email address", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
    await expectSignedOutShell(page);
    await page.getByRole("button", { name: "New here? Create an account", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Create an account", exact: true }),
    ).toBeVisible();
    await expect(page.getByLabel("Display name", { exact: true })).toBeVisible();
    await expectSignedOutShell(page);

    for (const locale of ["en", "fr"]) {
      await page.locator(".language-select").selectOption(locale);
      const heading =
        locale === "en"
          ? "Keep learning, even when life interrupts."
          : "Continuez à apprendre, malgré les imprévus.";
      const copy =
        locale === "en"
          ? "Build a flexible study plan, study and reflect in small steps, and see your progress. Return after a break with your earlier effort intact, and invite trusted peers for private support when you want it."
          : "Créez un programme d’étude souple, étudiez par petites étapes, faites le point et suivez vos progrès. Reprenez après une pause en conservant la trace de vos efforts, et invitez des personnes de confiance dans un cercle privé pour vous soutenir, si vous le souhaitez.";
      for (const size of ["100%", "200%"]) {
        await page.evaluate((value) => {
          document.documentElement.style.fontSize = value;
        }, size);
        for (let form = 0; form < 2; form++) {
          await expectBrandInBothThemes(page);
          await expect(page.locator(".auth-intro h1")).toHaveText(heading);
          await expect(page.locator(".auth-intro .subtitle")).toHaveText(copy);
          const bounds = await page.locator(".auth-intro").evaluate((element) => {
            const panel = element.getBoundingClientRect();
            return [...element.querySelectorAll("h1, p")].every((child) => {
              const box = child.getBoundingClientRect();
              return (
                box.left >= panel.left &&
                box.right <= panel.right &&
                box.bottom <= panel.bottom &&
                child.scrollWidth <= child.clientWidth
              );
            });
          });
          expect(bounds, "Both welcome strings remain inside their auto-height panel").toBe(true);
          await expectNoHorizontalOverflow(page);
          const submit = page.locator('.auth-form button[type="submit"]');
          await submit.scrollIntoViewIfNeeded();
          await expect(submit).toBeInViewport();
          await expect(submit).toBeEnabled();
          await expect(page.locator(".password-reveal")).toBeEnabled();
          await page.locator(".auth-form .text-button").click();
        }
      }
    }
  });
}

test("AS03/04: moon and sun actions have keyboard semantics and localized dismissible tooltips", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeVisible();
  const theme = page.locator(".theme-button");
  const tooltip = page.getByRole("tooltip");
  await expect(theme).toHaveAccessibleName("Switch to dark mode");
  await expect(theme).toHaveAttribute("type", "button");
  await expect(theme).not.toHaveAttribute("aria-pressed", /.*/);
  await expect(theme.locator("svg")).toHaveAttribute("aria-hidden", "true");
  await expect(theme.locator("svg")).toHaveAttribute("focusable", "false");
  await expect(theme.locator("svg circle")).toHaveCount(0);
  const moon = await theme.locator("svg").innerHTML();
  const target = await theme.boundingBox();
  expect(target).not.toBeNull();
  expect(target?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(target?.height ?? 0).toBeGreaterThanOrEqual(44);
  await expect(page.locator(".toggle-track, .toggle-knob")).toHaveCount(0);
  await expect(page.getByText("Dark mode", { exact: true })).toHaveCount(0);

  await theme.hover();
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveText("Switch to dark mode");
  await page.keyboard.press("Escape");
  await expect(tooltip).not.toBeVisible();
  await page.mouse.move(0, 0);
  await page.getByLabel("Email address", { exact: true }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(theme).toBeFocused();
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveText("Switch to dark mode");
  expect(
    await theme.evaluate((element) => Number.parseFloat(getComputedStyle(element).outlineWidth)),
  ).toBeGreaterThanOrEqual(2);
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(theme).toHaveAccessibleName("Switch to light mode");
  await expect(theme).toBeFocused();
  await expect(theme).not.toHaveAttribute("aria-pressed", /.*/);
  await expect(theme.locator("svg circle")).toHaveCount(1);
  expect(await theme.locator("svg").innerHTML()).not.toBe(moon);
  await expect(tooltip).toHaveText("Switch to light mode");
  await page.keyboard.press("Space");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(theme).toHaveAccessibleName("Switch to dark mode");
  await expect(theme).toBeFocused();
  await expect(theme.locator("svg")).toHaveJSProperty("innerHTML", moon);

  const language = page.locator(".language-select");
  await expect(language).toHaveAccessibleName("Language");
  await language.focus();
  await language.selectOption("fr");
  await expect(language).toHaveAccessibleName("Langue");
  await expect(language).toBeFocused();
  await expect(theme).toHaveAccessibleName("Passer en mode sombre");
  await page.keyboard.press("Tab");
  await expect(theme).toBeFocused();
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveText("Passer en mode sombre");
  await page.keyboard.press("Enter");
  await expect(theme).toHaveAccessibleName("Passer en mode clair");
  await expect(tooltip).toHaveText("Passer en mode clair");
  await expect(theme).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(tooltip).not.toBeVisible();
  await expect(theme).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Adresse e-mail", { exact: true })).toBeFocused();
  await expectOnlyUiStorage(page);
});

test("AS04/05: theme and locale retain sign-in and sign-up input and control focus", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const email = page.locator('input[name="email"]');
  const password = page.locator('input[name="password"]');
  const theme = page.locator(".theme-button");
  const language = page.locator(".language-select");
  await email.fill("my-private-auth-input@example.test");
  await password.fill("Unsaved-auth-password");
  const originalEmail = await email.elementHandle();
  const originalPassword = await password.elementHandle();
  await theme.focus();
  await page.keyboard.press("Enter");
  await expect(theme).toBeFocused();
  await language.focus();
  await language.selectOption("fr");
  await expect(language).toBeFocused();
  await expect(email).toHaveValue("my-private-auth-input@example.test");
  await expect(password).toHaveValue("Unsaved-auth-password");
  expect(await originalEmail?.evaluate((element) => element.isConnected)).toBe(true);
  expect(await originalPassword?.evaluate((element) => element.isConnected)).toBe(true);
  await originalEmail?.dispose();
  await originalPassword?.dispose();
  await page
    .getByRole("button", { name: "Première visite ? Créer un compte", exact: true })
    .click();
  const name = page.locator('input[name="name"]');
  await name.fill("My chosen learner name");
  await email.fill("signup-input@example.test");
  await password.fill("Signup-unsaved-password");
  await theme.focus();
  await page.keyboard.press("Space");
  await expect(theme).toBeFocused();
  await language.focus();
  await language.selectOption("en");
  await expect(language).toBeFocused();
  await expect(name).toHaveValue("My chosen learner name");
  await expect(email).toHaveValue("signup-input@example.test");
  await expect(password).toHaveValue("Signup-unsaved-password");
  await expectSignedOutShell(page);
  await expectOnlyUiStorage(page);
});

test("AS02: sign-out focuses authentication and sign-in restores the saved sidebar", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  const account = await createAccount(page);
  await expectLittleFurtherBrand(page);
  await page.setViewportSize({ width: 320, height: 720 });
  for (const locale of ["en", "fr"]) {
    await page.locator(".language-select").selectOption(locale);
    for (const size of ["100%", "200%"]) {
      await page.evaluate((value) => {
        document.documentElement.style.fontSize = value;
      }, size);
      await expectBrandInBothThemes(page);
      await expectNoHorizontalOverflow(page);
      await expect(page.locator(".nav-trigger")).toBeVisible();
      await expect(page.locator(".account-summary")).toBeVisible();
    }
  }
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "100%";
  });
  await page.locator(".language-select").selectOption("en");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator(".theme-button").click();
  await page.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  await expect(page.getByRole("button", { name: "Expand sidebar", exact: true })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await page.getByLabel("Account", { exact: true }).click();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeVisible();
  await expectLittleFurtherBrand(page);
  await expectSignedOutShell(page);
  await expect(page.locator("main h1")).toBeFocused();
  await expect(page.locator("#app")).not.toHaveAttribute("inert", /.*/);
  await expect(page.locator(".account-menu")).not.toHaveAttribute("open", /.*/);
  expect((await page.request.get("/api/me")).status()).toBe(401);
  expect(await page.evaluate(() => localStorage.getItem("capstone.ui.sidebar"))).toBe("collapsed");
  await page.getByLabel("Email address", { exact: true }).fill(account.email);
  await page.getByLabel("Password", { exact: true }).fill(account.password);
  await respectAuthenticationRateLimit();
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Create a learning plan", exact: true }),
  ).toBeVisible();
  const restored = page.getByRole("button", { name: "Expand sidebar", exact: true });
  await expect(restored).toBeVisible();
  await expect(restored).toHaveAttribute("aria-expanded", "false");
  await expect(restored.locator('svg path[d="m14 9 3 3-3 3"]')).toHaveCount(1);
  await expect(page.locator(".sidebar")).toBeVisible();
  await expect(page.getByRole("link", { name: "My learning", exact: true })).toBeVisible();
  await expect(page.getByLabel("Account", { exact: true })).toBeVisible();
  await expectLittleFurtherBrand(page);
  await expectOnlyUiStorage(page);
});

test("AS02: real session expiry closes an open mobile drawer and clears its page lock", async ({
  page,
}) => {
  await createAccount(page);
  let release: () => void = () => {};
  let captured: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const ready = new Promise<void>((resolve) => {
    captured = resolve;
  });
  await page.route("**/api/plans", async (route) => {
    captured();
    await gate;
    // The original token is sent to the real server only after its session has
    // been revoked. This is an actual401, not a fabricated expiry response.
    const response = await route.fetch();
    await route.fulfill({ response });
  });
  try {
    await page.getByRole("link", { name: "Activity", exact: true }).click();
    await ready;
    await page.setViewportSize({ width: 320, height: 720 });
    await page.getByRole("button", { name: "Open navigation", exact: true }).click();
    const drawer = page.getByRole("dialog", { name: "Navigation", exact: true });
    await expect(drawer).toBeVisible();
    await expect(page.locator("body")).toHaveClass(/drawer-open/);
    const response = await page.request.post("/api/auth/sign-out", {
      headers: { origin: new URL(page.url()).origin },
      data: {},
    });
    expect(response.ok()).toBe(true);
    expect((await page.request.get("/api/me")).status()).toBe(401);
    const expiry = page.waitForResponse(
      (response) => new URL(response.url()).pathname === "/api/plans",
    );
    release();
    expect((await expiry).status()).toBe(401);
    await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeVisible();
    await expectSignedOutShell(page);
    await expect(page.locator("body")).not.toHaveClass(/drawer-open/);
    await expect(page.locator(".mobile-drawer")).not.toHaveAttribute("open", /.*/);
    await expect(page.locator("main h1")).toBeFocused();
    await page.getByLabel("Email address", { exact: true }).fill("Returning-learner@example.test");
    await expect(page.getByLabel("Email address", { exact: true })).toBeFocused();
    await expectNoHorizontalOverflow(page);
  } finally {
    release();
  }
});

test("AS05: blocked storage keeps signed-out theme actions and private input usable", async ({
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
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const email = page.getByLabel("Email address", { exact: true });
  await email.fill("Preserved-with-blocked-storage@example.test");
  const theme = page.locator(".theme-button");
  await expect(theme).toHaveAccessibleName("Switch to light mode");
  await theme.focus();
  await page.keyboard.press("Enter");
  await expect(theme).toHaveAccessibleName("Switch to dark mode");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(theme).toBeFocused();
  await expect(email).toHaveValue("Preserved-with-blocked-storage@example.test");
  await page.emulateMedia({ colorScheme: "light" });
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(theme).toHaveAccessibleName("Switch to light mode");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expectSignedOutShell(page);
});
