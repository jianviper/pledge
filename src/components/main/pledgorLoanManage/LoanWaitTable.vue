<template>
  <div>
    <el-table :data="tableData"
              border
              stripe
              style="width: 100%" :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}">
      <el-table-column prop="agencyAbbreviation" label="监管仓" width="160"></el-table-column>
      <el-table-column prop="businessName" label="公司名称" width="160"></el-table-column>
      <el-table-column prop="industry" label="支持产业" width="100">
        <template slot-scope="scope">
          <p v-if="scope.row.industry===0">汽车</p>
          <p v-else-if="scope.row.industry===1">机械设备</p>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="法定代表人" width="100"></el-table-column>
      <el-table-column prop="mobile" label="联系方式" width="120"></el-table-column>
      <el-table-column prop="idCardNo" label="身份证" width="180"></el-table-column>
      <el-table-column prop="address" label="地址" width="200"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="credit(scope.$index, scope.row)" type="text" size="small">授信
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="授信" :visible.sync="creditDiaFormVisible" :before-close="handleClose"
               :close-on-click-modal="false">
      <el-form :model="creditFormData" ref="creditFormData" label-width="100px" label-position="left" :rules="rules">
        <el-form-item label="授信时间" prop="creditTime">
          <el-date-picker style="float: left;"
                          v-model="creditFormData.creditTime"
                          type="date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="授信期限" prop="creditTerm">
          <el-input v-model="creditFormData.creditTerm" placeholder="月"></el-input>
        </el-form-item>
        <el-form-item label="授信额度" prop="creditLines">
          <el-input v-model="creditFormData.creditLines"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
            <el-button @click="cancel()">取 消</el-button>
            <el-button type="primary" @click="add_submit">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>


  export default {
    name: "LoanWaitTable",
    props: ['tableData', 'currentTab'],
    components: {},
    data() {
      return {
        creditDiaFormVisible: false,
        creditFormData: {},
        rules: {
          creditTime: {required: true, message: '请选择日期', trigger: 'change'},
          creditTerm: {required: true, message: '请输入授信期限', trigger: 'blur'},
          creditLines: {required: true, message: '请输入授信额度', trigger: 'blur'},
        }
      }
    },
    methods: {
      credit(index, rowData) {
        this.creditDiaFormVisible = true;
      },
      cancel() {
        this.$refs['creditFormData'].resetFields();
        this.creditDiaFormVisible = false;
      },
      handleClose(done) {
        this.$refs['creditFormData'].resetFields();
        // this.creditFormData = {creditTime: '', creditTerm: '', creditLines: ''};
        done();
      },
      add_submit() {
        // console.log(this.creditFormData);
        this.$refs['creditFormData'].validate((valid) => {
          if (valid) {
            this.$axios.post('/carloan/credit/do_credit', this.creditFormData).then((response) => {
              if (response.data.code === 200) {
                this.creditDiaFormVisible = false;
                this.cancel();
                this.$message({
                  type: 'success',
                  message: '成功'
                });
                this.$emit('returnLoanWaitTable', true);
              } else {
                this.$message({
                  type: 'error',
                  message: response.data.message
                });
              }
            })
          }
        })
      }
    }

  }
</script>

<style scoped>

</style>
