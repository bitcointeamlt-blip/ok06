# 🔍 Porto Logika - Paaiškinimas

## ❓ Klausimas: Kodėl Portas 2567 Užimtas?

### Lokalus Serveris vs Colyseus Cloud

**SVARBU:** Lokalus serveris ir Colyseus Cloud yra **SKIRTINGI SERVERIAI**!

---

## 🖥️ Lokalus Serveris (Jūsų Kompiuteris)

**Kur veikia:**
- `localhost:2567` - jūsų kompiuteryje
- Portas 2567 yra užimtas **JŪSŲ KOMPIUTERYJE**

**Kas naudoja:**
- Jūsų lokalus Colyseus serveris (`npm run dev`)
- Frontend prisijungia prie `ws://localhost:2567`

**Ar tai problema Colyseus Cloud'e?**
- ❌ **NE!** Lokalus serveris neturi jokio ryšio su Colyseus Cloud
- Colyseus Cloud yra **SKIRTINGA MAŠINA** (45.76.95.81)
- Lokalus portas **NĖRA** tas pats kaip Colyseus Cloud portas

---

## ☁️ Colyseus Cloud Serveris

**Kur veikia:**
- `de-fra-c81e866a.colyseus.cloud` - Colyseus Cloud serveris (45.76.95.81)
- Portas 2567 yra užimtas **COLYSEUS CLOUD SERVERYJE**

**Kas naudoja:**
- Colyseus Cloud serveris (PM2 valdomas)
- Frontend prisijungia prie `wss://de-fra-c81e866a.colyseus.cloud`

**Problema:**
- PM2 bando start'inti **KELIS INSTANCE'US** TO PATIES Colyseus Cloud serverio
- Kiekvienas instance bando naudoti **TĄ PATĮ PORTĄ 2567** Colyseus Cloud serveryje
- Tai sukuria `EADDRINUSE` error'ą **COLYSEUS CLOUD SERVERYJE**

---

## 🔍 Kodėl EADDRINUSE Colyseus Cloud'e?

### Problema NĖRA su Lokal Serveriu!

**Kas vyksta Colyseus Cloud'e:**

1. **PM2 bando start'inti instance'ą #1:**
   - Instance #1 bando naudoti portą 2567
   - ✅ Sėkmingai start'ina

2. **PM2 bando start'inti instance'ą #2 (klaida):**
   - Instance #2 bando naudoti portą 2567
   - ❌ Portas jau užimtas (instance #1 jį naudoja)
   - `EADDRINUSE: address already in use :::2567`

3. **PM2 restart'ina:**
   - Uždarė instance #1
   - Bando start'inti naują instance'ą
   - Bet instance #1 dar neužsidarė greitai
   - Vėl `EADDRINUSE`

---

## ✅ Išvada

### Lokalus Serveris:
- ✅ Veikia lokaliai (`localhost:2567`)
- ✅ Portas 2567 užimtas **JŪSŲ KOMPIUTERYJE**
- ✅ **NĖRA PROBLEMA** Colyseus Cloud'e

### Colyseus Cloud Serveris:
- ❌ PM2 bando start'inti kelis instance'us **TO PATIES SERVERIO**
- ❌ Kiekvienas instance bando naudoti portą 2567 **COLYSEUS CLOUD SERVERYJE**
- ❌ Tai sukuria `EADDRINUSE` **COLYSEUS CLOUD SERVERYJE**

---

## 🎯 Pagrindinė Problema

**Problema NĖRA:**
- ❌ Lokalus serveris užima portą Colyseus Cloud'e
- ❌ Portų konfliktas tarp lokalaus ir Colyseus Cloud

**Problema YRA:**
- ✅ PM2 Colyseus Cloud'e bando start'inti kelis instance'us
- ✅ Kiekvienas instance bando naudoti tą patį portą 2567
- ✅ Tai sukuria `EADDRINUSE` **TO PATIES SERVERIO VIDUJE**

---

## 💡 Sprendimas

**Reikia:**
- ✅ `instances: 1` - tik vienas instance'as
- ✅ `unique: true` - garantuoja vieną instance'ą
- ✅ `kill_timeout: 30000` - duoda laiko užsidaryti senam procesui
- ✅ `restart_delay: 20000` - laukia prieš restart'inti

**ARBA:**
- ✅ **REBOOT INSTANCE** - uždarė visus procesus ir start'ina naują

---

## 📋 Santrauka

| Aspektas | Lokalus Serveris | Colyseus Cloud |
|----------|------------------|----------------|
| **Kur veikia** | Jūsų kompiuteris | Colyseus Cloud serveris (45.76.95.81) |
| **Portas** | 2567 (lokalus) | 2567 (Colyseus Cloud) |
| **Konfliktas?** | ❌ NĖRA | ✅ YRA (PM2 bando kelis instance'us) |
| **Problema** | NĖRA | PM2 bando start'inti kelis instance'us |

**Išvada:** Lokalus serveris **NĖRA** problema. Problema yra su PM2 Colyseus Cloud'e, kuris bando start'inti kelis instance'us.

