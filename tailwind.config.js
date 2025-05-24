module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{html,js,jsx}" // 匹配项目中的模板和脚本文件
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#FF5733', // 自定义主要颜色
                'secondary': '#33FF57' // 自定义次要颜色
            },
            fontFamily: {
                'sans': ['Roboto', 'sans-serif'] // 自定义无衬线字体
            }
        }
    },
    plugins: []
};