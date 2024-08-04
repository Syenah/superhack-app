const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const svgTransformerConfig = require('react-native-svg-transformer');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  
  const svgConfig = {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  };

  const config = mergeConfig(getDefaultConfig(__dirname), svgConfig);
  
  return config;
})();