# 🚀 Guida Rapida all'Installazione

## ⚠️ IMPORTANTE: Node.js non è installato

Per far funzionare IAMMUSIC, devi prima installare Node.js sul tuo computer.

## Passo 1: Installare Node.js

### Windows (il tuo sistema)

1. **Scarica Node.js**
   - Vai su: https://nodejs.org/
   - Scarica la versione **LTS** (Long Term Support) - consigliata
   - Il file da scaricare è: `node-vXX.XX.X-x64.msi`

2. **Installa Node.js**
   - Esegui il file .msi scaricato
   - Segui la procedura guidata
   - **IMPORTANTE**: Seleziona l'opzione "Automatically install necessary tools" se richiesto
   - Riavvia il computer dopo l'installazione

3. **Verifica l'installazione**
   - Apri PowerShell (cerca "PowerShell" nel menu Start)
   - Digita: `node --version`
   - Dovresti vedere qualcosa come: `v20.11.0`
   - Digita: `npm --version`
   - Dovresti vedere qualcosa come: `10.2.4`

## Passo 2: Configurare Spotify API

1. **Crea un account Spotify Developer** (se non ce l'hai già)
   - Vai su: https://developer.spotify.com/dashboard
   - Accedi con il tuo account Spotify (o creane uno gratis)
   - Accetta i termini di servizio

2. **Crea una nuova App**
   - Clicca su "Create app"
   - Nome dell'app: `IAMMUSIC` (o quello che vuoi)
   - Descrizione: `Music streaming app`
   - Redirect URI: `http://localhost:3000` (puoi aggiungerlo dopo)
   - Tipo di API: Web API
   - Clicca "Save"

3. **Ottieni le credenziali**
   - Nella dashboard dell'app, clicca su "Settings"
   - Troverai:
     - **Client ID** - copialo
     - **Client Secret** - clicca "View client secret" e copialo

4. **Configura il file .env**
   - Apri la cartella del progetto: `C:\Users\gelop\Desktop\C0DING\IAMMUSIC\server`
   - Copia il file `.env.example` e rinominalo in `.env`
   - Apri `.env` con Notepad o VS Code
   - Sostituisci i valori:
     ```
     SPOTIFY_CLIENT_ID=il_tuo_client_id_qui
     SPOTIFY_CLIENT_SECRET=il_tuo_client_secret_qui
     PORT=3001
     ```
   - Salva il file

## Passo 3: Installare le dipendenze del progetto

Apri PowerShell nella cartella del progetto e esegui:

```powershell
# Vai nella cartella del progetto
cd C:\Users\gelop\Desktop\C0DING\IAMMUSIC

# Installa tutte le dipendenze (root, server, client)
npm run install-all
```

Questo processo richiederà alcuni minuti. Vedrai molti messaggi mentre scarica i pacchetti necessari.

## Passo 4: Avviare l'applicazione

Una volta completata l'installazione:

```powershell
# Dalla stessa cartella IAMMUSIC
npm run dev
```

Questo comando avvierà:
- 🖥️ **Backend** su http://localhost:3001
- 🌐 **Frontend** su http://localhost:3000

L'applicazione si aprirà automaticamente nel tuo browser predefinito.

## 🎉 Fatto! Inizia ad ascoltare musica!

Apri il browser e vai su: **http://localhost:3000**

### Funzionalità disponibili:

1. **🔍 Cerca**: Cerca brani, album e artisti
2. **▶️ Riproduci**: Clicca su un brano per ascoltarlo
3. **📁 Crea Playlist**: Organizza la tua musica
4. **❤️ Preferiti**: Salva i tuoi brani preferiti
5. **📝 Testi**: Visualizza i testi delle canzoni
6. **🎚️ Visualizzatore**: Attiva le animazioni audio

## ⚠️ Risoluzione Problemi

### Problema: "npm" non riconosciuto
- **Soluzione**: Node.js non è installato correttamente. Ripeti Passo 1 e riavvia il computer.

### Problema: Errore durante "npm install"
- **Soluzione**: 
  1. Elimina le cartelle `node_modules` se esistono
  2. Elimina i file `package-lock.json` se esistono
  3. Riprova con `npm run install-all`

### Problema: Backend non si avvia
- **Soluzione**: Verifica che il file `.env` nella cartella `server` contenga le credenziali Spotify corrette.

### Problema: Musica non si riproduce
- **Soluzione**: 
  1. Verifica la connessione internet
  2. Prova a cercare un altro brano
  3. Controlla la console del browser (F12) per eventuali errori

### Problema: Porta già in uso
- **Soluzione**: Se vedi "Port 3000 is already in use":
  1. Chiudi altre applicazioni che potrebbero usare quelle porte
  2. Oppure cambia la porta in `client/vite.config.js` (port: 3000 → port: 3002)

## 📚 Comandi Utili

```powershell
# Installare dipendenze
npm run install-all

# Avviare tutto (frontend + backend)
npm run dev

# Avviare solo il backend
npm run server

# Avviare solo il frontend
npm run client

# Build per produzione
npm run build

# Fermare l'applicazione
# Premi Ctrl+C nel terminale
```

## 🎵 Goditi la tua musica!

Ora hai tutto pronto per ascoltare musica gratuitamente, senza pubblicità e con tutte le funzionalità premium!

---

**Hai bisogno di aiuto?** Controlla il file README.md per maggiori dettagli.
