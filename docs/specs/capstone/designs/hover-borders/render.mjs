import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

// Synthetic local HTML only: this is not app verification or learner evidence.
const source = await readFile(new URL("reference.html", import.meta.url), "utf8");
const specimens = [
  { name: "desktop-light-en", width: 1280, height: 900, locale: "en", theme: "light" },
  { name: "desktop-dark-en", width: 1280, height: 900, locale: "en", theme: "dark" },
  { name: "mobile-light-fr", width: 320, height: 900, locale: "fr", theme: "light" },
  { name: "mobile-dark-fr", width: 320, height: 900, locale: "fr", theme: "dark" },
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
  // IEND is the final 12-byte PNG chunk. Pixel payload is unchanged.
  return Buffer.concat([png.subarray(0, -12), chunk, png.subarray(-12)]);
}
const browser = await chromium.launch({ channel: "msedge", headless: true });
const results = [];
try {
  for (const specimen of specimens) {
    const page = await browser.newPage({ viewport: { width: specimen.width, height: specimen.height }, deviceScaleFactor: 1 });
    await page.route("**/*", route => route.fulfill({ contentType: "text/html", body: source }));
    await page.goto(`http://reference.invalid/?locale=${specimen.locale}&theme=${specimen.theme}`);
    await page.evaluate(() => document.fonts.ready);
    const imagePath = new URL(`${specimen.name}.png`, import.meta.url);
    const png = await page.screenshot({ fullPage: true });
    const description = `Synthetic: native installed Edge rendering of editable reference.html; no app server or learner data. ${specimen.name}; viewport ${specimen.width}x${specimen.height}; deviceScaleFactor 1. Illustrative state classes; no formal approval.`;
    await writeFile(imagePath, withOrigin(png, description));
    const geometry = await page.evaluate(() => {
      const describe = element => ({
        text: element.getAttribute("aria-label") || element.textContent.trim(),
        rect: element.getBoundingClientRect().toJSON(),
        border: getComputedStyle(element).borderColor,
        borderWidth: getComputedStyle(element).borderWidth,
        background: getComputedStyle(element).backgroundColor,
      });
      return {
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
        fullHeight: document.documentElement.scrollHeight,
        brandColour: getComputedStyle(document.querySelector(".brand-mark")).color,
        header: [...document.querySelectorAll(".app-header button,.app-header select,.app-header summary")].map(describe),
        stateSamples: [...document.querySelectorAll(".state-specimen button")].map(describe),
        exceptions: [...document.querySelectorAll(".exception-board button,.exception-board input,.exception-board summary")].map(describe),
      };
    });
    if (geometry.client !== geometry.scroll) throw new Error(`${specimen.name}: horizontal overflow`);
    for (const control of [...geometry.header, ...geometry.stateSamples]) {
      if (control.rect.width < 44 || control.rect.height < 44) throw new Error(`${specimen.name}: small target ${control.text}`);
    }
    const subject = page.locator("#test-subject");
    await subject.scrollIntoViewIfNeeded();
    const before = await subject.boundingBox();
    await subject.hover();
    await page.waitForTimeout(180);
    const hovered = await subject.evaluate(element => ({ rect: element.getBoundingClientRect().toJSON(), border: getComputedStyle(element).borderColor }));
    await page.mouse.move(0, 0);
    await page.waitForTimeout(180);
    const rested = await subject.evaluate(element => ({ rect: element.getBoundingClientRect().toJSON(), border: getComputedStyle(element).borderColor }));
    if (hovered.border !== geometry.brandColour || rested.border !== "rgba(0, 0, 0, 0)") throw new Error(`${specimen.name}: border endpoint mismatch`);
    for (const key of ["x", "y", "width", "height"]) {
      if (before[key] !== hovered.rect[key] || before[key] !== rested.rect[key]) throw new Error(`${specimen.name}: ${key} changed across hover`);
    }
    results.push({ ...specimen, nativeImage: { width: png.readUInt32BE(16), height: png.readUInt32BE(20) }, imageOrigin: description, geometry, measuredInteraction: { before, hovered, rested, transitionWaitMs: 180, noGeometryShift: true } });
    await page.close();
  }
} finally {
  await browser.close();
}
await writeFile(new URL("reference-results.json", import.meta.url), `${JSON.stringify({ synthetic: true, recordedAt: new Date().toISOString(), specimens: results }, null, 2)}\n`);
console.log(`Rendered ${results.length} synthetic references; all targets >=44x44; no horizontal overflow or measured hover shift.`);
