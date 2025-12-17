// true = mode tamu (login NIK OFF)
// false = mode login NIK ON
const GUEST_MODE = true;

const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTursHTu2TvoC3xxU_TLR3oPj-pogr6eCadRyIlQVUomxISw9Ipu2Nv6HoFSTp7QT8XXM_aF83zJ_v/pub?gid=1812990548&single=true&output=csv";

async function login() {
    const nik = document.getElementById("nik").value.trim();
    const msg = document.getElementById("msg");

    if (!nik) {
        msg.innerText = "⚠️ NIK wajib diisi";
        return;
    }

    msg.innerText = "⏳ Sedang memverifikasi...";

    try {
        const res = await fetch(SHEET_URL);
        const text = await res.text();
        const rows = text.split("\n").map(row => row.split(","));

        const user = rows.find(cols => cols[6]?.trim() === nik);

        if (user) {
            localStorage.setItem("login", nik);
            location.href = "pilih.html";
        } else {
            msg.innerText = "❌ NIK tidak terdaftar";
        }
    } catch (err) {
        msg.innerText = "⚠️ Gangguan koneksi, coba lagi.";
    }
}
