'use strict'
const ip = require('ip').address()
const path = require('path')
module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: process.env.MODE === 'pc' ? 'http://' + ip + ':2008/' : 'http://' + ip + ':2000/',
    //   assetsPublicPath: process.env.MODE === 'pc' ? 'http://localhost:2008/' : 'http://localhost:2000/',
    proxyTable: {},

    // Various Dev Server settings
    host: ip, // can be overwritten by process.env.HOST
    port: process.env.MODE === 'pc' ? 2008 : 2000, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, `../../dist/${process.env.MODE}/index.html`),

    // Paths
    assetsRoot: path.resolve(__dirname, `../../dist/${process.env.MODE}`),
    assetsSubDirectory: 'static',
    // assetsPublicPath: process.env.MODE === 'pc' ? 'http://127.0.0.1:2008/' : 'http://127.0.0.1:2000/',
    // assetsPublicPath: 'http://127.0.0.1:2000/', // diy代理时候需要用到  sampsong 2018年8月30日 注释
    assetsPublicPath: '/',
    // 发布diy项目时，使用
    // assetsPublicPath: 'http://srsm.5ug.com/',

    /**
     * Source Maps
     */

    productionSourceMap: true, // 错误不好调试时，可开启
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
