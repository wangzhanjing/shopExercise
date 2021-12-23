import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import ZkTable from 'vue-table-with-tree-grid'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import axios from 'axios'
// 导入富文本编辑器
// import VueQuillEditor from 'vue-quill-editor'
Vue.component('tree-table', ZkTable)
// 需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
// 在request拦截器中展示进度条
axios.interceptors.request.use(config => {
  // console.log(config)
  nProgress.start()
  // 在最后必须return config
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 时间格式过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}-${mm}-${ss}`
})
// 在response拦截器中，隐藏进度条
axios.interceptors.response.use(config => {
  nProgress.done()
  return config
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
