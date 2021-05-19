<template>
  <div class="block">
    <el-pagination align='left' @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-sizes="[1,5,10,20]"
                   :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="dataList.length">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "Pager",
    props: ['dataList'],
    data() {
      return {
        currentPage: 1, // 当前页码
        total: 20, // 总条数
        pageSize: 10 // 每页的数据条数
      }
    },
    methods: {
      //每页条数改变时触发 选择一页显示多少行
      handleSizeChange(val) {
        console.log('handleSizeChange',val);
        this.currentPage = 1;
        this.pageSize = val;
        let sdata = this.dataList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        this.$emit('returnsliceData', {
          data: sdata,
          currentPage: this.currentPage,
          total: this.total,
          pageSize: this.pageSize
        });
      },
      //当前页改变时触发 跳转其他页
      handleCurrentChange(val) {
        console.log('handleCurrentChange',val);
        this.currentPage = val;
        let sdata = this.dataList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        this.$emit('returnsliceData', {
          data: sdata,
          currentPage: this.currentPage,
          total: this.total,
          pageSize: this.pageSize
        });
      },
    },
  }
</script>

<style scoped>

</style>
