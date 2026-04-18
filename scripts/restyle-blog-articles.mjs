import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = resolve(__dirname, '..', 'Blog');

// New :root palette replacing the old blue/indigo theme
const NEW_ROOT_VARS = `--bg:#0A0A0A;--bg-alt:#111111;--bg-card:#161616;--accent:#C3FF36;--accent-2:#9D6CFF;--accent-3:#B8E8BC;--glow:rgba(195,255,54,.25);--glow-2:rgba(157,108,255,.2);--wa:#25D366;--wa-glow:rgba(37,211,102,.3);--red:#ef4444;--green:#22c55e;--orange:#f59e0b;--purple:#9D6CFF;--pink:#ec4899;--indigo:#9D6CFF;--indigo-glow:rgba(157,108,255,.3);--text:#F5F5F5;--muted:#8A8A8A;--muted-2:#555555;--border:rgba(255,255,255,.08);--border-h:rgba(195,255,54,.35);--r:18px;--rs:12px;`;

// Preload script to set data-theme based on Astana time and localStorage
const THEME_PRELOAD = `<script>(function(){try{var m=localStorage.getItem('flowai-theme')||'auto',r=m;if(m==='auto'){var h=(new Date().getUTCHours()+5)%24;r=(h>=8&&h<20)?'light':'dark';}document.documentElement.setAttribute('data-theme',r);}catch(e){}})();</script>`;

// Shared FlowAi header with dropdown nav + theme toggle (for articles in Blog/)
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

// Shared FlowAi footer
const NEW_FOOTER = `<footer class="footer"><div class="container">
    <div class="footer-grid">
        <div class="footer-col"><h4>О FlowAi</h4><ul><li><a href="../kak-my-rabotaem.html">Как мы работаем</a></li><li><a href="../o-kompanii.html">О компании</a></li><li><a href="index.html">Блог</a></li><li><a href="../kontakty.html">Контакты</a></li></ul></div>
        <div class="footer-col"><h4>Все решения</h4><ul><li><a href="../whatsapp-bot.html">WhatsApp-бот</a></li><li><a href="../telegram-bot.html">Telegram-бот</a></li><li><a href="../voice-manager-bot.html">Голосовой менеджер</a></li><li><a href="../chatbot-rag.html">RAG-чатбот</a></li><li><a href="../ai-assistant-ceo.html">ИИ для CEO</a></li></ul></div>
        <div class="footer-col"><h4>Контакты</h4><ul><li><a href="https://wa.me/77787806540" target="_blank">WhatsApp</a></li><li><a href="https://t.me/FlowAItest_bot" target="_blank">Telegram</a></li><li><a href="tel:+77787806540">Позвонить нам</a></li><li><a href="mailto:7806540@gmail.com">7806540@gmail.com</a></li></ul></div>
        <div class="footer-col"><h4>FlowAi.kz</h4><ul><li>пр. Республики, д. 68</li><li>Астана, Казахстан</li><li><small>© 2024–2026 FlowAi</small></li></ul></div>
    </div>
    <div class="footer-bottom"><span>FlowAi — автоматизация бизнеса на ИИ</span><span>Казахстан · СНГ · 2026</span></div>
</div></footer>`;

