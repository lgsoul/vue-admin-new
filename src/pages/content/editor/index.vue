<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useDebounceFn } from '@vueuse/core'
import {
  MdEditor,
  type Footers,
  type Themes,
  type ToolbarNames,
  type UploadImgCallBack,
} from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const STORAGE_KEY = 'admin_md_editor_draft'
const EDITOR_ID = 'admin-md-editor'
const DEFAULT_TITLE = '未命名文档'

/** 首次进入时的示例内容，覆盖常用 Markdown 语法，方便直接看渲染效果 */
const SAMPLE_MARKDOWN = [
  '# 富文本编辑页 · 使用说明',
  '',
  '> 基于 **md-editor-v3** 的 Markdown 编辑器：左侧书写，右侧实时预览，工具栏与主题都可配置。',
  '',
  '## 已经接好的能力',
  '',
  '- [x] 标题、粗体、*斜体*、~~删除线~~、`行内代码`',
  '- [x] 引用、有序/无序列表、任务列表、表格',
  '- [x] 代码块高亮、链接、图片（粘贴或点击上传，转本地 base64）',
  '- [x] 目录、全屏、仅预览、HTML 预览、格式化',
  '- [ ] 接后端保存接口（当前先落到 localStorage 草稿）',
  '',
  '## 快捷键',
  '',
  '| 操作 | 快捷键 |',
  '| --- | --- |',
  '| 保存 | `Ctrl / ⌘ + S` |',
  '| 撤销 | `Ctrl / ⌘ + Z` |',
  '| 加粗 | `Ctrl / ⌘ + B` |',
  '',
  '## 一段代码示例',
  '',
  '```ts',
  "import { MdEditor } from 'md-editor-v3'",
  "import 'md-editor-v3/lib/style.css'",
  '',
  'const text = ref("# Hello Editor")',
  '```',
  '',
  '---',
  '',
  '顶部可以改标题、切换**预览主题**和明暗模式，点「导出 .md」能把当前内容下载成文件。',
  '更多语法见 [md-editor-v3 文档](https://imzbf.github.io/md-editor-v3/)。',
].join('\n')

interface Draft {
  title: string
  content: string
  previewTheme: string
  theme: Themes
  savedAt: string
}

const title = ref(DEFAULT_TITLE)
const content = ref(SAMPLE_MARKDOWN)
const theme = ref<Themes>('light')
const previewTheme = ref('default')
const savedAt = ref('')

const isDark = computed({
  get: () => theme.value === 'dark',
  set: (value: boolean) => {
    theme.value = value ? 'dark' : 'light'
  },
})

const charCount = computed(() => content.value.replace(/\s/g, '').length)
const lineCount = computed(() => content.value.split('\n').length)

const toolbars: ToolbarNames[] = [
  'bold',
  'underline',
  'italic',
  'strikeThrough',
  '-',
  'title',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'mermaid',
  'katex',
  '-',
  'revoke',
  'next',
  'save',
  '=',
  'prettier',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'previewOnly',
  'htmlPreview',
  'catalog',
]
const footers: Footers[] = ['markdownTotal', '=', 'scrollSwitch']
const previewThemeOptions = [
  { label: '默认主题', value: 'default' },
  { label: 'GitHub', value: 'github' },
  { label: 'VuePress', value: 'vuepress' },
  { label: 'Smart Blue', value: 'smart-blue' },
  { label: 'Cyanosis', value: 'cyanosis' },
  { label: 'Mk Cute', value: 'mk-cute' },
]

function saveDraft(): boolean {
  try {
    const draft: Draft = {
      title: title.value,
      content: content.value,
      previewTheme: previewTheme.value,
      theme: theme.value,
      savedAt: dayjs().format('HH:mm:ss'),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    savedAt.value = draft.savedAt
    return true
  } catch {
    // 图片 base64 过大时 localStorage 会超限，不阻断编辑
    return false
  }
}

const autoSave = useDebounceFn(() => {
  void saveDraft()
}, 800)

watch([title, content, theme, previewTheme], () => {
  void autoSave()
})

function restoreDraft(): void {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    title.value = 'Markdown 编辑页示例'
    return
  }

  try {
    const draft = JSON.parse(raw) as Partial<Draft>
    title.value = draft.title ?? DEFAULT_TITLE
    content.value = draft.content ?? SAMPLE_MARKDOWN
    previewTheme.value = draft.previewTheme ?? 'default'
    theme.value = draft.theme === 'dark' ? 'dark' : 'light'
    savedAt.value = draft.savedAt ?? ''
  } catch {
    // 草稿损坏时回退到示例内容
  }
}

