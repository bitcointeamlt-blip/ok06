# 🔍 Lokalus vs Colyseus Cloud - Kodėl Lokaliai Veikia, Bet Cloud Neveikia?

## ❌ Problema

- ✅ Lokalus serveris veikia (localhost:7000 frontend, localhost:2567 backend)
- ❌ Colyseus Cloud serveris neveikia ("Service Unavailable")
- ✅ Frontend bando prisijungti prie Colyseus Cloud

---

## 🔍 Galimos Priežastys

### 1. Serveris Crash'ina Po Start'o Colyseus Cloud'e

**Simptomai:**
- Serveris start'ino (log'ai rodo sėkmingą start'ą)
- Bet dabar neatsako į request'us
- "Service Unavailable" error

**Priežastis:**
- Uncaught exception po start'o
- Unhandled rejection po start'o
- Process.exit() iškviečiamas po start'o
- GameRoom crash'ina onCreate metu

**Sprendimas:**
- Patikrinkite logs Colyseus Cloud'e
- Jei yra crash error'ų - patikrinkite, ar naujausias kodas su error handling yra deploy'intas

---

### 2. Naujausias Kodas Nėra Deploy'intas

**Simptomai:**
- Lokalus kodas turi error handling
- Bet Colyseus Cloud vis dar naudoja seną kodą be error handling

**Priežastis:**
- Kodas nėra commit'intas į GitHub
- Colyseus Cloud neatsiuntė naujo deployment'o
- Deployment užstrigo arba failed

**Sprendimas:**
- Commit → Push naujausią kodą į GitHub
- Colyseus Cloud automatiškai deploy'ins naują versiją
- Patikrinkite deployment status Colyseus Cloud'e

---

### 3. Environment Variables Problema

**Simptomai:**
- Lokalus serveris naudoja `process.env.PORT || 2567`
- Colyseus Cloud turėtų nustatyti `process.env.PORT` automatiškai

**Priežastis:**
- Colyseus Cloud gali neperduoti PORT environment variable
- Serveris gali bandyti start'inti ant neteisingo porto

**Sprendimas:**
- Patikrinkite logs Colyseus Cloud'e
- Patikrinkite, ar PORT teisingai nustatytas

---

### 4. PM2 Problema

**Simptomai:**
- Serveris start'ino, bet PM2 jį iškart uždarė
- Serveris crash'ina dėl PM2 konfigūracijos

**Priežastis:**
- `ecosystem.config.js` neteisingai sukonfigūruotas
- PM2 restart'ina serverį per dažnai
- PM2 kill'ina serverį dėl timeout'o

**Sprendimas:**
- Patikrinkite `ecosystem.config.js`
- Patikrinkite PM2 logs Colyseus Cloud'e

---

## ✅ Sprendimas

### Step 1: Patikrinkite, Ar Naujausias Kodas Deploy'intas

1. **GitHub** → Patikrinkite, ar naujausias kodas yra commit'intas
2. **Colyseus Cloud** → Deployments tab → Patikrinkite, ar naujausias deployment sėkmingas
3. **Jei nėra** → Commit → Push → Deploy

---

### Step 2: Patikrinkite Logs Colyseus Cloud'e

1. **Colyseus Cloud** → **Endpoints** tab → **LOGS**
2. **Išjunkite "Show only errors" toggle** (OFF)
3. **Refresh'inkite puslapį** (F5)
4. Patikrinkite:
   - Ar yra "✅ Colyseus server is running on port 2567"?
   - Ar yra crash error'ų po start'o?
   - Ar yra uncaught exception?
   - Ar yra "❌ Uncaught Exception" arba "❌ Unhandled Rejection"?

---

### Step 3: Reboot Instance

Jei serveris neveikia:

1. **Colyseus Cloud** → **Endpoints** tab
2. Ieškokite **"REBOOT"** arba **"RESTART"** mygtuko
3. Spustelėkite ir palaukite 2-3 minučių
4. Patikrinkite logs

---

### Step 4: Commit → Push Naujausią Kodą

Jei naujausias kodas su error handling nėra deploy'intas:

```bash
git add .
git commit -m "Add detailed error handling for Colyseus Cloud"
git push
```

**Arba GitHub Desktop:**
1. Select all files
2. Commit message: "Add detailed error handling for Colyseus Cloud"
3. Push

---

## 🎯 Pagrindinė Priežastis

**Tikėtina priežastis:**
- Naujausias kodas su error handling **NĖRA deploy'intas** Colyseus Cloud'e
- Colyseus Cloud vis dar naudoja seną kodą, kuris crash'ina po start'o be jokių log'ų
- Lokalus serveris veikia, nes jis naudoja naujausią kodą su error handling

**Sprendimas:**
1. **Commit → Push** naujausią kodą į GitHub
2. **Palaukite**, kol Colyseus Cloud deploy'ins naują versiją
3. **Patikrinkite logs** - dabar turėtumėte matyti detalią informaciją apie error'us

---

## 📋 Kitas Žingsnis

1. **Patikrinkite GitHub** - ar naujausias kodas yra commit'intas?
2. **Jei ne** - commit → push
3. **Patikrinkite Colyseus Cloud** - ar naujausias deployment sėkmingas?
4. **Patikrinkite logs** - ar yra error'ų?

**Dabar commit'inkite ir push'inkite naujausią kodą su error handling!**

