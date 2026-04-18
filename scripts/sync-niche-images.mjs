// Replace niche-card backgrounds on product pages with the same images
// used on index.html, matching by h4 label keywords.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SIZE = 'w=400&h=400&fit=crop&q=70';
const U = id => `https://images.unsplash.com/photo-${id}?${SIZE}`;

const IMG = {
    shop:    U('1566576721346-d4a3b4eaeb55'),
    hotel:   U('1501785888041-af3ef285b470'),
    b2b:     U('1552664730-d307ca884978'),
    clinic:  U('1584982751601-97dcc096659c'),
    school:  U('1510915361894-db8b60106cb1'),
    auto:    U('1494976388531-d1058494cdd8'),
    estate:  U('1542718610-a1d656d1884c'),
    horeca:  U('1578916171728-46686eac8d58'),
    beauty:  U('1604654894610-df63bc536371'),
    it:      U('1518770660439-4636190af475'),
    fitness: U('1571019614242-c5c5dee9f50b'),
    edu:     U('1454165804606-c3d57bc86b40'),
};

const RULES = [
    [/интернет.?магазин|e.?commerce|онлайн.?магазин|e-?com/i, IMG.shop],
    [/гостиниц|отел[ья]|hotel|spa|спа/i, IMG.hotel],
    [/автосалон|автосервис|автомоб/i, IMG.auto],
    [/клиник|медцентр|медицин|стоматолог/i, IMG.clinic],
    [/онлайн.?школ|инфобизнес|курсы/i, IMG.school],
    [/красот|бьюти|nail|маникюр/i, IMG.beauty],
    [/салон/i, IMG.beauty],
    [/недвижимост|риэлтор/i, IMG.estate],
    [/horeca|ресторан|кафе|доставк|фудтех/i, IMG.horeca],
    [/saas|финанс|банк|мфо|fintech|финтех|агентств|seo|smm|^it$|\bit\b/i, IMG.it],
    [/фитнес|спорт|gym|тренажёрн/i, IMG.fitness],
    [/образован|обучени/i, IMG.edu],
    [/школ/i, IMG.school],
    [/b2b|корпорат|компан|логистик|производств|торгов/i, IMG.b2b],
];

function pickImage(label) {
    for (const [re, url] of RULES) if (re.test(label)) return url;
    return IMG.b2b;
}

// Strategy: find each <div class="niche-card...> ... </div> block including nested divs.
function replaceCards(html) {
    let out = '';
    let idx = 0;
    let changed = 0;
    const markerRe = /<div\s+class="niche-card[^"]*"[^>]*>/g;
    let m;
    while ((m = markerRe.exec(html)) !== null) {
        // Append everything up to card start
        out += html.slice(idx, m.index);
        const cardStart = m.index;
        // Walk forward tracking <div>/</div> depth until balanced
        let i = m.index + m[0].length;
        let depth = 1;
        const divOpen = /<div\b/gi;
        const divClose = /<\/div>/gi;
        while (depth > 0 && i < html.length) {
            divOpen.lastIndex = i;
            divClose.lastIndex = i;
            const no = divOpen.exec(html);
            const nc = divClose.exec(html);
            if (!nc) break;
            if (no && no.index < nc.index) { depth++; i = no.index + no[0].length; }
            else { depth--; i = nc.index + nc[0].length; }
        }
        const cardEnd = i;
        const card = html.slice(cardStart, cardEnd);
        const labelM = card.match(/<h4[^>]*>([\s\S]*?)<\/h4>/);
        if (labelM) {
            const label = labelM[1].replace(/<[^>]+>/g, '').trim();
            const newUrl = pickImage(label);
            const replaced = card.replace(
                /background-image:url\(['"]https:\/\/images\.unsplash\.com\/photo-[^'"]+['"]\)/,
                `background-image:url('${newUrl}')`
            );
            if (replaced !== card) changed++;
            out += replaced;
        } else {
            out += card;
        }
        idx = cardEnd;
        markerRe.lastIndex = cardEnd;
    }
    out += html.slice(idx);
    return { out, changed };
}

const targets = ['whatsapp-bot.html', 'telegram-bot.html', 'voice-manager-bot.html'];
for (const f of targets) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) continue;
    const html = fs.readFileSync(p, 'utf8');
    const { out, changed } = replaceCards(html);
    fs.writeFileSync(p, out);
    console.log(`${f}: ${changed} cards updated`);
}
console.log('done');
