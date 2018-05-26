const convert = require('koa-connect');
const history = require('connect-history-api-fallback');

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  serve: {
    add: (app, middleware, options) => {
      app.use(convert(history()));
    },
  },
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx", ".json"]
  },
  module: {
    rules: [{
      test: /\.(ts|js)x?$/, // Transform all .js files required somewhere with Babel
      use: 'babel-loader'
    }]
  },
  devtool: 'eval-source-map',
  target: 'web', // Make web variables accessible to webpack, e.g. window
};
