<template>
  <div class="login_container">
    <!-- 登录盒子 -->
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form
        ref="loginFormRef"
        :rules="ruleForm"
        :model="loginForm"
        label-width="0px"
        class="login_from"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          >
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          >
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetloginFormRef">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      // 表单数据绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证
      ruleForm: {
        // 用户名验证
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
        // 密码验证
        password: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6到 15 个字符', trigger: 'blur' }
        ]

      }

    }
  },
  methods: {
    // 表单重启
    resetloginFormRef () {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    // 表单预验证
    login () {
      // console.log(this)
      this.$refs.loginFormRef.validate(async (valid) => {
        console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // console.log(res)
        //  把登陆成功的token保存到sessionStorage
        window.sessionStorage.setItem('token', res.data.token)
        // 使用编程式导航，跳转到后台主页
        this.$router.push('/home')
      })
    }

  }
}

</script>

<style lang="scss" scoped>
.login_container {
  background-color: #2b5b6b;
  height: 100%;
}
// 登录盒子的样式
.login_box {
  height: 300px;
  width: 450px;
  background-color: #fff;
  border-radius: 2px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #ddd;
  padding: 10px;
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_from {
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  box-sizing: border-box;
  width: 100%;
}
</style>
