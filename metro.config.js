const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Optimize file watching
config.watchFolders = [__dirname];
config.resolver.nodeModulesPaths = [__dirname + '/node_modules'];

// Reduce the number of files being watched
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;

