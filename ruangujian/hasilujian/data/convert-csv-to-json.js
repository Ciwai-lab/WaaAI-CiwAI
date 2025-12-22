const fs = require("fs");

/* ================= CONFIG ================= */
const TOTAL_SOAL = 50;
const NILAI_MAKS = 100;
const BOBOT_SOAL = 2;
/* ========================================== */

function parseCSV(file) {
    const raw = fs.readFileSync(file, "utf8");
    const lines = raw.split("\n").filter(l => l.trim() !== "");

    const headers = lines[0].split(",").map(h => h.trim());

    return lines.slice(1).map(line => {
        const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const obj = {};
        headers.forEach((h, i) => {
            obj[h] = (cols[i] || "").replace(/^"|"$/g, "").trim();
        });
        return obj;
    });
}

function convert(csvFile, outFile) {
    const rows = parseCSV(csvFile);
    const results = [];

    rows.forEach(row => {
        const email = row["Username"];
        if (!email) return;

        /* ===== NILAI FINAL (SUMBER UTAMA) ===== */
        const nilai = Math.round(
            parseFloat((row["Total score"] || "0").split("/")[0])
        );

        const salah = (NILAI_MAKS - nilai) / BOBOT_SOAL;
        const benar = TOTAL_SOAL - salah;

        /* ===== DETAIL SOAL (BONUS EDUKASI) ===== */
        const detail = [];

        Object.keys(row).forEach(key => {
            if (key.includes("[Score]")) {
                const score = parseFloat(row[key] || "0");

                // hanya tampilkan yang benar-benar 0
                if (score === 0) {
                    const soal = key.replace(" [Score]", "");
                    detail.push({
                        soal,
                        jawaban_peserta: row[soal] || "",
                        benar: false
                    });
                }
            }
        });

        results.push({
            email,
            nama: row["Nama Lengkap"],
            paket: row["PKBM Paket :"],
            total: TOTAL_SOAL,
            benar,
            salah,
            nilai,
            nilai_text: `${nilai}/100`,
            detail
        });
    });

    fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
    console.log("✔ Generated:", outFile);
}

/* ========== RUN ========== */
convert("paket-b.csv", "paket-b.json");
convert("paket-c.csv", "paket-c.json");
