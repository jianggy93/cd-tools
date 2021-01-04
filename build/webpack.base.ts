import path from 'path';
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const src = path.resolve(__dirname, '..', 'src');

const config: Configuration = {
    entry: path.resolve(src, 'index.tsx'),
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '..', 'dist'),
    },
    resolve: {
        alias: {
            '@': src,
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: '小陈老师的工具箱',
            template: path.resolve(src, 'index.html'),
        }),
    ],
};

export default config;
