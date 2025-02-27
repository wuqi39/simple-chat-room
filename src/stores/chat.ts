import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    sessionList: [] as any[], // 会话列表
    currentSession: null as any, // 当前会话
  }),
  actions: {
    // 设置当前会话
    setCurrentSession(session: any) {
      this.currentSession = session
    },
    // 添加会话到会话列表
    addSession(session: any) {
      this.sessionList.push(session)
    },
  },
})
