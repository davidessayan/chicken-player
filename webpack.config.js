const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode !== 'production';
  
  // Configuration principale (UMD)
  const mainConfig = {
    entry: {
      main: [
        './src/js/index.js',
        './src/scss/main.scss'
      ]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].js',
      clean: true
    },
    devtool: isDevelopment ? 'source-map' : false,
    module: {
      rules: [
        // JavaScript
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        // Sass/SCSS
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader, // Toujours utiliser MiniCssExtractPlugin.loader
            {
              loader: 'css-loader',
              options: { sourceMap: isDevelopment }
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: isDevelopment }
            }
          ]
        },
        // Images
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext]'
          }
        },
        // Fonts
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]'
          }
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].css'
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/index.html', to: 'index.html' }
        ],
      }),
      new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        server: { baseDir: ['dist'] },
        files: ['dist/*.html', 'dist/css/*.css', 'dist/js/*.js'],
        notify: false
      })
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000,
      hot: true
    }
  };

  // Retourner les deux configurations
  return [mainConfig];
};