const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackConfig = require("./webpack.config");

process.env.NODE_ENV = "production";

module.exports = Object.assign(webpackConfig, {
  mode: process.env.NODE_ENV,
  output: {
    path: __dirname + "/example-build",
    filename: "main.js"
  }
});
