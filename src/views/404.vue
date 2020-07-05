<template>

  <div>
    <div class="background">
      <img
        :src="imgSrc"
        width="100%"
        height="100%"
        alt=""
      />
    </div>

    <div class="front">
      <el-button
        type="primary"
        @click="$router.go(-1)"
      >返回上一页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgSrc: require("@/assets/404.png")
    };
  }
};
</script>

<style lang="less" scoped>
.background {
  width: 100%;
  height: 100%; /**宽高100%是为了图片铺满屏幕 */
  z-index: -1;
  position: absolute;
}

.front {
  z-index: 1;
  position: absolute;
  margin:auto;
  left:50%;
  top:80%;
  transform:translate(-50% ,-50%) 
}
</style>