const userStats = {}; // mémoire simple (runtime)

module.exports = {
  config: {
    name: "memory",
    aliases: ["memo"],
    version: "2.2",
    author: "rayd",
    countDown: 5,
    role: 0,
    shortDescription: {
      fr: "Jeu de mémoire sombre avec XP et difficulté"
    },
    longDescription: {
      fr: "Mémorise une suite d’emojis, gagne de l’XP et augmente la difficulté"
    },
    category: "games",
    guide: {
      fr: "Utilise : memory"
    }
  },

  onStart: async function ({ api, event }) {
    const uid = event.senderID;

    if (!userStats[uid]) {
      userStats[uid] = {
        xp: 0,
        score: 0,
        level: 1
      };
    }

    const stats = userStats[uid];

    const emojiPacks = [
      ["🍎","🍌","🍇","🍉","🍓","🍒","🥝","🍍"],
      ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼"],
      ["😀","😂","🥲","😍","😎","🤓","😡","😭"],
      ["⚽","🏀","🎮","🎯","🏓","🏸"],
      ["⭐","✨","🌙","⚡","🌈","❄️"]
    ];

    const emojis = emojiPacks[Math.floor(Math.random() * emojiPacks.length)];

    // difficulté progressive
    const length = Math.min(3 + stats.level - 1, 8);

    const sequence = Array.from({ length }, () =>
      emojis[Math.floor(Math.random() * emojis.length)]
    );

    // Temps d'affichage selon le niveau (5 à 10 secondes max)
    const displayTime = Math.min(5000 + (stats.level - 1) * 1000, 10000);

    api.sendMessage(
      `━━━━━━━━━━━━━━
🧠 MEMORY
━━━━━━━━━━━━━━

👤 Niveau : ${stats.level}
⭐ XP : ${stats.xp}
🏆 Score : ${stats.score}

Mémorise :

${sequence.join("  ")}

⏳ ${displayTime / 1000} secondes`,
      event.threadID,
      (err, info) => {
        if (err) return;

        setTimeout(() => {
          api.unsendMessage(info.messageID);

          api.sendMessage(
            `⌨️ Réponds avec la suite exacte`,
            event.threadID,
            (err2, replyInfo) => {
              if (err2) return;

              global.GoatBot.onReply.set(replyInfo.messageID, {
                commandName: "memory",
                author: uid,
                sequence
              });
            }
          );
        }, displayTime);
      }
    );
  },

  onReply: async function ({ api, event, Reply }) {
    if (!Reply || event.senderID !== Reply.author) return;

    const uid = event.senderID;
    const stats = userStats[uid];

    // Normalisation et suppression des espaces pour éviter les erreurs
    const userInput = event.body.trim().split(/\s*/).map(e => e.normalize("NFC"));
    const correct = Reply.sequence.map(e => e.normalize("NFC"));

    const win = userInput.join("") === correct.join("");

    if (win) {
      stats.score += 1;
      stats.xp += 10 * stats.level;

      if (stats.score % 3 === 0) {
        stats.level += 1;
      }

      api.sendMessage(
        `━━━━━━━━━━━━━━
✔️ Réussi
━━━━━━━━━━━━━━

+${10 * stats.level} XP
🏆 Score : ${stats.score}
📈 Niveau : ${stats.level}`,
        event.threadID
      );
    } else {
      stats.score = 0;

      api.sendMessage(
        `━━━━━━━━━━━━━━
✖️ Échec
━━━━━━━━━━━━━━

Suite correcte :
${correct.join(" ")}

Score réinitialisé.`,
        event.threadID
      );
    }

    global.GoatBot.onReply.delete(event.messageReply.messageID);
  }
};Entercconst userStats = {}; // mémoire simple (runtime)

module.exports = {
  config: {
    name: "memory",
    aliases: ["memo"],
    version: "2.2",
    author: "rayd",
    countDown: 5,
    role: 0,
    shortDescription: {
      fr: "Jeu de mémoire sombre avec XP et difficulté"
    },
    longDescription: {
      fr: "Mémorise une suite d’emojis, gagne de l’XP et augmente la difficulté"
    },
    category: "games",
    guide: {
      fr: "Utilise : memory"
    }
  },

  onStart: async function ({ api, event }) {
    const uid = event.senderID;

    if (!userStats[uid]) {
      userStats[uid] = {
        xp: 0,
        score: 0,
        level: 1
      };
    }

    const stats = userStats[uid];

    const emojiPacks = [
      ["🍎","🍌","🍇","🍉","🍓","🍒","🥝","🍍"],
      ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼"],
      ["😀","😂","🥲","😍","😎","🤓","😡","😭"],
      ["⚽","🏀","🎮","🎯","🏓","🏸"],
      ["⭐","✨","🌙","⚡","🌈","❄️"]
    ];

    const emojis = emojiPacks[Math.floor(Math.random() * emojiPacks.length)];

    // difficulté progressive
    const length = Math.min(3 + stats.level - 1, 8);

    const sequence = Array.from({ length }, () =>
      emojis[Math.floor(Math.random() * emojis.length)]
    );

    // Temps d'affichage selon le niveau (5 à 10 secondes max)
    const displayTime = Math.min(5000 + (stats.level - 1) * 1000, 10000);

    api.sendMessage(
      `━━━━━━━━━━━━━━
🧠 MEMORY
━━━━━━━━━━━━━━

👤 Niveau : ${stats.level}
⭐ XP : ${stats.xp}
🏆 Score : ${stats.score}

Mémorise :

${sequence.join("  ")}

⏳ ${displayTime / 1000} secondes`,
      event.threadID,
      (err, info) => {
        if (err) return;

        setTimeout(() => {
          api.unsendMessage(info.messageID);

          api.sendMessage(
            `⌨️ Réponds avec la suite exacte`,
            event.threadID,
            (err2, replyInfo) => {
              if (err2) return;

              global.GoatBot.onReply.set(replyInfo.messageID, {
                commandName: "memory",
                author: uid,
                sequence
              });
            }
          );
        }, displayTime);
      }
    );
  },

  onReply: async function ({ api, event, Reply }) {
    if (!Reply || event.senderID !== Reply.author) return;

    const uid = event.senderID;
    const stats = userStats[uid];

    // Normalisation et suppression des espaces pour éviter les erreurs
    const userInput = event.body.trim().split(/\s*/).map(e => e.normalize("NFC"));
    const correct = Reply.sequence.map(e => e.normalize("NFC"));

    const win = userInput.join("") === correct.join("");

    if (win) {
      stats.score += 1;
      stats.xp += 10 * stats.level;

      if (stats.score % 3 === 0) {
        stats.level += 1;
      }

      api.sendMessage(
        `━━━━━━━━━━━━━━
✔️ Réussi
━━━━━━━━━━━━━━

+${10 * stats.level} XP
🏆 Score : ${stats.score}
📈 Niveau : ${stats.level}`,
        event.threadID
      );
    } else {
      stats.score = 0;

      api.sendMessage(
        `━━━━━━━━━━━━━━
✖️ Échec
━━━━━━━━━━━━━━

Suite correcte :
${correct.join(" ")}

Score réinitialisé.`,
        event.threadID
      );
    }

    global.GoatBot.onReply.delete(event.messageReply.messageID);
  }
};Entereply.messageID);
  }
};
