<template>
  <div>
    <el-table :data="tableData" v-loading="loading"
              border stripe
              style="width: 1300px" :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}">
      <el-table-column prop="businessName" label="公司名称" width="180"></el-table-column>
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
          <p v-if="scope.row.state===0">待评估</p>
          <p v-else-if="scope.row.state===1">评估失败</p>
          <p v-else-if="scope.row.state===2">评估完成</p>
          <p v-else-if="scope.row.state===3">已交付</p>
        </template>
      </el-table-column>
      <el-table-column v-if="state==0"
                       fixed="right"
                       label="操作"
                       width="120">
        <template slot-scope="scope">
          <el-button v-if="scope.row.state==2" @click="assessReport(scope.$index, scope.row)" type="text" size="small">
            查看评估报告
          </el-button>
          <el-button v-else-if="scope.row.state==0" @click="assess(scope.$index, scope.row)" type="text" size="small">
            评估
          </el-button>
        </template>
      </el-table-column>
      <el-table-column v-else-if="state==1"
                       fixed="right"
                       label="操作"
                       width="100">
        <template slot-scope="scope">
          <el-button @click="assess(scope.$index, scope.row)" type="text" size="small">评估</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="drawer_wrap">
      <el-drawer
        title="设备评估报告"
        :visible.sync="reportDrawerVisible"
        size="800px"
        direction="ltr">
        <div id="top"></div>
        <el-button id="print" type="primary" v-print="printObj">打印</el-button>
        <div id="assessReport1" style="margin-bottom: -160px">
          <EqAssessReport v-for="(item,index) in reportData" :key="index" :table-data="item"/>
        </div>
        <span class="goTop" @click="goTo('#top')">
          <i class="el-icon-caret-top" style="margin-top: 10px"></i>
        </span>
      </el-drawer>
      <el-drawer
        title="设备评估"
        :visible.sync="assessDrawerVisible"
        size="800px"
        direction="ltr">
        <div class="assess_wrap">
          <el-row>
            <el-col :span="12">评估完成：{{assessData.assessSuccessNum}}</el-col>
            <el-col :span="12">待评估：{{assessData.assessWaitNum}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">评估失败：{{assessData.assessFailNum}}</el-col>
            <el-col :span="12">评估价值：{{assessData.totalAssessPrice}}</el-col>
          </el-row>
          <div>
            <el-button type="primary" round style="margin: 10px auto;float:left;" @click="assessSubmit">提交评估任务
            </el-button>
          </div>
          <el-table :data="assessData.mechanicalEquipmentAssessVoList" ref="assessTable"
                    border stripe
                    v-loading="drawerTableLoading"
                    :header-cell-style="{'text-align':'center'}"
                    :cell-style="{'text-align':'center'}">
            <el-table-column label="名称" prop="mechanicalEquipmentName"></el-table-column>
            <el-table-column label="规格" prop="mechanicalEquipmentSpecifications"></el-table-column>
            <el-table-column label="评估价值" prop="evaluationValue" width="100"></el-table-column>
            <el-table-column label="出质人" prop="pledgorName" width="100"></el-table-column>
            <el-table-column label="状态" prop="state" width="80">
              <template slot-scope="scope">
                <p v-if="scope.row.state===0">待评估</p>
                <p v-else-if="scope.row.state===1">评估失败</p>
                <p v-else-if="scope.row.state===2">评估完成</p>
                <p v-else-if="scope.row.state===3">已交付</p>
              </template>
            </el-table-column>
            <el-table-column fixed="right"
                             label="操作"
                             width="140">
              <template slot-scope="scope">
                <el-button v-if="scope.row.state==0" @click="assessConfirm(scope.$index, scope.row)" type="text"
                           size="small">评估确认
                </el-button>
                <el-button v-if="scope.row.state==0" @click="assessDel(scope.$index, scope.row)" type="text"
                           size="small">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-drawer>
      <EqAssessConfirmDialog :assessConfirmDiaVisible="assessConDiaVisible" :assessTaskID="assessTaskId"
                             :pledgeApplyID="pledgeApplyId" :host="host"/>
    </div>
  </div>
</template>

<script>
  import EqAssessReport from './eqAssessReport'
  import EqAssessConfirmDialog from './eqAssessConfirmDialog'
  import config from '../../../../config'

  export default {
    name: "eqAssessTable",
    components: {EqAssessReport, EqAssessConfirmDialog},
    props: ['tableData', 'state', 'loading'],
    data() {
      return {
        drawerTableLoading: false,
        reportDrawerVisible: false,
        assessDrawerVisible: false,
        reportData: [],
        assessData: [],
        assessTaskId: '',
        pledgeApplyId: '',
        assessConDiaVisible: '',
        host: '',
        printObj: {
          id: 'assessReport1',
          popTitle: '设备评估报告',
          // extraCss: "https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.compat.css, https://cdn.bootcdn.net/ajax/libs/hover.css/2.3.1/css/hover-min.css",
          extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
        }
      }
    },
    methods: {
      assessReport(index, rowData) {
        this.reportDrawerVisible = true;
        this.$axios.get('carloan/mechanicalEquipment/report/' + rowData.pledgeApplyId).then((response) => {
          this.reportData = response.data.data;
        })
      },
      assess(index, rowData) {
        this.assessDrawerVisible = true;
        this.pledgeApplyId = JSON.parse(JSON.stringify(rowData)).pledgeApplyId;
        this.drawerTableLoading = true;
        this.$axios.get('carloan/mechanicalEquipmentAssess/list/' + rowData.pledgeApplyId).then((response) => {
          this.assessData = response.data.data;
          this.drawerTableLoading = false;
        });
      },
      assessConfirm(index, rowData) {
        this.assessConDiaVisible = new Date().getTime();
        this.assessTaskId = rowData.id;
      },
      assessSubmit() { //评估提交
        let flag = true;
        this.assessData.mechanicalEquipmentAssessVoList.map((item) => {
          if (item.state == 0) {
            flag = false;
          }
        });
        if (flag) {
          this.$axios.post('carloan/mechanicalEquipmentAssess/submit', {'pledgeApplyId': this.pledgeApplyId}).then((response) => {
            if (response.data.code === 200) {
              this.$message({
                message: '提交成功',
                type: 'success'
              });
              this.assessDrawerVisible = false;
              this.$emit('initTableData'); //让父组件刷新表格数据
            }
          })
        } else {
          this.$message({
            message: '还有未评估的设备',
            type: 'warning'
          });
        }

      },
      assessDel(index, rowData) {
        console.log(rowData);
        this.$confirm('是否删除此设备?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete('carloan/mechanicalEquipmentAssess/delete/' + rowData.id).then((response) => {
            if (response.data.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.assessData_init();
            } else {
              this.$message({
                message: response.data.message,
                type: 'error'
              });
            }
          })
        })
      },
      assessData_init() { //某设备提交评估后刷新表格数据
        this.$axios.get('carloan/mechanicalEquipmentAssess/list/' + this.pledgeApplyId).then((response) => {
          this.assessData = response.data.data;
        })
      },
      goTo(dst) { //回到顶部
        document.querySelector(dst).scrollIntoView(true);
      }
    },
    mounted() {
      this.host = process.env.NODE_ENV == 'test' ? config.test.proxyTable["/api"].target + 'api' : config.dev.proxyTable["/api"].target + 'api';
    }
  }
</script>

<style scoped>
  .drawer_wrap >>> .el-drawer__wrapper > div > div > .el-drawer__body {
    overflow: auto;
  }

  #print {
    position: absolute;
    top: 75px;
    left: 10px;
  }

  .goTop {
    width: 40px;
    height: 40px;
    border: 1px solid #cccccc;
    border-radius: 50%;
    position: absolute;
    top: 90%;
    left: 715px;
    cursor: pointer;
    color: #409eff;
  }

  .goTop:hover {
    background-color: #cae7ff;
  }

  .assess_wrap {
    margin: auto 20px;
  }

  .el-row {
    text-align: left;
    margin-top: 10px;
  }
</style>
