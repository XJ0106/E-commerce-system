<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 100%; height: 500px"></div>
    </el-card>
  </div>
</template>
  
  <script>
  import echarts from 'echarts'
export default {
  data() {
    return {
      //根据请求把折线图数据合并到option
      option :{
  title: {
    text: '用户来源'
  },
  //图表样式和请求
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  //控制图表的位置
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  //控制图表的X轴
  xAxis: [
    {
      boundaryGap: false,
    }
  ],
    //控制图表的Y轴
  yAxis: [
    {
      type: 'value'
    }
  ],
},
    }
  },
  created() {},
  //初始化表格
  async mounted() {
    var myChart = echarts.init(document.getElementById("main"));
    //准备数据和配置项
    const { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status !== 200) return this.$message.error("获取数据失败");
    this.$message.success("获取数据成功");
    const result=_.merge(res.data,this.option);
    myChart.setOption(result);
  },
  methods: {},
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