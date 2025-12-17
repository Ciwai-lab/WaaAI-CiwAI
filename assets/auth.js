// true = mode tamu (login NIK OFF)
// false = mode login NIK ON
const GUEST_MODE = true;

const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTursHTu2TvoC3xxU_TLR3oPj-pogr6eCadRyIlQVUomxISw9Ipu2Nv6HoFSTp7QT8XXM_aF83zJ_v/pub?gid=1812990548&single=true&output=csv";

async function login() {
    const nik = document.getElementById("nik").value.trim();
    const msg = document.getElementById("msg");

    if (!nik) {
        msg.innerText = "NIK wajib diisi";
        return;
    }

    const res = await fetch(SHEET_URL);
    const text = await res.text();

    const rows = text.split("\n").slice(1); // skip header

    for (let r of rows) {
        const cols = r.split(",");
        const sheetNIK = cols[6]?.trim(); // ⬅️ KOLOM G

        if (sheetNIK === nik) {
            localStorage.setItem("login", nik);
            location.href = "pilih.html";
            return;
        }
    }

    msg.innerText = "NIK tidak terdaftar / tidak berhak masuk";
}
