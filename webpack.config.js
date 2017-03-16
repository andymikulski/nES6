var webpack = require('webpack');
var path = require('path');
var prod = process.argv.indexOf('-p') !== -1;

var plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(true),
];

if (prod) {
  var ClosureCompilerPlugin = require('webpack-closure-compiler');
  plugins = plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      mangle: true,
    })
  ]);
}

module.exports = [{
  plugins,
  context: __dirname,
  entry: {
    nes6: [
      'babel-polyfill',
      './src/nES6.js'
    ],
    'nes6-demo': [
      'babel-polyfill',
      './src/demo.js'
    ]
  },

  output: {
    path: path.resolve('./app/'),
    filename: '[name].js',
    chunkFilename: '[id].bundle.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['stage-0', 'es2015'],
        plugins: ['transform-class-properties', 'transform-es2015-classes']
      }
    }]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}];
