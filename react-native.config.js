module.exports = {
  dependencies: {
    'react-native-background-geolocation': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
    '@mauron85/react-native-background-geolocation': {
      platforms: {
        ios: null,
        android: null
      },
    },
    '@react-native-firebase/app': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
    '@react-native-firebase/messaging': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
  },
};
