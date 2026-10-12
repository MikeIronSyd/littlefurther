import { expect, type Locator, type Page, test } from "@playwright/test";
import {
  createAccount,
  expectNoHorizontalOverflow,
  openManualDraft,
  respectAuthenticationRateLimit,
} from "./helpers.js";

interface TouchActivation {
  trusted: boolean;
  active: boolean;
  border: string;
  brand: string;
  duration: string;
}

test.afterEach(async ({ page: _page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) await respectAuthenticationRateLimit();
});

async function brandColour(page: Page): Promise<string> {
  return page.locator(".brand-mark").evaluate((element) => getComputedStyle(element).color);
}

async function rest(page: Page, control: Locator): Promise<void> {
  await page.mouse.move(0, 0);
  await page.locator("main").focus();
  await expect(control).toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)");
  expect(
    await control.evaluate((element) => element.matches(":hover, :focus-visible, :active")),
  ).toBe(false);
}

async function keyboardFocus(page: Page, control: Locator): Promise<void> {
  await control.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(control).toBeFocused();
  const focus = await control.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      visible: element.matches(":focus-visible"),
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
      border: style.borderTopColor,
      duration: style.transitionDuration,
    };
  });
  expect(focus.visible).toBe(true);
  expect(focus.outlineStyle).toBe("solid");
  expect(focus.outlineWidth).toBeGreaterThanOrEqual(3);
  expect(focus.border, "Keyboard feedback does not wait for the hover fade").toBe(
    await brandColour(page),
  );
  expect(focus.duration).toBe("0s");
}

async function systemColour(page: Page, keyword: string): Promise<string> {
  return page.evaluate((value) => {
    const probe = document.createElement("span");
    probe.style.color = value;
    probe.hidden = true;
    document.body.append(probe);
    const colour = getComputedStyle(probe).color;
    probe.remove();
    return colour;
  }, keyword);
}

async function contrast(control: Locator): Promise<number> {
  return control.evaluate((element) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable for computed colour conversion");
    const channels = (colour: string): number[] => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = colour;
      context.fillRect(0, 0, 1, 1);
      return Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3);
    };
    const luminance = (colour: string): number => {
      const values = channels(colour).map((channel) => {
        const scaled = channel / 255;
        return scaled <= 0.04045 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
      });
      return (values[0] ?? 0) * 0.2126 + (values[1] ?? 0) * 0.7152 + (values[2] ?? 0) * 0.0722;
    };
    const style = getComputedStyle(element);
    const border = luminance(style.borderTopColor);
    const inside = luminance(style.backgroundColor);
    let outside = inside;
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      const background = getComputedStyle(parent).backgroundColor;
      if (background !== "rgba(0, 0, 0, 0)") {
        outside = luminance(background);
        break;
      }
    }
    const ratio = (other: number): number =>
      (Math.max(border, other) + 0.05) / (Math.min(border, other) + 0.05);
    return Math.min(ratio(inside), ratio(outside));
  });
}

