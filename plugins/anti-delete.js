import { loadJSON, saveJSON } from "../lib/helpers.js";

const DATA_FILE = "./data/anti-delete.json";

function getSettings() {
  return loadJSON(DATA_FILE, { enabled: {}, cache: {} });
}

function saveSettings(data) {
  saveJSON(DATA_FILE, data);
}

function extractMessageContent(msg) {
  const m = msg.message || {};

  return {
    text:
      m.conversation ||
      m.extendedTextMessage?.text ||
      m.imageMessage?.caption ||
      m.videoMessage?.caption ||
      m.documentMessage?.caption ||
      null,

    image: m.imageMessage || null,
    video: m.videoMessage || null,
    audio: m.audioMessage || null,
    document: m.documentMessage || null,
    sticker: m.stickerMessage || null,

    type:
      m.imageMessage
        ? "image"
        : m.videoMessage
        ? "video"
        : m.audioMessage
        ? "audio"
        : m.documentMessage
        ? "document"
        : m.stickerMessage
        ? "sticker"
        : "text"
  };
}

export default {
  command: ["antidelete", "antidel"],

  async execute({ sock, from, args, settings }) {
    const data = getSettings();
    const action = (args[0] || "").toLowerCase();

    if (action === "on") {
      data.enabled[from] = true;
      saveSettings(data);
      return sock.sendMessage(from, { text: "✅ Anti-delete enabled (ALL MEDIA)" });
    }

    if (action === "off") {
      data.enabled[from] = false;
      saveSettings(data);
      return sock.sendMessage(from, { text: "❌ Anti-delete disabled" });
    }

    const status = data.enabled[from] ? "ON ✅" : "OFF ❌";
    return sock.sendMessage(from, { text: `Anti-delete: ${status}` });
  },

  async onMessage({ msg, from }) {
    const data = getSettings();
    if (!data.enabled[from]) return;

    if (!data.cache[from]) data.cache[from] = [];

    const content = extractMessageContent(msg);

    data.cache[from].push({
      key: msg.key,
      sender: msg.key.participant || msg.key.remoteJid,
      timestamp: msg.messageTimestamp,
      content
    });

    if (data.cache[from].length > 500) {
      data.cache[from] = data.cache[from].slice(-500);
    }

    saveSettings(data);
  },

  async onDelete({ sock, msg, settings }) {
    const data = getSettings();
    const from = msg.key.remoteJid;

    if (!data.enabled[from]) return;
    if (!data.cache[from]) return;

    const deleted = data.cache[from].find((m) =>
      JSON.stringify(m.key) === JSON.stringify(msg.key)
    );

    if (!deleted) return;

    const sender = deleted.sender.split("@")[0];
    const type = deleted.content.type;

    const caption =
      `🚨 *DELETED MESSAGE RECOVERED*\n\n` +
      `👤 From: ${sender}\n` +
      `📦 Type: ${type}\n` +
      `⏰ Time: ${new Date(deleted.timestamp * 1000).toLocaleString()}`;

    // send to owners
    if (settings && settings.OWNERS) {
      for (const owner of settings.OWNERS) {
        const jid = `${owner}@s.whatsapp.net`;

        try {
          if (type === "image" && deleted.content.image) {
            await sock.sendMessage(jid, {
              image: deleted.content.image,
              caption
            });
          } else if (type === "video" && deleted.content.video) {
            await sock.sendMessage(jid, {
              video: deleted.content.video,
              caption
            });
          } else if (type === "audio" && deleted.content.audio) {
            await sock.sendMessage(jid, {
              audio: deleted.content.audio,
              mimetype: "audio/mp4"
            });
          } else if (type === "document" && deleted.content.document) {
            await sock.sendMessage(jid, {
              document: deleted.content.document,
              caption
            });
          } else if (type === "sticker" && deleted.content.sticker) {
            await sock.sendMessage(jid, {
              sticker: deleted.content.sticker
            });
          } else {
            await sock.sendMessage(jid, {
              text: caption + `\n\n💬 Text: ${deleted.content.text || "N/A"}`
            });
          }
        } catch (e) {
          console.log("Anti-delete send error:", e.message);
        }
      }
    }
  }
};
