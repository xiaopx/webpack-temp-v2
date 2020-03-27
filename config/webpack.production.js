const path=require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const DefinePlugin = require('webpack/lib/DefinePlugin');

module.exports={
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../build/'),
    filename: 'assets/js/[name].min.js'
  },
  plugins: [
    
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'html-withimg-loader!'+path.resolve(__dirname, '../index.html'),
      hash: true,
      chunks: ['index'],
      chunksSortMode: 'manual',
      minify: {
        //removeComments: true, //删除注释
        removeEmptyAttributes: true, //删除空属性
        removeRedundantAttributes: true, //删除多余的属性
       }
    }),
     new HtmlWebpackPlugin({
       filename: 'aem_live.html',
       template: 'html-withimg-loader!'+path.resolve(__dirname, '../aem_live.html'),
       hash: true,
       chunks: ['index'],
       chunksSortMode: 'manual',
       minify: {
         //removeComments: true, //删除注释
         removeEmptyAttributes: true, //删除空属性
         removeRedundantAttributes: true, //删除多余的属性
       }
     }),
    new CopyPlugin([{
      from: path.resolve(__dirname, '../src/imgs/favicon.ico'),
      to: path.resolve(__dirname, '../build/assets/imgs')
    }]),
    new CopyPlugin([{
      from: path.resolve(__dirname, '../src/js/lib'),
      to: path.resolve(__dirname, '../build/assets/js')
    }]),
    new CopyPlugin([{
      from: path.resolve(__dirname, '../src/imgs/static'),
      to: path.resolve(__dirname, '../build/assets/imgs/static')
    }]),
    new CopyPlugin([{
      from: path.resolve(__dirname, '../src/media'),
      to: path.resolve(__dirname, '../build/assets/media')
    }]),
    new UglifyJsPlugin({
      test: /\.js($|\?)/i,
      extractComments: false,
      exclude: path.resolve(__dirname, 'node_modules'),
      parallel: 4
    }),
    new MiniCssExtractPlugin({
      test: /\.css($|\?)/i,
      path: path.resolve(__dirname, '../build/'),
      filename: 'assets/css/[name].min.css'
    }),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', {
          discardComments: {
            removeAll: true
          }, 
          normalizeUnicode: false
        }]
      }
    }),
    new DefinePlugin({
      // 定义 NODE_ENV 环境变量为 production
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
};
