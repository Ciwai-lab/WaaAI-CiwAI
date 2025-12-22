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

  document.getElementById("hasilBox").insertAdjacentHTML(
    "afterbegin",
    `
  <div class="status-badge">
    🟢 Ujian Telah Selesai
  </div>
  `
  );

  document.getElementById("ringkasan").innerHTML = `
  <div class="result-card">
    <div class="result-item">
      <span>Nama</span>
      <strong>${CURRENT.nama}</strong>
    </div>
    <div class="result-item">
      <span>Total Soal</span>
      <strong>${CURRENT.total}</strong>
    </div>
    <div class="result-item">
      <span>Salah</span>
      <strong style="color:#dc2626">${CURRENT.salah}</strong>
    </div>
    <div class="result-item highlight">
      <span>Nilai Akhir</span>
      <strong>${CURRENT.nilai_text}</strong>
    </div>
  </div>
`;

  const salah = CURRENT.detail;

  document.getElementById("detailSoal").innerHTML =
    salah.map((s, i) => `
    <details class="wrong-question">
      <summary>❌ Soal ${i + 1} yang perlu diperbaiki</summary>

      <p class="question-text">
        ${s.soal}
      </p>

      <p>
        <b>Jawaban kamu:</b>
        <span class="wrong">
          ${s.jawaban_peserta ? s.jawaban_peserta : "—"}
        </span>
      </p>

      ${s.jawaban_benar
        ? `<p><b>Jawaban benar:</b>
               <span class="correct">${s.jawaban_benar}</span>
             </p>`
        : ""
      }
    </details>
  `).join("");

}
