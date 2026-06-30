# 📁 File Placement Guide - Where to Put Everything

## 🎯 Quick Start

You have 24 files ready to download. Follow this guide to organize them in your local Black Blade repository.

---

## 📦 File Organization

### Step 1: Create Folder Structure

In your local Black Blade repo, create these folders if they don't exist:

```
your-local-black-blade/
├── lib/              (create if missing)
├── plugins/          (should already exist)
└── data/             (will auto-create)
```

### Step 2: Place Files in Correct Locations

**Core Files (Root Directory):**
```
your-local-black-blade/
├── index.js              ← Copy HERE
├── settings.js           ← Copy HERE
├── package.json          ← Copy HERE (or keep existing)
└── README_FILE_PLACEMENT.md  ← This file
```

**Lib Folder:**
```
your-local-black-blade/lib/
└── helpers.js            ← Copy HERE (paste into lib/ folder)
```

**Plugin Files (9 New ESM Plugins):**
```
your-local-black-blade/plugins/
├── ai-chat.js           ← Copy HERE
├── anti-delete.js       ← Copy HERE
├── anti-viewonce.js     ← Copy HERE
├── antivv.js            ← Copy HERE
├── broadcast.js         ← Copy HERE
├── listonline.js        ← Copy HERE
├── menu.js              ← Copy HERE
├── status-react.js      ← Copy HERE
└── tagall.js            ← Copy HERE
```

**Legacy Plugins (Keep as-is - no .js version):**
```
your-local-black-blade/plugins/
├── anti-vv.cjs          ← Copy HERE
├── profile.cjs          ← Copy HERE
├── quiz.cjs             ← Copy HERE
└── tiktok.cjs           ← Copy HERE
```

**Documentation (Root Directory - Optional but helpful):**
```
your-local-black-blade/
├── 00_DEPLOYMENT_READY.md           ← Copy (quick overview)
├── DEPLOYMENT_CHECKLIST.md          ← Copy (step-by-step)
├── PLUGIN_GUIDE.md                  ← Copy (create plugins)
├── PLUGIN_ENGINE.md                 ← Copy (architecture)
├── GIT_DEPLOYMENT_COMMANDS.md       ← Copy (git commands)
├── REBUILD_SUMMARY.md               ← Copy (what changed)
└── FILES_READY.txt                  ← Copy (status check)
```

---

## ✅ Verification Checklist

After placing all files, verify:

- [ ] `index.js` in root (7 KB)
- [ ] `settings.js` in root (1 KB)  
- [ ] `package.json` in root
- [ ] `lib/helpers.js` exists (2 KB)
- [ ] All 9 `.js` plugins in `plugins/` folder
- [ ] All 4 `.cjs` legacy plugins in `plugins/` folder
- [ ] Total: 13 plugins in `plugins/` folder
- [ ] `auth_info/` folder UNTOUCHED (keep your session!)
- [ ] `.gitignore` has `auth_info/` and `node_modules/`

**Quick check:**
```bash
# Count plugins (should show 13)
ls plugins/ | wc -l

# Verify helpers.js exists
cat lib/helpers.js | head -5
```

---

## 📋 File Manifest

**24 Files Total:**

### Core (3 files)
1. ✅ index.js
2. ✅ settings.js
3. ✅ package.json

### Lib (1 file)
4. ✅ helpers.js

### Plugins - New ESM (9 files)
5. ✅ ai-chat.js
6. ✅ anti-delete.js
7. ✅ anti-viewonce.js
8. ✅ antivv.js
9. ✅ broadcast.js
10. ✅ listonline.js
11. ✅ menu.js
12. ✅ status-react.js
13. ✅ tagall.js

### Plugins - Legacy (4 files)
14. ✅ anti-vv.cjs
15. ✅ profile.cjs
16. ✅ quiz.cjs
17. ✅ tiktok.cjs

### Documentation (7 files)
18. ✅ 00_DEPLOYMENT_READY.md
19. ✅ DEPLOYMENT_CHECKLIST.md
20. ✅ PLUGIN_GUIDE.md
21. ✅ PLUGIN_ENGINE.md
22. ✅ GIT_DEPLOYMENT_COMMANDS.md
23. ✅ REBUILD_SUMMARY.md
24. ✅ FILES_READY.txt

---

## 🚀 After File Placement

### Step 1: Verify Syntax
```bash
cd your-local-black-blade
node index.js --check    # Or just npm start to test
```

### Step 2: Git Commands
```bash
git add .
git commit -m "feat: Plugin engine rebuild with ESM format"
git push origin main
```

### Step 3: Wait for Render
- 2-3 minutes for auto-deploy
- Check logs at: https://dashboard.render.com

### Step 4: Test
```
.menu
.ai hello
.antidelete on
```

---

## ⚠️ Important Notes

### DO NOT Override
- Keep existing `package-lock.json` (don't replace)
- Keep `auth_info/` untouched (your WhatsApp session)
- Keep `node_modules/` (install fresh with `npm install`)

### DO Delete These Old Files (If They Exist)
```
❌ DELETE (duplicates):
- plugins/broadcast.cjs
- plugins/listonline.cjs
- plugins/menu.cjs
- plugins/status-react.cjs
- plugins/tagall.cjs
- plugins/anti-viewonce.cjs

❌ DO NOT DELETE (keep):
- plugins/anti-vv.cjs
- plugins/profile.cjs
- plugins/quiz.cjs
- plugins/tiktok.cjs
```

### DO Update .gitignore
Make sure your `.gitignore` has:
```
node_modules/
auth_info/
.env
```

---

## 🆘 Troubleshooting

**"Cannot find module helpers.js"**
- Check `lib/helpers.js` exists
- Verify path in index.js: `./lib/helpers.js`

**"Plugin failed to load"**
- Check ESM syntax: `export default`
- Check for syntax errors: `node plugins/filename.js`

**"Settings error"**
- Verify `settings.js` has proper JSON syntax
- Check OWNERS array has quotes: `"2347070818332",`

---

## 📞 Quick Reference

**File Organization Command (for Linux/Mac):**
```bash
# Copy all files to correct locations
cp ~/Downloads/index.js .
cp ~/Downloads/settings.js .
cp ~/Downloads/package.json .
cp ~/Downloads/helpers.js lib/
cp ~/Downloads/*.js plugins/  # All .js files
cp ~/Downloads/*.cjs plugins/ # All .cjs files
cp ~/Downloads/*.md .         # All documentation
```

**Windows PowerShell:**
```powershell
# Copy files manually or use:
Copy-Item ~\Downloads\*.js .
Copy-Item ~\Downloads\*.cjs .\plugins\
```

---

**After placing all files, you're ready to push to GitHub and deploy! 🚀**

---

## 📚 Documentation Reading Order

1. **START HERE:** `00_DEPLOYMENT_READY.md` (2 min read)
2. **Then:** `DEPLOYMENT_CHECKLIST.md` (step-by-step)
3. **For Git:** `GIT_DEPLOYMENT_COMMANDS.md` (copy-paste)
4. **For Plugins:** `PLUGIN_GUIDE.md` (learn plugin creation)
5. **Technical:** `PLUGIN_ENGINE.md` (deep dive)

---

**Good luck, my gee! Your bot is production-ready.** 🎯
