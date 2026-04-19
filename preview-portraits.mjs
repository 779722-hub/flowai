import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, 'assets/screenshots');

const groups = {
    'more-candidates': ['1607746882042-944635dfe10e', '1504593811423-6dd665756598', '1595152772835-219674b2a8a6', '1614283233556-f35b0c801ef1', '1596496050827-8299e0220de1', '1580894894513-541e068a3e2b', '1560250097-0b93528c311a', '1553267751-1c148a7280a1', '1554151228-14d9def656e4', '1601814933824-fd0b574dd592', '1521310192545-4ac7951413f0', '1524504388940-b1c1722653e1', '1552519507-da3b142c6e3d'],
    'confirmed-kz': ['1612349317150-e413f6a5b16d', '1569913486515-b74bf7751574', '1534528741775-53994a69daeb', '1592621385612-4d7129426394', '1578932750294-f5075e85f44a'],
    'european-m':   ['1568602471122-7832951cc4c5', '1472099645785-5658abf4ff4e', '1517841905240-472988babdf9', '1506794778202-cad84cf45f1d', '1539571696357-5a69c17a67c6'],
    'european-f':   ['1544005313-94ddf0286df2', '1438761681033-6461ffad8d80', '1487412720507-e7ab37603c6f', '1580489944761-15a19d654956', '1604426633861-11b2faead63c'],
};

let html = '<!DOCTYPE html><html><head><style>body{background:#111;color:#eee;font-family:sans-serif;margin:0;padding:20px}h2{margin:20px 0 8px}.g{display:grid;grid-template-columns:repeat(6,140px);gap:10px}.c{position:relative;width:140px;height:140px;background-size:cover;background-position:center top;border-radius:70px;border:2px solid #333}.c span{position:absolute;bottom:-22px;left:0;right:0;color:#bbb;font-size:9px;text-align:center}</style></head><body>';
for (const [tag, ids] of Object.entries(groups)) {
    html += `<h2>${tag}</h2><div class="g" style="margin-bottom:30px">`;
    for (const id of ids) {
        const url = `https://images.unsplash.com/photo-${id}?w=140&h=140&fit=crop&crop=faces&q=60`;
        html += `<div class="c" style="background-image:url('${url}')"><span>${id}</span></div>`;
    }
    html += '</div>';
}
html += '</body></html>';
writeFileSync(resolve(__dirname, '.preview3.html'), html);

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1000, height: 1100, deviceScaleFactor: 2 });
await page.goto('file:///' + resolve(__dirname, '.preview3.html').replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 60000 });
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: `${outDir}/portraits-sheet.png`, fullPage: true });
console.log('saved portraits-sheet.png');
await browser.close();
