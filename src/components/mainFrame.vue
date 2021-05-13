<template>
  <el-container>
    <el-header>
      <Header/>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <Aside/>
      </el-aside>
      <el-main>
        Main
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import Header from './frame/header'
  import Aside from './frame/aside'

  export default {
    name: "mainFrame",
    components: {Aside, Header}
  }
</script>

<style scoped>
  .el-header {
    background-color: #409EFF;
    color: #333;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }

  .el-aside {
    height: 100vh;
    background-color: #222e3c;
    color: #333;
    text-align: center;
    overflow: scroll;

  }

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
</style>
