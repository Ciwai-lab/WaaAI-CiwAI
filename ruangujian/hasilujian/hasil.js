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

  if (!CURRENT.detail || CURRENT.detail.length === 0) {
    document.getElementById("detailSoal").innerHTML = `
    <div style="
      padding:16px;
      border-radius:12px;
      background:#f8fafc;
      border:1px dashed #cbd5e1;
      color:#475569;
      font-size:14px;
    ">
      ℹ️ <b>Hasil evaluasi detail akan menyusul</b><br>
      Informasi ini akan ditampilkan sebagai bahan pembelajaran siswa.
    </div>
  `;
    return;
  }


}
