# ✅ OK06 PROJEKTO KONFIGŪRACIJA IR DEPLOYMENT

## 📋 JŪSŲ KONFIGŪRACIJA

### ✅ Kas Jau Yra:

1. **GitHub Projektas:** `ok06`
2. **Colyseus Server:** 
   - Endpoint: `https://de-fra-c81e866a.colyseus.cloud`
   - Status: ✅ Deployed
   - Application: `dot`
3. **Netlify Site:** 
   - URL: `https://thriving-mandazi-d23051.netlify.app/`
   - Projektas: `ok06` (GitHub)

---

## 🔍 PATIKRINIMAS - AR VISKAS SUDERINTA?

### ✅ STEP 1: Colyseus Server Status

**Endpoint:** `https://de-fra-c81e866a.colyseus.cloud`

**Patikrinimas:**
1. Atidarykite naršyklėje:
   ```
   https://de-fra-c81e866a.colyseus.cloud/health
   ```

**Turėtumėte matyti:**
```json
{"status":"ok"}
```

✅ **Jei matote `{"status":"ok"}`:** Serveris veikia!

---

### ⚠️ STEP 2: Netlify Environment Variables (SVARBIAUSIA!)

**SVARBU:** Netlify turi turėti `VITE_COLYSEUS_ENDPOINT` su teisingu endpoint!

**Patikrinimas:**
1. Eikite į: **https://app.netlify.com**
2. Prisijunkite
3. Pasirinkite site: **`thriving-mandazi-d23051`**
4. **Site settings** → **Environment variables**

**Patikrinkite:**
- Ar yra `VITE_COLYSEUS_ENDPOINT`?
- Ar value = `https://de-fra-c81e866a.colyseus.cloud`?

**Jei NĖRA arba neteisingas:**

#### Pridėkite arba Pakeiskite:

1. **Netlify Dashboard** → **Site settings** → **Environment variables**
2. **Jei yra `VITE_COLYSEUS_ENDPOINT`:**
   - Spustelėkite **"Edit"**
   - Pakeiskite value į: `https://de-fra-c81e866a.colyseus.cloud`
   - **Save**

3. **Jei nėra `VITE_COLYSEUS_ENDPOINT`:**
   - Spustelėkite **"Add a variable"**
   - **Key:** `VITE_COLYSEUS_ENDPOINT`
   - **Value:** `https://de-fra-c81e866a.colyseus.cloud`
   - **Scope:** All scopes (arba Production)
   - **Save**

**SVARBU:** 
- Key turi būti tiksliai `VITE_COLYSEUS_ENDPOINT` (be tarpų!)
- Value turi būti `https://de-fra-c81e866a.colyseus.cloud` (naujas endpoint!)

---

### ✅ STEP 3: Redeploy Frontend

Po environment variable pridėjimo arba pakeitimo:

1. **Netlify Dashboard** → **Deploys**
2. **Trigger deploy** → **"Clear cache and deploy site"**
3. Palaukite build'o (2-5 min)

**Patikrinkite Build Logs:**
- Turėtumėte matyti: `VITE_COLYSEUS_ENDPOINT` (masked)
- Build turėtų būti sėkmingas

---

### ✅ STEP 4: Testuokite Žaidimą

1. **Atidarykite žaidimą:**
   ```
   https://thriving-mandazi-d23051.netlify.app/
   ```

2. **Atidarykite Browser Console (F12)**

3. **Patikrinkite Console Logs:**

**Turėtumėte matyti:**
```
🔍 Environment check: { hasEnv: true, endpoint: "https://de-fra-c81e866a..." }
🔵 Colyseus endpoint found: https://de-fra-c81e866a...
✅ Colyseus client initialized: wss://de-fra-c81e866a...
```

**Jei matote:**
```
⚠️ VITE_COLYSEUS_ENDPOINT not set, using default localhost
```
→ Environment variable nėra nustatytas Netlify! Grįžkite į STEP 2.

4. **Testuokite PvP:**
   - Prisijunkite su Ronin Wallet
   - Pasirinkite "PvP Online"
   - Turėtumėte prisijungti prie Colyseus room

---

