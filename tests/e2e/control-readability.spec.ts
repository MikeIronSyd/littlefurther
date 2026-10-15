import { expect, type Locator, type Page, test } from "@playwright/test";
import {
  capture,
  createAccount,
  expectNoHorizontalOverflow,
  openManualDraft,
  respectAuthenticationRateLimit,
} from "./helpers.js";

test.afterEach(async ({ page: _page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) await respectAuthenticationRateLimit();
});

async function idleBoundary(
  page: Page,
  control: Locator,
  persistentBoundary = true,
): Promise<void> {
  await expect(control).toBeVisible();
  await expect(control).toBeEnabled();
  await page.mouse.move(0, 0);
  await page.locator("main").focus();
  if (!persistentBoundary) await expect(control).toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)");
  const cue = await control.evaluate((element) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable for computed colour conversion");
    const colour = (value: string): number[] => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      const data = context.getImageData(0, 0, 1, 1).data;
      return [data[0] ?? 0, data[1] ?? 0, data[2] ?? 0, (data[3] ?? 0) / 255];
    };
    const over = (top: number[], bottom: number[]): number[] => {
      const alpha = top[3] ?? 1;
      return [0, 1, 2]
        .map((index) => (top[index] ?? 0) * alpha + (bottom[index] ?? 0) * (1 - alpha))
        .concat(1);
    };
    const ancestors: Element[] = [];
    for (let node = element.parentElement; node; node = node.parentElement) ancestors.unshift(node);
    let outside = [255, 255, 255, 1];
    for (const ancestor of ancestors)
      outside = over(colour(getComputedStyle(ancestor).backgroundColor), outside);
    const style = getComputedStyle(element);
    const fill = colour(style.backgroundColor);
    const inside = over(fill, outside);
    const border = colour(style.borderTopColor);
    const luminance = (rgb: number[]): number => {
      const linear = rgb.slice(0, 3).map((value) => {
        const scaled = value / 255;
        return scaled <= 0.04045 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
      });
      return (linear[0] ?? 0) * 0.2126 + (linear[1] ?? 0) * 0.7152 + (linear[2] ?? 0) * 0.0722;
    };
    const ratio = (a: number[], b: number[]): number => {
      const one = luminance(a);
      const two = luminance(b);
      return (Math.max(one, two) + 0.05) / (Math.min(one, two) + 0.05);
    };
    return {
      width: Number.parseFloat(style.borderTopWidth),
      style: style.borderTopStyle,
      fillAlpha: fill[3],
      borderAlpha: border[3],
      insideContrast: ratio(over(border, inside), inside),
      outsideContrast: ratio(over(border, outside), outside),
      textContrast: ratio(over(colour(style.color), inside), inside),
      focused: element === document.activeElement,
      hovered: element.matches(":hover"),
    };
  });
  expect(cue.focused, "Idle cues must not depend on keyboard focus").toBe(false);
  expect(cue.hovered, "Idle cues must not depend on pointer hover").toBe(false);
  expect(cue.width).toBeGreaterThanOrEqual(1);
  expect(cue.style).toBe("solid");
  expect(cue.fillAlpha, "A persistent soft fill is present").toBe(1);
  if (persistentBoundary) {
    expect(cue.borderAlpha, "The persistent boundary is opaque").toBe(1);
    expect(cue.insideContrast, "Boundary contrasts with its own fill").toBeGreaterThanOrEqual(3);
    expect(
      cue.outsideContrast,
      "Boundary contrasts with surrounding surface",
    ).toBeGreaterThanOrEqual(3);
  } else expect(cue.borderAlpha, "The interaction boundary is transparent at rest").toBe(0);
  expect(cue.textContrast, "Ordinary control text or icon remains distinct").toBeGreaterThanOrEqual(
    4.5,
  );
}

async function softBoundary(page: Page, control: Locator): Promise<void> {
  await idleBoundary(page, control, false);
}

