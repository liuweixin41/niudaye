<template>
  <div class="order-list">
    <card>
      <div slot="content">
        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
          style="height:100%"
          ref="searchForm"
        >
          <el-form-item label="订单号">
            <el-input
              v-model="formInline.orderNo"
              placeholder="订单号"
            ></el-input>
          </el-form-item>
          <el-form-item label="收货人">
            <el-input
              v-model="formInline.consignee"
              placeholder="收货人"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input
              v-model="formInline.phone"
              placeholder="手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select
              v-model="formInline.orderState"
              placeholder="订单状态"
            >
              <el-option
                v-for="item in tableData"
                :key="item.id"
                :label="item.orderState"
                :value="item.orderState"
              ></el-option>

            </el-select>
          </el-form-item>
        </el-form>

        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
        >
          <el-form-item label="选择时间">
            <el-date-picker
              type="daterange"
              value-format="timestamp"
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
          <el-button
            type="primary"
            @click="reset"
          >重置</el-button>
        </el-form>

        <!-- 订单表 -->
        <el-table
          :data="tableData"
          border
          style="width:100%"
          max-height="280"
        >
          <el-table-column
            fixed
            label="订单号"
            width="100"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{scope.row.orderNo}}</span>
              <input
                v-else-if="scope.row.isEdit"
                size="mini"
                v-model="scope.row.orderNo"
              >
            </template>
          </el-table-column>
          <el-table-column
            label="下单时间"
            width="120"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{scope.row.orderTime}}</span>
              <input
                v-else-if="scope.row.isEdit"
                size="mini"
                v-model="scope.row.orderTime"
              >
            </template>
          </el-table-column>
          <el-table-column
            label="手机号"
            width="120"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{scope.row.phone}}</span>
              <input
                v-else-if="scope.row.isEdit"
                size="mini"
                v-model="scope.row.phone"
              >
            </template>
          </el-table-column>
          <el-table-column
            label="收货人"
            width="120"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{scope.row.consignee}}</span>
              <input
                v-else-if="scope.row.isEdit"
                size="mini"
                v-model="scope.row.consignee"
              >
            </template>
          </el-table-column>
          <el-table-column
            label="配送地址"
            width="300"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{scope.row.deliverAddress}}</span>
              <input
                v-else-if="scope.row.isEdit"
                size="mini"
                v-model="scope.row.deliverAddress"
              >
            </template>
          </el-table-column>
          <el-table-column
            label="送认时间"
            width="120"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{scope.row.deliveryTime}}</span>
              <input
                v-else-if="scope.row.isEdit"
                size="mini"
                v-model="scope.row.deliveryTime"
              >
            </template>
          </el-table-column>
          <el-table-column
            label="用户备注"
            width="120"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{scope.row.remarks}}</span>
              <input
                v-else-if="scope.row.isEdit"
                size="mini"
                v-model="scope.row.remarks"
              >
            </template>
          </el-table-column>
          <el-table-column
            label="订单金额"
            width="120"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{scope.row.orderAmount}}</span>
              <input
                v-else-if="scope.row.isEdit"
                size="mini"
                v-model="scope.row.orderAmount"
              >
            </template>
          </el-table-column>
          <el-table-column
            label="订单状态"
            width="120"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{scope.row.orderState}}</span>
              <input
                v-else-if="scope.row.isEdit"
                size="mini"
                v-model="scope.row.orderState"
              >
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                @click="handleClick(scope.row)"
                type="text"
                size="small"
              >查看</el-button>
              <el-button
                type="text"
                size="small"
                @click="handleEdit(scope.$index, scope.row)"
                v-if="!scope.row.isEdit"
              >编辑</el-button>
              <el-button
                @click="saveEditnow"
                v-else
                size="mini"
                type="text"
              >完成</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->

        <div class="block paging">

          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </card>
  </div>
</template>

<script>
import card from "@/components/Card/Card.vue";
import { getOrderlist, searchOrderDetail, editOrder } from "@/api/order";
import moment from "moment";

export default {
  components: { card },

  data() {
    return {
      formInline: {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: "",
        date: ""
      },
      currentPage: 1,
      total: 0,
      pageSize: 5,

      tableData: [
        {
          id: "14214356",
          orderTime: "19:00:00",
          phone: "1811235236",
          consignee: "小貂禅",
          deliverAddress: "上海市普陀区金沙江路 1518 弄",
          deliveryTime: "0:00:00",
          remarks: "中辣",
          orderAmount: "180",
          orderState: "已受理"
        }
      ]
    };
  },

  methods: {
    async getOrderData() {
      let { total, data } = await getOrderlist({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });

      if (!data.length && this.currentPage !== 1) {
        this.currentPage -= 1;
        this.getOrderlist(); // 调用自己
      }

      // 处理时间格式
      data.forEach(v => {
        v.orderTime = moment(v.orderTime).format("YYYY-MM-DD HH:mm:ss");
        v.isEdit = false;
      });

      // 赋值渲染
      this.tableData = data;
      this.total = total;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getOrderData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrderData();
    },
    //跳转到详情页
    handleClick(row) {
      console.log(row.id);
      this.$router.push({
        name: "orderDetail",
        query: {
          id: row.id
        }
      });
    },
    handleEdit(index, row) {
      console.log(row);
      row.isEdit = !row.isEdit;
      this.row = row;
    },
    async saveEditnow() {
      let { code } = await editOrder({
        id: this.row.id,
        orderNo: this.row.orderNo,
        orderTime: this.row.orderTime,
        phone: this.row.phone,
        consignee: this.row.consignee,
        deliverAddress: this.row.deliverAddress,
        deliveryTime: this.row.deliveryTime,
        orderAmount: this.row.deliveryTime,
        orderState: this.row.orderState,
        remarks: this.row.remarks
      });
      if (code == 0) this.getOrderData();
    },
    async search() {
      //想从第一页开始看，重置页码
      //查询就是把条件发给后端，从数据库筛选符合条件的数据。并返回
      this.currentPage = 1;
      let { total, data } = await searchOrderDetail({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        orderN: this.formInline.orderN,
        consignee: this.formInline.consignee,
        phone: this.formInline.phone,
        orderState: this.formInline.orderState,
        date: JSON.stringify(this.formInline.date)
      });
      if (total !== 0 && data.length !== 0) {
        this.total = total;
        this.tableData = data;
        data.forEach(v => {
          v.orderTime = moment(v.orderTime).format("YYYY-MM-DD HH:mm:ss");
        });
      } else {
        this.$message.error("未查询到符合的结果");
      }
    },
    reset() {
      this.$refs.searchForm.resetFields;
      this.getOrderData();
    }
  },
  created() {
    this.getOrderData();
  }
};
</script>

<style lang="less" scoped>
.paging {
  margin-top: 20px;
}
/deep/.box-card {
  width: 90%;
}
</style>