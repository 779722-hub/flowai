(function() {
    var KEY = 'flowai-theme';
    var root = document.documentElement;
    var autoTimer = null;

    function getStored() {
        try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }
    function store(v) {
        try { localStorage.setItem(KEY, v); } catch (e) {}
    }

    /* Astana time = UTC+5, no DST */
    function astanaHour() {
        var d = new Date();
        return (d.getUTCHours() + 5) % 24;
    }
    function effective(mode) {
        if (mode === 'auto') {
            var h = astanaHour();
            return (h >= 8 && h < 20) ? 'light' : 'dark';
        }
        return mode;
    }

    function updateMeta(resolved) {
        var meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'theme-color';
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', resolved === 'light' ? '#F7F7F5' : '#0A0A0A');
    }

    function updateButton(mode, resolved) {
        var btn = document.querySelector('.theme-toggle');
        if (!btn) return;
        btn.setAttribute('data-mode', mode);
        btn.setAttribute('data-resolved', resolved);
        var label = mode === 'auto' ? 'Авто' : (mode === 'light' ? 'Светлая' : 'Тёмная');
        btn.setAttribute('aria-label', 'Тема: ' + label + ' (клик для смены)');
        var labelEl = btn.querySelector('.theme-label');
        if (labelEl) labelEl.textContent = label;
    }

    function apply(mode) {
        var resolved = effective(mode);
        root.setAttribute('data-theme', resolved);
        store(mode);
        updateMeta(resolved);
        updateButton(mode, resolved);
        scheduleAutoReeval(mode);
    }

    function scheduleAutoReeval(mode) {
        if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
        if (mode !== 'auto') return;
        autoTimer = setInterval(function() {
            var resolved = effective('auto');
            if (root.getAttribute('data-theme') !== resolved) {
                root.setAttribute('data-theme', resolved);
                updateMeta(resolved);
                updateButton('auto', resolved);
            }
        }, 60 * 1000);
    }

    function cycle() {
        var order = ['auto', 'light', 'dark'];
        var current = getStored() || 'auto';
        var next = order[(order.indexOf(current) + 1) % order.length];
        apply(next);
    }

    document.addEventListener('DOMContentLoaded', function() {
        var initial = getStored() || 'auto';
        apply(initial);
        var btn = document.querySelector('.theme-toggle');
        if (btn) btn.addEventListener('click', cycle);
    });
})();
