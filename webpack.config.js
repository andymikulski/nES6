var webpack = require('webpack');
var path = require('path');
var ClosureCompilerPlugin = require('webpack-closure-compiler');
var prod = process.argv.indexOf('-p') !== -1;

var plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(true),
];

if (prod) {
  plugins = plugins.concat([
    new ClosureCompilerPlugin({
      compiler: {
        language_in: 'ECMASCRIPT6',
        language_out: 'ECMASCRIPT5',
        compilation_level: 'SIMPLE'
      },
      concurrency: 4,
      // use JS compiler - slower but doesn't require any java
      jsCompiler: true,
    })
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: false,
    //   compress: {
    //     warnings: false,
    //   },
    // })
  ]);
}

module.exports = [
  {
    plugins,
    context: __dirname,
    entry: {
      webnes: [
        './src/main.js'
      ]
    },

    output: {
      path: path.resolve('./app/'),
      filename: '[name].js',
      chunkFilename: '[id].bundle.js',
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          query: {
            presets: ["stage-0", "es2015"],
            plugins: ["transform-class-properties", "transform-es2015-classes"]
          }
        }
      ]
    }
  }
];
