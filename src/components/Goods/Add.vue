<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab表单区域 el-tab必须是tabs的子节点 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- 添加切换前事件 -->
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTab"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                :options="cateList"
                :props="catePropos"
                v-model="addForm.goods_cat"
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="val"
                  border
                  v-for="(val, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 通过循环生成静态属性 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传模块 action表示上传的API地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button class="btnAdd" type="primary" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
          <el-tab-pane label="完成" name="5"></el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="priviewImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      previewPath: "",

      previewVisible: false,

      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      // 处理图片预览效果
      // 图片上传组件的header请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      //动态参数的数据
      manyTableData: [],
      //静态参数的数据
      onlyTableData: [],
      //连级菜单的list
      cateList: [],
      //连级菜单的字段
      catePropos: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      activeIndex: 0,
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        //存放数组
        pisc: [],
        // 商品的详情描述
        goods_introduce: "",
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    //获取三级分类id
    cateId() {
      if (this.addForm.goods_cat.length == 3) {
        //如果有三级id那么总长度减一
        return this.addForm.goods_cat[2];
      }
      //如果没有或者只有两级直接返回null
      return null;
    },
  },
  created() {
    //调用方法
    this.getCatList();
  },
  methods: {
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("填写必要的表单项！");
        }
        // 表单完整处理数据，把form表单进行深度拷贝
        const form = _.cloneDeep(this.addForm);
        //处理good_cat 从数组转换成字符串
        form.goods_cat = form.goods_cat.join(",");
        //处理attr数组,将manyTableData值添加到attrs里面去
        this.manyTableData.forEach((item) => {
          form.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          });
        });
        this.onlyTableData.forEach((item) => {
          form.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          });
        });
        const { data: res } = await this.$http.post("goods", form);
        if (res.meta.status !== 201){
           return this.$message.error("添加商品失败");
          
        } 
        console.log(res);
        console.log(res.meta.status);
         this.$message.success("添加商品成功");
         
      });
    },
    handleSuccess(response) {
      //上传完成后触发response上传成功后返回结果
      this.addForm.pisc.push({ pic: response.data.temp_path });
      console.log(this.addForm.pisc);
    },

    // 处理移除图片的操作
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      // 2. 从pics数组中，找到这个图片对应的索引值
      const index = this.addForm.pisc.findIndex(
        (item) => item.pic === filePath
      );
      // 3. 调用数组的splice方法，把图片信息对象，从pics数组中移除
      this.addForm.pisc.splice(index, 1);
    },
    // 处理图片预览效果
    handlePreview(file) {
      console.log(file);
      //用户点击时触发预览
      this.previewPath = file.response.data.url;
      console.log(this.previewPath);
      //打开弹框
      this.previewVisible = true;
    },

    //当用户点击切换触发
    async tabClick() {
      //当索引发生变化时获取参数
      if (this.activeIndex == "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取动态参数失败");
        this.$message.success("获取动态参数成功");
        //将tag标签的字符串转换成数组
        res.data.forEach((item) => {
          //若有值就进切割,没有就展示空的
          item.attr_vals =
            item.attr_vals.length == 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex == "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取静态参数失败");
        this.$message.success("获取静态参数成功");
        //将tag标签的字符串转换成数组
        res.data.forEach((item) => {
          //若有值就进切割,没有就展示空的
          item.attr_vals =
            item.attr_vals.length == 0 ? [] : item.attr_vals.split(" ");
        });
        this.onlyTableData = res.data;
      }
    },
    //检验前判定
    beforeTab(activeName, oldActiveName) {
      //在tab切换之前触发
      if (oldActiveName == "0") {
        //在第一个标签页的时候
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.error("请选择商品分类");
          return false;
        } else if (this.addForm.goods_name.trim() == "") {
          this.$message.error("请输入商品名称");
          return false;
        }
      }
    },
    //获取练级菜单的数据
    async getCatList() {
      const { data: res } = await this.$http.get("categories");
      //判断是否拿到数据
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.$message.success("获取数据成功");
      this.cateList = res.data;
    },
    //如果用户选择的二级或一级分类就判断选择无效
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        return;
      }
    },
  },
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-table {
  margin-top: 15px;
  font-size: 15px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.priviewImg {
  width: 100%;
  height: 100%;
}

.btnAdd {
  margin-top: 15px;
}
</style>