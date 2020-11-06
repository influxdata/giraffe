const path = require('path')
const webpack = require('webpack')
const pkg = require('./package.json')

module.exports = {
  entry: {
    index: './src/index.ts',
  },
  mode: 'production',
  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'Giraffe',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    sourceMapFilename: '[file].map[query]',
  },
  externals: {
    react: {
      amd: 'react',
      commonjs: 'react',
      commonjs2: 'react',
      root: 'React',
    },
    'react-dom': {
      amd: 'react-dom',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      root: 'ReactDOM',
    },
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
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/i,
        exclude: /leaflet\.css/,
        use: ['css-loader', 'sass-loader'],
      },
      {
        test: /leaflet\.css/,
        use: [
          {loader: 'style-loader', options: {injectType: 'lazyStyleTag'}},
          'css-loader',
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
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
}
