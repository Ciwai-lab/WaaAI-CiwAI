const DATA_SOURCES = [
    "data/paket-a.json",
    "data/paket-b.json",
    "data/paket-c.json"
];

let CURRENT = null;

async function cekHasil() {
    const email = document.getElementById("emailInput").value.trim().toLowerCase();
    document.getElementById("errorBox").style.display = "none";
    document.getElementById("hasilBox").style.display = "none";

    if (!email) return;

    for (const src of DATA_SOURCES) {
        const res = await fetch(src);
        const data = await res.json();

        const found = data.find(d => d.email.toLowerCase() === email);
        if (found) {
            CURRENT = found;
            renderHasil();
            return;
        }
    }

    document.getElementById("errorBox").style.display = "block";
}

function renderHasil() {
    document.getElementById("hasilBox").style.display = "block";

    document.getElementById("ringkasan").innerHTML = `
    <p><b>Nama:</b> ${CURRENT.nama}</p>
    <p><b>Total Soal:</b> ${CURRENT.total}</p>
    <p><b>Benar:</b> ${CURRENT.benar}</p>
    <p><b>Salah:</b> ${CURRENT.salah}</p>
    <p><b>Nilai:</b> ${CURRENT.nilai}</p>
  `;

    const salah = CURRENT.detail.filter(s => !s.benar);

    document.getElementById("detailSoal").innerHTML =
        salah.map(s => `
      <details style="margin-bottom:15px;">
        <summary>Soal ${s.no}</summary>
        <p>${s.soal}</p>
        <p>Jawaban kamu: ❌ <b>${s.jawaban_peserta}</b></p>
        <p>Jawaban benar: ✅ <b>${s.jawaban_benar}</b></p>
      </details>
    `).join("");
}
