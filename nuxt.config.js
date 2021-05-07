export default {
  router: {
    linkActiveClass: 'active',
    extendRoutes(routes, resolve) {
      // 清空nuxt 根据 pages 目录生成的路由
      routes.splice(0)
      // 重写路由
      routes.push(
        ...[
          {
            path: '/',
            component: resolve(__dirname, 'pages/layout'),
            children: [
              {
                name: 'home', //首页
                path: '',
                component: resolve(__dirname, 'pages/home/index.vue'),
              },
              {
                name: 'login', // 登录
                path: '/login',
                component: resolve(__dirname, 'pages/login/index.vue'),
              },
              {
                name: 'register', // 注册
                path: '/register',
                component: resolve(__dirname, 'pages/login/index.vue'),
              },
              {
                name: 'settings', // 个人设置
                path: '/settings',
                component: resolve(__dirname, 'pages/settings/index.vue'),
              },
              {
                name: 'profile', // 用户信息
                path: '/profile/:username',
                component: resolve(__dirname, 'pages/profile/index.vue'),
              },
              {
                name: 'profileFavorites', // 用户喜欢的文章
                path: '/profile/:username/favorites',
                component: resolve(__dirname, 'pages/profile/index.vue'),
              },
              {
                name: 'addArticle', // 新增文章
                path: '/editor',
                component: resolve(__dirname, 'pages/editor/index.vue'),
              },
              {
                name: 'editor', // 编辑文章
                path: '/editor/:slug',
                component: resolve(__dirname, 'pages/editor/index.vue'),
              },
              {
                name: 'article', // 文章详情
                path: '/article/:slug',
                component: resolve(__dirname, 'pages/article/index.vue'),
              },
            ],
          },
        ]
      )
    },
  },
  plugins: ['~/plugins/request.js', '~/plugins/dayjs.js'],
}
