import { defineConfig, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [presetWind3()],

  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
  },

  theme: {
    colors: {
      primary: 'var(--app-primary)',
      danger: 'var(--app-danger)',
      success: 'var(--app-success)',
      warning: 'var(--app-warning)',
    },
  },
})
