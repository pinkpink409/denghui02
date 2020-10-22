import axios from 'axios'
const baseURL = 'http://vue-shop-api.itheima.net'
axios.defaults.baseURL = `${baseURL}/api/private/v1`
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在发请求之前进行信息设置(getItem哪来的，为啥不是setitem)
  return config
})
export { axios, baseURL }
