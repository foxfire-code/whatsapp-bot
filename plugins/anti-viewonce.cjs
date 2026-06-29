const fs = require('fs');

const FILE = './data/antiviewonce.json';

module.exports = {
  name: 'antiviewonce',
  command: ['antiviewonce'],

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
        text: '❌ Anti ViewOnce disabled.'
      });
    }

    data.push(jid);
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

    await sock.sendMessage(jid, {
      text: '✅ Anti ViewOnce enabled.'
    });
  }
};
