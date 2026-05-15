const appConfig = require("./app.json");

function getGoogleIosUrlScheme() {
  const explicitScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME?.trim();

  if (explicitScheme) {
    return explicitScheme;
  }

  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
  const suffix = ".apps.googleusercontent.com";

  if (iosClientId?.endsWith(suffix)) {
    return `com.googleusercontent.apps.${iosClientId.replace(suffix, "")}`;
  }

  return "";
}

module.exports = () => {
  const googleIosUrlScheme = getGoogleIosUrlScheme();
  const existingPlugins = appConfig.expo.plugins ?? [];
  const hasExpoVideoPlugin = existingPlugins.some((plugin) =>
    Array.isArray(plugin) ? plugin[0] === "expo-video" : plugin === "expo-video",
  );
  const basePlugins = hasExpoVideoPlugin
    ? existingPlugins
    : [...existingPlugins, "expo-video"];

  return {
    expo: {
      ...appConfig.expo,
      plugins: googleIosUrlScheme
        ? [
            ...basePlugins,
            [
              "@react-native-google-signin/google-signin",
              { iosUrlScheme: googleIosUrlScheme },
            ],
          ]
        : basePlugins,
    },
  };
};
