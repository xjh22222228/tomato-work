import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('发现新版本，是否立即更新？')) {
      updateSW()
    }
  },
  onOfflineReady() {
    console.log('应用已准备就绪，可以离线使用')
  },
})
