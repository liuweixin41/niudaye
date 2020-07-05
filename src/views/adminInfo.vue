<template>
  <card>
    <div slot="content">
      <div
        slot="header"
        class="clearfix"
      >
        <span>管理员信息</span>
      </div>
      <el-divider></el-divider>
      <p>
        <span>管理员ID:</span>{{userinfo.id}}</p>
      <el-divider></el-divider>
      <p>

        <span>管理员账户:</span>{{userinfo.account}}</p>
      <el-divider></el-divider>
      <p>
        <span>用户组:</span>{{userinfo.userGroup}}</p>
      <el-divider></el-divider>
      <p>
        <span>创建时间:</span>{{userinfo.ctime |filterCtime}}</p>
      <el-divider></el-divider>
      <p>
        <span>管理员头像:</span>
        <el-upload
          class="avatar-uploader"
          action=" http://127.0.0.1:5000/users/avatar_upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="imgUrl"
            :src="baseImgUrl+imgUrl"
            class="avatar"
          >
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
          ></i>
        </el-upload>
      </p>
      <el-divider></el-divider>
      <!-- 修改头像 -->
      <el-button
        size="medium"
        @click="updateAvatar"
      >修改头像</el-button>

    </div>
  </card>
</template>

<script>
import card from "@/components/Card/Card.vue";
import { chageAvatar } from "@/api/admin";
import moment from "moment";
import local from "@/utils/storage";

export default {
  components: { card },
  data() {
    return {
      userinfo: {

      },
      imgUrl: "",
      baseImgUrl: "http://127.0.0.1:5000/upload/imgs/acc_img/"
    };
  },
  methods: {
    handleAvatarSuccess(res) {
      console.log(res);
      let { code, imgUrl, msg } = res;
      if (code == 0) {
        this.imgUrl = imgUrl;
        this.$message({
          type: "success",
          message: msg
        });
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //修改头像
   async updateAvatar() {
      console.log(this.imgUrl);
      let {code}=await chageAvatar({ imgUrl: this.imgUrl });
      if(code==0){
        this.$bus.$emit("updateSuccess")
      }
    }
  },
  async created() {
    // let { accountInfo } = await getAdminInfo();
    // console.log(accountInfo);
    this.userinfo = local.get("info");

  },
  filters: {
    filterCtime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
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