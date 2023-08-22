<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 栅格布局 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <!-- v-model双向绑定 在clear事件当中直接发起请求，获取最新数据-->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"  @click="addDialogVisible = true">添加用户</el-button></el-col
        >
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
          <el-switch
  v-model="scope.row.mg_state"
  active-color="#13ce66"
  inactive-color="#ff4949"
 @change="userStateChage(scope.row)">
</el-switch>
</template>
        </el-table-column>
        <!-- 引入插槽 -->

        <el-table-column label="操作">
          
          <template slot-scope="scope">
          <el-button  type="primary" icon="el-icon-edit" size="mini" @click="update(scope.row.id)">
   
          </el-button>
          <el-button  icon="el-icon-delete" type="danger" size="mini" @click="remove(scope.row.id)"></el-button>
          <el-tooltip effect="dark" content="分配角色" palcement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-star-off" size="mini" @click="setRole(scope.row)"></el-button>
          </el-tooltip>
         
        </template>
          
          </el-table-column>
       
      </el-table>
      <!-- 添加提示框 -->
      <el-dialog
  title="提示"
  :visible.sync="addDialogVisible"
  width="50%" @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
      <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
      </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUse">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改提示框 -->
<el-dialog
  title="提示"
  :visible.sync="updateDialog"
  width="50%">
  <el-form :model="updateForm" :rules="addFormRules" ref="upFormRef" label-width="70px">
      <el-form-item label="用户名">
          <el-input v-model="updateForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email" >
          <el-input v-model="updateForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
          <el-input v-model="updateForm.mobile"></el-input>
      </el-form-item>
      </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="updateDialog = false">取 消</el-button>
    <el-button type="primary" @click="updateUse()">确 定</el-button>
  </span>
</el-dialog>
<!-- 分配角色权限提示框 -->
<el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%">
  <div>
    <p>当前的用户：{{userInfo.username}}</p>
    <p>当前的角色：{{userInfo.role_name}}</p>
    <p>
      分配新角色：
      <el-select v-model="selectRoleId" placeholder="请选择">
          <el-option v-for="item in roleList" :key="item.id" 
              :label="item.roleName" :value="item.id"> 
          </el-option>
      </el-select>
    </p>
  </div>
  <span slot="footer" class="dialog-footer">
      <el-button @click="setRoleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="Roles()">确 定</el-button>
  </span>
