module.exports = {
  packagerConfig: {
    asar: true,
    // Ad-hoc sign macOS builds so Gatekeeper doesn't refuse to launch them
    // once the quarantine attribute is set (e.g. downloaded via a browser).
    // No Developer ID certificate is available in CI, so `identity: '-'`
    // is used with validation disabled to skip the keychain lookup.
    // Hardened runtime is only required for notarization, which we don't
    // do here. With an ad-hoc identity there's no Team ID for the OS to
    // check library validation against, so leaving hardened runtime on
    // breaks launching the app (Electron Framework fails validation).
    osxSign: {
      identity: '-',
      identityValidation: false,
      optionsForFile: () => ({ hardenedRuntime: false })
    }
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
    },
  ],
};
