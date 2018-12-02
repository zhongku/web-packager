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
  index: path.join(process.cwd(), program.output, 'index.html'),
  assetsRoot: path.join(process.cwd(), program.output, PLATFORM),
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
  productionGzip: true,
  productionGzipExtensions: ['js', 'css'],
  bundleAnalyzerReport: program.analyze,
  fileExt: fileExtConfig[program.target]
}
