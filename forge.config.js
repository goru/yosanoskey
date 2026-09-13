module.exports = {
  packagerConfig: {
    asar: true,
    // Ad-hoc sign macOS builds so Gatekeeper doesn't refuse to launch them
    // once the quarantine attribute is set (e.g. downloaded via a browser).
    // No Developer ID certificate is available in CI, so `identity: '-'`
    // is used with validation disabled to skip the keychain lookup.
    osxSign: {
      identity: '-',
      identityValidation: false
    }
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
    },
  ],
};
