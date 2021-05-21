import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login from "@/components/login"
import Mainf from '@/components/mainFrame'
import Test from '@/components/test'
import managementListJXSB from '@/components/main/managementListJXSB'
import regulatoryListJXSB from '@/components/main/regulatoryListJXSB'
import repoListJXSB from '@/components/main/repoListJXSB'

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
      component: Mainf,
      children: [
        {
          path: 'wel',
          name: 'wel',
          component: HelloWorld
        },
        {
          path: 'managementListJXSB',
          name: 'managementListJXSB',
          component: managementListJXSB
        },
        {
          path: 'regulatoryListJXSB',
          name: 'regulatoryListJXSB',
          component: regulatoryListJXSB
        },
        {
          path:'repoListJXSB',
          name:'repoListJXSB',
          component:repoListJXSB
        }
      ]
    },
  ]
})


const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};
