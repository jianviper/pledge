<template>
  <div>
    <el-row>
      <el-col>
        <el-menu active-text-color="#409EFF" router>
          <el-submenu v-for="(item,index) in menuData" :key="index" :index="item.treeSort+''">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span class="el-cascader-menu__empty-text">{{item.menuName}}</span>
            </template>
            <el-menu-item v-for="(subItem,subIndex) in item.secondLevelMenuList" :key="subIndex"
                          :index="subItem.menuHref" class="subMenu" @click="handleOpen">
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
      setMenuData() {
        // this.menuData = this.$store.getters.getMenu.menuData.reverse();
        let md = JSON.parse(sessionStorage.getItem('menuData')).reverse();
        md.map((item, index) => {
          md[index].secondLevelMenuList = item.secondLevelMenuList.reverse();
        });
        this.menuData = md;
      },
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
