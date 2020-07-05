<template>
  <div class="home">
    <card>

      <div slot="content">

        <section class="counter">
          <el-row :gutter="15">
            <el-col
              v-for="(item, i) in dataList"
              :span="6"
              :key="i"
            >
              <div class="item">
                <div class="icon">
                  <img
                    width="50"
                    height="50"
                    :src="item.iconSrc"
                  />
                </div>
                <div class="count">
                  <p>{{ item.title }}</p>
                  <h1>{{ item.count }}</h1>
                </div>
              </div>
            </el-col>
          </el-row>
          <!-- 画布标签 -->
          <Chart :options="options" />
        </section>
      </div>
    </card>
  </div>
</template>

<script>
import echarts from "echarts";
import card from "@/components/Card/Card.vue";
import Chart from "@/components/echart/chart.vue";
import { getTotaldata } from "@/api/charts";

export default {
  components: {
    card,
    Chart
  },
  data() {
    return {
      dataList: [
        {
          iconSrc: require("@/assets/index1.jpg"),
          title: "总订单",
          count: 102400
        },
        {
          iconSrc: require("@/assets/index2.jpg"),
          title: "总销售额",
          count: 102400
        },
        {
          iconSrc: require("@/assets/index3.jpg"),
          title: "今日订单",
          count: 102400
        },
        {
          iconSrc: require("@/assets/index4.jpg"),
          title: "今日销售额",
          count: 102400
        }
      ],
      /*  date: ["2020-5-16", "2020-5-17", "2020-5-18", "2020-5-19"],
      goods: [100, 200, 300, 400],
      users: [1, 3, 2, 5], */
      options: {
        text: "数据统计",
        legend: ["订单", "销售额"],
        Xdata: [],
        series: [
          /*   {
            name: "商品数量",
            type: "line",
            stack: "总量",
            data: [100, 200, 300, 400]
          },
          {
            name: "管理员人数",
            type: "line",
            stack: "总量",
            data: [1, 3, 2, 5]
          } */
        ]
      }
    };
  },
  methods: {
    async getChartsData() {
      let {
        totalOrder,
        totalAmount,
        todayOrder,
        totayAmount,
        xData,
        orderData,
        amountData
      } = await getTotaldata();

      let newarr = [totalOrder, totalAmount, todayOrder, totayAmount];
      newarr.forEach((v, i) => {
        this.dataList[i].count = v;
      });

      //填入报表的数据
      this.options.Xdata = xData;
      this.options.series = [
        {
          name: "订单",
          type: "line",
          stack: "总量",
          data: orderData
        },
        {
          name: "销售额",
          type: "line",
          stack: "总量",
          data: amountData
        }
      ];

      console.log("获取数据赋值");
    }
  },
  mounted() {
    this.getChartsData();
  }
};
</script>

<style lang="less" scoped>
.counter {
  width: 100%;
  height: 600px;
  .bg {
    background-color: white;
    display: flex;
    align-content: space-between;
    img {
      height: 60px;
    }
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-white-dark {
    background: #99a9bf;
  }
  .bg-white {
    background: #d3dce6;
  }
  .bg-white-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
}
</style>