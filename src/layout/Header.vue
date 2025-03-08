<template>
  <div class="header-container">
    <div class="left">
      <el-button type="text" @click="toggleCollapse">
        <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" class="toggle-icon"></i>
      </el-button>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="currentRoute">{{ currentRoute }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="right">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="user-info">
          <img :src="userAvatar" class="user-avatar">
          {{ userName }}
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="profile">个人信息</el-dropdown-item>
          <el-dropdown-item command="settings">系统设置</el-dropdown-item>
          <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      isCollapse: false,
      userName: 'Admin',
      userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    }
  },
  computed: {
    currentRoute() {
      const routeMap = {
        '/home': '首页',
        '/user': '用户管理',
        '/courier': '快递员管理',
        '/order': '订单管理',
        '/deliverypoint': '取件点管理',
        '/pickupcode': '取件码管理',
        '/feedback': '评价反馈'
      }
      return routeMap[this.$route.path]
    }
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
      this.$bus.$emit('toggle-collapse', this.isCollapse)
    },
    handleCommand(command) {
      switch (command) {
        case 'profile':
          // 处理个人信息
          break
        case 'settings':
          // 处理系统设置
          break
        case 'logout':
          this.$confirm('确认退出登录?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 清除登录信息
            localStorage.removeItem('token')
            // 跳转到登录页
            this.$router.push('/')
            this.$message.success('退出成功')
          }).catch(() => {})
          break
      }
    }
  }
}
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.left {
  display: flex;
  align-items: center;
}

.toggle-icon {
  font-size: 20px;
  margin-right: 20px;
  cursor: pointer;
  color: #606266;
}

.right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #606266;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
</style>
