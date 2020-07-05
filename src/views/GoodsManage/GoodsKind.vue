<template>
  <div class="goods-kind">
    <card>
      <span slot="title">商品分类 <el-button
          type="primary"
          style="float:right"
          @click="dialogVisible = true;"
        >添加分类</el-button></span>
      <!-- 表格 -->
      <div slot="content">
        <template>
          <el-table
            :data="tableData"
            style="width:750px"
          >
            <!-- 序号 -->
            <el-table-column
              label="序号"
              width="100"
            >
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>

            <!-- 分类名称 -->
            <el-table-column
              label="分类名称"
              width="180"
            >
              <template slot-scope="scope">
                <span v-if="!scope.row.isEdit">{{scope.row.cateName}}</span>
                <input
                  v-else-if="scope.row.isEdit"
                  size="mini"
                  v-model="scope.row.cateName"
                >
              </template>
            </el-table-column>

            <!-- 是否启用 -->
            <el-table-column
              prop="state"
              label="是否启用"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.state"
                  :disabled="!scope.row.isEdit"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </template>
            </el-table-column>

            <!-- 操作按钮 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                  v-if="!scope.row.isEdit"
                >编辑</el-button>
                <el-button
                  @click="saveEditnow"
                  v-else
                  size="mini"
                  type="success"
                >完成</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="[5,10,15,20]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
        <!-- dialog -->
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose"
        >
          <el-form :data="tableData">
            <el-form-item label="分类名称">
              <el-input
                v-model="newkind"
                placeholder="分类名称"
                style="width:50%"
              ></el-input>
            </el-form-item>
            <!-- 是否启用 -->
            <el-form-item label="是否启用">
              <template slot-scope="scope">
                <el-switch
               
                  v-model="scope.row.state"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </template>

            </el-form-item>
          </el-form>
          <span
            slot="footer"
            class="dialog-footer"
          >

            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="addCate"
            >确 定</el-button>
          </span>
        </el-dialog>
      </div>

    </card>

  </div>
</template>

<script>
import card from "@/components/Card/Card.vue";
import { getCateList, addCateList, delCate,editCate } from "@/api/goods";
import moment from "moment";
export default {
  components: {
    card
  },
  data() {
    return {
      total: 10,
      pageSize:5,
      currentPage: 1,
      tableData: [
        {
          id: 1,
          itemkind: "热销榜",
          state: 1
        },
        {
          id: 2,
          itemkind: "热销榜",
          state: 1
        },
        {
          id: 3,
          itemkind: "热销榜",
          state: 1
        },
        {
          id: 4,
          itemkind: "热销榜",
          state: 1
        }
      ],
      stateFlag: true,
      dialogVisible: false,
      newkind: ""
    };
  },
  methods: {
    async getCateData() {
      let { total, data } = await getCateList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });

      if (!data.length && this.currentPage !== 1) {
        this.currentPage -= 1;
        this.getGoodsData(); // 调用自己
      }

      //state转换为boolean
      data.forEach(v => {
        v.state = v.state === 1 ? true : false;
        v.isEdit = false;
      });
      // 赋值渲染
      this.tableData = data;
      this.total = total;
    },
    handleEdit(index, row) {
      console.log(row)
     row.isEdit=!row.isEdit;
     this.row=row;
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    // 模态框关闭
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getCateData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCateData();
    },

    // 添加分类
    async addCate() {
      let { code } = await addCateList({
        cateName: this.newkind,
        state: this.stateFlag
      });
      if (code == 0) {
        this.dialogVisible = false;
        this.getCateData();
      } else {
        console.log("没发出去");
      }
    },

    //删除分类
    handleDelete(row) {
      console.log(row);
      this.$confirm("确认删除该分类吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }) // 用户点击确定

        .then(async () => {
          let { code, msg } = await delCate({ id: row.id }); // 发送删除请求
          if (code == 0) {
            this.getCateData(); // 重新调用接口 获取数据 就是最新的数据
          }
        })
        // 用户点击取消
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async saveEditnow(){
     let { code } = await editCate({
        id: this.row.id,
        cateName: this.row.cateName,
        state: this.row.state,
      });

      if (code === 0) this.getCateData(); // 刷新
    },
    
  },
  created() {
    this.getCateData();
  }
};
</script>

<style lang="less" scoped>
</style>