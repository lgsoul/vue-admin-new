<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { createUser, deleteUser, listUsers, updateUser } from '@/api'
import type { UserItem, UserUpsertParams } from '@/api'
import { USER_STATUS, USER_STATUS_OPTIONS } from '@/constants'
import { formatDateTime } from '@/utils/format'

const loading = ref(false)
const list = ref<UserItem[]>([])
const total = ref(0)

const query = reactive({
  page: 1,
  pageSize: 10,
  keyword: '',
  status: undefined as number | undefined,
})

async function fetchList(): Promise<void> {
  loading.value = true
  try {
    const result = await listUsers({
      page: query.page,
      pageSize: query.pageSize,
      keyword: query.keyword || undefined,
      status: query.status,
    })
    list.value = result.list ?? []
    total.value = result.total ?? 0
  } finally {
    loading.value = false
  }
}

function handleSearch(): void {
  query.page = 1
  void fetchList()
}

function handleReset(): void {
  query.keyword = ''
  query.status = undefined
  handleSearch()
}

/* ---------------- 新建 / 编辑 ---------------- */

const dialogVisible = ref(false)
const dialogTitle = ref('新建用户')
const submitting = ref(false)
const formRef = ref<FormInstance>()

const form = reactive<UserUpsertParams & { id?: string }>({
  username: '',
  nickname: '',
  email: '',
  status: USER_STATUS.ENABLED,
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
}

function resetForm(): void {
  formRef.value?.clearValidate()
  Object.assign(form, {
    id: undefined,
    username: '',
    nickname: '',
    email: '',
    status: USER_STATUS.ENABLED,
  })
}

function openCreate(): void {
  dialogTitle.value = '新建用户'
  resetForm()
  dialogVisible.value = true
}

function openEdit(row: UserItem): void {
  dialogTitle.value = '编辑用户'
  Object.assign(form, {
    id: row.id,
    username: row.username,
    nickname: row.nickname,
    email: row.email,
    status: row.status,
  })
  dialogVisible.value = true
}

async function handleSubmit(): Promise<void> {
  if (!formRef.value) return

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  const payload: UserUpsertParams = {
    username: form.username,
    nickname: form.nickname,
    email: form.email,
    status: form.status,
  }

  submitting.value = true
  try {
    const id = form.id
    if (id) {
      await updateUser(id, payload)
      ElMessage.success('更新成功')
    } else {
      await createUser(payload)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    void fetchList()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(row: UserItem): Promise<void> {
  const id = row.id
  if (!id) return

  try {
    await ElMessageBox.confirm(`确定删除用户「${row.nickname}」吗？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }

  await deleteUser(id)
  ElMessage.success('删除成功')
  void fetchList()
}

onMounted(fetchList)
</script>

<template>
  <div class="page-container">
    <el-card shadow="never">
      <el-form :inline="true" :model="query" @submit.prevent="handleSearch">
        <el-form-item label="关键词">
          <el-input
            v-model="query.keyword"
            placeholder="用户名 / 昵称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" placeholder="全部" clearable style="width: 120px">
            <el-option
              v-for="item in USER_STATUS_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div class="table-header">
          <span>用户列表</span>
          <el-button v-permission="'user:create'" type="primary" @click="openCreate">
            新建用户
          </el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="list" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === USER_STATUS.ENABLED ? 'success' : 'info'">
              {{ row.status === USER_STATUS.ENABLED ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button
              v-permission="'user:update'"
              link
              type="primary"
              @click="openEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-permission="'user:delete'"
              link
              type="danger"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="query.page"
        v-model:page-size="query.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        class="table-pagination"
        @current-change="fetchList"
        @size-change="handleSearch"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="Boolean(form.id)" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio v-for="item in USER_STATUS_OPTIONS" :key="item.value" :value="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-pagination {
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
