const merge = require('webpack-merge');
const webpack = require('webpack');
const webpackBaseConfig = require('./webpack.base.config');

const devConfig = {
  mode: 'development',
  devtool: 'cheap-source-map',
  devServer: {
    stats: 'errors-only',
    hot: true,
    contentBase: './dist',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};

module.exports = merge(webpackBaseConfig, devConfig);
