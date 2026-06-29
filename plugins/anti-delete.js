const { registerPlugin } = require('../lib/plugin-loader');
const { loadData, saveData } = require('../data/antidelete-data');

registerPlugin(
  {
    pattern: 'antidelete',
    alias: ['antidel'],
    desc: 'Toggle anti-delete in groups',
    category: 'settings'
  },
  async (sock, message, { from, reply, text, isOwner }) => {
    if (!isOwner) return reply('❌ Owner only');
    
    const data = loadData();
    const groupId = from;
    const action = text?.toLowerCase().trim();
    
    if (action === 'on') {
      data.groups[groupId] = true;
      saveData(data);
      reply('✅ Anti-delete enabled');
    } else if (action === 'off') {
      data.groups[groupId] = false;
      saveData(data);
      reply('❌ Anti-delete disabled');
    } else {
      reply(`Status: ${data.groups[groupId] ? '✅ ON' : '❌ OFF'}`);
    }
  }
);
