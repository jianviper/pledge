<template>
  <div>
    <!--    start-搜索-->
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
    <!--    end-搜索-->
    <!--    start-标签页-->
    <el-tabs v-model="activeTab" @tab-click="handleClick" style="margin: 20px;">
      <el-tab-pane label="全部" name="pane-0">
        <PledgorTable :tableData="tableData" :currentTab="activeTab" @returnRowData="acceptRowData"/>
      </el-tab-pane>
      <el-tab-pane label="待完善" name="pane-1">
        <PledgorTable :tableData="tableData" :currentTab="activeTab" @returnRowData="acceptRowData"/>
      </el-tab-pane>
      <el-tab-pane label="待配置" name="pane-2">
        <PledgorTable :tableData="tableData" :currentTab="activeTab"/>
      </el-tab-pane>
      <el-tab-pane label="已完成" name="pane-3">
        <PledgorTable :tableData="tableData" :currentTab="activeTab"/>
      </el-tab-pane>
    </el-tabs>
    <!--    end-标签页-->
    <!--    start-分页器-->
    <Pager :dataList="tableData" :currentPage="currentPage" :totalSize="total" :page_size="pageSize"
           @returnsliceData="accpetSliceData" class="pager"></Pager>
    <!--    end-分页器-->
    <!--    start-添加/修改客户弹窗-->
    <el-dialog title="添加客户" :visible.sync="dialogVisible" width="700px" @close="close_dialog()"
               :close-on-click-modal='false'>
      <h1 style="text-align: left;">客户基本信息</h1>
      <el-divider style="margin:10px auto"></el-divider>
      <!--    start-添加/修改客户表单-->
      <el-form :model="customerFormData" ref="customerFormData" label-width="100px" :rules="rules"
               class="customerForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="customerFormData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="customerFormData.mobile"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证" prop="idCardNo">
              <el-input v-model="customerFormData.idCardNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期" prop="idCardValidity">
              <el-input v-model="customerFormData.idCardValidity"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="户籍" prop="households">
              <el-input v-model="customerFormData.households"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证正面" prop="idCardNationalUrl">
              <el-upload
                class="avatar-uploader"
                action="api/thirdparty/file/uploadImg"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadImgHead">
                <img v-if="idCardImgHead" :src="idCardImgHead" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证反面" prop="idCardPortraiUrlt">
              <el-upload
                class="avatar-uploader"
                action="api/thirdparty/file/uploadImg"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadImgBack">
                <img v-if="idCardImgBack" :src="idCardImgBack" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <h1 style="text-align: left;">企业信息</h1>
        <el-divider style="margin:10px auto"></el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业名称" prop="businessName">
              <el-input v-model="customerFormData.businessName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业执照号码" prop="businessNo">
              <el-input v-model="customerFormData.businessNo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="经营地址" prop="address">
              <el-input v-model="customerFormData.address"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经营年限" prop="years">
              <el-input v-model="customerFormData.years"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="支持产业" prop="industry">
              <el-select v-model="customerFormData.industry" @change="select_industry" placeholder="请选择行业"
                         style="width: 100%">
                <el-option v-for="item in industry_options" :key="item.value" :value="item.value" :label="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="营业执照" prop="licenseUrl">
              <el-upload
                class="avatar-uploader"
                action="api/thirdparty/file/uploadImg"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadImgLicense">
                <img v-if="imgLicenseUrl" :src="imgLicenseUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!--    end-添加/修改客户表单-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="close_dialog()">取 消</el-button>
        <el-button type="primary" @click="add_submit">确 定</el-button>
      </span>
    </el-dialog>
    <!--    end-添加/修改客户弹窗-->
  </div>
</template>

