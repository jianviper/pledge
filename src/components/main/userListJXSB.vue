<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-col :span="8"><label for="name">姓名</label></el-col>
        <el-col :span="16">
          <el-input id="name" placeholder="请输入姓名" v-model="searchData.name">
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
      <el-col :span="8">
        <el-col :span="8"><label for="">所属机构</label></el-col>
        <el-col :span="16">
          <el-select v-model="searchData.agencyId">
            <el-option v-for="option in agencyOptions"
                       :key="option.id"
                       :label="option.agencyAbbreviation"
                       :value="option.id"></el-option>
          </el-select>
        </el-col>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px">
      <el-col :span="8">
        <el-col :span="8"><label for="">监管仓</label></el-col>
        <el-col :span="16">
          <el-select v-model="searchData.storageId">
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
    <el-table :data="tableData"
              border
              stripe
              style="width: 1001px" :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}">
      <el-table-column prop="serial" label="序号" width="80"></el-table-column>
      <el-table-column prop="mobile" label="登录账号" width="160"></el-table-column>
      <el-table-column prop="name" label="用户姓名" width="80"></el-table-column>
      <el-table-column prop="agencyName" label="所属机构" width="100"></el-table-column>
      <el-table-column prop="warehouseNames" label="监管仓" width="200"></el-table-column>
      <el-table-column prop="roleDescription" label="角色" width="80"></el-table-column>
      <el-table-column prop="notes" label="备注" width="100"></el-table-column>
      <el-table-column prop="state" label="状态" width="80">
        <template slot-scope="scope">
          <p v-if="scope.row.state===0">正常</p>
          <p v-else-if="scope.row.state===1">失效</p>
        </template>
      </el-table-column>


    </el-table>
    <Pager :dataList="tableData" :currentPage="currentPage" :totalSize="total" @returnsliceData="accpetSliceData"></Pager>
  </div>
</template>

<script>
  import Pager from '../tools/Pager'

  export default {
    name: "userListJXSB",
    components: {Pager},
    data() {
      return {
        searchData: {state: ''},
        agencyOptions: [],
        storageOptions: [],
        statusOption: [
          {value: '', label: '全部'},
          {value: '0', label: '正常'},
          {value: '1', label: '失效'},
        ],
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total:0,
      }
    },
    methods: {
      add() {

      },
      iconClick(ev) {
        let id = ev.path[3].getElementsByTagName('input')[0].id;
        // console.log(ev, id);
        if (id === 'name') {
          this.name = '';
        } else if (id === 'code') {
          this.code = '';
        }
      },
      get_agencyOptions() {
        this.$axios.get('baseInfo/agency/allList').then((response) => {
          this.agencyOptions = response.data.data;
        })
      },
      get_storageOptions() {
        this.$axios.post('baseInfo/agency/storageList', {"current": 1, "size": 100}).then((response) => {
          this.storageOptions = response.data.data.records;
        })
      },
      init_data() {
        this.$axios.post('baseInfo/user/list',
          {
            "name": "",
            "mobile": "",
            "agencyId": "",
            "storageId": "",
            "state": "",
            "current": this.currentPage,
            "size": this.pageSize,
          }).then((response) => {
          this.tableData = response.data.data.records;
          this.total=response.data.data.totalSize;
        })
      },
      search() {
        console.log(this.searchData);
        this.$axios.post('baseInfo/user/list', this.searchData).then((response) => {
          this.tableData = response.data.data.records;
        })
      },
      accpetSliceData(data) { //接受分页器返回的数据
        this.currentPage = data.currentPage;
        this.pageSize = data.pageSize;
        this.init_data();
      },
    },
    mounted() {
      this.init_data();
      this.get_agencyOptions();
      this.get_storageOptions();
    }
  }
</script>

<style scoped>
  label {
    line-height: 40px;
  }

  .el-table {
    margin: 20px;
  }

  .del {
    line-height: 40px;
  }

  .el-select {
    float: left;
  }
</style>
