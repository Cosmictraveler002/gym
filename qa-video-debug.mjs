/* qa-video-debug — why do mp4 requests get aborted?
   Logs every mp4 request/response headers + per-video MediaError state. */
import puppeteer from 'puppeteer-core';

const EXE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: true,
  args: ['--autoplay-policy=no-user-gesture-required', '--disable-gpu'],
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
const short = (u) => decodeURIComponent(u.split('/').pop());

page.on('request', (r) => {
  if (r.url().includes('.mp4')) {
    const h = r.headers();
    console.log(`REQ  ${r.method()} ${short(r.url())} range=${h.range || '-'} if-range=${h['if-range'] || '-'} conn=${h.connection || '-'}`);
  }
});
page.on('response', (r) => {
  if (r.url().includes('.mp4')) {
    const h = r.headers();
    console.log(`RES  ${r.status()} ${short(r.url())} cr=${h['content-range'] || '-'} cl=${h['content-length'] || '-'} ar=${h['accept-ranges'] || '-'} conn=${h.connection || '-'} lm=${h['last-modified'] || '-'}`);
  }
});
page.on('requestfailed', (r) => {
  if (r.url().includes('.mp4')) console.log(`FAIL ${short(r.url())} :: ${r.failure()?.errorText}`);
});

await page.evaluateOnNewDocument(() => {
  window.__mediaLog = [];
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('video').forEach((v, i) => {
      const tag = (e) => window.__mediaLog.push(`#${i} event=${e.type}${v.error ? ` err=${v.error.code}/${v.error.message}` : ''} net=${v.networkState} rs=${v.readyState}`);
      v.addEventListener('error', () => tag({ type: 'error' }));
      v.addEventListener('abort', () => tag({ type: 'abort' }));
      v.addEventListener('stalled', () => tag({ type: 'stalled' }));
      v.addEventListener('suspend', () => tag({ type: 'suspend' }));
    });
  });
});

await page.goto('http://localhost:8080/', { waitUntil: 'networkidle2', timeout: 60000 });
await sleep(5000);

const state = () =>
  page.evaluate(() =>
    [...document.querySelectorAll('video')].map((v, i) => ({
      i,
      src: decodeURIComponent((v.currentSrc || v.getAttribute('src') || v.getAttribute('data-src') || '').split('/').pop()),
      net: v.networkState,
      rs: v.readyState,
      err: v.error ? v.error.code + '/' + v.error.message : null,
      paused: v.paused,
      w: v.videoWidth,
    }))
  );

console.log('--- at top (after 5s) ---');
console.table(await state());

const chalkY = await page.evaluate(() => document.querySelector('#philosophy').getBoundingClientRect().top + window.scrollY);
await page.evaluate((y) => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, y + 400); }, chalkY);
await sleep(5000);
console.log('--- chalk in view (after 5s) ---');
console.table(await state());
console.log('--- media events ---');
console.log((await page.evaluate(() => window.__mediaLog)).join('\n') || '(none)');

await browser.close();
