const path = require('path')

module.exports = {
  stories: ["../stories/**/*.stories.(ts|tsx|js|jsx|mdx)"],
  addons: ["@storybook/addon-docs", 'react-docgen', '@storybook/addon-actions', '@storybook/addon-controls', '@storybook/addon-links'],
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
