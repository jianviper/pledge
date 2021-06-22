<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-col :span="8"><label for="name">姓名</label></el-col>
        <el-col :span="16">
          <el-input id="name" placeholder="请输入姓名" v-model="searchData.name">
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
      <el-col :span="8">
        <el-col :span="8"><label for="">所属机构</label></el-col>
        <el-col :span="16">
          <el-select v-model="searchData.agencyId">
            <el-option v-for="option in agencyOptions"
                       :key="option.id"
                       :label="option.agencyAbbreviation"
                       :value="option.id"></el-option>
          </el-select>
        </el-col>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px">
      <el-col :span="8">
        <el-col :span="8"><label for="">监管仓</label></el-col>
        <el-col :span="16">
          <el-select v-model="searchData.storageId">
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
    <el-table :data="tableData"
              border
              stripe
              style="width: 1061px" :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}">
      <el-table-column prop="serial" label="序号" width="80"></el-table-column>
      <el-table-column prop="mobile" label="登录账号" width="160"></el-table-column>
      <el-table-column prop="name" label="用户姓名" width="80"></el-table-column>
      <el-table-column prop="agencyName" label="所属机构" width="100"></el-table-column>
      <el-table-column prop="warehouseNames" label="监管仓" width="200"></el-table-column>
      <el-table-column prop="roleDescription" label="角色" width="80"></el-table-column>
      <el-table-column prop="notes" label="备注" width="100"></el-table-column>
      <el-table-column prop="state" label="状态" width="80">
        <template slot-scope="scope">
          <p v-if="scope.row.state===0">正常</p>
          <p v-else-if="scope.row.state===1">失效</p>
          <p v-else-if="scope.row.state===2">删除</p>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button @click="editRow(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="delRow(scope.$index, scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="setRole(scope.$index, scope.row)" type="text" size="small">配置角色</el-button>
          <el-button @click="setStorage(scope.$index, scope.row)" type="text" size="small">配置监管仓</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pager :dataList="tableData" :currentPage="currentPage" :totalSize="total"
           @returnsliceData="accpetSliceData" class="pager"></Pager>
    <el-dialog title="添加资方" :visible.sync="dialogVisible" width="500px" @close="close_dialog()"
               :close-on-click-modal='false'>
      <el-form :model="userFormData" ref="userFormData" label-position="left" label-width="100px" :rules="rules"
               class="addForm">
        <el-form-item label="序号" prop="serial">
          <el-input v-model="userFormData.serial"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userFormData.mobile"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" prop="name">
          <el-input v-model="userFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="idCardNo">
          <el-input v-model="userFormData.idCardNo" maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="机构代码" prop="agencyId">
          <el-select v-model="userFormData.agencyId">
            <el-option v-for="option in agencyOption"
                       :key="option.id"
                       :label="option.agencyAbbreviation"
                       :value="option.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="userFormData.notes"></el-input>
        </el-form-item>
        <el-form-item label="账号状态" prop="state">
          <el-radio-group v-model="userFormData.state" @change="statusChange">
            <el-radio :label='0'>正常</el-radio>
            <el-radio :label='1'>失效</el-radio>
            <el-radio :label='2'>删除</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="add_submit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="用户角色配置" :visible.sync="setRoleVisible" width="500px">
      <el-radio-group v-model="role_value" style="text-align: left">
        <el-radio v-for="item in roleOptions" :label="item.id" :key="item.id">{{item.description}}</el-radio>
      </el-radio-group>
      <div style="text-align: right">
        <el-button type="primary" @click="role_submit" style="text-align: right">确 定</el-button>
        <el-button type="primary" @click="setRoleVisible=false;" style="text-align: right">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="监管仓配置" :visible.sync="setStroageVisible" width="600px">
      <el-checkbox-group v-model="storageCheckList">
        <el-checkbox v-for="item in storageOption" :label="item.id" :key="item.id">
          {{item.agencyAbbreviation}}
        </el-checkbox>
      </el-checkbox-group>
      <div style="text-align: right">
        <el-button type="primary" @click="storage_submit" style="text-align: right">确 定</el-button>
        <el-button type="primary" @click="setStroageVisible=false;" style="text-align: right">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pager from '../../parts/Pager'

  export default {
    name: "userListJXSB",
    components: {Pager},
    data() {
      let checkMobile = (rule, value, callback) => {
        console.log(value);
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
        setRoleVisible: false,
        setStroageVisible: false,
        searchData: {name: '', mobile: '', agencyId: '', storageId: '', state: ''},
        pagingData: {name: '', mobile: '', agencyId: '', storageId: '', state: ''},
        agencyOption: [], //添加和修改界面的所属机构选项
        agencyOptions: [], //所属机构
        storageOption: [], //监管仓配置选项
        storageOptions: [], //监管仓
        roleOptions: [],
        role_value: '',
        storageCheckList: [],
        statusOption: [
          {value: '', label: '全部'},
          {value: '0', label: '正常'},
          {value: '1', label: '失效'},
          {value: '2', label: '删除'},
        ],
        tableData: [], //表格数据
        userFormData: {serial: '', mobile: '', name: '', idCardNo: '', agencyId: '', notes: '', state: 0},
        rowData: {},
        currentPage: 1,
        pageSize: 10,
        total: 0,
        rules: {
          serial: {required: true, message: '请输入序号', trigger: 'blur'},
          mobile: {validator: checkMobile, trigger: 'blur'},
          name: {required: true, message: '请输入用户姓名', trigger: 'blur'},
          idCardNo: [{required: true, message: '请输入身份证号码', trigger: 'blur'},
            {min: 18, max: 18, message: '身份证号码格式不对', trigger: "blur"}
          ],
          state: {required: true, message: '请选择状态', trigger: 'change'},
          agencyId: {required: true, message: '请选择机构', trigger: 'change'}
        }
      }
    },
    methods: {
      add() {
        this.dialogVisible = true;
      },
      add_submit() {
        this.$refs['userFormData'].validate((valid) => {
          if (valid) {
            this.$axios.post('baseInfo/user/save', this.userFormData).then((response) => {
              if (response.data.code === 200) {
                this.dialogVisible = false;
                if (this.addflag) {
                  this.init_data();
                }
              }
            });
          } else {
            return false;
          }
        })
      },
      editRow(index, rowData) {
        console.log(index, rowData);
        this.userFormData = JSON.parse(JSON.stringify(rowData));
        this.dialogVisible = true;
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
      setRole(index, rowData) {
        this.role_value = rowData.roleId + '';
        this.setRoleVisible = true;
        this.rowData = JSON.parse(JSON.stringify(rowData));
      },
      role_submit() {
        console.log(this.role_value, this.rowData);
        let data = {
          // 'i': this.role_value == 1 || this.role_value == 8 ? 1 : this.role_value - 1,
          'id': this.role_value,
          'userId': this.rowData.id
        };
        this.$axios.post('baseInfo/role/saveUserRole', data).then((response) => {
          if (response.data.code === 200) {
            this.init_data();
            this.setRoleVisible = false;
            this.$message({
              type: 'success',
              message: '配置成功!'
            });
          } else {
            this.$message({
              type: 'error',
              message: response.data.message
            });
          }
        })
      },
      setStorage(index, rowData) {
        console.log(index, rowData);
        console.log(this.storageOption);
        this.storageCheckList = [];
        this.rowData = JSON.parse(JSON.stringify(rowData));
        if (rowData.warehouseIds) {
          rowData.warehouseIds.split(',').map((item) => {
            this.storageCheckList.push(item);
          });
        }
        this.setStroageVisible = true;
      },
      storage_submit() { //配置监管仓提交
        let warehouseNames = [];
        this.storageCheckList.map((item) => {
          this.storageOption.map((op) => {
            if (op.id === item) {
              warehouseNames.push(op.agencyAbbreviation);
              return true;
            }
          })
        });
        warehouseNames = warehouseNames.join();
        let warehouseIds = this.storageCheckList.join();
        console.log(warehouseIds, warehouseNames);
        this.$axios.post('baseInfo/user/deployWarehouse', {
          'userId': this.rowData.id,
          'warehouseIds': warehouseIds,
          'warehouseNames': warehouseNames
        }).then((response) => {
          if (response.data.code === 200) {
            this.init_data();
            this.setStroageVisible = false;
            this.$message({
              type: 'success',
              message: '配置成功!'
            });
          } else {
            this.$message({
              type: 'error',
              message: response.data.message
            });
          }
        })
      },
      storageSelectChange(value) {
        // console.log('select', value);
      },
      statusChange(value) {
        this.userFormData.state = value;
      },
      iconClick(ev) { //点击输入框右侧 x 按钮清空输入框
        let ele_id = ev.path[3].getElementsByTagName('input')[0].id;
        if (ele_id === 'name') {
          this.searchData.name = '';
        } else if (ele_id === 'mobile') {
          this.searchData.mobile = '';
        }
      },
      get_agencyOptions() {
        this.$axios.get('baseInfo/agency/allList').then((response) => {
          this.agencyOption = JSON.parse(JSON.stringify(response.data.data));
          this.agencyOptions = response.data.data;
          this.agencyOptions.splice(0, 0, {agencyAbbreviation: '全部', id: ''});
        })
      },
      get_storageOptions() {
        this.$axios.post('baseInfo/agency/storageList', {"current": 1, "size": 100}).then((response) => {
          this.storageOption = JSON.parse(JSON.stringify(response.data.data.records));
          this.storageOptions = response.data.data.records;
          this.storageOptions.splice(0, 0, {agencyAbbreviation: '全部', id: ''});
        })
      },
      get_role() {
        this.$axios.get('baseInfo/role/list').then((response) => {
          this.roleOptions = response.data.data;
        });
      },
      init_data() {
        this.$axios.post('baseInfo/user/list',
          {
            "name": this.pagingData.name,
            "mobile": this.pagingData.mobile,
            "agencyId": this.pagingData.agencyId,
            "storageId": this.pagingData.storageId,
            "state": this.pagingData.state,
            "current": this.currentPage,
            "size": this.pageSize,
          }).then((response) => {
          this.tableData = response.data.data.records;
          this.total = response.data.data.totalSize;
        });
      },
      search() {
        this.currentPage = 1;
        this.pagingData = JSON.parse(JSON.stringify(this.searchData));
        this.init_data();
      },
      accpetSliceData(data) { //接受分页器返回的数据
        this.currentPage = data.currentPage;
        this.pageSize = data.pageSize;
        this.init_data();
      },
      cancel() {
        this.dialogVisible = false;
        this.userFormData = {state: 0};
        this.$refs['userFormData'].resetFields();
      },
      close_dialog() {
        this.userFormData = {state: 0};
        this.$refs['userFormData'].resetFields();
      }
    },
    mounted() {
      this.init_data();
      this.get_agencyOptions();
      this.get_storageOptions();
      this.get_role();
    }
  }
</script>

<style scoped>
  label {
    line-height: 40px;
  }

  .el-table {
    margin: 20px;
  }

  .del {
    line-height: 40px;
  }

  .el-select {
    float: left;
  }

  .addForm .el-form-item {
    margin-left: 50px;
    margin-right: 50px;
  }
</style>
