module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
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
