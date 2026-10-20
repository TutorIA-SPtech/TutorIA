const clientIdSuffix = '.apps.googleusercontent.com';

module.exports = ({ config }) => {
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
  let iosUrlScheme;

  if (iosClientId) {
    if (!iosClientId.endsWith(clientIdSuffix)) {
      throw new Error('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID não é um OAuth Client ID iOS válido.');
    }

    iosUrlScheme = `com.googleusercontent.apps.${iosClientId.slice(0, -clientIdSuffix.length)}`;
  }

  const plugins = (config.plugins || []).map((plugin) => {
    const pluginName = Array.isArray(plugin) ? plugin[0] : plugin;
    if (pluginName !== '@react-native-google-signin/google-signin' || !iosUrlScheme) {
      return plugin;
    }

    return [pluginName, { iosUrlScheme }];
  });

  return {
    ...config,
    plugins,
  };
};
