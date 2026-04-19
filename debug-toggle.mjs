import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const fileUrl = 'file:///' + resolve(__dirname, 'index.html').replace(/\\/g, '/');

page.on('console', msg => { if (msg.text().indexOf('[DEBUG]') >= 0) console.log(msg.text()); });
await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 20000 });

// Inject debug logs into the existing handlers
await page.evaluate(() => {
    // Find all click listeners on the dropdown-toggle
    const toggle = document.querySelector('.nav .dropdown-toggle');
    console.log('[DEBUG] Toggle found:', toggle?.tagName, toggle?.className);

    // Wrap addEventListener to log clicks
    toggle.addEventListener('click', function(e) {
        console.log('[DEBUG] TOGGLE CLICKED. target:', e.target.tagName + '.' + e.target.className,
                    'phase:', e.eventPhase, 'defaultPrevented:', e.defaultPrevented,
                    'innerWidth:', window.innerWidth);
    }, true);  // capture phase

    // Also attach to document to see what happens
    document.addEventListener('click', function(e) {
        const path = e.composedPath().slice(0, 6).map(el => el.tagName ? el.tagName + (el.className ? '.' + (el.className + '').split(' ').join('.') : '') : String(el)).join(' > ');
        console.log('[DEBUG] DOCUMENT CLICK. path:', path);
    }, true);

    // Check if anything on nav listens to click and calls closeNav
    const nav = document.getElementById('nav');
    nav.addEventListener('click', function(e) {
        console.log('[DEBUG] NAV CLICK. target:', e.target.tagName + '.' + e.target.className);
    }, true);
});

// Open menu
await page.tap('#burger');
await new Promise(r => setTimeout(r, 300));
console.log('[DEBUG] --- About to tap dropdown toggle ---');
await page.tap('.nav .dropdown-toggle');
await new Promise(r => setTimeout(r, 500));

const state = await page.evaluate(() => ({
    navOpen: document.getElementById('nav').classList.contains('open'),
    mobOpen: document.querySelector('.dropdown.mob-open') ? true : false
}));
console.log('[DEBUG] FINAL STATE:', JSON.stringify(state));

await browser.close();