## 📋 CHECKLIST - AR VISKAS SUDERINTA?

### Colyseus Server:
- [ ] Serveris veikia (`/health` endpoint)
- [ ] Endpoint: `https://de-fra-c81e866a.colyseus.cloud`
- [ ] Status: Deployed (žalia varnelė)

### Netlify:
- [ ] Site: `https://thriving-mandazi-d23051.netlify.app/`
- [ ] `VITE_COLYSEUS_ENDPOINT` pridėtas į Environment Variables
- [ ] Value = `https://de-fra-c81e866a.colyseus.cloud`
- [ ] Frontend redeploy'intas po environment variable pakeitimo
- [ ] Build logs rodo environment variable

### Testavimas:
- [ ] Žaidimas atsidaro Netlify URL
- [ ] Browser console rodo sėkmingą prisijungimą
- [ ] Colyseus client inicializuojasi
- [ ] PvP prisijungimas veikia

---

## 🔧 TROUBLESHOOTING

### Problema: "Failed to connect to Colyseus server"

**Patikrinkite:**
1. ✅ Ar Colyseus server veikia? (`/health` endpoint)
2. ✅ Ar `VITE_COLYSEUS_ENDPOINT` nustatytas Netlify?
3. ✅ Ar endpoint formatas teisingas? (`https://de-fra-c81e866a.colyseus.cloud`)

**Sprendimas:**
1. Patikrinkite Colyseus Cloud → Deployments → Status
2. Patikrinkite Netlify → Environment Variables
3. Redeploy frontend

---

### Problema: "Colyseus not configured"

**Priežastis:** `VITE_COLYSEUS_ENDPOINT` nėra nustatytas Netlify

**Sprendimas:**
1. Netlify → Site Settings → Environment Variables
2. Pridėkite `VITE_COLYSEUS_ENDPOINT` su value `https://de-fra-c81e866a.colyseus.cloud`
3. Redeploy

---

### Problema: Build logs nerodo environment variable

**Priežastis:** Netlify cache arba neteisingas variable name

**Sprendimas:**
1. Patikrinkite, ar variable name tiksliai `VITE_COLYSEUS_ENDPOINT`
2. Išvalykite cache: "Clear cache and deploy site"
3. Redeploy

---

## 🎯 SVARBIAUSIA INFORMACIJA

### Jūsų Endpoint'ai:

- **Colyseus Server:** `https://de-fra-c81e866a.colyseus.cloud`
- **Netlify Site:** `https://thriving-mandazi-d23051.netlify.app/`
- **GitHub Projektas:** `ok06`

### Reikalingas Environment Variable:

**Netlify → Environment Variables:**
- **Key:** `VITE_COLYSEUS_ENDPOINT`
- **Value:** `https://de-fra-c81e866a.colyseus.cloud`

---

## 🚀 AUTOMATINIS DEPLOYMENT

### GitHub → Netlify (Automatinis)

Jei Netlify susietas su GitHub `ok06` projektu:
- Kiekvienas push į `main` branch automatiškai deploy'ins
- Netlify naudoja environment variables iš dashboard

### GitHub → Colyseus Cloud (Automatinis)

Jei Colyseus Cloud susietas su GitHub `ok06` projektu:
- Kiekvienas push į `main` branch automatiškai deploy'ins
- Colyseus Cloud naudoja build settings iš dashboard

---

## ✅ SĖKMĖS KRITERIJAI

Žaidimas veikia online, jei:

1. ✅ Colyseus server veikia (`/health` endpoint)
2. ✅ `VITE_COLYSEUS_ENDPOINT` nustatytas Netlify su teisingu endpoint
3. ✅ Frontend redeploy'intas
4. ✅ Browser console rodo sėkmingą prisijungimą
5. ✅ PvP prisijungimas veikia

---

## 🎉 GALUTINIS REZULTATAS

Po sėkmingo suderinimo:

- **Frontend:** `https://thriving-mandazi-d23051.netlify.app/`
- **Backend:** `https://de-fra-c81e866a.colyseus.cloud`
- **Žaidimas:** Veikia online, multiplayer PvP funkcionalumas veikia

**Sveikiname! Žaidimas dabar veikia online! 🎉**

