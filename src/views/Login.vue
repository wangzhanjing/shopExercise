<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>
      <!-- 登录表单区域 -->
      <el-form label-width="0px"
               class="login_form"
               :model="loginForm"
               :rules="loginFormRules"
               ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user"
                    v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-unlock"
                    v-model="loginForm.password"
                    type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary"
                     @click="login">登录</el-button>
          <el-button type="info"
                     @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单的数据绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 点击重置按钮重置表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async vaild => {
        // console.log(vaild) vaild是布尔类型的
        if (!vaild) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败!')
        this.$message.success('登录成功!')
        // 1.将成功登录之后的token保存到客户端的sessionStorage中
        //  1.1项目中除了登录之外的页面，都需要登录成功后才能进行访问
        //  1.2token只应该在网站打开期间生效，所以才将token保存到客户端的sessionStorage中
        // console.log(res)
        window.sessionStorage.setItem('token', res.data.token)
        // 2.通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
    // directives: {
    //   focus: {
    //     // 指令的定义
    //     inserted: function (el) {
    //       el.focus()
    //     }
    //   }
    // }

  }
}

</script>

<style lang="less" scoped>
.login_container {
  background-color: #8bc1e2;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3 px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border-radius: 50%;
    border: 1px solid #eee;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #abc;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0px 20px;
  box-sizing: border-box; //登录表单的样式重点记
}
</style>
