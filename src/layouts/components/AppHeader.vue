<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const pageTitle = computed(() => route.meta.title ?? '')
const nickname = computed(() => userStore.nickname || userStore.username)

async function handleCommand(command: string): Promise<void> {
  if (command !== 'logout') return

  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      type: 'warning',
      confirmButtonText: '退出',
      cancelButtonText: '取消',
    })
  } catch {
    // 用户取消
    return
  }

  await userStore.logout()
  await router.push('/login')
}
</script>

<template>
  <header class="app-header">
    <div class="app-header__left">
      <el-icon class="app-header__toggle" :size="18" @click="appStore.toggleSidebar()">
        <component :is="appStore.sidebarCollapsed ? 'Expand' : 'Fold'" />
      </el-icon>
      <span class="app-header__title">{{ pageTitle }}</span>
    </div>

    <div class="app-header__right">
      <el-dropdown @command="handleCommand">
        <span class="app-header__user">
          <el-avatar :size="28">{{ nickname.slice(0, 1) }}</el-avatar>
          <span class="app-header__nickname">{{ nickname }}</span>
          <el-icon :size="12">
            <component :is="'ArrowDown'" />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  height: var(--app-header-height);
  padding: 0 16px;
  background-color: var(--app-surface);
  border-bottom: 1px solid var(--app-border-light);
}

.app-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-header__toggle {
  color: var(--app-text-secondary);
  cursor: pointer;
}

.app-header__toggle:hover {
  color: var(--app-primary);
}

.app-header__title {
  font-size: 15px;
  font-weight: 500;
}

.app-header__user {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--app-text-primary);
  cursor: pointer;
  outline: none;
}

.app-header__nickname {
  font-size: 14px;
}
</style>
