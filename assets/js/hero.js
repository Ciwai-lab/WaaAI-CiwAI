// /hero.js
(function () {
    const mountId = 'ciwai-hero';
    const placeholder = document.getElementById(mountId) || (() => {
        const auto = document.createElement('div'); auto.id = mountId;
        document.body.insertBefore(auto, document.body.firstChild);
        return auto;
    })();

    const getAttr = (el, name, fallback = '') => el.getAttribute(name) || fallback;

    fetch('/hero.html')
        .then(r => r.text())
        .then(html => {
            placeholder.outerHTML = html;

            // After inject
            const heroEl = document.getElementById('ciwai-hero');
            const bgEl = heroEl.firstElementChild; // absolute bg
            const titleEl = document.getElementById('ciwai-hero-title');
            const subtitleEl = document.getElementById('ciwai-hero-subtitle');

            // Read config from the original placeholder (we cloned its attributes before replace?)
            // Re-select the original placeholder attributes via <script> tag trick is complex,
            // simple approach: Allow data-* on <body> as fallback too.
            const pageHolder = document.querySelector(`#${mountId}[data-title], body[data-hero-title]`);

            // Pull data from current DOM (after replacement, original is gone; so also read from <body>)
            const title = document.body.getAttribute('data-hero-title')
                || getAttr(placeholder, 'data-title', document.title || 'CiwAI');
            const subtitle = document.body.getAttribute('data-hero-subtitle')
                || getAttr(placeholder, 'data-subtitle', '');
            const variant = (document.body.getAttribute('data-hero-variant')
                || getAttr(placeholder, 'data-variant', 'subtle')).toLowerCase();

            // Set content
            titleEl.textContent = title;
            subtitleEl.textContent = subtitle;

            // Variants
            // subtle: dark soft gradient
            // accent: blue/purple gentle glow
            // brand: stronger brand gradient
            const applyVariant = (v) => {
                const classes = {
                    subtle: 'bg-gradient-to-tr from-gray-900 via-gray-900 to-gray-800',
                    accent: 'bg-gradient-to-r from-blue-600/20 via-transparent to-purple-600/20',
                    brand: 'bg-gradient-to-tr from-indigo-700/30 via-fuchsia-600/20 to-rose-600/20'
                };
                bgEl.className = `absolute inset-0 pointer-events-none ${classes[v] || classes.subtle}`;
                heroEl.classList.add('border-b', 'border-white/10');
            };
            applyVariant(variant);

            // Animate in
            requestAnimationFrame(() => {
                heroEl.classList.remove('opacity-0', 'translate-y-3');
            });
        })
        .catch(err => console.error('Hero load error:', err));
})();
