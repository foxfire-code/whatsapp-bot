# Black Blade - Permanent Plugin Engine

## 🚀 Overview

The bot now has a **permanent plugin engine** that auto-loads all plugins without ever editing `index.js` again. Simply drop a new plugin into the `plugins/` folder and it will load automatically on restart.

## 📦 Plugin Structure

Each plugin exports an object with:

```javascript
export default {
  command: ["cmd1", "cmd2"],      // Command aliases (required)
  
  async execute({ sock, msg, from, sender, args, owner, settings, store }) {
    // Handle commands - called when .cmd1 or .cmd2 is used
  },
  
  // Optional event hooks:
  async onMessage({ sock, msg, from, sender, text, settings, store }) {},
  async onDelete({ sock, msg, settings, store }) {},
  async onViewOnce({ sock, msg, settings, store }) {},
  async onStatus({ sock, msg, settings, store }) {},
  async onGroupUpdate({ sock, update, settings, store }) {},
  async onCall({ sock, call, settings, store }) {},
  async onUpdate({ sock, update, settings, store }) {},
  async onStartup({ sock, settings }) {}
};
```

## 🎯 Context Object (Available in all handlers)

- **sock**: Baileys socket connection
- **msg**: Raw WhatsApp message object
- **from**: Chat JID (e.g., "2347070818332-1234567890@g.us")
- **sender**: Sender JID (e.g., "2347070818332@s.whatsapp.net")
- **args**: Command arguments as array
- **owner**: Boolean - is sender an owner?
- **settings**: Bot settings from settings.js
- **store**: Persistent data object for caching chats, etc.

## 📝 Plugin Examples

### Simple Command Plugin

```javascript
// plugins/hello.js
export default {
  command: ["hello", "hi"],
  
  async execute({ sock, from, sender }) {
    await sock.sendMessage(from, {
      text: "👋 Hello there!"
    });
  }
};
```

### Plugin with Event Hooks

```javascript
// plugins/auto-reply.js
export default {
  command: ["autoreply"],
  
  async execute({ sock, from, owner }) {
    if (!owner) return sock.sendMessage(from, { text: "❌ Owner only" });
    sock.sendMessage(from, { text: "✅ Auto-reply enabled" });
  },
  
  async onMessage({ sock, msg, from, text, settings }) {
    if (!text.toLowerCase().includes("hello")) return;
    await sock.sendMessage(from, { text: "👋 Hello to you too!" });
  }
};
```

### Plugin with Data Persistence

```javascript
// plugins/counter.js
import { loadJSON, saveJSON } from "../lib/helpers.js";

const DATA_FILE = "./data/counter.json";

function getCounter() {
  return loadJSON(DATA_FILE, { count: 0 });
}

export default {
  command: ["count"],
  
  async execute({ sock, from }) {
    const data = getCounter();
    data.count++;
    saveJSON(DATA_FILE, data);
    
    await sock.sendMessage(from, {
      text: `Count: ${data.count}`
    });
  }
};
```

## 🔧 Built-in Features

### Anti-Delete
- Caches all incoming messages
- Detects deleted messages
- Forwards recovered message to MYS chat
- **Commands**: `.antidelete on/off`

### Anti-ViewOnce
- Detects view-once images/videos
- Automatically removes protection
- Forwards recovered media to MYS chat
- **Commands**: `.antiviewonce on/off`

### Status React
- Automatically reacts to WhatsApp status
- Configurable emoji and delay
- **Commands**:
  - `.statusreact on/off` - Enable/disable
  - `.statusreact delay 5000` - Set delay in ms
  - `.statusreact emoji 🔥` - Set emoji

### Broadcast
- Send message to all chats
- Rate-limited to avoid being blocked
- **Command**: `.broadcast <message>`

## 📁 File Structure

```
black_blade/
├── index.js                  # Main bot engine (DON'T EDIT)
├── settings.js              # Bot configuration
├── package.json
├── plugins/                 # Auto-loaded plugins
│   ├── anti-delete.js
│   ├── anti-viewonce.js
│   ├── status-react.js
│   ├── broadcast.js
│   ├── menu.js
│   ├── tagall.js
│   └── [your-plugins].js   # Add new plugins here!
├── lib/
│   └── helpers.js          # Utility functions
├── data/                   # Auto-created data files
│   ├── anti-delete.json
│   ├── anti-viewonce.json
│   └── status-react.json
└── auth_info/              # WhatsApp session (NEVER TOUCH)
```

## ✨ Adding New Plugins

1. Create a new file in `plugins/` folder
2. Export an object with `command` array and handler function
3. Restart the bot - plugin auto-loads!
4. No need to edit any other files

Example:
```bash
# Create new plugin
cat > plugins/weather.js << 'EOF'
export default {
  command: ["weather"],
  async execute({ sock, from, args }) {
    const city = args[0] || "London";
    await sock.sendMessage(from, { text: `🌤️ Weather in ${city}` });
  }
};
