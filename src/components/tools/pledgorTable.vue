<template>
  <el-table :data="tableData"
            border
            stripe
            style="width: 1061px" :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}">
    <el-table-column prop="businessName" label="公司名称" width="100"></el-table-column>
    <el-table-column prop="industry" label="支持产业" width="100"></el-table-column>
    <el-table-column prop="name" label="法定代表人" width="100"></el-table-column>
    <el-table-column prop="mobile" label="联系方式" width="100"></el-table-column>
    <el-table-column prop="idCardNo" label="身份证" width="100"></el-table-column>
    <el-table-column prop="businessAddress" label="地址" width="100"></el-table-column>
    <el-table-column prop="agencyAbbreviation" label="监管仓" width="100"></el-table-column>
    <el-table-column prop="creationTime" label="添加时间" width="120"></el-table-column>
    <el-table-column prop="state" label="状态" width="100"></el-table-column>
  </el-table>
</template>

<script>
  export default {
    name: "pledgorTable",
    props: ['tableData'],
  }
</script>

<style scoped>

</style>
