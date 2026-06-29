const fs = require('fs');

const FILE = './data/antivv.json';

module.exports = {
  name: 'antivv',
  command: ['antivv'],

  async run({ sock, m }) {
    const jid = m.key.remoteJid;

    let data = [];
    if (fs.existsSync(FILE)) {
      data = JSON.parse(fs.readFileSync(FILE));
    }

    if (data.includes(jid)) {
      data = data.filter(x => x !== jid);
      fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

      return sock.sendMessage(jid, {
        text: '❌ AntiVV disabled.'
      });
    }

    data.push(jid);
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

    await sock.sendMessage(jid, {
      text: '✅ AntiVV enabled.'
    });
  }
};
