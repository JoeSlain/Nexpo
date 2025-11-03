// Learn more https://docs.expo.dev/guides/monorepos
// Learn more https://docs.expo.io/guides/customizing-metro
/**
 * @type {import('expo/metro-config')}
 */
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// Merge watchFolders with Expo's defaults instead of replacing them
config.watchFolders = [...(config.watchFolders || []), workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]
config.resolver.disableHierarchicalLookup = false

// Add extra node modules paths for workspace packages
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
}

// Ensure Metro can resolve workspace packages
config.resolver.resolverMainFields = ['react-native', 'browser', 'main']

// Configure Metro to resolve paths from workspace root
config.resolver.platforms = ['ios', 'android', 'native', 'web']

// Add Lingui transformer for compiling .po files on the fly
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('@lingui/metro-transformer/expo'),
}

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
})

module.exports = config
