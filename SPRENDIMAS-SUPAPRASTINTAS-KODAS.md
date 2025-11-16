# 🔧 Supaprastintas Kodas - Grįžimas Prie Veikiančios Versijos

## ❌ Problema

Kodas tapo per sudėtingas:
- Per daug port check'ų
- Per daug CORS handler'ių
- Per daug debug log'ų
- PM2 config per sudėtingas
- Build output vis dar naudoja seną kodą

## ✅ Sprendimas: Supaprastintas Kodas

### Kas Pakeista:

1. **`colyseus-server/src/index.ts` - SUPAPRASTINTAS**
   - Pašalinti visi sudėtingi port check'ai
   - Pašalinti visi debug log'ai
   - Pašalinti visi sudėtingi CORS handler'iai
   - Grįžta prie paprasčiausio sprendimo: `server.listen()` su `WebSocketTransport({ server: server })`
   - Tik vienas CORS middleware su `cors` package
   - Tik vienas `matchMaker.controller.getCorsHeaders` override

2. **`colyseus-server/ecosystem.config.js` - SUPAPRASTINTAS**
   - Palikti tik svarbiausi parametrai
   - `instances: 1` - tik vienas instance'as
   - `exec_mode: 'fork'` - fork mode
   - `unique: true` - garantuoja vieną instance'ą

### Kodas Dabar:

```typescript
// Paprastas Express app su CORS
app.use(cors({ origin: true, credentials: true, ... }));

// HTTP server
const server = createServer(app);

// Colyseus server su WebSocketTransport
const gameServer = new Server({
  transport: new WebSocketTransport({ server: server }),
});

// CORS override
matchMaker.controller.getCorsHeaders = function(req: any) {
  return { 'Access-Control-Allow-Origin': req.headers.origin || '*', ... };
};

// Start server
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

**Kas svarbu:**
- ✅ `server.listen()` - ne `gameServer.listen()`
- ✅ `WebSocketTransport({ server: server })` - perduodame HTTP serverį
- ✅ Paprastas CORS middleware
- ✅ Paprastas error handling

---

## 🚀 Commit ir Push

```bash
git add colyseus-server/src/index.ts
git add colyseus-server/ecosystem.config.js
git commit -m "Simplify code - remove complex port checks and return to working version"
git push origin main
```

---

## 💡 Kodėl Tai Turėtų Veikti

1. **Paprastas kodas = mažiau klaidų**
   - Nėra sudėtingų port check'ų
   - Nėra sudėtingų CORS handler'ių
   - Nėra debug log'ų, kurie gali sukelti problemų

2. **Teisingas Colyseus setup**
   - `server.listen()` su `WebSocketTransport({ server: server })` yra teisingas būdas
   - Colyseus automatiškai valdo WebSocket connections

3. **Paprastas PM2 config**
   - Tik svarbiausi parametrai
   - `instances: 1` garantuoja vieną instance'ą
   - `unique: true` išvengia duplicate instance'ų

---

## 🔍 Patikrinimas

Po deployment patikrinkite Colyseus Cloud logs:
- Turėtumėte matyti: `✅ Server running on port 2567`
- NETURĖTUMĖTE MATYTI: `❌ Port 2567 is already in use`
- NETURĖTUMĖTE MATYTI: `ERR_SERVER_ALREADY_LISTEN`
- NETURĖTUMĖTE MATYTI: crash loop

---

## ✅ Checklist

- [x] Kodas supaprastintas
- [x] Build sėkmingas
- [ ] Commit → Push į GitHub
- [ ] Deployment padarytas
- [ ] Logs patikrinti
- [ ] Serveris veikia (`/health` endpoint)
- [ ] CORS veikia (frontend gali prisijungti)

