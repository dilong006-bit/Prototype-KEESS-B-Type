const { chromium } = require('playwright');
const path = require('path');
const OURS = 'http://localhost:3000/';
const ORIG = 'file:///' + path.resolve('c:/오피스키퍼 예외/workspace/KEESS_B-Type/ref/prototype/keess_home_C_v18_최종확정(260703).html').replace(/\\/g, '/');
const OUT = 'C:/Users/NT-0127/AppData/Local/Temp/claude/c-----------workspace-KEESS-B-Type/1d3dfd61-5663-40f3-a522-853b2539db9a/scratchpad';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

  // ── OURS full ──
  await page.goto(OURS, { waitUntil: 'networkidle', timeout: 40000 });
  await page.waitForTimeout(1500);
  // scroll through to trigger reveals/countups
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: OUT + '/h-ours-full.png', fullPage: true });
  console.log('ours full');

  // hero top only
  await page.screenshot({ path: OUT + '/h-ours-hero.png' });
  console.log('ours hero');

  // ── interaction: hero next ──
  await page.getByRole('button', { name: '다음 슬라이드' }).click();
  await page.waitForTimeout(1100);
  await page.screenshot({ path: OUT + '/h-ours-hero-slide2.png' });

  // ── FAQ tab switch + accordion ──
  await page.locator('#faq').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: '비용·지원' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: OUT + '/h-ours-faq.png' });
  console.log('faq switched');

  // ── inq validation (empty submit) ──
  await page.locator('#inq').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: '상담 신청' }).click();
  await page.waitForTimeout(400);
  const invalidCount = await page.locator('#inq .field.invalid').count();
  console.log('inq invalid fields after empty submit:', invalidCount);
  await page.screenshot({ path: OUT + '/h-ours-inq-validation.png' });

  // fill + success
  await page.locator('#inq select').first().selectOption({ index: 1 });
  await page.locator('#inq select').nth(1).selectOption({ index: 1 });
  await page.locator('#inq input').nth(0).fill('테스트기업');
  await page.locator('#inq input').nth(1).fill('홍길동');
  await page.locator('#inq input[type="email"]').fill('test@company.com');
  await page.locator('#inq .mchip').first().click();
  await page.locator('#inq .consent-main input').first().check();
  await page.getByRole('button', { name: '상담 신청' }).click();
  await page.waitForTimeout(500);
  const okShown = await page.locator('#inq .form-done.show').count();
  console.log('inq success shown:', okShown);
  await page.screenshot({ path: OUT + '/h-ours-inq-success.png' });

  // ── GNB routing checks ──
  await page.goto(OURS, { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'AX·AI 전환' }).first().click();
  await page.waitForURL('**/ax-ai', { timeout: 5000 }).catch(() => {});
  console.log('after AX·AI click URL:', page.url());
  await page.goBack();
  await page.waitForTimeout(400);
  // aria-current on home? home nav has no home item; check logo href
  const logoHref = await page.getByRole('link', { name: 'KEESS 홈' }).getAttribute('href');
  console.log('logo href:', logoHref);

  // ── mobile ──
  await ctx.close();
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mpage = await mctx.newPage();
  await mpage.goto(OURS, { waitUntil: 'networkidle' });
  await mpage.waitForTimeout(1200);
  await mpage.screenshot({ path: OUT + '/h-ours-mobile.png', fullPage: true });
  // hamburger
  await mpage.getByRole('button', { name: '메뉴' }).click();
  await mpage.waitForTimeout(500);
  await mpage.screenshot({ path: OUT + '/h-ours-mobile-menu.png' });
  console.log('mobile done');
  await mctx.close();

  // ── ORIGINAL prototype full ──
  const octx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const opage = await octx.newPage();
  try {
    await opage.goto(ORIG, { waitUntil: 'load', timeout: 30000 });
    await opage.waitForTimeout(2500);
    await opage.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
      window.scrollTo(0, 0);
    });
    await opage.waitForTimeout(1200);
    await opage.screenshot({ path: OUT + '/h-orig-full.png', fullPage: true });
    await opage.screenshot({ path: OUT + '/h-orig-hero.png' });
    console.log('orig full');
  } catch (e) { console.log('orig error:', e.message); }
  await octx.close();

  console.log('CONSOLE ERRORS:', JSON.stringify(errors, null, 2));
  await browser.close();
})();
