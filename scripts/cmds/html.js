const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const API_URL = "https://christus-api.vercel.app/ai/gemini-proxy2?prompt=";

// ===== MODE GLOBAL =====
// true = admin only | false = public
if (global.htmlAdminOnly === undefined) {
  global.htmlAdminOnly = false;
}

// ===== CADRE DARK =====
function cadre(text) {
  return `╭━━━━━━━━━━━━━━━━━━━━╮
┃ 🖤 HTML • AI ENGINE
┣━━━━━━━━━━━━━━━━━━━━╯

${text}

╰━━━━━━━━━━━━━━━━━━━━╯`;
}

// ===== IA GENERATOR =====
async function generateHTML(prompt, style) {
  const systemPrompt = `
Tu es une IA développeur web senior.
Tu génères UNIQUEMENT du HTML5 valide.

RÈGLES :
- HTML5 complet
- CSS dans <style>
- JS dans <script> si utile
- Aucun commentaire
- Aucun texte hors code
- Design ${style}
- Responsive
- Propre

DEMANDE :
${prompt}
`;

  try {
    const res = await axios.get(
      API_URL + encodeURIComponent(systemPrompt),
      { timeout: 25000 }
    );

    return (
      res.data?.result ||
      res.data?.raw?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "❌ IA silencieuse."
    );
  } catch {
    return "❌ Erreur serveur IA.";
  }
}

module.exports = {
  config: {
    name: "html",
    version: "3.2",
    author: "Octavio",
    role: 0,
    category: "ai",
    shortDescription: "HTML IA (public / admin)",
    guide: {
      fr:
        "{pn} <description>\n" +
        "{pn} on  → mode admin\n" +
        "{pn} off → mode public"
    }
  },

  onStart: async ({ message, event, args }) => {
    const senderID = event.senderID;
    const isAdmin = global.GoatBot.config.adminBot.includes(senderID);

    // ===== MODE SWITCH =====
    if (args[0] === "on" || args[0] === "off") {
      if (!isAdmin) {
        return message.reply(
          cadre("⛔ Seul un ADMIN BOT peut changer le mode.")
        );
      }

      global.htmlAdminOnly = args[0] === "on";

      return message.reply(
        cadre(
          global.htmlAdminOnly
            ? "🔒 MODE ADMIN ACTIVÉ\nSeuls les admins peuvent utiliser html."
            : "🌍 MODE PUBLIC ACTIVÉ\nTout le monde peut utiliser html."
        )
      );
    }

    // ===== MODE CHECK =====
    if (global.htmlAdminOnly && !isAdmin) {
      return message.reply(
        cadre("🔒 Commande réservée aux ADMINS.")
      );
    }

    // ===== INPUT =====
    let input = args.join(" ");
    if (!input) {
      return message.reply(
        cadre("❌ Décris le HTML à générer.")
      );
    }

    // ===== STYLE =====
    let style = "dark";
    if (input.includes("style=hacker")) style = "hacker";
    if (input.includes("style=neon")) style = "neon";

    const exportFile = input.includes("export");
    input = input.replace(/style=\w+|export/gi, "").trim();

    await message.reply(
      cadre(`⏳ Génération HTML (${style})...`)
    );

    const htmlCode = await generateHTML(input, style);

    // ===== EXPORT =====
    if (exportFile && htmlCode.startsWith("<!DOCTYPE")) {
      const filePath = path.join(
        __dirname,
        `html_${senderID}_${Date.now()}.html`
      );
      await fs.writeFile(filePath, htmlCode, "utf8");

      return message.reply({
        body: cadre("✅ HTML généré et exporté."),
        attachment: fs.createReadStream(filePath)
      });
    }

    return message.reply(cadre(htmlCode));
  }
};Entercconst axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const API_URL = "https://christus-api.vercel.app/ai/gemini-proxy2?prompt=";

// ===== MODE GLOBAL =====
// true = admin only | false = public
if (global.htmlAdminOnly === undefined) {
  global.htmlAdminOnly = false;
}

// ===== CADRE DARK =====
function cadre(text) {
  return `╭━━━━━━━━━━━━━━━━━━━━╮
┃ 🖤 HTML • AI ENGINE
┣━━━━━━━━━━━━━━━━━━━━╯

${text}

╰━━━━━━━━━━━━━━━━━━━━╯`;
}

// ===== IA GENERATOR =====
async function generateHTML(prompt, style) {
  const systemPrompt = `
Tu es une IA développeur web senior.
Tu génères UNIQUEMENT du HTML5 valide.

RÈGLES :
- HTML5 complet
- CSS dans <style>
- JS dans <script> si utile
- Aucun commentaire
- Aucun texte hors code
- Design ${style}
- Responsive
- Propre

DEMANDE :
${prompt}
`;

  try {
    const res = await axios.get(
      API_URL + encodeURIComponent(systemPrompt),
      { timeout: 25000 }
    );

    return (
      res.data?.result ||
      res.data?.raw?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "❌ IA silencieuse."
    );
  } catch {
    return "❌ Erreur serveur IA.";
  }
}

module.exports = {
  config: {
    name: "html",
    version: "3.2",
    author: "Octavio",
    role: 0,
    category: "ai",
    shortDescription: "HTML IA (public / admin)",
    guide: {
      fr:
        "{pn} <description>\n" +
        "{pn} on  → mode admin\n" +
        "{pn} off → mode public"
    }
  },

  onStart: async ({ message, event, args }) => {
    const senderID = event.senderID;
    const isAdmin = global.GoatBot.config.adminBot.includes(senderID);

    // ===== MODE SWITCH =====
    if (args[0] === "on" || args[0] === "off") {
      if (!isAdmin) {
        return message.reply(
          cadre("⛔ Seul un ADMIN BOT peut changer le mode.")
        );
      }

      global.htmlAdminOnly = args[0] === "on";

      return message.reply(
        cadre(
          global.htmlAdminOnly
            ? "🔒 MODE ADMIN ACTIVÉ\nSeuls les admins peuvent utiliser html."
            : "🌍 MODE PUBLIC ACTIVÉ\nTout le monde peut utiliser html."
        )
      );
    }

    // ===== MODE CHECK =====
    if (global.htmlAdminOnly && !isAdmin) {
      return message.reply(
        cadre("🔒 Commande réservée aux ADMINS.")
      );
    }

    // ===== INPUT =====
    let input = args.join(" ");
    if (!input) {
      return message.reply(
        cadre("❌ Décris le HTML à générer.")
      );
    }

    // ===== STYLE =====
    let style = "dark";
    if (input.includes("style=hacker")) style = "hacker";
    if (input.includes("style=neon")) style = "neon";

    const exportFile = input.includes("export");
    input = input.replace(/style=\w+|export/gi, "").trim();

    await message.reply(
      cadre(`⏳ Génération HTML (${style})...`)
    );

    const htmlCode = await generateHTML(input, style);

    // ===== EXPORT =====
    if (exportFile && htmlCode.startsWith("<!DOCTYPE")) {
      const filePath = path.join(
        __dirname,
        `html_${senderID}_${Date.now()}.html`
      );
      await fs.writeFile(filePath, htmlCode, "utf8");

      return message.reply({
        body: cadre("✅ HTML généré et exporté."),
        attachment: fs.createReadStream(filePath)
      });
    }

    return message.reply(cadre(htmlCode));
  }
};EnterhtmlCode));
  }
};
