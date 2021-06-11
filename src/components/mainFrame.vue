<template>
  <el-container>
    <el-header>
<!--      顶部栏-->
      <Header/>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <Aside/>
      </el-aside>
      <el-main>
        <!--        标签页-->
        <TabPane/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import Header from './frame/header'
  import Aside from './frame/aside'
  import TabPane from './parts/tabPane'

  export default {
    name: "mainFrame",
    components: {TabPane, Aside, Header},
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style scoped>
  .el-container {
    height: 100vh;
  }

  .el-header {
    background-color: #409EFF;
    color: #333;
    text-align: center;
    height: 40px !important;
    line-height: 40px;
  }

  .el-aside {
    background-color: #222e3c;
    color: #333;
    text-align: center;
    overflow: scroll;
    margin-top: 20px;
  }

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }

  .el-main {
    text-align: center;
    padding: 0;
  }
</style>
