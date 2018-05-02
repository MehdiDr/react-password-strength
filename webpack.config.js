const path = require('path');


module.exports = {
  entry: './src/index.js',
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      { test: /\.css$/, loader: ['style-loader', 'css-loader'] },
      { test: /\.scss$/, loader: 'sass-loader' },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
