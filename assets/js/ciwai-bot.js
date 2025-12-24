/* ===============================
   CiwAI Bot v0.1
   Lightweight Web Chatbot
   =============================== */

const botBtn = document.getElementById("ciwai-bot-btn");
const botPanel = document.getElementById("ciwai-bot-panel");
const messages = document.getElementById("ciwai-bot-messages");
const input = document.getElementById("ciwai-input");

let greeted = false;

// Toggle chat panel
function toggleCiwaiBot() {
    botPanel.style.display =
        botPanel.style.display === "flex" ? "none" : "flex";

    if (!greeted) {
        addBotMsg(
            `Halo 👋<br>
      Aku <b>CiwAI Bot (beta)</b>.<br>
      Tanya hal simpel dulu ya, kalau ribet nanti aku arahin ke team 😄`
        );
        greeted = true;
    }

    input.focus();
}

botBtn.addEventListener("click", toggleCiwaiBot);

// Helpers
function addBotMsg(html) {
    const div = document.createElement("div");
    div.className = "msg bot";
    div.innerHTML = html;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function addUserMsg(text) {
    const div = document.createElement("div");
    div.className = "msg user";
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

// Normalize input (anti typo & singkatan)
function normalize(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\bwa\b/g, "whatsapp")
        .replace(/\bbrp\b/g, "berapa")
        .replace(/\bgmn\b/g, "gimana")
        .replace(/\bapp\b|\bapk\b/g, "aplikasi")
        .replace(/\bweb\b/g, "website");
}

// Send message
function sendCiwaiMsg() {
    const text = input.value.trim();
    if (!text) return;

    addUserMsg(text);
    input.value = "";

    const msg = normalize(text);

    // ===== INTENTS =====
    if (msg.includes("ciwai") || msg.includes("tentang")) {
        return addBotMsg(
            "CiwAI™ Smart Digital adalah tim dari Indonesia yang fokus bikin teknologi pintar, ringan, dan ramah pengguna."
        );
    }

    if (msg.includes("layanan") || msg.includes("jasa")) {
        return addBotMsg(
            "Kami ngerjain aplikasi mobile, website, VPS/VPN private, dan bot AI (Telegram & WhatsApp)."
        );
    }

    if (msg.includes("bot")) {
        return addBotMsg(
            "Bisa 👍 Kami bikin bot sederhana sampai custom untuk bisnis, sekolah, atau komunitas."
        );
    }

    if (msg.includes("website") || msg.includes("aplikasi")) {
        return addBotMsg(
            "Bisa banget 😄 Kami fokus bikin website & aplikasi yang ringan dan gampang dipakai."
        );
    }

    if (msg.includes("harga") || msg.includes("berapa")) {
        return fallbackOwner();
    }

    if (msg.includes("kontak") || msg.includes("hubungi")) {
        return fallbackOwner();
    }

    // ===== FALLBACK =====
    fallbackOwner();
}

// Fallback to owner
function fallbackOwner() {
    addBotMsg(`
    Pertanyaannya agak spesifik nih 😅<br>
    Supaya gak salah info, langsung ngobrol sama owner CiwAI ya 👇
    <div class="ciwai-actions">
      <a href="https://wa.me/?text=Halo%20CiwAI%2C%20saya%20mau%20tanya" target="_blank">
        💬 Chat WhatsApp
      </a>
      <a href="mailto:halo@ciwai.dev">
        📩 Email
      </a>
    </div>
  `);
}

// Enter key support
input.addEventListener("keydown", e => {
    if (e.key === "Enter") sendCiwaiMsg();
});

// Expose for inline button
window.sendCiwaiMsg = sendCiwaiMsg;
window.toggleCiwaiBot = toggleCiwaiBot;
