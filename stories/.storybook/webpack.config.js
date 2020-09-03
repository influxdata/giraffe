const path = require('path')
const PrettierPlugin = require('prettier-webpack-plugin')

module.exports = ({config}) => {
  config.module.rules.push(
    {
      test: /\.woff(2)?(\?[a-z0-9#=&.]+)$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff',
    },
    {
      test: /\.(eot|png|eot|ttf|svg)(\?[a-z0-9#=&.]+)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
            outputPath: 'fonts/',
          },
        },
      ],
      include: path.resolve(__dirname, '../'),
    },
    {
      test: /\.scss$/,
      use: [
        {loader: 'style-loader'},
        {loader: 'css-modules-typescript-loader'},
        {loader: 'css-loader', options: {modules: true}},
        {loader: 'sass-loader'},
      ],
    },
    {
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
          options: {
            compilerOptions: {
              rootDir: '../../giraffe',
              outDir: null,
              declaration: false,
            },
          },
        },
      ],
    }
  )
  config.plugins.push(new PrettierPlugin())
  config.resolve.extensions.push('.ts', '.tsx', '.css', '.scss')
  return config
}
