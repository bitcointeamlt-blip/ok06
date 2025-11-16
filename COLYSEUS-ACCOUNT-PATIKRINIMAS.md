# 🔍 Kaip Patikrinti, Ant Kokio Colyseus Cloud Account'o Veikia

## 📋 Dabartinė Situacija

**Lokalus serveris (localhost:7000):**
- Veikia lokaliai ant jūsų kompiuterio
- Backend: `localhost:2567`
- Frontend: `localhost:7000`
- **Nepriklauso nuo Colyseus Cloud account'o**

**Online deployment:**
- Frontend: `https://thriving-mandazi-d23051.netlify.app`
- Backend: `https://de-fra-c81e866a.colyseus.cloud`
- **Priklauso nuo Colyseus Cloud account'o**

---

## 🔍 Kaip Patikrinti, Ant Kokio Account'o Veikia

### Būdas 1: Patikrinkite Colyseus Cloud Dashboard

1. **Eikite į:** https://cloud.colyseus.io
2. **Prisijunkite** su abiem account'ais:
   - `p3p3l3` account'as
   - `g3nka` account'as
3. **Patikrinkite, kuris account'as turi:**
   - Endpoint: `https://de-fra-c81e866a.colyseus.cloud`
   - Projektą: `ok06` arba `dot-clicker` arba panašų pavadinimą

### Būdas 2: Patikrinkite GitHub Repository

1. **Eikite į:** https://github.com
2. **Patikrinkite repository `ok06`:**
   - Koks account'as turi šį repository?
   - Ar yra susietas su Colyseus Cloud?

### Būdas 3: Patikrinkite Colyseus Cloud Application Settings

1. **Eikite į:** https://cloud.colyseus.io
2. **Prisijunkite su `g3nka` account'u:**
   - Patikrinkite, ar yra aplikacija su endpoint'u `de-fra-c81e866a`
   - Patikrinkite, ar yra susietas su GitHub repository `ok06`
3. **Prisijunkite su `p3p3l3` account'u:**
   - Patikrinkite, ar yra aplikacija su endpoint'u `de-fra-c81e866a`
   - Patikrinkite, ar yra susietas su GitHub repository `ok06`

---

## 💡 Pagal Endpoint'ą

**Endpoint:** `https://de-fra-c81e866a.colyseus.cloud`

- `de-fra` = region (Germany - Frankfurt)
- `c81e866a` = unikalus aplikacijos ID

**Šis endpoint priklauso tam account'ui, kuris sukūrė aplikaciją Colyseus Cloud.**

---

## 🎯 Rekomendacija

**Jei `g3nka` account'as buvo sukurtas prieš keletą dienų:**
- Tikėtina, kad tai yra `g3nka` account'as
- Patikrinkite `g3nka` account'ą pirmiausia

**Jei `p3p3l3` account'as yra naujas:**
- Tikėtina, kad tai yra `g3nka` account'as
- Bet patikrinkite abu

---

## ✅ Kaip Patikrinti Greitai

1. **Atidarykite:** https://cloud.colyseus.io
2. **Prisijunkite su `g3nka` account'u**
3. **Patikrinkite, ar yra aplikacija su endpoint'u `de-fra-c81e866a`**
4. **Jei yra** → tai `g3nka` account'as
5. **Jei nėra** → patikrinkite `p3p3l3` account'ą

---

## 📋 Checklist

- [ ] Prisijungiau su `g3nka` account'u
- [ ] Patikrinau, ar yra aplikacija su endpoint'u `de-fra-c81e866a`
- [ ] Patikrinau, ar yra susietas su GitHub repository `ok06`
- [ ] Jei nėra `g3nka` - patikrinau `p3p3l3` account'ą

---

**Ar radote, ant kokio account'o veikia?**

