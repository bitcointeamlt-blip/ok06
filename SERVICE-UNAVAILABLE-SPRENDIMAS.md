# 🔧 Service Unavailable - Sprendimas

## ❌ Problema

- ✅ Deployment sėkmingas ("✓ Deployed")
- ❌ Serveris rodo "Service Unavailable"
- ❌ Nerodo log'ų Colyseus Cloud'e
- ✅ Lokalus serveris veikia (localhost:7000)

---

## 🔍 Galimos Priežastys

### 1. Serveris Crash'ina Po Start'o

**Simptomai:**
- Serveris start'ino (16:01:39 log'ai rodo sėkmingą start'ą)
- Bet dabar neatsako į request'us
- "Service Unavailable" error

**Priežastis:**
- Serveris gali crash'inti po start'o
- Uncaught exception arba unhandled rejection
- Process.exit() iškviečiamas

---

### 2. Serveris Neatsako į HTTP Request'us

**Simptomai:**
- Serveris start'ino
- Bet `/health` endpoint neatsako
- "Service Unavailable" error

**Priežastis:**
- `gameServer.listen()` gali neveikti teisingai
- HTTP server neatsidaro porto
- Colyseus Cloud routing problema

---

### 3. Log'ų Nerodymas

**Simptomai:**
- Nerodo log'ų Colyseus Cloud'e
- Bet deployment sėkmingas

**Priežastis:**
- PM2 logs gali būti buffered
- Application logs gali būti delayed
- Dashboard cache'as

---

## ✅ Sprendimas

### Step 1: Patikrinkite Health Endpoint

Atidarykite naršyklėje:
```
https://de-fra-c81e866a.colyseus.cloud/health
```

**Jei matote `{"status":"ok"}`:**
- ✅ Serveris veikia
- Problema gali būti CORS arba routing

**Jei matote "Service Unavailable":**
- ❌ Serveris neveikia
- Reikia patikrinti logs

---

### Step 2: Patikrinkite Logs Colyseus Cloud'e

1. **Colyseus Cloud** → **Endpoints** tab
2. Spustelėkite **"LOGS"** mygtuką (šalia instance)
3. **Išjunkite "Show only errors" toggle** (OFF)
4. Scroll žemyn ir patikrinkite:
   - Ar yra crash error'ų?
   - Ar yra "Colyseus server is running" pranešimas?
   - Ar yra uncaught exception?

---

### Step 3: Patikrinkite, Ar Serveris Vis Dar Veikia

Pagal anksčiau matytus log'us:
- Serveris start'ino **16:01:39**
- Log'ai rodė sėkmingą start'ą

**Bet dabar:**
- Serveris neatsako į request'us
- Gali būti, kad serveris crash'ino po start'o

**Patikrinkite:**
- Ar yra naujų log'ų po 16:01:39?
- Ar yra crash error'ų?
- Ar yra uncaught exception?

---

### Step 4: Reboot Instance

Jei serveris neveikia:

1. **Colyseus Cloud** → **Endpoints** tab
2. Ieškokite **"REBOOT"** arba **"RESTART"** mygtuko
3. Spustelėkite ir palaukite 2-3 minučių
4. Patikrinkite logs

---

## 💡 Galimas Sprendimas: Serveris Crash'ina

Jei serveris crash'ina po start'o, problema gali būti:

1. **Uncaught exception** - klaida, kuri nebuvo catch'inta
2. **Unhandled rejection** - Promise rejection, kuris nebuvo catch'intas
3. **Process.exit()** - serveris iškviečia process.exit() po start'o

**Patikrinkite kodą:**
- Ar yra try-catch blokai?
- Ar yra error handling?
- Ar yra process.exit() kviečiamas?

---

## 🚀 Kitas Žingsnis

1. **Patikrinkite health endpoint** - ar serveris veikia?
2. **Patikrinkite logs** - ar yra crash error'ų?
3. **Jei serveris neveikia** - reboot instance
4. **Jei vis dar neveikia** - patikrinkite kodą

**Dabar patikrinkite health endpoint ir logs!**

