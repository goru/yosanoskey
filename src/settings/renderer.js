document.getElementById('back').addEventListener('click', () => {
  window.settingsAPI.close();
});

const themeSelect = document.getElementById('theme');

window.settingsAPI.getSettings().then((settings) => {
  themeSelect.value = settings.theme;
});

themeSelect.addEventListener('change', () => {
  window.settingsAPI.setSettings({ theme: themeSelect.value });
});
