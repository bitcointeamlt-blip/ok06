# 📋 Checklist - Kas Reikia Nukopijuoti į ok06

## ✅ SVARBIAUSI FAILAI (TURĖTŲ BŪTI NUKOPIJUOTI):

### 1. Colyseus Server Failai (SVARBIAUSIA!)
- ✅ `colyseus-server/src/index.ts` - **SUPAPRASTINTAS KODAS**
- ✅ `colyseus-server/ecosystem.config.js` - PM2 config
- ✅ `colyseus-server/package.json` - dependencies
- ✅ `colyseus-server/tsconfig.json` - TypeScript config
- ✅ `colyseus-server/src/rooms/GameRoom.ts` - Room logika
- ✅ `colyseus-server/src/schema/GameState.ts` - Schema

### 2. Frontend Failai
- ✅ `src/services/ColyseusService.ts` - Colyseus client service
- ✅ `src/simple-main.ts` - Main game logic
- ✅ `package.json` - Frontend dependencies
- ✅ `vite.config.ts` - Vite config
- ✅ `netlify.toml` - Netlify config

### 3. Kiti Failai
- ✅ `index.html` - HTML entry point
- ✅ `tsconfig.json` - TypeScript config
- ✅ `.gitignore` - Git ignore rules

---

## 🔍 Kaip Patikrinti, Ar Viskas Nukopijuota:

### Step 1: Patikrinkite `colyseus-server/src/index.ts`

Atidarykite `ok06/colyseus-server/src/index.ts` ir patikrinkite:

**Turėtų būti:**
```typescript
// Start HTTP server - Colyseus will handle WebSocket connections automatically
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

**NETURĖTŲ BŪTI:**
- ❌ `gameServer.listen()` - neteisinga
- ❌ `checkPortAvailable()` - pašalinta
- ❌ Sudėtingi port check'ai - pašalinti

### Step 2: Patikrinkite `colyseus-server/ecosystem.config.js`

Atidarykite `ok06/colyseus-server/ecosystem.config.js` ir patikrinkite:

**Turėtų būti:**
```javascript
instances: 1, // CRITICAL: Only one instance
exec_mode: 'fork', // CRITICAL: Use fork mode
unique: true // Ensure only one instance
```

### Step 3: Patikrinkite Build

```bash
cd ok06/colyseus-server
npm install
npm run build
```

**Turėtumėte matyti:**
- ✅ Build sėkmingas
- ✅ `build/index.js` sukurtas
- ✅ Nėra error'ų

---

## 🚀 Po Kopijavimo:

### Step 1: Commit į GitHub

1. Atidarykite **GitHub Desktop**
2. Pasirinkite **ok06** repository
3. Turėtumėte matyti visus pakeitimus
4. **Summary**: "Simplify Colyseus server code - remove complex port checks"
5. **Commit → Push**

### Step 2: Palaukite Deployment

- **Netlify** automatiškai deploy'ins frontend
- **Colyseus Cloud** automatiškai deploy'ins backend

### Step 3: Patikrinkite Logs

**Colyseus Cloud logs turėtų rodyti:**
```
✅ Server running on port 2567
```

**NETURĖTŲ RODYTI:**
```
❌ Port 2567 is already in use
ERR_SERVER_ALREADY_LISTEN
```

---

## ✅ Checklist:

- [ ] Visi failai nukopijuoti iš `pvpnew` į `ok06`
- [ ] `colyseus-server/src/index.ts` patikrintas (turi `server.listen()`)
- [ ] `colyseus-server/ecosystem.config.js` patikrintas (turi `instances: 1`)
- [ ] Build sėkmingas (`npm run build`)
- [ ] Commit padarytas GitHub Desktop
- [ ] Push į GitHub
- [ ] Palaukite deployment (2-5 min)
- [ ] Patikrinkite Colyseus Cloud logs

---

## 💡 SVARBU:

Jei po kopijavimo vis dar matote seną kodą:
1. **Patikrinkite, ar failai tikrai nukopijuoti** - gali būti, kad failai neperrašyti
2. **Ištrynkite `ok06/colyseus-server/build/` folderį** - build output gali būti senas
3. **Padarykite naują build** - `npm run build` ok06 folder'yje

---

**Ar visi failai nukopijuoti? Patikrinkite `colyseus-server/src/index.ts` - turėtų būti supaprastintas kodas!**

