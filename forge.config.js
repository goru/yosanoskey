const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

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
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
