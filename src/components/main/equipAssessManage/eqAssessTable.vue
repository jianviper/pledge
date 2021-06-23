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
          <p v-if="scope.row.state===0">待评估</p>
          <p v-else-if="scope.row.state===1">评估失败</p>
          <p v-else-if="scope.row.state===2">评估完成</p>
          <p v-else-if="scope.row.state===3">已交付</p>
        </template>
      </el-table-column>
      <el-table-column v-if="state"
                       fixed="right"
                       label="操作"
                       width="120">
        <template slot-scope="scope">
          <el-button @click="assessReport(scope.$index, scope.row)" type="text" size="small">查看评估报告
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="drawer_wrap">
      <el-drawer
        title="设备评估报告"
        :visible.sync="drawer"
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
    </div>
  </div>
</template>

<script>
  import EqAssessReport from './eqAssessReport'

  export default {
    name: "eqAssessTable",
    components: {EqAssessReport},
    props: ['tableData', 'state'],
    data() {
      return {
        drawer: false,
        reportData: [],
        printObj: {
          id: 'assessReport1',
          popTitle: '设备评估报告',
          extraCss: "https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.compat.css, https://cdn.bootcdn.net/ajax/libs/hover.css/2.3.1/css/hover-min.css",
          extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
        }
      }
    },
    methods: {
      assessReport(index, rowData) {
        this.drawer = true;
        this.$axios.get('carloan/mechanicalEquipment/report/' + rowData.pledgeApplyId).then((response) => {
          this.reportData = response.data.data;
        })
      },
      goTo(dst) {
        document.querySelector(dst).scrollIntoView(true);
      }
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
</style>
