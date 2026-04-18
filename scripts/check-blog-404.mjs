// Scan Blog/*.html for image URLs, HEAD-check each, report 404/non-OK.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.resolve(__dirname, '..', 'Blog');

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html') && f !== 'index.html');
const urls = new Map(); // url -> [{file, alt}]

for (const f of files) {
    const html = fs.readFileSync(path.join(BLOG_DIR, f), 'utf8');
    for (const m of html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/g)) {
        const src = m[1];
        if (!/^https?:\/\//.test(src)) continue;
        const altM = m[0].match(/alt=["']([^"']*)["']/);
        const alt = altM ? altM[1] : '';
        if (!urls.has(src)) urls.set(src, []);
        urls.get(src).push({ file: f, alt });
    }
    // Also check og:image & twitter:image
    for (const m of html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]*>/g)) {
        if (/og:image|twitter:image/.test(m[0]) && /^https?:\/\//.test(m[1])) {
            if (!urls.has(m[1])) urls.set(m[1], []);
            urls.get(m[1]).push({ file: f, alt: 'META' });
        }
    }
}

console.log(`Unique URLs to check: ${urls.size}`);

const results = [];
const entries = [...urls.entries()];
const BATCH = 12;

for (let i = 0; i < entries.length; i += BATCH) {
    const batch = entries.slice(i, i + BATCH);
    const probes = batch.map(async ([url, uses]) => {
        try {
            const ctl = new AbortController();
            const t = setTimeout(() => ctl.abort(), 10000);
            const res = await fetch(url, { method: 'HEAD', signal: ctl.signal, redirect: 'follow' });
            clearTimeout(t);
            return { url, status: res.status, uses };
        } catch (e) {
            return { url, status: 'ERR:' + e.message.slice(0, 40), uses };
        }
    });
    const done = await Promise.all(probes);
    for (const r of done) {
        if (typeof r.status === 'number' && r.status >= 200 && r.status < 400) continue;
        results.push(r);
        console.log(`  ${r.status}  ${r.url}`);
        for (const u of r.uses) console.log(`         in ${u.file}  (${u.alt})`);
    }
    process.stdout.write(`.${i + BATCH >= entries.length ? '\n' : ''}`);
}

console.log(`\n${results.length} broken out of ${urls.size}`);
fs.writeFileSync(path.resolve(__dirname, 'blog-404.json'), JSON.stringify(results, null, 2));
