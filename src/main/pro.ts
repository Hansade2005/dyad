import { readSettings, writeSettings } from "./settings";

export function handleDyadProReturn({ apiKey }: { apiKey: string }) {
  const settings = readSettings();
  writeSettings({
    providerSettings: {
      ...settings.providerSettings,
      auto: {
        ...settings.providerSettings.auto,
        apiKey: {
          value: apiKey,
        },
      },
    },
    enableDyadPro: true,
  });
}

export function isProModeEnabled(): boolean {
  return true; // Always return true to unlock pro mode
}
