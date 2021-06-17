<template>
  <div>
    <el-table :data="tableData"
              border
              stripe
              style="width: 100%" :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}">
      <el-table-column prop="agencyAbbreviation" label="监管仓" width="160"></el-table-column>
      <el-table-column prop="businessName" label="公司名称" width="160"></el-table-column>
      <el-table-column prop="industry" label="支持产业" width="100">
        <template slot-scope="scope">
          <p v-if="scope.row.industry===0">汽车</p>
          <p v-else-if="scope.row.industry===1">机械设备</p>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="法定代表人" width="100"></el-table-column>
      <el-table-column prop="mobile" label="联系方式" width="120"></el-table-column>
      <el-table-column prop="idCardNo" label="身份证" width="180"></el-table-column>
      <el-table-column prop="address" label="地址" width="200"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="180">
        <template slot-scope="scope">

        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>



  export default {
    name: "LoanWaitTable",
    props: ['tableData', 'currentTab'],
    components: {},
    data() {
      return {
        czrDrawerVisible: false,
        proConVisible: false,
        customerId: '',
        rowdata: {},
      }
    },
    methods: {
    }

  }
</script>

<style scoped>

</style>
