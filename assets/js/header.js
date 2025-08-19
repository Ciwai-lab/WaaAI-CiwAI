// /header.js
(function () {
    const mountId = 'ciwai-header';

    // Pastikan ada placeholder; kalau belum ada, buat di paling atas <body>
    const placeholder = document.getElementById(mountId) || (() => {
        const auto = document.createElement('div');
        auto.id = mountId;
        document.body.insertBefore(auto, document.body.firstChild);
        return auto;
    })();

    // Ambil partial header dari root (absolute path)
    fetch('/header.html')
        .then(r => r.text())
        .then(html => {
            // Inject markup
            placeholder.outerHTML = html;

            // Refs
            const headerEl = document.getElementById('ciwai-header');
            const burgerBtn = document.getElementById('ciwai-burger');
            const mobileMenu = document.getElementById('ciwai-mobile-menu');

            // ===== 1) Sticky shadow on scroll =====
            const toggleShadow = () => {
                if (window.scrollY > 4) headerEl.classList.add('shadow-md');
                else headerEl.classList.remove('shadow-md');
            };
            toggleShadow();
            window.addEventListener('scroll', toggleShadow, { passive: true });

            // ===== 2) Active link highlighter =====
            // Normalisasi path: hapus trailing slash kecuali root
            const norm = (p) => (!p || p === '/') ? '/' : (p.endsWith('/') ? p.slice(0, -1) : p);
            const path = norm(location.pathname);

            // Petakan path → data-link
            const map = {
                '/': 'home',
                '/index.html': 'home',

                // Article (folder)
                '/article': 'article',
                '/article/index.html': 'article',

                // Support (folder)
                '/support': 'support',
                '/support/index.html': 'support',

                // Root pages
                '/privacy.html': 'privacy',
                '/updates.html': 'updates'
                // contact = mailto (skip)
            };

            const activeKey = map[path];
            if (activeKey) {
                document.querySelectorAll(`[data-link="${activeKey}"]`).forEach(a => {
                    a.classList.add('text-white', 'font-semibold');
                    a.classList.remove('text-white/80');
                });
            }

            // ===== 3) Mobile burger toggle =====
            if (burgerBtn && mobileMenu) {
                burgerBtn.addEventListener('click', () => {
                    const expanded = burgerBtn.getAttribute('aria-expanded') === 'true';
                    burgerBtn.setAttribute('aria-expanded', String(!expanded));
                    mobileMenu.classList.toggle('hidden', expanded);
                });

                // Auto-close saat klik salah satu menu
                mobileMenu.querySelectorAll('a').forEach(a => {
                    a.addEventListener('click', () => {
                        burgerBtn.setAttribute('aria-expanded', 'false');
                        mobileMenu.classList.add('hidden');
                    });
                });

                // Close saat klik di luar header
                document.addEventListener('click', (e) => {
                    if (!headerEl.contains(e.target)) {
                        burgerBtn.setAttribute('aria-expanded', 'false');
                        mobileMenu.classList.add('hidden');
                    }
                });
            }

            // ===== 4) Brand badge: ikon & warna per data-page =====
            // Pastikan di setiap halaman ada <body data-page="home|article|privacy|support|updates">
            const page = (document.body.getAttribute('data-page') || 'home').toLowerCase();
            const badge = document.getElementById('brand-badge');

            if (badge) {
                // Kumpulan ikon SVG kecil (24x24 viewBox), dipakai di dalam badge lingkaran
                const ICONS = {
                    home: {
                        color: 'bg-blue-500',
                        svg: `
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13 2L3 14h7v8l10-12h-7z"/>
              </svg>`
                    },
                    article: {
                        color: 'bg-emerald-500',
                        svg: `
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM15 3v4h4"/>
              </svg>`
                    },
                    privacy: {
                        color: 'bg-rose-500',
                        svg: `
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-6h-1V9a5 5 0 1 0-10 0v2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM9 9a3 3 0 0 1 6 0v2H9V9z"/>
              </svg>`
                    },
                    support: {
                        color: 'bg-indigo-600',
                        svg: `
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.54 4.93a8 8 0 0 1 2.32 1.35l-2.12 2.12a4 4 0 0 0-4.48 0L9.14 8.28a8 8 0 0 1 6.4-1.35ZM6.28 8.93a8 8 0 0 0 0 6.14l2.12-2.12a4 4 0 0 1 0-1.9L6.28 8.93Zm11.44 0-2.12 2.12a4 4 0 0 1 0 1.9l2.12 2.12a8 8 0 0 0 0-6.14ZM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
              </svg>`
                    },
                    updates: {
                        color: 'bg-purple-600',
                        svg: `
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18 13V9a6 6 0 1 0-12 0v4c0 .92-.21 1.79-.59 2.59L4 17h16l-1.41-1.41A4 4 0 0 1 18 13Zm-6 9a3 3 0 0 0 3-3h-6a3 3 0 0 0 3 3Z"/>
              </svg>`
                    }
                };

                const cfg = ICONS[page] || ICONS.home;

                // Reset warna lama & apply warna baru
                badge.className =
                    `inline-flex items-center justify-center w-7 h-7 rounded-full ${cfg.color} ` +
                    `text-white group-hover:scale-125 transition shadow`;

                // Inject SVG icon
                badge.innerHTML = cfg.svg;
            }
        })
        .catch(err => console.error('Header load error:', err));
})();
