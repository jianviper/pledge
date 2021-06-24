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
      <el-tab-pane label="全部" name="pane-0">
        <EqAssessTable :tableData="allTableData.data" :state="0"/>
        <!--    start-分页器-->
        <Pager :dataList="allTableData.data" :currentPage="currentPage" :totalSize="allTableData.total"
               :page_size="pageSize" class="pager" @returnsliceData="accpetSliceData"></Pager>
        <!--    end-分页器-->
      </el-tab-pane>
      <el-tab-pane label="待评估" name="pane-1">
        <EqAssessTable :tableData="assessWaitTableData.data" :state="1"/>
        <!--    start-分页器-->
        <Pager :dataList="assessWaitTableData.data" :currentPage="currentPage" :totalSize="assessWaitTableData.total"
               :page_size="pageSize" class="pager" @returnsliceData="accpetSliceData"></Pager>
        <!--    end-分页器-->
      </el-tab-pane>
      <el-tab-pane label="评估失败" name="pane-2">
        <EqAssessTable :tableData="assessFailTableData.data"/>
        <!--    start-分页器-->
        <Pager :dataList="assessFailTableData.data" :currentPage="currentPage" :totalSize="assessFailTableData.total"
               :page_size="pageSize" class="pager" @returnsliceData="accpetSliceData"></Pager>
        <!--    end-分页器-->
      </el-tab-pane>
      <el-tab-pane label="已完成" name="pane-3">
        <EqAssessTable :tableData="assessDoneTableData.data" :state="0"/>
        <!--    start-分页器-->
        <Pager :dataList="assessDoneTableData.data" :currentPage="currentPage" :totalSize="assessDoneTableData.total"
               :page_size="pageSize" class="pager" @returnsliceData="accpetSliceData"></Pager>
        <!--    end-分页器-->
      </el-tab-pane>
    </el-tabs>
    <!--    end-标签页-->

  </div>
</template>

<script>
  import EqAssessTable from './eqAssessTable'
  import Pager from '../../parts/Pager'

  export default {
    name: "carAssessmentListJXSB",
    components: {EqAssessTable, Pager},
    data() {
      return {
        searchData: {businessName: '', mobile: '', idCardNo: '', warehouseId: ''},
        pagingData: {businessName: '', mobile: '', idCardNo: '', warehouseId: ''},
        activeTab: 'pane-0',
        currentPage: 1,
        pageSize: 10,
        storageOptions: [],
        allTableData: {data: [], total: ''},
        assessWaitTableData: {data: [], total: ''},
        assessFailTableData: {data: [], total: ''},
        assessDoneTableData: {data: [], total: ''},
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
        console.log(this.pagingData);
        this.pagingData = JSON.parse(JSON.stringify(this.searchData));
        this.currentPage = 1;
        this.init_data(this.pageSize);
      },
      handleClick(tab) {
        // console.log(tab.name, this.activeTab, this.tableDataList);
        this.currentPage = 1;
      },
      storage_init() {
        this.$axios.post('baseInfo/agency/storageList', {"current": 1, "size": 100}).then((response) => {
          this.storageOptions = JSON.parse(JSON.stringify(response.data.data.records));
          this.storageOptions.splice(0, 0, {agencyAbbreviation: '全部', id: ''});
        })
      },
      init_data(pageSize = 20) { //初始化全部表格数据
        this.allTableData_init(pageSize);
        this.assessWaitTableData_init(pageSize);
        this.assessFailTableData_init(pageSize);
        this.assessDoneTableData_init(pageSize);
      },
      async allTableData_init(pageSize = 20) { //初始化全部数据列表
        await this.$axios.post('search/assess_aggregation/mechanicsList',
          {
            "businessName": this.pagingData.businessName,
            "mobile": this.pagingData.mobile,
            "idCardNo": this.pagingData.idCardNo,
            "warehouseId": this.pagingData.warehouseId,
            "current": this.currentPage,
            "size": pageSize,
          }).then((response) => {
          this.allTableData.data = response.data.data.records;
          this.allTableData.total = response.data.data.totalSize;
        })
      },
      async assessWaitTableData_init(pageSize = 20) { //初始化待评估列表数据
        await this.$axios.post('search/assess_aggregation/mechanicsList',
          {
            "businessName": this.pagingData.businessName,
            "mobile": this.pagingData.mobile,
            "idCardNo": this.pagingData.idCardNo,
            "warehouseId": this.pagingData.warehouseId,
            "state": 0,
            "current": this.currentPage,
            "size": pageSize,
          }).then((response) => {
          this.assessWaitTableData.data = response.data.data.records;
          this.assessWaitTableData.total = response.data.data.totalSize;
        })
      },
      async assessFailTableData_init(pageSize = 20) { //初始化评估失败列表数据
        await this.$axios.post('search/assess_aggregation/mechanicsList',
          {
            "businessName": this.pagingData.businessName,
            "mobile": this.pagingData.mobile,
            "idCardNo": this.pagingData.idCardNo,
            "warehouseId": this.pagingData.warehouseId,
            "state": 1,
            "current": this.currentPage,
            "size": pageSize,
          }).then((response) => {
          this.assessFailTableData.data = response.data.data.records;
          this.assessFailTableData.total = response.data.data.totalSize;
        })
      },
      async assessDoneTableData_init(pageSize = 20) { //初始化评估完成列表数据
        await this.$axios.post('search/assess_aggregation/mechanicsList',
          {
            "businessName": this.pagingData.businessName,
            "mobile": this.pagingData.mobile,
            "idCardNo": this.pagingData.idCardNo,
            "warehouseId": this.pagingData.warehouseId,
            "state": 2,
            "current": this.currentPage,
            "size": pageSize,
          }).then((response) => {
          this.assessDoneTableData.data = response.data.data.records;
          this.assessDoneTableData.total = response.data.data.totalSize;
        })
      },
      accpetSliceData(data) {
        this.currentPage = data.currentPage;
        this.pageSize = data.pageSize;
        this.init_data(this.pageSize);
      },
    },
    mounted() {
      this.storage_init();
      this.init_data();
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
