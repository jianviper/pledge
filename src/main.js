// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App'
import router from './router'
import axios from 'axios'
import http from './utils/http'
import store from './vuex/store'
import 'element-ui/lib/theme-chalk/index.css'
import * as filters from './utils/filters/formatDate'

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$axios = http;
Object.keys(filters).forEach(filterName => {
  Vue.filter(filterName, filters[filterName])
});

// Object.keys(filters)得到的就是filters/index.js里面的函数名组成的数组 ['currency '] 因为这里index.js里面就一个函数所以数组里就只有一个值
//filterName 就是通过遍历['currency '] 得到的就是index.js中的每一个函数名(过滤器名字)
//filters[filterName])出发./filter/index中的某个函数

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
