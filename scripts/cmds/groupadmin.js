const OWNER_UIDS = ["61577243652962"];
const LOG_GROUP_ID = "4200466550263927";

const SPAM_CONFIG = {
  messageLimit: 5,
  timeWindow: 10000,
  kickAfterWarnings: 1
};

const BANNED_WORDS = ["spam", "pub", "arnaque", "scam"];

const { getStreamFromURL } = global.utils;

// Stockage en mémoire
const userMessages    = {};
const warnings        = {};
const autoModeration  = {};

// Intervalle en ms (5 minutes par défaut)
const PENDING_CHECK_INTERVAL = 5 * 60 * 1000;
const pendingNotifIntervals   = {};
const lastKnownPending        = {};

function box(title, content) {
  return `┏━━━━━━━Ι ❖ Ι━━━━━━━┓\n ${title}|💧\n❯_━━━━━━Ι ❖ Ι━━━━━━_❮\n\n${content}\n\n┗━━━━━━━Ι ❖ Ι━━━━━━━┛`;
}

function long(title, content) {
  return `━━━━━━━━━━━━━━━━━━━━━\n ${title}|💧\n━━━━━━━━━━━━━━━━━━━━━\n\n${content}\n\n━━━━━━━━━━━━━━━━━━━━━`;
}

function extractUID(entry) {
  if (!entry) return null;
  if (typeof entry === "string") return entry;
  return (
    entry.userFbId    ||
    entry.userID      ||
    entry.requesterID ||
    entry.sender?.id  ||
    entry.id          ||
    null
  );
}

