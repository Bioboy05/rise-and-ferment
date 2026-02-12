import { chromium } from "playwright";

const BASE_URL = process.env.SMOKE_BASE_URL || "http://127.0.0.1:4173";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function waitForSplashToHide(page) {
  await page.waitForSelector(".splash-screen", { timeout: 15000 });
  await page.waitForFunction(
    () => document.querySelector(".splash-screen")?.classList.contains("hidden"),
    { timeout: 15000 }
  );
}

async function ensureOnboardingComplete(page) {
  const onboardingVisible = await page.locator(".onboarding").isVisible().catch(() => false);
  if (!onboardingVisible) return;

  await page.locator("#onboard-step1 .option-card").first().click();
  await page.waitForSelector("#onboard-step-shopping", { timeout: 10000 });
  await page.locator("#onboard-step-shopping .btn.btn-primary").first().click();
  await page.waitForSelector("#onboard-step-name", { timeout: 10000 });
  await page.locator("#onboard-step-name input").fill("Smoke");
  await page.locator("#onboard-step-name .btn.btn-primary").click();
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    acceptDownloads: true,
  });
  const page = await context.newPage();
  const checks = [];

  try {
    await page.goto(`${BASE_URL}/app`, { waitUntil: "domcontentloaded" });
    await waitForSplashToHide(page);
    assert((await page.locator(".splash-logo-jar svg").count()) > 0, "Splash jar icon missing");
    checks.push("splash");

    const glassPreset = await page.evaluate(() => document.documentElement.getAttribute("data-glass"));
    assert(glassPreset === "subtle", `Expected default glass preset subtle, got '${glassPreset}'`);
    checks.push("default-glass-subtle");

    await ensureOnboardingComplete(page);
    await page.waitForSelector(".main-card", { timeout: 15000 });
    assert((await page.locator(".ambient-photo").count()) === 0, "Unexpected ambient photo layer present");
    checks.push("home-loaded");

    const dotCount = await page.locator(".day-dots .day-dot").count();
    assert(dotCount === 14, `Expected 14 preview dots, got ${dotCount}`);
    checks.push("day-preview-14");

    await page.evaluate(() => {
      const key = "riseFermentStarters";
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const state = parsed?.state || parsed;
      if (!Array.isArray(state?.starters)) return;
      state.starters = state.starters.map((starter) => ({
        ...starter,
        isNewStarter: true,
        currentDay: Math.max(3, Number(starter.currentDay) || 1),
        previewingDay: null,
        todayCompleted: false,
        lastCompletedDate: null,
      }));
      localStorage.setItem(key, JSON.stringify(parsed?.state ? { ...parsed, state } : state));
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForSplashToHide(page);

    const dayValueText = await page.locator(".day-number").first().innerText();
    const dayValue = Number.parseInt(dayValueText, 10);
    assert(Number.isFinite(dayValue) && dayValue >= 3, `Expected day >= 3 for troubleshooting (day=${dayValueText})`);
    checks.push("day-advance");

    const troubleBtn = page.locator(".secondary-btn").first();
    assert((await troubleBtn.count()) > 0, "Troubleshooting button not available on day >= 3");
    await troubleBtn.click();
    await page.waitForSelector(".modal-overlay.show", { timeout: 10000 });
    const overflowWhenOpen = await page.evaluate(() => document.body.style.overflow);
    assert(overflowWhenOpen === "hidden", `Body overflow should be hidden in modal, got '${overflowWhenOpen}'`);
    await page.locator(".close-btn").first().click();
    await page.waitForSelector(".modal-overlay.show", { state: "detached", timeout: 10000 });
    const overflowWhenClosed = await page.evaluate(() => document.body.style.overflow);
    assert(overflowWhenClosed === "", `Body overflow should be restored after modal close, got '${overflowWhenClosed}'`);
    checks.push("modal-scroll-lock");

    await page.locator('a[href$="/planner"]').first().click();
    await page.waitForSelector(".planner-card", { timeout: 10000 });
    const scheduleRows = await page.locator(".schedule-step").count();
    assert(scheduleRows >= 5, `Planner schedule too short (${scheduleRows})`);
    const addToCalendarBtn = page.locator("#schedule-card .btn.btn-secondary").first();
    const [download] = await Promise.all([page.waitForEvent("download"), addToCalendarBtn.click()]);
    const fileName = download.suggestedFilename();
    assert(fileName.endsWith(".ics"), `Expected ICS download, got '${fileName}'`);
    checks.push("planner-export");

    await page.locator(".nav-item").first().click();
    await page.waitForSelector(".header .icon-btn", { timeout: 10000 });
    await page.locator(".header .icon-btn").first().click();
    await page.waitForSelector(".settings-section", { timeout: 10000 });
    const glassSelect = page.locator("select.settings-select", {
      has: page.locator('option[value="subtle"]'),
    });
    assert((await glassSelect.count()) > 0, "Glass preset selector missing in settings");
    const selectedGlass = await glassSelect.first().inputValue();
    assert(selectedGlass === "subtle", `Glass preset in settings should default to subtle, got '${selectedGlass}'`);
    checks.push("settings-glass");

    const scrollCheck = await page.evaluate(() => {
      const container = document.querySelector(".app-container");
      if (!container) return { found: false };
      const before = container.scrollTop;
      container.scrollTop = before + 320;
      return {
        found: true,
        before,
        after: container.scrollTop,
        scrollHeight: container.scrollHeight,
        clientHeight: container.clientHeight,
      };
    });
    assert(scrollCheck.found, "App container not found for scroll check");
    assert(
      scrollCheck.after > scrollCheck.before || scrollCheck.scrollHeight <= scrollCheck.clientHeight,
      `Scroll did not move (before=${scrollCheck.before}, after=${scrollCheck.after}, scrollHeight=${scrollCheck.scrollHeight}, clientHeight=${scrollCheck.clientHeight})`
    );
    checks.push("scroll");

    const appHtmlPage = await context.newPage();
    await appHtmlPage.goto(`${BASE_URL}/app.html`, { waitUntil: "domcontentloaded" });
    await appHtmlPage.waitForTimeout(1200);
    const appHtmlRootLength = await appHtmlPage.evaluate(
      () => document.getElementById("root")?.innerHTML.length || 0
    );
    assert(appHtmlRootLength > 0, "Route /app.html rendered empty root");
    await appHtmlPage.close();
    checks.push("app-html-route");

    console.log(`SMOKE PASS (${checks.length} checks): ${checks.join(", ")}`);
  } finally {
    await context.close();
    await browser.close();
  }
}

run().catch((error) => {
  console.error("SMOKE FAIL:", error?.stack || error?.message || error);
  process.exitCode = 1;
});
