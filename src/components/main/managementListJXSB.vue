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
    <!--    sliceData.length > 0 ? sliceData : ZFTableData-->
    <el-table :data="sliceData.length > 0 ? sliceData : ZFTableData" border stripe
              style="width: 1001px" :header-cell-style="{'text-align':'center'}"
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
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="editRow(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页器-->
    <Pager :dataList="ZFTableData" @returnsliceData="accpetSliceData" :key="timer"></Pager>
    <!--    添加资方数据窗口-->
    <el-dialog title="添加资方" :visible.sync="dialogVisible" width="500px" @close="close_dialog()">
      <el-form :model="agencyFormData" ref="agencyFormData" label-position="left" label-width="80px" :rules="rules"
               class="addForm">
        <el-form-item label="机构代码">
          <el-input v-model="agencyFormData.agencyNumber"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="agencyFormData.sorting" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="机构简称">
          <el-input v-model="agencyFormData.agencyAbbreviation"></el-input>
        </el-form-item>
        <el-form-item label="机构全称">
          <el-input v-model="agencyFormData.agencyFull"></el-input>
        </el-form-item>
        <el-form-item label="机构状态">
          <el-radio-group v-model="agencyFormData.state" @change="statusChange">
            <el-radio label=0>正常</el-radio>
            <el-radio label=1>失效</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="add_submit(agencyFormData)">确 定</el-button>
      </span>
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
        name: '',
        code: '',
        currentPage: '',
        pageSize: '',
        timer: new Date().getTime(),
        statusOption: [
          {value: '', label: '全部'},
          {value: '0', label: '正常'},
          {value: '1', label: '失效'},
        ],
        statusValue: '',
        ZFTableData: [], //表格原始数据
        sliceData: [], //分页器处理后的数据
        dialogVisible: false,
        agencyFormData: {agencyNumber: '', sorting: '', agencyAbbreviation: '', agencyFull: '', state: 0}, //添加资方数据
        rules: {
          agencyNumber: [
            {required: true, message: '请输入机构代码', trigger: 'blur'},
          ],
          sorting: [
            {required: true, message: '请输入排序', trigger: 'blur'},
            {min: 1, max: 6, message: '长度在1到6个字符', trigger: "blur"}
          ],
          agencyAbbreviation: [
            {required: true, message: '请输入机构简称', trigger: 'blur'}
          ],
          agencyFull: [
            {required: true, message: '请输入机构全称', trigger: 'blur'}
          ],
          state: [
            {required: true, message: '请选择状态', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      search() {
        // console.log(this.name, this.code, this.statusValue);
        this.$axios.post('baseInfo/agency/managementList', {
          name: this.name,
          agencyNumber: this.code,
          state: this.statusValue
        }).then((response) => {
          this.ZFTableData = response.data.data.records;
        })
      },
      addZF() {
        this.dialogVisible = true;
        this.agencyFormData = {agencyNumber: '', sorting: '', agencyAbbreviation: '', agencyFull: '', state: '0'};
      },
      getAgencyData() { //获取初始化表格数据
        this.$axios.post('baseInfo/agency/managementList',
          {"name": "", "agencyNumber": "", "state": ""}).then((response) => {
          this.ZFTableData = response.data.data.records;
        })
      },
      accpetSliceData(data) { //接受分页器返回的数据
        this.sliceData = data.data;
      },
      add_submit() {
        console.log('submit', this.agencyFormData);
        this.$refs['agencyFormData'].validate((valid) => {
          if (valid) {
            this.$axios.post('baseInfo/agency/saveManagement', this.agencyFormData).then((response) => {
              // console.log(response.data);
              this.dialogVisible = false;
              this.getAgencyData();
              this.timer = new Date().getTime();
            });
          } else {
            return false;
          }
        })
      },
      editRow(index, rowData) {
        console.log(index, rowData);
        this.agencyFormData = rowData;
        this.agencyFormData.sorting = this.agencyFormData.sorting.toString();
        // this.agencyFormData.state = this.agencyFormData.state.toString();
        this.dialogVisible = true;
      },
      statusChange(value) {
        this.agencyFormData.state = value;
      },
      cancel() {
        this.dialogVisible = false;
        this.$refs['agencyFormData'].resetFields();
        console.log(this.ZFTableData, this.sliceData);
      },
      close_dialog() {
        this.$refs['agencyFormData'].resetFields();
      }
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

  .addForm .el-form-item {
    margin-left: 50px;
    margin-right: 50px;
  }

  .dialog-footer {
    margin-right: 50px;
  }
</style>