<script>
  import PledgorTable from './pledgorTable'
  import Pager from '../../parts/Pager'
  import config from '../../../../config'

  export default {
    name: "pledgorManagerJXSB",
    components: {PledgorTable, Pager},
    data() {
      let checkMobile = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号码不可为空'));
        } else if (!/^1(3|4|5|6|7|8)\d{9}$/.test(value)) {
          return callback(new Error('手机号码格式不正确'));
        } else {
          callback();
        }
      };
      return {
        addflag: true,
        searchFlag: false,
        dialogVisible: false,
        customerFormData: {},
        activeTab: 'pane-0',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        idCardImgHead: '',//身份证正面
        idCardImgBack: '',//身份证反面
        imgLicenseUrl: '',//营业执照照片
        imgHeader: {'Authorization': sessionStorage.getItem('token')},
        searchData: {businessName: '', mobile: '', idCardNo: '', warehouseId: '', state: ''},
        tableData: [],//用于切换标签页区分用的表格数据
        storageOptions: [],
        statusOption: [
          {value: '', label: '全部'},
          {value: 0, label: '未完善'},
          {value: 1, label: '待配置'},
          {value: 2, label: '已完成'},
        ],
        industry_options: [{label: '汽车', value: 0}, {label: '机械设备', value: 1}],
        tableDataList: [],
        rules: {
          name: {required: true, message: '请输入客户姓名', trigger: 'blur'},
          mobile: {required: true, validator: checkMobile, trigger: 'blur'},
        }
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
        this.currentPage = 1;
        this.searchFlag = true;
        this.tableDataList = [];
        this.init_data();
        // this.handleClick({'name': this.activeTab});
      },
      handleAvatarSuccess(res, file) {
        console.log('suc', res, file);
        this.idCardImgHead = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 4;

        if (!isJPG) {
          this.$message.error('上传文件只能是 图片 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 4MB!');
        }
        return isJPG && isLt2M;
      },
      uploadImgHead(param) { //身份证正面
        let formData = new FormData();
        formData.append('image', param.file);
        // console.log(param, formData.get('image'));
        this.$axios.post('thirdparty/file/uploadImg', formData).then((response) => {
          this.idCardImgHead = URL.createObjectURL(param.file);
          this.customerFormData.idCardNationalUrl = response.data.data;
        })
      },
      uploadImgBack(param) { //身份证反面
        let formData = new FormData();
        formData.append('image', param.file);
        // console.log(param, formData.get('image'));
        this.$axios.post('thirdparty/file/uploadImg', formData).then((response) => {
          this.idCardImgBack = URL.createObjectURL(param.file);
          this.customerFormData.idCardPortraiUrlt = response.data.data;
        })
      },
      uploadImgLicense(param) { //营业执照照片
        let formData = new FormData();
        formData.append('image', param.file);
        // console.log(param, formData.get('image'));
        this.$axios.post('thirdparty/file/uploadImg', formData).then((response) => {
          this.imgLicenseUrl = URL.createObjectURL(param.file);
          this.customerFormData.licenseUrl = response.data.data;
        })
      },
      add() {
        this.dialogVisible = true;
      },
      add_submit() { //添加/修改客户提交
        console.log(this.customerFormData);
        this.$refs['customerFormData'].validate((valid) => {
          if (valid) {
            this.$axios.post('baseInfo/customer/save', this.customerFormData).then(async (response) => {
              if (response.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                });
                this.dialogVisible = false;
                if (this.addflag) {
                  this.tableDataList = [];
                  this.init_data();
                }
              }
            });
          } else {
            return false;
          }
        })
      },
      handleClick(tab) {
        // console.log(tab.name, this.activeTab, this.tableDataList);
        this.currentPage = 1;
        this.tableData = this.tableDataList[parseInt(tab.name.split('-')[1])].data.slice(0, this.pageSize);
        this.total = this.tableDataList[parseInt(tab.name.split('-')[1])].total;
      },
      get_storageOptions() {
        this.$axios.post('baseInfo/agency/storageList', {"current": 1, "size": 100}).then((response) => {
          // this.storageOption = JSON.parse(JSON.stringify(response.data.data.records));
          this.storageOptions = response.data.data.records;
          this.storageOptions.splice(0, 0, {agencyAbbreviation: '全部', id: ''});
        })
      },
      accpetSliceData(data) { //接受分页器返回的数据
        this.currentPage = data.currentPage;
        this.pageSize = data.pageSize;
        let state = parseInt(this.activeTab.split('-')[1]) - 1;
        this.$axios.post('baseInfo/customer/list',
          {
            "businessName": this.searchFlag ? this.searchData.businessName : '',
            "mobile": this.searchFlag ? this.searchData.mobile : '',
            "idCardNo": this.searchFlag ? this.searchData.idCardNo : '',
            "warehouseId": this.searchFlag ? this.searchData.warehouseId : '',
            "state": state === -1 ? '' : state,
            "current": this.currentPage,
            "size": this.pageSize,
          }).then((response) => {
          this.tableData = response.data.data.records;
          this.total = response.data.data.totalSize;
        });
      },
      acceptRowData(rowData) { //接受完善客户点击后传来的表格行数据
        this.customerFormData = JSON.parse(JSON.stringify(rowData));
        let host = process.env.NODE_ENV == 'test' ? config.test.proxyTable["/api"].target + 'api' : config.dev.proxyTable["/api"].target + 'api';
        this.customerFormData.idCardNationalUrl ? this.idCardImgHead = host + this.customerFormData.idCardNationalUrl : 0;
        this.customerFormData.idCardPortraiUrlt ? this.idCardImgBack = host + this.customerFormData.idCardPortraiUrlt : 0;
        this.customerFormData.licenseUrl ? this.imgLicenseUrl = host + this.customerFormData.licenseUrl : 0;
        this.dialogVisible = true;
        // console.log('accRD', this.customerFormData);
      },
      async init_data() { //初始化数据
        let stateList = [this.searchData.state, 0, 1, 2];
        for (let i = 0; i < stateList.length; i++) {
          await this.$axios.post('baseInfo/customer/list',
            { //全部
              "businessName": this.searchFlag ? this.searchData.businessName : '',
              "mobile": this.searchFlag ? this.searchData.mobile : '',
              "idCardNo": this.searchFlag ? this.searchData.idCardNo : '',
              "warehouseId": this.searchFlag ? this.searchData.warehouseId : '',
              "state": stateList[i],
              "current": this.currentPage,
              "size": 20,
            }).then((response) => {
            // if (i === 0) { //初始化第一个标签页的表格数据
            //   this.tableData = response.data.data.records.slice(0, this.pageSize);
            //   this.total = response.data.data.totalSize;
            // }
            this.tableDataList.push({ //将多个标签页的表格数据放到数组中
              'data': response.data.data.records,
              'total': response.data.data.totalSize
            });
          });
        }
        //初始化第一个标签页的表格数据
        this.tableData = this.tableDataList[parseInt(this.activeTab.split('-')[1])].data.slice(0, this.pageSize);
        this.total = this.tableDataList[parseInt(this.activeTab.split('-')[1])].total;
      },
      select_industry(value) {
        // console.log(this.customerFormData);
      },
      close_dialog() {
        this.dialogVisible = false;
        this.$refs['customerFormData'].resetFields();
        this.customerFormData = {};
        this.imgLicenseUrl = '';
        this.idCardImgHead = '';
        this.idCardImgBack = '';
      }
    },
    mounted() {
      this.get_storageOptions();
      this.init_data();

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

  /deep/ .customerForm label {
    text-align: center;
  }

  /deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  /deep/ .el-dialog__body {
    padding-top: 10px;
  }

  .el-divider {
    margin: 15px auto;
  }
</style>
