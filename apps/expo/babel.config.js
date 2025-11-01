module.exports = function (api) {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      'react-native-worklets/plugin',
      '@lingui/babel-plugin-lingui-macro',
    ],
  }
}
