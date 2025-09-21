// footer.js
fetch('/footer.html')
    .then(res => res.text())
    .then(html => {
        const mount = document.getElementById('ciwai-footer');
        // Jika halaman belum punya placeholder, buat otomatis di akhir <body>
        if (!mount) {
            const auto = document.createElement('div');
            auto.id = 'ciwai-footer';
            document.body.appendChild(auto);
        }
        document.getElementById('ciwai-footer').innerHTML = html;

        // Setelah inject, set tahun
        const y = document.getElementById('year');
        if (y) y.textContent = new Date().getFullYear();

        // Fade-in saat terlihat
        const footerEl = document.getElementById('ciwai-footer');
        if (footerEl) {
            const obs = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    footerEl.classList.remove('opacity-0', 'translate-y-6');
                    obs.disconnect();
                }
            }, { threshold: 0.1 });
            obs.observe(footerEl);
        }
    })
    .catch(err => console.error('Footer load error:', err));
