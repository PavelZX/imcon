const path = require('path');
const webpack = require('webpack');

function join(dest) { return path.resolve(__dirname, dest); }

function web(dest) { return join('' + dest); }

module.exports = {
  mode: 'development',
//  devtool: 'source-map',

  entry: {
    application: [
      web('css/application.sass'),
      web('js/application.jsx'),
    ],
  },

  output: {
    path: path.resolve(__dirname, '..', 'priv', 'static', 'js'),
    filename: 'app.js',
    publicPath: path.resolve(__dirname, '..', 'priv', 'static'),
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
          test: /\.s?[ac]ss$/,
          use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "sass-loader" // compiles Sass to CSS
        }]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: [{
          loader: 'url-loader',
          options: { limit: 100000 },
        },
        'image-webpack-loader',
        ]
      },
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx','.sass'],
    modules: ['node_modules', path.join(__dirname, 'assets','js')],
    alias: {
      "phoenix": path.resolve(__dirname, "../deps/phoenix/priv/static/phoenix.js"),
      "phoenix_html": path.resolve(__dirname, "../deps/phoenix_html/priv/static/phoenix_html.js")
    }
  },
};
