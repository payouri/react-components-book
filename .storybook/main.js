const path = require('path')

module.exports = {
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  stories: ['../stories/**/*.stories.js', '../stories/**/*.stories.jsx', '../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: async config => {
    // do mutation to the config
    config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx']
    config.resolve.alias = {
      components: path.resolve(__dirname, '../src/components'),
      hoc: path.resolve(__dirname, '../src/HOC'),
      js: path.resolve(__dirname, '../src/commons/js'),
      styles: path.resolve(__dirname, '../src/commons/styles')
    }
    // config.plugins = [
    //   // your custom plugins
    // ]
    config.module.rules.push(
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]_[local]_[hash:base64]"
              },
              importLoaders: 1,
              sourceMap: true,
            }
          },
          {
            loader: "sass-loader",
          },
        ]
      })
    return config;
  },
};