async function borderlessSidebar(page: Page): Promise<void> {
  const control = page.locator(".nav-trigger");
  await page.mouse.move(0, 0);
  await page.locator("main").focus();
  await expect(control).toBeVisible();
  for (const side of ["top", "right", "bottom", "left"])
    await expect(control).toHaveCSS(`border-${side}-width`, "0px");
  await expect(control).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await target(control);
  await expect(control.locator("svg")).toHaveCSS("width", "29px");
  await expect(control.locator("svg")).toHaveCSS("height", "29px");
}

async function target(control: Locator): Promise<void> {
  const box = await control.boundingBox();
  expect(box).not.toBeNull();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
}

async function underlined(control: Locator): Promise<void> {
  await expect(control).toBeVisible();
  expect(
    await control.evaluate((element) => getComputedStyle(element).textDecorationLine),
  ).toContain("underline");
}

async function readable(locator: Locator): Promise<void> {
  for (const element of await locator.all())
    expect(
      await element.evaluate((node) => Number.parseFloat(getComputedStyle(node).fontSize)),
    ).toBeGreaterThanOrEqual(14);
}

for (const theme of ["light", "dark"] as const) {
  test(`CR01–04/HB01–05: connected actions retain soft cues and readable structure in ${theme} mode`, async ({
    page,
  }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ colorScheme: theme });
    await createAccount(page);
    for (const selector of [".theme-button", ".language-select", ".account-summary"]) {
      await softBoundary(page, page.locator(selector));
      await target(page.locator(selector));
    }
    await borderlessSidebar(page);
    const chevron = page.locator(".account-chevron");
    await expect(chevron).toHaveAttribute("aria-hidden", "true");
    await expect(chevron).toHaveAttribute("focusable", "false");
    await expect(chevron.locator("path")).toHaveAttribute("d", "m6 9 6 6 6-6");
    const circleEntry = page.getByRole("button", { name: "Open study circles", exact: true });
    await softBoundary(page, circleEntry);
    const idleBorder = await circleEntry.evaluate(
      (element) => getComputedStyle(element).borderTopColor,
    );
    await circleEntry.hover();
    await expect(circleEntry).toHaveCSS(
      "border-top-color",
      await page.locator(".brand-mark").evaluate((element) => getComputedStyle(element).color),
    );
    expect(
      await circleEntry.evaluate((element) => getComputedStyle(element).borderTopColor),
    ).not.toBe(idleBorder);
    await page.mouse.move(0, 0);
    await circleEntry.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(circleEntry).toBeFocused();
    expect(
      await circleEntry.evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).outlineWidth),
      ),
    ).toBeGreaterThanOrEqual(2);
    await page.getByLabel("Account", { exact: true }).click();
    await page.getByRole("button", { name: "Preferences", exact: true }).click();
    await softBoundary(page, page.getByRole("button", { name: "Cancel", exact: true }));
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    await openManualDraft(page);
    await page
      .getByLabel("Reference links (optional)", { exact: true })
      .fill("https://example.test/reference");
    await page.getByRole("button", { name: "Confirm and save plan", exact: true }).click();
    await expect(page.getByText("0 of 2 steps complete", { exact: true })).toBeVisible();
    for (const name of [
      "Edit plan",
      "Edit step",
      "Try a 5-minute restart",
      "Review restart dates",
      "Open study circles",
    ])
      await softBoundary(page, page.getByRole("button", { name, exact: true }));
    const path = page.locator(".path-action");
    await expect(path).toHaveCount(2);
    for (const row of await path.all()) {
      await idleBoundary(page, row);
      await target(row);
    }
    await readable(page.locator(".path-description, .progress-number, .rhythm-number"));
    await page.getByRole("button", { name: "Edit plan", exact: true }).click();
    await page.setViewportSize({ width: 320, height: 800 });
    await expect(
      page.getByRole("button", { name: "Move step up", exact: true }).first(),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Move step down", exact: true }).last(),
    ).toBeDisabled();
    for (const control of await page.locator(".row-actions button:disabled").all()) {
      await expect(control).toBeVisible();
      await expect(control).toHaveCSS("border-top-style", "solid");
    }
    await readable(page.locator(".row-actions .button"));
    const gaps = await page
      .locator(".row-actions")
      .first()
      .evaluate((element) => {
        const style = getComputedStyle(element);
        return [Number.parseFloat(style.columnGap), Number.parseFloat(style.rowGap)];
      });
    expect(gaps.every((gap) => gap >= 10)).toBe(true);
    await softBoundary(
      page,
      page.getByRole("button", { name: "Move step down", exact: true }).first(),
    );
    await softBoundary(page, page.getByRole("button", { name: "Remove", exact: true }).first());
    await expectNoHorizontalOverflow(page);
    await page
      .getByRole("form", { name: "Adjust your learning plan", exact: true })
      .getByRole("button", { name: "Cancel", exact: true })
      .click();
    await target(page.locator(".account-summary"));
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.getByRole("button", { name: "Start study session", exact: true }).click();
    await softBoundary(page, page.getByRole("button", { name: "Back", exact: true }));
    await underlined(
      page.getByRole("link", { name: "https://example.test/reference", exact: true }),
    );
    await softBoundary(
      page,
      page.getByRole("button", { name: "Mark this step complete", exact: true }),
    );
    await page.getByLabel("Minutes you studied", { exact: true }).fill("3");
    await page.getByRole("button", { name: "Save study session", exact: true }).click();
    await expect(page.getByText("Your study session is saved.", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Mark this step complete", exact: true }).click();
    await expect(
      page.getByText("Step completed. Your earlier effort is still recorded.", { exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Choose the next action", exact: true }).click();
    await expect(page.locator(".path-step.completed")).toHaveCount(1);
    const completedRow = page.locator(".path-step.completed");
    await expect(completedRow.locator(".path-action")).toHaveCount(0);
    const correction = completedRow.getByRole("button", {
      name: "Mark as unfinished",
      exact: true,
    });
    await softBoundary(page, correction);
    await target(correction);
    await expect(page.locator(".path-action")).toHaveCount(1);
    await page.getByRole("link", { name: "Activity", exact: true }).click();
    const overview = page.getByRole("region", { name: "Review my learning notes", exact: true });
    const history = page.getByRole("region", { name: "Retained history", exact: true });
    await expect(overview).toBeVisible();
    await expect(history).toBeVisible();
    await expect(history.getByText("1 study session", { exact: true })).toBeVisible();
    const overviewBox = await overview.boundingBox();
    const historyBox = await history.boundingBox();
    expect(overviewBox).not.toBeNull();
    expect(historyBox).not.toBeNull();
    expect(
      (historyBox?.y ?? 0) - (overviewBox?.y ?? 0) - (overviewBox?.height ?? 0),
    ).toBeGreaterThanOrEqual(24);
    await capture(page, `control-readability-activity-${theme}`);
    await page.getByRole("link", { name: "Journeys", exact: true }).click();
    await softBoundary(page, page.getByRole("button", { name: "Open journey", exact: true }));
    await page.getByRole("button", { name: "Open journey", exact: true }).click();
    await page.getByRole("button", { name: "Review restart dates", exact: true }).click();
    await underlined(page.getByRole("button", { name: "Back to my learning", exact: true }));
    await softBoundary(page, page.getByRole("button", { name: "Edit plan", exact: true }));
    await softBoundary(
      page,
      page.getByRole("button", { name: "Preview revised dates", exact: true }),
    );
    await page.getByLabel("Restart date", { exact: true }).fill("2026-10-13");
    await page.getByRole("button", { name: "Preview revised dates", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Apply revised plan", exact: true }),
    ).toBeDisabled();
    await softBoundary(page, page.getByRole("button", { name: "Cancel", exact: true }));
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    await page.getByRole("button", { name: "Open study circles", exact: true }).click();
    await underlined(page.getByRole("button", { name: "Back to my learning", exact: true }));
    await softBoundary(page, page.getByRole("button", { name: "Create a circle", exact: true }));
    await softBoundary(page, page.getByRole("button", { name: "Join a circle", exact: true }));
    await page.getByLabel("Circle name", { exact: true }).fill("Control review circle");
    await page.getByRole("button", { name: "Create a circle", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Control review circle", exact: true }).first(),
    ).toBeVisible();
    await underlined(page.getByRole("button", { name: "All my circles", exact: true }));
    await softBoundary(
      page,
      page.getByRole("button", { name: "Refresh circle information", exact: true }),
    );
    await softBoundary(page, page.locator(".circle-management > summary").first());
    await page.getByText("Members and circle settings", { exact: true }).click();
    await softBoundary(page, page.locator(".circle-management > summary").first());
    await softBoundary(page, page.getByRole("button", { name: "Close circle", exact: true }));
    await page.getByRole("button", { name: "Close circle", exact: true }).click();
    await softBoundary(
      page,
      page.getByRole("button", { name: "Confirm circle closure", exact: true }),
    );
    await softBoundary(page, page.getByRole("button", { name: "Cancel", exact: true }));
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    await page.getByRole("button", { name: "Write a shared copy", exact: true }).click();
    await underlined(page.getByRole("button", { name: "Back to circle", exact: true }));
    await page.getByLabel("Message", { exact: true }).fill("A deliberate synthetic commitment.");
    await softBoundary(page, page.getByRole("button", { name: "Preview copy", exact: true }));
    await page.getByRole("button", { name: "Preview copy", exact: true }).click();
    await expect(
      page.getByText("This is a preview. It hasn’t been shared yet.", { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Share commitment", exact: true })).toBeVisible();
    await softBoundary(page, page.getByRole("button", { name: "Cancel", exact: true }));
    await capture(page, `control-readability-circle-preview-${theme}`);
  });
}

const authCopy = {
  en: {
    headline: "Keep learning, even when life interrupts.",
    copy: "Build a flexible study plan, study and reflect in small steps, and see your progress. Return after a break with your earlier effort intact, and invite trusted peers for private support when you want it.",
    signUp: "New here? Create an account",
    signIn: "Already have an account? Sign in",
    password: "Password",
    reveal: "Show password",
    conceal: "Hide password",
  },
  fr: {
    headline: "Continuez à apprendre, malgré les imprévus.",
    copy: "Créez un programme d’étude souple, étudiez par petites étapes, faites le point et suivez vos progrès. Reprenez après une pause en conservant la trace de vos efforts, et invitez des personnes de confiance dans un cercle privé pour vous soutenir, si vous le souhaitez.",
    signUp: "Première visite ? Créer un compte",
    signIn: "Déjà un compte ? Se connecter",
    password: "Mot de passe",
    reveal: "Afficher le mot de passe",
    conceal: "Masquer le mot de passe",
  },
} as const;

for (const locale of ["en", "fr"] as const) {
  test(`CR02/04: ${locale} mobile entry stays compact, readable and keyboard operated`, async ({
    page,
  }) => {
    const copy = authCopy[locale];
    await page.setViewportSize({ width: 320, height: 800 });
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page.locator(".language-select").selectOption(locale);
    for (const theme of ["light", "dark"] as const) {
      if ((await page.locator("html").getAttribute("data-theme")) !== theme)
        await page.locator(".theme-button").click();
      for (const creating of [false, true]) {
        if (creating) await page.getByRole("button", { name: copy.signUp, exact: true }).click();
        await expect(page.locator(".auth-intro h1")).toHaveText(copy.headline);
        await expect(page.locator(".auth-intro p")).toHaveText(copy.copy);
        await expect(page.locator(".auth-intro h1")).toHaveCSS("font-size", "28px");
        await expect(page.locator(".auth-intro")).toHaveCSS("padding", "16px");
        await expect(page.locator(".auth-layout")).toHaveCSS("gap", "20px");
        await expect(page.locator(".auth-intro p")).toHaveCSS("font-size", "16.8px");
        const panelBox = await page.locator(".auth-intro").boundingBox();
        const formBox = await page.locator(".auth-form").boundingBox();
        expect(panelBox).not.toBeNull();
        expect(formBox).not.toBeNull();
        expect((formBox?.y ?? 0) - (panelBox?.y ?? 0) - (panelBox?.height ?? 0)).toBeCloseTo(20, 0);
        for (const selector of [".nav-trigger", ".account-menu", ".sidebar"])
          await expect(page.locator(selector)).toBeHidden();
        await softBoundary(page, page.locator(".theme-button"));
        await softBoundary(page, page.locator(".language-select"));
        await target(page.locator(".theme-button"));
        const password = page.getByLabel(copy.password, { exact: true });
        await password.fill("Synthetic-visible-password");
        const reveal = page.getByRole("button", { name: copy.reveal, exact: true });
        await target(reveal);
        await reveal.focus();
        await page.keyboard.press("Enter");
        await expect(password).toHaveAttribute("type", "text");
        await page.getByRole("button", { name: copy.conceal, exact: true }).press("Space");
        await expect(password).toHaveAttribute("type", "password");
        await expect(password).toHaveValue("Synthetic-visible-password");
        await underlined(
          page.getByRole("button", { name: creating ? copy.signIn : copy.signUp, exact: true }),
        );
        await expectNoHorizontalOverflow(page);
        await page.evaluate(() => {
          document.documentElement.style.fontSize = "200%";
        });
        await expectNoHorizontalOverflow(page);
        await target(page.locator(".theme-button"));
        const skip = page.getByRole("link", {
          name: locale === "fr" ? "Aller au contenu" : "Skip to content",
          exact: true,
        });
        const hiddenSkip = await skip.boundingBox();
        expect(hiddenSkip).not.toBeNull();
        expect((hiddenSkip?.y ?? 0) + (hiddenSkip?.height ?? 0)).toBeLessThanOrEqual(0);
        await skip.focus();
        await expect(skip).toBeFocused();
        const focusedSkip = await skip.boundingBox();
        expect(focusedSkip).not.toBeNull();
        expect(focusedSkip?.x).toBeGreaterThanOrEqual(0);
        expect((focusedSkip?.x ?? 0) + (focusedSkip?.width ?? 0)).toBeLessThanOrEqual(320);
        expect(focusedSkip?.y).toBeGreaterThanOrEqual(0);
        expect((focusedSkip?.y ?? 0) + (focusedSkip?.height ?? 0)).toBeLessThanOrEqual(800);
        await skip.press("Enter");
        await expect(page.locator("main")).toBeFocused();
        const contained = await page.locator(".auth-layout").evaluate((element) =>
          [...element.querySelectorAll<HTMLElement>("input, button, select, h1, p")].every(
            (node) => {
              const box = node.getBoundingClientRect();
              return box.left >= 0 && box.right <= document.documentElement.clientWidth + 1;
            },
          ),
        );
        expect(contained, "Enlarged entry content remains within the narrow viewport").toBe(true);
        await page.evaluate(() => {
          document.documentElement.style.fontSize = "100%";
        });
        if (creating) {
          await capture(page, `control-readability-auth-${locale}-${theme}`);
          await page.getByRole("button", { name: copy.signIn, exact: true }).click();
        }
      }
    }
  });
}

test("CR01/02/HB02/04: forced colours retain system boundaries and borderless sidebar navigation", async ({
  page,
}) => {
  await page.emulateMedia({
    forcedColors: "active",
    reducedMotion: "reduce",
    colorScheme: "light",
  });
  await createAccount(page);
  await page.setViewportSize({ width: 320, height: 800 });
  for (const selector of [".theme-button", ".language-select", ".account-summary"]) {
    const control = page.locator(selector);
    await target(control);
    await expect(control).toHaveCSS("border-top-style", "solid");
    expect(
      await control.evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).borderTopWidth),
      ),
    ).toBeGreaterThanOrEqual(1);
  }
  const opener = page.getByRole("button", { name: "Open navigation", exact: true });
  await target(opener);
  await expect(opener).toHaveCSS("border-top-width", "0px");
  await opener.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  expect(await opener.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
  await expect(opener).toHaveCSS("border-top-width", "0px");
  await expect(opener).toHaveCSS("outline-style", "solid");
  expect(
    await opener.evaluate((element) => Number.parseFloat(getComputedStyle(element).outlineWidth)),
  ).toBeGreaterThanOrEqual(3);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Navigation", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  const circles = page.getByRole("button", { name: "Open study circles", exact: true });
  await circles.focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("heading", { name: "Study together", exact: true })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await capture(page, "control-readability-forced-colours-mobile");
});
