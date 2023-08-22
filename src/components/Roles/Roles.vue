<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >

                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="roleDesc"></el-table-column>
        <el-table-column label="路径" prop="roleName"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button
              @click="remove(scope.row.id)"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 权限提示框 -->
      <el-dialog title="提示" :visible.sync="setDialogVisible" width="50%">
        <!-- 树形控件 -->
        <el-tree
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          :default-checkbox-keys="defkes"
          ref="treeRef"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allRights">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加提示框 -->
      <el-dialog
        title="提示"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClose"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="80px"
        >
          <el-form-item label="权限名称" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
          <el-form-item label="路径" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUse">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //列表形式的权限
      rolesList: [],
      toleId: "",
      setDialogVisible: false,
      rightsList: [],
      treeProps: {
        label: "authName",
        children: "children",
      },
      defkes: [],
      addForm: {
        roleDesc: "",
        roleName: "",
      },
      addFormRules: {
        roleDesc: [
          {
            required: true,
            message: "请输入权限名称",
            trigger: "blur",
          },
          {
            min: 3,
            max: 15,
            message: "长度在3-15个字符",
            trigger: "blur",
          },
        ],
        roleName: [
          {
            required: true,
            message: "请输入路径",
            trigger: "blur",
          },
          {
            min: 3,
            max: 15,
            message: "长度在3-15个字符",
            trigger: "blur",
          },
        ],
      },
      addDialogVisible: false,
    };
  },
  created() {
    //调用getRightsList方法
    this.getRolessList();
  },
  //发起请求
  methods: {
    async allRights(){
      //...拓展运算符，作用是：将数组变成一个参数列表
      const keys=[
      this.$refs.treeRef.getCheckedKeys(),
      this.$refs.treeRef.getHalfCheckedKeys(),
    ];
    //查询出来的结果用逗号分开
    const idStr =keys.join(",");
    const {data:res} =await this.$http.post(`roles/${this.roleId}/rights`,{
      rids:idStr
        })
        if(res.meta.status !== 200){
            return this.$message.error('分配权限失败')
        }
        //关闭弹窗
        this.setDialogVisible = false;
        //刷新数据
        this.getRolessList()
        this.$message.success('分配权限成功!')
    },
    //分配权限
    async showSetRightDialog(role) {
      this.roleId = role.id;
      //发起请求数据
      const { data: res } = await this.$http.get("rights/tree");
      //判断是否获取到权限
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限失败");
      }
      this.$message.success("获取权限成功");
      //获取数据成功，把结果存到data里
      this.rightsList = res.data;
      //获取三级节点id
      this.getLeafkeys(role, this.defkes);
      console.log( this.getLeafkeys(role, this.defkes));
      //显示弹框
      this.setDialogVisible = true;
    },
    //通过循环的方式，获取当前角色所有三级权限的id
    getLeafkeys(node, arr) {
      //如果当前子节点没有子节点了，那就说明是最后一程了
      if (!node.children) {
        //我们直接把id提交
        return arr.push(node.id);
      }
      //一层一层逐层循环
      node.children.forEach((item) => this.getLeafkeys(item, arr));
    },

    //删除数据方法
    remove(id) {
      this.$confirm("是否永久删除该用户", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        //删除样式
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("roles/" + id);
          if (res.meta.status !== 200) {
            return this.$message.error("删除用户失败");
          }
          this.$message({
            type: "success",
            message: "删除用户成功!",
          });
          this.getRolessList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async getRolessList() {
      const { data: res } = await this.$http.get("roles");
      //console.log(res);
      //判断是否获取到列表
      if (res.meta.status !== 200) return this.$message.error("获取列表失败");
      this.$message.success("获取列表成功");
      //把数据存到data里面去
      this.rolesList = res.data;
    },

    //删除数据方法
    async removeRightById(role, rightId) {
      this.$confirm("确定要删除该角色吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        //删除样式
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          );
          if (res.meta.status !== 200) {
            return this.$message.error("删除权限失败");
          }
          role.children = res.data;
          this.$message.success("删除权限成功!");
        })
        .catch(() => {
          this.$message.info("已取消删除!");
        });
    },
    addUse() {
      //点击确定按钮提交数据
      this.$refs.addFormRef.validate(async (valid) => {
        //进行判断
        if (!valid) return this.$message.error("请填写完整的用户信息!");
        //如果输入完成，提交form表单
        const { data: res } = await this.$http.post("roles", this.addForm);
        //如果添加失败，给出提示
        if (res.meta.status !== 201) return this.$message.error("添加用户失败");
        //成功了提示添加成功
        this.$message.success("添加用户成功");
        //关闭对话框
        this.addDialogVisible = false;
        //重新请求最新的数据
        this.getRolessList();
      });
    },
    //对话框结束后重置表达式
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
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
  margin: 7px;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdtop {
  border-bottom: 1px solid #eee;
}
</style>