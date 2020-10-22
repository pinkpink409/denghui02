<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <!-- 黑马logo -->
        <img src="../assets/heima.png" alt="" />
        <!-- 顶部标题 -->
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header
    >

    <el-container>
      <!-- 侧边栏 -->
      <!-- 4.侧边栏，宽度根据是否折叠进行设置 -->
      <!-- 3.给div添加样式，给div添加事件 -->
      <el-aside width="isCollapase?'64px':'200px'">
        <!-- 1.伸缩侧边栏按钮 -->
        <div class="toggleButton" @click="collapeToggele">|||</div>
        <!-- 2.侧边栏菜单：:collapse='isCollapse'(设置折叠菜单为绑定的isCollapse值)，:collapse-transition="false"关闭默认的折叠动画 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapase"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menusList"
            :key="item.id"
          >
            <template v-slot:title>
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="saveNavState('/' + subitem.path)"
            >
              <template v-slot:title>
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subitem.authName }}</span></template
              >
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    // 3.左侧菜单数据
    return {
      menusList: [],
      iconObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-3702mima',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-tijikongjian'

      },
      // 01 是否折叠
      isCollapase: false,
      // 被激活的地址
      activePath: ''

    }
  },

  // 1.在created阶段请求左侧菜单数据
  created () {
    this.getMenusList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      // 清空token
      window.sessionStorage.clear()

      // 跳转到登录页
      this.$router.push('/login')
    },
    // 2.发送请求获取左侧菜单数据
    async getMenusList () {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menusList = res.data
    },
    // 点击按钮，切换菜单的折叠与展开
    collapeToggele () {
      this.isCollapase = !this.isCollapase
    },
    saveNavState (path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  }

}
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  div {
    display: flex;
    align-items: center;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
  .toggleButton {
    background-color: #4a5064;
    text-align: center;
    color: #eaedf1;
    letter-spacing: 0.2em;
    line-height: 24px;
    font-size: 12px;
    cursor: pointer;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
</style>
