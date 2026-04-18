// Apply pilot "main-page scale" layout to all blog articles.
// Source of truth for styles: theme.css (.post-*). We rewrite body structure
// to match Blog/chto-takoe-rag-sistemy.html and strip legacy inline <style>.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.resolve(__dirname, '..', 'Blog');
const PILOT = 'chto-takoe-rag-sistemy.html';

const HEADER_BLOCK = `<header class="header" id="header"><div class="hd-inner">
    <a href="../index.html" class="logo"><span class="logo-mark">FA</span><span>FlowAi</span></a>
    <nav class="nav" id="nav">
        <button class="nav-close" id="navClose" type="button" aria-label="Закрыть"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
        <div class="dropdown"><span class="dropdown-toggle">Боты</span><div class="dropdown-menu"><a href="../whatsapp-bot.html">WhatsApp-бот</a><a href="../telegram-bot.html">Telegram-бот</a><a href="../voice-manager-bot.html">Голосовой менеджер</a><a href="../blogger-bot.html">Blogger-бот</a><a href="../rss-bot.html">RSS-автопостинг</a></div></div>
        <div class="dropdown"><span class="dropdown-toggle">ИИ-решения</span><div class="dropdown-menu"><a href="../chatbot-rag.html">RAG-чатбот</a><a href="../ai-assistant-ceo.html">ИИ для CEO</a><a href="../auto-kp-bot.html">КП-бот</a><a href="../swift-invoice.html">Инвойс-бот</a><a href="../nutritionist-bot.html">Нутрициолог-бот</a><a href="../ai-research-bot.html">ИИ-исследователь</a></div></div>
        <div class="dropdown"><span class="dropdown-toggle">Разработка</span><div class="dropdown-menu"><a href="../website-dev.html">Создание сайтов</a><a href="../brand-video.html">Брендовое видео</a><a href="../complex-solution.html">Комплексное решение</a></div></div>
        <div class="dropdown"><span class="dropdown-toggle">О нас</span><div class="dropdown-menu"><a href="../o-kompanii.html">О компании</a><a href="../kak-my-rabotaem.html">Как мы работаем</a></div></div>
        <a href="index.html">Блог</a><a href="../kontakty.html">Контакты</a>
    </nav>
    <div class="hd-btns">
        <a href="tel:+77787806540" class="btn-call"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>Позвонить нам</a>
        <a href="https://wa.me/77787806540" target="_blank" class="icon-btn wa" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
        <a href="https://t.me/FlowAItest_bot" target="_blank" class="icon-btn tg" aria-label="Telegram"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.04 15.58l-.37 5.23c.53 0 .76-.23 1.04-.5l2.5-2.39 5.18 3.79c.95.52 1.62.25 1.88-.88L22.9 3.82c.31-1.4-.5-1.95-1.43-1.6L1.24 9.95c-1.36.53-1.34 1.3-.23 1.65l5.1 1.59 11.84-7.47c.56-.36 1.07-.16.65.2"/></svg></a>
        <button class="theme-toggle" type="button" aria-label="Тема"><svg class="i-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"/></svg><svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg><svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></button>
    </div>
    <button class="burger" id="burger" aria-label="Меню"><span></span><span></span><span></span></button>
</div></header>
<div class="nav-backdrop" id="navBackdrop"></div>`;

