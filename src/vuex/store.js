import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex);

const state = {
  menuData: '',
};
const mutations = {
  updateMenuData(state, data) {
    state.menuData = data;
  }
}
const getters = {
  getMenu: menuData => {
    return menuData;
  }
}


export default new Vuex.Store({
  state,
  mutations,
  getters
})
