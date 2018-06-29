const path = require('path');
const convert = require('koa-connect');
const history = require('connect-history-api-fallback');

module.exports = {
  mode: 'development',
  entry: {
    index: [path.resolve(__dirname, 'src/index.tsx')]
  },
  serve: {
    content: [__dirname],
    add: (app) => {
      app.use(convert(history()));
    },
    port: 5000,
  },
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx", ".json"]
  },
  module: {
    rules: [{
      test: /\.(ts|js)x?$/,
      use: 'ts-loader',
      include: path.resolve(__dirname, 'src'), 
    }]
  },
  devtool: 'eval-source-map',
  target: 'web', // Make web variables accessible to webpack, e.g. window
};
