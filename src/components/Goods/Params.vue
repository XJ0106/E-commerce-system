<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意，只允许为第三级分类设置参数!"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>
      <!-- 商品选择分类区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类 :</span>
          <!-- 连级选择器 -->
          <el-cascader
            expandTrigger="hover"
            v-model="selectCatKeys"
            :options="cateList"
            :props="cateporps"
            @change="handeChange"
            clearable
          >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- 标签位置 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数展示 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            size="mini"
            type="primary"
            :disabled="isshow"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="myTabData" border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <!-- 循环生成tag标签 -->
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handelClose(i,scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- @keyup.enter.native="handleInput(scope.row)"  -->
                <!-- 鼠标或回车键触发提交事件，  @click="handleInput(scope.row)"把对应数据提交到方法里去 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTag"
                  size="small"
                  @keyup.enter.native="handleInput(scope.row)"
                  @blur="handleInput(scope.row)"
                ></el-input>
                <!-- 当没有点击按钮的时候，显示按钮，点击之后就编程input输入框 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column label="#" type="index"></el-table-column>
            <!-- 参数名称 -->
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="etidDialogForm(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removePara(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button size="mini" type="primary" @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="onlyTabData" border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handelClose(i,scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- @keyup.enter.native="handleInput(scope.row)"  -->
                <!-- 鼠标或回车键触发提交事件，  @click="handleInput(scope.row)"把对应数据提交到方法里去 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTag"
                  size="small"
                  @keyup.enter.native="handleInput(scope.row)"
                  @blur="handleInput(scope.row)"
                ></el-input>
                <!-- 当没有点击按钮的时候，显示按钮，点击之后就编程input输入框 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column label="#" type="index"></el-table-column>
            <!-- 参数名称 -->
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="etidDialogForm(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removePara(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加提示框 -->
      <el-dialog
        title="添加参数"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClose"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addDialog"
          label-width="100px"
        >
          <el-form-item label="参数名称" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUse">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改功能 -->
      <el-dialog
        title="修改参数"
        :visible.sync="etidDialogVisible"
        width="50%"
        @close="etidDialogClosed"
      >
        <!-- 添加分类表单 -->
        <el-form
          :model="etidForm"
          :rules="etidCateFormRules"
          ref="etidDialogRef"
          label-width="100px"
        >
          <el-input v-model="etidForm.attr_name"></el-input>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="etidDialogVisible = true">取 消</el-button>
          <el-button type="primary" @click="etidParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //修改校验规则
      etidCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      //保存修改数据
      etidForm: {
        attr_name: "",
      },
      //弹框显示
      etidDialogVisible: false,
      //保存添加的值
      addForm: {
        attr_name: "",
      },
      //校验规则
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
      },
      //弹框显示
      addDialogVisible: false,

      cateList: [],
      selectCatKeys: [],
      cateporps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //进入页面默认显示页面
      activeName: "many",
      //动态参数接收数据
      myTabData: [],
      //静态参数接收参数
      onlyTabData: [],
    };
  },
  created() {
    //调用方法
    this.getCatList();
  },
  computed: {
    //控制添加按钮的显示
    isshow() {
      //如果不是选择三级目录，那就禁用添加按钮
      return this.selectCatKeys.length !== 3;
    },

    //获取三级分类id
    cateId() {
      if (this.selectCatKeys.length == 3) {
        //如果有三级id那么总长度减一
        return this.selectCatKeys[this.selectCatKeys.length - 1];
      }
      //如果没有或者只有两级直接返回null
      return null;
    },
  },
  methods: {
    
    handelClose(i, row) {
      
      row.attr_vals.splice(i, 1);
      this.saveParmas(row);
    },
    showInput(row) {
      //当用户点击按钮时，调出输入框
      row.inputVisible = true;
      //当我们页面上的元素重新渲染之后，重新变回按钮
      this.$nextTick((_) => {
        //让文本框自动获取焦点，当失去焦点时，变回按钮
        //变回按钮focus()是否失去焦点
        this.$refs.saveTag.$refs.input.focus();
      });
    },
    handleInput(row) {
      //当用户按鼠标或回车键触发提交事件
      if (row.inputValue.trim().length == 0) {
        //点击后变成输入框
        (row.inputValue = ""),
          //触发事件后变回NewTge的按钮
          (row.inputVisible = false);
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveParmas(row);
    },
    //存储数据
    async saveParmas(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) return this.$message.error("添加失败");
      this.$message.success("添加成功");
    },

    //删除方法
    async removePara(attr_id) {
      this.$confirm("是否永久删除该用户", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        //删除样式
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.cateId}/attributes/${attr_id}`
          );
          if (res.meta.status !== 200) {
            return this.$message.error("删除用户失败");
          }
          this.$message({
            type: "success",
            message: "删除用户成功!",
          });
          this.handeChange();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //提交修改后的参数
    etidParams() {
      this.$refs.etidDialog.validate(async (valid) => {
        if (!valid) return;
        //如果有继续发起请求categories/:id/attributes/:attrId
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.etidForm.attr_id}`,
          {
            //获取输入框新输入的值，然后判断你是添加的是动态参数还是静态参数
            attr_name: this.etidForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200) return this.$message.error("修改失败");
        this.etidForm = res.data;

        this.etidDialogVisible = false;
        this.handeChange();
      });
    },
    //对话框结束后重置表达式
    etidDialogClosed() {
      this.$refs.etidDialogRef.resetFields();
    },
    //修改弹出框控制
    async etidDialogForm(attr_id) {
      console.log(attr_id);
      //发起请求获取要修改参数的值categories/${this.cateId}(分类的id),attributes/${attr_id}(数据的id)
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          //确定你选中的是动态数据的参数还是静态数据的id
          params: { attr_sel: this.activeName },
        }
      );
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("获取参数失败");
      this.$message.success("获取参数成功");
      this.etidForm = res.data;
      this.etidDialogVisible = true;
    },
    //添加参数
    addUse() {
      //当用户点击确定提交时校验表单
      this.$refs.addDialog.validate(async (valid) => {
        //如果什么都没有输入直接返回
        if (!valid) return;
        //校验通过，发起请求
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            //参数名称
            attr_name: this.addForm.attr_name,
            //判断添加的是动态参数还是静态参数
            attr_sel: this.activeName,
            attr_vals: "a,b,c",
          }
        );
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error("添加参数失败");
        this.$message.success("添加参数成功");
        //关闭弹框
        this.addDialogVisible = false;
        //重新加载数据
        this.handeChange();
      });
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },

    async handeChange() {
      //当用户选择连级菜单时获取参数
      console.log(this.selectCatKeys);
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      //获取所有数据标签的方法
      if(res.data){
        res.data.forEach((item) => {
        //判断数据是否有标签,如果有值展示数据，没有就不展示
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        //如果有值，需要添加bool值控制文本显示
        console.log(item.attr_vals);
        item.inputVisible = false;
        //添加一个input
        item.inputValue = " ";
      });
      }
     

      if (res.meta.status !== 200) {
        return this.$message.error("请选择商品分类");
        
      }
       
      //如果说拿到数据判断拿到是静态数据还是动态数据
      if (this.activeName == "many") {
        //如果activeName=my 那我们将数据添加到动态参数
        this.myTabData = res.data;
      } else if (this.activeName == "only") {
        //如果activeName=my 那我们将数据添加到静态参数
        this.onlyTabData = res.data;
      }
    },
    //当我们选择连级列表，调用handChange这个事件
    handleClick() {
      console.log(this.activeName);
      this.handeChange();
    },
    //获取连级数据
    async getCatList() {
      const { data: res } = await this.$http.get("categories");
      //判断是否拿到数据
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.$message.success("获取数据成功");
      this.cateList = res.data;
      console.log(this.cateList);
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
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 100px;
}
</style>