module.exports = {
  config: {
    name: "groupadmin",
    aliases: ["gadm", "groupmgr", "gmgr"],
    version: "7.0",
    author: "EMPEREUR ROMEOꜛꗄꔰ",
    countDown: 3,
    role: 1,
    description: "𝗚𝗲𝘀𝘁𝗶𝗼𝗻 𝗧𝗢𝗧𝗔𝗟𝗘 𝗱𝘂 𝗴𝗿𝗼𝘂𝗽𝗲 𝗮𝘃𝗲𝗰 𝗮𝘂𝘁𝗼-𝗺𝗼𝗱𝗲𝗿𝗮𝘁𝗶𝗼𝗻",
    category: "admin",
    guide: {
      en: "   {pn} help => 𝗧𝗼𝘂𝘁𝗲𝘀 𝗹𝗲𝘀 commandes\n"
        + "   {pn} auto on/off => 𝗔𝘂𝘁𝗼-𝗺𝗼𝗱𝗲𝗿𝗮𝘁𝗶𝗼𝗻\n"
        + "   {pn} approve => 𝗗𝗲𝗺𝗮𝗻𝗱𝗲𝘀 𝗲𝗻 attente\n"
        + "   {pn} kick @tag => 𝗘𝘅𝗽𝘂𝗹𝘀𝗲𝗿\n"
        + "   {pn} theme <description> => 𝗧𝗵𝗲𝗺𝗲 𝗔𝗜\n"
        + "   {pn} theme apply <ID> => 𝗔𝗽𝗽𝗹𝗶𝗾𝘂𝗲𝗿 𝗽𝗮𝗿 ID\n"
        + "   {pn} notif on/off => 𝗔𝘂𝘁𝗼-𝗻𝗼𝘁𝗶𝗳 pending"
    }
  },

  langs: {
    en: {
      noPermission:      "⚠️𝗣𝗘𝗥𝗠𝗜𝗦𝗦𝗜𝗢𝗡 𝗗𝗘𝗡𝗜𝗘𝗗",
      botNotAdmin:       "⚠️𝗕𝗢𝗧 𝗡𝗢𝗧 𝗔𝗗𝗠𝗜𝗡",
      autoEnabled:       "✅𝗔𝗨𝗧𝗢-𝗠𝗢𝗗 𝗔𝗖𝗧𝗜𝗩𝗘",
      autoDisabled:      "⏸️𝗔𝗨𝗧𝗢-𝗠𝗢𝗗 𝗗𝗘𝗦𝗔𝗖𝗧𝗜𝗩𝗘",
      spamKick:          "👢𝗦𝗣𝗔𝗠 𝗞𝗜𝗖𝗞",
      bannedWordKick:    "👢𝗠𝗢𝗧 𝗜𝗡𝗧𝗘𝗥𝗗𝗜𝗧",
      suspendedRemoved:  "🗑️𝗖𝗢𝗠𝗣𝗧𝗘 𝗦𝗨𝗣𝗣𝗥𝗜𝗠𝗘",
      cleanComplete:     "✅𝗡𝗘𝗧𝗧𝗢𝗬𝗔𝗚𝗘 𝗧𝗘𝗥𝗠𝗜𝗡𝗘",
      nameChanged:       "✅𝗡𝗢𝗠 𝗠𝗢𝗗𝗜𝗙𝗜𝗘",
      emojiChanged:      "✅𝗘𝗠𝗢𝗝𝗜 𝗠𝗢𝗗𝗜𝗙𝗜𝗘",
      themeChanged:      "✅𝗧𝗛𝗘𝗠𝗘 𝗔𝗣𝗣𝗟𝗜𝗤𝗨𝗘",
      photoChanged:      "✅𝗣𝗛𝗢𝗧𝗢 𝗠𝗢𝗗𝗜𝗙𝗜𝗘𝗘",
      noPending:         "✅𝗔𝗨𝗖𝗨𝗡𝗘 𝗗𝗘𝗠𝗔𝗡𝗗𝗘",
      approved:          "✅𝗔𝗣𝗣𝗥𝗢𝗨𝗩𝗘",
      rejected:          "❌𝗥𝗘𝗝𝗘𝗧𝗘",
      approveAllDone:    "✅𝗧𝗢𝗨𝗧 𝗔𝗣𝗣𝗥𝗢𝗨𝗩𝗘"
    }
  },

  onStart: async function ({ api, event, args, threadsData, usersData, message, getLang }) {
    const { threadID, senderID } = event;

    if (!event.isGroup) {
      return message.reply(box("ℹ️𝗜𝗡𝗙𝗢", "💧| 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝗲 𝗿𝗲𝘀𝗲𝗿𝘃𝗲𝗲 𝗮𝘂𝘅 𝗴𝗿𝗼𝘂𝗽𝗲𝘀 🪶🧘🏻‍♂️"));
    }

    const threadInfo = await api.getThreadInfo(threadID);
    const botID      = api.getCurrentUserID();

    const isBotAdmin  = threadInfo.adminIDs?.some(a => a.id === botID);
    const isUserAdmin = threadInfo.adminIDs?.some(a => a.id === senderID);

    if (!isBotAdmin) {
      return message.reply(box(getLang("botNotAdmin"),
        "💧| 𝗔𝗷𝗼𝘂𝘁𝗲𝘇-𝗺𝗼𝗶 𝗰𝗼𝗺𝗺𝗲 𝗮𝗱𝗺𝗶𝗻\n𝗽𝗼𝘂𝗿 𝗴𝗲𝗿𝗲𝗿 𝗹𝗲 𝗴𝗿𝗼𝘂𝗽𝗲 🪶🧘🏻‍♂️"));
    }

    if (!isUserAdmin) {
      return message.reply(box(getLang("noPermission"),
        "💧| 𝗦𝗲𝘂𝗹𝘀 𝗹𝗲𝘀 𝗮𝗱𝗺𝗶𝗻𝘀 𝗼𝗻𝘁\n𝗮𝗰𝗰𝗲𝘀 à 𝗰𝗲𝘁𝘁𝗲 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝗲 🪶🧘🏻‍♂️"));
    }

    const command = args[0]?.toLowerCase();

    //Help 
    if (!command || command === "help") {
      const content =
        "🤖 𝗔𝘂𝘁𝗼-𝗺𝗼𝗱𝗲𝗿𝗮𝘁𝗶𝗼𝗻:\n» {pn} auto on/off\n\n"
      + "👥 𝗠𝗲𝗺𝗯𝗿𝗲𝘀:\n» {pn} approve [n/all]\n» {pn} reject <n>\n» {pn} kick @user\n» {pn} clean\n\n"
      + "🎨 𝗔𝗽𝗽𝗮𝗿𝗲𝗻𝗰𝗲:\n» {pn} theme <description>\n» {pn} theme apply <ID>\n» {pn} theme id\n» {pn} name <nom>\n» {pn} emoji <emoji>\n» {pn} photo\n\n"
      + "🔔 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻𝘀:\n» {pn} notif on/off\n» {pn} notif status\n\n"
      + "📊 𝗜𝗻𝗳𝗼𝘀:\n» {pn} info\n» {pn} admins\n\n"
      + "💧| 𝗧𝗮𝗽𝗲𝘇 𝘂𝗻𝗲 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝗲 🪶🧘🏻‍♂️";
      return message.reply(long("🛡️𝗚𝗥𝗢𝗨𝗣 𝗠𝗔𝗡𝗔𝗚𝗘𝗥", content));
    }

    //AUTO-MOD 
    if (command === "auto") {
      const action = args[1]?.toLowerCase();
      if (action === "on") {
        autoModeration[threadID] = { enabled: true, antiSpam: true, bannedWords: true, cleanSuspended: true };
        return message.reply(box(getLang("autoEnabled"),
          "» 𝗔𝗻𝘁𝗶-𝘀𝗽𝗮𝗺 ✅\n» 𝗠𝗼𝘁𝘀 𝗶𝗻𝘁𝗲𝗿𝗱𝗶𝘁𝘀 ✅\n» 𝗖𝗼𝗺𝗽𝘁𝗲𝘀 𝘀𝘂𝘀𝗽𝗲𝗻𝗱𝘂𝘀 ✅ 🪶🧘🏻‍♂️"));
      } else if (action === "off") {
        autoModeration[threadID] = { enabled: false };
        return message.reply(box(getLang("autoDisabled"),
          "💧| 𝗔𝘂𝘁𝗼-𝗺𝗼𝗱𝗲𝗿𝗮𝘁𝗶𝗼𝗻 𝗱𝗲𝘀𝗮𝗰𝘁𝗶𝘃𝗲𝗲 🪶🧘🏻‍♂️"));
      } else {
        const status = autoModeration[threadID]?.enabled ? "✅ 𝗔𝗰𝘁𝗶𝘃𝗲" : "⏸️ 𝗜𝗻𝗮𝗰𝘁𝗶𝘃𝗲";
        return message.reply(box("🤖𝗔𝗨𝗧𝗢-𝗠𝗢𝗗",
          `𝗦𝘁𝗮𝘁𝘂𝘀: ${status}\n\n💧| {pn} auto on/off 🪶🧘🏻‍♂️`));
      }
    }

    //AUTO-NOTIF PENDING
    if (command === "notif") {
      const action = args[1]?.toLowerCase();

      if (action === "on") {
        // Éviter doublon
        if (pendingNotifIntervals[threadID]) {
          clearInterval(pendingNotifIntervals[threadID]);
        }

        pendingNotifIntervals[threadID] = setInterval(async () => {
          try {
            const info  = await api.getThreadInfo(threadID);
            const queue = info.approvalQueue || [];

            if (queue.length === 0) return;

            // Notifier seulement si nouvelle demande détectée
            const prev = lastKnownPending[threadID] || 0;
            if (queue.length !== prev) {
              lastKnownPending[threadID] = queue.length;
              const adminMentions = threadInfo.adminIDs.map(a => `@${a.id}`).join(" ");
              const content =
                `📊 ${queue.length} 𝗱𝗲𝗺𝗮𝗻𝗱𝗲(𝘀) 𝗲𝗻 𝗮𝘁𝘁𝗲𝗻𝘁𝗲\n\n`
              + `💧| {pn} approve all — 𝗧𝗼𝘂𝘁 𝗮𝗽𝗽𝗿𝗼𝘂𝘃𝗲𝗿\n`
              + `💧| {pn} approve — 𝗩𝗼𝗶𝗿 𝗹𝗮 𝗹𝗶𝘀𝘁𝗲 🪶🧘🏻‍♂️`;
              api.sendMessage(box("🔔𝗡𝗢𝗨𝗩𝗘𝗟𝗟𝗘𝗦 𝗗𝗘𝗠𝗔𝗡𝗗𝗘𝗦", content), threadID);
            }
          } catch (e) {
            console.error("Auto-notif pending error:", e);
          }
        }, PENDING_CHECK_INTERVAL);

        lastKnownPending[threadID] = 0;
        return message.reply(box("🔔𝗔𝗨𝗧𝗢-𝗡𝗢𝗧𝗜𝗙 𝗔𝗖𝗧𝗜𝗩𝗘",
          `⏱️ 𝗩𝗲𝗿𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 𝗰𝗵𝗮𝗾𝘂𝗲 ${PENDING_CHECK_INTERVAL / 60000} 𝗺𝗶𝗻𝘂𝘁𝗲𝘀\n💧| 𝗔𝗱𝗺𝗶𝗻𝘀 𝗮𝗹𝗲𝗿𝘁𝗲𝘀 𝗮𝘂𝘁𝗼𝗺𝗮𝘁𝗶𝗾𝘂𝗲𝗺𝗲𝗻𝘁 🪶🧘🏻‍♂️`));

      } else if (action === "off") {
        if (pendingNotifIntervals[threadID]) {
          clearInterval(pendingNotifIntervals[threadID]);
          delete pendingNotifIntervals[threadID];
          delete lastKnownPending[threadID];
        }
        return message.reply(box("🔕𝗔𝗨𝗧𝗢-𝗡𝗢𝗧𝗜𝗙 𝗗𝗘𝗦𝗔𝗖𝗧𝗜𝗩𝗘",
          "💧| 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻𝘀 𝗮𝗿𝗿𝗲𝘁𝗲𝗲𝘀 🪶🧘🏻‍♂️"));

      } else {
        const active = !!pendingNotifIntervals[threadID];
        return message.reply(box("🔔𝗦𝗧𝗔𝗧𝗨𝗦 𝗡𝗢𝗧𝗜𝗙",
          `𝗦𝘁𝗮𝘁𝘂𝘀: ${active ? "✅ 𝗔𝗰𝘁𝗶𝘃𝗲" : "⏸️ 𝗜𝗻𝗮𝗰𝘁𝗶𝘃𝗲"}\n\n💧| {pn} notif on/off 🪶🧘🏻‍♂️`));
      }
    }

    //Theme
    if (command === "theme" || command === "color") {
      const sub = args[1]?.toLowerCase();

      // Voir ID du thème actuel
      if (sub === "id") {
        try {
          const themeId = threadInfo?.threadTheme?.id || threadInfo?.color || "𝗜𝗻𝗰𝗼𝗻𝗻𝘂";
          return message.reply(box("🎨𝗧𝗛𝗘𝗠𝗘 𝗔𝗖𝗧𝗨𝗘𝗟",
            `📌 𝗜𝗗: ${themeId} 🪶🧘🏻‍♂️`));
        } catch (err) {
          return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
        }
      }

      // Appliquer par ID direct
      if (sub === "apply" || sub === "set") {
        const themeId = args[2];
        if (!themeId) {
          return message.reply(box("🎨𝗔𝗣𝗣𝗟𝗬 𝗧𝗛𝗘𝗠𝗘",
            "💧| 𝗨𝘀𝗮𝗴𝗲: {pn} theme apply <𝗜𝗗> 🪶🧘🏻‍♂️"));
        }
        try {
          await api.changeThreadColor(themeId, threadID);
          return message.reply(box(getLang("themeChanged"),
            `📌 𝗜𝗗: ${themeId}\n💧| 𝗔𝗽𝗽𝗹𝗶𝗾𝘂𝗲 𝗮𝘃𝗲𝗰 𝘀𝘂𝗰𝗰𝗲𝘀 🪶🧘🏻‍♂️`));
        } catch (err) {
          return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
        }
      }

      // Afficher thème actuel (aucun argument)
      if (!sub) {
        try {
          await message.reply(box("🔍𝗧𝗛𝗘𝗠𝗘 𝗔𝗖𝗧𝗨𝗘𝗟",
            "💧| 𝗥𝗲𝗰𝘂𝗽𝗲𝗿𝗮𝘁𝗶𝗼𝗻 𝗲𝗻 𝗰𝗼𝘂𝗿𝘀... 🪶🧘🏻‍♂️"));

          const theme      = threadInfo.threadTheme;
          const themeId    = theme?.id || theme?.theme_fbid || "𝗗𝗲𝗳𝗮𝘂𝗹𝘁";
          let   colorInfo  = threadInfo.color || theme?.accessibility_label || "𝗗𝗲𝗳𝗮𝘂𝗹𝘁";
          const attachments = [];

          const extractUrl = (obj) => {
            if (!obj) return null;
            if (typeof obj === "string") return obj;
            return obj.uri || obj.url || null;
          };

          if (theme) {
            try {
              const themeData = await api.fetchThemeData(themeId);
              if (themeData) {
                if (themeData.name) colorInfo = themeData.name;
                if (themeData.backgroundImage) {
                  const bgUrl = extractUrl(themeData.backgroundImage);
                  if (bgUrl) {
                    try {
                      const stream = await getStreamFromURL(bgUrl, "current_theme.png");
                      if (stream) attachments.push(stream);
                    } catch (_) {}
                  }
                }
              }
            } catch (_) {}
          }

          const body =
            `📌 𝗜𝗗: ${themeId}\n`
          + `🎨 𝗖𝗼𝘂𝗹𝗲𝘂𝗿: ${colorInfo}\n\n`
          + `💧| {pn} theme <𝗱𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻> — 𝗖𝗿𝗲𝗲𝗿 𝘁𝗵𝗲𝗺𝗲 𝗔𝗜\n`
          + `💧| {pn} theme apply <𝗜𝗗> — 𝗔𝗽𝗽𝗹𝗶𝗾𝘂𝗲𝗿 🪶🧘🏻‍♂️`;

          if (!theme) return message.reply(box("ℹ️𝗧𝗛𝗘𝗠𝗘", "💧| 𝗧𝗵𝗲𝗺𝗲 𝗽𝗮𝗿 𝗱𝗲𝗳𝗮𝘂𝘁 𝗮𝗰𝘁𝗶𝗳 🪶🧘🏻‍♂️"));

          return message.reply({
            body: box("🎨𝗧𝗛𝗘𝗠𝗘 𝗔𝗖𝗧𝗨𝗘𝗟", body),
            attachment: attachments.length > 0 ? attachments : undefined
          });
        } catch (err) {
          return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
        }
      }

      // Générer thème AI avec description
      const prompt = args.slice(1).join(" ");
      if (!prompt) {
        return message.reply(box("🎨𝗧𝗛𝗘𝗠𝗘 𝗔𝗜",
          "💧| 𝗨𝘀𝗮𝗴𝗲: {pn} theme <𝗱𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻>\n𝗘𝘅: {pn} theme ocean sunset purple 🪶🧘🏻‍♂️"));
      }

      await message.reply(box("⏳𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗜𝗢𝗡",
        "💧| 𝗖𝗿𝗲𝗮𝘁𝗶𝗼𝗻 𝗱𝘂 𝘁𝗵𝗲𝗺𝗲 𝗔𝗜...\n𝗣𝗮𝘁𝗶𝗲𝗻𝘁𝗲𝘇 🪶🧘🏻‍♂️"));

      try {
        const themes = await api.createAITheme(prompt, 5);

        if (!themes || themes.length === 0) {
          return message.reply(box("❌𝗔𝗨𝗖𝗨𝗡 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗧",
            "💧| 𝗘𝘀𝘀𝗮𝘆𝗲𝘇 𝘂𝗻𝗲 𝗮𝘂𝘁𝗿𝗲 𝗱𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻 🪶🧘🏻‍♂️"));
        }

        const extractUrl = (obj) => {
          if (!obj) return null;
          if (typeof obj === "string") return obj;
          return obj.uri || obj.url || null;
        };

        let themeList = "";
        const attachments = [];

        for (let i = 0; i < themes.length; i++) {
          const t = themes[i];
          let colorInfo = "AI Generated";
          if (t.accessibility_label)                      colorInfo = t.accessibility_label;
          else if (t.gradient_colors?.length > 0)         colorInfo = t.gradient_colors.join(" → ");
          else if (t.primary_color)                       colorInfo = t.primary_color;

          themeList += `${i + 1}. 𝗜𝗗: ${t.id}\n   🎨 ${colorInfo}\n\n`;

          // Récupérer aperçu image
          let imageUrls = [];
          if (t.preview_image_urls) {
            const light = extractUrl(t.preview_image_urls.light_mode);
            const dark  = extractUrl(t.preview_image_urls.dark_mode);
            if (light) imageUrls.push({ url: light, name: `theme_${i+1}_light.png` });
            if (dark && dark !== light) imageUrls.push({ url: dark, name: `theme_${i+1}_dark.png` });
          }
          if (!imageUrls.length && t.background_asset?.image) {
            const u = extractUrl(t.background_asset.image);
            if (u) imageUrls.push({ url: u, name: `theme_${i+1}_bg.png` });
          }
          if (!imageUrls.length && t.icon_asset?.image) {
            const u = extractUrl(t.icon_asset.image);
            if (u) imageUrls.push({ url: u, name: `theme_${i+1}_icon.png` });
          }
          if (!imageUrls.length && t.alternative_themes?.length > 0) {
            for (const alt of t.alternative_themes) {
              const u = extractUrl(alt.background_asset?.image);
              if (u) { imageUrls.push({ url: u, name: `theme_${i+1}_alt.png` }); break; }
            }
          }

          for (const img of imageUrls) {
            try {
              const stream = await getStreamFromURL(img.url, img.name);
              if (stream) attachments.push(stream);
            } catch (_) {}
          }
        }

        themeList += `💧| 𝗥𝗲𝗽𝗼𝗻𝗱𝗲𝘇 𝗮𝘃𝗲𝗰 𝟭-${themes.length} 𝗽𝗼𝘂𝗿 𝗮𝗽𝗽𝗹𝗶𝗾𝘂𝗲𝗿 🪶🧘🏻‍♂️`;
        const replyBody = long(`✨𝗧𝗛𝗘𝗠𝗘𝗦 𝗔𝗜 (${themes.length})`, themeList);

        message.reply({
          body: replyBody,
          attachment: attachments.length > 0 ? attachments : undefined
        }, (err, info) => {
          const finalInfo = err ? null : info;
          if (err) {
            message.reply(replyBody, (e2, i2) => {
              if (e2) return;
              global.GoatBot.onReply.set(i2.messageID, {
                commandName: "groupadmin",
                author: event.senderID,
                themes,
                threadID
              });
            });
            return;
          }
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "groupadmin",
            author: event.senderID,
            themes,
            threadID
          });
        });

      } catch (err) {
        return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
      }
      return;
    }
