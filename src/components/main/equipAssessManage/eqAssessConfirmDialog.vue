<template>
  <div>
    <el-dialog title="评估" :visible.sync="dialogFormVisible" width="888px">
      <el-row>
        <el-col :span="12"><span>编号：</span>{{assessTaskInfoData.mechanicalEquipmentNo}}</el-col>
        <el-col :span="12"><span>名称：</span>{{assessTaskInfoData.mechanicalEquipmentName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><span>规格：</span>{{assessTaskInfoData.mechanicalEquipmentSpecifications}}</el-col>
        <el-col :span="12"><span>生产日期：</span>{{assessTaskInfoData.mechanicalEquipmentProductionTime | formatDate2}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><span>购入日期：</span>{{assessTaskInfoData.mechanicalEquipmentPurchaseTime | formatDate2}}
        </el-col>
        <el-col :span="12"><span>购入金额：</span>{{assessTaskInfoData.mechanicalEquipmentPurchaseAmount}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><span>设备图片：</span>
          <img class="eqImg" :src=eqImgUrl alt="">
        </el-col>
        <el-col :span="12"><span>发票或订购合同：</span>
          <img class="eqImg" :src=eqInvoiceUrl alt="">
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><span>设备铭牌：</span>
          <img class="eqImg" :src=nameplateUrl alt="">
        </el-col>
        <el-col :span="12"></el-col>
      </el-row>
      <el-form :model="eqAssessFormData" ref="eqAssessFormData" label-width="120px" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="年份：" prop="particularYear">
              <el-select v-model="eqAssessFormData.particularYear" placeholder="请选择">
                <el-option
                  v-for="(item,index) in yearOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="有无改装：" prop="refit">
              <el-radio-group v-model="eqAssessFormData.refit">
                <el-radio :label=0>无</el-radio>
                <el-radio :label=1>有</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否异常：" prop="whetheAccident">
              <el-radio-group v-model="eqAssessFormData.whetheAccident">
                <el-radio :label=0>无</el-radio>
                <el-radio :label=1>有</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="使用状况：" prop="usageStatus">
              <el-radio-group v-model="eqAssessFormData.usageStatus">
                <el-radio :label=0>优</el-radio>
                <el-radio :label=1>良</el-radio>
                <el-radio :label=2>一般</el-radio>
                <el-radio :label=3>差</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌价值：" prop="brandValue">
              <el-radio-group v-model="eqAssessFormData.brandValue">
                <el-radio :label=0>优</el-radio>
                <el-radio :label=1>良</el-radio>
                <el-radio :label=2>一般</el-radio>
                <el-radio :label=3>差</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="评估价值：" prop="evaluationValue">
              <el-input v-model="eqAssessFormData.evaluationValue" placeholder="请输入评估价值"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <span class="dialog-footer">
            <el-button @click="cancel()">取 消</el-button>
            <el-button type="primary" @click="add_submit">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "eqAssessConfirmDialog",
    props: ['assessConfirmDiaVisible', 'assessTaskID', 'pledgeApplyID', 'host'],
    data() {
      return {
        dialogFormVisible: false,
        assessTaskInfoData: {},
        eqAssessFormData: {},
        eqImgUrl: '',
        eqInvoiceUrl: '',
        nameplateUrl: '',
        yearOptions: [],
        rules: {
          particularYear: {required: true, message: '请选择年份', trigger: 'change'},
          refit: {required: true, message: '请选择有无改装', trigger: 'change'},
          whetheAccident: {required: true, message: '请选择是否异常', trigger: 'change'},
          usageStatus: {required: true, message: '请选择使用状况', trigger: 'change'},
          brandValue: {required: true, message: '请选择品牌价值', trigger: 'change'},
          evaluationValue: {required: true, message: '请输入评估价值', trigger: 'blur'},
        }
      }
    },
    methods: {
      async assessTaskInfo_init() { //评估任务信息数据初始化
        await this.$axios.get('carloan/mechanicalEquipmentAssess/info/' + this.assessTaskID).then((response) => {
          this.assessTaskInfoData = response.data.data;
          this.eqImgUrl = this.host + response.data.data.mechanicalEquipmentImgUrl;
          this.eqInvoiceUrl = this.host + response.data.data.mechanicalEquipmentInvoiceUrl;
          this.nameplateUrl = this.host + response.data.data.nameplateUrl;
        })
      },
      years_init() { //初始化年份数据
        let myDate = new Date().getFullYear();
        for (let y = myDate; y > myDate - 20; y--) {
          this.yearOptions.push({value: y, label: y});
        }
      },
      cancel() {
        this.$refs['eqAssessFormData'].resetFields();
        this.dialogFormVisible = false;
      },
      add_submit() { //提交某设备评估
        this.eqAssessFormData.invoiceUrl = this.eqInvoiceUrl.split('/api')[1];
        this.eqAssessFormData.id = this.assessTaskID;
        this.eqAssessFormData.pledgeApplyId = this.pledgeApplyID;
        console.log(this.eqAssessFormData);
        this.$refs['eqAssessFormData'].validate((valid) => {
          if (valid) {
            this.$axios.post('carloan/mechanicalEquipmentAssess/confirm', this.eqAssessFormData).then((response) => {
              if (response.data.code === 200) {
                this.$message({
                  message: '评估提交成功',
                  type: 'success'
                });
                this.dialogFormVisible = false;
                this.$parent.assessData_init();
              }
            })
          }
        })
      }
    },
    watch: {
      assessConfirmDiaVisible(val, oldVal) {
        this.years_init();
        this.dialogFormVisible = true;
        this.assessTaskInfo_init();
      }
    },
  }
</script>

<style scoped>
  span {
    display: inline-block;
    width: 90px;
    text-align: left;
    margin-left: 30px;
  }

  .el-row {
    text-align: left;
    margin-bottom: 20px;
  }

  .eqImg {
    float: right;
    margin-right: 50px;
    width: 200px;
    height: 130px;
  }

  .dialog-footer {
    display: flex;
    margin: auto;
  }
</style>
