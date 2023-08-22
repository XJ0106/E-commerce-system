<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addouy">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类表格  -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 定义第二列 -->
        <template slot="isok" slot-scope="scope">
          <i
            :class="
              scope.row.cat_deleted === false
                ? 'el-icon-success'
                : 'el-icon-error'
            "
            :style="{
              color: scope.row.cat_deleted === false ? 'lightgreen' : 'red',
            }"
          ></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit"
          @click="showEditDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="cateDelete(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加弹框 -->
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addShow"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRuleForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_pid">
          <el-cascader
            v-model="selectKeys"
            :options="cateData"
            @change="changeCateFn"
            :props="CateProps"
            change-on-select
            clearable
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addShow = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类的对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="活动名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      // 控制编辑对话框
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      columns: [
        { label: "分类名称", prop: "cat_name" },
        //type:'template'(将该列设置为模板列)，template:'isok'(设置该列模板的名称为isok)
        { label: "是否有效", prop: "", type: "template", template: "isok" },
        { label: "排序", prop: "", type: "template", template: "order" },
        { label: "操作", prop: "", type: "template", template: "opt" },
      ],

      cateList: [],
      parentCateList: [],
      cateData: [],
      CateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },

      //查询分类数据的条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10,
      },
      //添加分类的表单数据对象
      // 商品分类数据列表
      addCateForm: {
        //分类名称
        cat_name: "",
        //添加分类的父级id，0则表示父级为0.添加一级分类
        cat_pid: 0,
        //添加分类的等级，0则表示添加一级分类
        cat_level: 0,
      },
      //添加分类校验规则
      addCateFormRules: {
        //验证规则
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      selectKeys: [],
      //保存1,2级父级分类的列表

      //保存总数据条数
      total: 0,
      addShow: false,
    };
  },

  components: {},
  computed: {},
  created() {
    this.getCateList();
  },
  methods: {
    // 关闭弹框清空数据
    addCateDialogClosed() {
      this.$refs.addCateFormRuleForm.resetFields();
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
      this.selectKeys = [];
    },
    // 删除函数
    async cateDelete(cateId) {
      this.$confirm("确定要删除该分类吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${cateId}`);
          if (res.meta.status !== 200) {
            return this.$message.error("删除分类失败");
          }
          this.getCateList();
          this.$message.success("删除分类成功!");
        })
        .catch(() => {
          this.$message.info("已取消删除!");
        });
    },

    // 确认添加数据
    addCate() {
      //点击确定，完成添加分类
      console.log(this.addCateForm);
      this.$refs.addCateFormRuleForm.validate(async (valid) => {
        if (!valid) return;
        //发送请求完成添加分类
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );

        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败");
        }

        this.$message.success("添加分类成功");
        this.getCateList();
        this.addShow = false;
      });
    },
    // 分页
    handleSizeChange(newSize) {
      //当pagesize发生改变时触发
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      //当pagenum发生改变时触发
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },

    // 获取分类数据
    async getCateList() {
      let { data: res } = await this.$http.get(`categories`, {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.$message.success("获取成功");
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    // 添加分类
    addouy() {
      // 展示前两级的数据
      this.getData();

      this.addShow = true;
    },
    // 当下拉选项发生改变时触发
    changeCateFn() {
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
        this.addCateForm.cat_level = this.selectKeys.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    // 获取的前两层的数据
    async getData() {
      let { data: res } = await this.$http.get(`categories`, {
        params: {
          type: 2,
        },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.$message.success("获取成功");
      //    存储的是前两项的数据
      this.cateData = res.data;
    },
    // 编辑对话框
    editDialogClosed() {
      this.$refs.editFormRef.resetFields(); // 仅是输入框的重置
    },
    //根据id查询当前分类名称
    async showEditDialog(cateId) {
      const { data: res } = await this.$http.get(`categories/${cateId}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取查询分类失败");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editCate() {
      // 对表单进行校验
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.put(
          `categories/${this.editForm.cat_id}`,
          {
            cat_name: this.editForm.cat_name,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改分类失败");
        }
        this.editDialogVisible = false;
        this.getCateList();
        this.$message.success("修改分类成功!");
      });
    },
  },
};
</script>
  
  <style scoped>
.el-card {
  margin-top: 10px;
}
.el-cascader {
  width: 100%;
}
</style>
  