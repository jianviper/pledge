<template>
  <div id="app">
    <!--    <Login/>-->
    <router-view></router-view>
  </div>
</template>

<script>
  import Login from "./components/login";
  import Main from "./components/mainFrame"

  export default {
    name: 'App',
    components: {Login, Main}
  }
</script>

<style>
  * {
    margin: 0px;
    padding: 0px;
  }

  .el-table th.gutter {
    display: table-cell !important;
  }
</style>
