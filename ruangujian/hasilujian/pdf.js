function downloadPDF() {
  if (!CURRENT) {
    alert("Data hasil belum tersedia.");
    return;
  }

  const soalSalahHTML = CURRENT.detail
    .map(
      (s, i) => `
      <p><b>Soal ${i + 1}</b></p>
      <p>${s.soal}</p>
      <p>Jawaban kamu: ❌ ${s.jawaban_peserta || "-"}</p>
      ${s.jawaban_benar
          ? `<p>Jawaban benar: ✅ ${s.jawaban_benar}</p>`
          : ""
        }
      <hr>
    `
    )
    .join("");

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Hasil Evaluasi Ujian</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 40px;
        color: #111827;
      }
      h1 {
        color: #4f46e5;
      }
      .summary {
        background: #f8fafc;
        padding: 16px;
        border-radius: 10px;
        margin-bottom: 24px;
      }
      .summary p {
        margin: 6px 0;
      }
      hr {
        border: none;
        border-top: 1px solid #e5e7eb;
        margin: 16px 0;
      }
      small {
        color: #6b7280;
      }
    </style>
  </head>
  <body>

    <h1>Hasil Evaluasi Ujian Bahasa Inggris</h1>
<p style="color:#64748b;font-size:13px;margin-top:-6px;">
  Semester Ganjil • PKBM HALIFA
</p>


    <div class="summary">
      <p><b>Nama:</b> ${CURRENT.nama}</p>
      <p><b>Email:</b> ${CURRENT.email}</p>
      <p><b>Total Soal:</b> ${CURRENT.total}</p>
      <p><b>Jawaban Benar:</b> ${CURRENT.benar}</p>
      <p><b>Jawaban Salah:</b> ${CURRENT.salah}</p>
      <p><b>Nilai Akhir:</b> ${CURRENT.nilai}</p>
    </div>

    <h3>Soal yang Perlu Diperbaiki</h3>
    ${soalSalahHTML || "<p>Tidak ada soal yang perlu diperbaiki.</p>"}

    <small>
      Dokumen ini dihasilkan secara otomatis oleh sistem CiwAI Smart Digital.<br>
      ${new Date().toLocaleString()}
    </small>

  </body>
  </html>
  `;

  const win = window.open("", "_blank");
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}
