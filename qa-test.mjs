import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const EXE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT = 'C:\\Users\\PC\\AppData\\Local\\Temp\\opencode\\gym-qa';
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: true,
  args: [
    '--autoplay-policy=no-user-gesture-required',
    '--disable-gpu',
    '--hide-scrollbars',
  ],
  defaultViewport: { width: 1440, height: 900 },
});

const page = await browser.newPage();
const logs = [];
page.on('console', (m) => {
  const t = m.type();
  if (t === 'error' || t === 'warning') logs.push(`[console.${t}] ${m.text()}`);
});
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
page.on('requestfailed', (r) =>
  logs.push(`[requestfailed] ${r.url()} :: ${r.failure()?.errorText}`)
);

await page.goto('http://localhost:8080/', { waitUntil: 'networkidle2', timeout: 60000 });
await sleep(3000);
/* harness only: no smooth scrolling so screenshots land exactly */
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto';
});

const shot = async (name) => {
  await page.screenshot({ path: `${OUT}\\${name}.png` });
  console.log('shot:', name);
};

const scrollTo = async (y) => {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await sleep(1800);
  const actual = await page.evaluate(() => Math.round(window.scrollY));
  if (Math.abs(actual - y) > 5) console.log(`  ! target ${y} -> actual ${actual}`);
};

const yOf = (sel) =>
  page.evaluate((s) => {
    const el = document.querySelector(s);
    return el ? el.getBoundingClientRect().top + window.scrollY : null;
  }, sel);

/* --- hero --- */
await shot('01-hero');

/* --- manifesto: the text pause --- */
await scrollTo((await yOf('#manifesto')) - 40);
await shot('02-manifesto');

/* --- chalk: left-panel entry, growth, text (pin 170%) --- */
const chalkTop = await yOf('#philosophy');
await scrollTo(chalkTop + 10);
await shot('03-chalk-entry');
await scrollTo(chalkTop + 900 * 0.65);
await shot('04-chalk-mid');
await scrollTo(chalkTop + 900 * 1.6);
await shot('05-chalk-text');

/* --- programs --- */
await scrollTo((await yOf('#programs')) - 60);
await sleep(800);
await shot('06-programs');

/* --- sprinter: entry + mid-pin + text --- */
const sprTop = await yOf('#conditioning');
await scrollTo(sprTop + 10);
await shot('07-sprinter-entry');
await scrollTo(sprTop + 900 * 0.9);
await shot('08-sprinter-mid');
await scrollTo(sprTop + 900 * 1.6);
await shot('09-sprinter-text');

/* --- coaches / results --- */
await scrollTo((await yOf('#coaches')) - 60);
await shot('10-coaches');
await scrollTo((await yOf('#results')) - 60);
await sleep(1600);
await shot('11-results');

/* --- closing + footer --- */
await scrollTo((await yOf('#closing')) - 60);
await shot('12-closing');
const docH = await page.evaluate(() => document.documentElement.scrollHeight);
await scrollTo(docH);
await shot('13-footer');

/* --- reverse-scroll sanity: nothing sticks --- */
await scrollTo(0);
await sleep(900);

const diag = await page.evaluate(() => {
  const videos = [...document.querySelectorAll('video[data-video]')].map((v) => ({
    src: (v.getAttribute('src') || '').split('/').pop(),
    readyState: v.readyState,
    paused: v.paused,
    w: v.videoWidth,
    h: v.videoHeight,
  }));
  return {
    triggers: window.ScrollTrigger ? ScrollTrigger.getAll().length : -1,
    docHeight: document.documentElement.scrollHeight,
    scrollY: Math.round(window.scrollY),
    fonts: document.fonts ? document.fonts.status : 'n/a',
    videos,
  };
});

/* --- mobile pass --- */
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await page.reload({ waitUntil: 'networkidle2' });
await sleep(2500);
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto';
});
await page.screenshot({ path: `${OUT}\\14-mobile-hero.png` });
const mChalk = await yOf('#philosophy');
await scrollTo(mChalk + 500);
await page.screenshot({ path: `${OUT}\\15-mobile-chalk.png` });
const mProg = await yOf('#programs');
await scrollTo(mProg - 40);
await page.screenshot({ path: `${OUT}\\16-mobile-programs.png` });

console.log('\n=== DIAGNOSTICS ===');
console.log(JSON.stringify(diag, null, 2));
console.log('\n=== LOGS ===');
console.log(logs.length ? logs.join('\n') : 'clean — no console errors or failed requests');

await browser.close();
