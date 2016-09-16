var webpackConfig = require('./webpack.test');

module.exports = function (config) {
	var _config = {
		basePath: '',

		frameworks: ['jasmine', 'sinon'],

		files: [
			{pattern: './config/karma-test-shim.js', watched: false}
		],
		preprocessors: {
			'./config/karma-test-shim.js': ['webpack', 'sourcemap']
		},
		plugins:[
			require('karma-jasmine'),
			require('karma-coverage'),
			require('karma-webpack'),
			require('karma-phantomjs-launcher'),
			require('karma-sourcemap-loader'),
			require('karma-mocha-reporter'),
			require('karma-sinon')
		],

		coverageReporter: {
			type : 'html',
			dir : 'coverage/'
		},

		webpack: webpackConfig,

		webpackMiddleware: {
			stats: 'errors-only'
		},

		webpackServer: {
			noInfo: true
		},

		reporters: ['mocha','coverage'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['PhantomJS'],
		singleRun: false
	};

	config.set(_config);
};
