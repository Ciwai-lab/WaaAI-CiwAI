// /header.js
(function () {
    const mountId = 'ciwai-header';
    const placeholder = document.getElementById(mountId) || (() => {
        const auto = document.createElement('div'); auto.id = mountId;
        document.body.insertBefore(auto, document.body.firstChild);
        return auto;
    })();

    fetch('/header.html')
        .then(r => r.text())
        .then(html => {
            placeholder.outerHTML = html;

            // Refs
            const headerEl = document.getElementById('ciwai-header');
            const burgerBtn = document.getElementById('ciwai-burger');
            const mobileMenu = document.getElementById('ciwai-mobile-menu');

            // Sticky shadow on scroll
            const toggleShadow = () => {
                if (window.scrollY > 4) headerEl.classList.add('shadow-md');
                else headerEl.classList.remove('shadow-md');
            };
            toggleShadow();
            window.addEventListener('scroll', toggleShadow, { passive: true });

            // Active link highlighter
            const path = location.pathname.replace(/\/+$/, '') || '/';
            const map = {
                '/': 'home',
                '/index.html': 'home',
                '/article.html': 'article',
                '/privacy.html': 'privacy',
                '/support.html': 'support',
                '/updates.html': 'updates'
                // contact is mailto, skip path match
            };
            const activeKey = map[path];
            if (activeKey) {
                document.querySelectorAll(`[data-link="${activeKey}"]`).forEach(a => {
                    a.classList.add('text-white', 'font-semibold');
                    a.classList.remove('text-white/80');
                });
            }

            // Burger toggle
            if (burgerBtn && mobileMenu) {
                burgerBtn.addEventListener('click', () => {
                    const expanded = burgerBtn.getAttribute('aria-expanded') === 'true';
                    burgerBtn.setAttribute('aria-expanded', String(!expanded));
                    mobileMenu.classList.toggle('hidden', expanded);
                });

                // Auto-close on nav click
                mobileMenu.querySelectorAll('a').forEach(a => {
                    a.addEventListener('click', () => {
                        burgerBtn.setAttribute('aria-expanded', 'false');
                        mobileMenu.classList.add('hidden');
                    });
                });

                // Close on outside click
                document.addEventListener('click', (e) => {
                    if (!headerEl.contains(e.target)) {
                        burgerBtn.setAttribute('aria-expanded', 'false');
                        mobileMenu.classList.add('hidden');
                    }
                });
            }
        })
        .catch(err => console.error('Header load error:', err));
})();
