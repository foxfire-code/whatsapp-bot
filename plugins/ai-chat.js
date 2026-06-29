const { registerPlugin } = require('../lib/plugin-loader');
const axios = require('axios');

registerPlugin(
  {
    pattern: 'ai',
    alias: ['bot', 'gpt'],
    desc: 'Chat with AI',
    category: 'ai'
  },
  async (sock, message, { from, reply, text, isOwner }) => {
    if (!text) return reply('Usage: .ai <your question>');
    
    try {
      const query = text.trim();
      
      const apiUrl = `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(query)}`;
      const { data } = await axios.get(apiUrl);
      
      if (!data || !data.message) {
        return reply('❌ AI failed to respond');
      }
      
      await reply(`🤖 *AI:*\n\n${data.message}`);
    } catch (e) {
      console.error('AI Error:', e.message);
      reply('❌ Error communicating with AI');
    }
  }
);

registerPlugin(
  {
    pattern: 'openai',
    alias: ['chatgpt'],
    desc: 'Chat with OpenAI',
    category: 'ai'
  },
  async (sock, message, { from, reply, text, isOwner }) => {
    if (!text) return reply('Usage: .openai <your question>');
    
    try {
      const query = text.trim();
      
      const apiUrl = `https://vapis.my.id/api/openai?q=${encodeURIComponent(query)}`;
      const { data } = await axios.get(apiUrl);
      
      if (!data || !data.result) {
        return reply('❌ OpenAI failed to respond');
      }
      
      await reply(`🧠 *OpenAI:*\n\n${data.result}`);
    } catch (e) {
      console.error('OpenAI Error:', e.message);
      reply('❌ Error with OpenAI');
    }
  }
);

registerPlugin(
  {
    pattern: 'deepseek',
    alias: ['deep'],
    desc: 'Chat with DeepSeek AI',
    category: 'ai'
  },
  async (sock, message, { from, reply, text, isOwner }) => {
    if (!text) return reply('Usage: .deepseek <your question>');
    
    try {
      const query = text.trim();
      
      const apiUrl = `https://api.ryzendesu.vip/api/ai/deepseek?text=${encodeURIComponent(query)}`;
      const { data } = await axios.get(apiUrl);
      
      if (!data || !data.answer) {
        return reply('❌ DeepSeek failed to respond');
      }
      
      await reply(`🧠 *DeepSeek:*\n\n${data.answer}`);
    } catch (e) {
      console.error('DeepSeek Error:', e.message);
      reply('❌ Error with DeepSeek');
    }
  }
);
