module.exports = {
  name: "tagall",
  command: ["tagall"],

  async run({ sock, m }) {
    const jid = m.key.remoteJid;

    if (!jid.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ Group only command."
      });
    }

    const metadata = await sock.groupMetadata(jid);

    let text = "📢 TAG ALL\n\n";
    let mentions = [];

    for (const p of metadata.participants) {
      mentions.push(p.id);
      text += `@${p.id.split("@")[0]}\n`;
    }

    await sock.sendMessage(jid, {
      text,
      mentions
    });
  }
};
