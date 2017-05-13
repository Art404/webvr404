var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var loadCSS = new ExtractTextPlugin('build/app.css')

module.exports = {
  entry: './js',
  output: {
    path: path.resolve(__dirname, './build'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: loadCSS.extract('style', 'css'),
        exclude: /node_modules/
      },
      {
        test: /\.json?$/,
        loader: 'json',
        exclude: /node_modules/
      },
      {
        test: /\.gif$|\.jpe?g$|\.woff|\.eot|\.ttf|\.png$|\.svg$/i,
        loader: 'url?limit=10000&name=[name].[ext]',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webVR_404',
      template: path.resolve(__dirname, './index.ejs')
    }),
    loadCSS,
     // {output}/file.txt
    new CopyWebpackPlugin([
      {
        from: './node_modules/es6-promise/dist/es6-promise.min.js',
        to: 'es6-promise.min.js'
      },
      {
        from: './node_modules/three/build/three.min.js',
        to: 'three.min.js'
      },
      {
        from: './node_modules/three/examples/js/controls/VRControls.js',
        to: 'VRControls.js'
      },
      {
        from: './node_modules/three/examples/js/effects/VREffect.js',
        to: 'VREffect.js'
      },
      {
        from: './node_modules/webvr-polyfill/build/webvr-polyfill.min.js',
        to: 'webvr-polyfill.min.js'
      },
      {
        from: './node_modules/webvr-ui/build/webvr-ui.min.js',
        to: 'webvr-ui.min.js'
      },
      {
        from: './img',
        to: './img'
      },
    ])
  ],
  devtool: "#inline-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, './build'),
    host: "0.0.0.0"
  }
};
