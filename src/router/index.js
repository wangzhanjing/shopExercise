import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './route'
Vue.use(VueRouter)

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//   // to 将要访问的路径
//   // from 从哪个路径跳转而来
//   // next 是一个函数，表示放行
//   if (to.path === '/login') return next()
//   const tokenStr = window.sessionStorage.getItem('token')
//   if (!tokenStr) return next('/login')
//   return next()
// })
export default router
