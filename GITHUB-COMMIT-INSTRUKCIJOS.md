# 🚀 GitHub Commit Instrukcijos - Paruoštas Kodas

## ✅ Paruošti Failai Commit'ui

### 1. `colyseus-server/ecosystem.config.js`
**Kas pakeista:**
- Pridėta PM2 konfigūracija su `kill_timeout`, `restart_delay`, `min_uptime`, `max_restarts`
- Tai išspręs `EADDRINUSE` problemą Colyseus Cloud

### 2. `colyseus-server/src/index.ts`
**Kas pakeista:**
- Pakeista `server.listen(PORT, '0.0.0.0', ...)` - aiškiai nustatytas bind address
- Pagerinta error handling su `EADDRINUSE` - laukti 5 sekundes prieš exit
- Pridėti debug log'ai

### 3. `src/simple-main.ts`
**Kas pakeista:**
- Lokaliai naudoja default `ws://localhost:2567`
- Production (Netlify) reikalauja `VITE_COLYSEUS_ENDPOINT`

### 4. `src/services/ColyseusService.ts`
**Kas pakeista:**
- Grąžinta į originalią versiją (veikia teisingai)

---

## 📋 Commit Žingsniai

### Step 1: Atidarykite Terminal (PowerShell arba Command Prompt)

**Windows PowerShell:**
```powershell
cd C:\Users\p3p3l\Downloads\pvp03-new
```

**ARBA naudokite GitHub Desktop arba Visual Studio Code Git funkcijas**

---

### Step 2: Patikrinkite, Kokie Failai Pakeisti

**Jei naudojate Git komandų eilutę:**
```bash
git status
```

**Turėtumėte matyti:**
```
modified:   colyseus-server/ecosystem.config.js
modified:   colyseus-server/src/index.ts
modified:   src/simple-main.ts
modified:   src/services/ColyseusService.ts
```

---

### Step 3: Pridėkite Failus į Staging Area

```bash
git add colyseus-server/ecosystem.config.js
git add colyseus-server/src/index.ts
git add src/simple-main.ts
git add src/services/ColyseusService.ts
```

**ARBA pridėkite visus pakeistus failus:**
```bash
git add .
```

---

### Step 4: Commit'inkite Su Aiškiu Message

```bash
git commit -m "Fix EADDRINUSE and local development - prevent multiple PM2 instances and fix localhost endpoint"
```

**ARBA naudokite GitHub Desktop:**
1. Atidarykite GitHub Desktop
2. Matysite visus pakeistus failus
3. Parašykite commit message:
   ```
   Fix EADDRINUSE and local development - prevent multiple PM2 instances and fix localhost endpoint
   ```
4. Spauskite "Commit to main"

---

### Step 5: Push'inkite į GitHub

**Jei naudojate Git komandų eilutę:**
```bash
git push origin main
```

**ARBA naudokite GitHub Desktop:**
1. Spauskite "Push origin"
2. Palaukite, kol kodas bus push'intas

---

## ✅ Po Push - Kas Turėtų Atsitikti

### 1. Colyseus Cloud Automatiškai Deploy'ins

**Po GitHub push:**
- Colyseus Cloud automatiškai aptiks pakeitimus
- Pradės naują deployment
- Palaukite 2-5 min

### 2. Netlify Automatiškai Deploy'ins

**Po GitHub push:**
- Netlify automatiškai aptiks pakeitimus
- Pradės naują build
- Palaukite 2-3 min

---

## 🔍 Patikrinimas Po Deployment

### Colyseus Cloud Logs

**Eikite į Colyseus Cloud Dashboard:**
1. https://cloud.colyseus.io
2. Pasirinkite savo projektą
3. Eikite į "Logs"

**Turėtumėte matyti:**
```
✅ Server running on port 2567
✅ Server listening on 0.0.0.0:2567
```

**NETURĖTUMĖTE MATYTI:**
```
❌ Port 2567 is already in use
Error: listen EADDRINUSE
```

### Netlify Build

**Eikite į Netlify Dashboard:**
1. https://app.netlify.com
2. Pasirinkite savo site
3. Eikite į "Deploys"

**Turėtumėte matyti:**
- ✅ Build successful
- ✅ Site deployed

---

## 📋 Checklist

- [ ] Visi failai paruošti commit'ui
- [ ] Failai pridėti į staging area (`git add`)
- [ ] Commit padarytas su aiškiu message
- [ ] Kodas push'intas į GitHub (`git push`)
- [ ] Colyseus Cloud deployment padarytas (automatiškai)
- [ ] Netlify deployment padarytas (automatiškai)
- [ ] Colyseus Cloud logs nerodo `EADDRINUSE` error'ų
- [ ] Serveris veikia (`/health` endpoint)
- [ ] Frontend veikia (Netlify)

---

## 💡 Svarbiausia

**Commit Message:**
```
Fix EADDRINUSE and local development - prevent multiple PM2 instances and fix localhost endpoint
```

**Kas Bus Išspręsta:**
1. ✅ Colyseus Cloud `EADDRINUSE` problema (PM2 kelis instance'us)
2. ✅ Lokalus veikimas (localhost:2567)
3. ✅ Production veikimas (Netlify + Colyseus Cloud)

---

## 🚨 Jei Kažkas Neveikia

### Problema: Git komandos neveikia

**Sprendimas:**
- Naudokite GitHub Desktop
- ARBA Visual Studio Code Git funkcijas
- ARBA įdiekite Git: https://git-scm.com/download/win

### Problema: Colyseus Cloud vis tiek rodo EADDRINUSE

**Sprendimas:**
1. Patikrinkite, ar kodas buvo push'intas į GitHub
2. Patikrinkite Colyseus Cloud Dashboard → Deployments
3. Patikrinkite, ar paskutinis deployment turi naują versiją
4. Palaukite 5-10 min (deployment gali užtrukti)

### Problema: Netlify build neveikia

**Sprendimas:**
1. Patikrinkite Netlify Dashboard → Deploys
2. Patikrinkite build logs - ar yra error'ų?
3. Patikrinkite, ar `VITE_COLYSEUS_ENDPOINT` yra nustatytas Netlify Environment Variables

---

## 📚 Susiję Failai

- `colyseus-server/ecosystem.config.js` - PM2 konfigūracija
- `colyseus-server/src/index.ts` - Serverio kodas
- `src/simple-main.ts` - Frontend kodas
- `src/services/ColyseusService.ts` - Colyseus service

---

## 🎯 Galutinis Tikslas

Po visų žingsnių:
- ✅ Kodas push'intas į GitHub
- ✅ Colyseus Cloud deployment padarytas
- ✅ Netlify deployment padarytas
- ✅ Colyseus Cloud serveris veikia (nėra EADDRINUSE)
- ✅ Frontend veikia (Netlify)
- ✅ Lokalus veikimas veikia (localhost:7000 + localhost:2567)