//Approve
    if (command === "approve" || command === "pending") {
      const rawQueue = threadInfo.approvalQueue || [];

      if (rawQueue.length === 0) {
        return message.reply(box(getLang("noPending"),
          "💧| 𝗔𝘂𝗰𝘂𝗻𝗲 𝗱𝗲𝗺𝗮𝗻𝗱𝗲 𝗲𝗻 𝗮𝘁𝘁𝗲𝗻𝘁𝗲 🪶🧘🏻‍♂️"));
      }

      // Approve ALL
      if (args[1]?.toLowerCase() === "all") {
        let approved = 0;
        let failed   = 0;
        for (const entry of rawQueue) {
          const uid = extractUID(entry);
          if (!uid) { failed++; continue; }
          try {
            await api.addUserToGroup(uid, threadID);
            approved++;
            await new Promise(r => setTimeout(r, 800));
          } catch (e) {
            console.error("approve all error:", uid, e.message);
            failed++;
          }
        }
        const content =
          `✅ ${approved} 𝗮𝗽𝗽𝗿𝗼𝘂𝘃𝗲(𝘀)\n`
        + (failed > 0 ? `❌ ${failed} 𝗲𝗰𝗵𝗲𝗰(𝘀)\n` : "")
        + "🪶🧘🏻‍♂️";
        return message.reply(box(getLang("approveAllDone"), content));
      }

      // Approve par numéro
      if (args[1] && !isNaN(args[1])) {
        const idx = parseInt(args[1]) - 1;
        if (idx < 0 || idx >= rawQueue.length) {
          return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥",
            `💧| 𝗡𝘂𝗺𝗲𝗿𝗼 𝗱𝗲 𝟭 à ${rawQueue.length} 🪶🧘🏻‍♂️`));
        }
        const uid = extractUID(rawQueue[idx]);
        if (!uid) {
          return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥",
            "💧| 𝗜𝗱𝗲𝗻𝘁𝗶𝗳𝗶𝗮𝗻𝘁 𝗶𝗻𝘁𝗿𝗼𝘂𝘃𝗮𝗯𝗹𝗲 🪶🧘🏻‍♂️"));
        }
        try {
          await api.addUserToGroup(uid, threadID);
          let name = "𝗨𝘁𝗶𝗹𝗶𝘀𝗮𝘁𝗲𝘂𝗿";
          try {
            const info = await api.getUserInfo(uid);
            name = info[uid]?.name || name;
          } catch (_) {}
          return message.reply(box(getLang("approved"),
            `👤 ${name}\n🆔 ${uid}\n\n💧| 𝗔 𝗲𝘁𝗲 𝗮𝗽𝗽𝗿𝗼𝘂𝘃𝗲(𝗲) ✅ 🪶🧘🏻‍♂️`));
        } catch (err) {
          return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
        }
      }

      // Lister les demandes en attente avec résolution des noms
      let list = `📊 𝗧𝗼𝘁𝗮𝗹: ${rawQueue.length} 𝗱𝗲𝗺𝗮𝗻𝗱𝗲(𝘀)\n\n`;

      for (let i = 0; i < rawQueue.length; i++) {
        const uid = extractUID(rawQueue[i]);
        let name  = "𝗜𝗻𝗰𝗼𝗻𝗻𝘂";
        if (uid) {
          try {
            const info = await api.getUserInfo(uid);
            name = info[uid]?.name || name;
          } catch (_) {}
        }
        list += `${i + 1}. 👤 ${name}\n   🆔 ${uid || "𝗡/𝗔"}\n\n`;
      }

      list +=
        "💧| {pn} approve <n> — 𝗔𝗽𝗽𝗿𝗼𝘂𝘃𝗲𝗿 𝘂𝗻\n"
      + "💧| {pn} approve all — 𝗧𝗼𝘂𝘁 𝗮𝗽𝗽𝗿𝗼𝘂𝘃𝗲𝗿\n"
      + "💧| {pn} reject <n> — 𝗥𝗲𝗷𝗲𝘁𝗲𝗿 🪶🧘🏻‍♂️";

      return message.reply(long("📋𝗗𝗘𝗠𝗔𝗡𝗗𝗘𝗦 𝗘𝗡 𝗔𝗧𝗧𝗘𝗡𝗧𝗘", list));
    }

    //REJECT 
    if (command === "reject") {
      const rawQueue = threadInfo.approvalQueue || [];

      if (!args[1] || isNaN(args[1])) {
        return message.reply(box("❌𝗥𝗘𝗝𝗘𝗖𝗧",
          "💧| 𝗨𝘀𝗮𝗴𝗲: {pn} reject <𝗻𝘂𝗺𝗲𝗿𝗼> 🪶🧘🏻‍♂️"));
      }

      const idx = parseInt(args[1]) - 1;
      if (idx < 0 || idx >= rawQueue.length) {
        return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥",
          `💧| 𝗡𝘂𝗺𝗲𝗿𝗼 𝗱𝗲 𝟭 à ${rawQueue.length} 🪶🧘🏻‍♂️`));
      }

      const uid = extractUID(rawQueue[idx]);
      if (!uid) {
        return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥",
          "💧| 𝗜𝗱𝗲𝗻𝘁𝗶𝗳𝗶𝗮𝗻𝘁 𝗶𝗻𝘁𝗿𝗼𝘂𝘃𝗮𝗯𝗹𝗲 🪶🧘🏻‍♂️"));
      }

      try {
        await api.removeUserFromGroup(uid, threadID);
        let name = "𝗨𝘁𝗶𝗹𝗶𝘀𝗮𝘁𝗲𝘂𝗿";
        try {
          const info = await api.getUserInfo(uid);
          name = info[uid]?.name || name;
const OWNER_UIDS = ["61577243652962"];
const LOG_GROUP_ID = "4200466550263927";

const SPAM_CONFIG = {
  messageLimit: 5,
  timeWindow: 10000,
  kickAfterWarnings: 1
};

const BANNED_WORDS = ["spam", "pub", "arnaque", "scam"];

const { getStreamFromURL } = global.utils;

// Stockage en mémoire
const userMessages    = {};
const warnings        = {};
const autoModeration  = {};

// Intervalle en ms (5 minutes par défaut)
const PENDING_CHECK_INTERVAL = 5 * 60 * 1000;
const pendingNotifIntervals   = {};
const lastKnownPending        = {};

function box(title, content) {
  return `┏━━━━━━━Ι ❖ Ι━━━━━━━┓\n ${title}|💧\n❯_━━━━━━Ι ❖ Ι━━━━━━_❮\n\n${content}\n\n┗━━━━━━━Ι ❖ Ι━━━━━━━┛`;
}

function long(title, content) {
  return `━━━━━━━━━━━━━━━━━━━━━\n ${title}|💧\n━━━━━━━━━━━━━━━━━━━━━\n\n${content}\n\n━━━━━━━━━━━━━━━━━━━━━`;
}

function extractUID(entry) {
  if (!entry) return null;
  if (typeof entry === "string") return entry;
  return (
    entry.userFbId    ||
    entry.userID      ||
    entry.requesterID ||
    entry.sender?.id  ||
    entry.id          ||
    null
  );
}

module.exports = {
  config: {
    name: "groupadmin",
    aliases: ["gadm", "groupmgr", "gmgr"],
    version: "7.0",
    author: "EMPEREUR ROMEOꜛꗄꔰ",
    countDown: 3,
    role: 1,
    description: "𝗚𝗲𝘀𝘁𝗶𝗼𝗻 𝗧𝗢𝗧𝗔𝗟𝗘 𝗱𝘂 𝗴𝗿𝗼𝘂𝗽𝗲 𝗮𝘃𝗲𝗰 𝗮𝘂𝘁𝗼-𝗺𝗼𝗱𝗲𝗿𝗮𝘁𝗶𝗼𝗻",
    category: "admin",
    guide: {
      en: "   {pn} help => 𝗧𝗼𝘂𝘁𝗲𝘀 𝗹𝗲𝘀 commandes\n"
        + "   {pn} auto on/off => 𝗔𝘂𝘁𝗼-𝗺𝗼𝗱𝗲𝗿𝗮𝘁𝗶𝗼𝗻\n"
        + "   {pn} approve => 𝗗𝗲𝗺𝗮𝗻𝗱𝗲𝘀 𝗲𝗻 attente\n"
        + "   {pn} kick @tag => 𝗘𝘅𝗽𝘂𝗹𝘀𝗲𝗿\n"
        + "   {pn} theme <description> => 𝗧𝗵𝗲𝗺𝗲 𝗔𝗜\n"
        + "   {pn} theme apply <ID> => 𝗔𝗽𝗽𝗹𝗶𝗾𝘂𝗲𝗿 𝗽𝗮𝗿 ID\n"
        + "   {pn} notif on/off => 𝗔𝘂𝘁𝗼-𝗻𝗼𝘁𝗶𝗳 pending"
    }
  },

  langs: {
    en: {
      noPermission:      "⚠️𝗣𝗘𝗥𝗠𝗜𝗦𝗦𝗜𝗢𝗡 𝗗𝗘𝗡𝗜𝗘𝗗",
      botNotAdmin:       "⚠️𝗕𝗢𝗧 𝗡𝗢𝗧 𝗔𝗗𝗠𝗜𝗡",
      autoEnabled:       "✅𝗔𝗨𝗧𝗢-𝗠𝗢𝗗 𝗔𝗖𝗧𝗜𝗩𝗘",
      autoDisabled:      "⏸️𝗔𝗨𝗧𝗢-𝗠𝗢𝗗 𝗗𝗘𝗦𝗔𝗖𝗧𝗜𝗩𝗘",
      spamKick:          "👢𝗦𝗣𝗔𝗠 𝗞𝗜𝗖𝗞",
      bannedWordKick:    "👢𝗠𝗢𝗧 𝗜𝗡𝗧𝗘𝗥𝗗𝗜𝗧",
      suspendedRemoved:  "🗑️𝗖𝗢𝗠𝗣𝗧𝗘 𝗦𝗨𝗣𝗣𝗥𝗜𝗠𝗘",
      cleanComplete:     "✅𝗡𝗘𝗧𝗧𝗢𝗬𝗔𝗚𝗘 𝗧𝗘𝗥𝗠𝗜𝗡𝗘",
      nameChanged:       "✅𝗡𝗢𝗠 𝗠𝗢𝗗𝗜𝗙𝗜𝗘",
      emojiChanged:      "✅𝗘𝗠𝗢𝗝𝗜 𝗠𝗢𝗗𝗜𝗙𝗜𝗘",
      themeChanged:      "✅𝗧𝗛𝗘𝗠𝗘 𝗔𝗣𝗣𝗟𝗜𝗤𝗨𝗘",
      photoChanged:      "✅𝗣𝗛𝗢𝗧𝗢 𝗠𝗢𝗗𝗜𝗙𝗜𝗘𝗘",
      noPending:         "✅𝗔𝗨𝗖𝗨𝗡𝗘 𝗗𝗘𝗠𝗔𝗡𝗗𝗘",
      approved:          "✅𝗔𝗣𝗣𝗥𝗢𝗨𝗩𝗘",
      rejected:          "❌𝗥𝗘𝗝𝗘𝗧𝗘",
      approveAllDone:    "✅𝗧𝗢𝗨𝗧 𝗔𝗣𝗣𝗥𝗢𝗨𝗩𝗘"
    }
  },

  onStart: async function ({ api, event, args, threadsData, usersData, message, getLang }) {
    const { threadID, senderID } = event;

    if (!event.isGroup) {
      return message.reply(box("ℹ️𝗜𝗡𝗙𝗢", "💧| 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝗲 𝗿𝗲𝘀𝗲𝗿𝘃𝗲𝗲 𝗮𝘂𝘅 𝗴𝗿𝗼𝘂𝗽𝗲𝘀 🪶🧘🏻‍♂️"));
    }

    const threadInfo = await api.getThreadInfo(threadID);
    const botID      = api.getCurrentUserID();

    const isBotAdmin  = threadInfo.adminIDs?.some(a => a.id === botID);
    const isUserAdmin = threadInfo.adminIDs?.some(a => a.id === senderID);

    if (!isBotAdmin) {
      return message.reply(box(getLang("botNotAdmin"),
        "💧| 𝗔𝗷𝗼𝘂𝘁𝗲𝘇-𝗺𝗼𝗶 𝗰𝗼𝗺𝗺𝗲 𝗮𝗱𝗺𝗶𝗻\n𝗽𝗼𝘂𝗿 𝗴𝗲𝗿𝗲𝗿 𝗹𝗲 𝗴𝗿𝗼𝘂𝗽𝗲 🪶🧘🏻‍♂️"));
    }

    if (!isUserAdmin) {
      return message.reply(box(getLang("noPermission"),
        "💧| 𝗦𝗲𝘂𝗹𝘀 𝗹𝗲𝘀 𝗮𝗱𝗺𝗶𝗻𝘀 𝗼𝗻𝘁\n𝗮𝗰𝗰𝗲𝘀 à 𝗰𝗲𝘁𝘁𝗲 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝗲 🪶🧘🏻‍♂️"));
    }

    const command = args[0]?.toLowerCase();

    //Help 
    if (!command || command === "help") {
      const content =
        "🤖 𝗔𝘂𝘁𝗼-𝗺𝗼𝗱𝗲𝗿𝗮𝘁𝗶𝗼𝗻:\n» {pn} auto on/off\n\n"
      + "👥 𝗠𝗲𝗺𝗯𝗿𝗲𝘀:\n» {pn} approve [n/all]\n» {pn} reject <n>\n» {pn} kick @user\n» {pn} clean\n\n"
      + "🎨 𝗔𝗽𝗽𝗮𝗿𝗲𝗻𝗰𝗲:\n» {pn} theme <description>\n» {pn} theme apply <ID>\n» {pn} theme id\n» {pn} name <nom>\n» {pn} emoji <emoji>\n» {pn} photo\n\n"
      + "🔔 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻𝘀:\n» {pn} notif on/off\n» {pn} notif status\n\n"
      + "📊 𝗜𝗻𝗳𝗼𝘀:\n» {pn} info\n» {pn} admins\n\n"
      + "💧| 𝗧𝗮𝗽𝗲𝘇 𝘂𝗻𝗲 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝗲 🪶🧘🏻‍♂️";
      return message.reply(long("🛡️𝗚𝗥𝗢𝗨𝗣 𝗠𝗔𝗡𝗔𝗚𝗘𝗥", content));
    }

    //AUTO-MOD 
    if (command === "auto") {
      const action = args[1]?.toLowerCase();
      if (action === "on") {
        autoModeration[threadID] = { enabled: true, antiSpam: true, bannedWords: true, cleanSuspended: true };
        return message.reply(box(getLang("autoEnabled"),
          "» 𝗔𝗻𝘁𝗶-𝘀𝗽𝗮𝗺 ✅\n» 𝗠𝗼𝘁𝘀 𝗶𝗻𝘁𝗲𝗿𝗱𝗶𝘁𝘀 ✅\n» 𝗖𝗼𝗺𝗽𝘁𝗲𝘀 𝘀𝘂𝘀𝗽𝗲𝗻𝗱𝘂𝘀 ✅ 🪶🧘🏻‍♂️"));
      } else if (action === "off") {
        autoModeration[threadID] = { enabled: false };
        return message.reply(box(getLang("autoDisabled"),
          "💧| 𝗔𝘂𝘁𝗼-𝗺𝗼𝗱𝗲𝗿𝗮𝘁𝗶𝗼𝗻 𝗱𝗲𝘀𝗮𝗰𝘁𝗶𝘃𝗲𝗲 🪶🧘🏻‍♂️"));
      } else {
        const status = autoModeration[threadID]?.enabled ? "✅ 𝗔𝗰𝘁𝗶𝘃𝗲" : "⏸️ 𝗜𝗻𝗮𝗰𝘁𝗶𝘃𝗲";
        return message.reply(box("🤖𝗔𝗨𝗧𝗢-𝗠𝗢𝗗",
          `𝗦𝘁𝗮𝘁𝘂𝘀: ${status}\n\n💧| {pn} auto on/off 🪶🧘🏻‍♂️`));
      }
    }

    //AUTO-NOTIF PENDING
    if (command === "notif") {
      const action = args[1]?.toLowerCase();

      if (action === "on") {
        // Éviter doublon
        if (pendingNotifIntervals[threadID]) {
          clearInterval(pendingNotifIntervals[threadID]);
        }

        pendingNotifIntervals[threadID] = setInterval(async () => {
          try {
            const info  = await api.getThreadInfo(threadID);
            const queue = info.approvalQueue || [];

            if (queue.length === 0) return;

            // Notifier seulement si nouvelle demande détectée
            const prev = lastKnownPending[threadID] || 0;
            if (queue.length !== prev) {
              lastKnownPending[threadID] = queue.length;
              const adminMentions = threadInfo.adminIDs.map(a => `@${a.id}`).join(" ");
              const content =
                `📊 ${queue.length} 𝗱𝗲𝗺𝗮𝗻𝗱𝗲(𝘀) 𝗲𝗻 𝗮𝘁𝘁𝗲𝗻𝘁𝗲\n\n`
              + `💧| {pn} approve all — 𝗧𝗼𝘂𝘁 𝗮𝗽𝗽𝗿𝗼𝘂𝘃𝗲𝗿\n`
              + `💧| {pn} approve — 𝗩𝗼𝗶𝗿 𝗹𝗮 𝗹𝗶𝘀𝘁𝗲 🪶🧘🏻‍♂️`;
              api.sendMessage(box("🔔𝗡𝗢𝗨𝗩𝗘𝗟𝗟𝗘𝗦 𝗗𝗘𝗠𝗔𝗡𝗗𝗘𝗦", content), threadID);
            }
          } catch (e) {
            console.error("Auto-notif pending error:", e);
          }
        }, PENDING_CHECK_INTERVAL);

        lastKnownPending[threadID] = 0;
        return message.reply(box("🔔𝗔𝗨𝗧𝗢-𝗡𝗢𝗧𝗜𝗙 𝗔𝗖𝗧𝗜𝗩𝗘",
          `⏱️ 𝗩𝗲𝗿𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 𝗰𝗵𝗮𝗾𝘂𝗲 ${PENDING_CHECK_INTERVAL / 60000} 𝗺𝗶𝗻𝘂𝘁𝗲𝘀\n💧| 𝗔𝗱𝗺𝗶𝗻𝘀 𝗮𝗹𝗲𝗿𝘁𝗲𝘀 𝗮𝘂𝘁𝗼𝗺𝗮𝘁𝗶𝗾𝘂𝗲𝗺𝗲𝗻𝘁 🪶🧘🏻‍♂️`));

      } else if (action === "off") {
        if (pendingNotifIntervals[threadID]) {
          clearInterval(pendingNotifIntervals[threadID]);
          delete pendingNotifIntervals[threadID];
          delete lastKnownPending[threadID];
        }
        return message.reply(box("🔕𝗔𝗨𝗧𝗢-𝗡𝗢𝗧𝗜𝗙 𝗗𝗘𝗦𝗔𝗖𝗧𝗜𝗩𝗘",
          "💧| 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻𝘀 𝗮𝗿𝗿𝗲𝘁𝗲𝗲𝘀 🪶🧘🏻‍♂️"));

      } else {
        const active = !!pendingNotifIntervals[threadID];
        return message.reply(box("🔔𝗦𝗧𝗔𝗧𝗨𝗦 𝗡𝗢𝗧𝗜𝗙",
          `𝗦𝘁𝗮𝘁𝘂𝘀: ${active ? "✅ 𝗔𝗰𝘁𝗶𝘃𝗲" : "⏸️ 𝗜𝗻𝗮𝗰𝘁𝗶𝘃𝗲"}\n\n💧| {pn} notif on/off 🪶🧘🏻‍♂️`));
      }
    }

    //Theme
    if (command === "theme" || command === "color") {
      const sub = args[1]?.toLowerCase();

      // Voir ID du thème actuel
      if (sub === "id") {
        try {
          const themeId = threadInfo?.threadTheme?.id || threadInfo?.color || "𝗜𝗻𝗰𝗼𝗻𝗻𝘂";
          return message.reply(box("🎨𝗧𝗛𝗘𝗠𝗘 𝗔𝗖𝗧𝗨𝗘𝗟",
            `📌 𝗜𝗗: ${themeId} 🪶🧘🏻‍♂️`));
        } catch (err) {
          return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
        }
      }

      // Appliquer par ID direct
      if (sub === "apply" || sub === "set") {
        const themeId = args[2];
        if (!themeId) {
          return message.reply(box("🎨𝗔𝗣𝗣𝗟𝗬 𝗧𝗛𝗘𝗠𝗘",
            "💧| 𝗨𝘀𝗮𝗴𝗲: {pn} theme apply <𝗜𝗗> 🪶🧘🏻‍♂️"));
        }
        try {
          await api.changeThreadColor(themeId, threadID);
          return message.reply(box(getLang("themeChanged"),
            `📌 𝗜𝗗: ${themeId}\n💧| 𝗔𝗽𝗽𝗹𝗶𝗾𝘂𝗲 𝗮𝘃𝗲𝗰 𝘀𝘂𝗰𝗰𝗲𝘀 🪶🧘🏻‍♂️`));
        } catch (err) {
          return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
        }
      }

      // Afficher thème actuel (aucun argument)
      if (!sub) {
        try {
          await message.reply(box("🔍𝗧𝗛𝗘𝗠𝗘 𝗔𝗖𝗧𝗨𝗘𝗟",
            "💧| 𝗥𝗲𝗰𝘂𝗽𝗲𝗿𝗮𝘁𝗶𝗼𝗻 𝗲𝗻 𝗰𝗼𝘂𝗿𝘀... 🪶🧘🏻‍♂️"));

          const theme      = threadInfo.threadTheme;
          const themeId    = theme?.id || theme?.theme_fbid || "𝗗𝗲𝗳𝗮𝘂𝗹𝘁";
          let   colorInfo  = threadInfo.color || theme?.accessibility_label || "𝗗𝗲𝗳𝗮𝘂𝗹𝘁";
          const attachments = [];

          const extractUrl = (obj) => {
            if (!obj) return null;
            if (typeof obj === "string") return obj;
            return obj.uri || obj.url || null;
          };

          if (theme) {
            try {
              const themeData = await api.fetchThemeData(themeId);
              if (themeData) {
                if (themeData.name) colorInfo = themeData.name;
                if (themeData.backgroundImage) {
                  const bgUrl = extractUrl(themeData.backgroundImage);
                  if (bgUrl) {
                    try {
                      const stream = await getStreamFromURL(bgUrl, "current_theme.png");
                      if (stream) attachments.push(stream);
                    } catch (_) {}
                  }
                }
              }
            } catch (_) {}
          }

          const body =
            `📌 𝗜𝗗: ${themeId}\n`
          + `🎨 𝗖𝗼𝘂𝗹𝗲𝘂𝗿: ${colorInfo}\n\n`
          + `💧| {pn} theme <𝗱𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻> — 𝗖𝗿𝗲𝗲𝗿 𝘁𝗵𝗲𝗺𝗲 𝗔𝗜\n`
          + `💧| {pn} theme apply <𝗜𝗗> — 𝗔𝗽𝗽𝗹𝗶𝗾𝘂𝗲𝗿 🪶🧘🏻‍♂️`;

          if (!theme) return message.reply(box("ℹ️𝗧𝗛𝗘𝗠𝗘", "💧| 𝗧𝗵𝗲𝗺𝗲 𝗽𝗮𝗿 𝗱𝗲𝗳𝗮𝘂𝘁 𝗮𝗰𝘁𝗶𝗳 🪶🧘🏻‍♂️"));

          return message.reply({
            body: box("🎨𝗧𝗛𝗘𝗠𝗘 𝗔𝗖𝗧𝗨𝗘𝗟", body),
            attachment: attachments.length > 0 ? attachments : undefined
          });
        } catch (err) {
          return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
        }
      }

      // Générer thème AI avec description
      const prompt = args.slice(1).join(" ");
      if (!prompt) {
        return message.reply(box("🎨𝗧𝗛𝗘𝗠𝗘 𝗔𝗜",
          "💧| 𝗨𝘀𝗮𝗴𝗲: {pn} theme <𝗱𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻>\n𝗘𝘅: {pn} theme ocean sunset purple 🪶🧘🏻‍♂️"));
      }

      await message.reply(box("⏳𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗜𝗢𝗡",
        "💧| 𝗖𝗿𝗲𝗮𝘁𝗶𝗼𝗻 𝗱𝘂 𝘁𝗵𝗲𝗺𝗲 𝗔𝗜...\n𝗣𝗮𝘁𝗶𝗲𝗻𝘁𝗲𝘇 🪶🧘🏻‍♂️"));

      try {
        const themes = await api.createAITheme(prompt, 5);

        if (!themes || themes.length === 0) {
          return message.reply(box("❌𝗔𝗨𝗖𝗨𝗡 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗧",
            "💧| 𝗘𝘀𝘀𝗮𝘆𝗲𝘇 𝘂𝗻𝗲 𝗮𝘂𝘁𝗿𝗲 𝗱𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻 🪶🧘🏻‍♂️"));
        }

        const extractUrl = (obj) => {
          if (!obj) return null;
          if (typeof obj === "string") return obj;
          return obj.uri || obj.url || null;
        };

        let themeList = "";
        const attachments = [];

        for (let i = 0; i < themes.length; i++) {
          const t = themes[i];
          let colorInfo = "AI Generated";
          if (t.accessibility_label)                      colorInfo = t.accessibility_label;
          else if (t.gradient_colors?.length > 0)         colorInfo = t.gradient_colors.join(" → ");
          else if (t.primary_color)                       colorInfo = t.primary_color;

          themeList += `${i + 1}. 𝗜𝗗: ${t.id}\n   🎨 ${colorInfo}\n\n`;

          // Récupérer aperçu image
          let imageUrls = [];
          if (t.preview_image_urls) {
            const light = extractUrl(t.preview_image_urls.light_mode);
            const dark  = extractUrl(t.preview_image_urls.dark_mode);
            if (light) imageUrls.push({ url: light, name: `theme_${i+1}_light.png` });
            if (dark && dark !== light) imageUrls.push({ url: dark, name: `theme_${i+1}_dark.png` });
          }
          if (!imageUrls.length && t.background_asset?.image) {
            const u = extractUrl(t.background_asset.image);
            if (u) imageUrls.push({ url: u, name: `theme_${i+1}_bg.png` });
          }
          if (!imageUrls.length && t.icon_asset?.image) {
            const u = extractUrl(t.icon_asset.image);
            if (u) imageUrls.push({ url: u, name: `theme_${i+1}_icon.png` });
          }
          if (!imageUrls.length && t.alternative_themes?.length > 0) {
            for (const alt of t.alternative_themes) {
              const u = extractUrl(alt.background_asset?.image);
              if (u) { imageUrls.push({ url: u, name: `theme_${i+1}_alt.png` }); break; }
            }
          }

          for (const img of imageUrls) {
            try {
              const stream = await getStreamFromURL(img.url, img.name);
              if (stream) attachments.push(stream);
            } catch (_) {}
          }
        }

        themeList += `💧| 𝗥𝗲𝗽𝗼𝗻𝗱𝗲𝘇 𝗮𝘃𝗲𝗰 𝟭-${themes.length} 𝗽𝗼𝘂𝗿 𝗮𝗽𝗽𝗹𝗶𝗾𝘂𝗲𝗿 🪶🧘🏻‍♂️`;
        const replyBody = long(`✨𝗧𝗛𝗘𝗠𝗘𝗦 𝗔𝗜 (${themes.length})`, themeList);

        message.reply({
          body: replyBody,
          attachment: attachments.length > 0 ? attachments : undefined
        }, (err, info) => {
          const finalInfo = err ? null : info;
          if (err) {
            message.reply(replyBody, (e2, i2) => {
              if (e2) return;
              global.GoatBot.onReply.set(i2.messageID, {
                commandName: "groupadmin",
                author: event.senderID,
                themes,
                threadID
              });
            });
            return;
          }
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "groupadmin",
            author: event.senderID,
            themes,
            threadID
          });
        });

      } catch (err) {
        return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
      }
      return;
    }
//Approve
    if (command === "approve" || command === "pending") {
      const rawQueue = threadInfo.approvalQueue || [];

      if (rawQueue.length === 0) {
        return message.reply(box(getLang("noPending"),
          "💧| 𝗔𝘂𝗰𝘂𝗻𝗲 𝗱𝗲𝗺𝗮𝗻𝗱𝗲 𝗲𝗻 𝗮𝘁𝘁𝗲𝗻𝘁𝗲 🪶🧘🏻‍♂️"));
      }

      // Approve ALL
      if (args[1]?.toLowerCase() === "all") {
        let approved = 0;
        let failed   = 0;
        for (const entry of rawQueue) {
          const uid = extractUID(entry);
          if (!uid) { failed++; continue; }
          try {
            await api.addUserToGroup(uid, threadID);
            approved++;
            await new Promise(r => setTimeout(r, 800));
          } catch (e) {
            console.error("approve all error:", uid, e.message);
            failed++;
          }
        }
        const content =
          `✅ ${approved} 𝗮𝗽𝗽𝗿𝗼𝘂𝘃𝗲(𝘀)\n`
        + (failed > 0 ? `❌ ${failed} 𝗲𝗰𝗵𝗲𝗰(𝘀)\n` : "")
        + "🪶🧘🏻‍♂️";
        return message.reply(box(getLang("approveAllDone"), content));
      }

      // Approve par numéro
      if (args[1] && !isNaN(args[1])) {
        const idx = parseInt(args[1]) - 1;
        if (idx < 0 || idx >= rawQueue.length) {
          return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥",
            `💧| 𝗡𝘂𝗺𝗲𝗿𝗼 𝗱𝗲 𝟭 à ${rawQueue.length} 🪶🧘🏻‍♂️`));
        }
        const uid = extractUID(rawQueue[idx]);
        if (!uid) {
          return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥",
            "💧| 𝗜𝗱𝗲𝗻𝘁𝗶𝗳𝗶𝗮𝗻𝘁 𝗶𝗻𝘁𝗿𝗼𝘂𝘃𝗮𝗯𝗹𝗲 🪶🧘🏻‍♂️"));
        }
        try {
          await api.addUserToGroup(uid, threadID);
          let name = "𝗨𝘁𝗶𝗹𝗶𝘀𝗮𝘁𝗲𝘂𝗿";
          try {
            const info = await api.getUserInfo(uid);
            name = info[uid]?.name || name;
          } catch (_) {}
          return message.reply(box(getLang("approved"),
            `👤 ${name}\n🆔 ${uid}\n\n💧| 𝗔 𝗲𝘁𝗲 𝗮𝗽𝗽𝗿𝗼𝘂𝘃𝗲(𝗲) ✅ 🪶🧘🏻‍♂️`));
        } catch (err) {
          return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
        }
      }

      // Lister les demandes en attente avec résolution des noms
      let list = `📊 𝗧𝗼𝘁𝗮𝗹: ${rawQueue.length} 𝗱𝗲𝗺𝗮𝗻𝗱𝗲(𝘀)\n\n`;

      for (let i = 0; i < rawQueue.length; i++) {
        const uid = extractUID(rawQueue[i]);
        let name  = "𝗜𝗻𝗰𝗼𝗻𝗻𝘂";
        if (uid) {
          try {
            const info = await api.getUserInfo(uid);
            name = info[uid]?.name || name;
          } catch (_) {}
        }
        list += `${i + 1}. 👤 ${name}\n   🆔 ${uid || "𝗡/𝗔"}\n\n`;
      }

      list +=
        "💧| {pn} approve <n> — 𝗔𝗽𝗽𝗿𝗼𝘂𝘃𝗲𝗿 𝘂𝗻\n"
      + "💧| {pn} approve all — 𝗧𝗼𝘂𝘁 𝗮𝗽𝗽𝗿𝗼𝘂𝘃𝗲𝗿\n"
      + "💧| {pn} reject <n> — 𝗥𝗲𝗷𝗲𝘁𝗲𝗿 🪶🧘🏻‍♂️";

      return message.reply(long("📋𝗗𝗘𝗠𝗔𝗡𝗗𝗘𝗦 𝗘𝗡 𝗔𝗧𝗧𝗘𝗡𝗧𝗘", list));
    }

    //REJECT 
    if (command === "reject") {
      const rawQueue = threadInfo.approvalQueue || [];

      if (!args[1] || isNaN(args[1])) {
        return message.reply(box("❌𝗥𝗘𝗝𝗘𝗖𝗧",
          "💧| 𝗨𝘀𝗮𝗴𝗲: {pn} reject <𝗻𝘂𝗺𝗲𝗿𝗼> 🪶🧘🏻‍♂️"));
      }

      const idx = parseInt(args[1]) - 1;
      if (idx < 0 || idx >= rawQueue.length) {
        return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥",
          `💧| 𝗡𝘂𝗺𝗲𝗿𝗼 𝗱𝗲 𝟭 à ${rawQueue.length} 🪶🧘🏻‍♂️`));
      }

      const uid = extractUID(rawQueue[idx]);
      if (!uid) {
        return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥",
          "💧| 𝗜𝗱𝗲𝗻𝘁𝗶𝗳𝗶𝗮𝗻𝘁 𝗶𝗻𝘁𝗿𝗼𝘂𝘃𝗮𝗯𝗹𝗲 🪶🧘🏻‍♂️"));
      }

      try {
        await api.removeUserFromGroup(uid, threadID);
        let name = "𝗨𝘁𝗶𝗹𝗶𝘀𝗮𝘁𝗲𝘂𝗿";
        try {
          const info = await api.getUserInfo(uid);
          name = info[uid]?.name || name;
        } catch (_) {}
        return message.reply(box(getLang("rejected"),
          `👤 ${name}\n🆔 ${uid}\n\n💧| 𝗗𝗲𝗺𝗮𝗻𝗱𝗲 𝗿𝗲𝗷𝗲𝘁𝗲𝗲 ❌ 🪶🧘🏻‍♂️`));
      } catch (err) {
        return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
      }
    }

    //Kick le con qui derange
    if (command === "kick" || command === "remove") {
      const mentions = Object.keys(event.mentions);
      if (mentions.length === 0) {
        return message.reply(box("👢𝗞𝗜𝗖𝗞",
          "💧| 𝗧𝗮𝗴𝘂𝗲𝘇 𝗹𝗮 𝗽𝗲𝗿𝘀𝗼𝗻𝗻𝗲 à 𝗲𝘅𝗽𝘂𝗹𝘀𝗲𝗿 🪶🧘🏻‍♂️"));
      }
      for (const uid of mentions) {
        try {
          await api.removeUserFromGroup(uid, threadID);
          let name = uid;
          try {
            const info = await api.getUserInfo(uid);
            name = info[uid]?.name || uid;
          } catch (_) {}
          await message.reply(box("👢𝗘𝗫𝗣𝗨𝗟𝗦𝗜𝗢𝗡",
            `👤 ${name}\n💧| 𝗮 𝗲𝘁𝗲 𝗲𝘅𝗽𝘂𝗹𝘀𝗲(𝗲) 🪶🧘🏻‍♂️`));
        } catch (err) {
          await message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
        }
      }
    }

    //Clean
    if (command === "clean") {
      const members = threadInfo.participantIDs;
      let removed   = 0;
      for (const uid of members) {
        try {
          const info = await api.getUserInfo(uid);
          const name = info[uid]?.name || "";
          if (name === "Facebook User" || name === "" || name.includes("Utilisateur Facebook")) {
            await api.removeUserFromGroup(uid, threadID);
            removed++;
            await new Promise(r => setTimeout(r, 800));
          }
        } catch (_) {}
      }
      return message.reply(box(getLang("cleanComplete"),
        `🗑️ ${removed} 𝗰𝗼𝗺𝗽𝘁𝗲(𝘀) 𝘀𝘂𝘀𝗽𝗲𝗻𝗱𝘂𝘀\n𝗿𝗲𝘁𝗶𝗿𝗲(𝘀) 𝗮𝘃𝗲𝗰 𝘀𝘂𝗰𝗰𝗲𝘀 🪶🧘🏻‍♂️`));
    }

    //Le nom
    if (command === "name" || command === "rename") {
      const newName = args.slice(1).join(" ");
      if (!newName) {
        return message.reply(box("📝𝗖𝗛𝗔𝗡𝗚𝗘 𝗡𝗢𝗠",
          "💧| 𝗨𝘀𝗮𝗴𝗲: {pn} name <𝗻𝗼𝗺> 🪶🧘🏻‍♂️"));
      }
      try {
        await api.setTitle(newName, threadID);
        return message.reply(box(getLang("nameChanged"), `📝 ${newName} 🪶🧘🏻‍♂️`));
      } catch (err) {
        return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
      }
    }

    //Emoji
    if (command === "emoji") {
      const em = args[1];
      if (!em) {
        return message.reply(box("😀𝗖𝗛𝗔𝗡𝗚𝗘 𝗘𝗠𝗢𝗝𝗜",
          "💧| 𝗨𝘀𝗮𝗴𝗲: {pn} emoji <𝗲𝗺𝗼𝗷𝗶> 🪶🧘🏻‍♂️"));
      }
      try {
        await api.changeThreadEmoji(em, threadID);
        return message.reply(box(getLang("emojiChanged"), `${em} 𝗡𝗼𝘂𝘃𝗲𝗹 𝗲𝗺𝗼𝗷𝗶 🪶🧘🏻‍♂️`));
      } catch (err) {
        return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
      }
    }

    //Photo
    if (command === "photo" || command === "avatar") {
      const img = event.messageReply?.attachments?.[0] || event.attachments?.[0];
      if (!img || img.type !== "photo") {
        return message.reply(box("🖼️𝗖𝗛𝗔𝗡𝗚𝗘 𝗣𝗛𝗢𝗧𝗢",
          "💧| 𝗥𝗲𝗽𝗼𝗻𝗱𝘀 à 𝘂𝗻𝗲 𝗶𝗺𝗮𝗴𝗲\n𝗼𝘂 𝗲𝗻𝘃𝗼𝗶𝗲-𝗲𝗻 𝘂𝗻𝗲 🪶🧘🏻‍♂️"));
      }
      try {
        const stream = await global.utils.getStreamFromURL(img.url);
        await api.changeGroupImage(stream, threadID);
        return message.reply(box(getLang("photoChanged"), "🖼️ 𝗣𝗵𝗼𝘁𝗼 𝗺𝗶𝘀𝗲 à 𝗷𝗼𝘂𝗿 🪶🧘🏻‍♂️"));
      } catch (err) {
        return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
      }
    }

    //Info
    if (command === "info" || command === "stats") {
      const content =
        `📝 𝗡𝗼𝗺: ${threadInfo.threadName}\n`
      + `👥 𝗠𝗲𝗺𝗯𝗿𝗲𝘀: ${threadInfo.participantIDs.length}\n`
      + `👑 𝗔𝗱𝗺𝗶𝗻𝘀: ${threadInfo.adminIDs.length}\n`
      + `${threadInfo.emoji || "👍"} 𝗘𝗺𝗼𝗷𝗶\n`
      + `🆔 ${threadID}\n`
      + `🔔 𝗡𝗼𝘁𝗶𝗳: ${pendingNotifIntervals[threadID] ? "✅ 𝗔𝗰𝘁𝗶𝘃𝗲" : "⏸️ 𝗜𝗻𝗮𝗰𝘁𝗶𝘃𝗲"} 🪶🧘🏻‍♂️`;
      return message.reply(box("ℹ️𝗜𝗡𝗙𝗢𝗦 𝗚𝗥𝗢𝗨𝗣𝗘", content));
    }

    //Admins
    if (command === "admins") {
      let list = "";
      for (const admin of threadInfo.adminIDs) {
        let name = admin.id;
        try {
          const info = await api.getUserInfo(admin.id);
          name = info[admin.id]?.name || admin.id;
        } catch (_) {}
        list += `👑 ${name}\n   🆔 ${admin.id}\n\n`;
      }
      list += "💧| 𝗟𝗶𝘀𝘁𝗲 𝗰𝗼𝗺𝗽𝗹𝗲𝘁𝗲 🪶🧘🏻‍♂️";
      return message.reply(long("👑𝗔𝗗𝗠𝗜𝗡𝗜𝗦𝗧𝗥𝗔𝗧𝗘𝗨𝗥𝗦", list));
    }
  },