// Shared nav + widget JS snippet (minified)
const SHARED_TAIL_JS = `<script>(function(){var s=document.createElement('script');s.src='https://voicyfy.ru/static/gemini-31-widget.js';s.dataset.assistantId='a2f68bf8-1968-4d08-9410-acaafcfb7a91';s.dataset.server='https://voicyfy.ru';s.dataset.position='bottom-right';s.async=true;document.head.appendChild(s);})();
(function(){var F=/Gemini\\s*3\\.1\\s*Flash\\s*Live/gi,T='FlowAi-бот';function wS(r,v){if(!r)return;v(r);var a=r.querySelectorAll?r.querySelectorAll('*'):[];for(var i=0;i<a.length;i++)if(a[i].shadowRoot)wS(a[i].shadowRoot,v);}function rep(r){if(!r)return;var w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT,null,false),n,h=[];while((n=w.nextNode())){if(n.nodeValue&&F.test(n.nodeValue))h.push(n);F.lastIndex=0;}h.forEach(function(n){n.nodeValue=n.nodeValue.replace(F,T);});if(r.querySelectorAll)r.querySelectorAll('[title],[aria-label],[placeholder],[alt]').forEach(function(e){['title','aria-label','placeholder','alt'].forEach(function(a){var v=e.getAttribute(a);if(v&&F.test(v)){e.setAttribute(a,v.replace(F,T));F.lastIndex=0;}});});}function p(){wS(document,rep);}new MutationObserver(p).observe(document.documentElement,{childList:true,subtree:true,characterData:true});[300,800,1600,3000,6000].forEach(function(ms){setTimeout(p,ms);});})();</script>
<script src="../assets/js/theme-toggle.js"></script>
<script>(function(){
var bg=document.getElementById('burger'),nv=document.getElementById('nav'),nc=document.getElementById('navClose'),nb=document.getElementById('navBackdrop');function cN(){bg&&bg.classList.remove('open');nv&&nv.classList.remove('open');nb&&nb.classList.remove('open');document.body.classList.remove('nav-open');nv&&nv.querySelectorAll('.dropdown').forEach(function(d){d.classList.remove('mob-open')})}function oN(){bg&&bg.classList.add('open');nv&&nv.classList.add('open');nb&&nb.classList.add('open');document.body.classList.add('nav-open')}if(nb)nb.addEventListener('click',cN);if(nc)nc.addEventListener('click',cN);if(bg&&nv){bg.addEventListener('click',function(e){e.stopPropagation();nv.classList.contains('open')?cN():oN()});nv.querySelectorAll('.dropdown-toggle').forEach(function(t){t.addEventListener('click',function(e){if(window.innerWidth<=1100){e.preventDefault();e.stopPropagation();var d=t.closest('.dropdown'),wo=d.classList.contains('mob-open');nv.querySelectorAll('.dropdown').forEach(function(x){x.classList.remove('mob-open')});if(!wo)d.classList.add('mob-open')}})});nv.querySelectorAll('a').forEach(function(a){a.addEventListener('click',cN)});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nv.classList.contains('open'))cN()});window.addEventListener('resize',function(){if(window.innerWidth>1100&&nv.classList.contains('open'))cN()})}
})();</script>`;

