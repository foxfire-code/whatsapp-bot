module.exports = {
  name: "menu",
  command: ["menu"],

  async run({ sock, m }) {
    const text = `
╭━━━〔 BLACK BLADE 〕━━━⬣
┃ .menu
┃ .ai
┃ .play
┃ .yt
┃ .tiktok
┃ .status
┃ .antidelete
┃ .antivv
┃ .antiviewonce
┃ .tagall
┃ .broadcast
┃ .listonline
┃ .quiz
┃ .profile
╰━━━━━━━━━━━━━━⬣
`;

    await sock.sendMessage(
      m.key.remoteJid,
      { text },
      { quoted: m }
    );
  }
};
