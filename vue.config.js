// const { resolve } = require("core-js/fn/promise")

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'components': '@/components',
        'content': 'components/content',
        'common': '@/common',
        'assets': '@/assets',
        'network': '@/network',
        'views': '@/views',
      }
    }
  }
}

// const path = require('path')
// const resolve = dir => path.join(__dirname, dir)

// module.exports = {
//   chainWebpack: config => {
//     // 设置快捷路径， @ 表示 'src' ，components 表示 'src/components'
//     config.resolve.alias
//       .set('@', resolve('src'))
//       .set('assets', resolve('src/assets'))
//       .set('components', resolve('src/components'))
//       .set('views', resolve('src/views'))
//       .set('network', resolve('src/network'))
//   },
// }
