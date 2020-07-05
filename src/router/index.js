import Vue from "vue";
import VueRouter from "vue-router";

/**
 * 重写路由的push方法
 */
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
};

Vue.use(VueRouter);


//引入操作storage的组件
import local from "@/utils/storage";

// 引入路由组件
import Login from "@/views/login.vue";
import Layout from "@/views/Layout/Main.vue";

// 路由配置
//异步路由，之后再算出来有哪些再去挂载
export const asyncRoutes = [
  // 登录
  {
    path: "/login",
    component: Login,
    visible: false,
  },
  // 默认首页 -- 报表
  {
    path: "",
    component: Layout,
    redirect: "/home",
    visible:true,
    children: [
      {
        meta: { title: "后台首页" },
        path: "home",
        component: () => import("@/views/Home.vue"),
      },
    ],
  },

  // 订单管理
  {
    path: "/order",
    component: Layout,
    meta: { title: "订单管理" },
    redirect: "/oreder/order-list",
    visible:true,
    children: [
      {
        path: "order-list",
        meta: { titie: "订单列表" },
        visible: true,
        component: () => import("@/views/OrderManage/OrderList.vue"),
      },
      {
        path: "order-detail",
        meta: { titie: "订单详情" },
        name: 'orderDetail',
        visible: false,
        component: () => import("@/views/OrderManage/OrderDetail.vue"),
      },
    ],
  },
  // 商品管理
  {
    path: "/goods",
    component: Layout,
    meta: { title: "商品管理" },
    redirect: "/goods-list",
    visible:true,
    children: [
      {
        path: "goods-list",
        meta: { title: "商品列表" },
        component: () => import("@/views/GoodsManage/GoodsLists.vue"),
      },
      {
        path: "goods-add",
        meta: { title: "添加商品" },
        component: () => import("@/views/GoodsManage/GoodsAdd.vue"),
      },
      {
        path: "goods-kind",
        meta: { title: "商品类别" },
        component: () => import("@/views/GoodsManage/GoodsKind.vue"),
      },
    ],
  },
  // 店铺管理
  {
    path: "/shop",
    component: Layout,
    visible:true,
    children: [
      {
        path: "",
        meta: { title: "店铺管理" },
        component: () => import("@/views/ShopManage/ShopManage.vue"),
      },
    ],
  },
  // 账号管理
  {
    path: "/account",
    component: Layout,
    visible:true,
    meta: { title: "帐号管理", roles: ["super", "normal"] },
    redirect: "/account-list",
    children: [
      {
        path: "account-list",
        meta: { title: "账号列表", roles: ["super"] },
        component: () => import("@/views/AccountManage/AccountList.vue"),
      },
      {
        path: "account-add",
        meta: { title: "账号添加", roles: ["super"] },
        component: () => import("@/views/AccountManage/AddAccount.vue"),
      },
      {
        path: "pass-change",
        meta: { title: "修改密码" },
        component: () => import("@/views/AccountManage/ChangePW.vue"),
      },
      {
        path: "admin_info",
        meta: { title: "管理员信息" },
        visible:false,
        component: () => import("@/views/adminInfo.vue"),
      },
    ],
  },
  // 销售统计
  {
    path: "/total",
    component: Layout,
    visible:true,
    redirect: "/goods-total",
    meta: { title: "销售统计", roles: ["super"] },//超管才能访问
    children: [
      {
        path: "goods-total",
        meta: { title: "商品统计" },
        component: () => import("@/views/Total/GoodsTotal.vue"),
      },
      {
        path: "order-total",
        meta: { title: "订单统计" },
        component: () => import("@/views/Total/OrderTotal.vue"),
      },
    ],
  },

  //404
  {
    path: '/404',
    visible:false,
    component: () => import("@/views/404.vue")
  },
  {
    path: '/*',
    redirect: '/404',
    visible:false,
  }
];


const router = new VueRouter({
  //初始化路由，定义默认能够访问的两个。首页和后台首页
  routes: [
    // 登录
    {
      path: "/login",
      component: Login,
    },
    // 默认首页 -- 报表
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        meta: { title: "后台首页" },
        path: "home",
        component: () => import("@/views/Home.vue"),
      },
     
    ],
  },
  ],
});

/**路由守卫 */
/**把所有路由守护起来  用法参考官网*/
router.beforeEach((to, from, next) => {
  /* console.log(to);
  console.log(from);
  console.log(nest) */
  let tokenExist = local.get("tk") ? true : false;
  //进入到登录时放行让用户登入
  if (to.path === "/login") {
    next()
  }//另一种情况直接输入其他页面路由时判断token是否已存入存入就放行否则强制回去登录
  else {
    if (tokenExist) {
      next();//token存在就放行
    } else { next("/login") }
  }
})

export default router;

