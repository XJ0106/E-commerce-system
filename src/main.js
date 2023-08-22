import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

import 'element-ui/lib/theme-chalk/index.css'

import TreeTable from 'vue-table-with-tree-grid'
//富文本框
import VueQuilleditor from 'vue-quill-editor'
import 'quill/dist/quill.core'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


//引入样式
import { Form, FormItem, Input, Button, Message, Header, Aside, Main, Container, Menu, Submenu, MenuItem, MenuItemGroup, Breadcrumb, BreadcrumbItem, Card,Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,MessageBox,Tag,Select,Option,Tree,Cascader,Alert,Tabs,TabPane,Steps,Step,CheckboxGroup,Checkbox,Upload,Timeline,TimelineItem} from "element-ui"
import axios from 'axios'
//引入css样式
import "./assets/css/global.css"
import "./assets/fonts/iconfont.css"
//注册全局组件
Vue.component('tree-table',TreeTable)

axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"

axios.interceptors.request.use(config => {
  //request是一个拦截器
  //config直接校验token
  config.headers.Authorization = window.sessionStorage.getItem("token")
  //返回token
  return config
})

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') // 如果不是两位前面用0填充
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

//挂载样式
Vue.use(TimelineItem)
Vue.use(Timeline)
Vue.use(VueQuilleditor)
Vue.use(Upload)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Step)
Vue.use(Steps)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(Tree)
Vue.use(Option)
Vue.use(Select)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Message)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Container)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
//挂载axios
Vue.prototype.$http = axios


Vue.config.productionTip = false
//挂载message
Vue.prototype.$message = Message
Vue.prototype.$confirm=MessageBox.confirm
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
