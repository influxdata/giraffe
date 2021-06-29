const path = require('path')
const webpack = require('webpack')
const pkg = require('./package.json')
const common = require('./webpack.common.config.js')

module.exports = {
  ...common,
  mode: 'production',
  devtool: 'source-map',
}
