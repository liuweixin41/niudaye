<template>
  <div class="main">
    <Leftmenu></Leftmenu>
    <!-- 右侧 -->
    <div class="right">
      <rightTitle></rightTitle>
       <div class="content">
      <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Leftmenu from "./leftmenu.vue";
import rightTitle from "./rightTitle.vue";
export default {
  components: {
    Leftmenu,
    rightTitle
  }
};
</script>

<style lang="less" scoped>
.main {
  height: 100%;
  display: flex;

  .right {
    width: 80%;
    flex: 1;
    background-color: #f0f2f5;
    display: flex;
    flex-direction: column;
    .content {
      flex: 1;
      padding: 20px;
      box-sizing: border-box;
      overflow: scroll;
    }
  }
}
</style>