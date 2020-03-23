const path=require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fontsRulesDev = 'assets/fonts/';
const fontsRulesPro = '../fonts/';

module.exports=function (env, argv){
  env=env||{};

  let conf = null;
  let outFont = null;

  if(env.production){
    conf = require('./config/webpack.production');
    outFont = fontsRulesPro;
  }else if(env.development){
    conf = require('./config/webpack.development');
    outFont = fontsRulesDev;
  }

  return {
    entry: {
      index: './src/js/index'
    },
    module: {
      rules: [
        //javascript
        {test: /\.(js|jsx)$/i, use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            exclude: path.resolve(__dirname, 'node_modules')
          }
        }]},

        //css
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', {
          loader: 'postcss-loader',
          options: {
            plugins: [
              require('autoprefixer')
            ]
          }
        }]
        },

        //scss
        {
          test: /\.s?[ac]ss$/i,
          use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../../'
            }
          }, {
            loader: 'css-loader'
            },
            'sass-loader',
            {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer')
              ]
            }
          }]
        },
        
        //images
        {
          test: /.(png|jpg|gif|svg)$/i,
          use: {
          loader: 'url-loader',
          options: {
              name: '[name].[ext]',
              outputPath: 'assets/imgs/',
              limit: 8*1024
            }
          }
        },
        //video
        {
          test: /.(mp4|webm)$/i,
          use: {
            loader: 'file-loader',
            options: {
              name: 'assets/imgs/[name].[ext]',
              esModule: false
            }
          }
        },
        
        //html
        //{
        //  test: /.(htm|html)$/i,
        //  use: {
        //    loader: 'html-withimg-loader',
        //    options: {
        //      outputPath: 'assets/imgs/',
        //      esModule: false
        //    }
        //  }
        //},

        //fonts
        {
          test: /\.(eot|otf|svg|ttf|woff|woff2)$/i,
          use: {
            loader: 'url-loader',
            options: {
              publicPath: outFont,
              outputPath: 'assets/fonts/',
              name: '[name].[ext]',
              limit: 8 * 1024
            }
          }
        }
      ]
    },
    ...conf
  };
};
