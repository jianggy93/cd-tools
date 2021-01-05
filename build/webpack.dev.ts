import { ProxyConfigMap } from 'webpack-dev-server';
import { merge } from 'webpack-merge';
import baseConfig from './webpack.base';

const proxy: ProxyConfigMap = {
    '/api': {
        target: 'http://39.99.44.98:53000',
        pathRewrite: {
            '^/api': '',
        },
    },
};

const config = merge(baseConfig, {
    mode: 'development',
    output: {
        filename: '[name].js',
    },
    devServer: {
        proxy,
        hot: true,
        open: true,
        port: 4000,
        host: 'localhost',
        contentBase: '../dist',
    },
});

export default config;
