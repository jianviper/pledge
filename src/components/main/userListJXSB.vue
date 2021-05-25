<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-col :span="8"><label for="name">姓名</label></el-col>
        <el-col :span="16">
          <el-input id="name" placeholder="请输入姓名" v-model="name">
            <i class="el-icon-close del" slot="suffix" @click="iconClick"></i>
          </el-input>
        </el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="8"><label for="mobile">手机</label></el-col>
        <el-col :span="16">
          <el-input id="mobile" placeholder="请输入手机号" v-model="mobile">
            <i class="el-icon-close del" slot="suffix" @click="iconClick"></i>
          </el-input>
        </el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="8"><label for="agency">所属机构</label></el-col>
        <el-col :span="16">
          <el-input id="agency" placeholder="请输入姓名" v-model="agency">
            <i class="el-icon-close del" slot="suffix" @click="iconClick"></i>
          </el-input>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "userListJXSB",
    data() {
      return {
        name: '',
      }
    },
    methods: {
      iconClick(ev) {
        let id = ev.path[3].getElementsByTagName('input')[0].id;
        // console.log(ev, id);
        if (id === 'name') {
          this.name = '';
        } else if (id === 'code') {
          this.code = '';
        }
      },
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
</style>
