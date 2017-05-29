require('dotenv-extended').load();

const path = require('path');
const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const defaults = {
  entry: './app/index.jsx',
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|dist|server)/,
      use: [{ loader: 'babel-loader' }],
    }, {
      test: /\.json$/,
      use: [{ loader: 'json-loader' }],
    }],
  },
  resolve: {
    modules: [
      resolve(__dirname, 'app'),
      resolve(__dirname, 'node_modules'),
    ],
    extensions: ['.js', '.jsx'],

    // modulesDirectories: ['node_modules'],
    // root: path.resolve('./app'),
  },
  plugins: [
    // Avoid publishing files when compilation fails
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        API_URL: JSON.stringify(process.env.PROXY)
      }
    })
  ],
};

module.exports = defaults;
