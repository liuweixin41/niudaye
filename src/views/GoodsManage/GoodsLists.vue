<template>
  <div class="goods-lists">

    <card>
      <span slot="title">商品列表</span>

      <div slot=content>
        <el-table
          :data="tableData"
          style="width:980px"
          max-height="450"
        >
        <!-- 可伸缩表格 -->
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form
                label-position="left"
                inline
                class="demo-table-expand"
              >
                <el-form-item label="商品名称">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="所属分类">
                  <span>{{ props.row.category}}</span>
                </el-form-item>
                <el-form-item label="商品价格">
                  <span>{{ props.row.price }}</span>
                </el-form-item>

                <el-form-item label="商品图片">
                  <span><img
                      :src="baseUrl+props.row.imgUrl"
                      alt=""
                      style="width:70px;height:70px"
                    ></span>
                </el-form-item>
                <el-form-item label="规格">
                  <span>{{ props.row.rating }}</span>
                </el-form-item>
                <el-form-item label="商品描述">
                  <span>{{ props.row.goodsDesc }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称"
            prop="name"
          >
          </el-table-column>
          <el-table-column
            label="所属分类"
            prop="category"
          >
          </el-table-column>
          <el-table-column
            label="商品价格"
            prop="price"
          >
          </el-table-column>
          <el-table-column
            label="商品图片"
          >
          <template slot-scope="scope">
            <img :src="baseUrl+scope.row.imgUrl" width="50" height="50" alt="">
          </template>
          </el-table-column>
          <el-table-column
            label="描述"
            prop="goodsDesc"
          >
          </el-table-column>
          <el-table-column label="操作">

            <template slot-scope="scope">

              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
              >删除</el-button>

            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <div class="block">
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

        <!-- 编辑的模态框 -->
        <el-dialog
          class="dialog"
          title="商品信息"
          :visible.sync="dialogVisible"
          width="400px"
          :before-close="CloseDialog"
        >

          <!-- 内容区域 -->
          <el-form
            :model="newForm"
            status-icon
            :rules="rules"
            ref="EditForm"
            label-width="80px"
            class="demo-EditForm"
          >
            <el-form-item
              label="商品名称"
              prop="name"
            >
              <el-input v-model.number="newForm.name"></el-input>
            </el-form-item>
            <!-- 编辑商品分类 -->
            <el-form-item
              label="商品分类"
              prop="category"
            >
              <el-select
                v-model="newForm.category"
                placeholder="请选择商品分类"
              >
                <el-option
                  label="食品"
                  value="食品"
                ></el-option>
                <el-option
                  label="日用"
                  value="日用"
                ></el-option>
                <el-option
                  label="饮品"
                  value="饮品"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 调整价格 -->
            <!-- 加减框框 -->
            <el-form-item label="价格">
              <el-input-number
                v-model="newForm.price"
                @change="handleChange"
                :min="1"
                :max="1000"
                label="描述文字"
              ></el-input-number>
            </el-form-item>

            <!-- 上传图片 -->
            <el-form-item label="商品图片">
              <el-upload
                action="http://localhost:5000/goods/goods_img_upload"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-success="uploadSuccess"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog>
                <img
                  width="100%"
                  alt=""
                >
              </el-dialog>
            </el-form-item>
            <el-form-item
              label="商品描述"
              prop="goodsdesc"
            >
              <el-input
                type="textarea"
                v-model="newForm.goodsDesc"
                style="width:100%;overflow:ellipsis"
              ></el-input>
            </el-form-item>
          </el-form>

          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="uploadEditGoods"
            >确 定</el-button>
          </span>
        </el-dialog>
      </div>

    </card>

  </div>
</template>

<script>
import card from "@/components/Card/Card.vue";
import { getGoodslist, editGoods, delGoods } from "@/api/goods";
import moment from "moment";
export default {
  components: { card },
  data() {
    return {
      newForm: {
        name: "",
        category: "",
        price: "",
        imgUrl: "",
        goodsDesc: "",
        id: ""
      },
      tableData: [{}],
      baseUrl: "http://127.0.0.1:5000/upload/imgs/goods_img/",
      imgUrl: "",
      currentPage: 1,
      //总条数
      total: 50,
      pageSize: 10,
      rules: {},
      dialogVisible: false
    };
  },

  methods: {
    async getGoodsData() {
      let { data, total } = await getGoodslist({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });

      if (!data.length && this.currentPage !== 1) {
        this.currentPage -= 1;
        this.getGoodsData(); // 调用自己
      }

      // 处理时间格式
      data.forEach(v => {
        v.ctime = moment(v.ctime).format("YYYY-MM-DD HH:mm:ss");
      });

      // 赋值渲染
      this.tableData = data;
      this.imgUrl=data.map((data)=>data.imgUrl);
      this.total = total;
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.dialogVisible = true;
      this.newForm = { ...row };
    },

    handleDelete(row) {
      console.log(row);
      this.$confirm("确认删除该商品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }) // 用户点击确定
        .then(async () => {
          let { code } = await delGoods({ id: row.id }); // 发送删除请求
          if (code === 0) {
            this.getGoodsData(); // 重新调用接口 获取数据 就是最新的数据
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

    handleSizeChange(val) {
      this.pageSize = val;
      this.getGoodsData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getGoodsData();
    },

    //模态框里的方法

    handleChange(value) {
      this.value = value;
    },
    CloseDialog(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadSuccess(res) {
      console.log(res);
      let { code, imgUrl, msg } = res;
      if (code == 0) {
        this.newForm.imgUrl = imgUrl;
        this.$message({
          type: "success",
          message: msg
        });
      }
    },
    async uploadEditGoods() {
      let { code } = await editGoods(this.newForm);
      if (code == 0) {
        this.getGoodsData();
        this.dialogVisible = false;
      } else {
        console.log("错误，不能提交");
        return false;
      }
    }
  },

  created() {
    this.getGoodsData();
  }
};
</script>

<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.dialog {
  .acc-input {
    margin-bottom: 15px;
    width: 350px;
  }
}
</style>