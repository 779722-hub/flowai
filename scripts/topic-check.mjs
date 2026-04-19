// For each blog article, extract <title> and all body H2 headings, and
// report if any headings look off-topic or generic.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG = path.resolve(__dirname, '..', 'Blog');

const files = fs.readdirSync(BLOG).filter(f => f.endsWith('.html') && f !== 'index.html');

for (const f of files) {
    const html = fs.readFileSync(path.join(BLOG, f), 'utf8');
    const titleM = html.match(/<title>([\s\S]*?)<\/title>/);
    const title = titleM ? titleM[1].replace(/\s*\|\s*FlowAi Blog.*/, '').trim() : '';
    const body = html.match(/<div class="post-body">([\s\S]*?)<\/div><\/div><\/section>/);
    const bodyHtml = body ? body[1] : '';
    const h2s = [...bodyHtml.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)]
        .map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
    console.log(`\n\x1b[1m${f}\x1b[0m`);
    console.log(`  TITLE: ${title}`);
    h2s.forEach((h, i) => console.log(`  H2-${i+1}: ${h}`));
}
