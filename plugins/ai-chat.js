import axios from "axios";

export default {
  command: ["ai", "bot", "gpt", "openai", "chatgpt", "deepseek", "deep"],

  async execute({ sock, from, args, text, settings }) {
    if (!text) {
      await sock.sendMessage(from, {
        text: "Usage: .ai <question>\n.openai <question>\n.deepseek <question>"
      });
      return;
    }

    const firstArg = (args[0] || "").toLowerCase();
    const query = text.trim();

    try {
      // Determine which AI API to use based on command
      let response;

      if (
        firstArg === "openai" ||
        firstArg === "chatgpt"
      ) {
        const apiUrl = `https://vapis.my.id/api/openai?q=${encodeURIComponent(
          query
        )}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.result) {
          await sock.sendMessage(from, { text: "❌ OpenAI failed to respond" });
          return;
        }
        response = `🧠 *OpenAI:*\n\n${data.result}`;
      } else if (
        firstArg === "deepseek" ||
        firstArg === "deep"
      ) {
        const apiUrl = `https://api.ryzendesu.vip/api/ai/deepseek?text=${encodeURIComponent(
          query
        )}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.answer) {
          await sock.sendMessage(from, {
            text: "❌ DeepSeek failed to respond"
          });
          return;
        }
        response = `🧠 *DeepSeek:*\n\n${data.answer}`;
      } else {
        // Default to GPT
        const apiUrl = `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(
          query
        )}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.message) {
          await sock.sendMessage(from, { text: "❌ AI failed to respond" });
          return;
        }
        response = `🤖 *AI:*\n\n${data.message}`;
      }

      await sock.sendMessage(from, { text: response });
    } catch (e) {
      console.error("AI Error:", e.message);
      await sock.sendMessage(from, {
        text: "❌ Error communicating with AI"
      });
    }
  }
};
