const path = require('path')

module.exports = {
  output: {
    path: path.join(__dirname, 'static', 'dist')
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
