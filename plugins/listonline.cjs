module.exports = {
  name: "listonline",
  command: ["listonline"],

  async run({ sock, m }) {
    const jid = m.key.remoteJid;

    if (!jid.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ Group only command."
      });
    }

    const metadata = await sock.groupMetadata(jid);

    let text = "🟢 Group Members\n\n";
    let mentions = [];

    metadata.participants.forEach((p, i) => {
      mentions.push(p.id);
      text += `${i + 1}. @${p.id.split("@")[0]}\n`;
    });

    await sock.sendMessage(jid, {
      text,
      mentions
    });
  }
};
