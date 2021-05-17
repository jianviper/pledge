<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-col :span="6"><label for="name1">机构名称</label></el-col>
        <el-col :span="16">
          <el-input id="name1" placeholder="模糊匹配"></el-input>
        </el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="6"><label for="code1">机构代码</label></el-col>
        <el-col :span="16">
          <el-input id="code1" placeholder="机构代码"></el-input>
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
      <el-col :span="4">
        <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "managementListJXSB",
    data() {
      return {
        name: '',
        code: '',
        statusOption: [
          {value: '', label: '全部'},
          {value: '0', label: '正常'},
          {value: '1', label: '失效'},
        ],
        statusValue: '',
      }
    },
    methods: {
      search() {
        console.log(this.name, this.code, this.statusValue);
      }
    }
  }
</script>

<style scoped>
  label {
    line-height: 40px;
  }

  .select_wrap {
    text-align: left;
  }
</style>
