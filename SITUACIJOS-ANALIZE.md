# 📊 Situacijos Analizė - Lokalus vs Colyseus Cloud

## ✅ Lokalus Veikimas (localhost:7000 + localhost:2567)

### Kas Veikia:
- ✅ Frontend veikia lokaliai ant `localhost:7000`
- ✅ Colyseus serveris veikia lokaliai ant `localhost:2567` (matau TCP connections)
- ✅ Frontend prisijungia prie lokalaus serverio: `ws://localhost:2567`
- ✅ Nėra portų konfliktų lokaliai

### Kodėl Veikia:
1. **Vienas serverio instance'as:** Lokalus serveris veikia vieną instance'ą
2. **Nėra PM2 konfliktų:** Lokalus serveris nenaudoja PM2
3. **Portas 2567 laisvas:** Nėra kitų procesų, kurie naudoja portą 2567

---

## ❌ Colyseus Cloud Problema (de-fra-c81e866a.colyseus.cloud)

### Kas Neveikia:
- ❌ PM2 bando start'inti kelis serverio instance'us vienu metu
- ❌ Kiekvienas instance bando naudoti tą patį portą 2567
- ❌ Tai sukuria `EADDRINUSE: address already in use :::2567`
- ❌ Serveris crash'ina ir PM2 bando restart'inti, bet problema kartojasi

### Kodėl Neveikia:
1. **PM2 konfigūracija:** PM2 bando start'inti kelis instance'us (`colyseus-server:1` ir `colyseus-server:2`)
2. **Portų konfliktas:** Abu instance'ai bando naudoti tą patį portą 2567
3. **Restart ciklas:** Serveris crash'ina → PM2 restart'ina → crash'ina → restart'ina...

---

## 🔍 Ryšys Tarp Lokalaus ir Colyseus Cloud

### Kodėl Lokalus Veikia, Bet Colyseus Cloud Ne:

| Aspektas | Lokalus | Colyseus Cloud |
|----------|---------|----------------|
| **Serverio instance'ų skaičius** | 1 (vienas) | 2+ (kelis) |
| **Process manager** | Nėra (tiesiogiai `npm run dev`) | PM2 (automatinių restart'ų) |
| **Portų konfliktas** | Nėra | Yra (`EADDRINUSE`) |
| **Restart ciklas** | Nėra | Yra (crash → restart → crash...) |

### Pagrindinė Priežastis:

**Lokalus:**
- Serveris start'ina vieną kartą
- Nėra PM2, kuris bando start'inti kelis instance'us
- Portas 2567 yra laisvas

**Colyseus Cloud:**
- PM2 bando start'inti kelis instance'us vienu metu
- Kiekvienas instance bando naudoti tą patį portą 2567
- Tai sukuria portų konfliktą

---

## ✅ Mūsų Fix'ai

### 1. `ecosystem.config.js` - PM2 Konfigūracija

**Kas pridėta:**
- `kill_timeout: 5000` - laukti 5 sekundes prieš uždarant procesą
- `restart_delay: 4000` - laukti 4 sekundes prieš restart'inti
- `min_uptime: '10s'` - minimalus veikimo laikas prieš restart'inti
- `max_restarts: 5` - maksimalus restart'ų skaičius

**Kodėl tai veikia:**
- PM2 lauks, kol senas procesas užsidarys prieš start'inti naują
- Restart delay padeda išvengti greitų restart'ų ciklų

### 2. `colyseus-server/src/index.ts` - Serverio Kodas

**Kas pridėta:**
- `server.listen(PORT, '0.0.0.0', ...)` - aiškiai nustatytas bind address
- Geriau error handling su `EADDRINUSE` - laukti 5 sekundes prieš exit

**Kodėl tai veikia:**
- `0.0.0.0` bind address garantuoja, kad serveris klauso visų interface'ų
- 5 sekundžių laukimas padeda PM2 užsidaryti senam procesui

---

## 🎯 Išvada

### Lokalus Veikimas:
- ✅ Veikia gerai - nėra problemų
- ✅ Frontend + serveris veikia lokaliai
- ✅ Nėra portų konfliktų

### Colyseus Cloud Problema:
- ❌ PM2 bando start'inti kelis instance'us
- ❌ Portų konfliktas (`EADDRINUSE`)
- ✅ Mūsų fix'ai turėtų išspręsti problemą

### Ryšys:
- **Lokalus:** Nenaudoja PM2 → nėra problemų
- **Colyseus Cloud:** Naudoja PM2 → problema su keliais instance'ais
- **Sprendimas:** Pataisyti PM2 konfigūraciją, kad būtų tik vienas instance'as

---

## 📋 Kitas Žingsnis

1. **Commit → Push į GitHub:**
   ```bash
   git add colyseus-server/ecosystem.config.js
   git add colyseus-server/src/index.ts
   git commit -m "Fix EADDRINUSE - prevent multiple PM2 instances"
   git push origin main
   ```

2. **Colyseus Cloud Automatiškai Deploy'ins:**
   - Palaukite 2-5 min
   - Patikrinkite logs - turėtų veikti!

3. **Patikrinkite:**
   - Colyseus Cloud logs nerodo `EADDRINUSE` error'ų
   - Serveris veikia (`/health` endpoint)
   - Frontend gali prisijungti prie Colyseus Cloud

---

## 💡 Svarbiausia

**Lokalus veikimas yra gerai** - tai reiškia, kad:
- ✅ Kodas veikia teisingai
- ✅ Serveris veikia teisingai
- ✅ Frontend veikia teisingai

**Colyseus Cloud problema yra su PM2** - tai reiškia, kad:
- ❌ PM2 konfigūracija neteisinga
- ✅ Mūsų fix'ai turėtų išspręsti problemą

**Ryšys:** Lokalus nenaudoja PM2, todėl nėra problemų. Colyseus Cloud naudoja PM2, todėl reikia pataisyti PM2 konfigūraciją.

