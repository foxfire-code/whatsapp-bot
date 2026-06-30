# Black Blade - Quick Reference Guide 📚

## 🎮 All Available Commands

### AI Commands (No API key needed)
```
.ai <question>           → Chat with GPT AI
.openai <question>       → Chat with OpenAI
.deepseek <question>     → Chat with DeepSeek AI
```

### Anti-Delete / Anti-ViewOnce
```
.antidelete on/off       → Enable/disable message caching
.antidelete              → Check current status
.antiviewonce on/off     → Enable/disable view-once recovery
.antiviewonce            → Check current status (alias: .antivv)
```

### Status Reactions
```
.statusreact on/off      → Enable/disable auto-reactions
.statusreact delay 5000  → Set reaction delay (milliseconds)
.statusreact emoji 🔥    → Set reaction emoji
.statusreact             → Check current settings
```

### Group Commands (Groups only)
```
.tagall                  → Tag all group members
.listonline              → List all members in group
.mentionall              → Same as .tagall (alias)
.tag                     → Same as .tagall (alias)
```

### Broadcast
```
.broadcast <message>     → Send message to all chats
.bc <message>            → Same as .broadcast (alias)
```

### Utilities
```
.menu                    → Show all available commands
.help                    → Same as .menu (alias)
```

### Legacy Commands (Keep working)
```
.quiz                    → Quiz game
.profile                 → User profile (cjs version)
.tiktok <url>           → Download TikTok videos
.antivv on/off           → Alternative view-once (cjs version)
```

## 🔧 Plugin System Basics

### Plugin File Structure

Every plugin is a `.js` file in the `plugins/` folder with this structure:

```javascript
import { loadJSON, saveJSON } from "../lib/helpers.js";  // Optional

export default {
  command: ["cmd1", "cmd2", "alias"],  // Required: command names
  
  async execute({ sock, from, args, owner, text, settings, store }) {
    // Handle .cmd1 or .cmd2 or .alias
    // This function is called when user types .cmd1
  },

  // Optional event hooks (called for every message):
  async onMessage({ sock, msg, from, sender, text, settings, store }) {
    // Called on EVERY incoming message
  },

  async onDelete({ sock, msg, settings }) {
    // Called when message is deleted
  },

  async onStatus({ sock, msg, settings }) {
    // Called when someone posts a status
  },

  async onGroupUpdate({ sock, update, settings }) {
    // Called when group updated (member added/removed)
  },

  async onCall({ sock, call, settings }) {
    // Called when someone calls the bot
  },

  async onStartup({ sock, settings }) {
    // Called when bot starts up
  }
};
```

### Context Object (Available in all handlers)

- **sock** - Baileys socket (WhatsApp connection)
- **msg** - Complete WhatsApp message object
- **from** - Chat JID (who/where message came from)
- **sender** - Sender JID (who sent the message)
- **args** - Command arguments as array
- **text** - Message text content
- **owner** - Boolean (is sender an owner?)
- **settings** - Bot settings from settings.js
- **store** - Cache object for storing data

## 📝 Example Plugins

### Simple "Hello" Command

```javascript
// plugins/hello.js
export default {
  command: ["hello", "hi", "greet"],
  
  async execute({ sock, from }) {
    await sock.sendMessage(from, {
      text: "👋 Hello! How are you doing?"
    });
  }
};
```

**Usage:** `.hello` or `.hi` or `.greet` → Bot replies with greeting

---

### Command with Arguments

```javascript
// plugins/calc.js
export default {
  command: ["calc", "calculate"],
  
  async execute({ sock, from, args }) {
    const num1 = parseInt(args[0]);
    const num2 = parseInt(args[1]);
    const result = num1 + num2;
    
    await sock.sendMessage(from, {
      text: `🧮 ${num1} + ${num2} = ${result}`
    });
  }
};
```

**Usage:** `.calc 5 10` → Bot replies: `🧮 5 + 10 = 15`

---

### Command with Owner Check

```javascript
// plugins/admin.js
export default {
  command: ["admin", "shutdown"],
  
  async execute({ sock, from, owner }) {
    if (!owner) {
      await sock.sendMessage(from, { text: "❌ Owner only" });
      return;
    }
    
    await sock.sendMessage(from, { text: "⚙️ Admin command executed" });
  }
};
```

**Usage:** `.admin` → Only works if sender is in OWNERS array

---

### Plugin with Data Persistence

```javascript
// plugins/counter.js
import { loadJSON, saveJSON } from "../lib/helpers.js";

const DATA_FILE = "./data/counter.json";

export default {
  command: ["count", "increment"],
  
  async execute({ sock, from }) {
    // Load counter data
    const data = loadJSON(DATA_FILE, { count: 0 });
    
    // Increment
    data.count++;
    
    // Save back to disk
    saveJSON(DATA_FILE, data);
    
    await sock.sendMessage(from, {
      text: `📊 Count: ${data.count}`
    });
  }
};
```

**Usage:** 
- `.count` → Increments and shows: `📊 Count: 1`
- `.count` again → Shows: `📊 Count: 2`
- Data persists even after bot restart!

---

### Auto-Reply Plugin (Uses onMessage Hook)

