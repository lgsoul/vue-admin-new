<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
</script>

<template>
  <div class="app-layout">
    <AppSidebar />
    <div class="app-layout__body">
      <AppHeader />
      <main class="app-layout__content">
        <RouterView v-slot="{ Component, route }">
          <component :is="Component" :key="route.path" />
        </RouterView>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.app-layout__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.app-layout__content {
  flex: 1;
  overflow: auto;
}
</style>
