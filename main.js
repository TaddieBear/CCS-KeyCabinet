const { app, BrowserWindow, ipcMain } = require('electron');
const { NFC } = require('nfc-pcsc');
const fs = require('fs');
const path = require('path'); // ✅ Required for path.join()


let win;

// Log uncaught exceptions to a file
process.on('uncaughtException', (error) => {
  fs.appendFileSync('error-log.txt', `Uncaught Exception:\n${error.stack}\n\n`);
});

// Create a simple log to help debug
fs.appendFileSync('log.txt', 'App started\n');

function createWindow() {
  win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.maximize();
  win.show();

    // ✅ This is the line to load your HTML correctly
    win.loadFile(path.join(__dirname, 'src/index.html'));

  // Log if the page fails to load
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    fs.appendFileSync('error-log.txt', `Failed to load page: ${errorDescription} (Code: ${errorCode})\n`);
  });

 // ✅ Setup NFC
const nfc = new NFC();

nfc.on('reader', reader => {
  console.log(`${reader.reader.name} connected`);
  win.webContents.send('rfid-detected', ''); // Clear the field initially

  reader.on('card', card => {
    console.log('Card detected:', card.uid);
    win.webContents.send('rfid-detected', card.uid);
  });

  reader.on('error', err => {
    console.error('Reader error', err);
    fs.appendFileSync('error-log.txt', `Reader error: ${err.message}\n`);
    win.webContents.send('nfc-error');  // Notify frontend about NFC error
  });

  reader.on('end', () => {
    console.log(`${reader.reader.name} disconnected`);
    win.webContents.send('nfc-error');  // Notify frontend about NFC error when device disconnects
  });
});

nfc.on('error', err => {
  console.error('NFC error', err);
  fs.appendFileSync('error-log.txt', `NFC error: ${err.message}\n`);
  win.webContents.send('nfc-error');  // Notify frontend about NFC error
});

nfc.on('end', () => {
  console.log('NFC reader disconnected');
  win.webContents.send('rfid-disconnected');  // Notify the renderer process
});


}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


process.on('uncaughtException', err => {
  console.error('Uncaught error:', err);
});
