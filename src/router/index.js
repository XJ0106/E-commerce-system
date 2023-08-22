//导入vue安装
import Vue from 'vue'
//导入路由
import Router from "vue-router"
//导入登录页面
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome/Welcome'
import Users from '../components/Users/Users'
import Roles from '../components/Roles/Roles'
import Rights from '../components/Roles/Rights'
import Goods from '../components/Goods/Goods'
import Params from '../components/Goods/Params'
import Categonies from '../components/Goods/Categonies'
import Add from '../components/Goods/Add'
import orders from '../components/Orders/orders'
import reports from '../components/Report/reports'
Vue.use(Router)

const router = new Router({
  routes: [

    {
      path: '/',
      redirect: "/login"

    },
    {
      path: '/login',
      name: 'Login-vue',
      component: Login
    },
    {
      path: '/home',
      name: 'home-vue',
      component: Home,
      //redirect进行重定向，登录默认访问welcome这个页面
      redirect: '/Welcome',
      //配置子级路由
      children: [
        {
          path: '/Welcome',
          component: Welcome
        },
        // 配置Users路径
        {
          path: '/Users',
          component: Users
        },
        //角色列表路径
        {
          path:'/Roles',
          component: Roles
        },
        //权限管理路径
        {
          path:'/Rights',
          component: Rights
        },
        {
          path:'/Goods',
          component: Goods
        },
        {
          path:'/Params',
          component: Params
        },
        {
          path:'/categories',
          component: Categonies
        },
        {
          path:'/Add',
          component: Add
        },
        {
          path:'/orders',
          component: orders
        },
        {
          path:'/reports',
          component: reports
        }
       
       
      ]

    },
  ]
})
//挂载一个路由导航卫视to代表要问的路径，form你从哪里来的，next要去哪个路径
router.beforeEach((to, form, next) => {
  //如果去登录页面直接放行
  if (to.path == '/login')
    return next();
  //获取保存的coken值
  const tokenStr = window.sessionStorage.getItem('token');
  //进行判断如果没有token强制跳回登录页面
  if (!tokenStr)
    //让他跳回login页面
    return next('/login')
  next()
})
//抛出router
export default router