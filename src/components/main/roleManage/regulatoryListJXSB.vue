<template>
  <div>
    <searchAndTable :listUrl="lurl" @returnRowData="acceptRowData" :key="timer"/>
    <!--    添加资方数据窗口-->
    <el-dialog title="添加监管方" :visible.sync="dialogVisible" width="500px" @close="close_dialog()" :close-on-click-modal='false'>
      <el-form :model="agencyFormData" ref="agencyFormData" label-position="left" label-width="80px" :rules="rules"
               class="addForm">
        <el-form-item label="机构代码" prop="agencyNumber">
          <el-input v-model="agencyFormData.agencyNumber"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sorting">
          <el-input v-model="agencyFormData.sorting" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="机构简称" prop="agencyAbbreviation">
          <el-input v-model="agencyFormData.agencyAbbreviation"></el-input>
        </el-form-item>
        <el-form-item label="机构全称" prop="agencyFull">
          <el-input v-model="agencyFormData.agencyFull"></el-input>
        </el-form-item>
        <el-form-item label="机构状态">
          <el-radio-group v-model="agencyFormData.state" @change="statusChange">
            <el-radio :label='0'>正常</el-radio>
            <el-radio :label='1'>失效</el-radio>
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
  import searchAndTable from './searchAndTable'

  export default {
    name: "regulatoryListJXSB",
    components: {
      searchAndTable
    },
    data() {
      return {
        addflag: true,
        lurl: 'baseInfo/agency/supervisorList',
        timer: '',
        dialogVisible: false,
        agencyFormData: {agencyNumber: '', sorting: '', agencyAbbreviation: '', agencyFull: '', state: 0}, //添加资方数据
        rules: {
          agencyNumber: {required: true, message: '请输入机构代码', trigger: 'blur'},
          supervisorId: {required: true, message: '请选择监管方', trigger: 'change'},
          sorting: {required: true, message: '请输入排序', trigger: 'blur'},
          agencyAbbreviation: {required: true, message: '请输入机构简称', trigger: 'blur'},
          agencyFull: {required: true, message: '请输入机构全称', trigger: 'blur'},}
      }
    },
    methods: {
      acceptRowData(data) {
        console.log(data);
        this.dialogVisible = data.dialogVisible;
        this.agencyFormData = data.data;
      },
      add_submit() {
        console.log('submit', this.agencyFormData);
        this.$refs['agencyFormData'].validate((valid) => {
          if (valid) {
            this.$axios.post('baseInfo/agency/saveSupervisor', this.agencyFormData).then((response) => {
              // console.log(response.data);
              if (response.data.code === 200) {
                this.dialogVisible = false;
                if (this.addflag) {
                  this.timer = new Date().getTime();
                }
              }
            });
          } else {
            return false;
          }
        });
        this.addflag = true;
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
  }
</script>

<style scoped>
  .addForm .el-form-item {
    margin-left: 50px;
    margin-right: 50px;
  }

  .dialog-footer {
    margin-right: 50px;
  }
</style>
