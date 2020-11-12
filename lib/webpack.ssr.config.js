const merge = require('webpack-merge');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const cssnano = require('cssnano');
const webpackBaseConfig = require('./webpack.base.config');

const ssrConfig = {
  mode: 'production',
  rules: [
    {
      test: /\.css$/,
      use: 'ignore-loader',
    },
    {
      test: /\.less$/,
      use: 'ignore-loader',
    },
  ],
  plugins: [
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          global: 'React',
          entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
        },
        {
          module: 'react-dom',
          global: 'ReactDOM',
          entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
        },
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          minChunks: 2,
          chunks: 'all',
          name: 'vendors',
        },
      },
    },
  },
};

module.exports = merge(webpackBaseConfig, ssrConfig);
