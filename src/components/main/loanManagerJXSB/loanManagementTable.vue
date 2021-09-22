<template>
  <div>
    <el-table :data="tableData" v-loading="loadingV"
              border
              stripe
              style="width: 100%" :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}">
      <el-table-column prop="businessName" label="公司名称" width="160"></el-table-column>
      <el-table-column prop="agencyAbbreviation" label="监管仓" width="120"></el-table-column>
      <el-table-column prop="name" label="法定代表人" width="100"></el-table-column>
      <el-table-column prop="mobile" label="联系方式" width="120"></el-table-column>
      <el-table-column prop="idCardNo" label="身份证" width="180"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="creditLines" label="授信额度" width="100"></el-table-column>
      <el-table-column v-if="state==0" prop="makeLoanPrice" label="放款金额" width="100"></el-table-column>
      <el-table-column v-if="state==1" prop="loanPrice" label="贷款金额"></el-table-column>
      <el-table-column v-if="state==1" prop="lowestPriceLine" label="最低价值线" width="100"></el-table-column>
      <el-table-column v-if="state==1" prop="assetPrice" label="资产价值"></el-table-column>
      <el-table-column v-if="state==2" prop="totalLoanPrice" label="累计贷款金额" width="100"></el-table-column>
      <el-table-column fixed="right"
                       label="操作"
                       width="120">
        <template slot-scope="scope">
          <el-button v-if="state==0" @click="assetView(scope.row)" type="text" size="small">资产查看
          </el-button>
          <el-button v-if="state==0" @click="makeLoan(scope.row)" type="text" size="small">放款
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      title="资产管理"
      :visible.sync="drawer"
      size="800px"
      direction="ltr">
      <div class="content_wrap" v-loading="drawerLoad">
        <el-row>
          <el-col :span="12"><span class="text">客户：</span>{{assessData.businessName}}</el-col>
          <el-col :span="12"><span class="text">授信额度：</span>{{assessData.businessCreditLines}}元</el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><span class="text">贷款金额：</span>{{pledgeApplyVo.price}}元</el-col>
          <el-col :span="12"><span class="text">最低价值线：</span>{{pledgeApplyVo.minimumValueLine}}元
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><span class="text">资产价值：</span>{{pledgeApplyVo.assetPrice}}元
          </el-col>
          <el-col :span="12"><span class="text">质物价值：</span>{{pledgeApplyVo.pledgePrice}}元
          </el-col>
        </el-row>
        <el-table :data="assessDrawerTableData"
                  border
                  stripe
                  style="width: 100%;margin-top: 20px"
                  :header-cell-style="{'text-align':'center'}"
                  :cell-style="{'text-align':'center'}">
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="编号" prop="no"></el-table-column>
          <el-table-column label="规格" prop="specifications"></el-table-column>
          <el-table-column label="质物价值" prop="loanValue"></el-table-column>
          <el-table-column label="出质人" prop="pledgorName"></el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  export default {
    name: "managementTable",
    props: ['tableData', 'state', 'loadingV'],
    data() {
      return {
        dialogVisible: false,
        drawer: false,
        drawerLoad: false,
        assessData: {},
        pledgeApplyVo: {},
        assessDrawerTableData: [],
        rowdata: {},
      }
    },
    methods: {
      async assetView(rowData) {
        this.drawer = true;
        this.drawerLoad = true;
        this.rowdata = JSON.parse(JSON.stringify(rowData));
        this.$axios.get('carloan/assets/findAssetsByCustomerId/' + rowData.customerId).then((response) => {
          this.assessData = response.data.data ? response.data.data : {};
          this.pledgeApplyVo = response.data.data ? response.data.data.pledgeApplyVo : {};
          this.drawerLoad = false;
        });
        this.$axios.post('carloan/assets/findAllPledgeListByCustomerIdInLoan', {
          'current': 1,
          'customerId': rowData.customerId,
          'name': '',
          'no': '',
          'size': 15
        }).then((response) => {
          this.assessDrawerTableData = response.data.data ? response.data.data.records : [];
        })
      },
      makeLoan(rowData) {

      },
    }
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }

  .el-col {
    text-align: left;
  }

  .content_wrap {
    margin: auto 20px;
  }
</style>