// Extra CSS overrides — injected after the existing inline <style> to fix
// z-index / font issues that surface once the new header is in place.
const OVERRIDES = `<style>
/* Restyle override — new theme tweaks for blog articles */
html{scroll-behavior:smooth}
body{font-family:'Inter',-apple-system,sans-serif;background:var(--bg);color:var(--text);line-height:1.75}
h1,h2,h3,h4{font-family:'Manrope','Inter',sans-serif;letter-spacing:-0.01em}
a{color:var(--accent);transition:color .2s}a:hover{color:var(--accent-2)}
/* Shared header styles from theme tokens (overrides the blue inline) */
.header{position:sticky;top:0;left:auto;right:auto;z-index:220;background:var(--bg);backdrop-filter:none;-webkit-backdrop-filter:none;border-bottom:1px solid var(--border)}
.header.scrolled{background:var(--bg);box-shadow:0 4px 20px rgba(0,0,0,.3)}
.hd-inner{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:16px;max-width:1440px;padding:14px clamp(16px,4vw,40px)}
.logo{display:flex;align-items:center;gap:10px;color:var(--text);font-family:'Manrope',sans-serif;font-weight:800;font-size:20px;letter-spacing:-0.02em;text-decoration:none}
.logo-mark{width:36px;height:36px;border-radius:10px;background:var(--accent);color:var(--accent-ink,#0A0A0A);display:grid;place-items:center;font-weight:800;font-size:16px}
.nav{display:flex;align-items:center;gap:4px;justify-self:center;flex-wrap:nowrap}
.nav>a,.nav .dropdown-toggle{position:relative;font-size:14px;font-weight:600;color:var(--text);padding:10px 14px;border-radius:999px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;white-space:nowrap;text-decoration:none;background:transparent;border:0;transition:background-color .2s,color .2s}
.nav>a:hover,.nav .dropdown-toggle:hover{color:var(--accent);background:var(--bg-card)}
.nav .dropdown-toggle::after{content:"";width:8px;height:8px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg) translate(-2px,-2px);opacity:.7;transition:transform .2s}
.dropdown:hover .dropdown-toggle::after{transform:rotate(-135deg) translate(-2px,-2px)}
.dropdown{position:relative}
.dropdown-menu{position:absolute;top:calc(100% + 10px);left:50%;transform:translateX(-50%) translateY(-4px);min-width:240px;background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:10px;opacity:0;visibility:hidden;transition:opacity .2s,transform .2s,visibility .2s;box-shadow:0 16px 40px rgba(0,0,0,.4);z-index:60}
.dropdown:hover .dropdown-menu{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0)}
.dropdown-menu a{display:block;padding:12px 16px;border-radius:8px;font-size:14px;font-weight:500;color:var(--text);text-decoration:none;transition:background-color .15s,color .15s}
.dropdown-menu a:hover{background:var(--bg-alt);color:var(--accent)}
.hd-btns{display:flex;align-items:center;gap:8px}
.btn-call{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:999px;background:var(--bg-card);border:1px solid var(--border);color:var(--text);font-size:13px;font-weight:600;text-decoration:none;white-space:nowrap;transition:border-color .2s,color .2s,transform .2s}
.btn-call:hover{border-color:var(--accent);color:var(--accent);transform:translateY(-2px)}
.btn-call svg{width:14px;height:14px}
.icon-btn{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:var(--bg-card);border:1px solid var(--border);color:var(--text);text-decoration:none;transition:background-color .2s,color .2s,border-color .2s,transform .2s}
.icon-btn:hover{transform:translateY(-2px);border-color:var(--border-h);color:var(--accent)}
.icon-btn svg{width:18px;height:18px}
.icon-btn.wa{background:var(--wa);border-color:var(--wa);color:#fff}
.icon-btn.wa:hover{background:var(--wa);color:#fff;filter:brightness(1.1)}
.icon-btn.tg{background:#2AABEE;border-color:#2AABEE;color:#fff}
.icon-btn.tg:hover{background:#2AABEE;color:#fff;filter:brightness(1.1)}
.theme-toggle{width:40px;height:40px;border-radius:50%;background:var(--bg-card);border:1px solid var(--border);color:var(--text);display:grid;place-items:center;position:relative;transition:background-color .2s,border-color .2s,transform .2s;cursor:pointer}
.theme-toggle:hover{border-color:var(--accent);transform:translateY(-2px)}
.theme-toggle svg{width:20px;height:20px;position:absolute;opacity:0;transition:opacity .2s}
.theme-toggle[data-mode="light"] .i-sun{opacity:1;color:var(--accent)}
.theme-toggle[data-mode="dark"] .i-moon{opacity:1;color:var(--accent)}
.theme-toggle[data-mode="auto"][data-resolved="light"] .i-auto,.theme-toggle[data-mode="auto"][data-resolved="dark"] .i-auto{opacity:1;color:var(--accent)}
.burger{display:none;width:40px;height:40px;flex-direction:column;gap:5px;justify-content:center;align-items:center;border-radius:50%;border:1px solid var(--border);background:transparent;cursor:pointer}
.burger span{width:16px;height:2px;background:var(--text);border-radius:2px;transition:transform .3s,opacity .2s}
.burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.burger.open span:nth-child(2){opacity:0}
.burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
/* Accent-ink var (lime pairing) */
:root{--accent-ink:#0A0A0A}
:root[data-theme="light"]{--bg:#F7F7F5;--bg-alt:#EEEEEA;--bg-card:#FFFFFF;--bg-lift:#F2F2EE;--accent:#5BD100;--accent-2:#6B3DDB;--accent-ink:#FFFFFF;--text:#0A0A0A;--muted:#555555;--muted-2:#777777;--border:rgba(0,0,0,.08);--border-h:rgba(0,0,0,.25)}
:root[data-theme="light"] body{background:var(--bg);color:var(--text)}
/* Mobile drawer + backdrop */
.nav-backdrop{display:none}
@media (max-width:1100px){
    .hd-inner{display:flex;gap:8px;padding:12px 16px}
    .hd-btns{margin-left:auto}
    .hd-btns .btn-call{display:none}
    .icon-btn{width:36px;height:36px}
    .icon-btn svg{width:16px;height:16px}
    .theme-toggle{width:36px;height:36px}
    .burger{display:flex}
    .nav-backdrop{display:block;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:190;opacity:0;visibility:hidden;transition:opacity .25s,visibility .25s}
    .nav-backdrop.open{opacity:1;visibility:visible}
    .nav{position:fixed;top:0;right:0;bottom:0;left:auto;width:min(86vw,400px);min-height:100dvh;background:var(--bg);border-left:1px solid var(--border);flex-direction:column;align-items:stretch;padding:80px 24px 40px;gap:0;margin:0;z-index:200;overflow-y:auto;overscroll-behavior:contain;transform:translateX(100%);transition:transform .3s;box-shadow:-20px 0 60px rgba(0,0,0,.4);display:flex;justify-self:auto}
    .nav.open{transform:translateX(0)}
    .nav-close{display:grid;place-items:center;position:absolute;top:20px;right:20px;width:44px;height:44px;border-radius:50%;background:var(--bg-card);border:1px solid var(--border);color:var(--text);z-index:210;cursor:pointer}
    .nav-close svg{width:20px;height:20px}
    .nav>a,.nav .dropdown-toggle{display:flex;padding:18px 4px;font-size:18px;font-weight:600;color:var(--text);border-radius:0;border-bottom:1px solid var(--border);justify-content:space-between;align-items:center;width:100%;background:transparent}
    .dropdown{width:100%;position:static}
    .dropdown-menu{position:static !important;top:auto !important;left:auto !important;right:auto !important;inset:auto !important;transform:none !important;opacity:1;visibility:visible;display:none;box-shadow:none;border:0;padding:8px 0 16px 0;margin:0;background:transparent;min-width:0;max-width:none;width:100%}
    .dropdown-menu a{display:block;padding:14px 14px;font-size:16px;border-left:2px solid var(--border);margin-left:4px;border-radius:8px}
    .dropdown.mob-open .dropdown-menu{display:block}
    .dropdown.mob-open .dropdown-toggle{color:var(--accent)}
    .dropdown.mob-open .dropdown-toggle::after{transform:rotate(-135deg);color:var(--accent)}
    body.nav-open{overflow:hidden}
}
.nav-close{display:none}
@media (max-width:1100px){.nav-close{display:grid}}
/* Article hero accent updates */
.article-hero .gtext{background:linear-gradient(135deg,var(--accent) 0%,var(--accent-2) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.tag-blue{background:rgba(195,255,54,.12) !important;color:var(--accent) !important;border:1px solid rgba(195,255,54,.3) !important}
.tag-indigo{background:rgba(157,108,255,.12) !important;color:var(--accent-2) !important;border:1px solid rgba(157,108,255,.3) !important}
.hero-stat-num.indigo{color:var(--accent-2) !important}
.hero-stat-num.blue{color:var(--accent) !important}
.kpi-val.indigo{color:var(--accent-2) !important}
.kpi-val.blue{color:var(--accent) !important}
.sbar-num.gtext,.gtext{background:linear-gradient(135deg,var(--accent) 0%,var(--accent-2) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.process-num{background:linear-gradient(135deg,var(--accent),var(--accent-2)) !important;color:var(--accent-ink) !important;box-shadow:0 4px 16px var(--glow) !important}
.breadcrumb{background:var(--bg-card) !important;border:1px solid var(--border) !important}
.breadcrumb,.breadcrumb span{color:var(--muted) !important}
.breadcrumb a{color:var(--text) !important}.breadcrumb a:hover{color:var(--accent) !important}
.breadcrumb svg{fill:var(--muted) !important}
.breadcrumb span[style*="color"]{color:var(--accent) !important}
.toc a:hover,.toc a.active{color:var(--accent) !important;border-left-color:var(--accent) !important;background:rgba(195,255,54,.06) !important}
.faq-item.active .faq-q svg{fill:var(--accent) !important}
.cta-block{background:linear-gradient(135deg,rgba(195,255,54,.08),rgba(157,108,255,.08)) !important;border-color:rgba(195,255,54,.2) !important}
.case-block{background:linear-gradient(135deg,rgba(195,255,54,.06),rgba(157,108,255,.06)) !important;border-color:rgba(195,255,54,.2) !important}
.case-block::before{background:rgba(195,255,54,.15) !important;color:var(--accent) !important}
.btn-wa{animation:none !important;box-shadow:0 4px 24px var(--wa-glow) !important}
.btn-tg{background:linear-gradient(135deg,#2AABEE,#1c8fc7) !important;box-shadow:0 4px 24px rgba(42,171,238,.3) !important}
.btn-tg:hover{box-shadow:0 10px 40px rgba(42,171,238,.45) !important}
.float-wa{background:#25D366 !important}
.scroll-top{background:var(--accent) !important;color:var(--accent-ink) !important;box-shadow:0 4px 24px var(--glow) !important}
.back-btn{background:var(--bg-card) !important;color:var(--text) !important;border-color:var(--border) !important}
.back-btn:hover{border-color:var(--accent) !important;color:var(--accent) !important}
</style>`;

