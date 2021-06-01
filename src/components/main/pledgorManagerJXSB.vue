<template>
  <div>
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
          <el-select v-model="searchData.warehouseId">
            <el-option v-for="option in storageOptions"
                       :key="option.id"
                       :label="option.agencyAbbreviation"
                       :value="option.id"></el-option>
          </el-select>
        </el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="8"><label for="">状态</label></el-col>
        <el-col :span="16" class="select_wrap">
          <el-select v-model="searchData.state">
            <el-option v-for="option in statusOption"
                       :key="option.value"
                       :label="option.label"
                       :value="option.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-col>
      <el-col :span="8">
        <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="add">添加</el-button>
      </el-col>
    </el-row>
    <el-tabs v-model="activeTab" @tab-click="handleClick" style="margin: 20px;">
      <el-tab-pane label="全部" name="pane-0">
        <PledgorTable :tableData="tableData"/>
      </el-tab-pane>
      <el-tab-pane label="待完善" name="pane-1">
        <PledgorTable :tableData="tableData"/>
      </el-tab-pane>
      <el-tab-pane label="待配置" name="pane-2">
        <PledgorTable :tableData="tableData"/>
      </el-tab-pane>
      <el-tab-pane label="已完成" name="pane-3">
        <PledgorTable :tableData="tableData"/>
      </el-tab-pane>
    </el-tabs>
    <Pager :dataList="tableData" :currentPage="currentPage" :totalSize="total"
           @returnsliceData="accpetSliceData" class="pager"></Pager>
  </div>
</template>

<script>
  import PledgorTable from '../tools/pledgorTable'
  import Pager from '../tools/Pager'

  export default {
    name: "pledgorManagerJXSB",
    components: {PledgorTable, Pager},
    data() {
      return {
        activeTab: 'pane-0',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        searchData: {businessName: '', mobile: '', idCardNo: '', warehouseId: '', state: ''},
        tableData: [],//用于切换标签页区分用的表格数据
        storageOptions: [],
        statusOption: [
          {value: '', label: '全部'},
          {value: '0', label: '未完善'},
          {value: '1', label: '待配置'},
          {value: '2', label: '已完成'},
        ],
        dataAll: {data: [], total: ''},
        dataP1: {data: [], total: ''},
        dataP2: {data: [], total: ''},
        dataP3: {data: [], total: ''},
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
        let data = JSON.parse(JSON.stringify(this.searchData));
        data.current = 1;
        data.size = this.pageSize;
        console.log(data);
        this.$axios.post('baseInfo/customer/list', data).then((response) => {
          this.currentPage = 1;
          this.dataAll.data = response.data.data.records;
          this.dataAll.total = response.data.data.totalSize;
        })
      },
      add() {

      },
      handleClick(tab, event) {
        console.log(tab.name, event);
        if (tab.name === 'pane-1') {
          this.tableData = this.dataP1.data;
          this.total = this.dataP1.total;
          this.searchData.state = 0;
        } else if (tab.name === 'pane-2') {
          this.tableData = this.dataP2.data;
          this.total = this.dataP2.total;
          this.searchData.state = 1;
        } else if (tab.name === 'pane-3') {
          this.tableData = this.dataP3.data;
          this.total = this.dataP3.total;
          this.searchData.state = 2;
        } else if (tab.name === 'pane-0') {
          this.tableData = this.dataAll.data;
          this.total = this.dataAll.total;
          this.searchData.state = '';
        }
      },
      get_storageOptions() {
        this.$axios.post('baseInfo/agency/storageList', {"current": 1, "size": 100}).then((response) => {
          // this.storageOption = JSON.parse(JSON.stringify(response.data.data.records));
          this.storageOptions = response.data.data.records;
          this.storageOptions.splice(0, 0, {agencyAbbreviation: '全部', id: ''});
        })
      },
      accpetSliceData(data) { //接受分页器返回的数据
        this.currentPage = data.currentPage;
        this.pageSize = data.pageSize;
        this.$axios.post('baseInfo/customer/list',
          { //全部
            "businessName": this.searchData.businessName,
            "mobile": this.searchData.mobile,
            "idCardNo": this.searchData.idCardNo,
            "warehouseId": this.searchData.warehouseId,
            "state": this.searchData.state,
            "current": this.currentPage,
            "size": this.pageSize,
          }).then((response) => {
          this.tableData = response.data.data.records;
          this.total = response.data.data.totalSize;
        });
      },
      init_data() {
        this.$axios.post('baseInfo/customer/list',
          { //全部
            "businessName": this.searchData.businessName,
            "mobile": this.searchData.mobile,
            "idCardNo": this.searchData.idCardNo,
            "warehouseId": this.searchData.warehouseId,
            "state": '',
            "current": this.currentPage,
            "size": this.pageSize,
          }).then((response) => {
          this.dataAll.data = response.data.data.records;
          this.dataAll.total = response.data.data.totalSize;
          this.tableData = response.data.data.records;
          this.total = response.data.data.totalSize;
        });
        this.$axios.post('baseInfo/customer/list',
          { //待完善
            "businessName": this.searchData.businessName,
            "mobile": this.searchData.mobile,
            "idCardNo": this.searchData.idCardNo,
            "warehouseId": this.searchData.warehouseId,
            "state": 0,
            "current": this.currentPage,
            "size": this.pageSize,
          }).then((response) => {
          this.dataP1.data = response.data.data.records;
          this.dataP1.total = response.data.data.totalSize;
        });
        this.$axios.post('baseInfo/customer/list',
          { //待完善
            "businessName": this.searchData.businessName,
            "mobile": this.searchData.mobile,
            "idCardNo": this.searchData.idCardNo,
            "warehouseId": this.searchData.warehouseId,
            "state": 1,
            "current": this.currentPage,
            "size": this.pageSize,
          }).then((response) => {
          this.dataP2.data = response.data.data.records;
          this.dataP2.total = response.data.data.totalSize;
        });
        this.$axios.post('baseInfo/customer/list',
          { //待完善
            "businessName": this.searchData.businessName,
            "mobile": this.searchData.mobile,
            "idCardNo": this.searchData.idCardNo,
            "warehouseId": this.searchData.warehouseId,
            "state": 2,
            "current": this.currentPage,
            "size": this.pageSize,
          }).then((response) => {
          this.dataP3.data = response.data.data.records;
          this.dataP3.total = response.data.data.totalSize;
        });
      }
    },
    mounted() {
      this.get_storageOptions();
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

  .el-select {
    float: left;
  }
</style>
