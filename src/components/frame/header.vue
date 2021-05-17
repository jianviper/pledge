<template>
  <div class="header">
    <router-link to="/mainf/wel" class="home"><h1 @click="addTab" class="logo">后台管理系统</h1></router-link>
    <div class="header_tool">
      <el-popover popper-class="popv"
                  placement="bottom"
                  width="80"
                  trigger="click">
        <ul class="tool_ul">
          <ol @click="logout">退出登录</ol>
        </ul>
        <i slot="reference" class="el-icon-more more"></i>
      </el-popover>
    </div>
  </div>
</template>

<script>
  export default {
    name: "myHeader",
    data() {
      return {}
    },
    methods: {
      logout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('menuData');
        this.$store.commit('clearTab');
        this.$router.replace('/');
      },
      addTab(key) {
        this.$store.commit('addTab', {title: '首页', ref: '/mainf/wel'});
      },
    }
  }
</script>

<style>
  .home {
    text-decoration: none;
  }

  .header {
    display: flex;
    justify-content: space-between;
  }

  .more {
    transform: rotate(90deg);
  }

  .more:hover {
    cursor: pointer;
  }

  .popv {
    min-width: 50px !important;
  }

  .tool_ul > ol {
    text-align: center;
    cursor: pointer;
  }

  .logo {
    background-color: #222e3c;
    width: 200px;
    height: 60px;
    line-height: 60px;
    color: #ffffff;
    margin-left: -20px;
  }
</style>
