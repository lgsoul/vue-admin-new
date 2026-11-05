<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'
import { menuRoutes } from '@/router/routes'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import type { MenuItem } from '@/types/menu'
import SidebarItem from './SidebarItem.vue'

const route = useRoute()
const { sidebarCollapsed } = storeToRefs(useAppStore())
const userStore = useUserStore()

/** 按权限过滤 + 按 order 排序后的菜单树 */
const menus = computed<MenuItem[]>(() => {
  const build = (list: RouteRecordRaw[]): MenuItem[] =>
    list
      .filter((item) => !item.meta?.hidden && userStore.hasPermission(item.meta?.permissions))
      .map((item) => ({
        path: item.path,
        meta: item.meta,
        children: item.children ? build(item.children) : undefined,
      }))
      // 子项被权限过滤光的父级菜单，一并隐藏
      .filter((item) => !item.children || item.children.length > 0)
      .sort((a, b) => (a.meta?.order ?? 0) - (b.meta?.order ?? 0))

  return build(menuRoutes)
})

const activeMenu = computed(() => route.path)
</script>

<template>
  <aside class="app-sidebar" :class="{ 'is-collapsed': sidebarCollapsed }">
    <div class="app-sidebar__logo">
      {{ sidebarCollapsed ? 'A' : 'Admin' }}
    </div>
    <el-scrollbar class="app-sidebar__scroll">
      <el-menu
        router
        :default-active="activeMenu"
        :collapse="sidebarCollapsed"
        :collapse-transition="false"
        class="app-sidebar__menu"
      >
        <SidebarItem v-for="item in menus" :key="item.path" :item="item" />
      </el-menu>
    </el-scrollbar>
  </aside>
</template>

<style scoped>
.app-sidebar {
  display: flex;
  flex: none;
  flex-direction: column;
  width: var(--app-sidebar-width);
  background-color: var(--app-surface);
  border-right: 1px solid var(--app-border-light);
  transition: width 0.2s;
}

.app-sidebar.is-collapsed {
  width: var(--app-sidebar-width-collapsed);
}

.app-sidebar__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--app-header-height);
  font-size: 16px;
  font-weight: 500;
  color: var(--app-primary);
  border-bottom: 1px solid var(--app-border-light);
}

.app-sidebar__scroll {
  flex: 1;
}

.app-sidebar__menu {
  border-right: none;
}
</style>
