# 🔍 Patikrinkite Serverio Veikimą

## ❌ Problema

- ✅ Deployment sėkmingas ("✓ Deployed")
- ❌ Serveris rodo "Service Unavailable"
- ❌ Nerodo log'ų
- ✅ Lokalus serveris veikia (localhost:7000)

---

## 🔍 Ką Patikrinti Dabar

### 1. Patikrinkite Health Endpoint

Atidarykite naršyklėje:
```
https://de-fra-c81e866a.colyseus.cloud/health
```

**Jei matote `{"status":"ok"}`:**
- ✅ Serveris VEIKIA
- Problema gali būti CORS arba routing

**Jei matote "Service Unavailable":**
- ❌ Serveris NEVEIKIA
- Serveris gali crash'inti po start'o

---

### 2. Patikrinkite Logs Colyseus Cloud'e

1. **Colyseus Cloud** → **Endpoints** tab
2. Spustelėkite **"LOGS"** mygtuką
3. **Išjunkite "Show only errors" toggle** (OFF)
4. **Refresh'inkite puslapį** (F5)
5. Scroll žemyn ir patikrinkite:
   - Ar yra "✅ Colyseus server is running on port 2567"?
   - Ar yra crash error'ų po start'o?
   - Ar yra uncaught exception?

---

### 3. Patikrinkite Instance Status

1. **Colyseus Cloud** → **Endpoints** tab
2. Patikrinkite instance status:
   - "✓ Deployed" - deployment sėkmingas
   - Bet ar serveris tikrai veikia?

---

## 💡 Galimos Priežastys

### 1. Serveris Crash'ina Po Start'o

**Simptomai:**
- Serveris start'ino (log'ai rodo sėkmingą start'ą)
- Bet dabar neatsako į request'us
- "Service Unavailable" error

**Priežastis:**
- Uncaught exception po start'o
- Unhandled rejection po start'o
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
- PM2 logs buffered
- Application logs delayed (10-30 sekundžių)
- Dashboard cache'as (reikia refresh'inti)

---

## ✅ Sprendimas

### Step 1: Patikrinkite Health Endpoint

Atidarykite:
```
https://de-fra-c81e866a.colyseus.cloud/health
```

**Ką matote?**
- `{"status":"ok"}` - serveris veikia ✅
- "Service Unavailable" - serveris neveikia ❌

---

### Step 2: Patikrinkite Logs

1. **Colyseus Cloud** → **Endpoints** → **LOGS**
2. **Išjunkite "Show only errors" toggle**
3. **Refresh'inkite puslapį** (F5)
4. Scroll žemyn - ieškokite:
   - `✅ Colyseus server is running on port 2567`
   - Crash error'ų
   - Uncaught exception

---

### Step 3: Reboot Instance

Jei serveris neveikia:

1. **Colyseus Cloud** → **Endpoints** tab
2. Ieškokite **"REBOOT"** arba **"RESTART"** mygtuko
3. Spustelėkite ir palaukite 2-3 minučių
4. Patikrinkite logs

---

## 🎯 Kitas Žingsnis

**Dabar patikrinkite:**
1. Health endpoint - ar serveris veikia?
2. Logs - ar yra crash error'ų?
3. Jei serveris neveikia - reboot instance

**Pasakykite, ką matote health endpoint'e ir log'uose!**

