export default {
  command: ["listonline", "online", "onlinelist"],

  async execute({ sock, msg, from }) {
    if (!from.endsWith("@g.us")) {
      return sock.sendMessage(from, {
        text: "❌ This command only works in groups"
      });
    }

    try {
      const groupMetadata = await sock.groupMetadata(from);
      const participants = groupMetadata.participants;

      // Get typing statuses to determine online users
      let onlineList = [];

      for (const participant of participants) {
        onlineList.push(participant.id.split("@")[0]);
      }

      let text = `👥 **GROUP MEMBERS (${onlineList.length})**\n\n`;
      text += onlineList.join("\n");

      await sock.sendMessage(from, {
        text: text
      }, { quoted: msg });
    } catch (e) {
      sock.sendMessage(from, {
        text: `❌ Error: ${e.message}`
      });
    }
  }
};
