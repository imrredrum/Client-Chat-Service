import { createStore } from 'zustand'

export type Message = {
  uid: string
  name: string
  role: string
  content: string
  timestamp: string
}

export type ChatState = {
  messages: Message[]
  status: string
}

export type ChatActions = {
  addMessage: (msg: Message) => void
  setMessages: (msgs: Message[]) => void
  setStatus: (s: string) => void
}

export type ChatStore = ChatState & ChatActions

export const defaultInitState: ChatState = {
  messages: [],
  status: '',
}

export const createChatStore = (initState: ChatState = defaultInitState) => {
  return createStore<ChatStore>()(set => ({
    ...initState,
    addMessage: msg => set(s => ({ messages: [...s.messages, msg] })),
    setMessages: msgs => set({ messages: msgs }),
    setStatus: s => set({ status: s }),
  }))
}
