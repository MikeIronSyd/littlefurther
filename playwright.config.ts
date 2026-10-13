import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  outputDir: ".local/playwright-results",
  reporter: [["list"], ["html", { outputFolder: ".local/playwright-report", open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4318",
    browserName: "chromium",
    channel: "msedge",
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "pnpm run build && pnpm start",
    url: "http://127.0.0.1:4318/api/health",
    timeout: 120_000,
    reuseExistingServer: false,
    env: { CAPSTONE_PORT: "4318", CAPSTONE_DATA_DIR: ".local/e2e-data", CAPSTONE_AI_DISABLED: "1" },
  },
});
