# 🔧 Ką Pakeičiau Dėl EADDRINUSE Problemos

## ❌ Problema Buvo

Colyseus Cloud logs rodė:
```
Error: listen EADDRINUSE: address already in use :::2567
Port 2567 is already in use
```

**Priežastis:** PM2 bando start'inti kelis serverio instance'us vienu metu, arba senas procesas neužsidaro greitai.

---

## ✅ Ką Pakeičiau

### 1. `colyseus-server/src/index.ts` - Supaprastinta Logika

**Prieš (sudėtinga su `waitForPort()`):**
```typescript
// Sudėtinga funkcija su port check ir retry
function waitForPort(port, maxRetries, delay) {
  // ... sudėtinga logika su testServer ...
}

waitForPort(PORT, 10, 1000).then((available) => {
  if (available) {
    server.listen(PORT, '0.0.0.0', () => {
      // ...
    });
  }
});
```

**Dabar (supaprastinta):**
```typescript
// Error handler registruojamas VIENĄ KARTĄ prieš server.listen()
server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.error('💡 Waiting 5 seconds before exit to allow PM2 cleanup...');
    setTimeout(() => {
      process.exit(1); // Exit - PM2 restart'ins su delay
    }, 5000);
  }
});

// server.listen() kviečiamas TIK VIENĄ KARTĄ
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

**Kas pakeista:**
- ✅ Pašalinta `waitForPort()` funkcija (sukėlė race condition'ą)
- ✅ Pašalinta `createNetServer` import'as (nebereikalingas)
- ✅ Supaprastinta logika - `server.listen()` kviečiamas tik vieną kartą
- ✅ `server.on('error')` registruojamas tik vieną kartą prieš `server.listen()`
- ✅ Jei `EADDRINUSE` - laukia 5s ir exit, PM2 restart'ins su delay

---

### 2. `colyseus-server/ecosystem.config.js` - Pagerinta PM2 Konfigūracija

**Kas pakeista:**
```javascript
{
  instances: 1, // CRITICAL: Tik vienas instance
  exec_mode: 'fork', // CRITICAL: Fork mode (ne cluster)
  kill_timeout: 20000, // 20 sekundžių laukti, kol senas procesas užsidarys
  restart_delay: 15000, // 15 sekundžių laukti prieš restart'inti
  min_uptime: '60s', // Serveris turi veikti 60s prieš būti laikomas stabilus
  max_restarts: 5, // Leidžia 5 restart'us
  unique: true, // CRITICAL: Tik vienas instance su šiuo vardu
  force: false, // Neforce'ina start'ą, jei jau veikia
  stop_exit_codes: [0, 1] // Priima abu success ir error exit codes
}
```

**Kodėl tai veikia:**
- `kill_timeout: 20000` - duoda 20s laiko užsidaryti senam procesui
- `restart_delay: 15000` - laukia 15s prieš restart'inti (duoda laiko užsidaryti portui)
- `unique: true` - garantuoja, kad bus tik vienas instance'as
- `force: false` - neleidžia force start'inti, jei jau veikia

---

## 🎯 Kaip Tai Veikia Dabar

1. **Serveris start'ina:**
   - `server.listen(PORT, '0.0.0.0', ...)` kviečiamas

2. **Jei portas užimtas:**
   - `server.on('error')` handler'is gauna `EADDRINUSE` error'ą
   - Laukia 5 sekundes
   - Exit su `process.exit(1)`

3. **PM2 restart'ina:**
   - PM2 mato, kad procesas exit'ino su code 1
   - Laukia `restart_delay: 15000` (15 sekundžių)
   - Start'ina naują instance'ą

4. **Jei vis dar užimtas:**
   - Procesas vėl exit'ina
   - PM2 vėl laukia 15s
   - Kartojasi iki `max_restarts: 5`

---

## 💡 Kodėl Tai Turėtų Veikti

1. **Supaprastinta logika** - nėra sudėtingų port check'ų, kurie gali sukelti race condition'ą
2. **PM2 valdo retry** - su teisingais timeout'ais (`kill_timeout`, `restart_delay`)
3. **Nėra race condition'ų** - `server.listen()` kviečiamas tik vieną kartą
4. **Teisingi timeout'ai** - duoda laiko užsidaryti senam procesui

---

## 📋 Pakeisti Failai

1. ✅ `colyseus-server/src/index.ts`
   - Pašalinta `waitForPort()` funkcija
   - Supaprastinta error handling logika
   - `server.listen()` kviečiamas tik vieną kartą

2. ✅ `colyseus-server/ecosystem.config.js`
   - Padidinti timeout'ai (`kill_timeout: 20000`, `restart_delay: 15000`)
   - `unique: true` - garantuoja vieną instance'ą
   - `force: false` - neforce'ina start'ą

---

## ✅ Galutinis Rezultatas

**Kodas dabar:**
- ✅ Supaprastintas ir aiškus
- ✅ Nėra race condition'ų
- ✅ PM2 valdo retry su teisingais timeout'ais
- ✅ Nėra dublikatų ar konfliktų

**Turėtų išspręsti `EADDRINUSE` problemą!**

