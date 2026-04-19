import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, 'assets/screenshots');

const groups = {
    'courier-girl':  ['1593250568043-0e8cb81d0fe7', '1586528116493-a029325540fa', '1556742502-ec7c0e9f34b1', '1584937933-9dc7d2a9d54a', '1520116468816-95b69f847357', '1516762381-1de0af43bdcf', '1519125323398-675f0ddb6308', '1607083206869-4c7672e72a8a'],
    'doctor-phone':  ['1584982751601-97dcc096659c', '1666214280557-f1b5022eb634', '1579684385127-1ef15d508118', '1631217868264-e5b90bb7e133', '1559757148-5c350d0d3c56', '1612531386530-97286d97c2d2'],
    'guitar-comp':   ['1517457373958-b7bdd4587205', '1598387181032-a3103a2db5b3', '1564186763535-ebb21ef5277f', '1510915361894-db8b60106cb1'],
    'suit-cars':     ['1503376780353-7e6692767b70', '1549317661-bd32c8ce0db2', '1493238792000-8113da705763', '1568605117036-5fe5e7bab0b7', '1562911791-c7a97b729ec5', '1583267746897-2cf415887172', '1605549935017-ba4d1c323f4b', '1494976388531-d1058494cdd8'],
    'food-boxes':    ['1566740933430-b5e70b06d2d5', '1542838132-92c53300491e', '1578916171728-46686eac8d58'],
    'cottages':      ['1542718610-a1d656d1884c', '1564013799919-ab600027ffc6', '1512917774080-9991f1c4c750', '1600585154340-be6161a56a0c'],
    'lake-hotel':    ['1501785888041-af3ef285b470', '1540541338287-41700207dee6', '1566073771259-6a8506099945', '1439130490301-25e322d88054'],
    'nails-salon':   ['1604654894610-df63bc536371', '1610992015732-2449b76344bc', '1519415943484-9fa1873496d4', '1632345031435-8727f6897d53'],
    'buff-trainer':  ['1581009146145-b5ef050c2e1e', '1599058917212-d750089bc07e', '1534438327276-14e5300c3a48', '1571019614242-c5c5dee9f50b'],
};

let html = '<!DOCTYPE html><html><head><style>body{background:#111;color:#eee;font-family:sans-serif;margin:0;padding:20px}h2{margin:20px 0 8px}.g{display:grid;grid-template-columns:repeat(6,200px);gap:10px}.c{position:relative;width:200px;height:200px;background-size:cover;background-position:center;border-radius:8px}.c span{position:absolute;bottom:4px;left:4px;right:4px;background:rgba(0,0,0,.7);color:#fff;font-size:10px;padding:2px 4px;border-radius:4px}</style></head><body>';
for (const [tag, ids] of Object.entries(groups)) {
    html += `<h2>${tag}</h2><div class="g">`;
    for (const id of ids) {
        const url = `https://images.unsplash.com/photo-${id}?w=200&h=200&fit=crop&q=60`;
        html += `<div class="c" style="background-image:url('${url}')"><span>${id}</span></div>`;
    }
    html += '</div>';
}
html += '</body></html>';

import { writeFileSync } from 'fs';
writeFileSync(resolve(__dirname, '.preview.html'), html);

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1300, height: 2800, deviceScaleFactor: 1 });
await page.goto('file:///' + resolve(__dirname, '.preview.html').replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 60000 });
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: `${outDir}/candidates-sheet.png`, fullPage: true });
console.log('saved candidates-sheet.png');
await browser.close();
