import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.luxero.app",
  appName: "Luxero",
  webDir: "dist",
  server: {
    url: "https://luxero.win",
    hostname: "luxero.win",
  },
  android: {
    allowMixedContent: true,
    backgroundColor: "#000000",
  },
  ios: {
    allowsLinkPreview: true,
    contentInset: "automatic",
    backgroundColor: "#000000",
  },
};

export default config;
