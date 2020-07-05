<template>
  <div
    class="mychart"
    ref="mychart"
  ></div>
</template>

<script>
//引入echarts
import echarts from "echarts";
export default {
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    drawcharts() {
      //1.初始化报表
      this.mycharts = echarts.init(this.$refs.mychart);

      //2.写配置
      const option = {
        title: {
          text: this.options.text //外部传入
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: this.options.legend //外部传入
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          //外部
          type: "category",
          boundaryGap: false,
          data: this.options.Xdata
        },
        yAxis: {
          type: "value"
        },
        //外部传入
        series: this.options.series
      };
      //绘制报表
      this.mycharts.setOption(option);
      console.log("绘制图表");
    }
  },
  mounted() {
    this.drawcharts();
  },
  watch: {
    options: {
      //绑定了一个handler方法，之前我们写的 watch 方法其实默认写的就是这个handler，Vue.js会去处理这个逻辑，最终编译出来其实就是这个handler。
      handler(newData, oldData) {
        console.log("检测到数据变化", newData);
        this.mycharts.setOption({
          title: {
            text: newData.text //外部
          },
          legend: {
            data: newData.legend //外部
          },
          xAxis: {
            //外部
            type: "category",
            boundaryGap: false,
            data: newData.Xdata
          },
          //外部传入
          series: newData.series
        });
      },
      deep: true //深度监听，才能能监听到options里属性的值的变化
    }
  }
};
</script>

<style lang="less" scoped>
.mychart {
  width: 100%;
  height: 400px;
}
</style>