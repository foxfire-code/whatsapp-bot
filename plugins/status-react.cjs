let enabled = true;
let delay = 3000;
let emoji = "👍";

module.exports = {
  command: ["statusreact", "sreact"],
  execute: async ({ sock, from, args, owner }) => {
    if (!owner) {
      return sock.sendMessage(from, { text: "❌ Owner only" });
    }

    const action = args[0]?.toLowerCase();
    const value = args[1];

    if (!action) {
      return sock.sendMessage(from, {
        text: `📊 *Status React:*\nStatus: ${enabled ? "✅ ON" : "❌ OFF"}\nDelay: ${delay}ms\nEmoji: ${emoji}\n\nUsage:\n.statusreact on/off\n.statusreact delay 5000\n.statusreact emoji 🔥`
      });
    }

    if (action === "on") { enabled = true; return sock.sendMessage(from, { text: "✅ Status react enabled" }); }
    if (action === "off") { enabled = false; return sock.sendMessage(from, { text: "❌ Status react disabled" }); }
    if (action === "delay" && value) { delay = parseInt(value); return sock.sendMessage(from, { text: `⏱️ Delay: ${delay}ms` }); }
    if (action === "emoji" && value) { emoji = value; return sock.sendMessage(from, { text: `😀 Emoji: ${emoji}` }); }
  },

  onStatus: async (sock, msg) => {
    if (!enabled) return;
    setTimeout(async () => {
      try {
        await sock.sendMessage("status@broadcast", {
          react: { text: emoji, key: msg.key }
        });
      } catch (e) {}
    }, delay);
  }
};
