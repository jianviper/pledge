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
      <el-table-column prop="creditLines" label="授信额度" width="100"></el-table-column>
      <el-table-column prop="loanPrice" label="贷款金额" width="100"></el-table-column>
      <el-table-column prop="lowestPriceLine" label="最低价值线" width="100"></el-table-column>
      <el-table-column prop="assetPrice" label="资产价值" width="100"></el-table-column>
      <el-table-column prop="carPrice" label="质物价值" width="100"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button @click="assetView(scope.$index, scope.row)" type="text" size="small">资产查看
          </el-button>
          <el-button @click="modfiyCreditAmount(scope.$index, scope.row)" type="text" size="small">修改授信金额
          </el-button>
          <el-button @click="digitalCAView(scope.$index, scope.row)" type="text" size="small">查看数字凭证
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <AssetViewDrawer :assetDrawer="assetDrawerFlag" :rowData="rowdata"/>

  </div>
</template>

<script>
  import AssetViewDrawer from './assetViewDrawer'

  export default {
    name: "LoanAlreadyTable",
    props: ['tableData'],
    components: {AssetViewDrawer},
    data() {
      return {
        assetDrawerFlag: false,
        proConVisible: false,
        creditAmountVisible: false,
        customerId: '',
        rowdata: {},
      }
    },
    methods: {
      assetView(index, rowData) {
        this.rowdata = JSON.parse(JSON.stringify(rowData));
        this.assetDrawerFlag = new Date().getTime();
      },
      modfiyCreditAmount(index, rowData) {
        this.$prompt('授信金额', '修改', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: rowData.creditLines,
          inputPattern: /^[0-9]+(\.[0-9]{1,2})?$/,
          inputErrorMessage: '只能输入数字(保留两位小数)',
        }).then(({value}) => {
          // console.log(value, rowData);
          this.$axios.post('carloan/credit/update_credit_lines', {
            'businessId': rowData.businessId,
            'creditLines': value
          }).then((response) => {
            if (response.data.code === 200) {
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.$emit('returnLoanAlreadyTable', true);
            } else {
              this.$message({
                type: 'error',
                message: response.data.message
              });
            }
          })
        })
      },
      digitalCAView(index, rowData) {
        this.$message('暂未开放');
      },
    }
  }
</script>

<style scoped>

</style>
