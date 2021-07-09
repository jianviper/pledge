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
        <EqDeliverTable :tableData="allTableData.data" :state="true" :loading-v="loading"/>
        <!--    start-分页器-->
        <Pager :dataList="allTableData.data" :currentPage="currentPage" :totalSize="allTableData.total"
               :page_size="pageSize" class="pager" @returnsliceData="accpetSliceData"></Pager>
        <!--    end-分页器-->
      </el-tab-pane>
      <el-tab-pane label="待确认" name="pane-1">
        <EqDeliverTable :tableData="waitTableData.data" :loading-v="loading"/>
        <!--    start-分页器-->
        <Pager :dataList="waitTableData.data" :currentPage="currentPage" :totalSize="waitTableData.total"
               :page_size="pageSize" class="pager" @returnsliceData="accpetSliceData"></Pager>
        <!--    end-分页器-->
      </el-tab-pane>
      <el-tab-pane label="已确认" name="pane-2">
        <EqDeliverTable :tableData="doneTableData.data" :state="true" :loading-v="loading"/>
        <!--    start-分页器-->
        <Pager :dataList="doneTableData.data" :currentPage="currentPage" :totalSize="doneTableData.total"
               :page_size="pageSize" class="pager" @returnsliceData="accpetSliceData"></Pager>
        <!--    end-分页器-->
      </el-tab-pane>
    </el-tabs>
    <!--    end-标签页-->
  </div>
</template>

<script>
  import EqDeliverTable from './eqDeliverTable'
  import Pager from '../../parts/Pager'

  export default {
    name: "equipmentDeliveryJXSB",
    components: {EqDeliverTable, Pager},
    data() {
      return {
        loading: false,
        searchData: {businessName: '', mobile: '', idCardNo: '', warehouseId: ''},
        pagingData: {businessName: '', mobile: '', idCardNo: '', warehouseId: ''},
        activeTab: 'pane-0',
        currentPage: 1,
        pageSize: 10,
        storageOptions: [],
        allTableData: {data: [], total: ''},
        waitTableData: {data: [], total: ''},
        doneTableData: {data: [], total: ''},
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
        this.currentPage = 1;
      },
      storage_init() {
        this.$axios.post('baseInfo/agency/storageList', {"current": 1, "size": 100}).then((response) => {
          this.storageOptions = JSON.parse(JSON.stringify(response.data.data.records));
          this.storageOptions.splice(0, 0, {agencyAbbreviation: '全部', id: ''});
        })
      },
      init_data(pageSize = 20) { //初始化全部表格数据
        this.loading = true;
        this.allTableData_init(pageSize);
        this.waitTableData_init(pageSize);
        this.doneTableData_init(pageSize);
      },
      async allTableData_init(pageSize = 20) { //初始化全部数据列表
        await this.$axios.post('search/delivery_aggregation/list',
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
          this.loading = false;
        })
      },
      async waitTableData_init(pageSize = 20) { //初始化待评估列表数据
        // this.loading = true;
        await this.$axios.post('search/delivery_aggregation/list',
          {
            "businessName": this.pagingData.businessName,
            "mobile": this.pagingData.mobile,
            "idCardNo": this.pagingData.idCardNo,
            "warehouseId": this.pagingData.warehouseId,
            "state": 0,
            "current": this.currentPage,
            "size": pageSize,
          }).then((response) => {
          this.waitTableData.data = response.data.data.records;
          this.waitTableData.total = response.data.data.totalSize;
          this.loading = false;
        })
      },
      async doneTableData_init(pageSize = 20) { //初始化评估完成列表数据
        // this.loading = true;
        await this.$axios.post('search/delivery_aggregation/list',
          {
            "businessName": this.pagingData.businessName,
            "mobile": this.pagingData.mobile,
            "idCardNo": this.pagingData.idCardNo,
            "warehouseId": this.pagingData.warehouseId,
            "state": 2,
            "current": this.currentPage,
            "size": pageSize,
          }).then((response) => {
          this.doneTableData.data = response.data.data.records;
          this.doneTableData.total = response.data.data.totalSize;
          this.loading = false;
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