const FOOTER_BLOCK = `<footer class="footer"><div class="container">
    <div class="footer-grid">
        <div class="footer-col"><h4>О FlowAi</h4><ul><li><a href="../kak-my-rabotaem.html">Как мы работаем</a></li><li><a href="../o-kompanii.html">О компании</a></li><li><a href="index.html">Блог</a></li><li><a href="../kontakty.html">Контакты</a></li></ul></div>
        <div class="footer-col"><h4>Все решения</h4><ul><li><a href="../whatsapp-bot.html">WhatsApp-бот</a></li><li><a href="../telegram-bot.html">Telegram-бот</a></li><li><a href="../voice-manager-bot.html">Голосовой менеджер</a></li><li><a href="../chatbot-rag.html">RAG-чатбот</a></li><li><a href="../ai-assistant-ceo.html">ИИ для CEO</a></li></ul></div>
        <div class="footer-col"><h4>Контакты</h4><ul><li><a href="https://wa.me/77787806540" target="_blank">WhatsApp</a></li><li><a href="https://t.me/FlowAItest_bot" target="_blank">Telegram</a></li><li><a href="tel:+77787806540">Позвонить нам</a></li><li><a href="mailto:7806540@gmail.com">7806540@gmail.com</a></li></ul></div>
        <div class="footer-col"><h4>FlowAi.kz</h4><ul><li>пр. Республики, д. 68</li><li>Астана, Казахстан</li><li><small>© 2024–2026 FlowAi</small></li></ul></div>
    </div>
    <div class="footer-bottom"><span>FlowAi — автоматизация бизнеса на ИИ</span><span>Казахстан · СНГ · 2026</span></div>
</div></footer>`;

const FLOAT_AND_SCRIPTS = `<a href="https://wa.me/77787806540" target="_blank" class="wa-float" id="waFloat"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
<button class="scroll-top" id="scrollTop">↑</button>

<script>(function(){var s=document.createElement('script');s.src='https://voicyfy.ru/static/gemini-31-widget.js';s.dataset.assistantId='a2f68bf8-1968-4d08-9410-acaafcfb7a91';s.dataset.server='https://voicyfy.ru';s.dataset.position='bottom-right';s.async=true;document.head.appendChild(s);})();
(function(){var F=/Gemini\\s*3\\.1\\s*Flash\\s*Live/gi,T='FlowAi-бот';function wS(r,v){if(!r)return;v(r);var a=r.querySelectorAll?r.querySelectorAll('*'):[];for(var i=0;i<a.length;i++)if(a[i].shadowRoot)wS(a[i].shadowRoot,v);}function rep(r){if(!r)return;var w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT,null,false),n,h=[];while((n=w.nextNode())){if(n.nodeValue&&F.test(n.nodeValue))h.push(n);F.lastIndex=0;}h.forEach(function(n){n.nodeValue=n.nodeValue.replace(F,T);});if(r.querySelectorAll)r.querySelectorAll('[title],[aria-label],[placeholder],[alt]').forEach(function(e){['title','aria-label','placeholder','alt'].forEach(function(a){var v=e.getAttribute(a);if(v&&F.test(v)){e.setAttribute(a,v.replace(F,T));F.lastIndex=0;}});});}function p(){wS(document,rep);}new MutationObserver(p).observe(document.documentElement,{childList:true,subtree:true,characterData:true});[300,800,1600,3000,6000].forEach(function(ms){setTimeout(p,ms);});})();</script>
<script src="../assets/js/theme-toggle.js"></script>
<script>(function(){
var obs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)e.target.classList.add('v')})},{threshold:.08});document.querySelectorAll('.fi').forEach(function(e){obs.observe(e)});
document.querySelectorAll('.faq-q').forEach(function(b){b.addEventListener('click',function(){var i=b.parentElement,o=i.classList.contains('active');i.parentElement.querySelectorAll('.faq-item').forEach(function(x){x.classList.remove('active')});if(!o)i.classList.add('active');})});
var bg=document.getElementById('burger'),nv=document.getElementById('nav'),nc=document.getElementById('navClose'),nb=document.getElementById('navBackdrop');function cN(){bg&&bg.classList.remove('open');nv&&nv.classList.remove('open');nb&&nb.classList.remove('open');document.body.classList.remove('nav-open');nv&&nv.querySelectorAll('.dropdown').forEach(function(d){d.classList.remove('mob-open')})}function oN(){bg&&bg.classList.add('open');nv&&nv.classList.add('open');nb&&nb.classList.add('open');document.body.classList.add('nav-open')}if(nb)nb.addEventListener('click',cN);if(nc)nc.addEventListener('click',cN);if(bg&&nv){bg.addEventListener('click',function(e){e.stopPropagation();nv.classList.contains('open')?cN():oN()});nv.querySelectorAll('.dropdown-toggle').forEach(function(t){t.addEventListener('click',function(e){if(window.innerWidth<=1100){e.preventDefault();e.stopPropagation();var d=t.closest('.dropdown'),wo=d.classList.contains('mob-open');nv.querySelectorAll('.dropdown').forEach(function(x){x.classList.remove('mob-open')});if(!wo)d.classList.add('mob-open')}})});nv.querySelectorAll('a').forEach(function(a){a.addEventListener('click',cN)});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nv.classList.contains('open'))cN()});window.addEventListener('resize',function(){if(window.innerWidth>1100&&nv.classList.contains('open'))cN()})}
var hdr=document.getElementById('header'),wf=document.getElementById('waFloat'),stb=document.getElementById('scrollTop');addEventListener('scroll',function(){var s=scrollY;hdr.classList.toggle('scrolled',s>60);wf.classList.toggle('show',s>300);stb.classList.toggle('show',s>300)});stb.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});
})();</script>
<script>(function(){document.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;var h=a.getAttribute('href')||'';if(h.indexOf('wa.me')===-1&&h.indexOf('whatsapp.com')===-1&&(a.className||'').indexOf('btn-wa')===-1)return;if(typeof gtag==='function'){gtag('event','whatsapp_click',{event_category:'engagement',event_label:h,value:1});gtag('event','conversion',{send_to:'AW-964186887/DfhdCMSR850cEIem4csD',value:1.0,currency:'USD'})}if(typeof ym==='function'){ym(108596983,'reachGoal','whatsapp_click')}},true)})();</script>`;

