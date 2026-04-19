// Report body text length and section count for every blog article.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG = path.resolve(__dirname, '..', 'Blog');

const files = fs.readdirSync(BLOG).filter(f => f.endsWith('.html') && f !== 'index.html');
const rows = [];
for (const f of files) {
    const html = fs.readFileSync(path.join(BLOG, f), 'utf8');
    const m = html.match(/<div class="post-body">([\s\S]*?)<\/div><\/div><\/section>/);
    const body = m ? m[1] : '';
    const text = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const h2s = (body.match(/<h2[^>]*>/g) || []).length;
    const ps = (body.match(/<p[^>]*>/g) || []).length;
    const imgs = (body.match(/<img[^>]+>/g) || []).length;
    const cards = (body.match(/<div class="post-mini-card/g) || []).length;
    rows.push({ f, chars: text.length, h2s, ps, imgs, cards });
}
rows.sort((a, b) => a.chars - b.chars);
console.log('file | chars | h2 | p | img | cards');
for (const r of rows) {
    const flag = r.chars < 3000 ? ' ⚠' : '';
    console.log(`${r.f} | ${r.chars} | ${r.h2s} | ${r.ps} | ${r.imgs} | ${r.cards}${flag}`);
}
console.log('---');
console.log('thin (<3000):', rows.filter(r => r.chars < 3000).length);
