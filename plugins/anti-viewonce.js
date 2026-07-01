import { loadJSON, saveJSON, normalizeJid } from "../lib/helpers.js";

const DATA_FILE = "./data/anti-viewonce.json";

function loadSettings() {
  return loadJSON(DATA_FILE, { enabled: {}, recovered: [] });
}

function saveSettings(data) {
  saveJSON(DATA_FILE, data);
}

export default {
  command: ["antiviewonce", "antivv"],

  async execute({ sock, from, args, settings }) {
    const action = args[0]?.toLowerCase();
    const data = loadSettings();

    if (!action) {
      const status = data.enabled[from] ? "✅ ON" : "❌ OFF";
      return sock.sendMessage(from, {
        text: `📸 Anti-ViewOnce: ${status}\n\nUsage:\n.antiviewonce on\n.antiviewonce off`
      });
    }

    if (action === "on") {
      data.enabled[from] = true;
      saveSettings(data);
      return sock.sendMessage(from, {
        text: "✅ Anti-ViewOnce enabled\n🔓 View-once media will be recovered"
      });
    }

    if (action === "off") {
      data.enabled[from] = false;
      saveSettings(data);
      return sock.sendMessage(from, {
        text: "❌ Anti-ViewOnce disabled"
      });
    }
  },

  async onMessage({ sock, msg, from, sender, settings }) {
    const data = loadSettings();
    const owners = settings?.OWNERS || [];

    // Check if anti-viewonce is enabled for this chat
    if (!data.enabled[from]) return;

    const message = msg.message;
    if (!message) return;

    let isViewOnce = false;
    let mediaType = null;
    let mediaMessage = null;

    // Check for view-once image
    if (message.imageMessage?.viewOnce) {
      isViewOnce = true;
      mediaType = "image";
      mediaMessage = message.imageMessage;
    }

    // Check for view-once video
    if (message.videoMessage?.viewOnce) {
      isViewOnce = true;
      mediaType = "video";
      mediaMessage = message.videoMessage;
    }

    if (!isViewOnce) return;

    try {
      // Get chat info
      const groupMetadata = from.endsWith("@g.us")
        ? await sock.groupMetadata(from)
        : null;

      const chatName = groupMetadata?.subject || from;

      // Build recovery message
      let recoveryText = `🔓 *VIEW-ONCE RECOVERED*\n\n`;
      recoveryText += `📱 Chat: ${chatName}\n`;
      recoveryText += `👤 From: ${sender}\n`;
      recoveryText += `📸 Type: ${mediaType === "image" ? "Photo" : "Video"}\n`;
      recoveryText += `⏰ Time: ${new Date(msg.messageTimestamp * 1000).toLocaleString()}`;

      // Forward to owners
      for (const owner of owners) {
        const jid = `${owner}@s.whatsapp.net`;

        try {
          if (mediaType === "image") {
            await sock.sendMessage(jid, {
              image: { url: mediaMessage.url || mediaMessage.mediaKey },
              caption: recoveryText
            });
          } else if (mediaType === "video") {
            await sock.sendMessage(jid, {
              video: { url: mediaMessage.url || mediaMessage.mediaKey },
              caption: recoveryText
            });
          }
        } catch (e) {
          console.log("ViewOnce forward error:", e.message);
        }
      }

      saveSettings(data);
    } catch (e) {
      console.log(`⚠️ Anti-ViewOnce error: ${e.message}`);
    }
  }
};
