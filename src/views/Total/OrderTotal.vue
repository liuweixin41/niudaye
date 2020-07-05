<template>
  <div class="goods-count">
    <card>
      <div slot="title">
        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
        >
          <el-form-item label="选择时间">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separato="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              placeholder="选择日期"
              v-model="formInline.date"
              style="width: 100%;"
            ></el-date-picker>

          </el-form-item>
          <el-button
            type="primary"
            @click="search"
          >查询</el-button>
        </el-form>
      </div>
      <div slot="content">
        <Chart :options="options" />
      </div>
    </card>
  </div>
</template>

<script>
import card from "@/components/Card/Card.vue";
import Chart from "@/components/echart/chart.vue";
import moment from "moment";
import { geOrderdata } from "@/api/charts";
export default {
  components: {
    card,
    Chart
  },
  data() {
    return {
      formInline: {
        date: []
      },
      options: {
        text: "订单统计",
        legend: ["销售额"],
        Xdata: [],
        series: []
      }
    };
  },
  methods: {
    async search() {
      let { data } = await geOrderdata({
        date: JSON.stringify(this.formInline.date)
      });
      let newXdata = [];
      let newData = [];
      data.forEach((v, i) => {
        v.orderTime = moment(v.orderTime).format("YYYY-MM-DD HH:mm:ss");
        newXdata.push(v.orderTime);
        newData.push(v.orderAmount);
      });
      this.options.Xdata = newXdata;
      this.options.series = {
        name: "销售额",
        type: "line",
        stack: "总量",
        data: newData
      };
    }
  },

  mounted() {
    this.search();
  }
};
</script>

<style lang="less" scoped>
</style>