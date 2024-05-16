const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
    devServer: {
        port: 8081,
        open: true,
    },
    configureWebpack: {
        name: process.env.VUE_APP_TITLE
    },
    chainWebpack: config => {
        // 让 svg-sprite-loader 处理 icons 目录下的 svg
        config.module.rule('svg').exclude.add(path.resolve(__dirname, 'src/icons')).end()
        config.module.rule('icons').test(/\.svg$/).include.add(path.resolve(__dirname, 'src/icons')).end()
            .use('svg-sprite-loader').loader('svg-sprite-loader').options({
                symbolId: 'icon-[name]'
            })
    }
});
