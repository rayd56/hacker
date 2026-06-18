const axios = require("axios");

// Mémoire simple par utilisateur
const memory = {};

function pushMemory(uid, role, content) {
  if (!memory[uid]) memory[uid] = [];
  memory[uid].push({ role, content });
  if (memory[uid].length > 12) memory[uid].shift();
}

function isCreationQuestion(text) {
  const t = text.toLowerCase();
  return (
    t.includes("qui t'a créé") ||
    t.includes("qui ta créé") ||
    t.includes("qui t'a developpé") ||
    t.includes("qui t'a développé") ||
    t.includes("qui t'a déployé") ||
    t.includes("qui ta deployé")
  );
}

module.exports = {
  config: {
    name: "rayd",
    version: "1.3.0",
    author: "Samycharles",
    role: 0,
    category: "ai",
    shortDescription: "Celestin AI sans préfixe"
  },

  // ✅ OBLIGATOIRE POUR GOATBOT
  onStart: async function ({ message }) {
    return message.reply(
`🌹✨ RAYD ✨🌹

Parle-moi simplement comme ceci :
celestin salut

Ou réponds à mon message pour continuer la discussion.`
    );
  },

  // 🔹 Détection sans préfixe
  onChat: async function ({ api, event }) {
    const msg = (event.body || "").trim();
    if (!msg.toLowerCase().startsWith("rayd")) return;

    const question = msg.replace(/^rayd/i, "").trim();
    if (!question) return;

    return talk(api, event, question);
  },

  // 🔹 Continuer la discussion par réponse
  onReply: async function ({ api, event, Reply }) {
    if (event.senderID !== Reply.author) return;
    const msg = (event.body || "").trim();
    if (!msg) return;
    return talk(api, event, msg);
  }
};

async function talk(api, event, question) {
  const uid = event.senderID;

  api.setMessageReaction("⏳", event.messageID, () => {}, true);

  // Réponse forcée sur la création
  if (isCreationQuestion(question)) {
    const forced =
      "J’ai été crée par Rayd Efoua et configuré ainsi que développé par Rayd🌹.";

    api.sendMessage(
`🌹✨ RAYD ✨🌹

💬 ${forced}`,
      event.threadID,
      (err, info) => {
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "rayd",
          author: uid
        });
      },
      event.messageID
    );
    return;
  }

  pushMemory(uid, "user", question);

  try {
    const context = (memory[uid] || [])
      .map(m => `${m.role}: ${m.content}`)
      .join("\n");

    const res = await axios.get(
      "https://arychauhann.onrender.com/api/gemini-proxy2",
      {
        params: {
          prompt: `Conversation précédente:\n${context}\n\nUtilisateur: ${question}`
        },
        timeout: 60000
      }
    );

    const answer =
      res.data?.result?.trim() || "rayd réfléchit encore…";

    pushMemory(uid, "assistant", answer);

    api.sendMessage(
`🌹✨ RAYD ✨🌹

💬 ${answer}`,
      event.threadID,
      (err, info) => {
        if (err) {
          api.setMessageReaction("❌", event.messageID, () => {}, true);
          return;
        }
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "rayd",
          author: uid
        });
      },
      event.messageID
    );
  } catch (e) {
    api.setMessageReaction("❌", event.messageID, () => {}, true);
    api.sendMessage(
      "🌙 rayd ne peut pas répondre pour le moment.",
      event.threadID,
      event.messageID
    );
  }
}Entercconst axios = require("axios");

// Mémoire simple par utilisateur
const memory = {};

function pushMemory(uid, role, content) {
  if (!memory[uid]) memory[uid] = [];
  memory[uid].push({ role, content });
  if (memory[uid].length > 12) memory[uid].shift();
}

function isCreationQuestion(text) {
  const t = text.toLowerCase();
  return (
    t.includes("qui t'a créé") ||
    t.includes("qui ta créé") ||
    t.includes("qui t'a developpé") ||
    t.includes("qui t'a développé") ||
    t.includes("qui t'a déployé") ||
    t.includes("qui ta deployé")
  );
}

module.exports = {
  config: {
    name: "rayd",
    version: "1.3.0",
    author: "Samycharles",
    role: 0,
    category: "ai",
    shortDescription: "Celestin AI sans préfixe"
  },

  // ✅ OBLIGATOIRE POUR GOATBOT
  onStart: async function ({ message }) {
    return message.reply(
`🌹✨ RAYD ✨🌹

Parle-moi simplement comme ceci :
celestin salut

Ou réponds à mon message pour continuer la discussion.`
    );
  },

  // 🔹 Détection sans préfixe
  onChat: async function ({ api, event }) {
    const msg = (event.body || "").trim();
    if (!msg.toLowerCase().startsWith("rayd")) return;

    const question = msg.replace(/^rayd/i, "").trim();
    if (!question) return;

    return talk(api, event, question);
  },

  // 🔹 Continuer la discussion par réponse
  onReply: async function ({ api, event, Reply }) {
    if (event.senderID !== Reply.author) return;
    const msg = (event.body || "").trim();
    if (!msg) return;
    return talk(api, event, msg);
  }
};

async function talk(api, event, question) {
  const uid = event.senderID;

  api.setMessageReaction("⏳", event.messageID, () => {}, true);

  // Réponse forcée sur la création
  if (isCreationQuestion(question)) {
    const forced =
      "J’ai été crée par Rayd Efoua et configuré ainsi que développé par Rayd🌹.";

    api.sendMessage(
`🌹✨ RAYD ✨🌹

💬 ${forced}`,
      event.threadID,
      (err, info) => {
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "rayd",
          author: uid
        });
      },
      event.messageID
    );
    return;
  }

  pushMemory(uid, "user", question);

  try {
    const context = (memory[uid] || [])
      .map(m => `${m.role}: ${m.content}`)
      .join("\n");

    const res = await axios.get(
      "https://arychauhann.onrender.com/api/gemini-proxy2",
      {
        params: {
          prompt: `Conversation précédente:\n${context}\n\nUtilisateur: ${question}`
        },
        timeout: 60000
      }
    );

    const answer =
      res.data?.result?.trim() || "rayd réfléchit encore…";

    pushMemory(uid, "assistant", answer);

    api.sendMessage(
`🌹✨ RAYD ✨🌹

💬 ${answer}`,
      event.threadID,
      (err, info) => {
        if (err) {
          api.setMessageReaction("❌", event.messageID, () => {}, true);
          return;
        }
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "rayd",
          author: uid
        });
      },
      event.messageID
    );
  } catch (e) {
    api.setMessageReaction("❌", event.messageID, () => {}, true);
    api.sendMessage(
      "🌙 rayd ne peut pas répondre pour le moment.",
      event.threadID,
      event.messageID
    );
  }
}EntergeID
    );
  }
}
