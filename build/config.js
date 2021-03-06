'use strict'
const ip = require('ip').address()
const path = require('path')
const program = require('commander')
const {
  MODE,
  PLATFORM,
  NODE_ENV
} = process.env
console.log(`[5ug.com][${PLATFORM} ${MODE}]`, '运行build/config.js')

const fileExtConfig = {
  swan: {
    template: 'swan',
    script: 'js',
    style: 'css',
    platform: 'swan'
  },
  wx: {
    template: 'wxml',
    script: 'js',
    style: 'wxss',
    platform: 'wx'
  }
}

module.exports = {
  env: {
    MODE: JSON.stringify(MODE),
    NODE_ENV: JSON.stringify(NODE_ENV)
  },
  index: path.join(process.cwd(), program.output, PLATFORM, 'index.html'),
  assetsRoot: path.join(process.cwd(), program.output, PLATFORM),
  publicDevPath: PLATFORM === 'pc' ? 'http://' + ip + ':2008/' : 'http://' + ip + ':2000/',
  publicPath: '/',
  assetsSubDirectory: MODE === 'mp' ? '' : 'static',
  proxyTable: {},
  host: ip,
  port: PLATFORM === 'pc' ? 2008 : 2000,
  autoOpenBrowser: true,
  errorOverlay: true,
  notifyOnErrors: true,
  poll: false,
  useEslint: true,
  showEslintErrorsInOverlay: false,
  devtool: NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : '#source-map',
  cacheBusting: true,
  cssSourceMap: true,
  productionSourceMap: true,
  productionGzip: false, // 启用压缩
  productionGzipExtensions: ['js', 'css'],
  fileExt: fileExtConfig[program.target]
}
