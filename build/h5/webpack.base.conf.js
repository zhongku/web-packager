'use strict'

const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const config = require('../config')
const utils = require('../utils')
const vueLoaderConfig = require('../vue-loader.conf')
const {
  MODE,
  PLATFORM
} = process.env
console.log(`[5ug.com][${PLATFORM} ${MODE}]`, '运行build/h5/webpack.base.conf.js')
const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: utils.resolve('src'),
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.showEslintErrorsInOverlay
  }
})

module.exports = {
  entry: utils.resolve(`./src/_start/${PLATFORM}/main.js`),
  output: {
    path: config.assetsRoot,
    filename: '[name].js',
    publicPath: '/'
  },
  externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': utils.resolve('src'),
      vue: 'vue/dist/vue.js'
    }
  },
  module: {
    rules: [
      ...(config.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [utils.resolve('src'), require.resolve('webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.env
    }),
    new ProgressBarPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin([{
      from: utils.resolve('./static'),
      to: config.assetsSubDirectory,
      ignore: ['*.vant']
    }])
  ],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
