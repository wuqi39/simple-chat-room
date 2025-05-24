module.exports = {
    plugins: {
        '@tailwindcss/postcss': {},  // 替换原 tailwindcss 为 @tailwindcss/postcss
        autoprefixer: {},
        'postcss-preset-env': {
            browsers: 'last 2 versions'
        }
    }
};