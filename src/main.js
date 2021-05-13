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


Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$axios = http;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
