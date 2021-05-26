<template>
  <div class="block">
    <el-pagination align='left' @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="current_page"
                   :page-sizes="[1,5,10,20]"
                   :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "Pager",
    props: ['dataList', 'currentPage', 'totalSize'],
    data() {
      return {
        current_page: 1, // 当前页码
        total: 0, // 总条数
        pageSize: 10, // 每页的数据条数
      }
    },
    methods: {
      initData() {
        console.log('pager init',this.dataList);
        this.total = this.dataList.length;
      },
      //每页条数改变时触发 选择一页显示多少行
      handleSizeChange(val) {
        // console.log('handleSizeChange',val);
        this.current_page = 1;
        this.pageSize = val;
        // let sdata = this.dataList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        this.$emit('returnsliceData', {
          currentPage: this.current_page,
          pageSize: this.pageSize
        });
      },
      //当前页改变时触发 跳转其他页
      handleCurrentChange(val) {
        // console.log('handleCurrentChange',val);
        this.current_page = val;
        // let sdata = this.dataList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        this.$emit('returnsliceData', {
          currentPage: this.current_page,
          pageSize: this.pageSize
        });
      },
    },
    watch: {
      currentPage(val, oldVal) {
        this.current_page = val;
      },
      totalSize(val, oldVal) {
        console.log('watch totalSize',val);
        this.total = val;
      }
    },
    mounted() {
      this.initData();
    }
  }
</script>

<style scoped>
  .block {
    padding-bottom: 20px;
  }
</style>
