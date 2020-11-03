var path = require('path');
var webpack = require('webpack');
const pkg = require('./package.json')

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  output: {
    filename: 'index.js',
    libraryTarget: 'umd',
    library: pkg.name,
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    sourceMapFilename: '[file].map[query]',
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    // lodash: 'lodash' TODO: should we externalize lodash?,
  },
  devtool: 'source-map',
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/i,
        use: [
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[contenthash:10].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[contenthash:10].[ext]',
            },
          },
        ],
      },
    ]
  },
};
