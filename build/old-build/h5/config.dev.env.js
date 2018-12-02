'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./config.prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MODE: process.env.MODE && `"${process.env.MODE}"`
})
