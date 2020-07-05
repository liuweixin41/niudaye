<template>
  <div class="change-password">
    <card>
      <span slot="title">修改密码</span>
      <div slot="content">
        <el-form
          :model="changePwForm"
          status-icon
          :rules="rules"
          ref="changePwForm"
          label-width="100px"
          class="demo-changePwForm"
          size="small"
        >
          <el-form-item
            label="原密码"
            prop="password"
          >
            <el-input
              v-model="changePwForm.password"
              autocomplete="off"
              class="add-input"
              :type="isClose?'password':'text'"
              :suffix-icon="isClose?'iconfont icon-yanjing-bi':'iconfont icon-yanjing1'"
              @click.native="SwitchClose"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="新密码"
            prop="NewPwd"
          >
            <el-input
              :type="isClose?'password':'text'"
              :suffix-icon="isClose?'iconfont icon-yanjing-bi':'iconfont icon-yanjing1'"
              @click.native="SwitchClose"
              v-model="changePwForm.NewPwd"
              autocomplete="off"
              class="add-input"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="确认新密码"
            prop="age"
          >
            <el-input
              v-model.number="changePwForm.checkPw"
              class="add-input"
              :type="isClose?'password':'text'"
              :suffix-icon="isClose?'iconfont icon-yanjing-bi':'iconfont icon-yanjing1'"
              @click.native="SwitchClose"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('changePwForm')"
            >提交</el-button>
            <el-button @click="resetForm('changePwForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </card>
  </div>
</template>

<script>
import card from "@/components/Card/Card.vue";
import { PASS_REG } from "@/utils/reg";
import { regPwd, changePwd } from "@/api/acc";
import local from "@/utils/storage";
export default {
  components: {
    card
  },
  data() {
    const checkOldPwd = async (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else {
        let { code, msg } = await regPwd({ oldPwd: value });
        if (code == "11") {
           callback(new Error(msg));
        } else {
          //成功了就回调
          callback();
        }
      }
    };
    //输入新密码验证
    const checkNewPwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入新的密码"));
      } else if (!PASS_REG.test(value)) {
        callback(new Error("3到12位（字母，数字，下划线，减号）"));
      } else {
        //做反向一致性的验证
        if (this.changePwForm.checkPw) {
          this.$refs.changePwForm.validateField("checkPw");
        }
      }
      callback();
    };
    //确认新密码
    const confirmPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认新密码"));
      } else if (value !== this.changePwForm.NewPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      changePwForm: {
        password: "",
        NewPwd: "",
        checkPw: ""
      },
      rules: {
        password: [{ required: true, validator: checkOldPwd, trigger: "blur" }],
        NewPwd: [{ required: true, validator: checkNewPwd, trigger: "blur" }],
        checkPw: [{ required: true, validator: confirmPwd, trigger: "blur" }]
      },
      isClose: true
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs.changePwForm.validate(async valid => {
        if (valid) {
          let { code } = await changePwd({
            newPwd: this.changePwForm.NewPwd
          });
          if (code === 0) {
            local.clear();
            this.$router.push("/login");
          } 
        } else {
          console.log("修改不成");
          return;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
.box-card {
  width: 100%;
  .add-input {
    margin-bottom: 15px;
    width: 350px;
  }
}
</style>