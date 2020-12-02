const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		compress: false,
		port: 8000,
		contentBase: path.resolve(__dirname, './dist'),
		disableHostCheck: true,
	},
});
