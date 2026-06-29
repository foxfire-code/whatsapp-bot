const axios = require("axios");

module.exports = {
  command: ["tiktok", "tt"],
  execute: async ({ sock, from, args }) => {
    const url = args[0];
    if (!url) return sock.sendMessage(from, { text: "Usage: .tiktok <url>" });

    try {
      await sock.sendMessage(from, { text: "⏳ Downloading TikTok..." });
      const { data } = await axios.get(`https://api.ryzendesu.vip/api/downloader/ttdl?url=${encodeURIComponent(url)}`);
      if (!data || !data.data?.play) return sock.sendMessage(from, { text: "❌ Failed to download" });

      await sock.sendMessage(from, {
        video: { url: data.data.play },
        caption: data.data.title || "TikTok Video"
      });
    } catch (e) {
      sock.sendMessage(from, { text: "❌ Error: " + e.message });
    }
  }
};
