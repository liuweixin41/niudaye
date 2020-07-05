<template>
  <div class="add-account">
    <card>
      <span slot="title">账号添加</span>

      <div slot="content">

        <el-form
          :model="AddAccountForm"
          :rules="rules"
          status-icon
          ref="AddAccountForm"
          label-width="100px"
          class="AddAccountForm"
          size="small"
        >
          <!-- 帐号 -->
          <el-form-item
            label="帐号"
            prop="account"
          >
            <el-input
              v-model="AddAccountForm.account"
              autocomplete="off"
              class="add-input"
            ></el-input>
          </el-form-item>

          <!-- 密码 -->
          <el-form-item
            label="密码"
            prop="password"
          >
            <el-input
              type="password"
              v-model="AddAccountForm.password"
              autocomplete="off"
              class="add-input"
            ></el-input>
          </el-form-item>

          <!-- 用户组 -->
          <el-form-item label="用户组">
            <el-select
              v-model="AddAccountForm.userGroup"
              placeholder="请选择你的用户组"
            >
              <el-option
                label="普通管理员"
                value="普通管理员"
              ></el-option>
              <el-option
                label="超级管理员"
                value="超级管理员"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('AddAccountForm')"
            >添加</el-button>
            <el-button @click="resetForm('AddAccountForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </card>
  </div>
</template>

<script>
import card from "@/components/Card/Card.vue";
import { ACC_REG, PASS_REG } from "@/utils/reg";
import { AddAccount } from "@/api/acc";

export default {
  components: { card },
  data() {
    var validateAccount = (rule, value, callback) => {
      /*
      rule:一个对象，里面有很多验证规则信息
      value:用户输入的值
      callback:回调函数 如果成功调用callback()   如果失败： callback(new Error("提示的错误信息"));
      */
      if (!value) {
        callback(new Error("请输入帐号"));
      } else if (!ACC_REG.test(value)) {
        callback(new Error("3到12位（字母，数字，下划线，减号）"));
      } else {
        callback();
      }
    };

    var validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else if (!PASS_REG.test(value)) {
        callback(new Error("3到12位（字母，数字，下划线，减号）"));
      } else {
        callback();
      }
    };
    return {
      AddAccountForm: {
        account: "",
        password: "",
        userGroup: "普通管理员"
      },
      rules: {
        account: [
          { required: true, validator: validateAccount, trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: "blur" }
        ],
        userGroup: [
          { required: true, message: "请选择一个用户组", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let { code } = await AddAccount(this.AddAccountForm);
          if (code === 0) {
            this.$router.push("/account/account-list");
          }
        } else {
          console.log("错误，不能提交");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.add-account {
  .box-card {
    width: 100%;
    .add-input {
      margin-bottom: 15px;
      width: 350px;
    }
  }
}
</style>