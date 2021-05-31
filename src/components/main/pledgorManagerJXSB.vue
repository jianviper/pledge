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
        <PledgorTable :tableData="dataAll"/>
      </el-tab-pane>
      <el-tab-pane label="待完善" name="pane-1">
        <PledgorTable :tableData="dataP1"/>
      </el-tab-pane>
      <el-tab-pane label="待配置" name="pane-2">
        <PledgorTable :tableData="dataP2"/>
      </el-tab-pane>
      <el-tab-pane label="已完成" name="pane-3">
        <PledgorTable :tableData="dataP3"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import PledgorTable from '../tools/pledgorTable'

  export default {
    name: "pledgorManagerJXSB",
    components: {PledgorTable},
    data() {
      return {
        activeTab: 'pane-0',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        searchData: {businessName: '', mobile: '', idCardNo: '', warehouseId: '', state: ''},
        storageOptions: [],
        statusOption: [
          {value: '', label: '全部'},
          {value: '0', label: '未完善'},
          {value: '1', label: '待配置'},
          {value: '2', label: '已完成'},
        ],
        dataAll: [],
        dataP1: [],
        dataP2: [],
        dataP3: [],
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
          // this.tableData = response.data.data.records;
          // this.total = response.data.data.totalSize;
        })
      },
      add() {

      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      get_storageOptions() {
        this.$axios.post('baseInfo/agency/storageList', {"current": 1, "size": 100}).then((response) => {
          // this.storageOption = JSON.parse(JSON.stringify(response.data.data.records));
          this.storageOptions = response.data.data.records;
          this.storageOptions.splice(0, 0, {agencyAbbreviation: '全部', id: ''});
        })
      },
      init_Data() {
        this.$axios.post('baseInfo/customer/list',
          {
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
      }
    },
    mounted() {
      this.get_storageOptions();

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
