const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 入口文件
    entry: './src/main.js',
    // 输出配置
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',  // 添加内容哈希
        chunkFilename: '[name].chunk.js',
        publicPath: '/',
        clean: true
    },
    // 开发工具配置，用于调试
    devtool: 'eval-cheap-module-source-map',
    // 模块配置
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    }
                ],
                // 新增排除规则
                exclude: /node_modules/
            }
        ]
    },
    // 插件配置
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            chunks: ['main'],
            minify: false,
            cache: true
        }),
        // 移除 HotModuleReplacementPlugin（由 devServer.hot 自动启用）
    ],
    // 缓存配置，提高构建速度
    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [__filename]
        }
    },
    // 开发服务器配置
    devServer: {
        static: {
            directory: path.join(__dirname, 'src'),
            publicPath: '/'  // 简化公共路径
        },
        devMiddleware: {
            writeToDisk: true
        },
        hot: 'only',
        port: 3000
    },
    // 性能提示配置
    performance: {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    // 代码分割配置
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/](tim-js-sdk)[\\/]/,
                    name: 'tim-vendor'
                }
            }
        }
    }
};