<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <!-- v-model双向绑定 在clear事件当中直接发起请求，获取最新数据-->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage"
            >添加按钮</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="90px"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="70px"
        ></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <!-- 引入插槽 -->
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="update(scope.row.id)"
            >
            </el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="remove(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        //字符串
        query: "",
        //当前页面值
        pagenum: 1,
        //每页显示的条数
        pagesize: 5,
      },
      //记录分页
      total: 0,
      //商品列表
      goodsList: [],
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    //点击跳转到Add页面
    goAddpage() {
      this.$router.push("Add");
    },
    //查询商品信息
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) return this.$message.error("数据获取失败");
      // this.$message.success("数据获取成功");
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      console.log(this.goodsList);
    },
    //分页功能
    handleSizeChange(newsize) {
      // console.log(newsize);
      //当pagesize发生改变时候我们应该以下一页的数据作为展示数据
      this.queryInfo.pagesize = newsize;
      //重新按照pagesize发送请求，获取最新的数据
      this.getGoodsList();
    },
    handleCurrentChange(current) {
      // console.log(current);
      this.queryInfo.pagenum = current;
      this.getGoodsList();
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
          const { data: res } = await this.$http.delete(`goods/${id}`);
          if (res.meta.status !== 200) {
            return this.$message.error("删除用户失败");
          }
          this.$message({
            type: "success",
            message: "删除用户成功!",
          });
          this.getGoodsList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
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