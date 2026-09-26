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

const smoothScrollingCheckbox = document.getElementById('smoothScrolling');

window.settingsAPI.getSettings().then((settings) => {
  smoothScrollingCheckbox.checked = settings.smoothScrolling;
});

smoothScrollingCheckbox.addEventListener('change', () => {
  window.settingsAPI.setSettings({ smoothScrolling: smoothScrollingCheckbox.checked });
});
