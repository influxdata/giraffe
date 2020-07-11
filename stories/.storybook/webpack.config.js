module.exports = ({config}) => {
  config.module.rules.push(
    {
      test: /\.scss$/,
      exclude: /\.module\.scss$/,
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
  config.resolve.extensions.push('.ts', '.tsx', '.css', '.scss')
  return config
}