```javascript
// plugins/autoreply.js
export default {
  command: ["autoreply"],
  
  async execute({ sock, from, owner }) {
    if (!owner) {
      await sock.sendMessage(from, { text: "❌ Owner only" });
      return;
    }
    await sock.sendMessage(from, { text: "✅ Auto-reply enabled" });
  },
  
  async onMessage({ sock, from, text, msg }) {
    // This runs on EVERY message
    if (text?.toLowerCase().includes("hello")) {
      await sock.sendMessage(from, { text: "👋 Hello to you too!" });
    }
    if (text?.toLowerCase().includes("bye")) {
      await sock.sendMessage(from, { text: "👋 Goodbye!" });
    }
  }
};
```

**Usage:** 
- `.autoreply` → Enables the feature
- Anyone says "hello" → Bot auto-replies "👋 Hello to you too!"
- Anyone says "bye" → Bot auto-replies "👋 Goodbye!"

---

### Status Auto-Reactor Plugin

```javascript
// plugins/statusauto.js
export default {
  command: ["statusreaction"],
  
  async onStatus({ sock, msg }) {
    // React to every status with ❤️
    try {
      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: "❤️", key: msg.key }
      });
    } catch (e) {
      console.error("Reaction failed:", e.message);
    }
  }
};
```

**Usage:** Automatically reacts to statuses with ❤️

---

## 💾 Data Persistence Helpers

### Save Data to JSON File

```javascript
import { loadJSON, saveJSON } from "../lib/helpers.js";

const DATA_FILE = "./data/mydata.json";

// Load existing data or create new
const data = loadJSON(DATA_FILE, { 
  users: [], 
  count: 0 
});

// Modify data
data.count++;
data.users.push("user123");

// Save back to disk
saveJSON(DATA_FILE, data);
```

**Features:**
- Auto-creates `data/` directory if missing
- Auto-creates JSON file if missing
- Survives bot restarts
- Readable JSON format

---

## 🚀 Adding a New Plugin

1. **Create file:** `plugins/mycommand.js`

2. **Write code:**
```javascript
export default {
  command: ["mycommand"],
  async execute({ sock, from }) {
    await sock.sendMessage(from, { text: "✅ It works!" });
  }
};
```

3. **Restart bot**
   - If local: `Ctrl+C` then `npm start`
   - If Render: Push to GitHub, let it auto-deploy
   - Or restart from Render dashboard

4. **Test:** Send `.mycommand` in WhatsApp

**That's it!** No other files need editing.

---

## 🎯 Bot Numbers & Config

```javascript
// From settings.js
BOT_NAME: "Black Blade"
PREFIX: "."
BOT_NUMBER: "2347070818332"

OWNERS: [
  "2347070818332",   // Main bot owner
  "2349162123734",   // Secondary owner
  "2349165200224"    // Tertiary owner
]
```

**Commands work like:** `.command` (dot + command name)

---

## ✨ Pro Tips

### Tip 1: Send Rich Messages

```javascript
// Text with formatting
await sock.sendMessage(from, {
  text: "*Bold text*\n_Italic text_\n`Code`"
});

// Send image
await sock.sendMessage(from, {
  image: { url: "https://example.com/image.jpg" },
  caption: "Check this image!"
});

// Send document
await sock.sendMessage(from, {
  document: { url: "https://example.com/file.pdf" },
  fileName: "document.pdf"
});
```

### Tip 2: React to Message

```javascript
// React with emoji
await sock.sendMessage(msg.key.remoteJid, {
  react: { text: "🔥", key: msg.key }
});
```

### Tip 3: Delete Message

```javascript
// Delete a message
await sock.sendMessage(msg.key.remoteJid, {
  delete: msg.key
});
```

### Tip 4: Mention User

```javascript
// Send mention to user
await sock.sendMessage(from, {
  text: `Hey @${sender.split("@")[0]}! Check this out!`,
  mentions: [sender]
});
```

### Tip 5: Get Chat Type

```javascript
// Check if group or private chat
const isGroup = from.includes("-");
const isPrivate = from.includes("@s.whatsapp.net");

if (isGroup) {
  // Group logic
} else {
  // Private chat logic
}
```

---

## 🐛 Debugging Plugins

### Check Bot Logs

**Locally:**
```bash
npm start
# Watch console output for "✅ Loaded plugin-name.js"
```

**On Render:**
Visit: `https://dashboard.render.com` → Your service → Logs

### Common Errors

| Error | Fix |
|-------|-----|
| `❌ Failed plugin.js` | Syntax error - check for typos |
| `⚠️ Skipped plugin.js` | Missing `command` array or `export default` |
| `Cannot find module` | Missing import or typo in path |
| `async execute is not a function` | Make sure to use `async` keyword |

### Add Debug Logging

```javascript
console.log("Plugin loaded"); // Appears in bot logs

export default {
  command: ["debug"],
  async execute({ sock, from }) {
    console.log(`Command received from: ${from}`);
    await sock.sendMessage(from, { text: "Debug message" });
  }
};
```

---

## 📋 Checklist for New Plugin

- [ ] File in `plugins/` folder
- [ ] Uses `export default`
- [ ] Has `command` array
- [ ] Has `async execute()` function
- [ ] Uses proper context params
- [ ] No syntax errors (test with `npm start`)
- [ ] Uses `loadJSON`/`saveJSON` for persistence
- [ ] Added to DEPLOYMENT_CHECKLIST after final version

---

**Happy plugin coding! 🚀**
