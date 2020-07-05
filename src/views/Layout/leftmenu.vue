<template>
  <div class="left-menu">
    <!-- 导航 -->
    <el-menu
      :default-active="correctAct"
      router
      text-color="#fff"
      background-color="#304156"
      unique-opened
    >
      <template v-for="(item,i) in menus">
        <!-- 无二级路由的菜单 -->
        <el-menu-item
          v-if="item.children && item.children.length === 1"
          :index="item.path + '/' + item.children[0].path"
          :key="i"
        >

          <span slot="title">
            {{
              item.meta && item.meta.title
                ? item.meta.title
                : item.children[0].meta.title
            }}</span>
        </el-menu-item>

        <!-- 有儿子的 -->
        <el-submenu
          v-if="item.children && item.children.length > 1"
          :index="item.path"
          :key="i"
        >
          <template slot="title">
            <span>{{ item.meta.title }}</span>
          </template>

          <el-menu-item
            v-for="(v, i) in item.children"
            :key="i"
            :index="item.path + '/' + v.path"
          >{{ v.meta.title }}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>

  </div>
</template>

<script>
import { getRole } from "@/api/admin";
import router, { asyncRoutes } from "@/router"; //引入路由实例对象和asyncrouter配置
export default {
  data() {
    return {
      menus: []
    };
  },
  computed: {
    correctAct() {
      if (this.$router.path == "order/order-detail") {
        return this.$router.path == "order/order-list";
      } else if (this.$router.path == "/") {
        return this.$router.path == "home";
      }
      return this.$router.path;
    }
  },

  async created() {
    let { role } = await getRole();

    //封装一个函数判断当前【路由对象】是否有权限，传入路由对象

    /* 
  判断是否有权限的函数
  参数1: 路由对象
  参数2: 当前角色
  返回值: true证明有权限  false证明没有权限
*/
    function hasPermission(route, role) {
      if (route.meta && route.meta.roles) {
        return route.meta.roles.includes(role);
      } else {
        return true; //没有role字段表示mo'ren
      }
    }

    //把可以访问的路由过滤出来
    function guolvRoutes(asyncRoutes, role) {
      let tongguoRouter = asyncRoutes.filter(item => {
        if (hasPermission(item, role)) {
          if (item.children && item.children.length) {
            console.log("有权限:", item);
            item.children = guolvRoutes(item.children, role);
          }
          return true;
        } else {
          //console.log("没权限:", item);
          return false;
        }
      });
      return tongguoRouter;
    }
    let accessRouter = guolvRoutes(asyncRoutes, role);
    //console.log(accessRouter)
    //动态加载路由（加算出来的）
    router.addRoutes(accessRouter);
    console.log(accessRouter);

    //根据visible字段计算菜单
    this.menus = accessRouter.filter(item => {
      if (item.children && item.children[0].visible) {
        item.children = item.children.filter(v => v.visible);
      }
      return item.visible;
    });
  }
};
</script>

<style lang="less" scoped>
.left-menu {
  flex: 0 0 200px;
  background-color: #304156;
  .el-menu {
    border-right: 0px;
  }
}
</style>