const path = require('path')

module.exports = {
  entry: './src/hatena.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
}
