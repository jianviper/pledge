import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login from "@/components/login"
import Mainf from '@/components/mainFrame'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/mainf',
      name: 'mainf',
      meta: {// 添加该字段，表示进入这个路由是需要登录的
        requireAuth: true,
      },
      component: Mainf
    }
  ]
})
