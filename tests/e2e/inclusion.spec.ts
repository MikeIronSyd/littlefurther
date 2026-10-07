import { writeFile } from "node:fs/promises";
import { expect, type Locator, test } from "@playwright/test";
import { capture, createAccount, expectNoHorizontalOverflow, saveManualPlan } from "./helpers.js";

async function contrastOf(
  locator: Locator,
  property: "color" | "borderTopColor" | "outlineColor" = "color",
): Promise<{ ratio: number; minimum: number; foreground: string; background: string }> {
  return locator.evaluate((element, colourProperty) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable for computed CSS colour conversion");
    const colour = (value: string): number[] => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      const data = context.getImageData(0, 0, 1, 1).data;
      return [data[0] ?? 0, data[1] ?? 0, data[2] ?? 0, (data[3] ?? 0) / 255];
    };
    const composite = (top: number[], bottom: number[]): number[] => {
      const alpha = top[3] ?? 1;
      return [0, 1, 2]
        .map((index) => (top[index] ?? 0) * alpha + (bottom[index] ?? 0) * (1 - alpha))
        .concat(1);
    };
    const ancestors: Element[] = [];
    let current: Element | null = element;
    while (current) {
      ancestors.unshift(current);
      current = current.parentElement;
    }
    let background = [255, 255, 255, 1];
    for (const ancestor of ancestors)
      background = composite(colour(getComputedStyle(ancestor).backgroundColor), background);
    const style = getComputedStyle(element);
    const foreground = composite(colour(style[colourProperty]), background);
    const luminance = (rgb: number[]): number => {
      const linear = rgb.slice(0, 3).map((value) => {
        const scaled = value / 255;
        return scaled <= 0.04045 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
      });
      return (linear[0] ?? 0) * 0.2126 + (linear[1] ?? 0) * 0.7152 + (linear[2] ?? 0) * 0.0722;
    };
    const l1 = luminance(foreground);
    const l2 = luminance(background);
    const large =
      Number.parseFloat(style.fontSize) >= 24 ||
      (Number.parseFloat(style.fontSize) >= 18.66 && Number.parseInt(style.fontWeight, 10) >= 700);
    return {
      ratio: (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05),
      minimum: colourProperty !== "color" || large ? 3 : 4.5,
      foreground: style[colourProperty],
      background: background.join(","),
    };
  }, property);
}

for (const theme of ["light", "dark"] as const) {
  test(`AC11f: sampled workspace text meets contrast requirements in ${theme} mode`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ colorScheme: theme });
    await createAccount(page);
    await saveManualPlan(page);
    const samples = [
      { label: "main heading", locator: page.locator("main h1").first() },
      {
        label: "current progress",
        locator: page.getByText("0 of 2 steps complete", { exact: true }),
      },
      {
        label: "self-report explanation",
        locator: page.getByText("Completion is self-reported work, not a measure of mastery.", {
          exact: true,
        }),
      },
      {
        label: "primary study action",
        locator: page.getByRole("button", { name: "Start study session", exact: true }),
      },
    ];
    const measurements = [];
    for (const sample of samples) {
      const measurement = { label: sample.label, ...(await contrastOf(sample.locator)) };
      measurements.push(measurement);
      expect
        .soft(measurement.ratio, `${sample.label}: ${measurement.ratio.toFixed(2)}:1`)
        .toBeGreaterThanOrEqual(measurement.minimum);
    }
    await capture(page, `workspace-${theme}`);
    await page.getByRole("button", { name: "Edit plan", exact: true }).click();
    const goal = page.getByLabel("Learning goal", { exact: true });
    const border = { label: "goal input border", ...(await contrastOf(goal, "borderTopColor")) };
    measurements.push(border);
    expect
      .soft(border.ratio, `Input border: ${border.ratio.toFixed(2)}:1`)
      .toBeGreaterThanOrEqual(3);
    await goal.focus();
    const outline = {
      label: "goal input focus outline",
      ...(await contrastOf(goal, "outlineColor")),
    };
    measurements.push(outline);
    expect
      .soft(outline.ratio, `Focus outline: ${outline.ratio.toFixed(2)}:1`)
      .toBeGreaterThanOrEqual(3);
    expect(
      await goal.evaluate((element) => Number.parseFloat(getComputedStyle(element).outlineWidth)),
    ).toBeGreaterThanOrEqual(2);
    await testInfo.attach(`contrast-${theme}`, {
      body: JSON.stringify(measurements, null, 2),
      contentType: "application/json",
    });
    await writeFile(
      `.local/e2e-captures/contrast-${theme}.json`,
      JSON.stringify(measurements, null, 2),
    );
  });
}

