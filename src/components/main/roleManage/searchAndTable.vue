<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-col :span="6"><label for="name">机构名称</label></el-col>
        <el-col :span="16">
          <el-input id="name" placeholder="模糊匹配" v-model="searchData.name">
            <i class="el-icon-close del" slot="suffix" @click="iconClick"></i>
          </el-input>
        </el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="6"><label for="code">机构代码</label></el-col>
        <el-col :span="16">
          <el-input id="code" placeholder="机构代码" v-model="searchData.code">
            <i class="el-icon-close del" slot="suffix" @click="iconClick"></i>
          </el-input>
        </el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="6"><label for="">状态</label></el-col>
        <el-col :span="18" class="select_wrap">
          <el-select v-model="searchData.statusValue">
            <el-option v-for="option in statusOption"
                       :key="option.value"
                       :label="option.label"
                       :value="option.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-col>
      <el-col :span="6">
        <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="add">添加</el-button>
      </el-col>
    </el-row>
    <!--    tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)-->
    <el-table :data="tableData" :key="timer"
              border
              stripe
              style="width: 1001px" :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}">
      <el-table-column prop="agencyNumber" label="机构代码" width="100"></el-table-column>
      <el-table-column prop="agencyAbbreviation" label="机构名称" width="200"></el-table-column>
      <el-table-column v-if="roleType==='JGC'" prop="supervisorName" label="监管方" width="100"></el-table-column>
      <el-table-column prop="sorting" label="排序" width="80"></el-table-column>
      <el-table-column label="添加时间" width="200">
        <template slot-scope="scope">
          {{scope.row.creationTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="200">
        <template slot-scope="scope">
          {{scope.row.updateTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column v-if="roleType==='JGC' || roleType==='HGF'" prop="industry" label="支持产业" width="80">
        <template slot-scope="scope">
          <p v-if="scope.row.industry===0">汽车</p>
          <p v-else-if="scope.row.industry===1">机械设备</p>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <p v-if="scope.row.state===0">正常</p>
          <p v-else-if="scope.row.state===1">失效</p>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="80">
        <template slot-scope="scope">
          <el-button @click="editRow(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页器-->
    <Pager :dataList="tableData" :currentPage="currentPage" :totalSize="total"
           @returnsliceData="accpetSliceData"></Pager>
  </div>
</template>

<script>
  import Pager from '../../parts/Pager'

  export default {
    name: "searchAndTable",
    props: ['listUrl', 'roleType'],
    components: {Pager},
    data() {
      return {
        timer: '',
        searchData: {name: '', code: '', state: ''},
        currentPage: 1,
        pageSize: 10,
        total: 0,
        statusOption: [
          {value: '', label: '全部'},
          {value: '0', label: '正常'},
          {value: '1', label: '失效'},
        ],
        tableData: [], //表格原始数据
        pagingData: {name: '', code: '', state: ''},
      }
    },
    methods: {
      add() { //点击添加
        let formData = {agencyNumber: '', sorting: '', agencyAbbreviation: '', agencyFull: '', state: 0};
        this.$emit('returnRowData', {data: formData, dialogVisible: true});
      },
      search() {
        // console.log(this.name, this.code, this.statusValue);
        this.pagingData = JSON.parse(JSON.stringify(this.searchData));
        this.currentPage = 1;
        this.getAgencyData();
        // this.timer = new Date().getTime();
      },
      getAgencyData() { //获取初始化表格数据
        // console.log(new Date().getTime());
        this.$axios.post(this.listUrl, {
          "name": this.pagingData.name,
          "agencyNumber": this.pagingData.code,
          "state": this.pagingData.state,
          "current": this.currentPage,
          "size": this.pageSize
        }).then((response) => {
          this.tableData = response.data.data.records;
          this.total = response.data.data.totalSize;
        })
      },
      accpetSliceData(data) { //接受分页器返回的数据
        // this.sliceData = data.data;
        this.currentPage = data.currentPage;
        this.pageSize = data.pageSize;
        this.getAgencyData();
      },
      editRow(index, rowData) {
        console.log(index, rowData);
        this.$emit('returnRowData', {data: JSON.parse(JSON.stringify(rowData)), dialogVisible: true, addflag: false})
      },
      iconClick(ev) {
        let ele_id = ev.path[3].getElementsByTagName('input')[0].id;
        if (ele_id === 'name') {
          this.searchData.name = '';
        } else if (ele_id === 'code') {
          this.searchData.code = '';
        }
      },
    },
    mounted() {
      this.getAgencyData();
    },
  }
</script>

<style scoped>
  label {
    line-height: 40px;
  }

  .select_wrap {
    text-align: left;
  }

  .el-row {
    margin-left: 20px;
  }

  .el-table {
    margin: 20px;
  }

  .block {
    margin-left: 20px;
  }

  .del {
    line-height: 40px;
  }
</style>
