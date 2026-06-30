export default {
  command: ["menu", "help"],

  async run({ sock, msg }) {
    const text = `╭━━━〔 BLACK BLADE 〕━━━⬣
┃ 📌 **COMMANDS**
┃
┃ 🎮 **Entertainment**
┃ .ai <text> - AI Chat
┃ .play <song> - Play song
┃ .yt <url> - YouTube download
┃ .tiktok <url> - TikTok download
┃ .quiz - Random quiz
┃
┃ 🛡️ **Protection**
┃ .antidelete on/off - Recover deleted messages
┃ .antiviewonce on/off - Recover view-once media
┃ .antivv on/off - Hide online status
┃
┃ 👥 **Group**
┃ .tagall - Tag all members
┃ .listonline - List online members
┃
┃ 📢 **Admin**
┃ .broadcast <text> - Send to all chats
┃ .statusreact on/off - Auto-react to status
┃
┃ 👤 **Info**
┃ .profile - User profile
┃ .status - Check status
┃
┃ .menu - Show this menu
╰━━━━━━━━━━━━━━⬣`;

    await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
  }
};
