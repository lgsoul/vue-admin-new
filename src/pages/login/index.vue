<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const appTitle = import.meta.env.VITE_APP_TITLE

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  username: 'admin',
  password: '123456',
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' },
  ],
}

async function handleSubmit(): Promise<void> {
  if (!formRef.value) return

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await userStore.login({ username: form.username, password: form.password })
    ElMessage.success('登录成功')

    const redirect = route.query.redirect
    await router.replace(typeof redirect === 'string' && redirect ? redirect : '/')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login">
    <el-card class="login__card" shadow="never">
      <h1 class="login__title">{{ appTitle }}</h1>
      <p class="login__subtitle">请登录后继续</p>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        size="large"
        label-position="top"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" clearable />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
            @keyup.enter="handleSubmit"
          />
        </el-form-item>

        <el-button
          type="primary"
          size="large"
          class="login__submit"
          :loading="loading"
          @click="handleSubmit"
        >
          登录
        </el-button>
      </el-form>

      <p class="login__tip">开发环境 Mock 账号：admin / 123456</p>
    </el-card>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: var(--app-bg);
}

.login__card {
  width: 380px;
  padding: 8px;
}

.login__title {
  font-size: 20px;
  font-weight: 500;
  text-align: center;
}

.login__subtitle {
  margin: 8px 0 24px;
  font-size: 13px;
  color: var(--app-text-secondary);
  text-align: center;
}

.login__submit {
  width: 100%;
}

.login__tip {
  margin-top: 16px;
  font-size: 12px;
  color: var(--app-text-placeholder);
  text-align: center;
}
</style>
