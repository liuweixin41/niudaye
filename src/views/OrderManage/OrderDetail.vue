<template>
  <card>
    <div slot="title">订单详情</div>
    <div
      slot="content"
      class="content"
    >
      <div class="left">
        <p>
          <span>订单ID:</span>{{tabledata.id}}
          <el-divider></el-divider>
        </p>
        <p>
          <span>订单编号:</span>{{tabledata.orderNo}}</p>
        <el-divider></el-divider>
        <p>

          <span>下单时间:</span>{{tabledata.orderTime}}</p>
        <el-divider></el-divider>
        <p>
          <span>手机号:</span>{{tabledata.phone}}</p>
        <el-divider></el-divider>
        <p>
          <span>收货人:</span>{{tabledata.consignee}}</p>
        <el-divider></el-divider>
        <p>
          <span>配送地址:</span>{{tabledata.deliverAddress}}</p>

      </div>
      <div class="right">
        <p>
          <span>下单时间:</span>{{tabledata.deliveryTime}}</p>
        <el-divider></el-divider>
        <span>送达时间:</span>{{tabledata.consignee}}
        <el-divider></el-divider>
        <p>
          <span>备注:</span>{{tabledata.remarks}}</p>
        <el-divider></el-divider>
        <p>

          <span>订单金额:</span>{{tabledata.orderAmount}}</p>
        <el-divider></el-divider>
        <p>

          <span>订单状态:</span>{{tabledata.orderState}}</p>
        <el-divider></el-divider>
      </div>

      <div id="footer">
        <el-button
          type="primary"
          size="medium"
          @click="confirm"
        >确定</el-button>
      </div>

    </div>
  </card>
</template>

<script>
import card from "@/components/Card/Card.vue";
import { getOrderDetail } from "@/api/order";
export default {
  components: { card },
  data() {
    return {
      tabledata: {
        id: 20,
        orderNo: "16012",
        orderTime: "2020-04-06T09:07:36.000Z",
        phone: "18181358998",
        consignee: "马飞飞",
        deliverAddress: "天府新谷",
        deliveryTime: "0000-00-00 00:00:00",
        remarks: "不要辣",
        orderAmount: 60,
        orderState: "已完成"
      }
    };
  },
  methods: {
    async getDetail() {
      let { data } = await getOrderDetail({
        id: this.$route.query.id
      });
      this.tabledata = data;
    },
    confirm(){
         this.$confirm("确认离开此页面吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }) // 用户点击确定
        .then(()=>{
         this.$router.push("/order/order-list")
        })
        // 用户点击取消
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  },
  mounted(){
    this.getDetail()
  }
};
</script>

<style lang="less" scoped>
.content {
  display: flex;
  flex-wrap: wrap;
  border: #dcdfe6 1px solid;
   span{
    margin-right: 30px;
  }
  .left {
    flex: 1;
  }
  .right {
    flex: 1;
  }
  p {
    padding: 0px;
  }
  #footer {
    width: 100%;
    text-align: center;
    padding: 20px;
  }
 
}
</style>