module.exports = ({config}) => {
  config.module.rules.push(
    {
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
          options: {
            compilerOptions: {
              rootDir: null,
              outDir: null,
              declaration: false,
            },
          },
        },
        {
          loader: require.resolve('react-docgen-typescript-loader'),
        },
      ],
    },
    {
      test: /\.md$/,
      use: [
        {
          loader: require.resolve('markdown-loader'),
        },
      ],
    },
    {
      test: /\.(css|scss)$/,
      loaders: ['style-loader', 'css-loader', 'sass-loader?sourceMap'],
    }
  )
  config.resolve.extensions.push('.ts', '.tsx')
  return config
}
