import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

// All requests resolve to authored synthetic reference HTML; no app or learner data.
const source = await readFile(new URL("reference.html", import.meta.url), "utf8");
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function origin(png, name) {
  const content = Buffer.from(`ImageOrigin\0Synthetic native HTML/CSS/SVG reference; ${name}; pre-implementation; illustrative records; 11 October 2026.`, "utf8");
  const type = Buffer.from("tEXt");
  const chunk = Buffer.alloc(content.length + 12);
  chunk.writeUInt32BE(content.length); type.copy(chunk, 4); content.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([type, content])), content.length + 8);
  return Buffer.concat([png.subarray(0, 33), chunk, png.subarray(33)]);
}
const browser = await chromium.launch({ channel: "msedge", headless: true });
const results = [];
try {
  for (const view of ["learning", "activity", "circle"]) {
    for (const mobile of [false, true]) {
      const specimen = { name: `${view}-${mobile ? "mobile-dark-fr" : "desktop-light-en"}`, view, width: mobile ? 320 : 1440, height: mobile ? 800 : 1000, locale: mobile ? "fr" : "en", theme: mobile ? "dark" : "light" };
      const page = await browser.newPage({ viewport: { width: specimen.width, height: specimen.height } });
      await page.route("**/*", (route) => route.fulfill({ contentType: "text/html", body: source }));
      await page.goto(`http://reference.invalid/?view=${view}&locale=${specimen.locale}&theme=${specimen.theme}`);
      const geometry = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, study: document.querySelector(".study")?.getBoundingClientRect().toJSON(), checkbox: document.querySelector(".checkbox")?.getBoundingClientRect().toJSON(), history: document.querySelector(".activity")?.getBoundingClientRect().toJSON() }));
      if (geometry.client !== geometry.scroll) throw new Error(`${specimen.name}: overflow`);
      if (geometry.checkbox && geometry.checkbox.height < 44) throw new Error(`${specimen.name}: checkbox target`);
      await writeFile(new URL(`${specimen.name}.png`, import.meta.url), origin(await page.screenshot({ fullPage: true }), specimen.name));
      results.push({ ...specimen, geometry });
      await page.close();
    }
  }
} finally { await browser.close(); }
await writeFile(new URL("reference-results.json", import.meta.url), `${JSON.stringify({ synthetic: true, recordedAt: new Date().toISOString(), specimens: results }, null, 2)}\n`);
console.log(`Rendered ${results.length} precode references, no horizontal overflow, full checkbox targets >=44px.`);
