import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from "element-ui"; // JS
import "element-ui/lib/theme-chalk/index.css"; // CSS



//定义总线
//创建一个Vue的实例对象，充当数据传递中介
const $bus = new Vue();
//把中介挂载在Vue原型上面
Vue.prototype.$bus = $bus;



//引入重置文件
// reset.css
import "@/assets/css/reset.css";

//iconfonts文件
import "@/assets/fonts/iconfont.css";

// 注册
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
