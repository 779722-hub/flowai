// Insert "Читайте также" section into every blog article with 5-10
// curated cross-reference links (related articles + relevant products).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.resolve(__dirname, '..', 'Blog');

// Article registry with topic tags
const ARTICLES = [
    { slug: 'chto-takoe-rag-sistemy', title: 'Что такое RAG-системы и как они меняют корпоративный поиск', tags: ['rag', 'llm', 'ai', 'tech'] },
    { slug: 'baza-znaniy-llm-telegram', title: 'База знаний компании на базе LLM в Telegram', tags: ['llm', 'telegram', 'rag', 'tech', 'hr'] },
    { slug: 'lokalnyy-ii-vs-oblachnyy-bezopasnost', title: 'Локальный ИИ vs Облачный: безопасность данных', tags: ['llm', 'tech', 'security'] },
    { slug: 'kak-ii-chitaet-dokumenty-izvlekaet-dannye', title: 'Как ИИ читает документы и извлекает данные', tags: ['rag', 'tech', 'finance', 'docs'] },
    { slug: 'golosovoy-ii-manager-vs-call-centr', title: 'Голосовой ИИ-менеджер vs колл-центр', tags: ['voice', 'sales', 'ai'] },
    { slug: 'analiz-konkurentov-ii-agenty', title: 'Анализ конкурентов с помощью ИИ-агентов', tags: ['marketing', 'strategy', 'ai'] },
    { slug: 'ii-assistenty-dlya-otdela-prodazh', title: 'ИИ-ассистенты для отдела продаж', tags: ['sales', 'ai', 'whatsapp'] },
    { slug: 'skripty-prodazh-mertvy-ii-luchshe', title: 'Скрипты продаж мертвы: ИИ общается лучше', tags: ['sales', 'ai'] },
    { slug: 'ii-dlya-smm-agentstv', title: 'ИИ для SMM-агентств', tags: ['marketing', 'content'] },
    { slug: 'generaciya-foto-tovarov-instagram', title: 'Генерация фото товаров для Instagram', tags: ['marketing', 'content'] },
    { slug: 'personalizirovannye-rassylki-bez-spama', title: 'Персонализированные рассылки без спама', tags: ['marketing', 'sales'] },
    { slug: 'kak-nastroit-avto-otvet-whatsapp', title: 'Автоответчик в WhatsApp, который продаёт', tags: ['whatsapp', 'sales'] },
    { slug: 'autoposting-telegram-nejroset', title: 'Автопостинг в Telegram нейросетью', tags: ['telegram', 'content', 'marketing'] },
    { slug: 'pochemu-biznes-vybiraet-telegram-vitrina', title: 'Почему бизнес выбирает Telegram как витрину', tags: ['telegram', 'sales'] },
    { slug: 'uchet-tovarov-v-telegram-sklad', title: 'Учет товаров через Telegram', tags: ['telegram', 'finance', 'docs'] },
    { slug: 'kontrol-ostatkov-google-sheets-ii', title: 'Контроль остатков через Google Sheets', tags: ['finance', 'docs'] },
    { slug: 'avtomatizaciya-onbordinga-novyh-sotrudnikov', title: 'Автоматизация онбординга новых сотрудников', tags: ['hr', 'ai'] },
    { slug: 'avtomatizaciya-onbordinga-sotrudnikov-ii', title: 'Автоматизация онбординга с помощью ИИ', tags: ['hr', 'ai'] },
    { slug: 'ii-v-hr-neyroset-otbor-kandidatov', title: 'ИИ в HR: отбор кандидатов', tags: ['hr', 'ai'] },
    { slug: 'obuchenie-sotrudnikov-ii-instrumentam', title: 'Обучение сотрудников ИИ-инструментам', tags: ['hr', 'ai'] },
    { slug: 'ii-assistent-lichnyj-kouch-rukovoditelya', title: 'ИИ-ассистент как личный коуч руководителя', tags: ['ceo', 'ai'] },
    { slug: 'psihologicheskaya-ustojchivost-lidera-neyroseti', title: 'Психологическая устойчивость лидера в эпоху нейросетей', tags: ['ceo', 'strategy'] },
    { slug: 'nalogi-ii-avtomatizaciya-otchetnosti-ip', title: 'Налоги и ИИ: автоматизация отчётности ИП', tags: ['finance', 'docs', 'kz'] },
    { slug: 'uchet-stroymaterialov-gazoblok-kirpich-ii', title: 'ИИ в стройбизнесе: учёт материалов', tags: ['finance', 'docs'] },
    { slug: 'optimizaciya-marshrutov-dostavki-ii', title: 'Оптимизация маршрутов доставки с ИИ', tags: ['logistics', 'ai'] },
    { slug: 'grant-na-cifrovizaciyu-biznesa-rk', title: 'Грант на цифровизацию бизнеса в РК', tags: ['kz', 'strategy'] },
    { slug: 'kak-poluchit-grant-cifrovizaciya-rk', title: 'Как получить грант на цифровизацию в РК 2026', tags: ['kz', 'strategy'] },
    { slug: 'obzor-crm-sistem-almaty-astana-2026', title: 'Обзор CRM-систем в Алматы и Астане 2026', tags: ['sales', 'kz', 'strategy'] },
    { slug: 'trendy-avtomatizacii-kazahstan-2026', title: 'Тренды автоматизации в Казахстане 2026', tags: ['kz', 'strategy', 'ai'] },
];

