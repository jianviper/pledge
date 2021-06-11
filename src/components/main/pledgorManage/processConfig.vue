<template>
  <div>
    <el-drawer
      title="流程配置"
      :visible.sync="czrDrawerVisible"
      :before-close="handleClose"
      direction="ltr"
      size="650px">
      <div style="margin: auto 20px;">
        <h1 style="text-align: left;">客户基本信息</h1>
        <el-divider style="margin:10px auto"></el-divider>

      </div>
    </el-drawer>
  </div>
</template>

<script>
  export default {
    name: "processConfig",
    props: ['drawerVisible', 'rowData'],
    data() {
      return {
        czrDrawerVisible: false,
      }
    },
    methods: {
      handleClose(done) {
        done();
      }
    },
    watch: {
      drawerVisible(val, oldVal) {
        this.czrDrawerVisible = true;
        // this.init_data();
      }
    }
  }
</script>

<style scoped>

</style>
