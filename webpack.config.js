const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CompressionPlugin = require('compression-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    // 入口文件
    entry: path.resolve(__dirname, 'src/main.js'),
    // 输出配置
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js', // 保留contenthash用于缓存
        chunkFilename: '[name].[contenthash].chunk.js',
        publicPath: '/', // 保持原有根路径
        clean: true
    },
    // 开发工具配置，用于调试
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    // 模式配置
    mode: isProduction ? 'production' : 'development',
    // 模块配置
    module: {
        rules: [
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
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    'postcss-loader' // 新增postcss处理Tailwind
                ],
                exclude: /node_modules/ // 保持原有排除规则
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource'
            }
        ]
    },
    // 解析配置，确保tim-js-sdk被正确解析
    resolve: {
        // 配置模块查找路径，确保webpack会在node_modules中查找模块
        modules: ['node_modules'],
        // 自动解析的文件扩展名
        extensions: ['.js', '.json'],
        // 别名配置，确保tim-js-sdk及其子模块被正确引用
        alias: {
            'tim-js-sdk': path.resolve(__dirname, 'node_modules/tim-js-sdk'),
            'tim-js-sdk/tim-js-friendship.es.js': path.resolve(__dirname, 'node_modules/tim-js-sdk/dist/tim-js-friendship.es.js')
        }
    },
    // 插件配置
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html'),
            chunks: ['main'],
            minify: isProduction,
            cache: true
        }),
        new Dotenv(),
        ...(isProduction ? [new CompressionPlugin()] : [])
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
        static: [
            { directory: path.join(__dirname) },          // 根目录
            { directory: path.join(__dirname, 'dist') },  // 输出目录
            { directory: path.join(__dirname, 'src') }    // 源码目录
        ],
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
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                },
                timVendor: {
                    test: /[\\/]node_modules[\\/](tim-js-sdk)[\\/]/,
                    name: 'tim-vendor'
                }
            }
        },
        ...(isProduction && {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true
                        }
                    }
                })
            ]
        })
    }
};