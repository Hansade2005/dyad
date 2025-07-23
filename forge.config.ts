import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";

// Whitelist of files/folders to always include
const whitelist = [
  "/drizzle",
  "/scaffold",
  "/worker",
  "/.vite",
  "/node_modules/stacktrace-js",
  "/node_modules/stacktrace-js/dist",
  "/node_modules/better-sqlite3",
  "/node_modules/bindings",
  "/node_modules/file-uri-to-path",
];

const ignore = (file: string) => {
  if (!file) return false;
  return !whitelist.some((path) => file.startsWith(path));
};

const isEndToEndTestBuild = process.env.E2E_TEST_BUILD === "true";

const config: ForgeConfig = {
  packagerConfig: {
    protocols: [
      {
        name: "Trio",
        schemes: ["trio"], // You can handle this with app.setAsDefaultProtocolClient("trio") in your Electron main
      },
    ],
    icon: "./assets/icon/logo", // Do not include extension (.ico/.icns)
    asar: true,
    ignore,
    win32metadata: {
      CompanyName: "Pixelways Inc. (Hans Ade)",
      FileDescription: "Trio AI",
      OriginalFilename: "Trio.exe",
      ProductName: "Trio AI",
      InternalName: "Trio",
    },
    // Code signing (disabled by default)
    // osxSign: isEndToEndTestBuild
    //   ? undefined
    //   : {
    //       identity: process.env.APPLE_TEAM_ID,
    //     },
    // osxNotarize: isEndToEndTestBuild
    //   ? undefined
    //   : {
    //       appleId: process.env.APPLE_ID!,
    //       appleIdPassword: process.env.APPLE_PASSWORD!,
    //       teamId: process.env.APPLE_TEAM_ID!,
    //     },
  },
  rebuildConfig: {
    extraModules: ["better-sqlite3"],
    force: true,
  },
  makers: [
    new MakerSquirrel(), // Windows .exe installer
    new MakerZIP({}, ["darwin"]), // Mac zip archive
    new MakerRpm(), // Linux .rpm
    new MakerDeb({
      options: {
        mimeType: ["x-scheme-handler/trio"],
      },
    }),
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "Hansade2005",
          name: "dyad", // ✅ Correct GitHub repo name
        },
        draft: true,
        force: true,
      },
    },
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new VitePlugin({
      build: [
        {
          entry: "src/main.ts",
          config: "vite.main.config.mts",
          target: "main",
        },
        {
          entry: "src/preload.ts",
          config: "vite.preload.config.mts",
          target: "preload",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer.config.mts",
        },
      ],
    }),
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: isEndToEndTestBuild,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
