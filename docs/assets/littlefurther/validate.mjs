// Focused documentation/asset validation; no application or external-provider calls.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { chromium } from '@playwright/test';
const root = process.cwd();
const files = [
  'README.md', 'PRODUCT.md', 'docs/README.md', 'docs/ARCHITECTURE.md', 'docs/DEVELOPMENT.md',
  'docs/operations/local-demo.md', 'docs/assets/littlefurther/provenance.md',
  'docs/specs/capstone/increments/repository-presentation.md',
  'docs/specs/capstone/increments/repository-presentation-verification.md',
];
const issues = [];
let checkedLinks = 0;
const slug = value => value.replace(/<[^>]+>/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*`_]/g, '').toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/ /g, '-');
for (const file of files) {
  const text = await fs.readFile(file, 'utf8');
  for (const block of text.matchAll(/```mermaid\s*\n([\s\S]*?)```/g)) {
    if (block[1].trimStart().startsWith('sequenceDiagram')) {
      for (const line of block[1].split('\n')) {
        if (/[-=]>>?.*:.*;/.test(line)) issues.push(`${file}: unescaped sequence message semicolon`);
      }
    }
  }
  const withoutFences = text.replace(/```[\s\S]*?```/g, '');
  const links = [...withoutFences.matchAll(/!?(?:\[[^\]]*\])\(([^\s)]+)\)/g)].map(m => m[1]);
  links.push(...[...withoutFences.matchAll(/(?:src|srcset|href)="([^"]+)"/g)].map(m => m[1]));
  for (const link of links) {
    if (/^(?:https?:|mailto:)/.test(link)) continue;
    checkedLinks++;
    const [relative, anchor] = link.split('#');
    const target = relative ? path.resolve(path.dirname(file), decodeURIComponent(relative)) : path.resolve(file);
    try {
      await fs.access(target);
      if (anchor && /\.md$/i.test(target)) {
        const content = await fs.readFile(target, 'utf8');
        const headings = [...content.matchAll(/^#{1,6}\s+(.+)$/gm)].map(m => slug(m[1].trim()));
        if (!headings.includes(decodeURIComponent(anchor))) issues.push(`${file}: absent anchor ${link}`);
      }
    } catch { issues.push(`${file}: absent path ${link}`); }
  }
}
const readme = await fs.readFile('README.md', 'utf8');
const prose = readme.replace(/```[\s\S]*?```/g, '').replace(/<[^>]+>/g, '').split(/\r?\n/).filter(line => !line.startsWith('*Actual') && !line.startsWith('![')).join('\n');
const words = prose.split(/\s+/).filter(Boolean).length;
if (words < 600 || words > 900) issues.push(`README word count:${words}`);
const receipt = JSON.parse(await fs.readFile('docs/assets/littlefurther/capture-receipt.json', 'utf8'));
for (const item of receipt.captures) {
  const bytes = await fs.readFile(`docs/assets/littlefurther/${item.file}`);
  if (bytes.readUInt32BE(16) !== item.width || bytes.readUInt32BE(20) !== item.height) issues.push(`dimensions:${item.file}`);
  if (createHash('sha256').update(bytes).digest('hex') !== item.sha256) issues.push(`hash:${item.file}`);
}
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage();
const brandChecks = [];
for (const variant of ['light', 'dark']) {
  const svg = await fs.readFile(`docs/assets/littlefurther/brand-${variant}.svg`, 'utf8');
  await page.setContent(`<div style="background:${variant === 'light' ? '#ffffff' : '#0d1117'};padding:20px">${svg}</div>`);
  const check = await page.evaluate(() => {
    const svg = document.querySelector('svg');
    const text = svg.querySelector('text');
    const b = text.getBBox();
    return { title: svg.querySelector('title').textContent, path: svg.querySelector('path').getAttribute('d'), textFits: b.x >= 0 && b.x + b.width <= svg.viewBox.baseVal.width, textBounds: { x: b.x, width: b.width }, parserErrors: new DOMParser().parseFromString(svg.outerHTML, 'image/svg+xml').querySelectorAll('parsererror').length };
  });
  if (check.parserErrors || !check.textFits || check.path !== 'M5 7V25H17V7H27M17 15H25' || check.title !== 'LittleFurther') issues.push(`brand:${variant}`);
  brandChecks.push({ variant, ...check });
}
await browser.close();
const result = { checkedAt: new Date().toISOString(), files: files.length, relativeLinks: checkedLinks, readmeWordsExcludingCommandsCaptions: words, captures: receipt.captures.length, brandChecks, issues, scope: 'documentation/assets only; no new full application suite' };
await fs.writeFile('.local/repository-presentation/validation.json', JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
if (issues.length) process.exitCode = 1;
