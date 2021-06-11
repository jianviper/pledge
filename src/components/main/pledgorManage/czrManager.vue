<template>
  <div class="drawer_wrap">
    <!--    <el-dialog title="出质人管理" :visible.sync="dialogVisible" width="700px" @close="close_dialog()"-->
    <!--               :close-on-click-modal='false'>-->
    <!--      <el-button>添加出质人</el-button>-->
    <!--    </el-dialog>-->
    <el-drawer
      title="出质人管理"
      :visible.sync="czrDrawerVisible"
      :before-close="handleClose"
      direction="ltr"
      size="650px">
      <el-collapse v-model="activeCol" accordion style="padding:0px 20px">
        <el-collapse-item title="+添加出质人" name="addczr">
          <el-form :model="czrFormData" ref="czrFormData" label-position="top" :rules="rules">
            <el-row type="flex" justify="space-between">
              <el-col :span="11">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="czrFormData.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="手机号" prop="mobile">
                  <el-input v-model="czrFormData.mobile"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
              <el-col :span="11">
                <el-form-item label="身份证" prop="idCardNo">
                  <el-input v-model="czrFormData.idCardNo"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="有效性" prop="state">
                  <el-radio-group v-model="czrFormData.state">
                    <el-radio :label=0>有效</el-radio>
                    <el-radio :label=1>无效</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
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
              <el-col :span="11">
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
          </el-form>
          <span class="dialog-footer">
            <el-button @click="reset()">重 置</el-button>
            <el-button type="primary" @click="add_submit">确 定</el-button>
          </span>
        </el-collapse-item>
      </el-collapse>
      <el-table :data="czrTableData"
                border
                stripe
                style="width: 90%;margin:20px auto"
                :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}">
        <el-table-column label="姓名" prop="name" width="100"></el-table-column>
        <el-table-column label="手机" prop="mobile" width="120"></el-table-column>
        <el-table-column label="身份证" prop="idCardNo"></el-table-column>
        <el-table-column label="状态" prop="state" width="60">
          <template slot-scope="scope">
            <p v-if="scope.row.state===0">正常</p>
            <p v-else-if="scope.row.state===1">失效</p>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="editRow(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="delRow(scope.$index, scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
  import config from '../../../../config'

  export default {
    name: "czrManager",
    props: ['drawerVisible', 'customerId'],
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
        activeCol: '',
        czrDrawerVisible: false,
        czrTableData: [],
        czrFormData: {state: 0},
        idCardImgHead: '',
        idCardImgBack: '',
        rules: {
          name: {required: true, message: '请输入用户姓名', trigger: 'blur'},
          mobile: {required: true, validator: checkMobile, trigger: 'blur'},
          idCardNo: [{required: true, message: '请输入身份证号码', trigger: 'blur'},
            {min: 18, max: 18, message: '身份证号码格式不对', trigger: "blur"}
          ],
          state: {required: true, message: '请选择状态', trigger: 'change'},
          idCardNationalUrl: {required: true, message: '请上传身份证正面照'},
          idCardPortraiUrlt: {required: true, message: '请上传身份证反面照'},
        }
      }
    },
    methods: {
      add_submit() {
        this.$refs['czrFormData'].validate((valid) => {
          if (valid) {
            this.czrFormData.customerId = this.customerId;
            console.log(this.czrFormData);
            this.$axios.post('baseInfo/pledgor/save', this.czrFormData).then((response) => {
              if (response.data.code === 200) {
                this.reset();
                this.init_data();
                this.activeCol = '';
              }
            })
          }
        })
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
      uploadImgHead(param) {
        let formData = new FormData();
        formData.append('image', param.file);
        this.$refs['czrFormData'].clearValidate('idCardNationalUrl');
        this.$axios.post('thirdparty/file/uploadImg', formData).then((response) => {
          this.idCardImgHead = URL.createObjectURL(param.file);
          this.czrFormData.idCardNationalUrl = response.data.data;
        })
      },
      uploadImgBack(param) {
        let formData = new FormData();
        formData.append('image', param.file);
        this.$refs['czrFormData'].clearValidate('idCardPortraiUrlt');
        this.$axios.post('thirdparty/file/uploadImg', formData).then((response) => {
          this.idCardImgBack = URL.createObjectURL(param.file);
          this.czrFormData.idCardPortraiUrlt = response.data.data;
        })
      },
      handleClose(done) {
        this.reset();
        this.activeCol = '';
        done();
      },
      reset() {
        this.$refs['czrFormData'].resetFields();
        this.czrFormData = {state: 0};
        this.idCardImgHead = '';
        this.idCardImgBack = '';
      },
      init_data() {
        this.$axios.get('baseInfo/pledgor/listByCustomerId/' + this.customerId).then((response) => {
          this.czrTableData = response.data.data;
        })
      },
      async editRow(index, rowData) {
        console.log(index, rowData);
        this.czrFormData = JSON.parse(JSON.stringify(rowData));
        let host = process.env.NODE_ENV == 'test' ? config.test.proxyTable["/api"].target + 'api' : config.dev.proxyTable["/api"].target + 'api';
        await this.$axios.get('baseInfo/pledgor/info/' + rowData.id).then((response) => {
          // console.log('rrr', response.data.data);
          this.czrFormData['idCardNationalUrl'] = response.data.data.idCardNationalUrl;
          this.czrFormData['idCardPortraiUrlt'] = response.data.data.idCardPortraiUrlt;
          this.idCardImgHead = host + response.data.data.idCardNationalUrl;
          this.idCardImgBack = host + response.data.data.idCardPortraiUrlt;
        });
        this.activeCol = 'addczr';
      },
      delRow(index, rowData) {
        this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete('baseInfo/user/delete/' + rowData.id).then((response) => {
            if (response.data.code === 200) {
              this.init_data();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              this.$message({
                type: 'error',
                message: response.data.message
              });
            }
          }).catch(() => {
            this.$message.warning('删除失败');
          })
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
    },
    watch: {
      drawerVisible(val, oldVal) {
        this.czrDrawerVisible = true;
        this.init_data();
      }
    }
  }
</script>

<style scoped>
  .el-form {
    margin-bottom: 10px;
  }

  .el-form-item {
    margin-bottom: 10px;
  }

  /deep/ .el-form label {
    padding-bottom: 0px;
  }

  .avatar-uploader {
    height: 185px;
  }

  .avatar-uploader .el-upload {
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

  .dialog-footer button {
    width: 100px;
  }

  /*/deep/ .el-drawer__body {*/
  /*  overflow: auto;*/
  /*}*/
  .drawer_wrap >>> .el-drawer__wrapper > div > div > .el-drawer__body {
    overflow: auto;
  }
</style>
