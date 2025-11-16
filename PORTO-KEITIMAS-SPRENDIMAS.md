# 🔧 Porto Keitimo Sprendimas - EADDRINUSE

## ❌ Problema

Jei portas 2567 užimtas, serveris negali start'inti ir crash'ina.

## ✅ Sprendimas: Automatinis Porto Keitimas

### Kas Pakeista:

**Dabar serveris:**
1. Bando start'inti ant `BASE_PORT` (2567 arba `process.env.PORT`)
2. Jei portas užimtas - bando `BASE_PORT + 1` (2568)
3. Jei ir tas užimtas - bando `BASE_PORT + 2` (2569)
4. Ir taip toliau iki `BASE_PORT + 10` (2577)
5. Jei visi portai užimti - exit su error'u

### Kodėl Tai Veikia:

- **Automatinis porto keitimas** - jei pagrindinis portas užimtas, naudoja kitą
- **Išvengia crash loop** - serveris gali start'inti net jei pagrindinis portas užimtas
- **PM2 turės laiko** - tarp bandymų yra 1 sekundės delay

---

## ⚠️ SVARBU: Colyseus Cloud Problema

**PROBLEMA:** Colyseus Cloud nustato PORT per environment variable ir tikisi, kad serveris veiks ant to porto.

**Jei serveris start'ina ant kito porto:**
- ❌ Colyseus Cloud negalės rasti serverio
- ❌ Routing neveiks teisingai
- ❌ Frontend negalės prisijungti

**REKOMENDACIJA:**
- ✅ Naudokite šį sprendimą tik kaip **paskutinį būdą**
- ✅ Geriau išspręsti PM2 konfigūraciją, kad nebandytų start'inti kelis instance'us
- ✅ Jei naudojate porto keitimą - patikrinkite, ar Colyseus Cloud gali route'inti į naują portą

---

## 📋 Kaip Tai Veikia

### Scenario 1: Portas 2567 Laisvas
```
1. Bando start'inti ant 2567
2. ✅ Sėkmingai start'ina
3. Logs: "✅ Server running on port 2567"
```

### Scenario 2: Portas 2567 Užimtas, 2568 Laisvas
```
1. Bando start'inti ant 2567
2. ❌ Port 2567 is already in use
3. 🔄 Trying next port: 2568...
4. ✅ Sėkmingai start'ina ant 2568
5. Logs: "✅ Server running on port 2568"
6. ⚠️  WARNING: Using port 2568 instead of 2567
```

### Scenario 3: Visi Portai Užimti
```
1. Bando start'inti ant 2567-2577
2. ❌ Visi portai užimti
3. ❌ Cannot find available port after trying 10 ports
4. Exit su error'u
```

---

## 🚀 Kada Naudoti

**Naudokite šį sprendimą, jei:**
- ✅ PM2 vis tiek bando start'inti kelis instance'us
- ✅ `kill_timeout` ir `restart_delay` nepadėjo
- ✅ Reikia greitai išspręsti problemą

**NENAUDOKITE, jei:**
- ❌ Colyseus Cloud nustato PORT per environment variable
- ❌ Negalite keisti Colyseus Cloud routing'ą
- ❌ Frontend negali prisijungti prie kito porto

---

## 💡 Alternatyvus Sprendimas

**Geriau būtų:**
1. Patikrinti PM2 konfigūraciją
2. Užtikrinti, kad `unique: true` veikia
3. Padidinti `kill_timeout` ir `restart_delay`
4. Patikrinti, ar nėra kelių PM2 procesų

**Bet jei vis tiek neveikia - šis sprendimas padės!**

