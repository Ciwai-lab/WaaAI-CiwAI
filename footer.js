fetch('/footer.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('ciwai-footer').innerHTML = html;
        const y = document.getElementById('year');
        if (y) y.textContent = new Date().getFullYear();
    });
