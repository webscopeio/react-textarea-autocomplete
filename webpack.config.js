const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

process.env.NODE_ENV = "development";

module.exports = {
  mode: "development",
  entry: ["@babel/polyfill", "./example/index.js"],
  devServer: {
    port: 8080
  },
  resolve: {
    alias: {
      "@webscopeio/react-textarea-autocomplete": path.resolve(
        __dirname,
        "./src"
      )
    },
    extensions: [".js", ".jsx", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: { loader: "babel-loader" },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: "./example/index.html" })]
};
