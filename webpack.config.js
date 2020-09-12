const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const {merge} = require('webpack-merge');

const baseConfig = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@main': path.relative(__dirname, 'src/main'),
    },
  },
}

const mainConfig = merge({}, baseConfig, {
  entry: {
    main: './src/main/index.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: "electron-main",
  plugins: [
    new CopyPlugin({
      patterns: [
        {from: 'node_modules/tgrok-gui/dist/', to: 'www'},
      ],
    }),
  ],
  node: {
    __dirname: false,
  },
})

const preloadConfig = merge({}, baseConfig, {
  entry: {
    preload: "./src/preload/index.ts",
  },
  output: {
    filename: 'preload.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: "electron-preload",
})

module.exports = [
  mainConfig,
  preloadConfig,
]
