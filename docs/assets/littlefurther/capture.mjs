// Documentation-only capture harness. Run from repository root after building.
// Uses injected synthetic provider responses, never the provider credential loader.
import { createServer } from 'node:http';
import { randomUUID, createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium, expect } from '@playwright/test';
import { createApp } from '../../../dist/server/app.js';

const root = process.cwd();
const destination = path.join(root, 'docs/assets/littlefurther');
const origin = 'http://127.0.0.1:4320';
const model = 'gpt-5.4-mini-2026-03-17';
const revision = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const sourceUrl = 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Headings_and_paragraphs';
const sourceTitle = 'MDN: Headings and paragraphs';
const requests = [];
await mkdir(path.join(root, '.local/repository-presentation'), { recursive: true });
const dataDirectory = await mkdtemp(path.join(root, '.local/repository-presentation/capture-'));
const app = await createApp({
  origin, dataDirectory, clientDirectory: path.join(root, 'dist/client'),
  ai: { apiKey: 'synthetic-documentation-only', fetch: async (_url, init) => {
    const body = JSON.parse(init.body);
    const schema = body.text?.format?.schema;
    const action = schema?.properties.action.enum[0];
    const locale = schema?.properties.locale.enum[0] ?? 'en';
    requests.push({ action: action ?? 'plan_search', locale, synthetic: true });
    let output;
    if (!schema) {
      const text = 'Synthetic search fixture for documentation captures.';
      output = [
        { type: 'web_search_call', id: 'ws_documentation', status: 'completed', action: { type: 'search', sources: [{ type: 'url', url: sourceUrl }] } },
        { type: 'message', role: 'assistant', status: 'completed', content: [{ type: 'output_text', text, annotations: [{ type: 'url_citation', url: sourceUrl, title: sourceTitle, start_index: 0, end_index: 9 }] }] },
      ];
    } else {
      const context = JSON.parse(body.input.split('Context Pointers: ')[1].split('\nConstraints:')[0]);
      const fr = locale === 'fr';
      const result = action === 'plan_draft' ? {
        kind: 'plan', goal: fr ? 'Créer ma première page web' : 'Build my first web page',
        outcome: fr ? 'Une petite page que je peux expliquer' : 'A small page I can explain',
        prerequisites: fr ? 'Un navigateur et un éditeur de texte' : 'A browser and a text editor',
        steps: [
          { title: fr ? 'Écrire un titre descriptif' : 'Write a descriptive heading', estimatedMinutes: 5, sourceIds: [context.sources[0].id] },
          { title: fr ? 'Ajouter un court paragraphe' : 'Add a short paragraph', estimatedMinutes: 10, sourceIds: [context.sources[0].id] },
          { title: fr ? 'Relire la page et expliquer sa structure' : 'Review the page and explain its structure', estimatedMinutes: 10, sourceIds: [context.sources[0].id] },
        ],
      } : action === 'circle_draft' ? {
        kind: 'circle', text: fr ? 'Je vais relire un paragraphe pendant cinq minutes cette semaine.' : 'I will review one paragraph for five minutes this week.',
      } : {
        kind: 'guidance', title: fr ? 'Une prochaine étape possible' : 'One possible next step',
        summary: fr ? 'Vos efforts précédents restent enregistrés.' : 'Your earlier effort remains recorded.',
        nextAction: fr ? 'Relisez un paragraphe, puis notez une idée.' : 'Review one paragraph, then note one idea.',
        microActions: [fr ? 'Ouvrir vos notes' : 'Open your notes', fr ? 'Relire un paragraphe' : 'Review one paragraph'],
      };
      output = [{ type: 'message', role: 'assistant', status: 'completed', content: [{ type: 'output_text', text: JSON.stringify({ action, locale, result }), annotations: [] }] }];
    }
    return Response.json({ model, store: false, status: 'completed', error: null, output });
  } },
});
const server = createServer(app.app);
await new Promise(resolve => server.listen(4320, '127.0.0.1', resolve));
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-gpu'] });
const captures = [];
let blockedExternalRequests = 0;
const context = await browser.newContext({ viewport: { width: 1280, height: 960 } });
await context.route('**/*', route => {
  const url = new URL(route.request().url());
  if (url.origin === origin) return route.continue();
  blockedExternalRequests++;
  return route.abort();
});
const page = await context.newPage();
page.setDefaultTimeout(12000);
async function shot(name, selector, note) {
  await page.locator('body').click({ position: { x: 1, y: 1 } });
  // Await font/layout paint and the app's short control/theme transitions.
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  await page.waitForTimeout(200);
  const widths = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  if (widths.document > widths.viewport + 1 || widths.body > widths.viewport + 1) throw new Error(`overflow:${name}`);
  const file = path.join(destination, `${name}.png`);
  if (selector) await page.locator(selector).screenshot({ path: file, animations: 'disabled' });
  else await page.screenshot({ path: file, fullPage: true, animations: 'disabled' });
  const bytes = await readFile(file);
  captures.push({ file: `${name}.png`, width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), viewport: widths.viewport, sourceRevision: revision, classification: 'actual application interface; synthetic demo data; mocked AI/search responses', note, sha256: createHash('sha256').update(bytes).digest('hex') });
  console.log(`captured ${name}`);
}
async function getPlan() {
  const plans = await (await page.request.get(`${origin}/api/plans`)).json();
  return (await (await page.request.get(`${origin}/api/plans/${plans.plans[0].id}`)).json());
}
async function account(target, name) {
  await target.goto(origin);
  await target.getByRole('button', { name: 'New here? Create an account', exact: true }).click();
  await target.getByLabel('Display name', { exact: true }).fill(name);
  await target.getByLabel('Email address', { exact: true }).fill(`documentation-${randomUUID()}@example.test`);
  await target.getByLabel('Password', { exact: true }).fill(`Synthetic-${randomUUID()}`);
  await target.getByRole('button', { name: 'Create an account', exact: true }).click();
  await target.getByLabel('Timezone', { exact: true }).fill('Africa/Lagos');
  await target.getByRole('button', { name: 'Save preferences and continue', exact: true }).click();
  await expect(target.getByRole('button', { name: 'Create a learning plan', exact: true })).toBeVisible();
}
try {
  await account(page, 'Demo learner');
  await page.getByRole('button', { name: 'Create a learning plan', exact: true }).click();
  await page.getByLabel('Learning goal', { exact: true }).fill('Build my first web page');
  await page.getByLabel('Dates you are available', { exact: true }).fill('2026-10-13, 2026-10-15, 2026-10-17');
  await page.getByLabel('What you already know (optional)', { exact: true }).fill('I can use a browser and a text editor.');
  await page.getByRole('button', { name: 'Draft my plan with AI', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Use this draft for review', exact: true })).toBeVisible();
  await shot('planning', '.ai-assistance', 'Focused plan suggestion with one mocked MDN source and three reviewable steps; not yet saved.');
  await page.getByRole('button', { name: 'Use this draft for review', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm and save plan', exact: true }).click();
  await expect(page.getByText('0 of 3 steps complete', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Start study session', exact: true }).click();
  await page.getByLabel('Private reflection (optional)', { exact: true }).fill('A descriptive heading makes the purpose of my page clearer.');
  await page.getByLabel('Include this reflection draft in study help', { exact: true }).check();
  await page.getByRole('button', { name: 'Help me study and reflect', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Use this suggestion in my reflection', exact: true })).toBeVisible();
  await shot('study', '.study-form', 'Focused study/reflection form; mocked guidance and explicit Save, with completion a separate action.');
  await page.getByRole('button', { name: 'Save study session', exact: true }).click();
  await expect(page.getByText('Your study session is saved.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Mark this step complete', exact: true }).click();
  await expect(page.getByText('Step completed. Your earlier effort is still recorded.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Choose the next action', exact: true }).click();
  await expect(page.getByText('1 of 3 steps complete', { exact: true })).toBeVisible();
  await shot('dashboard-light', null, 'Dashboard after separately saving one study session and completing the first step.');
  await page.getByRole('button', { name: 'Switch to dark mode', exact: true }).click();
  // Reload the saved view in its persisted theme to avoid transient Edge compositor text loss.
  await page.reload();
  await expect(page.getByRole('button', { name: 'Start study session', exact: true })).toBeVisible();
  await shot('dashboard-dark', null, 'Same saved dashboard in dark mode; no data difference.');
  await page.getByRole('button', { name: 'Switch to light mode', exact: true }).click();
  await page.getByRole('button', { name: 'Review restart dates', exact: true }).click();
  await page.getByRole('button', { name: 'Help me restart', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'One possible next step', exact: true })).toBeVisible();
  await shot('comeback', 'main', 'Restart guidance and date controls; no date confirmation performed.');
  await page.getByRole('button', { name: 'Back to my learning', exact: true }).click();
  await page.getByRole('button', { name: 'Open study circles', exact: true }).click();
  await page.getByLabel('Circle name', { exact: true }).fill('Small steps together');
  await page.getByRole('button', { name: 'Create a circle', exact: true }).click();
  const circles = await (await page.request.get(`${origin}/api/circles`)).json();
  const circleId = circles.circles[0].id;
  const invite = await (await page.request.post(`${origin}/api/circles/${circleId}/invites`, { headers: { Origin: origin }, data: { requestId: randomUUID() } })).json();
  // Separate local account; respect auth rate limit without weakening production auth.
  await new Promise(resolve => setTimeout(resolve, 10100));
  const peerContext = await browser.newContext({ viewport: { width: 1280, height: 960 } });
  const peer = await peerContext.newPage();
  await account(peer, 'Demo peer');
  const joined = await peer.request.post(`${origin}/api/circle-invites/redeem`, { headers: { Origin: origin }, data: { requestId: randomUUID(), token: invite.token } });
  if (!joined.ok()) throw new Error(`join:${joined.status()}:${await joined.text()}`);
  await page.reload();
  await page.getByRole('button', { name: 'Open study circles', exact: true }).click();
  await page.getByRole('button', { name: 'Open circle', exact: true }).click();
  await page.getByRole('button', { name: 'Write a shared copy', exact: true }).click();
  await page.getByLabel('Message', { exact: true }).fill('I want to return to my page this week.');
  await page.getByRole('button', { name: 'Help me phrase this', exact: true }).click();
  await page.getByRole('button', { name: 'Use this wording', exact: true }).click();
  await page.getByRole('button', { name: 'Preview copy', exact: true }).click();
  await page.getByRole('button', { name: 'Share commitment', exact: true }).click();
  await expect(page.locator('.circle-item .circle-message')).toHaveText('I will review one paragraph for five minutes this week.');
  const detail = await (await peer.request.get(`${origin}/api/circles/${circleId}`)).json();
  const encouragement = await peer.request.post(`${origin}/api/circles/${circleId}/items/${detail.items[0].id}/encouragement`, { headers: { Origin: origin }, data: { requestId: randomUUID(), preset: 'small_steps_count' } });
  if (!encouragement.ok()) throw new Error(`encouragement:${encouragement.status()}`);
  await page.getByRole('button', { name: 'Refresh circle information', exact: true }).click();
  await shot('circle', 'main', 'Two synthetic local members, explicitly shared commitment and preset encouragement; no remote-peer claim.');
  await peerContext.close();
  await page.getByRole('link', { name: 'My learning', exact: true }).click();
  await page.setViewportSize({ width: 320, height: 720 });
  await page.getByLabel('Language', { exact: true }).selectOption('fr');
  await expect(page.getByText('1 étape terminée sur 3', { exact: true })).toBeVisible();
  await shot('journey-mobile-fr', null, 'Successful saved French 320px dashboard; learner-authored step titles remain English.');
  await page.setViewportSize({ width: 1280, height: 960 });
  await page.getByLabel('Langue', { exact: true }).selectOption('en');
  let plan = await getPlan();
  for (const step of plan.plan.steps.filter(step => !step.completedAt)) {
    const response = await page.request.post(`${origin}/api/plans/${plan.plan.id}/completions`, { headers: { Origin: origin }, data: { requestId: randomUUID(), revision: plan.plan.revision, stepId: step.id } });
    if (!response.ok()) throw new Error(`completion:${response.status()}`);
    plan = await getPlan();
  }
  await page.reload();
  await expect(page.getByText('3 of 3 steps complete', { exact: true })).toBeVisible();
  await shot('finishline', null, 'All active steps marked complete by the synthetic learner; self-reported completion, not a certificate or mastery assessment.');
  await writeFile(path.join(destination, 'capture-receipt.json'), JSON.stringify({ capturedAt: new Date().toISOString(), sourceRevision: revision, productRevision: '98372ac41150dc50ad66dc08ecde289794aa3169', browser: 'Microsoft Edge via Playwright 1.63.0', data: 'fresh ignored .local/repository-presentation/capture-* SQLite directory', ordinaryDataAccessed: false, providerCredentialLoaded: false, liveProviderRequests: 0, blockedBrowserExternalRequests: blockedExternalRequests, syntheticProviderRequests: requests, captures }, null, 2) + '\n');
  console.log(JSON.stringify({ success: true, captures: captures.length, liveProviderRequests: 0, syntheticProviderRequests: requests.length }));
} catch (error) {
  console.error(error);
  console.error((await page.locator('body').innerText()).slice(0, 18000));
  process.exitCode = 1;
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
  await app.close();
}
