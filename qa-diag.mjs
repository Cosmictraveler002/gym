import puppeteer from 'puppeteer-core';

const EXE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: true,
  args: ['--autoplay-policy=no-user-gesture-required', '--disable-gpu', '--hide-scrollbars'],
  defaultViewport: { width: 1440, height: 900 },
});

const page = await browser.newPage();
const logs = [];
page.on('pageerror', (e) => logs.push('[pageerror] ' + e.message));
await page.goto('http://localhost:8080/', { waitUntil: 'networkidle2', timeout: 60000 });
await sleep(3000);

const report = await page.evaluate(() => {
  const sections = [...document.querySelectorAll('section[data-section]')].map((s) => {
    const r = s.getBoundingClientRect();
    return { name: s.dataset.section, top: Math.round(r.top + window.scrollY), height: Math.round(r.height) };
  });
  const triggers = window.ScrollTrigger
    ? ScrollTrigger.getAll().map((t) => ({
        id: t.trigger && t.trigger.dataset ? t.trigger.dataset.section || t.trigger.className : '',
        start: Math.round(t.start),
        end: Math.round(t.end),
        pinned: !!t.pin,
      }))
    : [];
  return { sections, triggers, doc: document.documentElement.scrollHeight, vh: window.innerHeight };
});
console.log(JSON.stringify(report, null, 2));

/* scroll to a fixed point and verify it sticks */
const target = report.sections.find((s) => s.name === 'programs').top + 100;
await page.evaluate((v) => window.scrollTo(0, v), target);
await sleep(1200);
console.log('program target', target, '-> actual scrollY', await page.evaluate(() => Math.round(window.scrollY)));

console.log('logs:', logs.length ? logs : 'none');
await browser.close();
