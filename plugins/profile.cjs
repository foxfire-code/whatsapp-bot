module.exports = {
  name: 'profile',
  command: ['profile'],

  async run({ sock, m }) {
    const jid =
      m.key.participant ||
      m.key.remoteJid;

    const text = `
👤 BLACK BLADE PROFILE

📱 Number:
${jid.split('@')[0]}

🤖 Bot:
BLACK BLADE
`;

    await sock.sendMessage(
      m.key.remoteJid,
      {
        text
      },
      {
        quoted: m
      }
    );
  }
};
