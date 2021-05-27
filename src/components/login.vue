<template>
  <el-main class="div_main">
    <div class="div_img">
      <img src="../assets/login1.jpg" width="600px" height="400px"/>
    </div>
    <div class="div_form">
      <el-form :model="login_data" class="login_form" :rules="rules" ref="loginForm">
        <el-form-item>
          <h1 style="text-align: center">登&nbsp;&nbsp;&nbsp;&nbsp;录</h1>
        </el-form-item>
        <el-form-item prop="industry">
          <el-select v-model="login_data.industry" placeholder="请选择行业" @change="select_industry" style="width: 100%">
            <el-option v-for="item in industry_options" :key="item.value" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input placeholder="手机号" v-model="login_data.phone" maxlength="11"
                    onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
        </el-form-item>
        <el-form-item prop="smsCode">
          <el-input class="login_input_code" placeholder="验证码" v-model="login_data.smsCode" maxlength="6"
                    @keyup.enter.native="login">
          </el-input>
          <el-button class="login_btn_code">获取验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login_btn_submit" @click="login">登 录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-main>
</template>

<script>
  export default {
    name: "login",
    data() {
      var check_phone = (rule, value, callback) => {
        if (!this.isCellPhone(value)) {
          callback(new Error('请输入正确的手机号!'))
        } else {
          callback()
        }
      };
      return {
        login_data: {phone: '18600000000', smsCode: '051810'},
        industry_options: [],
        rules: {
          industry: {required: true, message: '请选择行业', trigger: 'change'},
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {min: 11, max: 11, message: '手机号码长度不对', trigger: 'blur'},
            {required: true, validator: check_phone, trigger: 'blur'}
          ],
          smsCode: {required: true, message: '请输入验证码', trigger: 'blur'},
        }
      }
    },
    methods: {
      get_industry() { //获取行业信息
        this.$axios.post('webLogin/smsCode', {"phone": "18600000000", "smsCode": "051810"}).then((response) => {
          let industry_json = response.data.data.industryMap;
          // console.log(industry_json);
          for (var i in industry_json) {
            this.industry_options.push({label: industry_json[i], value: i});
          }
          // console.log(this.industry_options);
        })
      },
      select_industry(value) {
        this.login_data.industry = value;
        // console.log(this.login_data);
      },
      login() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            // console.log(this.login_data);
            this.$axios.post('webLogin/industry', {
              "phone": this.login_data.phone, "smsCode": this.login_data.smsCode, "industry": this.login_data.industry
            }).then((response) => {
              // console.log(response.data);
              let token = response.data.data.token;
              sessionStorage.setItem('token', token);
              sessionStorage.setItem('menuData', JSON.stringify(response.data.data.menuDtoList));
              // this.$store.commit('updateMenuData', response.data.data.menuDtoList);
              this.$router.replace('/mainf/wel');
            })
          } else {
            return false;
          }
        })
      },
      isCellPhone(val) {  //简单的判断手机号码格式
        if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
          return false
        } else {
          return true
        }
      }
    },
    mounted() {
      this.get_industry();
    }
  }
</script>

<style scoped>
  body, .div_main {
    margin: 0;
    padding: 0;
  }

  .div_main {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .div_img {
    margin-right: -100px;
  }

  .div_form {
    box-shadow: 0 0 25px cadetblue;
    width: 460px;
    height: 360px;
    background-color: white;
  }


  .login_input_code {
    width: 60%;
  }

  .login_btn_code {

  }

  .login_form {
    margin: 30px 80px auto 80px;
  }

  .login_btn_submit {
    width: 100%;
  }
</style>