// onReply — Sélection thème AI
  onReply: async function ({ api, event, message, Reply, getLang }) {
    const { author, themes, threadID: replyThreadID } = Reply;

    if (event.senderID !== author) {
      return message.reply(box("⚠️𝗔𝗖𝗖𝗘𝗦 𝗥𝗘𝗙𝗨𝗦𝗘",
        "💧| 𝗦𝗲𝘂𝗹 𝗹'𝗮𝘂𝘁𝗲𝘂𝗿 𝗽𝗲𝘂𝘁 𝗰𝗵𝗼𝗶𝘀𝗶𝗿 🪶🧘🏻‍♂️"));
    }

    const selection = parseInt(event.body.trim());

    if (isNaN(selection) || selection < 1 || selection > themes.length) {
      return message.reply(box("❌𝗦𝗘𝗟𝗘𝗖𝗧𝗜𝗢𝗡",
        `💧| 𝗘𝗻𝘁𝗿𝗲𝘇 𝘂𝗻 𝗻𝘂𝗺𝗲𝗿𝗼 𝗱𝗲 𝟭 à ${themes.length} 🪶🧘🏻‍♂️`));
    }

    const chosen = themes[selection - 1];

    try {
      // Sauvegarder thème actuel
      const threadInfo     = await api.getThreadInfo(event.threadID);
      const currentTheme   = threadInfo.threadTheme;
      const prevId         = currentTheme?.id || currentTheme?.theme_fbid || "𝗗𝗲𝗳𝗮𝘂𝗹𝘁";
      const prevColor      = threadInfo.color || currentTheme?.accessibility_label || "𝗗𝗲𝗳𝗮𝘂𝗹𝘁";

      await message.reply(box("⏳𝗔𝗣𝗣𝗟𝗜𝗖𝗔𝗧𝗜𝗢𝗡",
        "💧| 𝗔𝗽𝗽𝗹𝗶𝗰𝗮𝘁𝗶𝗼𝗻 𝗱𝘂 𝘁𝗵𝗲𝗺𝗲... 🪶🧘🏻‍♂️"));

      await api.changeThreadColor(chosen.id, event.threadID);

      const content =
        `✅ 𝗧𝗵𝗲𝗺𝗲 𝗮𝗽𝗽𝗹𝗶𝗾𝘂𝗲 !\n`
      + `📌 𝗜𝗗: ${chosen.id}\n\n`
      + `📋 𝗣𝗿𝗲𝗰𝗲𝗱𝗲𝗻𝘁:\n`
      + `   𝗜𝗗: ${prevId}\n`
      + `   🎨 ${prevColor} 🪶🧘🏻‍♂️`;

      await message.reply(box(getLang("themeChanged"), content));
      api.unsendMessage(Reply.messageID);

    } catch (err) {
      return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
    }
  },

  // onChat — Auto-modération
  onChat: async function ({ api, event, usersData, message, getLang }) {
    const { threadID, senderID, body } = event;

    if (!event.isGroup || !body) return;

    const autoMod = autoModeration[threadID];
    if (!autoMod?.enabled) return;

    const threadInfo  = await api.getThreadInfo(threadID);
    const botID       = api.getCurrentUserID();
    const isBotAdmin  = threadInfo.adminIDs?.some(a => a.id === botID);
    const isUserAdmin = threadInfo.adminIDs?.some(a => a.id === senderID);

    if (!isBotAdmin || isUserAdmin) return;

    // Anti-spam
    if (autoMod.antiSpam) {
      if (!userMessages[senderID]) userMessages[senderID] = [];
      const now = Date.now();
      userMessages[senderID].push(now);
      userMessages[senderID] = userMessages[senderID].filter(t => now - t < SPAM_CONFIG.timeWindow);

      if (userMessages[senderID].length > SPAM_CONFIG.messageLimit) {
        let name = senderID;
        try { const i = await api.getUserInfo(senderID); name = i[senderID]?.name || senderID; } catch (_) {}
        try {
          await api.removeUserFromGroup(senderID, threadID);
          return message.reply(box(getLang("spamKick"),
            `👤 ${name}\n💧| 𝗦𝗽𝗮𝗺 𝗱𝗲𝘁𝗲𝗰𝘁𝗲 — 𝗲𝘅𝗽𝘂𝗹𝘀𝗶𝗼𝗻 𝗮𝘂𝘁𝗼 🪶🧘🏻‍♂️`));
        } catch (_) {}
      }
    }

    // Mots interdits
    if (autoMod.bannedWords) {
      const lower = body.toLowerCase();
      if (BANNED_WORDS.some(w => lower.includes(w))) {
        let name = senderID;
        try { const i = await api.getUserInfo(senderID); name = i[senderID]?.name || senderID; } catch (_) {}
        try {
          await api.unsendMessage(event.messageID);
          await api.removeUserFromGroup(senderID, threadID);
          return message.reply(box(getLang("bannedWordKick"),
            `👤 ${name}\n💧| 𝗠𝗼𝘁 𝗶𝗻𝘁𝗲𝗿𝗱𝗶𝘁 — 𝗲𝘅𝗽𝘂𝗹𝘀𝗶𝗼𝗻 𝗮𝘂𝘁𝗼 🪶🧘🏻‍♂️`));
        } catch (_) {}
      }
    }
  },

  // onEvent — Auto-clean + auto-notif pending

  onEvent: async function ({ api, event, message, getLang }) {
    const { threadID, logMessageType, logMessageData } = event;

    // Auto-clean comptes suspendus à l'entrée
    if (logMessageType === "log:subscribe" && autoModeration[threadID]?.cleanSuspended) {
      const threadInfo = await api.getThreadInfo(threadID);
      const botID      = api.getCurrentUserID();
      const isBotAdmin = threadInfo.adminIDs?.some(a => a.id === botID);
      if (!isBotAdmin) return;

      for (const p of (logMessageData?.addedParticipants || [])) {
        const uid = p.userFbId;
        try {
          const info = await api.getUserInfo(uid);
          const name = info[uid]?.name || "";
          if (name === "Facebook User" || name === "" || name.includes("Utilisateur Facebook")) {
            await api.removeUserFromGroup(uid, threadID);
            await message.reply(box(getLang("suspendedRemoved"),
              "👤 Facebook User\n💧| 𝗥𝗲𝗷𝗲𝘁𝗲 𝗮𝘂𝘁𝗼𝗺𝗮𝘁𝗶𝗾𝘂𝗲𝗺𝗲𝗻𝘁 🪶🧘🏻‍♂️"));
          }
        } catch (_) {}
      }
    }

    // Auto-notif : nouvelle demande d'adhésion
    if (logMessageType === "log:approval-queue-add") {
      if (!pendingNotifIntervals[threadID]) return; // notif désactivée
      try {
        const info  = await api.getThreadInfo(threadID);
        const queue = info.approvalQueue || [];
        const uid   = logMessageData?.userFbId || logMessageData?.userID || "?";
        let name    = "𝗡𝗼𝘂𝘃𝗲𝗹 𝗮𝗱𝗵𝗲𝗿𝗲𝗻𝘁";
        try {
          const uinfo = await api.getUserInfo(uid);
          name = uinfo[uid]?.name || name;
        } catch (_) {}

        lastKnownPending[threadID] = queue.length;

        const content =
          `👤 ${name}\n`
        + `🆔 ${uid}\n`
        + `📊 𝗧𝗼𝘁𝗮𝗹 𝗲𝗻 𝗮𝘁𝘁𝗲𝗻𝘁𝗲: ${queue.length}\n\n`
        + `💧| {pn} approve — 𝗩𝗼𝗶𝗿 𝗹𝗮 𝗹𝗶𝘀𝘁𝗲\n`
        + `💧| {pn} approve all — 𝗧𝗼𝘂𝘁 𝗮𝗽𝗽𝗿𝗼𝘂𝘃𝗲𝗿 🪶🧘🏻‍♂️`;

        api.sendMessage(box("🔔𝗡𝗢𝗨𝗩𝗘𝗟𝗟𝗘 𝗗𝗘𝗠𝗔𝗡𝗗𝗘", content), threadID);
      } catch (_) {}
    }
  }
};Enter        } catch (_) {}
        return message.reply(box(getLang("rejected"),
          `👤 ${name}\n🆔 ${uid}\n\n💧| 𝗗𝗲𝗺𝗮𝗻𝗱𝗲 𝗿𝗲𝗷𝗲𝘁𝗲𝗲 ❌ 🪶🧘🏻‍♂️`));
      } catch (err) {
        return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
      }
    }

    //Kick le con qui derange
    if (command === "kick" || command === "remove") {
      const mentions = Object.keys(event.mentions);
      if (mentions.length === 0) {
        return message.reply(box("👢𝗞𝗜𝗖𝗞",
          "💧| 𝗧𝗮𝗴𝘂𝗲𝘇 𝗹𝗮 𝗽𝗲𝗿𝘀𝗼𝗻𝗻𝗲 à 𝗲𝘅𝗽𝘂𝗹𝘀𝗲𝗿 🪶🧘🏻‍♂️"));
      }
      for (const uid of mentions) {
        try {
          await api.removeUserFromGroup(uid, threadID);
          let name = uid;
          try {
            const info = await api.getUserInfo(uid);
            name = info[uid]?.name || uid;
          } catch (_) {}
          await message.reply(box("👢𝗘𝗫𝗣𝗨𝗟𝗦𝗜𝗢𝗡",
            `👤 ${name}\n💧| 𝗮 𝗲𝘁𝗲 𝗲𝘅𝗽𝘂𝗹𝘀𝗲(𝗲) 🪶🧘🏻‍♂️`));
        } catch (err) {
          await message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
        }
      }
    }

    //Clean
    if (command === "clean") {
      const members = threadInfo.participantIDs;
      let removed   = 0;
      for (const uid of members) {
        try {
          const info = await api.getUserInfo(uid);
          const name = info[uid]?.name || "";
          if (name === "Facebook User" || name === "" || name.includes("Utilisateur Facebook")) {
            await api.removeUserFromGroup(uid, threadID);
            removed++;
            await new Promise(r => setTimeout(r, 800));
          }
        } catch (_) {}
      }
      return message.reply(box(getLang("cleanComplete"),
        `🗑️ ${removed} 𝗰𝗼𝗺𝗽𝘁𝗲(𝘀) 𝘀𝘂𝘀𝗽𝗲𝗻𝗱𝘂𝘀\n𝗿𝗲𝘁𝗶𝗿𝗲(𝘀) 𝗮𝘃𝗲𝗰 𝘀𝘂𝗰𝗰𝗲𝘀 🪶🧘🏻‍♂️`));
    }

    //Le nom
    if (command === "name" || command === "rename") {
      const newName = args.slice(1).join(" ");
      if (!newName) {
        return message.reply(box("📝𝗖𝗛𝗔𝗡𝗚𝗘 𝗡𝗢𝗠",
          "💧| 𝗨𝘀𝗮𝗴𝗲: {pn} name <𝗻𝗼𝗺> 🪶🧘🏻‍♂️"));
      }
      try {
        await api.setTitle(newName, threadID);
        return message.reply(box(getLang("nameChanged"), `📝 ${newName} 🪶🧘🏻‍♂️`));
      } catch (err) {
        return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
      }
    }

    //Emoji
    if (command === "emoji") {
      const em = args[1];
      if (!em) {
        return message.reply(box("😀𝗖𝗛𝗔𝗡𝗚𝗘 𝗘𝗠𝗢𝗝𝗜",
          "💧| 𝗨𝘀𝗮𝗴𝗲: {pn} emoji <𝗲𝗺𝗼𝗷𝗶> 🪶🧘🏻‍♂️"));
      }
      try {
        await api.changeThreadEmoji(em, threadID);
        return message.reply(box(getLang("emojiChanged"), `${em} 𝗡𝗼𝘂𝘃𝗲𝗹 𝗲𝗺𝗼𝗷𝗶 🪶🧘🏻‍♂️`));
      } catch (err) {
        return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
      }
    }

    //Photo
    if (command === "photo" || command === "avatar") {
      const img = event.messageReply?.attachments?.[0] || event.attachments?.[0];
      if (!img || img.type !== "photo") {
        return message.reply(box("🖼️𝗖𝗛𝗔𝗡𝗚𝗘 𝗣𝗛𝗢𝗧𝗢",
          "💧| 𝗥𝗲𝗽𝗼𝗻𝗱𝘀 à 𝘂𝗻𝗲 𝗶𝗺𝗮𝗴𝗲\n𝗼𝘂 𝗲𝗻𝘃𝗼𝗶𝗲-𝗲𝗻 𝘂𝗻𝗲 🪶🧘🏻‍♂️"));
      }
      try {
        const stream = await global.utils.getStreamFromURL(img.url);
        await api.changeGroupImage(stream, threadID);
        return message.reply(box(getLang("photoChanged"), "🖼️ 𝗣𝗵𝗼𝘁𝗼 𝗺𝗶𝘀𝗲 à 𝗷𝗼𝘂𝗿 🪶🧘🏻‍♂️"));
      } catch (err) {
        return message.reply(box("❌𝗘𝗥𝗥𝗘𝗨𝗥", `💧| ${err.message} 🪶🧘🏻‍♂️`));
      }
    }

    //Info
    if (command === "info" || command === "stats") {
      const content =
        `📝 𝗡𝗼𝗺: ${threadInfo.threadName}\n`
      + `👥 𝗠𝗲𝗺𝗯𝗿𝗲𝘀: ${threadInfo.participantIDs.length}\n`
      + `👑 𝗔𝗱𝗺𝗶𝗻𝘀: ${threadInfo.adminIDs.length}\n`
      + `${threadInfo.emoji || "👍"} 𝗘𝗺𝗼𝗷𝗶\n`
      + `🆔 ${threadID}\n`
      + `🔔 𝗡𝗼𝘁𝗶𝗳: ${pendingNotifIntervals[threadID] ? "✅ 𝗔𝗰𝘁𝗶𝘃𝗲" : "⏸️ 𝗜𝗻𝗮𝗰𝘁𝗶𝘃𝗲"} 🪶🧘🏻‍♂️`;
      return message.reply(box("ℹ️𝗜𝗡𝗙𝗢𝗦 𝗚𝗥𝗢𝗨𝗣𝗘", content));
    }

    //Admins
    if (command === "admins") {
      let list = "";
      for (const admin of threadInfo.adminIDs) {
        let name = admin.id;
        try {
          const info = await api.getUserInfo(admin.id);
          name = info[admin.id]?.name || admin.id;
        } catch (_) {}
        list += `👑 ${name}\n   🆔 ${admin.id}\n\n`;
      }
      list += "💧| 𝗟𝗶𝘀𝘁𝗲 𝗰𝗼𝗺𝗽𝗹𝗲𝘁𝗲 🪶🧘🏻‍♂️";
      return message.reply(long("👑𝗔𝗗𝗠𝗜𝗡𝗜𝗦𝗧𝗥𝗔𝗧𝗘𝗨𝗥𝗦", list));
    }
  },

