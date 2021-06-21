<template>
  <div>
    <el-drawer class="drawer_wrap"
               title="资产管理"
               :visible.sync="assetDrawerVisible"
               :before-close="handleClose"
               direction="ltr"
               size="650px">
      <el-row>
        <el-col :span="8"><span>客户：{{rowData.businessName}}</span></el-col>
        <el-col :span="8"><span>授信额度：{{rowData.creditLines}}元</span></el-col>
        <el-col :span="8"><span>贷款金额：{{rowData.loanPrice}}元</span></el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span>最低价值线：{{rowData.lowestPriceLine}}元</span></el-col>
        <el-col :span="8"><span>资产价值：{{rowData.assetPrice}}元</span></el-col>
        <el-col :span="8"><span>质物价值：{{rowData.carPrice}}元</span></el-col>
      </el-row>
      <el-row>
        <el-form>
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input v-model="searchData.name" style="width: 150px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编号" prop="no">
              <el-input v-model="searchData.no" style="width: 150px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
          </el-col>
        </el-form>
      </el-row>
      <el-table :data="tableData" border
                stripe
                style="width: 92%;margin:auto 20px" :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="编号" prop="no"></el-table-column>
        <el-table-column label="规格" prop="specifications"></el-table-column>
        <el-table-column label="质物估值" prop="loanValue"></el-table-column>
        <el-table-column label="出质人" prop="pledgorName"></el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
  export default {
    name: "assetViewDrawer",
    props: ['assetDrawer', 'rowData'],
    data() {
      return {
        assetDrawerVisible: false,
        searchData: {name: '', no: ''},
        tableData: [],
      }
    },
    methods: {
      handleClose(done) {
        this.searchData = {name: '', no: ''};
        done();
      },
      async search() {
        // console.log(this.searchData, this.rowData);
        await this.$axios.post('carloan/assets/findAllPledgeListByCustomerIdInLoan', {
          "customerId": this.rowData.customerId,
          "name": this.searchData.name,
          "no": this.searchData.no,
          "current": 1,
          "size": 100,
        }).then((response) => {
          this.tableData = response.data.data.records;
        })
      }
    },
    watch: {
      assetDrawer(val, oldVal) {
        // console.log(this.rowData);
        this.assetDrawerVisible = true;
        this.search();
      }
    }
  }
</script>

<style scoped>
  .drawer_wrap .el-row {
    margin: auto 20px 20px 20px;
  }

  span {
    float: left;
  }
</style>
