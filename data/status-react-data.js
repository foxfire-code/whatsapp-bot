const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'status-react.json');

function loadConfig() {
  try {
    if (fs.existsSync(dataFile)) {
      return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading status react data:', err);
  }
  return { enabled: true, delay: 3000, emoji: '👍' };
}

function saveConfig(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

module.exports = { loadConfig, saveConfig };