// onReply — Sélection thème AI
  onReply: async function ({ api, event, message, Reply, getLang }) {
    const { author, themes, threadID: replyThreadID } = Reply;

    if (event.senderID !== author) {
      return message.reply(box("⚠️𝗔𝗖𝗖𝗘𝗦 𝗥𝗘𝗙𝗨𝗦𝗘",
        "💧| 𝗦𝗲𝘂𝗹 𝗹'𝗮𝘂𝘁𝗲𝘂𝗿 𝗽𝗲𝘂𝘁 𝗰𝗵𝗼𝗶𝘀𝗶𝗿 🪶🧘🏻‍♂️"));
    }

    const selection = parseInt(event.body.trim());

    if (isNaN(selection) || selection < 1 || selection > themes.length) {
      return message.reply(box("❌𝗦𝗘𝗟𝗘𝗖𝗧𝗜𝗢𝗡",
        `💧| 𝗘𝗻𝘁𝗿𝗲𝘇 𝘂𝗻 𝗻𝘂𝗺𝗲𝗿𝗼 𝗱𝗲 𝟭 à ${themes.length} 🪶🧘🏻‍♂️`));
    }

    const chosen = themes[selection - 1];

    try {
      // Sauvegarder thème actuel
      const threadInfo     = await api.getThreadInfo(event.threadID);
      const currentTheme   = threadInfo.threadTheme;
      const prevId         = currentTheme?.id || currentTheme?.theme_fbid || "𝗗𝗲𝗳𝗮𝘂𝗹𝘁";
      const prevColor      = threadInfo.color || currentTheme?.accessibility_label || "𝗗𝗲𝗳𝗮𝘂𝗹𝘁";
