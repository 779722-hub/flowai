import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, 'assets/screenshots');

// Test the same ?w=400&h=400&fit=crop crop as the site uses
const pairs = [
    ['Автосалоны A', '1503376780353-7e6692767b70'],
    ['Автосалоны B', '1549317661-bd32c8ce0db2'],
    ['Автосалоны C', '1562911791-c7a97b729ec5'],
    ['Автосалоны D', '1494976388531-d1058494cdd8'],
    ['Автосалоны E', '1568605117036-5fe5e7bab0b7'],
    ['Интернет A', '1566576721346-d4a3b4eaeb55'],
    ['Интернет B', '1607083206869-4c7672e72a8a'],
    ['Интернет C', '1556742502-ec7c0e9f34b1'],
    ['Интернет D', '1556740758-90de374c12ad'],
    ['Интернет E', '1586528116493-a029325540fa'],
    ['Интернет F', '1607082348824-0a96f2a4b9da'],
    ['Интернет G', '1522204523234-8729aa6e3d5f'],
    ['Интернет H', '1562240020-ce31ccb0fa7d'],
];

let html = '<!DOCTYPE html><html><head><style>body{background:#111;color:#eee;font-family:sans-serif;margin:0;padding:20px}.g{display:grid;grid-template-columns:repeat(5,260px);gap:12px}.c{position:relative;width:260px;height:260px;background-size:cover;background-position:center;border-radius:10px}.c span{position:absolute;bottom:6px;left:6px;right:6px;background:rgba(0,0,0,.75);color:#fff;font-size:11px;padding:4px 8px;border-radius:4px}</style></head><body><div class="g">';
for (const [label, id] of pairs) {
    const url = `https://images.unsplash.com/photo-${id}?w=400&h=400&fit=crop&q=70`;
    html += `<div class="c" style="background-image:url('${url}')"><span>${label}<br>${id}</span></div>`;
}
html += '</div></body></html>';
writeFileSync(resolve(__dirname, '.preview2.html'), html);

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 1200, deviceScaleFactor: 1 });
await page.goto('file:///' + resolve(__dirname, '.preview2.html').replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 60000 });
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: `${outDir}/final-crops.png`, fullPage: true });
console.log('saved final-crops.png');
await browser.close();
