const fs = require('fs');
const path = require('path');

const plugins = {};

function registerPlugin(config, handler) {
  plugins[config.pattern] = {
    ...config,
    handler,
  };
}

function loadPlugins() {
  const pluginsDir = path.join(__dirname, '../plugins');
  if (!fs.existsSync(pluginsDir)) return;
  
  fs.readdirSync(pluginsDir).forEach(file => {
    if (file.endsWith('.js')) {
      try {
        require(path.join(pluginsDir, file));
        console.log(`✅ Loaded: ${file}`);
      } catch (err) {
        console.error(`❌ Failed to load ${file}:`, err.message);
      }
    }
  });
}

module.exports = { registerPlugin, loadPlugins, plugins };
