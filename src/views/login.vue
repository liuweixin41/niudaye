<template>

<div class="login" :style="{background:'url('+bg+')'}">
    <el-form
      :model="loginForm"
      :rules="rules"
      class="login-form"
      status-icon
      ref="loginForm"
      label-width="100px"
      size="small"
    >
      <el-form-item
        label="账号"
        prop="account"
      >
        <el-input
          prefix-icon="iconfont icon-yonghu4"
          v-model="loginForm.account"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="密码"
        prop="password"
      >
        <el-input
          v-model="loginForm.password"
          autocomplete="off"
          :type="isClose?'password':'text'"
          :suffix-icon="isClose?'iconfont icon-yanjing-bi':'iconfont icon-yanjing1'"
          @click.native="SwitchClose"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          size="mini"
          type="primary"
          @click="submitForm"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { checkLogin } from "@/api/acc";
import { getRole} from "@/api/admin";
import local from "@/utils/storage";
export default {
  data() {
    return {
      bg: require ("@/assets/1.jpg"),
      // 登录表单数据对象
      loginForm: {
        account: "",
        password: ""
      },
      // 验证规则
      rules: {
        /*   // 1-内置验证:  单条规则
        account: { required: true, message: "请输入账号", trigger: "blur" }, */

        // 2- 内置验证: 多条规则
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 12, message: "长度 3 ~12 位", trigger: "blur" }
        ],

        password: { required: true, message: "请输入密码", trigger: "blur" }
      },
      isClose: true
    };
  },
  methods: {
    submitForm() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          //console.log("全部验证都通过,可以发送ajax给后端提交");

          //一般写法
          //checkLogin(this.loginForm).then(res=>{console.log(res)}).catch(err=>{console.log(err)})

          let { code, token,role } = await checkLogin(this.loginForm);

          if (code === 0) {
            //存入token
            local.set("tk", token);
            local.set("role",role)
            this.$router.push("/");
          }
        } else {
          console.log("验证未通过");
          return;
        }
      });
    },
    SwitchClose(e) {
      if (e.target.className.includes("icon-yanjing")) {
        this.isClose = !this.isClose;
      }
    }
  }
};
</script>

<style lang="less" scoped>

.login {
  height: 100%;
  background: #2d3a4b;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {
    width: 420px;
    .el-form-item {
      text-align: center;
      /deep/.el-form-item__label {
        color: #fff;
      }
    }
  }
}
</style>