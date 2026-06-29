import {
makeWASocket,
useMultiFileAuthState,
DisconnectReason,
fetchLatestBaileysVersion,
Browsers,
makeInMemoryStore
} from "@whiskeysockets/baileys";

import pino from "pino";
import express from "express";
import fs from "fs";
import settings from "./settings.js";
import { isOwner } from "./lib/helpers.js";

const logger = pino({ level: "silent" });
const store = makeInMemoryStore({ logger: pino({ level: "silent" }) });
let sock;
let plugins = [];

async function loadPlugins() {
plugins = [];

if (!fs.existsSync("./plugins")) {
fs.mkdirSync("./plugins");
}

const files = fs.readdirSync("./plugins");

for (const file of files) {
try {
let plugin;

  if (file.endsWith(".js")) {
    const mod = await import(`./plugins/${file}?update=${Date.now()}`);
    plugin = mod.default;
  } else if (file.endsWith(".cjs")) {
    const mod = await import(`./plugins/${file}`);
    plugin = mod.default;
  } else {
    continue;
  }

  if (plugin) {
    plugins.push(plugin);
    console.log(`✅ Loaded ${file}`);
  }
} catch (e) {
  console.log(`❌ Failed ${file}`);
  console.log(e.message);
}

}
}

async function startBot() {
console.log("🚀 Starting Black Blade...");

const { version } = await fetchLatestBaileysVersion();
const { state, saveCreds } = await useMultiFileAuthState(settings.SESSION_DIR);

sock = makeWASocket({
version,
logger,
auth: state,
browser: Browsers.ubuntu("Chrome")
});

store.bind(sock.ev);

await loadPlugins();

sock.ev.on("creds.update", saveCreds);

sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
if (connection === "open") {
console.log("✅ Connected");
}

if (connection === "close") {
  const code = lastDisconnect?.error?.output?.statusCode;
  if (code === DisconnectReason.loggedOut) {
    process.exit();
  }
  console.log("🔄 Reconnecting...");
  startBot();
}

});

sock.ev.on("messages.upsert", async ({ messages }) => {
const msg = messages[0];
if (!msg?.message) return;

const text =
  msg.message.conversation ||
  msg.message.extendedTextMessage?.text ||
  "";

if (!text.startsWith(settings.PREFIX)) return;

const from = msg.key.remoteJid;
const sender = msg.key.participant || from;
const owner = isOwner(sender, settings.OWNERS);

const args = text.slice(settings.PREFIX.length).trim().split(/ +/);
const cmd = args.shift().toLowerCase();

for (const plugin of plugins) {
  try {
    if (plugin.command && plugin.command.includes(cmd)) {
      const fn = plugin.execute || plugin.run;
      if (!fn) continue;
      return await fn({ sock, m: msg, msg, from, sender, args, owner, store });
    }
  } catch (e) {
    console.log(e);
    await sock.sendMessage(from, { text: "❌ Command Error" });
  }
}

});
}

const app = express();

app.get("/", (req, res) => {
res.send("Black Blade Running");
});

app.listen(settings.PORT, () => {
console.log(`🌐 Running on port ${settings.PORT}`);
startBot();
});
