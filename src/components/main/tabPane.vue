<template>
  <el-tabs v-model="activeIndex" type="card" @tab-click="tabClick" @tab-remove="removeTab">
    <el-tab-pane v-for="(item, index) in tabsItem"
                 :key="item.ref"
                 :label="item.title"
                 :name="item.ref"
                 :ref="item.ref"
                 :closable="item.title!=='首页'">
      <!--            <component :is="item.ref"></component>-->
      <!--            加载子组件-->
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </el-tab-pane>
  </el-tabs>
</template>

<script>

  export default {
    name: "tabPane",
    data() {
      return {}
    },
    methods: {
      tabClick(thisTab) {
        /*
        * thisTab:当前选中的tabs的实例
        * 通过当前选中tabs的实例获得当前实例的path 重新定位路由
        * */
        let val = this.tabsItem.filter(item => thisTab.name == item.ref);
        if (thisTab.label == '首页') {
          sessionStorage.removeItem('currentTab');
        } else {
          sessionStorage.setItem('currentTab', JSON.stringify({title: thisTab.label, ref: this.name}));
        }
      },
      removeTab(targetName) { // 关闭便签页
        // console.log(targetName);
        let tabs = this.tabsItem;
        let activeIndex = this.activeIndex;
        if (activeIndex === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.ref === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeIndex = nextTab.ref;
              }
            }
          });
        }

        this.activeIndex = activeIndex;
        this.tabsItem = tabs.filter((tab) => tab.ref !== targetName);
        if (JSON.parse(sessionStorage.getItem('currentTab')).ref == targetName) {
          sessionStorage.removeItem('currentTab');
        }
      },
      initTab() { //如果是刷新，加载的时候初始化刷新前的tab页
        console.log('tab', new Date().getTime());
        if (sessionStorage.getItem('currentTab')) {
          console.log(sessionStorage.getItem('currentTab'));
          console.log(this.$route);
          this.$store.commit('addTab', {
            title: JSON.parse(sessionStorage.getItem('currentTab')).title,
            ref: this.$route.path
          });
          this.activeIndex = this.$route.path;
        }
      }
    },
    computed: {
      tabsItem: {
        get: function () {
          return this.$store.getters.getTabs.tabsItem;
        },
        set: function (newValue) {
          this.$store.state.tabsItem = newValue;
        },
      },
      activeIndex: {
        get: function () {
          return this.$store.getters.getActiveIndex.activeIndex;
        },
        set: function (newValue) {
          // 当前标签页变化时触发
          this.$store.state.activeIndex = newValue;
          this.$router.push(newValue);
        }
      }
    },
    mounted() {
      this.initTab();
    }
  }
</script>

<style scoped>

</style>
