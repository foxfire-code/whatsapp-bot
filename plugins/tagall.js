export default {
  command: ["tagall", "mentionall", "tag"],

  async execute({ sock, msg, from, owner }) {
    if (!owner) {
      return sock.sendMessage(from, {
        text: "❌ Owner only"
      });
    }

    // Only works in groups
    if (!from.endsWith("@g.us")) {
      return sock.sendMessage(from, {
        text: "❌ This command only works in groups"
      });
    }

    try {
      const groupMetadata = await sock.groupMetadata(from);
      const participants = groupMetadata.participants;

      let mentions = "";
      let mentionList = [];

      for (const participant of participants) {
        mentionList.push(participant.id);
        mentions += `@${participant.id.split("@")[0]} `;
      }

      const text = `👥 **GROUP MEMBERS**\n\n${mentions}`;

      await sock.sendMessage(from, {
        text: text,
        mentions: mentionList
      }, { quoted: msg });
    } catch (e) {
      sock.sendMessage(from, {
        text: `❌ Error: ${e.message}`
      });
    }
  }
};
