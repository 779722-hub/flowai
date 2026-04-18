/**
 * Full blog article redesign — strips inline styles and uses only shared theme.css.
 * Per-article content, images, and JSON-LD are preserved 1:1.
 */
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = resolve(__dirname, '..', 'Blog');

const THEME_PRELOAD = `<script>(function(){try{var m=localStorage.getItem('flowai-theme')||'auto',r=m;if(m==='auto'){var h=(new Date().getUTCHours()+5)%24;r=(h>=8&&h<20)?'light':'dark';}document.documentElement.setAttribute('data-theme',r);}catch(e){}})();</script>`;

const FONTS_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/theme.css">`;

const NEW_HEADER = `<header class="header" id="header"><div class="hd-inner">
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

const NEW_FOOTER = `<footer class="footer"><div class="container">
    <div class="footer-grid">
        <div class="footer-col"><h4>О FlowAi</h4><ul><li><a href="../kak-my-rabotaem.html">Как мы работаем</a></li><li><a href="../o-kompanii.html">О компании</a></li><li><a href="index.html">Блог</a></li><li><a href="../kontakty.html">Контакты</a></li></ul></div>
        <div class="footer-col"><h4>Все решения</h4><ul><li><a href="../whatsapp-bot.html">WhatsApp-бот</a></li><li><a href="../telegram-bot.html">Telegram-бот</a></li><li><a href="../voice-manager-bot.html">Голосовой менеджер</a></li><li><a href="../chatbot-rag.html">RAG-чатбот</a></li><li><a href="../ai-assistant-ceo.html">ИИ для CEO</a></li></ul></div>
        <div class="footer-col"><h4>Контакты</h4><ul><li><a href="https://wa.me/77787806540" target="_blank">WhatsApp</a></li><li><a href="https://t.me/FlowAItest_bot" target="_blank">Telegram</a></li><li><a href="tel:+77787806540">Позвонить нам</a></li><li><a href="mailto:7806540@gmail.com">7806540@gmail.com</a></li></ul></div>
        <div class="footer-col"><h4>FlowAi.kz</h4><ul><li>пр. Республики, д. 68</li><li>Астана, Казахстан</li><li><small>© 2024–2026 FlowAi</small></li></ul></div>
    </div>
    <div class="footer-bottom"><span>FlowAi — автоматизация бизнеса на ИИ</span><span>Казахстан · СНГ · 2026</span></div>
