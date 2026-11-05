<script setup lang="ts">
import type { MenuItem } from '@/types/menu'

defineOptions({ name: 'SidebarItem' })

defineProps<{
  item: MenuItem
}>()
</script>

<template>
  <el-sub-menu v-if="item.children?.length" :index="item.path">
    <template #title>
      <el-icon v-if="item.meta?.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <span>{{ item.meta?.title }}</span>
    </template>
    <SidebarItem v-for="child in item.children" :key="child.path" :item="child" />
  </el-sub-menu>

  <el-menu-item v-else :index="item.path">
    <el-icon v-if="item.meta?.icon">
      <component :is="item.meta.icon" />
    </el-icon>
    <template #title>{{ item.meta?.title }}</template>
  </el-menu-item>
</template>
