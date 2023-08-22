<template>
  <div class="login_container">
    <div class="bg-box">
      <img src="../assets/bg.png" alt="" />
    </div>
    <div class="login-box">
      <div class="ava-box">
        <img src="../assets/logo copy.png" alt="" />
      </div>
      <div class="text">电商后台管理系统</div>
      <!-- 用户名 -->
      <el-form
        class="login-form"
        :model="loginForm"
        :rules="loginRules"
        ref="LoginFormRef"
      >
        <el-form-item class="el-form-item" prop="username">
          <el-input
            class="el-input"
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item class="el-form-item" prop="password">
          <el-input
            class="el-input"
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="el-btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //登录的表单数据绑定
      loginForm: {
        username: "admin",
        password: "123456",
      },
      //校样规则
      loginRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "长度在3-10个字符",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 15,
            message: "长度在6-15个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    reset() {
      this.$refs.LoginFormRef.resetFields();
    },
    login() {
      this.$refs.LoginFormRef.validate(async (valid) => {
        //console.log(valid)如果vaild值不为true，则不发起网络请求
        // console.log(valid);
        if (!valid) return false;
        const { data: res } = await this.$http.post("login", this.loginForm);

        // console.log(result);
        //查看是否成功，成功返回promise
        //console.log(res);
        //判断登录是否成功
        if (res.meta.status != 200) return this.$message.error("登录失败");
        console.log(res.data.token);
        this.$message.success("登录成功");

        //将登陆后的token保存到客户端浏览器
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style scoped>
.el-btns {
  position: relative;
  right: -25%;
}
.login-form {
  position: relative;
  top: -30%;
}
.text {
  font-size: 18px;
  color: #93defe;
  position: relative;
  top: -40%;
  left: 27%;
}
.ava-box img {
  position: relative;
  left: 30px;
  top: 18px;
}
/* */
.ava-box {
  width: 120px;
  height: 120px;
  border-radius: 100%;
  border: 5px solid #93defe;
  background-color: aliceblue;
  position: relative;
  left: 29%;
  bottom: 50%;
  line-height: 100%;
}
.login-box {
  width: 400px;
  height: 350px;
  background-color: aliceblue;
  border-radius: 2%;
  padding: 50px;
  box-sizing: border-box;
  position: relative;
  left: 60%;
  top: 30%;
}
.login_container {
  background-color: #93defe;
  height: 100%;
}
.bg-box {
  position: fixed;
  left: 150px;
  top: 10%;
}
</style>