function handleSave(value: string = content.value): void {
  content.value = value
  ElMessage.success(saveDraft() ? '已保存到本地草稿' : '草稿空间不足，建议先导出 .md')
}

async function handleUploadImg(files: Array<File>, callBack: UploadImgCallBack): Promise<void> {
  const urls: string[] = []

  for (const file of files) {
    if (file.size > 2 * 1024 * 1024) {
      ElMessage.warning(`${file.name} 超过 2MB，已跳过`)
      continue
    }

    const url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
    urls.push(url)
  }

  if (urls.length > 0) {
    callBack(urls)
    ElMessage.success(`已插入 ${urls.length} 张图片（本地预览，未上传服务器）`)
  }
}

function handleExport(): void {
  const fileName = (title.value.trim() || DEFAULT_TITLE).replace(/[\\/:*?"<>|]/g, '_')
  const text = `# ${title.value.trim() || DEFAULT_TITLE}\n\n${content.value}`
  const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName}.md`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('已导出 Markdown 文件')
}

async function handleClear(): Promise<void> {
  try {
    await ElMessageBox.confirm('将清空标题与正文，本地草稿也会一并删除，确定继续吗？', '清空文档', {
      type: 'warning',
      confirmButtonText: '清空',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }

  title.value = DEFAULT_TITLE
  content.value = ''
  localStorage.removeItem(STORAGE_KEY)
  savedAt.value = ''
  ElMessage.success('已清空')
}

function handleLoadSample(): void {
  title.value = 'Markdown 编辑页示例'
  content.value = SAMPLE_MARKDOWN
  ElMessage.success('已载入示例内容')
}

onMounted(restoreDraft)
onBeforeUnmount(() => {
  void saveDraft()
})
</script>

<template>
  <div class="editor-page">
    <el-card shadow="never" class="editor-page__bar">
      <div class="editor-bar">
        <div class="editor-bar__row">
          <el-input
            v-model="title"
            class="editor-bar__title"
            placeholder="请输入文档标题"
            maxlength="60"
            clearable
          />
          <div class="editor-bar__meta">
            <el-tag type="info" size="small">{{ charCount }} 字 · {{ lineCount }} 行</el-tag>
            <el-tag v-if="savedAt" type="success" size="small">草稿已存 {{ savedAt }}</el-tag>
          </div>
        </div>

        <div class="editor-bar__row editor-bar__row--actions">
          <el-select v-model="previewTheme" class="editor-bar__select" size="default">
            <el-option
              v-for="item in previewThemeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-switch v-model="isDark" inline-prompt active-text="暗" inactive-text="亮" />
          <el-button @click="handleLoadSample">载入示例</el-button>
          <el-button @click="handleExport">导出 .md</el-button>
          <el-button @click="handleClear">清空</el-button>
          <el-button type="primary" @click="handleSave()">保存草稿</el-button>
        </div>
      </div>
    </el-card>

    <div class="editor-page__body">
      <MdEditor
        v-model="content"
        :editor-id="EDITOR_ID"
        :theme="theme"
        :preview-theme="previewTheme"
        code-theme="github"
        language="zh-CN"
        :toolbars="toolbars"
        :footers="footers"
        :show-code-row-number="true"
        :catalog-max-depth="3"
        placeholder="在这里开始写作，支持 Markdown 语法…"
        :on-save="handleSave"
        :on-upload-img="handleUploadImg"
      />
    </div>
  </div>
</template>

<style scoped>
.editor-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: calc(100vh - var(--app-header-height));
  padding: 16px;
}

.editor-page__bar {
  flex: none;
}

.editor-bar {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.editor-bar__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.editor-bar__row--actions {
  justify-content: flex-end;
}

.editor-bar__title {
  flex: 1;
  min-width: 220px;
  font-size: 16px;
}

.editor-bar__meta {
  display: flex;
  gap: 8px;
}

.editor-bar__select {
  width: 140px;
}

.editor-page__body {
  flex: 1;
  min-height: 420px;
}

.editor-page__body :deep(.md-editor) {
  height: 100%;
  border-radius: 8px;
}
</style>
