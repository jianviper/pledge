<template>
  <div>
    <el-table :data="tableData" v-loading="loadingV"
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
      <el-table-column fixed="right"
                       label="操作"
                       width="120">
        <template slot-scope="scope">
          <el-button v-if="scope.row.state==2" @click="priceConfirmView(scope.$index, scope.row)" type="text"
                     size="small">查看确认价格
          </el-button>
          <el-button v-if="scope.row.state==0" @click="priceConfirmView(scope.$index, scope.row)" type="text"
                     size="small">价格确认
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      title="资方价值确认"
      :visible.sync="drawer"
      size="800px"
      direction="ltr">
      <div class="content_wrap" v-loading="drawerLoad">
        <p style="text-align: left">{{rowdata.businessName}}</p>
        <el-row>
          <el-col :span="12"><span class="text">确认成功：</span>{{mechanicsData.alreadyConfirmNum}}</el-col>
          <el-col :span="12"><span class="text">待确认：</span>{{mechanicsData.waitConfirmNum}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><span class="text">确认放款总价值：</span>{{mechanicsData.totalLoanValue}}</el-col>
          <el-col :span="12"><span class="text">确认放款总金额：</span>{{mechanicsData.totalLoanAmount}}</el-col>
        </el-row>
        <el-button v-if="rowdata.state==0" type="primary" round style="float: left;margin:10px auto">提交价值确认</el-button>
        <el-table :data="mechanicsData.managementAssessVoList"
                  border
                  stripe
                  style="width: 100%;margin-top: 20px"
                  :header-cell-style="{'text-align':'center'}"
                  :cell-style="{'text-align':'center'}">
          <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="mechanicalName"></el-table-column>
          <el-table-column label="规格" prop="mechanicalSpecifications" width="50"></el-table-column>
          <el-table-column label="编号" prop="mechanicalNo"></el-table-column>
          <el-table-column label="评估价值" prop="mechanicalEvaluationValue"></el-table-column>
          <el-table-column label="回购方估值" prop="mechanicalEvaluationValue"></el-table-column>
          <el-table-column label="放款价值" prop="loanValue"></el-table-column>
          <el-table-column label="放款金额" prop="loanAmount"></el-table-column>
          <el-table-column fixed="right"
                           label="操作"
                           width="120">
            <template slot-scope="scope">
              <el-button v-if="scope.row.state==0" @click="priceConfirm(scope.$index, scope.row)" type="text"
                         size="small">价格确认
              </el-button>
              <el-button v-if="scope.row.state==2" @click="priceConfirm(scope.$index, scope.row)" type="text"
                         size="small">重新确认
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <el-dialog title="确认价格" :visible.sync="dialogVisible" class="confirmDia" width="600px">
      <el-row>
        <span>评估价值：</span>
      </el-row>
      <el-row style="margin-top: 20px;">
        <span>回购价值：</span>
      </el-row>
      <el-row>
        <el-form :model="confirmData">
          <el-form-item label="放款价值：" prop="loanValue">
            <el-input v-model="loanValue" style="width: 300px"></el-input>
          </el-form-item>
        </el-form>
      </el-row>
      <div>
        <span class="dialog-footer">
            <el-button @click="cancel()">取 消</el-button>
            <el-button type="primary" @click="add_submit">确 定</el-button>
        </span>
      </div>
    </el-dialog>
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
        mechanicsData: [],
        rowdata: {},
        confirmData: {},
      }
    },
    methods: {
      priceConfirmView(index, rowData) {
        console.log(rowData);
        this.drawer = true;
        this.drawerLoad = true;
        this.rowdata = JSON.parse(JSON.stringify(rowData));
        this.$axios.get('carloan/management_assess/mechanicsList/' + rowData.pledgeApplyId).then((response) => {
          this.mechanicsData = response.data.data;
          this.drawerLoad = false;
        })
      },
      priceConfirm(index, rowData) {
        console.log(rowData);
        this.dialogVisible = true;
      },
      add_submit() {
        console.log(this.confirmData);
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

  .confirmDia .el-row {
    text-align: left;
    margin: 10px 20px;
  }
</style>
