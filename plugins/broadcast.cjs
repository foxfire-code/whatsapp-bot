module.exports = {
  command: ["broadcast"],
  execute: async ({ sock, from, args, owner, store }) => {
    if (!owner) return sock.sendMessage(from, { text: "❌ Owner only" });

    const text = args.join(" ");
    if (!text) return sock.sendMessage(from, { text: "Example:\n.broadcast Hello everyone" });

    const chats = store?.chats?.all ? store.chats.all() : [];
    if (chats.length === 0) return sock.sendMessage(from, { text: "❌ No chats in store yet. Send a message to bot first." });

    let sent = 0, failed = 0;

    for (const chat of chats) {
      const jid = chat.id;
      if (!jid) continue;
      try {
        await sock.sendMessage(jid, { text: "📢 *BROADCAST*\n\n" + text });
        sent++;
        await new Promise(r => setTimeout(r, 500));
      } catch { failed++; }
    }

    sock.sendMessage(from, { text: `✅ Done\n📤 Sent: ${sent}\n❌ Failed: ${failed}` });
  }
};
