'use strict'

const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const os = require('os')
const HappyPack = require('happypack')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const config = require('../config')
const utils = require('../utils')
const vueLoaderConfig = require('../vue-loader.conf')
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
})

const {
  MODE,
  PLATFORM
} = process.env
console.log(`[5ug.com][${PLATFORM} ${MODE}]`, '运行build/h5/webpack.base.conf.js')
console.log('assetsRoot', config.assetsRoot)
var publicPath = process.env.NODE_ENV === 'production' ? config.publicPath : config.publicDevPath
console.log('代理路径', process.env.NODE_ENV, publicPath)
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
    publicPath: publicPath,
    filename: '[name].js'
  },
  externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.less'],
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
    new HappyPack({
      id: 'happyBabel',
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true'
      }],
      threadPool: happyThreadPool,
      verbose: true
    }),
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
