import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex);

const state = {
  menuData: '',
  tabsItem: [
    {title: '首页', ref: '/mainf/wel'}
  ],
  activeIndex: '/mainf/wel'
};

const mutations = {
  updateMenuData(state, data) {
    state.menuData = data;
  },
  // 单击导航栏时添加标签页
  addTab(state, data) {
    console.log(state.tabsItem);
    let flag = 0;
    state.tabsItem.map((value) => {
      if (value.ref === data.ref) {
        flag += 1;
      }
    });
    if (flag === 0) {
      state.tabsItem.push(data);
    }
    state.activeIndex = data.ref;
  },
  clearTab() {
    state.tabsItem = [
      {title: '首页', ref: '/mainf/wel'}
    ];
    state.activeIndex = '/mainf/wel';
  }
};

const getters = {
  getMenu: menuData => {
    return menuData;
  },
  getTabs: tabsItem => {
    return tabsItem;
  },
  getActiveIndex: activeIndex => {
    return activeIndex;
  }
};


export default new Vuex.Store({
  state,
  mutations,
  getters
})
