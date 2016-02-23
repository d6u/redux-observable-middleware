'use strict';

const join = require('path').join;

module.exports = {
  entry: join(__dirname, 'script.js'),

  output: {
    filename: 'bundle.js',
    path: __dirname
  },

  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      }
    ]
  }
};
