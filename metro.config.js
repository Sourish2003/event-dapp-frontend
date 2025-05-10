// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Handle static assets like images
config.resolver.assetExts.push('png', 'jpg', 'jpeg', 'gif', 'svg');

module.exports = config;