const PRODUCTS = {
    rag:      { href: '../chatbot-rag.html', label: 'RAG-чатбот' },
    whatsapp: { href: '../whatsapp-bot.html', label: 'WhatsApp-бот' },
    telegram: { href: '../telegram-bot.html', label: 'Telegram-бот' },
    voice:    { href: '../voice-manager-bot.html', label: 'Голосовой менеджер' },
    ceo:      { href: '../ai-assistant-ceo.html', label: 'ИИ-ассистент для CEO' },
    kp:       { href: '../auto-kp-bot.html', label: 'Автоматический КП-бот' },
    invoice:  { href: '../swift-invoice.html', label: 'Инвойс-бот' },
    blogger:  { href: '../blogger-bot.html', label: 'Blogger-бот' },
    rss:      { href: '../rss-bot.html', label: 'RSS-автопостинг' },
    research: { href: '../ai-research-bot.html', label: 'ИИ-исследователь' },
    nutri:    { href: '../nutritionist-bot.html', label: 'Нутрициолог-бот' },
    website:  { href: '../website-dev.html', label: 'Создание сайтов' },
    video:    { href: '../brand-video.html', label: 'Брендовое видео' },
    complex:  { href: '../complex-solution.html', label: 'Комплексное решение' },
};

// Tag → most-relevant products
const TAG_PRODUCTS = {
    rag: ['rag', 'ceo', 'research'],
    llm: ['rag', 'ceo', 'research'],
    ai: ['complex', 'ceo', 'rag'],
    voice: ['voice', 'whatsapp', 'telegram'],
    sales: ['whatsapp', 'telegram', 'voice', 'kp'],
    marketing: ['blogger', 'rss', 'video'],
    content: ['blogger', 'rss', 'video'],
    whatsapp: ['whatsapp', 'voice', 'telegram'],
    telegram: ['telegram', 'whatsapp', 'blogger'],
    hr: ['complex', 'rag', 'ceo'],
    ceo: ['ceo', 'research', 'complex'],
    finance: ['invoice', 'kp', 'rag'],
    docs: ['invoice', 'rag', 'kp'],
    logistics: ['complex', 'telegram'],
    strategy: ['research', 'ceo', 'complex'],
    kz: ['complex', 'website'],
    security: ['rag', 'complex'],
    tech: ['rag', 'research'],
};

function scoreRelated(src, dst) {
    if (src.slug === dst.slug) return -1;
    const shared = src.tags.filter(t => dst.tags.includes(t)).length;
    return shared;
}

function pickRelated(srcSlug) {
    const src = ARTICLES.find(a => a.slug === srcSlug);
    if (!src) return { articles: [], products: [] };
    const ranked = ARTICLES
        .map(a => ({ a, s: scoreRelated(src, a) }))
        .filter(x => x.s > 0)
        .sort((a, b) => b.s - a.s || Math.random() - 0.5)
        .slice(0, 6)
        .map(x => x.a);

    // Collect product tags weighted by frequency
    const prodCounts = {};
    for (const t of src.tags) {
        for (const p of (TAG_PRODUCTS[t] || [])) {
            prodCounts[p] = (prodCounts[p] || 0) + 1;
        }
    }
    const products = Object.entries(prodCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([key]) => PRODUCTS[key]);

    return { articles: ranked, products };
}

function buildBlock(srcSlug) {
    const { articles, products } = pickRelated(srcSlug);
    if (!articles.length) return '';
    const articleCards = articles.map(a =>
        `        <a href="${a.slug}.html" class="xref-card"><span class="xref-kind">Статья</span><h3>${a.title}</h3></a>`
    ).join('\n');
    const productCards = products.map(p =>
        `        <a href="${p.href}" class="xref-card xref-prod"><span class="xref-kind">Продукт</span><h3>${p.label}</h3></a>`
    ).join('\n');
    return `
<section class="s-alt"><div class="container">
    <div class="eyebrow">Читайте также</div>
    <h2 class="section-title">Похожие <span class="accent">материалы</span></h2>
    <div class="xref-grid">
${articleCards}
${productCards}
    </div>
</div></section>
`;
}

// Inject block before the consult section
const INSERT_BEFORE = /<section><div class="container"><div class="consult fi">/;

for (const art of ARTICLES) {
    const file = path.join(BLOG_DIR, art.slug + '.html');
    if (!fs.existsSync(file)) { console.log('miss:', art.slug); continue; }
    let html = fs.readFileSync(file, 'utf8');

    // Remove any previous xref block
    html = html.replace(/\n?<section class="s-alt"><div class="container">\s*<div class="eyebrow">Читайте также<\/div>[\s\S]*?<\/div><\/section>\n?/g, '\n');

    const block = buildBlock(art.slug);
    if (!INSERT_BEFORE.test(html)) {
        console.log('no consult anchor:', art.slug);
        continue;
    }
    html = html.replace(INSERT_BEFORE, block + '\n<section><div class="container"><div class="consult fi">');
    fs.writeFileSync(file, html, 'utf8');
    console.log('ok:', art.slug);
}
console.log('done');