test("AC11: French mobile journey supports saving study and explicit completion", async ({
  page,
}) => {
  await createAccount(page);
  await page.setViewportSize({ width: 320, height: 720 });
  await page.getByLabel("Language", { exact: true }).selectOption("fr");
  await expect(page.getByRole("combobox", { name: "Langue", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Créer un parcours", exact: true }).click();
  await page.getByLabel("Objectif d’apprentissage", { exact: true }).fill("Comprendre mes notes");
  await page
    .getByLabel("Vos sujets ou sections", { exact: true })
    .fill("Lire les notes\nRédiger une explication");
  await page.getByLabel("Vos dates disponibles", { exact: true }).fill("2026-10-08, 2026-10-10");
  await page.getByRole("button", { name: "Vérifier les étapes proposées", exact: true }).click();
  await expectNoHorizontalOverflow(page);
  await page.getByRole("button", { name: "Confirmer et enregistrer", exact: true }).click();
  await expect(page.getByText("0 étapes terminées sur 2", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Commencer une séance", exact: true }).click();
  await page.getByLabel("Minutes étudiées", { exact: true }).fill("7");
  await page
    .getByLabel("Note privée (facultative)", { exact: true })
    .fill("Je peux reprendre ici.");
  await page.getByRole("button", { name: "Enregistrer la séance", exact: true }).click();
  await expect(
    page.getByText("Votre séance d’étude est enregistrée.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Marquer cette étape comme terminée", exact: true })
    .click();
  await expect(
    page.getByText("Étape terminée. Vos efforts précédents restent enregistrés.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Choisir la prochaine action", exact: true }).click();
  await expect(page.getByText("1 étape terminée sur 2", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByText("1 étape terminée sur 2", { exact: true })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  const primaryAction = await page
    .getByRole("button", { name: "Commencer une séance", exact: true })
    .boundingBox();
  const progress = await page.getByText("1 étape terminée sur 2", { exact: true }).boundingBox();
  const returnSupport = await page
    .getByRole("heading", { name: "Votre travail terminé est conservé.", exact: true })
    .boundingBox();
  const path = await page.getByRole("heading", { name: "Votre chemin", exact: true }).boundingBox();
  expect(primaryAction).not.toBeNull();
  expect(progress).not.toBeNull();
  expect(returnSupport).not.toBeNull();
  expect(path).not.toBeNull();
  expect(
    (primaryAction?.y ?? Number.POSITIVE_INFINITY) + (primaryAction?.height ?? 0),
    "Primary study action fits the initial320x720 viewport",
  ).toBeLessThanOrEqual(720);
  expect(
    primaryAction?.y ?? Number.POSITIVE_INFINITY,
    "Study action precedes the progress display",
  ).toBeLessThan(progress?.y ?? 0);
  expect(
    returnSupport?.y ?? Number.POSITIVE_INFINITY,
    "Return support precedes the full path on mobile",
  ).toBeLessThan(path?.y ?? 0);
  await capture(page, "workspace-mobile-fr");
});

test("AC11f: forced colours and reduced motion preserve keyboard-operated navigation", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await createAccount(page);
  await page.setViewportSize({ width: 320, height: 720 });
  const opener = page.getByRole("button", { name: "Open navigation", exact: true });
  await opener.focus();
  await page.keyboard.press("Enter");
  const drawer = page.getByRole("dialog", { name: "Navigation", exact: true });
  await expect(drawer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  await page.getByRole("button", { name: "Dark mode", exact: true }).click();
  await expect(page.getByRole("button", { name: "Dark mode", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expectNoHorizontalOverflow(page);
});
