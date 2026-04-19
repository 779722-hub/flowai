// Inventory of all product / static pages: title, body-text length,
// H2 count, presence of key section types.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const skip = new Set(['index.html', 'yandex_38325d131adbb366.html']);
const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && !skip.has(f));

const rows = [];
for (const f of files) {
    const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const titleM = html.match(/<title>([\s\S]*?)<\/title>/);
    const title = titleM ? titleM[1].replace(/\s*\|.*$/, '').trim() : '';
    // strip head / scripts / style / header / footer to get body content
    const bodyM = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const body = bodyM ? bodyM[1] : '';
    const cleaned = body
        .replace(/<header[\s\S]*?<\/header>/gi, '')
        .replace(/<footer[\s\S]*?<\/footer>/gi, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<nav[\s\S]*?<\/nav>/gi, '');
    const text = cleaned.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const h2s = (cleaned.match(/<h2[^>]*>/g) || []).length;
    const h3s = (cleaned.match(/<h3[^>]*>/g) || []).length;
    const cards = (cleaned.match(/class="[^"]*(?:feature-card|post-mini-card|price-card|trust-card|faq-item)/g) || []).length;
    rows.push({ f, title: title.slice(0, 70), chars: text.length, h2s, h3s, cards });
}
rows.sort((a, b) => a.chars - b.chars);
console.log('file | title | chars | h2 | h3 | cards');
for (const r of rows) {
    const flag = r.chars < 4000 ? ' ⚠' : '';
    console.log(`${r.f} | ${r.title} | ${r.chars} | ${r.h2s} | ${r.h3s} | ${r.cards}${flag}`);
}
console.log('---');
console.log('thin (<4000):', rows.filter(r => r.chars < 4000).length);
