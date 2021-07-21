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
          <el-button v-if="scope.row.state==2" @click="priceConfirmView(scope.row)" type="text"
                     size="small">查看确认价格
          </el-button>
          <el-button v-if="scope.row.state==0" @click="priceConfirmView(scope.row)" type="text"
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
          <el-col :span="12"><span class="text">确认放款总价值：</span>{{mechanicsData.totalLoanValue}}元</el-col>
          <el-col :span="12"><span class="text">确认放款总金额：</span>{{mechanicsData.totalLoanAmount}}元</el-col>
        </el-row>
        <el-button v-if="rowdata.state==0" type="primary" round style="float: left;margin:10px auto"
                   @click="confirmPriceSubmit">提交价值确认
        </el-button>
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
    <el-dialog title="确认价格" :visible.sync="dialogVisible" class="confirmDia" width="600px"
               :close-on-click-modal='false' :before-close="cancel">
      <el-row>
        <span style="margin-right: 10px">评估价值：</span>{{confirmRowData.mechanicalEvaluationValue}}元
      </el-row>
      <el-row style="margin-top: 20px;">
        <span style="margin-right: 10px">回购价值：</span>{{confirmRowData.mechanicalEvaluationValue}}元
      </el-row>
      <el-row>
        <span style="margin-right: 10px">放款价值：</span>
        <el-input :class="loanInput?'':'inputError'" @keyup.native="loanEnter" type="number"
                  v-model="loanValue"
                  style="width: 300px"></el-input>
        <p v-show="tipV" class="tips">请输入放款价值</p>
        <p v-show="tipV2" class="tips">放款价值不能小于0</p>
      </el-row>
      <div>
        <span class="dialog-footer">
            <el-button @click="cancel()">取 消</el-button>
            <el-button type="primary" @click="price_submit">确 定</el-button>
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
        confirmRowData: {},
        loanValue: '',
        tipV: false,
        tipV2: false,
        loanInput: true,
      }
    },
    methods: {
      priceConfirmView(rowData) {
        this.drawer = true;
        this.drawerLoad = true;
        this.rowdata = JSON.parse(JSON.stringify(rowData));
        this.$axios.get('carloan/management_assess/mechanicsList/' + rowData.pledgeApplyId).then((response) => {
          this.mechanicsData = response.data.data;
          this.drawerLoad = false;
        })
      },
      priceConfirm(index, rowData) {
        this.confirmRowData = JSON.parse(JSON.stringify(rowData));
        this.loanValue = rowData.loanValue ? rowData.loanValue : '';
        this.dialogVisible = true;
      },
      loanEnter() {
        this.loanInput = true;
        this.tipV = false;
      },
      price_submit() {
        if (this.loanValue && parseInt(this.loanValue) > 0) {
          this.$axios.post('carloan/management_assess/mechanicsSave', {
            'id': this.confirmRowData.id,
            'loanValue': this.loanValue
          }).then((response) => {
            if (response.data.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.tipV = false;
              this.tipV2 = false;
              this.dialogVisible = false;
              this.priceConfirmView(this.rowdata);
            }
          })
        } else {
          if (parseInt(this.loanValue) < 0) {
            this.tipV = false;
            this.tipV2 = true;
          } else {
            this.loanInput = false;
            this.tipV = true;
          }
        }
      },
      confirmPriceSubmit() {
        console.log(this.rowdata);
        let flag = false;
        this.mechanicsData.managementAssessVoList.map((item) => {
          console.log(item);
          if (item.state == 0) {
            flag = true;
          }
        })
        if (flag) {
          this.$confirm('还有未确认价格的设备，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            // this.$axios.post('')
          })
        }
      },
      cancel() {
        this.loanValue = '';
        this.dialogVisible = false;
        this.tipV = false;
        this.tipV2 = false;
        this.loanInput = true;
      },
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

  .tips {
    font-size: 8px;
    color: red;
    margin-left: 85px;
  }

  .inputError {
    border: red 1px solid;
    border-radius: 4px;
  }
</style>
