const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry:path.join(__dirname,'index.js'),
  output:path.join(__dirname,'bulid'),
  devServer: {
			// enble history api fallback to HTML5 History
			// API based
			// routing works.This is a good defualt that wil
			// come in handy in more complicated setups
			historyApiFallback: true,
			hot: true,
			inline: true,

			// display onlu errors to reduce the amount of output
			stats: 'errors-only',
      host:'127.0.0.1',
			port: 9000
	},
  module:{
		loaders:[
			{
			    test: /.*\.(gif|png|jpe?g|svg)$/i,
			    loader: 'url-loader?limit=8192&name=img/[name].[ext]'
			}
		]
	},
  plugins: [
    new HtmlWebpackPlugin({
      title:'tank game'
    }),
    new webpack.HotModuleReplacementPlugin({
      multiStep: true
    })
  ]
}
module.exports = config;
