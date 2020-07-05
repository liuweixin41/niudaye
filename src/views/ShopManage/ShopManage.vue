<template>

  <card>
    <div slot="title">
      <span>店铺管理</span>

    </div>

    <div slot="content">
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        size="small"
        :disabled="disabled"
      >
        <el-form-item label="店铺名称">
          <el-input
            v-model="form.name"
            class="form-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="店铺公告">
          <el-input
            type="textarea"
            maxlength="200"
            v-model="form.bulletin"
            class="form-input"
          ></el-input>
        </el-form-item>
        <!-- 店铺头像 -->
        <el-form-item label="店铺头像">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:5000/shop/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="imgUrl"
              :src="baseUrl + imgUrl"
              alt="店铺头像"
              class="avatar"
            />
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            ></i>
          </el-upload>
        </el-form-item>
        <!-- 店铺图片墙 -->
        <el-form-item label="店铺图片">
          <el-upload
            action="http://127.0.0.1:5000/shop/upload"
            list-type="picture-card"
            :on-success="handleImgSuccess"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>

          <!-- 预览的模态框 -->
          <el-dialog :visible.sync="dialogVisible">
            <!-- 预览的图片 -->
            <img
              width="100%"
              :src="dialogImageUrl"
              alt
            />
          </el-dialog>
        </el-form-item>

        <el-form-item label="配送费">
          <el-input
            v-model="form.deliveryPrice"
            class="form-input"
          ></el-input>
        </el-form-item>

        <el-form-item label="配送时间">
          <el-input
            v-model="form.deliveryTime"
            class="form-input"
          ></el-input>
        </el-form-item>

        <el-form-item label="配送描述">
          <el-input
            v-model="form.description"
            class="form-input"
          ></el-input>
        </el-form-item>

        <el-form-item label="店铺评分">
          <el-input
            v-model="form.score"
            class="form-input"
          ></el-input>
        </el-form-item>

        <el-form-item label="销量">
          <el-input
            v-model="form.sellCount"
            class="form-input"
          ></el-input>
        </el-form-item>

        <el-form-item label="活动">
          <el-checkbox-group v-model="form.supports">
            <el-checkbox
              label="在线支付满28减5"
              name="type"
            ></el-checkbox>
            <el-checkbox
              label="VC无限橙果汁全场8折"
              name="type"
            ></el-checkbox>
            <el-checkbox
              label="单人精彩套餐"
              name="type"
            ></el-checkbox>
            <el-checkbox
              label="特价饮品8折抢购"
              name="type"
            ></el-checkbox>
            <el-checkbox
              label="单人特色套餐"
              name="type"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      
          <!-- 营业时间 -->
          <el-form-item label="营业时间">
            <el-time-picker
              is-range
              v-model="form.date"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            ></el-time-picker>
          </el-form-item>
        </el-form>
      
      <el-button
        @click="edit"
        size="small"
        type="primary"
      >{{
          disabled ? "编辑" : "保存"
        }}</el-button>
    </div>
  </card>

</template>

<script>
import card from "@/components/Card/Card.vue";
import { getShopInfo, editShopInfo } from "@/api/shop";

export default {
  components: { card },
  data() {
    return {
      form: {
        id: "",
        name: "",
        bulletin: "",
        avatar: "",
        deliveryPrice: "",
        deliveryTime: "",
        description: "",
        score: "",
        sellCount: "",
        supports: [],
        date: []
      },
      imgUrl: "",
      baseUrl: "http://127.0.0.1:5000/upload/shop/",
      pics: [], //图片名字的列表
      dialogVisible: false,
      dialogImageUrl: "",
      fileList: [], // 图片列表
      disabled: true, // 是否禁用 默认是禁用的
     
    };
  },
  methods: {
    async edit() {
      this.disabled = !this.disabled; // 启用
      if (this.disabled) {
        let { code } = await editShopInfo(this.form);
      }
    },
    //上传店铺图片成功
    handleImgSuccess(res) {
      console.log("res:", res);
      this.pics.push(res.imgUrl); // 添加
    },
    // 上传头像成功的回调
    handleAvatarSuccess(res, file) {
      let { code, msg, imgUrl } = res;
      if (code === 0) {
        this.imgUrl = imgUrl; // 回填图片
        this.$message({
          type: "success",
          message: msg
        });
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    handleRemove(file, fileList) {
      this.pics.splice(this.pics.indexOf(file.name), 1);
    },

    //预览
    handlePictureCardPreview(file) {
      console.log("预览:", file);
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    },

    //获取店铺信息
    async getShopInfonow() {
      let { data } = await getShopInfo();
      this.form = data;
      this.imgUrl = data.avatar;
      // 保存图片名字
      this.pics = data.pics;
      //回填图片
      let arr = [];
      data.pics.forEach(v => {
        arr.push({
          name: v,
          url: this.baseUrl + v
        });
      });
      this.fileList = arr;
    }
  },
  created() {
    this.getShopInfonow();
  }
};
</script>

<style lang="less" scoped>
//上传头像的样式
.form-input {
  width: 250px;
}
.avatar-uploader {
  /deep/.el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>