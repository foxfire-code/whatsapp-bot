const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'antidelete.json');

function loadData() {
  try {
    if (fs.existsSync(dataFile)) {
      return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading anti-delete data:', err);
  }
  return { enabled: false, groups: {} };
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

module.exports = { loadData, saveData };
