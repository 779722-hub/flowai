import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, 'assets/screenshots');
const fileUrl = 'file:///' + resolve(__dirname, 'index.html').replace(/\\/g, '/');

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.evaluateOnNewDocument(() => { try { localStorage.setItem('flowai-theme', 'dark'); } catch (e) {} });
await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });
await page.evaluate(() => document.querySelectorAll('.fi').forEach(el => el.classList.add('v')));
await new Promise(r => setTimeout(r, 800));
const el = await page.$('.steps-layout');
await el.scrollIntoView();
await new Promise(r => setTimeout(r, 400));
await el.screenshot({ path: `${outDir}/steps-reverted.png` });
console.log('saved steps-reverted.png');
await browser.close();