</el-dialog>
     <!-- 分页功能 -->
     <!-- size-change切换上下翻页触发事件 current-change设置当前页码 current-page每页显示个数选择器的选择设置page-size当前页面显示的数据条数 layout 表示页面显示多少组件 total 设置总页数 -->
    
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5,10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //控制用户分配角色对话框的显示与隐藏
      setRoleDialogVisible:false,
      //需要被分配角色的用户信息
      userInfo:[],
      //所有角色的数据列表
      roleList:[],
      //已选中的角色ID值
      selectRoleId:'',
      //控制修改弹出框的显示与隐藏
      updateDialog:false,
      //添加用户
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      //添加表单校验
      addFormRules:{
        username:[
          {
            required:true,
            message:'请输入用户名',
            trigger:"blur",
          },
          {
            min:3,
            max:15,
            message:'长度在3-15个字符',
            trigger:"blur"
          },
        ],
        password:[
          {
            required:true,
            message:'请输入密码',
            trigger:"blur",
          },
          {
            min:6,
            max:15,
            message:'长度在6-15个字符',
            trigger:"blur"
          },
        ],
        email:[
          {
            required:true,
            message:'请输入邮箱',
            trigger:"blur",
          },
          {
            validator: checkEmail, trigger: 'blur'
          },
          
        ],
        mobile:[
          {
            required:true,
            message:'请输入手机号',
            trigger:"blur",
          },
          {
            validator: checkMobile, trigger: 'blur'
          },
        
        ],
      },
      queryInfo: {
        //字符串
        query: "",
        //当前页面值
        pagenum: 1,
        //每页显示的条数
        pagesize: 5,
      },
      //保存请求回来的用户列表数据
      userList: [],
      //记录分页
      total: 0,
      addDialogVisible: false,
      updateForm :{
        username:"",
        email:"",
        mobile:"",
      }
    };
  },
  created() {
    //调用getUserList方法
    this.getUserList();
  },
  
  methods: {
    //点击按钮分配角色
    async Roles(){
      if(!this.selectRoleId){
        return this.$message.error('请选择要分配的角色')
      }
      const {data:res}=await this.$http.put('users/'+this.userInfo.id+'/role',{rid: this.selectRoleId});
      if(res.meta.status!==200)
        return this.$message.error('更新用户角色失败');
        this.$message.success('更新用户成功');
        this.getUserList();//刷新用户列表
  this.selectRoleId = '';//清空本次选择，避免影响下次
  this.setRoleDialogVisible = false;//关闭对话框

    },
//展示分配角色的对话框
async setRole(user){
  //在展示对话框之前，加载所有的角色（待用户选择）
  const {data: res} = await this.$http.get('Roles');

  if(res.meta.status!==200){
      return this.$message.error('获取角色列表失败！');
  }
  this.roleList = res.data;
  this.userInfo = user;//获取用户信息展示在页面
  //显示对话框
  this.setRoleDialogVisible = true;
},
    //删除数据方法
     remove(id){
    this.$confirm('是否永久删除该用户','删除提示',{
        confirmButtonText: '确定',
          cancelButtonText: '取消',
          //删除样式
          type: 'warning',
      }).then(async()=>{
        const {data:res}=await this.$http.delete('users/'+id);
        if(res.meta.status!==200){
          return this.$message.error('删除用户失败');
        };
        this.$message({
            type: 'success',
            message: '删除用户成功!'
      });
      this.getUserList();
    }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });  
    },
    //修改信息方法
  async update(id){
    //根据id去获取当前选择的内容
    const {data:res}=await this.$http.get('Users/'+id)
    if(res.meta.status!=200)return this.$message.error('获取用户信息失败')
    // console.log(res);
    //如何获取到了信息就存储在data里面
    this.updateForm=res.data
      //当点击是我们把显示弹框的内容从false改为true
      this.updateDialog=true;
      
    },
    //修改数据功能
    updateUse(){
      //当用户点击修改弹框的确定按钮时，验证表单数据
      this.$refs.upFormRef.validate(async(valid)=>{
        if(!valid) return this.$message.error('请填写完整的用户信息!');
        const {data:res}=await this.$http.put('Users/'+this.updateForm.id,{
          email:this.updateForm.email,
          mobile:this.updateForm.mobile,
        });
        //判断是否修改成功还是失败
        if(res.meta.status!=200){
          return this.$message.error('修改用户失败！')
        }
        //修改成功
          this.$message.success('修改用户成功！')
          //关闭对话框
          this.updateDialog=false;
         //重新请求最新的数据
          this.getUserList();
      })
    },
    //提交用户表单
    addUse(){
      //点击确定按钮提交数据
      this.$refs.addFormRef.validate(async(valid)=>{
        //进行判断
        if(!valid) return this.$message.error('请填写完整的用户信息!');
        //如果输入完成，提交form表单
        const {data:res}=await this.$http.post('Users',this.addForm)
        //如果添加失败，给出提示
        if(res.meta.status!==201)
          return this.$message.error('添加用户失败');
          //成功了提示添加成功
          this.$message.success('添加用户成功');
        //关闭对话框
        this.addDialogVisible=false;
        //重新请求最新的数据
        this.getUserList();

      });
    },
    //对话框结束后重置表达式
    addDialogClose(){
        this.$refs.addFormRef.resetFields();
    },
    
    //修改用户状态按钮，需要发起网络请求
   async userStateChage(row){
    //发起请求进行状态修改
      const {data:res}=await this.$http.put(`Users/${row.id}/state/${row.mg_state}`);
     //进行判断是否修改成功，并返回
      if(res.meta.status!=200){
        row.mg_state=!row.mg_state;
        return this.$message.error('修改状态失败')
      }
      this.$message.success('更新状态成功')
    },
    //分页功能
    handleSizeChange(newsize){
// console.log(newsize);
//当pagesize发生改变时候我们应该以下一页的数据作为展示数据
this.queryInfo.pagesize=newsize;
//重新按照pagesize发送请求，获取最新的数据
this.getUserList();
    },
    handleCurrentChange(current){
// console.log(current);
this.queryInfo.pagenum=current;
this.getUserList();
    },
    async getUserList() {
      //发送用户请求信息
      const { data: res } = await this.$http.get("Users", {
        //这个去请求需要一些相关的参数
        params: this.queryInfo,
      });
      // console.log(res.data);
      if (res.meta.status != 200)
        return this.$message.error("获取数据列表失败");
      //如果状态码为200把数据保存到data去
      this.userList = res.data.users;
      this.total = res.data.total;
    },
  },
  
};
//验证邮箱的规则
var checkEmail = (rule,value,cb) =>{
            const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if(regEmail.test(value)){
                //合法的邮箱
                return cb()
            }
            cb(new Error("请输入合法的邮箱"))
        }
        //验证手机号码的规则
        var checkMobile = (rule,value,cb) =>{
            const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
            if (regMobile.test(value)) { 
                //合法的手机号码
                return cb() 
            }
            cb(new Error('手机号码格式不正确'))     
        }
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-table {
  margin-top: 50px;
  font-size: 15px;
}
</style>