for (const theme of ["light", "dark"] as const) {
  test(`HB01–05: ${theme} interaction borders fade without moving controls and preserve keyboard/disabled exceptions`, async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ colorScheme: theme });
    await createAccount(page);
    expect(
      await page.evaluate(() => matchMedia("(hover: hover) and (pointer: fine)").matches),
    ).toBe(true);
    const circleEntry = page.getByRole("button", { name: "Open study circles", exact: true });
    for (const control of [
      page.locator(".language-select"),
      page.locator(".theme-button"),
      page.locator(".account-summary"),
      circleEntry,
    ]) {
      await rest(page, control);
      await expect(control).toHaveCSS("border-top-width", "1px");
      await expect(control).toHaveCSS("transition-property", "border-color");
      await expect(control).toHaveCSS("transition-duration", "0.15s");
      await expect(control).toHaveCSS("transition-timing-function", "ease-out");
      const before = await control.boundingBox();
      expect(before).not.toBeNull();
      await control.hover();
      await expect(control).toHaveCSS("border-top-color", await brandColour(page));
      expect(
        await contrast(control),
        "Interaction boundary contrasts with fill and surface",
      ).toBeGreaterThanOrEqual(3);
      expect(await control.boundingBox()).toEqual(before);
      await page.mouse.move(0, 0);
      await expect(control).toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)");
      expect(await control.boundingBox()).toEqual(before);
      await keyboardFocus(page, control);
      expect(await control.boundingBox()).toEqual(before);
    }

    await rest(page, circleEntry);
    const pressBox = await circleEntry.boundingBox();
    if (!pressBox) throw new Error("Circle entry lacks a pointer target");
    await page.mouse.move(pressBox.x + pressBox.width / 2, pressBox.y + pressBox.height / 2);
    await page.mouse.down();
    try {
      expect(await circleEntry.evaluate((element) => element.matches(":active"))).toBe(true);
      expect(
        await circleEntry.evaluate((element) => getComputedStyle(element).borderTopColor),
      ).toBe(await brandColour(page));
      await expect(circleEntry).toHaveCSS("transition-duration", "0s");
      expect(await circleEntry.boundingBox()).toEqual(pressBox);
      // Release away from the action so this state check does not navigate.
      await page.mouse.move(0, 0);
    } finally {
      await page.mouse.up();
    }
    await rest(page, circleEntry);

    const account = page.locator(".account-summary");
    await account.click();
    await expect(page.locator(".account-menu")).toHaveAttribute("open", "");
    await page.mouse.move(0, 0);
    expect(await account.evaluate((element) => element.matches(":focus-visible"))).toBe(false);
    await expect(account).toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)");
    for (const row of await page.locator(".account-items .menu-action").all())
      await expect(row).toHaveCSS("border-top-width", "0px");
    await account.click();

    const sidebar = page.locator(".nav-trigger");
    await page.mouse.move(0, 0);
    await page.locator("main").focus();
    await expect(sidebar).toHaveCSS("border-top-width", "0px");
    await expect(sidebar).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await sidebar.hover();
    await expect(sidebar).toHaveCSS("border-top-width", "0px");
    await expect(sidebar).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    const sidebarBox = await sidebar.boundingBox();
    await page.mouse.down();
    try {
      expect(await sidebar.evaluate((element) => element.matches(":active"))).toBe(true);
      await expect(sidebar).toHaveCSS("border-top-width", "0px");
      expect(await sidebar.boundingBox()).toEqual(sidebarBox);
      await page.mouse.move(0, 0);
    } finally {
      await page.mouse.up();
    }
    await sidebar.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(sidebar).toBeFocused();
    await expect(sidebar).toHaveCSS("border-top-width", "0px");
    await expect(sidebar).toHaveCSS("outline-width", "3px");

    await openManualDraft(page);
    const disabled = page.getByRole("button", { name: "Move step up", exact: true }).first();
    await expect(disabled).toBeDisabled();
    await disabled.hover();
    await expect(disabled).toHaveCSS("opacity", "0.55");
    await expect(disabled).toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)");
    const disabledBox = await disabled.boundingBox();
    if (!disabledBox) throw new Error("Disabled reorder control is missing");
    await page.mouse.down();
    try {
      await expect(disabled).toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)");
      expect(await disabled.boundingBox()).toEqual(disabledBox);
    } finally {
      await page.mouse.up();
    }
    const firstAction = page.getByLabel("Action", { exact: true }).first();
    await expect(firstAction).toHaveValue("Read the first section");
    await expect(firstAction).toHaveCSS("border-top-width", "1px");
    await expect(firstAction).not.toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)");
    const primary = page.getByRole("button", { name: "Confirm and save plan", exact: true });
    await expect(primary).toHaveCSS("background-color", "rgb(242, 181, 45)");
    await expect(primary).toHaveCSS("border-top-color", "rgb(163, 108, 0)");

    await page.emulateMedia({ reducedMotion: "reduce" });
    const secondary = page.getByRole("button", { name: "Remove", exact: true }).first();
    await rest(page, secondary);
    await expect(secondary).toHaveCSS("transition-duration", "0s");
    await secondary.hover();
    expect(await secondary.evaluate((element) => getComputedStyle(element).borderTopColor)).toBe(
      await brandColour(page),
    );
    await page.mouse.move(0, 0);
    expect(await secondary.evaluate((element) => getComputedStyle(element).borderTopColor)).toBe(
      "rgba(0, 0, 0, 0)",
    );

    await page.emulateMedia({ forcedColors: "active" });
    const buttonText = await systemColour(page, "ButtonText");
    for (const control of [page.locator(".theme-button"), secondary, disabled]) {
      await expect(control).toHaveCSS("border-top-color", buttonText);
      await control.hover();
      await expect(control).toHaveCSS("border-top-color", buttonText);
    }
    await page.setViewportSize({ width: 320, height: 800 });
    await page.locator(".language-select").selectOption("fr");
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    await expectNoHorizontalOverflow(page);
    await sidebar.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(sidebar).toHaveCSS("border-top-width", "0px");
    await expect(sidebar).toHaveCSS("outline-color", await systemColour(page, "Highlight"));
    for (const control of [
      sidebar,
      page.locator(".theme-button"),
      page.locator(".account-summary"),
    ]) {
      const box = await control.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });
}

