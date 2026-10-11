import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

// Synthetic, self-contained reference: no app server, network or learner data.
const source = await readFile(new URL("reference.html", import.meta.url), "utf8");
const browser = await chromium.launch({ channel: "msedge", headless: true });
const results = [];
try {
  for (const specimen of [
    { name: "desktop-light", width: 1440, height: 1060, locale: "en", theme: "light", view: "learning" },
    { name: "desktop-dark", width: 1440, height: 1060, locale: "en", theme: "dark", view: "learning" },
    { name: "mobile-light", width: 320, height: 900, locale: "fr", theme: "light", view: "learning" },
    { name: "mobile-dark", width: 320, height: 900, locale: "fr", theme: "dark", view: "learning" },
    { name: "mobile-auth-light", width: 320, height: 900, locale: "fr", theme: "light", view: "auth" },
    { name: "mobile-auth-dark", width: 320, height: 900, locale: "fr", theme: "dark", view: "auth" },
  ]) {
    const page = await browser.newPage({ viewport: { width: specimen.width, height: specimen.height }, deviceScaleFactor: 1 });
    const url = `http://reference.invalid/?locale=${specimen.locale}&theme=${specimen.theme}&view=${specimen.view}`;
    await page.route("**/*", route => route.fulfill({ contentType: "text/html", body: source }));
    await page.goto(url);
    await page.screenshot({ path: fileURLToPath(new URL(`${specimen.name}.png`, import.meta.url)), fullPage: true });
    const geometry = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
      account: document.querySelector(".account-summary")?.getBoundingClientRect().toJSON(),
      welcome: document.querySelector(".auth-intro")?.getBoundingClientRect().toJSON(),
      heading: document.querySelector(".auth-intro h1") && getComputedStyle(document.querySelector(".auth-intro h1")).fontSize,
      secondary: [...document.querySelectorAll(".button:not(.primary):not(:disabled)")].map(button => ({
        text: button.textContent, border: getComputedStyle(button).borderColor,
        background: getComputedStyle(button).backgroundColor,
      })),
    }));
    if (geometry.client !== geometry.scroll) throw new Error(`${specimen.name}: horizontal overflow`);
    if (geometry.account && (geometry.account.width < 44 || geometry.account.height < 44)) throw new Error(`${specimen.name}: small account target`);
    results.push({ ...specimen, geometry });
    await page.close();
  }
} finally {
  await browser.close();
}
await writeFile(new URL("reference-results.json", import.meta.url), `${JSON.stringify({ synthetic: true, recordedAt: new Date().toISOString(), specimens: results }, null, 2)}\n`);
console.log(`Rendered ${results.length} synthetic references; no horizontal overflow; all present account targets >=44x44.`);
