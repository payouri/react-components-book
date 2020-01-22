const path = require('path')

module.exports = {
  stories: ['../stories/**/*.stories.js'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: async config => {
    // do mutation to the config
    config.resolve.extensions = ['.js', '.jsx']
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
        test: /\.s?css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[name]_[local]_[hash:base64]",
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