test.describe("HB03/04: synthesized touch input", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 320, height: 800 } });

  test("press feedback works without hover and ends after native touch actions", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await createAccount(page);
    expect(
      await page.evaluate(() => ({
        hover: matchMedia("(hover: hover)").matches,
        fine: matchMedia("(pointer: fine)").matches,
      })),
    ).toEqual({ hover: false, fine: false });
    await page.locator(".language-select").selectOption("fr");
    const theme = page.locator(".theme-button");
    await page.locator("main").focus();
    await expect(theme).toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)");
    const session = await page.context().newCDPSession(page);
    let touching = false;
    const tapWithActivationEvidence = async (control: Locator): Promise<void> => {
      await control.scrollIntoViewIfNeeded();
      const box = await control.boundingBox();
      if (!box) throw new Error("Touch control lacks a target");
      await control.evaluate((element) => {
        const target = element as HTMLElement & { touchActivation?: TouchActivation };
        // Edge applies :active to its native compatibility mouse event after
        // touchEnd, rather than while the synthesized finger is held down.
        target.addEventListener(
          "mousedown",
          (event) => {
            const mark = document.querySelector(".brand-mark");
            if (!mark) throw new Error("Touch activation lost the brand reference");
            const style = getComputedStyle(target);
            target.touchActivation = {
              trusted: event.isTrusted,
              active: target.matches(":active"),
              border: style.borderTopColor,
              brand: getComputedStyle(mark).color,
              duration: style.transitionDuration,
            };
          },
          { once: true, passive: true },
        );
      });
      await session.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }],
      });
      touching = true;
      const target = await control.elementHandle();
      if (!target) throw new Error("Touch evidence lost its action target");
      await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      touching = false;
      const activation = await target.evaluate(
        (element) =>
          (element as HTMLElement & { touchActivation?: TouchActivation }).touchActivation,
      );
      expect(activation, "The actual touch tap produces native activation evidence").toBeDefined();
      expect(activation?.trusted).toBe(true);
      expect(activation?.active).toBe(true);
      expect(activation?.border).toBe(activation?.brand);
      expect(activation?.duration).toBe("0s");
      await target.dispose();
    };
    try {
      await tapWithActivationEvidence(theme);
      await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
      await expect(theme).toHaveAccessibleName("Passer en mode sombre");
      expect(await theme.evaluate((element) => element.matches(":focus-visible"))).toBe(false);
      await expect(theme).toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)");
      const circleEntry = page.getByRole("button", {
        name: "Ouvrir les cercles d’étude",
        exact: true,
      });
      await tapWithActivationEvidence(circleEntry);
      await expect(page.locator(".circle-body h1")).toHaveText("Étudier ensemble");
      await expectNoHorizontalOverflow(page);
    } finally {
      try {
        if (touching)
          await session.send("Input.dispatchTouchEvent", { type: "touchCancel", touchPoints: [] });
      } finally {
        await session.detach();
      }
    }
  });
});
