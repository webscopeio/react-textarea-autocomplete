const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './example/index.js',
  devServer: {
    port: 8080,
  },
  resolve: {
    alias: {
      '@webscopeio/react-textarea-autocomplete': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: './example/index.html' })],
};
