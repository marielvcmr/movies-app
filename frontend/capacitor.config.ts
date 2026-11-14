import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Unique id of the app on the phone. Don't change it after adding Android.
  appId: 'com.spoileralert.app',
  appName: 'SpoilerAlert',
  webDir: 'www',
  // The API runs on plain http in development; without this Android blocks the requests.
  server: {
    androidScheme: 'http',
    cleartext: true,
  },
};

export default config;
