<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const displayName = computed(() => userStore.nickname || userStore.username || '访客')

const stats = [
  { label: '今日访问', value: '1,284', unit: '次' },
  { label: '待处理工单', value: '23', unit: '单' },
  { label: '在线用户', value: '156', unit: '人' },
  { label: '接口成功率', value: '99.7', unit: '%' },
]
</script>

<template>
  <div class="page-container">
    <el-card shadow="never">
      <p class="dashboard__welcome">你好，{{ displayName }}</p>
      <p class="dashboard__hint">
        这是一个按 2026 年技术栈初始化的管理后台骨架，左侧菜单与权限已打通，可直接开始写业务。
      </p>
    </el-card>

    <el-row :gutter="16">
      <el-col v-for="item in stats" :key="item.label" :xs="12" :sm="12" :md="6">
        <el-card shadow="never" class="dashboard__stat">
          <p class="dashboard__stat-label">{{ item.label }}</p>
          <p class="dashboard__stat-value">
            {{ item.value }}
            <span class="dashboard__stat-unit">{{ item.unit }}</span>
          </p>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" header="下一步">
      <ol class="dashboard__list">
        <li>把 <code>openapi.json</code> 换成后端真实契约，执行 <code>npm run gen:api</code></li>
        <li>在 <code>src/pages</code> 下新增页面，并在 <code>src/router/routes.ts</code> 注册</li>
        <li>接口调用统一走 <code>src/api/generated</code> 生成的函数，不手写类型</li>
      </ol>
    </el-card>
  </div>
</template>

<style scoped>
.dashboard__welcome {
  font-size: 16px;
  font-weight: 500;
}

.dashboard__hint {
  margin-top: 8px;
  font-size: 13px;
  color: var(--app-text-secondary);
}

.dashboard__stat {
  margin-bottom: 16px;
}

.dashboard__stat-label {
  font-size: 13px;
  color: var(--app-text-secondary);
}

.dashboard__stat-value {
  margin-top: 8px;
  font-size: 24px;
  font-weight: 500;
}

.dashboard__stat-unit {
  margin-left: 4px;
  font-size: 13px;
  font-weight: 400;
  color: var(--app-text-secondary);
}

.dashboard__list {
  padding-left: 18px;
  font-size: 13px;
  line-height: 2;
  color: var(--app-text-secondary);
}

.dashboard__list code {
  padding: 1px 5px;
  font-family: var(--font-mono, monospace);
  background-color: var(--app-bg);
  border-radius: 4px;
}
</style>
