const { app, BrowserWindow, shell, ipcMain } = require('electron')
const path = require('path')

const createWindow = () => {
  // https://www.electronjs.org/ja/docs/latest/api/browser-window#new-browserwindowoptions
  const win = new BrowserWindow({
    width: 700,
    height: 900,
    useContentSize: true,
    //alwaysOnTop: true,
    autoHideMenuBar: true,
    //opacity: 1.0,
    webPreferences: {
      //scrollBounce: true,
      //autoplayPolicy: 'user-gesture-required',
      //spellcheck: false
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Use external web browser when open new window
  // https://www.electronjs.org/ja/docs/latest/api/web-contents#contentssetwindowopenhandlerhandler
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith('http')) {
      return { action: 'allow' }
    }

    shell.openExternal(url);
    return { action: 'deny' }
  });

  win.webContents.on('input-event', (event, input) => {
    if (input.type == 'gestureScrollBegin' || input.type == 'gestureScrollEnd') {
      win.webContents.send(input.type);
    }
  });

  ipcMain.on('gestureScrollComplete', (events, args) => {
    //console.log(args);

    if (args == 'R' && win.webContents.canGoBack()) {
      win.webContents.goBack();
    }
    if (args == 'L' && win.webContents.canGoForward()) {
      win.webContents.goForward();
    }
  });

  win.loadURL('https://misskey.io/');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
