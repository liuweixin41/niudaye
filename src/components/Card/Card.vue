<template>
  <el-card class="box-card">
    <!-- 标题 -->
    <div
      slot="header"
      class="clearfix"
    >

      <slot name="title"></slot>
    </div>

    <!-- 内容 -->
    <div class="content">
      <slot name="content"></slot>
    </div>
  </el-card>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}



</style>