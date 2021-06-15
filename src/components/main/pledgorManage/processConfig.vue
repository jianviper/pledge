<template>
  <div class="drawer_wrap">
    <el-drawer
      title="流程配置"
      :visible.sync="czrDrawerVisible"
      :before-close="handleClose"
      direction="ltr"
      size="700px">
      <div style="margin: auto 20px;">
        <h1 style="text-align: left;">客户基本信息</h1>
        <el-divider></el-divider>
        <div class="customerInfo">
          <el-row>
            <el-col :span="12">
              <span>企业名称:</span>{{rowData.businessName}}
            </el-col>
            <el-col :span="12">
              <span>法定代表人:</span>{{rowData.name}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span>身份证号:</span>{{rowData.idCardNo}}
            </el-col>
            <el-col :span="12">
              <span>手机号码:</span>{{rowData.mobile}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span>营业执照号码:</span>{{rowData.businessNo}}
            </el-col>
          </el-row>
        </div>
        <h1 style="text-align: left;margin-top:20px">配置流程</h1>
        <el-divider></el-divider>
        <el-form :model="proConFormData" ref="proConFormData" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="监管仓" prop="agencyId">
                <el-select v-model="proConFormData.agencyId" placeholder="请选择监管仓">
                  <el-option v-for="item in agency_options" :key="item.id" :value="item.id"
                             :label="item.agencyAbbreviation">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="资方" prop="managementId">
                <el-select v-model="proConFormData.managementId" placeholder="请选择资方">
                  <el-option v-for="item in management_options" :key="item.id" :value="item.id"
                             :label="item.agencyAbbreviation">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="回购方" prop="buyBackId">
                <el-select v-model="proConFormData.buyBackId" placeholder="请选择回购方">
                  <el-option v-for="item in buyBack_options" :key="item.id" :value="item.id"
                             :label="item.agencyAbbreviation">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="回购金额是否确认" prop="whetherBuyBack">
                <el-radio v-model="proConFormData.whetherBuyBack" label="true">是</el-radio>
                <el-radio v-model="proConFormData.whetherBuyBack" label="false">否</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否由资方确认授信额度" prop="whetherCredit">
                <el-radio v-model="proConFormData.whetherCredit" label="true">是</el-radio>
                <el-radio v-model="proConFormData.whetherCredit" label="false">否</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备评估价值是否确认" prop="whetherAssess">
                <el-radio v-model="proConFormData.whetherAssess" label="true">是</el-radio>
                <el-radio v-model="proConFormData.whetherAssess" label="false">否</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="出入库是否确认" prop="whetherWarehouse">
                <el-radio v-model="proConFormData.whetherWarehouse" label="true">是</el-radio>
                <el-radio v-model="proConFormData.whetherWarehouse" label="false">否</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="质押率" prop="probability">
                <el-input type="number" v-model.number="proConFormData.probability" style="width: auto"
                          placeholder="请输入质押率(1-100)"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="reset">重 置</el-button>
        <el-button type="primary" @click="proCon_submit">确 定</el-button>
      </span>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  export default {
    name: "processConfig",
    props: ['drawerVisible', 'rowData'],
    data() {
      let checknum = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入质押率(1-100)'));
        } else if (value < 1 || value > 100) {
          return callback(new Error('请输入质押率(1-100)'));
        } else {
          callback();
        }
      };
      return {
        czrDrawerVisible: false,
        proConFormData: {},
        agency_options: [],
        management_options: [],
        buyBack_options: [],
        rules: {
          probability: [{required: true, message: '请输入质押率(1-100)', trigger: 'blur'},
            {validator: checknum, message: '质押率范围(1-100)', trigger: "change"},
          ],
          agencyId: {required: true, message: '请选择监管仓', trigger: 'change'},
          managementId: {required: true, message: '请选择资方', trigger: 'change'},
          buyBackId: {required: true, message: '请选择回购方', trigger: 'change'},
          whetherBuyBack: {required: true, message: '请选择回购金额是否确认', trigger: 'change'},
          whetherCredit: {required: true, message: '请选择是否由资方确认授信额度', trigger: 'change'},
          whetherAssess: {required: true, message: '请选择评估价值是否确认', trigger: 'change'},
          whetherWarehouse: {required: true, message: '请选择出入库是否确认', trigger: 'change'},
        }
      }
    },
    methods: {
      handleClose(done) {
        this.reset();
        done();
      },
      reset() {
        this.$refs['proConFormData'].resetFields();
        this.proConFormData = {};
      },
      proCon_submit() {
        this.$refs['proConFormData'].validate((valid) => {
          this.proConFormData.businessId = this.rowData.businessId;
          console.log(this.proConFormData);
          if (valid) {
            this.$axios.post('baseInfo/process/save', this.proConFormData).then((response) => {
              if (response.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '配置成功!'
                });
                this.reset();
                this.czrDrawerVisible = false;
              }
            })
          }
        })
      },
      async agency_init() {
        await this.$axios.post('baseInfo/agency/storageList', {"current": 1, "size": 100}).then((response) => {
          this.agency_options = response.data.data.records;
        })
      },
      async management_init() {
        await this.$axios.post('baseInfo/agency/managementList', {"current": 1, "size": 100}).then((response) => {
          this.management_options = response.data.data.records;
        })
      },
      async buyBack_init() {
        await this.$axios.post('baseInfo/agency/buyBackList', {"current": 1, "size": 100}).then((response) => {
          this.buyBack_options = response.data.data.records;
        })
      },
      async formData_init() {
        await this.$axios.get('baseInfo/process/oneByBusinessId/' + this.rowData.businessId).then((response) => {
          console.log(response);
          if (response.data.code === 200) {
            let pd = JSON.parse(JSON.stringify(response.data.data));
            this.proConFormData = pd;
            this.proConFormData.whetherAssess = pd.whetherAssess.toString();
            this.proConFormData.whetherBuyBack = pd.whetherBuyBack.toString();
            this.proConFormData.whetherCredit = pd.whetherCredit.toString();
            this.proConFormData.whetherWarehouse = pd.whetherWarehouse.toString();
          } else {
            this.$message({
              type: 'error',
              message: response.data.message
            });
          }
        })
      }
    },
    watch: {
      drawerVisible(val, oldVal) {
        this.czrDrawerVisible = true;
        this.agency_init();
        this.management_init();
        this.buyBack_init();
        this.formData_init();
      },
    },
  }
</script>

<style scoped>
  span {
    float: left;
  }

  .customerInfo >>> .el-row {
    margin-bottom: 20px;
  }

  .drawer_wrap >>> .el-drawer__wrapper > div > div > .el-drawer__body {
    overflow: auto;
  }

  .dialog-footer {
    float: none;
  }
</style>
