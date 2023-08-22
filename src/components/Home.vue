<template>
  <el-container class="home-container">
    <!-- 头部区域 -->

    <el-header>
      <div>
        <img src="../assets/icon.png" width="50px" alt="" />
        <span class="a">电商后台管理系统</span>
      </div>

      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!-- 页面主体区域 -->
    <el-container>
      <!-- 左边侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- :unique-opened="true"是否只打开一个子菜单 -->
        <el-menu
          :unique-opened="true"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 隐藏侧边菜单 -->
          <div class="toggle-button" @click="Collapse">|||</div>
          <!-- 循环menuList里面的数据 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"> </i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边内容区域 -->
      <el-main>
        <!-- 路由站位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  //存放数据
  data() {
    return {
      menuList: [],
      //定义图标库
      iconObj: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-lock_fill",
        145: "iconfont icon-danju",
      },
      //隐藏菜单还是显示菜单
      isCollapse: false,
      //二级菜单的信息
      activePath: '',
    };
  },
  //调用请求
  created() {
    //调用左侧菜单接口数据
    this.getMeunList();
    //在created将sessionStorage的数据赋值给activePath
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    //高亮效果的方法
    saveNavState(activePath) {
      //点击二级菜单保存二级菜单的信息
      window.sessionStorage.setItem('activePath', activePath);
      //把获取到的二级菜单信息保存到data里面去
      this.activePath = activePath;
    },
    //退出登录
    logout() {
      //删除coken
      window.sessionStorage.clear();
      //进行页面跳转
      this.$router.push("/login");
    },
    //请求左侧菜单数据
    async getMeunList() {
      //发起请求
      const { data: res } = await this.$http.get("menus");
      console.log(res);
      //需要判断是否拿到了菜单列表数据
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    //显示隐藏侧边菜单
    Collapse() {
      //修改是否隐藏菜单
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style scoped>
.toggle-button {
  color: #fff;
  text-align: center;
  font-size: 10px;
  padding: 5px 0px;
  background-color: #4a5064;
}
.el-menu {
  border: 0;
}
.home-container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
.el-header {
  background-color: #333744;
  padding-left: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-header img {
  margin-top: 6px;
  /* margin-left: 20px; */
}

.a {
  position: relative;
  left: 20px;
  top: -15px;
  color: #fff;
  font-family: "隶书";
  font-size: 25px;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #fff;
}
</style>