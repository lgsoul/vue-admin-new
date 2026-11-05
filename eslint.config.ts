import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginPlaywright from 'eslint-plugin-playwright'
import pluginVitest from '@vitest/eslint-plugin'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    '**/playwright-report/**',
    '**/test-results/**',
    // 生成物，不参与 lint
    'src/api/generated/**',
    'src/types/auto-imports.d.ts',
    'src/types/components.d.ts',
    'src/mocks/mockServiceWorker.js',
  ]),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    name: 'app/rule-overrides',
    rules: {
      // 页面组件按路径命名（index / 403 / 404），不强制多词
      'vue/multi-word-component-names': ['error', { ignores: ['index', '403', '404'] }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*', 'tests/**/*.{js,ts}'],
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting,
)
