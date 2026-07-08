const { chromium } = require('playwright');
const TARGET_URL = 'http://localhost:3000/preview';
const OUT = 'C:/Users/NT-0127/AppData/Local/Temp/claude/c-----------workspace-KEESS-B-Type/1d3dfd61-5663-40f3-a522-853b2539db9a/scratchpad';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: OUT + '/s2-01-preview-full.png', fullPage: true });
  console.log('shot 1: preview full');

  // open modal via footer button
  await page.getByRole('button', { name: '부정훈련 예방 안내' }).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: OUT + '/s2-02-modal-info.png' });
  console.log('shot 2: modal info tab');

  // tab: 신고 접수
  await page.getByRole('tab', { name: '신고 접수' }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: OUT + '/s2-03-modal-report.png' });
  console.log('shot 3: modal report tab');

  // test validation: click submit empty
  await page.getByRole('button', { name: '신고 접수', exact: true }).last().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: OUT + '/s2-04-modal-report-validation.png' });
  console.log('shot 4: report validation');

  // tab: 신고 조회
  await page.getByRole('tab', { name: '신고 조회' }).click();
  await page.waitForTimeout(500);
  await page.getByPlaceholder('홍길동').fill('홍길동');
  await page.getByPlaceholder('010-1234-5678').fill('010-1234-5678');
  await page.getByRole('button', { name: '신고 내역 조회' }).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: OUT + '/s2-05-modal-lookup-list.png' });
  console.log('shot 5: lookup list');

  // expand first card detail + enter pw
  await page.getByRole('button', { name: /상세 보기/ }).first().click();
  await page.waitForTimeout(500);
  await page.getByPlaceholder('접수 시 설정한 비밀번호').first().fill('test');
  await page.getByRole('button', { name: '확인', exact: true }).first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: OUT + '/s2-06-modal-lookup-detail.png' });
  console.log('shot 6: lookup detail revealed');

  // mobile viewport of preview
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: OUT + '/s2-07-preview-mobile.png', fullPage: true });
  console.log('shot 7: mobile preview');

  console.log('CONSOLE ERRORS:', JSON.stringify(errors, null, 2));
  await browser.close();
})();
