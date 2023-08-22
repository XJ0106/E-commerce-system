<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <!-- 数据显示区域 -->
      <el-table :data="rightsList" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <!-- 使用插槽插入 -->
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.level == '0'"
              >一级权限</el-tag
            >
            <el-tag type="warning" v-if="scope.row.level == '1'"
              >二级权限</el-tag
            >
            <el-tag type="danger" v-if="scope.row.level == '2'"
              >三级权限</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //列表形式的权限
      rightsList: [],
    };
  },
  created() {
    //调用getRightsList方法
    this.getRightsList();
  },
  //发起请求
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get("Rights/list");
      //   console.log(res);
      if (res.meta.status !== 200) return this.$message.error("获取列表失败");
      this.$message.success("获取列表成功");
      this.rightsList = res.data;
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
</style>