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

  return {
    expo: {
      ...appConfig.expo,
      plugins: googleIosUrlScheme
        ? [
            ...existingPlugins,
            [
              "@react-native-google-signin/google-signin",
              { iosUrlScheme: googleIosUrlScheme },
            ],
          ]
        : existingPlugins,
    },
  };
};
