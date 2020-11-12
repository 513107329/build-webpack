const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const overrideBrowserslist = require('autoprefixer');
const HtmlWebackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const path = require('path');

const projectRoot = process.cwd();

function setPWA() {
  const entry = {};
  const htmlWebpackPlugins = [];

  const entrys = glob.sync(path.join(projectRoot, './src/*/index.js'));

  Object.values(entrys).forEach(value => {
    const match = value.match(/\/src\/(.*)\/index\.js/);
    const pageName = match && match[1];
    entry[pageName] = value;
    htmlWebpackPlugins.push(
      new HtmlWebackPlugin({
        inlineSource: '.css$',
        template: path.join(projectRoot, `./src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: ['vendors', pageName],
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false,
        }
      })
    )
  })
  return { entry, htmlWebpackPlugins };
}

const { entry, htmlWebpackPlugins } = setPWA();

module.exports = {
  entry,
  output: {
    path: path.join(projectRoot, './dist'),
    filename: '[name]_[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => {
                overrideBrowserslist({
                  browsers: ['last 2 Version', '>1%', 'ios7'],
                });
              },
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75,
              remPrecision: 8,
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
    ]
  },
  stats: 'errors-only',
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    new CleanWebpackPlugin(),
    function errorPlugin() {
      console.log(this.compiler);
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
          process.exit(2);
        }
      });
    },
  ].concat(htmlWebpackPlugins)
};
