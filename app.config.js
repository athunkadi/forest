const appJson = require("./app.json");

const mapsDemoKey = "MAPS_DEMO_KEY";

module.exports = ({ config }) => {
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || mapsDemoKey;
  const usingMapsDemoKey = googleMapsApiKey === mapsDemoKey;
  const expoConfig = {
    ...config,
    ...appJson.expo
  };

  return {
    ...expoConfig,
    android: {
      ...expoConfig.android,
      config: {
        ...expoConfig.android?.config,
        googleMaps: {
          apiKey: googleMapsApiKey
        }
      }
    },
    extra: {
      ...expoConfig.extra,
      googleMapsApiKeyConfigured: true,
      googleMapsApiKeyMode: usingMapsDemoKey ? "demo" : "custom"
    }
  };
};
