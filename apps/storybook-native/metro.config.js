// Learn more https://docs.expo.dev/guides/monorepos
const { getDefaultConfig } = require('@expo/metro-config')
const { withStorybook } = require('@storybook/react-native/metro/withStorybook')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

let config = getDefaultConfig(projectRoot)

config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]
config.resolver.disableHierarchicalLookup = true

// Ensure Metro can resolve workspace packages
config.resolver.resolverMainFields = ['react-native', 'browser', 'main']

// Configure Metro to resolve paths from workspace root
config.resolver.platforms = ['ios', 'android', 'native', 'web']

// Wrap config with Storybook (this handles transformer options automatically)
config = withStorybook(config, {
  enabled: true,
  configPath: './.rnstorybook',
})

module.exports = config
