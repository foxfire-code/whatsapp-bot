import fs from "fs";
import path from "path";

export function isOwner(sender, owners = []) {
  const num = sender.split("@")[0];
  return owners.includes(num);
}

export function ensureDataDir(dir = "./data") {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function loadJSON(filepath, defaultValue = {}) {
  try {
    ensureDataDir(path.dirname(filepath));
    if (!fs.existsSync(filepath)) {
      saveJSON(filepath, defaultValue);
      return defaultValue;
    }
    const data = fs.readFileSync(filepath, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    console.error(`Error loading ${filepath}:`, e.message);
    return defaultValue;
  }
}

export function saveJSON(filepath, data) {
  try {
    ensureDataDir(path.dirname(filepath));
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error(`Error saving ${filepath}:`, e.message);
  }
}

export function normalizeJid(jid) {
  if (!jid) return jid;
  const num = jid.split("@")[0];
  if (num.startsWith("234")) {
    return num + "@s.whatsapp.net";
  }
  return jid;
}
