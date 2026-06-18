module.exports = {
    config: {
        name: "noti",
        version: "2.0",
        author: "Octavio Wina",
        role: 2, // 2 = Admin bot seulement
        category: "group",
        shortDescription: "Notification officielle du supérieur",
        guide: {
            fr: "{pn} <message>"
        }
    },

    onStart: async ({ message, args, event, usersData }) => {
        if (!args.length) {
            return message.reply("❌ Écris le message de notification.");
        }

        const content = args.join(" ");
        const userName = await usersData.getName(event.senderID);

        const notiMsg =
`╭─「 🔔 NOTIFICATION OFFICIELLE 」─╮
│
│ ${content}
│
╰────────────────────────────╯

Message de mon supérieur @${userName}
Utilisée ✓callad pour me contacté`;
        return message.reply({
            body: notiMsg,
            mentions: [{
                id: event.senderID,
                tag: `@${userName}`
            }]
        });
    }
};
