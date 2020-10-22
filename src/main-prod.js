import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont(1).css'
import { axios } from './plugins/axios'
// 注册全局树状表格
import TreeTable from 'vue-table-with-tree-grid'

// 挂载axios
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 全局注册组件
Vue.component('tree-table', TreeTable)
// 全局过滤器
Vue.filter('dateFormat', function (originval) {
  const dt = new Date(originval)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1)
  const d = dt.getDate()
  const hh = dt.getHours()
  const mm = dt.getMinutes()
  const ss = dt.getSeconds()
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
