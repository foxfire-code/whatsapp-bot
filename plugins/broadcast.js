export default {
  command: ["broadcast", "bc"],

  async execute({ sock, from, args, owner, store }) {
    if (!owner) {
      return sock.sendMessage(from, {
        text: "❌ Owner only"
      });
    }

    const text = args.join(" ");
    if (!text) {
      return sock.sendMessage(from, {
        text: "❌ No message provided\n\nUsage:\n.broadcast Hello everyone"
      });
    }

    // Get all chats from store
    const chats = Object.values(store.chats || {});

    if (chats.length === 0) {
      return sock.sendMessage(from, {
        text: "❌ No chats in store yet\n\n💡 Send or receive a message from bot first"
      });
    }

    let sent = 0;
    let failed = 0;
    const broadcastText = `📢 *BROADCAST*\n\n${text}`;

    for (const chat of chats) {
      const jid = chat.id;
      if (!jid || jid === "status@broadcast") continue;

      try {
        await sock.sendMessage(jid, { text: broadcastText });
        sent++;
        // Rate limit to avoid being blocked
        await new Promise(r => setTimeout(r, 500));
      } catch (e) {
        failed++;
        console.log(`⚠️ Broadcast failed for ${jid}: ${e.message}`);
      }
    }

    return sock.sendMessage(from, {
      text: `✅ Broadcast Complete\n\n📤 Sent: ${sent}\n❌ Failed: ${failed}`
    });
  }
};
