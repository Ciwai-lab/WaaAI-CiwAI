// footer.js
fetch('/footer.html')
    .then(res => res.text())
    .then(html => {
        const mount = document.getElementById('ciwai-footer');
        if (!mount) {
            const auto = document.createElement('div');
            auto.id = 'ciwai-footer';
            document.body.appendChild(auto);
        }
        document.getElementById('ciwai-footer').innerHTML = html;

        const y = document.getElementById('year');
        if (y) y.textContent = new Date().getFullYear();

        const footerEl = document.querySelector('footer');
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

window.openLoginModal = function () {
    const modal = document.getElementById("loginModal");
    const card = document.getElementById("loginCard");

    if (modal && card) {
        modal.classList.remove("hidden");
        setTimeout(() => modal.classList.add("show"), 10);
    }
};

window.closeLoginModal = function () {
    const modal = document.getElementById("loginModal");

    if (modal) {
        modal.classList.remove("show");
        setTimeout(() => modal.classList.add("hidden"), 200);
    }
};

window.executeLogin = async function () {
    const email = document.getElementById("modalEmail").value;
    const password = document.getElementById("modalPassword").value;
    const msg = document.getElementById("modalMessage");

    const tenant = window.location.hostname.split('.')[0];

    try {
        msg.innerText = "Sedang masuk...";

        const res = await fetch("https://api.ciwai.dev/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Tenant": tenant
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            msg.innerText = data.error || "Login gagal";
            return;
        }

        localStorage.setItem("ciwai_token", data.token);
        window.location.href = "/dashboard.html";

    } catch (err) {
        msg.innerText = "Gagal koneksi ke server";
    }
};

setTimeout(() => {
    const modal = document.getElementById("loginModal");
    if (modal) document.body.appendChild(modal);
}, 50);

