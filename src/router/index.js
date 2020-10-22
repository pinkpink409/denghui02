import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
// import Cate from '../components/goods/cate.vue'
// import Params from '../components/goods/Params.vue'
// import Googlist from '../components/goods/goodlist.vue'
// import Add from '../components/goods/add.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "group-foo" */ '../components/Welcome.vue')
const Users = () => import(/* webpackChunkName: "group-foo" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "group-foo" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "group-foo" */ '../components/power/Roles.vue')
const Cate = () => import(/* webpackChunkName: "group-foo" */ '../components/goods/cate.vue')
const Params = () => import(/* webpackChunkName: "group-foo" */ '../components/goods/Params.vue')
const Googlist = () => import(/* webpackChunkName: "group-foo" */ '../components/goods/goodlist.vue')
const Add = () => import(/* webpackChunkName: "group-foo" */ '../components/goods/add.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children:
      [{ path: '/welcome', component: Welcome },
        { path: '/users', component: Users }, { path: '/rights', component: Rights }, { path: '/roles', component: Roles }, { path: '/categories', component: Cate }, { path: '/params', component: Params }, { path: '/goods', component: Googlist },
        { path: '/goods/add', component: Add }]
  }

  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})
// 路由导航守卫控制访问权限
// 为路由对象，添加beforeEach导航守卫
router.beforeEach((to, from, next) => {
  // 如果用户访问的登录页，直接放行
  if (to.path === '/login') return next()
  // 从sessionStorage中获取到保存的token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token，强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
