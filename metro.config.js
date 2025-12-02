// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Firebase v9+ uses .mjs files, and Metro needs to be configured to handle them.
config.resolver.sourceExts.push('mjs');

module.exports = config;