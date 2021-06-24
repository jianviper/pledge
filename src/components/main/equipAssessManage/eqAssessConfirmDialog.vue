<template>
  <div>
    <el-dialog title="评估" :visible.sync="dialogFormVisible" width="850px">
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
      <el-form :model="eqAssessFormData" ref="eqAssessFormData" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="年份：" prop="particularYear">
              <el-select v-model="eqAssessFormData.particularYear" placeholder="请选择">
                <el-option
                  v-for="item in yearOptions"
                  :key="item.value"
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
              <el-radio v-model="eqAssessFormData.refit" label=0>无</el-radio>
              <el-radio v-model="eqAssessFormData.refit" label=1>有</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否异常：" prop="whetheAccident">
              <el-radio v-model="eqAssessFormData.whetheAccident" label=0>否</el-radio>
              <el-radio v-model="eqAssessFormData.whetheAccident" label=1>是</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="使用状况：" prop="usageStatus">
              <el-radio v-model="eqAssessFormData.usageStatus" label=0>优</el-radio>
              <el-radio v-model="eqAssessFormData.usageStatus" label=1>良</el-radio>
              <el-radio v-model="eqAssessFormData.usageStatus" label=2>一般</el-radio>
              <el-radio v-model="eqAssessFormData.usageStatus" label=3>差</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌价值：" prop="brandValue">
              <el-radio v-model="eqAssessFormData.brandValue" label=0>优</el-radio>
              <el-radio v-model="eqAssessFormData.brandValue" label=1>良</el-radio>
              <el-radio v-model="eqAssessFormData.brandValue" label=2>一般</el-radio>
              <el-radio v-model="eqAssessFormData.brandValue" label=3>差</el-radio>
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
      <span class="dialog-footer">
            <el-button @click="cancel()">取 消</el-button>
            <el-button type="primary" @click="add_submit">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
  import config from '../../../../config'

  export default {
    name: "eqAssessConfirmDialog",
    props: ['assessConfirmDiaVisible', 'assessTaskID', 'host'],
    data() {
      return {
        dialogFormVisible: false,
        assessTaskInfoData: {},
        eqAssessFormData: {},
        eqImgUrl: '',
        eqInvoiceUrl: '',
        nameplateUrl: '',
        yearOptions: [],
      }
    },
    methods: {
      async assessTaskInfo_init() {
        await this.$axios.get('carloan/mechanicalEquipmentAssess/info/' + this.assessTaskID).then((response) => {
          this.assessTaskInfoData = response.data.data;
          this.eqImgUrl = this.host + response.data.data.mechanicalEquipmentImgUrl;
          this.eqInvoiceUrl = this.host + response.data.data.mechanicalEquipmentInvoiceUrl;
          this.nameplateUrl = this.host + response.data.data.nameplateUrl;
        })
      },
      years_init() {
        let myDate = new Date().getFullYear();
        for (let y = myDate; y > myDate - 20; y--) {
          this.yearOptions.push({value: y, label: y});
        }
      },
      cancel() {
        this.$refs['eqAssessFormData'].resetFields();
        this.dialogFormVisible = false;
      },
      add_submit() {
        console.log(this.eqAssessFormData);
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
    width: 120px;
    text-align: right;
  }

  .el-row {
    text-align: left;
    margin-bottom: 20px;
  }

  .eqImg {
    float: right;
    margin-right: 30px;
    width: 200px;
    height: 130px;
  }
</style>
