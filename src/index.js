const { app, BrowserWindow, shell, ipcMain, nativeTheme, Menu } = require('electron')
const path = require('path')
const fs = require('fs')

const REMOTE_URL = 'https://misskey.io/'

const SETTINGS_PATH = path.join(app.getPath('userData'), 'settings.json')
const DEFAULT_SETTINGS = { theme: 'system', smoothScrolling: true }

const loadSettings = () => {
  let stored = {}
  try {
    stored = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'))
  } catch {
    stored = {}
  }
  return { ...DEFAULT_SETTINGS, ...stored }
}

// Chromium command-line switches only take effect for the process they're
// set on before app.whenReady(), so this can't be toggled live -- changing
// it in Settings takes effect on the next launch.
if (!loadSettings().smoothScrolling) {
  app.commandLine.appendSwitch('disable-smooth-scrolling')
}

const saveSettings = (settings) => {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2))
}

ipcMain.handle('get-settings', () => loadSettings())

ipcMain.handle('set-settings', (event, updates) => {
  const settings = { ...loadSettings(), ...updates }
  saveSettings(settings)
  nativeTheme.themeSource = settings.theme
  return settings
})

let mainWindow = null
let isShowingSettings = false

// Switches the window back to the wrapped site. Used both for the initial
// window and to return to it after Settings.
const showRemoteSite = () => {
  isShowingSettings = false
  mainWindow?.loadURL(REMOTE_URL)
}

const openSettings = () => {
  isShowingSettings = true
  mainWindow?.loadFile(path.join(__dirname, 'settings', 'index.html'))
}

// Lets the Settings accelerator/menu item double as a close button when
// Settings is already open.
const toggleSettings = () => {
  if (isShowingSettings) {
    showRemoteSite()
  } else {
    openSettings()
  }
}

ipcMain.on('close-settings', () => {
  showRemoteSite()
})

const setApplicationMenu = () => {
  const isMac = process.platform === 'darwin'

  // Match where Firefox puts Settings: the app menu on macOS, the
  // bottom of the Edit menu everywhere else.
  const settingsItem = () => ({
    label: 'Settings',
    accelerator: 'CmdOrCtrl+,',
    click: () => toggleSettings(),
  })

  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              settingsItem(),
              { type: 'separator' },
              { role: 'services', submenu: [] },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' },
            ],
          },
        ]
      : []),
    {
      label: 'File',
      submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
        ...(isMac ? [] : [{ type: 'separator' }, settingsItem()]),
      ],
    },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

const createWindow = () => {
  const { windowSize } = loadSettings()

  // https://www.electronjs.org/ja/docs/latest/api/browser-window#new-browserwindowoptions
  const win = new BrowserWindow({
    width: windowSize?.width ?? 800,
    height: windowSize?.height ?? 1000,
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
  mainWindow = win

  win.on('close', () => {
    const [width, height] = win.getContentSize()
    saveSettings({ ...loadSettings(), windowSize: { width, height } })
  });

  win.on('closed', () => {
    mainWindow = null
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

  showRemoteSite();
}

app.whenReady().then(() => {
  nativeTheme.themeSource = loadSettings().theme
  setApplicationMenu();
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
