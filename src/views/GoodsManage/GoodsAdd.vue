<template>
  <div class="goods-add">
    <card>
      <span slot="title">商品添加</span>
      <div slot="content">

        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="商品名称">
            <el-input
              v-model="ruleForm.name"
              class="inputarea"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select
              v-model="ruleForm.category"
              placeholder="请选择商品分类"
            >
              <el-option
                v-for="item in categories"
                :key="item.cateName"
                :label="item.cateName"
                :value="item.cateName"
              ></el-option>
            </el-select>
          </el-form-item>

          <!-- 加减框框 -->
          <el-form-item label="价格">
            <el-input-number
              v-model="ruleForm.price"
              @change="handleChange"
              :min="1"
              :max="1000"
              label="描述文字"
            ></el-input-number>
          </el-form-item>
          <!-- 结束 -->

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
                v-if="ruleForm.imgUrl"
                :scr="ruleForm.imgUrl"
              >
            </el-dialog>
          </el-form-item>
          <el-form-item
            label="商品描述"
            prop="goodsdesc"
          >
            <el-input
              type="textarea"
              v-model="ruleForm.goodsDesc"
              style="width:400px"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
            >添加商品</el-button>

          </el-form-item>
        </el-form>
      </div>

    </card>
  </div>
</template>

<script>
import card from "@/components/Card/Card.vue";
import { addGoods, getCateList } from "@/api/goods";
export default {
  components: { card },
  data() {
    return {
      ruleForm: {
        name: "",
        category: "",
        price: "",
        imgUrl: "",
        goodsDesc: ""
      },
      categories: [],
      imgUrl: "",

      rules: {
        name: []
      }
    };
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let { code } = await addGoods(this.ruleForm);
          if (code === 0) {
            this.$router.push("/goods/goods-list");
          }
        } else {
          console.log("错误，不能提交");
          return false;
        }
      });
    },
    // 获取分类名称
    async getCateNames() {
      let { categories } = await getCateList();
      this.categories = categories;
    },
    handleChange(value) {
      this.value = value;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadSuccess(res) {
      console.log(res);
      let { code, imgUrl, msg } = res;
      if (code == 0) {
        this.ruleForm.imgUrl = imgUrl;
        this.$message({
          type: "success",
          message: msg
        });
      }
    }
  },

  created() {
    this.getCateNames(); // 调用获取分类名称的函数
  }
};
</script>

<style lang="less" scoped>
.inputarea {
  width: 40%;
}
</style>