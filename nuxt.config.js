
export default {
  mode: 'universal',
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
  },
  loading: { color: '#fff' },
  sass: {
    indentedSyntax: true
  },
  css: [
      { src : 'iview/dist/styles/iview.css'}
  ],
  plugins: [
      {
          src:'~plugins/iview',
          ssr:true
      }
  ],
  buildModules: [
  ],
    modules: [
        '@nuxtjs/axios',
    ],
    /* 需要使用 aixos必须配置以下两项axios和proxy*/
    axios: {
        prefix: '/api/',
        proxy: true
    },

    proxy: {
        '/api/': {
            target: 'https://192.168.1.70:3001',
            pathRewrite: {
                '^/api/': ''
            }
        }
    },
  build: {
    extend (config, ctx) {
    }
  }
}
