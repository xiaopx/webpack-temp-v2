const path=require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');

module.exports={
  mode: 'development',
  output: {
    filename: '[name].js'
  },
  devServer: {
     contentBase: path.resolve(__dirname, 'build')
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'html-withimg-loader!'+path.resolve(__dirname, '../index.html'),
      chunks: ['index'],
      chunksSortMode: 'manual'
    }),
     new HtmlWebpackPlugin({
       filename: 'aem_live.html',
       template: 'html-withimg-loader!'+path.resolve(__dirname, '../aem_live.html'),
       chunks: ['index']
     }),
    new MiniCssExtractPlugin({
      test: /\.css($|\?)/i,
      filename: '[name].css'
    }),
    new DefinePlugin({
      // 定义 NODE_ENV 环境变量为 development
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  ],
  devtool: 'source-map'
};
