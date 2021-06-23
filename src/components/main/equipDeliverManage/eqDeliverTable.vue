<template>
  <div>
    <el-table :data="tableData"
              border
              stripe
              style="width: 100%" :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}">
      <el-table-column prop="businessName" label="公司名称" width="160"></el-table-column>
      <el-table-column prop="agencyAbbreviation" label="监管仓" width="160"></el-table-column>
      <el-table-column prop="name" label="法定代表人" width="100"></el-table-column>
      <el-table-column prop="mobile" label="联系方式" width="120"></el-table-column>
      <el-table-column prop="idCardNo" label="身份证" width="180"></el-table-column>
      <el-table-column prop="pledgePrice" label="评估价值" width="100"></el-table-column>
      <el-table-column prop="pledgeNum" label="质物数量" width="80"></el-table-column>
      <el-table-column prop="applyTime" label="申请时间" width="180">
        <template slot-scope="scope">
          {{scope.row.applyTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <p v-if="scope.row.state===0">未确认</p>
          <p v-else-if="scope.row.state===2">已确认</p>
        </template>
      </el-table-column>
      <el-table-column v-if="state"
                       fixed="right"
                       label="操作"
                       width="120">
        <template slot-scope="scope">
          <el-button @click="deliverStateView(scope.$index, scope.row)" type="text" size="small">查看交付状态
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      title="设备交付状态"
      :visible.sync="drawer"
      size="800px"
      direction="ltr">
      <div class="content_wrap">
        <p style="text-align: left">{{rowdata.businessName}}</p>
        <el-row>
          <el-col :span="12"><span class="text">质押数量：</span>{{deliverData.pledgeNum}}</el-col>
          <el-col :span="12"><span class="text">已安装：</span>{{deliverData.installedNum}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><span class="text">待确认：</span>{{deliverData.waitConfirmedNum}}</el-col>
          <el-col :span="12"><span class="text">确认失败：</span>{{deliverData.failNum}}</el-col>
        </el-row>
        <el-table :data="deliverData.mechanicalEquipmentDeliveryVoList"
                  border
                  stripe
                  style="width: 100%;margin-top: 20px"
                  :header-cell-style="{'text-align':'center'}"
                  :cell-style="{'text-align':'center'}">
          <el-table-column label="序号" prop="id"></el-table-column>
          <el-table-column label="名称" prop="mechanicalName"></el-table-column>
          <el-table-column label="规格" prop="mechanicalSpecifications"></el-table-column>
          <el-table-column label="编号" prop="mechanicalNo"></el-table-column>
          <el-table-column label="评估价值" prop="evaluationValue"></el-table-column>
          <el-table-column label="状态" width="80">
            <template slot-scope="scope">
              <p v-if="scope.row.state===0">待确认</p>
              <p v-else-if="scope.row.state===1">已安装</p>
              <p v-else-if="scope.row.state===2">确认失败</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  export default {
    name: "eqDeliverTable",
    props: ['tableData', 'state'],
    data() {
      return {
        drawer: false,
        deliverData: [],
        rowdata: {},
      }
    },
    methods: {
      deliverStateView(index, rowData) {
        this.drawer = true;
        this.rowdata = JSON.parse(JSON.stringify(rowData));
        this.$axios.get('carloan/mechanicalEquipmentDelivery/list/' + rowData.pledgeApplyId).then((response) => {
          this.deliverData = response.data.data;
        })
      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin-top: 10px;
  }

  .el-col {
    text-align: left;
  }

  .content_wrap {
    margin: auto 20px;
  }

  .text {
    display: inline-block;
    width: 80px;
  }
</style>
