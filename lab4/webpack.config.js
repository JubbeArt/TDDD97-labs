module.exports = {
  entry: [
    './static/index.js'
  ],
  devServer: {
    contentBase: './static',
    historyApiFallback: true
  },
  devtool: 'eval',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
}
