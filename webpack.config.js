const path = require('path');

const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', ".ts", ".tsx"],
    alias: {
      components: path.resolve(__dirname, './src/components'),
      hoc: path.resolve(__dirname, './src/HOC'),
      js: path.resolve(__dirname, './src/commons/js'),
      styles: path.resolve(__dirname, './src/commons/styles')
    }
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.scss$/,
        use: [
          // {
            // loader: MiniCssExtractPlugin.loader,
            // options: {
            //   // you can specify a publicPath here
            //   // by default it uses publicPath in webpackOptions.output
            //   publicPath: '/dist',
            //   hmr: process.env.NODE_ENV === 'development',
            // },
          // },
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
      }
    ]
  },
  plugins: [
    htmlWebpackPlugin,
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[name].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    })
  ]
};