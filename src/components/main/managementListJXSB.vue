<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-col :span="6"><label for="name">机构名称</label></el-col>
        <el-col :span="16">
          <el-input id="name" placeholder="模糊匹配" v-model="name"></el-input>
        </el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="6"><label for="code">机构代码</label></el-col>
        <el-col :span="16">
          <el-input id="code" placeholder="机构代码" v-model="code"></el-input>
        </el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="6"><label for="">状态</label></el-col>
        <el-col :span="18" class="select_wrap">
          <el-select v-model="statusValue">
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
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="addZF">添加资方</el-button>
      </el-col>
    </el-row>
    <el-table :data="sliceData.length > 0 ? sliceData : ZFTableData" border stripe
              style="width: 901px" :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}">
      <el-table-column prop="agencyNumber" label="机构代码" width="100"></el-table-column>
      <el-table-column prop="agencyAbbreviation" label="机构名称" width="200"></el-table-column>
      <el-table-column prop="sorting" label="排序" width="100"></el-table-column>
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
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <p v-if="scope.row.state===0">正常</p>
          <p v-else-if="scope.row.state===1">失效</p>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页器-->
    <Pager :dataList="ZFTableData" @returnsliceData="accpetSliceData"></Pager>
    <el-dialog title="添加资方" :visible.sync="dialogVisible" width="500px">
      <el-form :model="agencyFormData" label-position="left" label-width="80px" :rules="rules" class="addForm">
        <el-form-item label="机构代码">
          <el-input v-model="agencyFormData.agencyNumber"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="agencyFormData.sorting"></el-input>
        </el-form-item>
        <el-form-item label="机构简称">
          <el-input v-model="agencyFormData.agencyName"></el-input>
        </el-form-item>
        <el-form-item label="机构全称">
          <el-input v-model="agencyFormData.agencyFullName"></el-input>
        </el-form-item>
        <el-form-item label="机构状态">
          <el-radio v-model="radio" label="1">正常</el-radio>
          <el-radio v-model="radio" label="2">失效</el-radio>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import Pager from '../tools/Pager'

  export default {
    name: "managementListJXSB",
    components: {
      Pager
    },
    data() {
      return {
        radio: '1',
        name: '',
        code: '',
        statusOption: [
          {value: '', label: '全部'},
          {value: '0', label: '正常'},
          {value: '1', label: '失效'},
        ],
        statusValue: '',
        ZFTableData: [], //表格原始数据
        sliceData: [], //分页器处理后的数据
        dialogVisible: false,
        agencyFormData: {},
        rules: {
          name: [
            {required: true, message: '请输入迭代名称', trigger: 'blur'},
            {min: 1, max: 20, message: '名称长度在1到20个字符', trigger: "blur"}
          ],
          detail: [
            {required: true, message: '请输入迭代目标', trigger: 'blur'},
          ],
          start_date: [
            {required: true, message: '请选择日期', trigger: 'blur'}
          ],
          end_date: [
            {required: true, message: '请选择时间', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      search() {
        console.log(this.name, this.code, this.statusValue);
      },
      addZF() {
        this.dialogVisible = true;
      },
      getAgencyData() {
        this.$axios.post('baseInfo/agency/managementList',
          {"name": "", "agencyNumber": "", "state": "", "current": 1, "size": 15, "totalSize": 0}).then((response) => {
          this.ZFTableData = response.data.data.records;
        })
      },
      accpetSliceData(data) {
        this.sliceData = data;
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

  .addForm .el-input {
    width: 60%;
  }
</style>