</div></footer>`;

const FLOAT_BTNS = `<a href="https://wa.me/77787806540" target="_blank" class="wa-float" id="waFloat"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
<button class="scroll-top" id="scrollTop">↑</button>`;

const TAIL_JS = `<script>(function(){var s=document.createElement('script');s.src='https://voicyfy.ru/static/gemini-31-widget.js';s.dataset.assistantId='a2f68bf8-1968-4d08-9410-acaafcfb7a91';s.dataset.server='https://voicyfy.ru';s.dataset.position='bottom-right';s.async=true;document.head.appendChild(s);})();
(function(){var F=/Gemini\\s*3\\.1\\s*Flash\\s*Live/gi,T='FlowAi-бот';function wS(r,v){if(!r)return;v(r);var a=r.querySelectorAll?r.querySelectorAll('*'):[];for(var i=0;i<a.length;i++)if(a[i].shadowRoot)wS(a[i].shadowRoot,v);}function rep(r){if(!r)return;var w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT,null,false),n,h=[];while((n=w.nextNode())){if(n.nodeValue&&F.test(n.nodeValue))h.push(n);F.lastIndex=0;}h.forEach(function(n){n.nodeValue=n.nodeValue.replace(F,T);});if(r.querySelectorAll)r.querySelectorAll('[title],[aria-label],[placeholder],[alt]').forEach(function(e){['title','aria-label','placeholder','alt'].forEach(function(a){var v=e.getAttribute(a);if(v&&F.test(v)){e.setAttribute(a,v.replace(F,T));F.lastIndex=0;}});});}function p(){wS(document,rep);}new MutationObserver(p).observe(document.documentElement,{childList:true,subtree:true,characterData:true});[300,800,1600,3000,6000].forEach(function(ms){setTimeout(p,ms);});})();</script>
<script src="../assets/js/theme-toggle.js"></script>
<script>(function(){
var obs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)e.target.classList.add('v')})},{threshold:.08});document.querySelectorAll('.fi').forEach(function(e){obs.observe(e)});
document.querySelectorAll('.faq-q').forEach(function(b){b.addEventListener('click',function(){var i=b.parentElement,o=i.classList.contains('active');i.parentElement.querySelectorAll('.faq-item').forEach(function(x){x.classList.remove('active')});if(!o)i.classList.add('active');})});
var bg=document.getElementById('burger'),nv=document.getElementById('nav'),nc=document.getElementById('navClose'),nb=document.getElementById('navBackdrop');function cN(){bg&&bg.classList.remove('open');nv&&nv.classList.remove('open');nb&&nb.classList.remove('open');document.body.classList.remove('nav-open');nv&&nv.querySelectorAll('.dropdown').forEach(function(d){d.classList.remove('mob-open')})}function oN(){bg&&bg.classList.add('open');nv&&nv.classList.add('open');nb&&nb.classList.add('open');document.body.classList.add('nav-open')}if(nb)nb.addEventListener('click',cN);if(nc)nc.addEventListener('click',cN);if(bg&&nv){bg.addEventListener('click',function(e){e.stopPropagation();nv.classList.contains('open')?cN():oN()});nv.querySelectorAll('.dropdown-toggle').forEach(function(t){t.addEventListener('click',function(e){if(window.innerWidth<=1100){e.preventDefault();e.stopPropagation();var d=t.closest('.dropdown'),wo=d.classList.contains('mob-open');nv.querySelectorAll('.dropdown').forEach(function(x){x.classList.remove('mob-open')});if(!wo)d.classList.add('mob-open')}})});nv.querySelectorAll('a').forEach(function(a){a.addEventListener('click',cN)});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nv.classList.contains('open'))cN()});window.addEventListener('resize',function(){if(window.innerWidth>1100&&nv.classList.contains('open'))cN()})}
var hdr=document.getElementById('header'),wf=document.getElementById('waFloat'),stb=document.getElementById('scrollTop');addEventListener('scroll',function(){var s=scrollY;hdr.classList.toggle('scrolled',s>60);wf.classList.toggle('show',s>300);stb.classList.toggle('show',s>300)});stb.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});
var sections=document.querySelectorAll('[id^="s"]'),tocLinks=document.querySelectorAll('.toc a');if(sections.length&&tocLinks.length){var tocObs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){tocLinks.forEach(function(l){l.classList.remove('active')});var link=document.querySelector('.toc a[href="#'+e.target.id+'"]');if(link)link.classList.add('active')}})},{rootMargin:'-100px 0px -60% 0px',threshold:0});sections.forEach(function(s){tocObs.observe(s)});}
})();</script>
<script>(function(){document.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;var h=a.getAttribute('href')||'';if(h.indexOf('wa.me')===-1&&h.indexOf('whatsapp.com')===-1&&(a.className||'').indexOf('btn-wa')===-1)return;if(typeof gtag==='function'){gtag('event','whatsapp_click',{event_category:'engagement',event_label:h,value:1});gtag('event','conversion',{send_to:'AW-964186887/DfhdCMSR850cEIem4csD',value:1.0,currency:'USD'})}if(typeof ym==='function'){ym(108596983,'reachGoal','whatsapp_click')}},true)})();</script>`;

function extractBetween(html, start, end) {
    const i = html.indexOf(start);
    if (i < 0) return '';
    const j = html.indexOf(end, i);
    if (j < 0) return '';
    return html.slice(i, j + end.length);
}

function rewriteButtonClasses(html) {
    // Replace old color buttons with theme buttons
    return html
        .replace(/class="btn btn-wa btn-sm"/g, 'class="btn btn-primary"')
        .replace(/class="btn btn-tg btn-sm"/g, 'class="btn btn-outline"')
        .replace(/class="btn btn-wa"/g, 'class="btn btn-primary"')
        .replace(/class="btn btn-tg"/g, 'class="btn btn-outline"')
        .replace(/class="btn btn-pri"/g, 'class="btn btn-primary"')
        .replace(/class="btn btn-gold"/g, 'class="btn btn-primary"')
        .replace(/class="btn btn-blue"/g, 'class="btn btn-outline"')
        .replace(/class="btn btn-o"/g, 'class="btn btn-outline"')
        .replace(/class="btn btn-mag"/g, 'class="btn btn-primary"');
}

function transform(html, filename) {
    // 1. <html> — add data-theme
    html = html.replace(/<html\s+lang="ru">/, '<html lang="ru" data-theme="dark">');

    // 2. Strip inline <style>...</style>
    html = html.replace(/<style>[\s\S]*?<\/style>/, '');

    // 3. Replace the Google Fonts <link> (Space Grotesk) with Inter+Manrope + theme.css
    html = html.replace(
        /<link\s+rel="preconnect"[^>]*>[\s\S]*?<link\s+href="https:\/\/fonts\.googleapis\.com[^"]+"\s+rel="stylesheet">/,
        FONTS_LINK
    );

    // 4. Inject theme preload right after <head>
    html = html.replace(/<head>/, `<head>\n    ${THEME_PRELOAD}`);

    // 5. Replace <header>...</header> with shared
    html = html.replace(/<header\s+class="header"[\s\S]*?<\/header>/, NEW_HEADER);

    // 6. Replace <footer>...</footer> with shared
    html = html.replace(/<footer\s+class="footer">[\s\S]*?<\/footer>/, NEW_FOOTER);

    // 7. Replace floating buttons (wa-float, scroll-top, back-btn) — keep only wa + scroll-top
    html = html.replace(/<a[^>]*class="float-wa"[\s\S]*?<\/a>/, '');
    html = html.replace(/<button[^>]*class="scroll-top"[^>]*>.*?<\/button>/, '');
    html = html.replace(/<a[^>]*class="back-btn"[^>]*>[\s\S]*?<\/a>/, '');
    // Insert new floats before end of body
    html = html.replace(/<\/body>/, FLOAT_BTNS + '\n</body>');

    // 8. Strip old inline <script> blocks (the burger+scroll+faq+toc code) but keep any application/ld+json
    // Find all <script>...</script> blocks (not with src), strip them unless they are type="application/ld+json"
    html = html.replace(/<script(?![^>]*type="application\/ld\+json")(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/g, '');
    // Also strip scripts with src pointing to googletagmanager/unsplash/etc? Keep GA and Yandex.
    // Actually re-add nothing — we'll inject shared TAIL_JS. GA/Yandex are in <head>, stay.

    // 9. Inject shared TAIL_JS before </body>
    html = html.replace(/<\/body>/, TAIL_JS + '\n</body>');

    // 10. Rewrite button classes
    html = rewriteButtonClasses(html);

    // 11. Add <section class="article-hero"> wrapper if it's there but without new class system
    // (it's already there from original; styles in theme.css handle it)

    // 12. Update cta-block text markers — leave as-is but styled

    // 13. Old old "back-btn" in sidebar would be unstyled; ensure nav-mob-btns inside nav are removed
    html = html.replace(/<div class="nav-mob-btns"[\s\S]*?<\/div>/g, '');

    // 14. Remove any stray "scroll-top" or "float-wa" references from old JS context
    // Already handled above

    return html;
}

const files = readdirSync(BLOG_DIR).filter(f => f.endsWith('.html') && f !== 'index.html');
console.log(`Redesigning ${files.length} articles...`);

let ok = 0;
for (const f of files) {
    const fullPath = join(BLOG_DIR, f);
    try {
        const input = readFileSync(fullPath, 'utf8');
        const output = transform(input, f);
        writeFileSync(fullPath, output, 'utf8');
        ok++;
        console.log('  ✓', f);
    } catch (err) {
        console.log('  ✗', f, err.message);
    }
}
console.log(`Done. ${ok}/${files.length} redesigned.`);