function transform(html, filename) {
    const baseName = filename.replace('.html','');

    // 1) <html lang="ru"> → <html lang="ru" data-theme="dark">
    html = html.replace(/<html\s+lang="ru">/, '<html lang="ru" data-theme="dark">');

    // 2) Inject theme-preload script right after <head>
    html = html.replace(/<head>/, `<head>\n    ${THEME_PRELOAD}`);

    // 3) Replace :root {...} variables block with new palette
    html = html.replace(/:root\s*\{[^}]+\}/, `:root{${NEW_ROOT_VARS}}`);

    // 4) Replace <header class="header" id="header">...</header>
    html = html.replace(/<header\s+class="header"[\s\S]*?<\/header>/, NEW_HEADER);

    // 5) Replace <footer class="footer">...</footer>
    html = html.replace(/<footer\s+class="footer">[\s\S]*?<\/footer>/, NEW_FOOTER);

    // 6) Inject override styles AFTER the closing </style> tag
    html = html.replace(/<\/style>/, '</style>\n' + OVERRIDES);

    // 7) Add Google fonts Manrope + Inter (replace Space Grotesk link)
    html = html.replace(
        /<link\s+href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter[^"]+"\s+rel="stylesheet">/,
        '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">'
    );

    // 8) Replace the old menu script (nav toggle) with the new shared tail JS.
    // Find the second <script> (menu handler) and replace its contents.
    // Easier: insert SHARED_TAIL_JS before </body>
    // But first, nuke the existing menu-toggle logic inside articles so it doesn't fight with our new one.
    // Remove the old burger handler — it's the (function(){...burger...})() script block.
    html = html.replace(
        /var burger = document\.getElementById\('burger'\)[^]*?nav\.querySelectorAll\('a:not\(\.btn\)'\)\.forEach\([^)]*?\)\s*;\s*/,
        ''
    );

    // 9) Prepend SHARED_TAIL_JS before </body>
    html = html.replace(/<\/body>/, SHARED_TAIL_JS + '\n</body>');

    return html;
}

// --- Run over all article HTMLs in Blog/ (skip index.html) ---
const files = readdirSync(BLOG_DIR).filter(f => f.endsWith('.html') && f !== 'index.html');
console.log(`Found ${files.length} article HTMLs to transform.`);

let okCount = 0;
for (const f of files) {
    const fullPath = join(BLOG_DIR, f);
    try {
        const input = readFileSync(fullPath, 'utf8');
        const output = transform(input, f);
        writeFileSync(fullPath, output, 'utf8');
        okCount++;
        console.log('  ✓', f);
    } catch (err) {
        console.log('  ✗', f, err.message);
    }
}
console.log(`Done. ${okCount}/${files.length} articles transformed.`);
