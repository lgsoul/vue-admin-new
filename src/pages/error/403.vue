<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="error-page">
    <p class="error-page__code">403</p>
    <p class="error-page__desc">抱歉，你没有访问该页面的权限</p>
    <el-button type="primary" @click="router.push('/')">返回首页</el-button>
  </div>
</template>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
}

.error-page__code {
  font-size: 72px;
  font-weight: 500;
  color: var(--app-primary);
}

.error-page__desc {
  font-size: 15px;
  color: var(--app-text-secondary);
}
</style>
