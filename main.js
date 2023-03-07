const { app, BrowserWindow, shell } = require('electron')

const createWindow = () => {
  // https://www.electronjs.org/ja/docs/latest/api/browser-window#new-browserwindowoptions
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    //useContentSize: true,
    //alwaysOnTop: true,
    autoHideMenuBar: true,
    //opacity: 1.0,
    webPreferences: {
      //scrollBounce: true,
      //autoplayPolicy: 'user-gesture-required',
      //spellcheck: false
    }
  });

  // Use external web browser when open new window
  // https://www.electronjs.org/ja/docs/latest/api/web-contents#contentssetwindowopenhandlerhandler
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);
      return { action: 'deny' }
    }
    return { action: 'allow' }
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
