import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

// Isolated synthetic HTML only. No app, provider, learner data or source fetch.
const source = await readFile(new URL("reference.html", import.meta.url), "utf8");
const specimens = [
  { name: "plan-desktop-light-en", view: "plan", width: 1280, locale: "en", theme: "light" },
  { name: "plan-mobile-dark-fr", view: "plan", width: 320, locale: "fr", theme: "dark" },
  { name: "study-desktop-dark-en", view: "study", width: 1280, locale: "en", theme: "dark" },
  { name: "study-mobile-light-fr", view: "study", width: 320, locale: "fr", theme: "light" },
  { name: "progress-circle-desktop-light-fr", view: "progress", width: 1280, locale: "fr", theme: "light" },
  { name: "progress-circle-mobile-dark-en", view: "progress", width: 320, locale: "en", theme: "dark" },
];
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function withOrigin(png, description) {
  const data = Buffer.from(`ImageOrigin\0${description}`, "latin1");
  const typeAndData = Buffer.concat([Buffer.from("tEXt"), data]);
  const chunk = Buffer.alloc(12 + data.length);
  chunk.writeUInt32BE(data.length, 0);
  typeAndData.copy(chunk, 4);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + data.length);
  return Buffer.concat([png.subarray(0, -12), chunk, png.subarray(-12)]);
}
const browser = await chromium.launch({ channel: "msedge", headless: true });
const results = [];
try {
  for (const specimen of specimens) {
    const page = await browser.newPage({ viewport: { width: specimen.width, height: 900 }, deviceScaleFactor: 1 });
    const requests = [];
    await page.route("**/*", route => {
      requests.push(route.request().url());
      return route.fulfill({ contentType: "text/html", body: source });
    });
    const pageErrors = [];
    page.on("pageerror", error => pageErrors.push(error.message));
    await page.goto(`http://reference.invalid/?view=${specimen.view}&locale=${specimen.locale}&theme=${specimen.theme}`);
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.evaluate(() => {
      const controls = [...document.querySelectorAll("button,input,select,textarea,summary")].map(element => ({
        label: element.getAttribute("aria-label") || element.textContent.trim() || element.labels?.[0]?.textContent.trim(),
        type: element.getAttribute("type"),
        rect: element.getBoundingClientRect().toJSON(),
      }));
      return {
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
        controls,
        smallTargets: controls.filter(control => control.type !== "checkbox" && (control.rect.width < 44 || control.rect.height < 44)),
        checkboxLabels: [...document.querySelectorAll(".check-label")].map(element => element.getBoundingClientRect().toJSON()),
        unlabeledFields: [...document.querySelectorAll("input,textarea,select")].filter(element => !element.labels?.length && !element.getAttribute("aria-label")).length,
        namesOpenAI: document.body.textContent.includes("OpenAI"),
        hasSupersededPagePromise: /Pages not read|No page content retrieved|Pages non lues|Aucun contenu récupéré/u.test(document.body.textContent),
        stepCitationExamples: document.querySelectorAll(".step-list a[href^='https://developer.mozilla.org/']").length,
        bodyFont: getComputedStyle(document.body).fontSize,
      };
    });
    if (geometry.scroll !== geometry.client || geometry.smallTargets.length || geometry.unlabeledFields || pageErrors.length || requests.length !== 1) {
      throw new Error(`${specimen.name}: reference invariant failed ${JSON.stringify({ geometry, pageErrors, requests })}`);
    }
    for (const label of geometry.checkboxLabels) if (label.height < 44) throw new Error(`${specimen.name}: small consent label`);
    if (!geometry.namesOpenAI || geometry.hasSupersededPagePromise || (specimen.view === "plan" && geometry.stepCitationExamples !== 3)) throw new Error(`${specimen.name}: provider/citation reference mismatch`);
    const enlarged = await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
      const result = { client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth };
      document.documentElement.style.fontSize = "";
      return result;
    });
    if (enlarged.client !== enlarged.scroll) throw new Error(`${specimen.name}: enlarged horizontal overflow`);
    const png = await page.screenshot({ fullPage: true });
    const origin = `Synthetic proposed OpenAI UI reference, updated13October2026. Native installed Edge render of editable reference.html, ${specimen.name}, viewport ${specimen.width}x900, deviceScaleFactor1. Illustrative sources, suggestions and counts; no app server/provider calls or research closure; no human approval.`;
    await writeFile(new URL(`${specimen.name}.png`, import.meta.url), withOrigin(png, origin));
    results.push({ ...specimen, image: { width: png.readUInt32BE(16), height: png.readUInt32BE(20) }, noHorizontalOverflow: true, noHorizontalOverflowAt200PercentRootText: true, allNativeTargetsAtLeast44: true, allFieldsNamed: true, namesOpenAI: true, supersededPagePromiseAbsent: true, stepCitationExamples: geometry.stepCitationExamples, pageErrors, requestCount: requests.length, consentLabelsAtLeast44: geometry.checkboxLabels.length, imageOrigin: origin });
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify({ synthetic: true, recordedAt: new Date().toISOString(), specimens: results }, null, 2));
