# yosanoskey

## Settings

Settings are stored as `settings.json` under Electron's `userData` directory:

- macOS: `~/Library/Application Support/Yosanoskey/settings.json`
- Linux: `~/.config/Yosanoskey/settings.json` (or `$XDG_CONFIG_HOME/Yosanoskey/settings.json` if set)
- Windows: `%APPDATA%\Yosanoskey\settings.json`

## macOS

Since the app isn't signed with a paid Apple Developer ID certificate, you'll
see a warning the first time you launch it. Right-click (or Control-click)
the app in Finder and choose "Open", or allow it via System Settings >
Privacy & Security.
