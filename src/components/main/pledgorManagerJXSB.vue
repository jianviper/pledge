<template>
  <div>
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
    <el-tabs v-model="activeTab" @tab-click="handleClick" style="margin: 20px;">
      <el-tab-pane label="全部" name="pane-0">
        <PledgorTable :tableData="tableData"/>
      </el-tab-pane>
      <el-tab-pane label="待完善" name="pane-1">
        <PledgorTable :tableData="tableData"/>
      </el-tab-pane>
      <el-tab-pane label="待配置" name="pane-2">
        <PledgorTable :tableData="tableData"/>
      </el-tab-pane>
      <el-tab-pane label="已完成" name="pane-3">
        <PledgorTable :tableData="tableData"/>
      </el-tab-pane>
    </el-tabs>
    <Pager :dataList="tableData" :currentPage="currentPage" :totalSize="total"
           @returnsliceData="accpetSliceData" class="pager"></Pager>
    <el-dialog title="添加客户" :visible.sync="dialogVisible" width="700px" @close="close_dialog()"
               :close-on-click-modal='false'>
      <el-form :model="customerFormData" ref="customerFormData" label-width="100px"
               class="customerForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="customerName">
              <el-input v-model="customerFormData.customerName"></el-input>
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
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadImg">
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
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadImg">
                <img v-if="idCardImgBack" :src="idCardImgBack" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import PledgorTable from '../tools/pledgorTable'
  import Pager from '../tools/Pager'

  export default {
    name: "pledgorManagerJXSB",
    components: {PledgorTable, Pager},
    data() {
      return {
        dialogVisible: false,
        customerFormData: {},
        activeTab: 'pane-0',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        idCardImgHead: '',//身份证正面
        idCardImgBack: '',//身份证反面
        imgHeader: {'Authorization': sessionStorage.getItem('token')},
        searchData: {businessName: '', mobile: '', idCardNo: '', warehouseId: '', state: ''},
        tableData: [],//用于切换标签页区分用的表格数据
        storageOptions: [],
        statusOption: [
          {value: '', label: '全部'},
          {value: '0', label: '未完善'},
          {value: '1', label: '待配置'},
          {value: '2', label: '已完成'},
        ],
        dataAll: {data: [], total: ''},
        dataP1: {data: [], total: ''},
        dataP2: {data: [], total: ''},
        dataP3: {data: [], total: ''},
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
        let data = JSON.parse(JSON.stringify(this.searchData));
        data.current = 1;
        data.size = this.pageSize;
        console.log(data);
        this.$axios.post('baseInfo/customer/list', data).then((response) => {
          this.currentPage = 1;
          this.tableData = response.data.data.records;
          this.total = response.data.data.totalSize;
        })
      },
      handleAvatarSuccess(res, file) {
        console.log(res);
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
      uploadImg(param) {
        let formData = new FormData();
        formData.append('image', param.file);
        // console.log(param, formData.get('image'));
        this.$axios.post('thirdparty/file/uploadImg', formData).then((response) => {
          console.log(response.data);
        })
      },
      add() {
        this.dialogVisible = true;
      },
      handleClick(tab, event) {
        console.log(tab.name, event);
        if (tab.name === 'pane-1') {
          this.tableData = this.dataP1.data;
          this.total = this.dataP1.total;
          this.searchData.state = 0;
        } else if (tab.name === 'pane-2') {
          this.tableData = this.dataP2.data;
          this.total = this.dataP2.total;
          this.searchData.state = 1;
        } else if (tab.name === 'pane-3') {
          this.tableData = this.dataP3.data;
          this.total = this.dataP3.total;
          this.searchData.state = 2;
        } else if (tab.name === 'pane-0') {
          this.tableData = this.dataAll.data;
          this.total = this.dataAll.total;
          this.searchData.state = '';
        }
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
        this.$axios.post('baseInfo/customer/list',
          { //全部
            "businessName": this.searchData.businessName,
            "mobile": this.searchData.mobile,
            "idCardNo": this.searchData.idCardNo,
            "warehouseId": this.searchData.warehouseId,
            "state": this.searchData.state,
            "current": this.currentPage,
            "size": this.pageSize,
          }).then((response) => {
          this.tableData = response.data.data.records;
          this.total = response.data.data.totalSize;
        });
      },
      init_data() {
        this.$axios.post('baseInfo/customer/list',
          { //全部
            "businessName": this.searchData.businessName,
            "mobile": this.searchData.mobile,
            "idCardNo": this.searchData.idCardNo,
            "warehouseId": this.searchData.warehouseId,
            "state": '',
            "current": this.currentPage,
            "size": this.pageSize,
          }).then((response) => {
          this.dataAll.data = response.data.data.records;
          this.dataAll.total = response.data.data.totalSize;
          this.tableData = response.data.data.records;
          this.total = response.data.data.totalSize;
        });
        this.$axios.post('baseInfo/customer/list',
          { //待完善
            "businessName": this.searchData.businessName,
            "mobile": this.searchData.mobile,
            "idCardNo": this.searchData.idCardNo,
            "warehouseId": this.searchData.warehouseId,
            "state": 0,
            "current": this.currentPage,
            "size": this.pageSize,
          }).then((response) => {
          this.dataP1.data = response.data.data.records;
          this.dataP1.total = response.data.data.totalSize;
        });
        this.$axios.post('baseInfo/customer/list',
          { //待完善
            "businessName": this.searchData.businessName,
            "mobile": this.searchData.mobile,
            "idCardNo": this.searchData.idCardNo,
            "warehouseId": this.searchData.warehouseId,
            "state": 1,
            "current": this.currentPage,
            "size": this.pageSize,
          }).then((response) => {
          this.dataP2.data = response.data.data.records;
          this.dataP2.total = response.data.data.totalSize;
        });
        this.$axios.post('baseInfo/customer/list',
          { //待完善
            "businessName": this.searchData.businessName,
            "mobile": this.searchData.mobile,
            "idCardNo": this.searchData.idCardNo,
            "warehouseId": this.searchData.warehouseId,
            "state": 2,
            "current": this.currentPage,
            "size": this.pageSize,
          }).then((response) => {
          this.dataP3.data = response.data.data.records;
          this.dataP3.total = response.data.data.totalSize;
        });
      },
      close_dialog() {
        this.userFormData = {state: 0};
        this.$refs['userFormData'].resetFields();
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
</style>
