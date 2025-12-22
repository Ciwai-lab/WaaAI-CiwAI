const fs = require("fs");
const path = require("path");

function parseCSV(file) {
    const raw = fs.readFileSync(file, "utf8");
    const lines = raw.split("\n").filter(l => l.trim() !== "");
    const headers = lines[0].split(",");

    return lines.slice(1).map(line => {
        const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const obj = {};
        headers.forEach((h, i) => {
            obj[h.trim()] = (cols[i] || "").replace(/^"|"$/g, "").trim();
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

        const totalScore = parseFloat(
            (row["Total score"] || "0").split("/")[0]
        );

        const detail = [];
        let salah = 0;

        Object.keys(row).forEach(key => {
            if (key.includes("[Score]")) {
                const score = parseFloat(row[key] || "0");
                if (score === 0) {
                    const soal = key.replace(" [Score]", "");
                    detail.push({
                        soal,
                        jawaban_peserta: row[soal] || "",
                        benar: false
                    });
                    salah++;
                }
            }
        });

        results.push({
            email,
            nama: row["Nama Lengkap"],
            paket: row["PKBM Paket :"],
            nilai: Math.round(totalScore),
            total: detail.length + (totalScore / 100) * detail.length,
            benar: null, // opsional
            salah,
            detail
        });
    });

    fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
    console.log("✔ Generated:", outFile);
}

/* ===== RUN ===== */
convert("paket-b.csv", "paket-b.json");
convert("paket-c.csv", "paket-c.json");
