<template>
  <div class="header">
    <h1 class="logo">后台管理系统</h1>
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
        this.$router.replace('/');
      }
    }
  }
</script>

<style>
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
