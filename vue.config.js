const isProduction = process.env.NODE_ENV === 'production'
const cdn = {
  css: ['https://cdn.bootcss.com/iview/3.4.2/styles/iview.css'],
  js: [
    'https://cdn.bootcss.com/vue/2.6.10/vue.runtime.min.js',
    'https://cdn.bootcss.com/vue-router/3.0.3/vue-router.min.js',
    'https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js',
    'https://cdn.bootcss.com/axios/0.18.0/axios.min.js',
    'https://cdn.bootcss.com/iview/3.4.2/iview.min.js',
    'https://cdn.bootcss.com/echarts/4.2.1/echarts.min.js'
  ]
}
module.exports = {
  // 基本路径
  publicPath: isProduction ? './' : '/',
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // webpack配置
  chainWebpack: config => {
    // config.module
    //   .rule('images')
    //   .test(/\.(jpg|png|gif|bmp|jpeg)$/)
    //   .use('url-loader')
    //   .loader('url-loader')
    //   .tap(options => {
    //     return {
    //       limit: 10240,
    //       outputPath: 'img',
    //       name: '[name]-[hash:8].[ext]'
    //     }
    //   })
    // 生产环境配置
    if (isProduction) {
      // 删除预加载
      config.plugins.delete('preload')
      config.plugins.delete('prefetch')
      // 压缩代码
      config.optimization.minimize(true)
      // 分割代码
      config.optimization.splitChunks({
        chunks: 'all'
      })
      // 生产环境注入cdn
      config.plugin('html')
        .tap(args => {
          args[0].cdn = cdn
          return args
        })
    }
  },
  configureWebpack: config => {
    if (isProduction) {
      // 用cdn方式引入
      config.externals = {
        'vue': 'Vue',
        'vuex': 'Vuex',
        'vue-router': 'VueRouter',
        'axios': 'axios',
        'iview': 'Iview',
        'echarts': 'echarts'
      }
    } else {
      // 为开发环境修改配置...
    }
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  devServer: {
    host: '127.0.0.1',
    port: 8090, // 端口
    open: true, // 自动开启浏览器
    compress: false, // 开启压缩
    overlay: {
      warnings: true,
      errors: true
    }
    // proxy: {
    //   '/apis': {
    //     target: 'http://106.13.41.122:8000', // target host
    //     ws: true, // proxy websockets
    //     changeOrigin: true, // needed for virtual hosted sites
    //     pathRewrite: {
    //       '^/apis': '' // rewrite path
    //     }
    //   }
    // }
  }
}
