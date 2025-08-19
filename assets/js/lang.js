// /lang.js
(function () {
    // === CONFIG: mapping rute EN/ID per halaman ===
    const PATHS = {
        home: { en: '/', id: '/index-id.html' },
        support: { en: '/support/', id: '/support-id/' },
        article: { en: '/article/', id: '/article/' }, // belum ada versi ID? samain dulu ke EN biar gak 404
        privacy: { en: '/privacy.html', id: '/privacy-id.html' }, // kalau belum ada, samain ke privacy.html
        updates: { en: '/updates.html', id: '/updates-id.html' }  // kalau belum ada, samain ke updates.html
    };

    // Auto-redirect berdasarkan preferensi user/device?
    const AUTO_REDIRECT = true;

    // Halaman ini apa? (set di <body data-page="...">)
    const pageKey = document.body.getAttribute('data-page') || 'home';
    const route = PATHS[pageKey];
    if (!route) { console.warn('[lang] Unknown page key:', pageKey); return; }

    // Preferensi bahasa: pakai yang tersimpan, kalau belum deteksi dari browser
    let chosen = localStorage.getItem('chosenLang');
    if (!chosen) {
        const lang = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
        chosen = lang.toLowerCase().startsWith('id') ? 'id' : 'en';
        localStorage.setItem('chosenLang', chosen);
    }

    // Auto-redirect kalau path sekarang belum sesuai preferensi
    if (AUTO_REDIRECT) {
        const target = (route[chosen] || route.en);
        if (normalizePath(location.pathname) !== normalizePath(target)) {
            location.replace(target); // cegah flicker & back-loop
            return;
        }
    }

    // Hook untuk dropdown switcher (kalau ada)
    const select = document.getElementById('langSwitcher');
    if (select) {
        select.value = chosen;
        select.addEventListener('change', function () {
            const val = this.value === 'id' ? 'id' : 'en';
            localStorage.setItem('chosenLang', val);
            const target = route[val] || route.en;
            if (normalizePath(location.pathname) !== normalizePath(target)) {
                location.href = target;
            }
        });
    }

    function normalizePath(p) {
        if (!p) return '/';
        if (p !== '/' && p.endsWith('/')) return p.slice(0, -1);
        return p;
    }
})();
