<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div><img src="..\assets\QQ.png"
             alt="">
        <span>电商平台管理系统</span>
      </div>
      <el-button type="info"
                 @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button"
             @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu background-color=" rgb(118, 99, 128)"
                 text-color="#fff"
                 active-text-color="#409eef"
                 unique-opened
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 router
                 :default-active="activePath">
          <!-- 一级菜单 -->
          <!-- 数值和字符串拼接会得到一个字符串 item.id+''-->
          <el-submenu :index="item.id+''"
                      v-for="item in menulist"
                      :key="item.id">
            <!-- 一级菜单模块区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path"
                          v-for="subItem in item.children"
                          :key="subItem.id"
                          @click="saveNavState('/' + subItem.path)">
              <!-- 二级菜单模块区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      menulist: [],
      iconsObj: {
        125: 'iconfont el-icon-s-custom',
        103: 'iconfont el-icon-setting',
        101: 'iconfont el-icon-suitcase',
        102: 'iconfont el-icon-notebook-2',
        145: 'iconfont el-icon-s-order'
      },
      // 是否折叠
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    // this.activePath = window.sessionStorage.setItem('activePath')
  },
  methods: {
    logout () {
      // 清除token，重定向到登录页
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      // console.log(res)
    },
    // 点击按钮，折叠菜单
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.el-header {
  background-color: rgb(250, 250, 250);
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  align-items: center;
  color: rgb(139, 204, 171);
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      padding-left: 15px;
    }
  }
}
.el-aside {
  background-color: rgb(118, 99, 128);
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: rgb(139, 204, 171);
}
.home-container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: rgb(83, 78, 157);
  font-size: 10px;
  line-height: 25px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.5em;
  cursor: pointer;
}
</style>
