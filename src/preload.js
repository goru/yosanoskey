const { contextBridge, ipcRenderer } = require('electron')

// Only expose this to our own local settings page, not to the wrapped site.
if (location.protocol === 'file:') {
  contextBridge.exposeInMainWorld('settingsAPI', {
    getSettings: () => ipcRenderer.invoke('get-settings'),
    setSettings: (updates) => ipcRenderer.invoke('set-settings', updates),
    close: () => ipcRenderer.send('close-settings'),
  })
}

let directions = []

window.addEventListener('wheel', (event) => {
  const threshold = 50
  let direction = ''

  if (Math.abs(event.deltaX) <= threshold && Math.abs(event.deltaY) <= threshold) {
    return
  }

  if (event.deltaX < -threshold && Math.abs(event.deltaY) < threshold) {
    direction = 'R'
  }
  if (event.deltaX > threshold && Math.abs(event.deltaY) < threshold) {
    direction = 'L'
  }
  if (Math.abs(event.deltaX) < threshold && event.deltaY < -threshold) {
    direction = 'D'
  }
  if (Math.abs(event.deltaX) < threshold && event.deltaY > threshold) {
    direction = 'U'
  }

  //directions.push([event.deltaX, event.deltaY, direction]);
  if (directions[directions.length - 1] != direction) {
    directions.push(direction);
  }
});

ipcRenderer.on('gestureScrollBegin', (event, message) => {
  directions = []
});

ipcRenderer.on('gestureScrollEnd', (event, message) => {
  ipcRenderer.send('gestureScrollComplete', directions.join(''));
});
