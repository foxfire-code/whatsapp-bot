import { loadJSON, saveJSON } from "../lib/helpers.js";

const DATA_FILE = "./data/status-react.json";

function loadConfig() {
  return loadJSON(DATA_FILE, {
    enabled: true,
    delay: 3000,
    emoji: "👍"
  });
}

function saveConfig(data) {
  saveJSON(DATA_FILE, data);
}

export default {
  command: ["statusreact", "sreact"],

  async execute({ sock, from, args, owner }) {
    if (!owner) {
      return sock.sendMessage(from, {
        text: "❌ Owner only"
      });
    }

    const config = loadConfig();
    const action = args[0]?.toLowerCase();
    const value = args[1];

    if (!action) {
      return sock.sendMessage(from, {
        text: `📊 *Status React Settings*\n\nStatus: ${config.enabled ? "✅ ON" : "❌ OFF"}\nDelay: ${config.delay}ms\nEmoji: ${config.emoji}\n\n*Commands:*\n.statusreact on/off\n.statusreact delay <ms>\n.statusreact emoji <emoji>`
      });
    }

    if (action === "on") {
      config.enabled = true;
      saveConfig(config);
      return sock.sendMessage(from, {
        text: "✅ Status react enabled\n⏱️ Delay: " + config.delay + "ms\n😀 Emoji: " + config.emoji
      });
    }

    if (action === "off") {
      config.enabled = false;
      saveConfig(config);
      return sock.sendMessage(from, {
        text: "❌ Status react disabled"
      });
    }

    if (action === "delay" && value) {
      const delayMs = parseInt(value);
      if (isNaN(delayMs)) {
        return sock.sendMessage(from, {
          text: "❌ Invalid delay value"
        });
      }
      config.delay = delayMs;
      saveConfig(config);
      return sock.sendMessage(from, {
        text: `⏱️ Delay set to ${delayMs}ms`
      });
    }

    if (action === "emoji" && value) {
      config.emoji = value;
      saveConfig(config);
      return sock.sendMessage(from, {
        text: `😀 Emoji set to ${value}`
      });
    }
  },

  async onStatus({ sock }) {
    const config = loadConfig();

    if (!config.enabled) return;

    // React to status after configured delay
    setTimeout(async () => {
      try {
        // Get latest status
        const updates = await sock.fetchMessageReceipts({
          jid: "status@broadcast"
        });

        if (updates?.length > 0) {
          const latestStatus = updates[updates.length - 1];

          await sock.sendMessage("status@broadcast", {
            react: {
              text: config.emoji,
              key: latestStatus.key
            }
          });
        }
      } catch (e) {
        console.log(`⚠️ Status react error: ${e.message}`);
      }
    }, config.delay);
  }
};