// Add green accent to the last phrase of the title (last 1-3 words) or after <br>
function addTitleAccent(titleHtml) {
    // Prefer a gtext span already in old articles
    const m = titleHtml.match(/<span\s+class=["']gtext["'][^>]*>([\s\S]*?)<\/span>/);
    if (m) {
        return titleHtml.replace(m[0], `<span class="accent">${m[1]}</span>`);
    }
    // Split on <br> — everything after <br> becomes accent
    if (/<br\s*\/?>/i.test(titleHtml)) {
        return titleHtml.replace(/<br\s*\/?>([\s\S]+)$/i, (_, rest) => {
            const trimmed = rest.replace(/^\s+/, '');
            return ` <span class="accent">${trimmed}</span>`;
        });
    }
    // Colon split — everything after ":" becomes accent
    if (titleHtml.includes(':')) {
        return titleHtml.replace(/:\s*([\s\S]+)$/, (_, rest) => `: <span class="accent">${rest.trim()}</span>`);
    }
    // Fallback — accent last 2 words
    const words = titleHtml.trim().split(/\s+/);
    if (words.length >= 2) {
        const last = words.slice(-2).join(' ');
        const head = words.slice(0, -2).join(' ');
        return `${head} <span class="accent">${last}</span>`;
    }
    return titleHtml;
}

// Accent last 1-2 words of an h2
function accentH2(inner) {
    if (/<span[^>]*class=["'][^"']*accent/.test(inner)) return inner;
    const cleanText = inner.replace(/<[^>]+>/g, '').trim();
    const words = cleanText.split(/\s+/);
    if (words.length < 2) return inner;
    const take = Math.min(words.length >= 4 ? 2 : 1, 2);
    const tail = words.slice(-take).join(' ');
    const head = words.slice(0, -take).join(' ');
    // Use cleaned text to avoid injecting spans into nested tags
    return `${head} <span class="accent">${tail}</span>`;
}

// Extract article metadata + content from old HTML
function parseArticle(html) {
    // H1 (inside article-hero)
    const h1m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    const h1Raw = h1m ? h1m[1].trim() : 'Статья';

    // Lead
    const leadm = html.match(/<p\s+class=["'][^"']*article-lead[^"']*["'][^>]*>([\s\S]*?)<\/p>/);
    const lead = leadm ? leadm[1].trim() : '';

    // Breadcrumb category (last span after final svg in breadcrumb)
    const bcm = html.match(/<nav\s+class=["'][^"']*breadcrumb[^"']*["'][^>]*>([\s\S]*?)<\/nav>/);
    let category = 'Блог';
    if (bcm) {
        const sp = [...bcm[1].matchAll(/<span[^>]*>([\s\S]*?)<\/span>/g)];
        if (sp.length) category = sp[sp.length - 1][1].replace(/<[^>]+>/g, '').trim();
    }

    // Date & read-time
    const datem = html.match(/<span\s+class=["']article-date["'][^>]*>([\s\S]*?)<\/span>/);
    const date = datem ? datem[1].replace(/<[^>]+>/g, '').trim() : '';
    const rtm = html.match(/<span\s+class=["']read-time["'][^>]*>([\s\S]*?)<\/span>/);
    const readTime = rtm ? rtm[1].replace(/<[^>]+>/g, '').replace(/&#128337;|\u{1F551}/gu, '').trim() : '';

    // Tags (article-meta)
    const tags = [];
    const mm = html.match(/<div\s+class=["']article-meta[^"']*["'][^>]*>([\s\S]*?)<\/div>/);
    if (mm) {
        [...mm[1].matchAll(/<span\s+class=["']tag[^"']*["'][^>]*>([\s\S]*?)<\/span>/g)].forEach(m => {
            tags.push(m[1].replace(/<[^>]+>/g, '').trim());
        });
    }

    // Hero image
    const heroImgM = html.match(/<div\s+class=["']hero-img-wrap[^"']*["'][^>]*>\s*<img\s+([^>]*?)>/);
    let heroSrc = '', heroAlt = '';
    if (heroImgM) {
        const src = heroImgM[1].match(/src=["']([^"']+)["']/);
        const alt = heroImgM[1].match(/alt=["']([^"']+)["']/);
        heroSrc = src ? src[1] : '';
        heroAlt = alt ? alt[1] : '';
    }

    // Stats-bar
    const stats = [];
    const sbm = html.match(/<div\s+class=["']stats-bar["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/);
    if (sbm) {
        [...sbm[1].matchAll(/<div\s+class=["'][^"']*sbar-num[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<div\s+class=["']sbar-label["'][^>]*>([\s\S]*?)<\/div>/g)].forEach(m => {
            stats.push({ val: m[1].replace(/<[^>]+>/g, '').trim(), label: m[2].replace(/<[^>]+>/g, '').trim() });
        });
    }

    // Main content — everything inside article-content.prose, minus FAQ section and CTA-block and trailing notes
    const pm = html.match(/<article\s+class=["'][^"']*prose[^"']*["'][^>]*>([\s\S]*?)<\/article>/);
    const proseRaw = pm ? pm[1] : '';

    // Extract FAQ from prose
    let faq = [];
    const faqSecM = proseRaw.match(/<div\s+class=["']faq-section[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*(?=<div\s+class=["']cta-block|<p|$)/);
    if (faqSecM) {
        [...faqSecM[1].matchAll(/<div\s+class=["']faq-item["'][^>]*>[\s\S]*?<span>([\s\S]*?)<\/span>[\s\S]*?<div\s+class=["']faq-a["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/g)].forEach(m => {
            faq.push({ q: m[1].trim(), a: m[2].trim() });
        });
    }

    // Strip FAQ + CTA + trailing italic note from prose body
    let proseBody = proseRaw
        .replace(/<div\s+class=["']faq-section[\s\S]*?<\/div>\s*(?=<div\s+class=["']cta-block|<p|$)/g, '')
        .replace(/<div\s+class=["']cta-block[\s\S]*?<\/div>/g, '')
        .replace(/<p[^>]*><em>[\s\S]*?<\/em><\/p>/g, '');

    return { h1Raw, lead, category, date, readTime, tags, heroSrc, heroAlt, stats, proseBody, faq };
}

// Transform prose body element-by-element into pilot classes
function transformProse(prose) {
    let out = prose;

    // Remove fi class (keep animation for stats only)
    out = out.replace(/\s+class=["']fi["']/g, '');
    out = out.replace(/(class=["'][^"']*)\s+fi(["'])/g, '$1$2');
    out = out.replace(/(class=["'])fi\s+/g, '$1');

    // Section-img → post-section-img
    out = out.replace(/<div\s+class=["']section-img["'][^>]*>([\s\S]*?)<\/div>/g,
        (_, inner) => `<div class="post-section-img">${inner}</div>`);

    // pain-grid → post-grid-3 (cards with num)
    out = out.replace(/<div\s+class=["']pain-grid[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*(?=<h2|<p|<div\s+class=["'](?!pain-card)|<blockquote|$)/g,
        (_, inner) => {
            const cards = [...inner.matchAll(/<div\s+class=["']pain-card[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*(?=<div\s+class=["']pain-card|$)/g)];
            const cardHtml = cards.map(c => {
                const numM = c[1].match(/<div\s+class=["']pain-num["'][^>]*>([\s\S]*?)<\/div>/);
                const h3M = c[1].match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
                const pM = c[1].match(/<p[^>]*>([\s\S]*?)<\/p>/);
                const num = numM ? numM[1].replace(/[^\d]/g, '') || '' : '';
                return `<div class="post-mini-card">${num ? `<div class="num">${num}</div>` : ''}${h3M ? `<h3>${h3M[1]}</h3>` : ''}${pM ? `<p>${pM[1]}</p>` : ''}</div>`;
            }).join('');
            return `<div class="post-grid-3">${cardHtml}</div>`;
        });

    // feat-grid / use-grid / roi-grid / access-grid / compare-grid-3 → post-grid-3
    out = out.replace(/<div\s+class=["'](feat-grid|use-grid|roi-grid|access-grid|trend-grid)[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*(?=<h2|<p|<blockquote|<div\s+class=["'](?!feat-card|use-card|roi-card|access-card|trend-card)|$)/g,
        (_, __, inner) => {
            const cards = [...inner.matchAll(/<div\s+class=["'](?:feat-card|use-card|roi-card|access-card|trend-card)[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*(?=<div\s+class=["'](?:feat-card|use-card|roi-card|access-card|trend-card)|$)/g)];
            const cardHtml = cards.map(c => {
                const h3M = c[1].match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
                const pM = c[1].match(/<p[^>]*>([\s\S]*?)<\/p>/);
                return `<div class="post-mini-card">${h3M ? `<h3>${h3M[1]}</h3>` : ''}${pM ? `<p>${pM[1]}</p>` : ''}</div>`;
            }).join('');
            return `<div class="post-grid-3">${cardHtml}</div>`;
        });

    // kpi-grid → post-grid-3 with post-kpi
    out = out.replace(/<div\s+class=["']kpi-grid[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*(?=<h2|<p|<blockquote|<div\s+class=["'](?!kpi-card)|$)/g,
        (_, inner) => {
            const cards = [...inner.matchAll(/<div\s+class=["']kpi-card[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*(?=<div\s+class=["']kpi-card|$)/g)];
            const cardHtml = cards.map((c, i) => {
                const valM = c[1].match(/<div\s+class=["'][^"']*kpi-val[^"']*["'][^>]*>([\s\S]*?)<\/div>/);
                const h3M = c[1].match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
                const pM = c[1].match(/<p[^>]*>([\s\S]*?)<\/p>/);
                const purple = i % 2 === 1 ? ' p' : '';
                return `<div class="post-mini-card post-kpi">${valM ? `<div class="val${purple}">${valM[1]}</div>` : ''}${h3M ? `<h3>${h3M[1]}</h3>` : ''}${pM ? `<p>${pM[1]}</p>` : ''}</div>`;
            }).join('');
            return `<div class="post-grid-3">${cardHtml}</div>`;
        });

    // compare-grid / compare-pair → post-grid-2
    out = out.replace(/<div\s+class=["']compare-grid[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*(?=<h2|<p|<blockquote|$)/g,
        (_, inner) => {
            const cards = [...inner.matchAll(/<div\s+class=["']compare-card[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*(?=<div\s+class=["']compare-card|$)/g)];
            const cardHtml = cards.map(c => {
                const h3M = c[1].match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
                const pM = c[1].match(/<p[^>]*>([\s\S]*?)<\/p>/);
                return `<div class="post-mini-card">${h3M ? `<h3>${h3M[1]}</h3>` : ''}${pM ? `<p>${pM[1]}</p>` : ''}</div>`;
            }).join('');
            return `<div class="post-grid-2">${cardHtml}</div>`;
        });

    // process-steps → post-grid-3 with num
    out = out.replace(/<div\s+class=["']process-steps[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*(?=<h2|<p|<blockquote|$)/g,
        (_, inner) => {
            const cards = [...inner.matchAll(/<div\s+class=["']process-step[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*(?=<div\s+class=["']process-step|$)/g)];
            const cardHtml = cards.map((c, i) => {
                const h3M = c[1].match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
                const pM = c[1].match(/<p[^>]*>([\s\S]*?)<\/p>/);
                return `<div class="post-mini-card"><div class="num">${i + 1}</div>${h3M ? `<h3>${h3M[1]}</h3>` : ''}${pM ? `<p>${pM[1]}</p>` : ''}</div>`;
            }).join('');
            return `<div class="post-grid-3">${cardHtml}</div>`;
        });

    // case-block → blockquote (simplified)
    out = out.replace(/<div\s+class=["']case-block[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*(?=<h2|<p|<blockquote|$)/g,
        (_, inner) => {
            // Pull inner paragraphs & result text
            const ps = [...inner.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map(m => m[1]).join(' ');
            const h3m = inner.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
            const result = inner.match(/<div\s+class=["']case-result["'][^>]*>([\s\S]*?)<\/div>/);
            const head = h3m ? `<strong>${h3m[1].replace(/[📋⚡🚀💼🎯💡]/g, '').trim()}:</strong> ` : '';
            const tail = result ? ` <strong>${result[1]}</strong>` : '';
            return `<blockquote>${head}${ps}${tail}</blockquote>`;
        });

    // Strip emoji icons in feat-icon blocks that might still linger
    out = out.replace(/<div\s+class=["']feat-icon[^"']*["'][^>]*>[\s\S]*?<\/div>/g, '');
    out = out.replace(/<div\s+class=["']pain-num[^"']*["'][^>]*>[\s\S]*?<\/div>/g, '');

    // Remove id="sN" from h2s (not needed without TOC)
    out = out.replace(/<h2\s+id=["']s\d+["'][^>]*>([\s\S]*?)<\/h2>/g, (_, inner) => `<h2>${accentH2(inner.trim())}</h2>`);

    // Also accent regular h2 without id
    out = out.replace(/<h2(?![^>]*class=["'][^"']*post-)[^>]*>([\s\S]*?)<\/h2>/g, (match, inner) => {
        if (/accent/.test(inner)) return match;
        return `<h2>${accentH2(inner.trim())}</h2>`;
    });

    return out.trim();
}

function buildStatsBar(stats) {
    if (!stats.length) return '';
    const items = stats.slice(0, 4).map(s =>
        `    <div class="stat-item fi"><div class="big">${s.val}</div><p>${s.label}</p></div>`
    ).join('\n');
    return `<div class="stats-bar"><div class="container"><div class="stats-grid">
${items}
</div></div></div>`;
}

function buildFaq(faq) {
    if (!faq.length) return '';
    const items = faq.map(f =>
        `        <div class="faq-item"><button class="faq-q"><span>${f.q}</span><span class="ico">+</span></button><div class="faq-a">${f.a}</div></div>`
    ).join('\n');
    return `<section class="s-alt"><div class="container">
    <div class="eyebrow">FAQ</div>
    <h2 class="section-title">Частые <span class="accent">вопросы</span></h2>
    <div class="faq-list" style="margin-top:32px;max-width:900px">
${items}
    </div>
</div></section>`;
}

const CONSULT_BLOCK = `<section><div class="container"><div class="consult fi">
    <div class="consult-txt"><h2>Готовы внедрить ИИ в бизнес?</h2><p>Покажем, как автоматизация работает на ваших процессах. Демо за 30 минут — оплата только после результата.</p></div>
    <div class="consult-sticker"><div class="inner">30 МИН<small>бесплатно</small></div></div>
    <form onsubmit="event.preventDefault(); window.open('https://wa.me/77787806540','_blank');"><input type="text" placeholder="Имя" required><input type="tel" placeholder="+7 (000) 000-00-00" required><button class="btn btn-primary">Получить демо</button><div class="consult-legal">Нажимая кнопку, вы соглашаетесь на обработку данных</div></form>
</div></div></section>`;

function rebuildBody(meta) {
    const titleWithAccent = addTitleAccent(meta.h1Raw);
    const prose = transformProse(meta.proseBody);
    const meta_line = [meta.category, meta.date, meta.readTime].filter(Boolean).map(x => `<span>${x}</span>`).join('<span class="sep">·</span>');
    const eyebrow = `<div class="post-eyebrow">
        <a href="index.html">Блог</a>${meta_line ? '<span class="sep">·</span>' + meta_line : ''}
    </div>`;

    const hero = meta.heroSrc ? `<div class="post-hero-img">
        <img src="${meta.heroSrc}" alt="${meta.heroAlt}" loading="lazy">
    </div>` : '';

    return `
${HEADER_BLOCK}

<section style="padding-top:40px"><div class="container">
    ${eyebrow}
    <h1 class="post-title">${titleWithAccent}</h1>
    ${meta.lead ? `<p class="post-lead">${meta.lead}</p>` : ''}
    ${hero}
</div></section>

${buildStatsBar(meta.stats)}

<section><div class="container"><div class="post-body">
${prose}
</div></div></section>

${buildFaq(meta.faq)}

${CONSULT_BLOCK}

${FOOTER_BLOCK}

${FLOAT_AND_SCRIPTS}
</body>
</html>
`;
}

function transform(filePath) {
    const html = fs.readFileSync(filePath, 'utf8');

    // Pull <head>...</head> as-is, then drop its <style>...</style> block
    const headM = html.match(/<head>([\s\S]*?)<\/head>/i);
    if (!headM) { console.log('skip (no head):', filePath); return false; }
    let head = headM[0]
        .replace(/<style>[\s\S]*?<\/style>/gi, '')
        .replace(/\n\s*\n\s*\n+/g, '\n\n');

    const meta = parseArticle(html);
    if (!meta.h1Raw || meta.h1Raw === 'Статья') {
        console.log('skip (no h1):', filePath);
        return false;
    }

    const body = rebuildBody(meta);

    const out = `<!DOCTYPE html>
<html lang="ru" data-theme="dark">
${head}
<body>
${body}`;

    fs.writeFileSync(filePath, out, 'utf8');
    console.log('ok:', path.basename(filePath));
    return true;
}

const files = fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.html') && f !== 'index.html' && f !== PILOT);

const only = process.argv[2];
const targets = only ? files.filter(f => f.includes(only)) : files;
console.log(`transforming ${targets.length} files…`);
let done = 0;
for (const f of targets) {
    try { if (transform(path.join(BLOG_DIR, f))) done++; }
    catch (e) { console.error('ERR:', f, e.message); }
}
console.log(`done: ${done}/${targets.length}`);
