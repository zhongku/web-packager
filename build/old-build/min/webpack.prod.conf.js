 const path = require('path')
 const webpack = require('webpack')
 const merge = require('webpack-merge')
 const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
 const CopyWebpackPlugin = require('copy-webpack-plugin')
 const ExtractTextPlugin = require('extract-text-webpack-plugin')
 const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
 const utils = require('./utils')
 const config = require('./config')

 const baseWebpackConfig = require('./webpack.base.conf')
 console.info('小程序发布断点')
 const env = config.build.env

 const webpackConfig = merge(baseWebpackConfig, {
   module: {
     rules: utils.styleLoaders({
       sourceMap: config.build.productionSourceMap,
       extract: true
     })
   },
   devtool: config.build.productionSourceMap ? '#source-map' : false,
   output: {
     path: config.build.assetsRoot,
     filename: utils.assetsPath('js/[name].js'),
     chunkFilename: utils.assetsPath('js/[id].js')
   },
   plugins: [
     // http://vuejs.github.io/vue-loader/en/workflow/production.html
     new webpack.DefinePlugin({
       'process.env': env
     }),
     new UglifyJsPlugin({
       sourceMap: true
     }),
     // extract css into its own file
     new ExtractTextPlugin({
       filename: utils.assetsPath('css/[name].wxss')
     }),
     // Compress extracted CSS. We are using this plugin so that possible
     // duplicated CSS from different components can be deduped.
     new OptimizeCSSPlugin({
       cssProcessorOptions: {
         safe: true
       }
     }),
     // keep module.id stable when vender modules does not change
     new webpack.HashedModuleIdsPlugin(),
     // split vendor js into its own file
     new webpack.optimize.CommonsChunkPlugin({
       name: 'vendor',
       minChunks: function (module, count) {
         // any required modules inside node_modules are extracted to vendor
         return (
           module.resource &&
           /\.js$/.test(module.resource) &&
           module.resource.indexOf('node_modules') >= 0
         ) || count > 1
       }
     }),
     // extract webpack runtime and module manifest to its own file in order to
     // prevent vendor hash from being updated whenever app bundle is updated
     new webpack.optimize.CommonsChunkPlugin({
       name: 'manifest',
       chunks: ['vendor']
     }),
     // copy custom static assets
     new CopyWebpackPlugin([{
       from: path.resolve(__dirname, '../../static'),
       to: config.build.assetsSubDirectory,
       ignore: ['*.svg']
     }])
   ]
 })

 console.info('config.build.productionGzip', config.build.productionGzip)
 if (config.build.productionGzip) {
   console.info('min prod 启用压缩')
   const CompressionWebpackPlugin = require('compression-webpack-plugin')

   webpackConfig.plugins.push(
     new CompressionWebpackPlugin({
       asset: '[path].gz[query]',
       algorithm: 'gzip',
       test: new RegExp(
         '\\.(' +
         config.build.productionGzipExtensions.join('|') +
         ')$'
       ),
       threshold: 10240,
       // deleteOriginalAssets: true, // 删除源文件，不建议
       minRatio: 0.8
     })
   )
 }
 if (config.build.bundleAnalyzerReport) {
   const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
   webpackConfig.plugins.push(new BundleAnalyzerPlugin())
 }

 module.exports = webpackConfig
