import { merge } from 'webpack-merge';
import baseConfig from './webpack.base';

const config = merge(baseConfig, {
    mode: 'production',
});

export default config;
