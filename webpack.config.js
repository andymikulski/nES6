var webpack = require('webpack');

var plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(true),
  // new webpack.optimize.UglifyJsPlugin({
  //   sourceMap: false,
  //   compress: {
  //     warnings: false,
  //   },
  // })
];

module.exports = [
  {
    plugins,
  }
];
