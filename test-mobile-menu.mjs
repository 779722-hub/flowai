import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, 'assets/screenshots');

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await page.evaluateOnNewDocument(() => { try { localStorage.setItem('flowai-theme', 'dark'); } catch (e) {} });
const fileUrl = 'file:///' + resolve(__dirname, 'index.html').replace(/\\/g, '/');

page.on('console', msg => console.log('[page]', msg.type(), msg.text()));
page.on('pageerror', err => console.log('[pagerror]', err.message));

await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 20000 });
await new Promise(r => setTimeout(r, 500));

// 1. Tap burger
await page.tap('#burger');
await new Promise(r => setTimeout(r, 400));
let state = await page.evaluate(() => ({ navOpen: document.getElementById('nav').classList.contains('open') }));
console.log('After burger tap:', state);
await page.screenshot({ path: `${outDir}/test-1-open.png` });

// 2. Inspect toggle elements + check handlers
const toggleInfo = await page.evaluate(() => {
    const toggles = Array.from(document.querySelectorAll('.nav .dropdown-toggle'));
    return toggles.slice(0, 3).map(t => ({
        text: t.textContent.trim(),
        tag: t.tagName,
        rect: t.getBoundingClientRect(),
        parentClass: t.parentElement.className
    }));
});
console.log('Toggles:', JSON.stringify(toggleInfo, null, 2));

// Tap dropdown toggle (Боты)
const toggles = await page.$$('.nav .dropdown-toggle');
if (toggles[0]) {
    await toggles[0].tap();
    await new Promise(r => setTimeout(r, 400));
    state = await page.evaluate(() => {
        const nav = document.getElementById('nav');
        return {
            navOpen: nav.classList.contains('open'),
            mobOpen: nav.querySelector('.dropdown.mob-open')?.querySelector('.dropdown-toggle')?.textContent || null
        };
    });
    console.log('After dropdown tap:', state);
    await page.screenshot({ path: `${outDir}/test-2-dropdown.png` });
}

// 3. Try to tap a link inside the dropdown menu
const dropdownLink = await page.$('.nav .dropdown.mob-open .dropdown-menu a');
if (dropdownLink) {
    const href = await page.evaluate(el => el.href, dropdownLink);
    console.log('Dropdown link href:', href);
    // Intercept navigation
    let navigated = null;
    page.on('framenavigated', f => { if (f === page.mainFrame()) navigated = f.url(); });
    await dropdownLink.tap();
    await new Promise(r => setTimeout(r, 600));
    console.log('Navigated to:', navigated);
} else {
    console.log('No dropdown link found');
}

await browser.close();
