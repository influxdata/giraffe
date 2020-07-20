const PrettierPlugin = require('prettier-webpack-plugin')

module.exports = ({config}) => {
  config.module.rules.push(
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
