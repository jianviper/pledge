<template>
  <div>
    <el-row>
      <el-col>
        <el-menu active-text-color="#409EFF" router :default-active="get_routePath()">
          <el-submenu v-for="(item,index) in menuData" :key="index" :index="item.treeSort+''">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span class="el-cascader-menu__empty-text">{{item.menuName}}</span>
            </template>
            <el-menu-item v-for="(subItem,subIndex) in item.secondLevelMenuList" :key="subIndex"
                          :index="subItem.menuHref" class="subMenu" @click="addTab">
              {{subItem.menuName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "myAside",
    data() {
      return {
        menuData: '',
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key.$el.innerHTML.trim(), keyPath);
      },
      /**
       * 点击左侧二级菜单
       * @param key
       */
      addTab(key) {
        // console.log(key.index, key.$el.innerHTML.trim());
        this.$store.commit('addTab', {title: key.$el.innerHTML.trim(), ref: '/mainf/' + key.index});
        sessionStorage.setItem('currentTab', JSON.stringify({
          title: key.$el.innerHTML.trim(),
          ref: '/mainf/' + key.index
        }));
      },
      setMenuData() {
        // this.menuData = this.$store.getters.getMenu.menuData.reverse();
        let md = JSON.parse(sessionStorage.getItem('menuData')).reverse();
        md.map((item, index) => {
          md[index].secondLevelMenuList = item.secondLevelMenuList.reverse();
        });
        this.menuData = md;
      },
      get_routePath() {
        // console.log('this.route', this.$route.path);
        return this.$route.path.split('/mainf/')[1];
      }
    },
    mounted() {
      this.setMenuData();
    }
  }
</script>

<style scoped>
  .el-col {
    width: 101%;
  }

  .el-menu {
    text-align: left;
    background-color: #222e3c;
  }

  .el-menu span {
    color: white;
  }

  .subMenu {
    background-color: #222e3c;
    color: #E9EEF3;
  }

  .subMenu:hover {
    background-color: white;
    color: #409EFF;
  }
</style>
