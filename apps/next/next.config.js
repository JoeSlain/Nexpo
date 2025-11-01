const path = require('path')
/**
 * @type {import('next').NextConfig}
 */
const withWebpack = {
  webpack(config, { isServer }) {
    if (!config.resolve) {
      config.resolve = {}
    }

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native': 'react-native-web',
      'react-native$': 'react-native-web',
      'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$':
        'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
      'react-native/Libraries/vendor/emitter/EventEmitter$':
        'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
      'react-native/Libraries/EventEmitter/NativeEventEmitter$':
        'react-native-web/dist/vendor/react-native/NativeEventEmitter',
      // Prevent @lingui/react/macro from loading Babel plugin at runtime (SWC handles it)
      '@lingui/babel-plugin-lingui-macro': false,
      '@lingui/conf': false,
    }

    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...(config.resolve?.extensions ?? []),
    ]

    // Exclude Node.js built-in modules from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
      }
      
    }

    return config
  },
}

/**
 * @type {import('next').NextConfig}
 */
const withTurpopack = {
  turbopack: {
    resolveAlias: {
      'react-native': 'react-native-web',
      'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$':
        'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
      'react-native/Libraries/vendor/emitter/EventEmitter$':
        'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
      'react-native/Libraries/EventEmitter/NativeEventEmitter$':
        'react-native-web/dist/vendor/react-native/NativeEventEmitter',
    },
    resolveExtensions: [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',

      '.js',
      '.mjs',
      '.tsx',
      '.ts',
      '.jsx',
      '.json',
      '.wasm',
    ],
    root: path.resolve(__dirname, '../..'),
  },
}

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  transpilePackages: [
    'react-native',
    'react-native-web',
    'solito',
    'react-native-reanimated',
    'moti',
    'react-native-gesture-handler',
    'tamagui',
    '@tamagui/config',
  ],

  compiler: {
    define: {
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    },
  },
  
  // Configure SWC plugin for Lingui
  experimental: {
    swcPlugins: [['@lingui/swc-plugin', {}]],
  },
  
  reactStrictMode: false, // reanimated doesn't support this on web

  ...withWebpack,
  ...withTurpopack,
}
