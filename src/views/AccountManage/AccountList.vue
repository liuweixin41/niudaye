<template>
  <div class="account-list">
    <!-- 卡片 -->
    <card class="box-card">
      <!-- 卡片标题 -->

      <span slot="title">用户列表</span>

      <div slot="content">
        <!-- 表格 -->

        <el-table
          :data="tableData"
          style="width:1000px"
          ref="multipleTable"
          @selection-change="Selection"
        >
          <!-- 选择 -->
          <el-table-column
            type="selection"
            width="55"
          >
          </el-table-column>
          <!-- 帐号 -->
          <el-table-column
            prop="account"
            label="用户名"
            width="180"
          >
          </el-table-column>
          <!-- 用户名 -->
          <el-table-column
            prop="userGroup"
            label="用户组"
            width="180"
          >
            <!-- 创建时间 -->
          </el-table-column>
          <el-table-column
            prop="ctime"
            label="创建时间"
          >
          </el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index,scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">

          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[1,5,10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>

        <div class="handle">
          <el-button
            type="danger"
            size="mini"
            @click=BatchDelete
          >批量删除</el-button>
          <el-button
            type="primary"
            size="mini"
            @click=toggleSelection()
          >取消选择</el-button>
        </div>

        <!-- 编辑的模态框 -->
        <el-dialog
          class="dialog"
          title="修改账号"
          :visible.sync="dialogVisible"
          width="400px"
          :before-close="CloseDialog"
        >

          <!-- 内容区域 -->
          <el-form
            :model="EditForm"
            status-icon
            :rules="rules"
            ref="EditForm"
            label-width="80px"
            class="demo-EditForm"
          >

            <el-form-item
              label="帐号"
              prop="account"
            >
              <el-input v-model.number="EditForm.account"></el-input>
            </el-form-item>

            <el-form-item
              label="用户组"
              prop="userGroup"
            >
              <el-select
                v-model="EditForm.userGroup"
                placeholder="请选择你的用户组"
              >
                <el-option
                  label="超级管理员"
                  value="超级管理员"
                ></el-option>
                <el-option
                  label="普通管理员"
                  value="普通管理员"
                ></el-option>
              </el-select>
            </el-form-item>

          </el-form>

          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="uploadEdit"
            >确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </card>
  </div>
</template>

<script>
import card from "@/components/Card/Card.vue";
import { editAcc, getAccList, batchDel, delAccList } from "@/api/acc";
import moment from "moment";

export default {
  components: { card },
  data() {
    return {
      tableData: [
        /*   { id: 0, ctime: "2020-05-17", account: "小貂禅", userGroup: "普通管理员" },
        { id: 1, ctime: "2020-05-17", account: "小貂禅", userGroup: "普通管理员" },
        { id: 2, ctime: "2020-05-17", account: "小貂禅", userGroup: "普通管理员" },
        { id: 3, ctime: "2020-05-17", account: "小貂禅", userGroup: "普通管理员" } */
      ],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      ids: [],
      dialogVisible: false,
      EditForm: {
        account: "",
        userGroup: "",
        id: ""
      },

      rules: {
        account: { required: true, message: "请输入账户名", trigger: "blur" },
        userGroup: { required: true, message: "请选择用户组", trigger: "blur" }
      }
    };
  },
  methods: {
    // 获取数据的函数
    async getAccData() {
      let { data, total } = await getAccList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });

      if (!data.length && this.currentPage !== 1) {
        this.currentPage -= 1;
        this.getAccData(); // 调用自己
      }

      // 处理时间格式
      data.forEach(v => {
        v.ctime = moment(v.ctime).format("YYYY-MM-DD HH:mm:ss");
      });

      // 赋值渲染
      this.tableData = data;
      this.total = total;
    },
    handleEdit(index,row) {
      console.log("要编辑的数据:", row);
      this.dialogVisible = true;
      this.EditForm = { ...row };
    },
    async uploadEdit() {
      this.dialogVisible = false;
      let { code } = await editAcc({
        id: this.EditForm.id,
        account: this.EditForm.account,
        userGroup: this.EditForm.userGroup
      });
      if (code === 0) {
        this.getAccData(); // 刷新
      }
    },

    handleDelete(row) {
      this.$confirm("确认删除该账号吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }) // 用户点击确定
        .then(async () => {
          let { code } = await delAccList({ id: row.id }); // 发送删除请求
          if (code === 0) {
            this.getAccData(); // 重新调用接口 获取数据 就是最新的数据
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

    //每页条数改变时触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAccData();
    },
    //当前页码改变时触发
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAccData();
    },
    Selection(rows) {
      this.ids = rows.map(row => row.id);

      console.log(this.ids);
    },

    async BatchDelete() {
      let ids = this.ids;
      let { code, msg } = await batchDel({
        ids: JSON.stringify(this.ids)
      });

      // 2. 接收数据,判断
      if (code === 0) {
        // 弹出成功提示
        this.$message({
          type: "success",
          message: msg
        });

        this.getAccData(); // 重新获取一次数据 刷新
      } else {
        this.$message.error(msg); // 弹出失败提示
      }
    },

    //前端交互之取消选择
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },

    //关闭模态
    CloseDialog(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  },
  //加减输入框的增减
  handleChange(value) {
    this.value = value;
  },

  created() {
    this.getAccData();
  }
};
</script>

<style lang="less" scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
  .content {
    font-size: 14px;
    margin-bottom: 18px;
    .handle {
      margin-top: 20px;
    }
    .dialog {
      .acc-input {
        margin-bottom: 15px;
        width: 350px;
      }
    }
  }
}
</style>