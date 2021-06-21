<template>
  <div>
    <!--    start-搜索-->
    <el-row>
      <el-col :span="8">
        <el-col :span="8"><label for="businessName">公司</label></el-col>
        <el-col :span="16">
          <el-input id="businessName" placeholder="请输入公司名称" v-model="searchData.businessName">
            <i class="el-icon-close del" slot="suffix" @click="iconClick"></i>
          </el-input>
        </el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="8"><label for="mobile">手机</label></el-col>
        <el-col :span="16">
          <el-input id="mobile" placeholder="请输入手机号" v-model="searchData.mobile">
            <i class="el-icon-close del" slot="suffix" @click="iconClick"></i>
          </el-input>
        </el-col>
      </el-col>
      <el-col :span="7">
        <el-col :span="8"><label for="idCardNo">身份证</label></el-col>
        <el-col :span="16">
          <el-input id="idCardNo" placeholder="请输入身份证号码" v-model="searchData.idCardNo">
            <i class="el-icon-close del" slot="suffix" @click="iconClick"></i>
          </el-input>
        </el-col>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px">
      <el-col :span="8">
        <el-col :span="8"><label for="">监管仓</label></el-col>
        <el-col :span="16">
          <el-select v-model="searchData.warehouseId" style="float: left">
            <el-option v-for="option in storageOptions"
                       :key="option.id"
                       :label="option.agencyAbbreviation"
                       :value="option.id"></el-option>
          </el-select>
        </el-col>
      </el-col>
      <el-col :span="8">
        <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
      </el-col>
    </el-row>
    <!--    end-搜索-->
    <!--    start-标签页-->
    <el-tabs v-model="activeTab" @tab-click="handleClick" style="margin: 20px;">
      <el-tab-pane label="已授信" name="pane-0">
        <LoanAlreadyTable :tableData="LoanAlreadyTableData" :currentTab="activeTab"
                          @returnLoanAlreadyTable="accpetLoanAlreadyTable"/>
        <!--    start-分页器-->
        <Pager :dataList="LoanAlreadyTableData" :currentPage="currentPage" :totalSize="total[0]" :page_size="pageSize"
               @returnsliceData="accpetAlreadySliceData" class="pager"></Pager>
        <!--    end-分页器-->
      </el-tab-pane>
      <el-tab-pane label="待授信" name="pane-1">
        <LoanWaitTable :tableData="LoanWaitTableData" :currentTab="activeTab"
                       @returnLoanWaitTable="accpetLoanWaitTable"/>
        <!--    start-分页器-->
        <Pager :dataList="LoanWaitTableData" :currentPage="currentPage" :totalSize="total[1]" :page_size="pageSize"
               @returnsliceData="accpetWaitSliceData" class="pager"></Pager>
        <!--    end-分页器-->
      </el-tab-pane>
    </el-tabs>
    <!--    end-标签页-->

  </div>
</template>

<script>
  import LoanAlreadyTable from './LoanAlreadyTable'
  import LoanWaitTable from './LoanWaitTable'
  import Pager from '../../parts/Pager'


  export default {
    name: "pledgorManagerDKJXSB",
    components: {LoanAlreadyTable, LoanWaitTable, Pager},
    data() {
      return {
        searchFlag: false,
        searchData: {businessName: '', mobile: '', idCardNo: '', warehouseId: ''},
        storageOptions: [],
        LoanAlreadyTableData: [],
        LoanWaitTableData: [],
        activeTab: 'pane-0',
        currentPage: 1,
        pageSize: 10,
        total: [],
        tableDataList: [],
      }
    },
    methods: {
      iconClick(ev) { //点击输入框右侧 x 按钮清空输入框
        let ele_id = ev.path[3].getElementsByTagName('input')[0].id;
        if (ele_id === 'businessName') {
          this.searchData.businessName = '';
        } else if (ele_id === 'mobile') {
          this.searchData.mobile = '';
        } else if (ele_id === 'idCardNo') {
          this.searchData.idCardNo = '';
        }
      },
      search() {
        // console.log(this.searchData);
        this.searchFlag = true;
        this.currentPage = 1;
        this.alreadyCreditData_init(this.pageSize);
        this.waitCreditData_init(this.pageSize);
      },
      storage_init() {
        this.$axios.post('baseInfo/agency/storageList', {"current": 1, "size": 100}).then((response) => {
          this.storageOptions = JSON.parse(JSON.stringify(response.data.data.records));
          this.storageOptions.splice(0, 0, {agencyAbbreviation: '全部', id: ''});
        })
      },
      handleClick(tab) {
        // console.log(tab.name, this.activeTab, this.tableDataList);
        this.currentPage = 1;
      },
      async alreadyCreditData_init(pageSize = 20) {
        await this.$axios.post('search/credit_aggregation/alreadyCreditList',
          { //全部
            "businessName": this.searchFlag ? this.searchData.businessName : '',
            "mobile": this.searchFlag ? this.searchData.mobile : '',
            "idCardNo": this.searchFlag ? this.searchData.idCardNo : '',
            "warehouseId": this.searchFlag ? this.searchData.warehouseId : '',
            "current": this.currentPage,
            "size": pageSize,
          }).then((response) => {
          this.LoanAlreadyTableData = response.data.data.records.slice(0, this.pageSize);
          this.total[0] = response.data.data.totalSize;
        })
      },
      async waitCreditData_init(pageSize = 20) {
        await this.$axios.post('search/credit_aggregation/waitCreditList',
          { //全部
            "businessName": this.searchFlag ? this.searchData.businessName : '',
            "mobile": this.searchFlag ? this.searchData.mobile : '',
            "idCardNo": this.searchFlag ? this.searchData.idCardNo : '',
            "warehouseId": this.searchFlag ? this.searchData.warehouseId : '',
            "current": this.currentPage,
            "size": pageSize,
          }).then((response) => {
          this.LoanWaitTableData = response.data.data.records.slice(0, this.pageSize);
          this.total[1] = response.data.data.totalSize;
        })
        //初始化第一个标签页的表格数据
        // this.tableData = this.tableDataList[parseInt(this.activeTab.split('-')[1])].data.slice(0, this.pageSize);
        // this.total = this.tableDataList[parseInt(this.activeTab.split('-')[1])].total;
      },
      accpetAlreadySliceData(data) {
        this.currentPage = data.currentPage;
        this.pageSize = data.pageSize;
        this.alreadyCreditData_init(this.pageSize);
      },
      accpetLoanAlreadyTable(data) {
        if (data) {
          this.alreadyCreditData_init(this.pageSize);
        }
      },
      accpetWaitSliceData(data) {
        this.currentPage = data.currentPage;
        this.pageSize = data.pageSize;
        this.waitCreditData_init(this.pageSize);
      },
      accpetLoanWaitTable(data) {
        if (data) {
          this.waitCreditData_init(this.pageSize);
        }
      }
    },
    mounted() {
      this.storage_init();
      this.alreadyCreditData_init();
      this.waitCreditData_init();
    }
  }
</script>

<style scoped>
  label {
    line-height: 40px;
  }

  .del {
    line-height: 40px;
  }

  .pager {
    margin-top: 20px;
  }
</style>
