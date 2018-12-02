const fs = require('fs')
const os = require('os')
const path = require('path')
const MpvuePlugin = require('webpack-mpvue-asset-plugin')
const MpvueEntry = require('mpvue-entry')
const HappyPack = require('happypack')
const utils = require('./utils')
const config = require('./config')
const vueLoaderConfig = require('./vue-loader.conf')
// const glob = require('glob')
console.info('小程序运行', process.env.MODE)
console.info('base.conf.js模式', process.env.MODE)




function resolve (dir) {
  return path.join(__dirname, '../..', dir)
}

const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
})



var routerPath = './src/service/router/routes.json'
var templatePath = './src/_start/min/main.js'
var appPath = './dist/min/app.json'
// if (process.env.NODE_ENV === 'production') {
//   routerPath = '../src/service/router/routes.json'
//   templatePath = '../src/_start/min/main.js'
//   appPath = '../dist/min/app.json'
// }

module.exports = {
  // 通过 src/pages.js 来配置要打包的页面，
  entry: MpvueEntry.getEntry({
    template: templatePath,
    pages: routerPath,
    app: appPath
  }),
  target: require('mpvue-webpack-target'),
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.MODE === 'production'
      ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.less'],
    alias: {
      'vue': 'mpvue',
      '_element': resolve('src/elements/min'),
      '@': resolve('src'),
      '_style': resolve('src/assets/style/min'),
      '_style_all': resolve(`src/assets/style/`),
      '_router': resolve(`src/service/router/routers_min.js`),
      '_js': resolve('src/service/min'),
      flyio: 'flyio/dist/npm/wx',
      wx: resolve('src/utils/wx')
    },
    symlinks: false,
    aliasFields: ['mpvue', 'weapp', 'browser'],
    mainFields: ['browser', 'module', 'main']
  },
  module: {
    rules: [{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: resolve('src'),
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'mpvue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        include: resolve('src'),
        use: [
          'happypack/loader?id=happyBabel',
          {
            loader: 'mpvue-loader',
            options: {
              checkMPEntry: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 100,
          name: utils.assetsPath('img/[name].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 100,
          name: utils.assetsPath('media/[name].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 100,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      }
    ]
  },
  plugins: [
    new MpvuePlugin(),
    new MpvueEntry(),
    new HappyPack({
      id: 'happyBabel',
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true'
      }],
      threadPool: happyThreadPool,
      verbose: true
    })
  ]
}
