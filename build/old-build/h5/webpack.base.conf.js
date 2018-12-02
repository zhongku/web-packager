'use strict'
const os = require('os')
const path = require('path')
const HappyPack = require('happypack')
const utils = require('./utils')
const config = require('./config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '../..', dir)
}


const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
})


const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

const clientMode = process.env.MODE
console.log('[5ug.com][' + process.env.MODE + ']', '运行webpack.base.conf')
console.log('[5ug.com][' + process.env.MODE + ']', 'clientMode: ' + clientMode)

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: `../src/_start/${clientMode}/main.js`
  },
  externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.less'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '_element': resolve(`src/elements/${clientMode}`),
      '_style': resolve(`src/assets/style/${clientMode}`),
      '_style_all': resolve(`src/assets/style/`),
      '_router': resolve(`src/service/router/routers.js`),
      '_js': resolve(`src/service/${clientMode}`),
      '@': resolve('src'),
      flyio: 'flyio/dist/npm/fly',
      wx: resolve('src/utils/wx')
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 100,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 100,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 100,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'happyBabel',
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true'
      }],
      threadPool: happyThreadPool,
      verbose: true
    })
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
