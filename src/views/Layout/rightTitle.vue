<template>
  <div class="right-title">
    <el-header style="text-align: right; font-size: 12px">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path:'/' }"></el-breadcrumb-item>
        <el-breadcrumb-item
          v-for="item in breadCrumbArr"
          :key="item.title"
          :to="{ path: item.path }"
        >{{item.title}}</el-breadcrumb-item>

        <el-dropdown @command="handleCommand">
          <span
            class="el-dropdown-link"
            :v-model="userinfo"
          >
            欢迎你,{{userinfo.account}}
            <el-avatar
              :size="60"
              :src="userinfo.imgUrl"
            ></el-avatar>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="personal">
              个人信息
            </el-dropdown-item>
            <el-dropdown-item command="logout">
              退出系统
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </el-breadcrumb>

      <!-- 管理员信息 -->

    </el-header>
  </div>
</template>

<script>
import headimg from "@/assets/avatar.jpg";
import local from "@/utils/storage";
import { getAdminInfo } from "@/api/admin";

export default {
  data() {
    return {
      userinfo: {},
      breadCrumbArr: [] // 面包屑数组
    };
  },
  methods: {
    handleCommand(command) {
      if (command === "personal") {
        this.$router.push("/account/admin_info");
      } else {
        local.clear();
        this.$message({
          type: "success",
          message: "退出登陆成功"
        });
        this.$router.push("/login");

        //退出时要刷新页面，因为路由会重复加载
        location.reload()
      }
    },
    async getInfo() {
      let { accountInfo } = await getAdminInfo();
      this.userinfo = accountInfo;
      local.set("info", accountInfo);
    },
    //取出面包屑方法
    getBreadCumb(route) {
      let arr = [{ title: "首页", path: "/home" }];

      route.matched.forEach(item => {
        if (item.meta.title) {
          arr.push({
            title: item.meta.title,
            path: item.path
          });
        }
      });
      // 赋值
      this.breadCrumbArr = arr;
    }
  },

  created() {
    this.getInfo();
    // 接收更新数据的信息
    this.$bus.$on("updateSuccess", () => {
      this.getInfo(); // 获取头部信息
    });
    this.getBreadCumb(this.$route);
    console.log(this.$route);
  },
  watch: {
    "$route.path"() {
      //监听数据变化
      this.getBreadCumb(this.$route);
    }
  }
};
</script>

<style lang="less" scoped>
.right-title {
  flex: 0 0 50px;
  background-color: white;
  .el-header {
    background-color: white;
    color: #333;
    .el-breadcrumb {
      line-height: 60px;
      .el-dropdown {
        span {
          vertical-align: middle;
        }
      }
    }
  }
}
</style>