'use client'

import { ChatStore, createChatStore } from '@/stores/chat'
import { createContext, useContext, useEffect, useRef } from 'react'
import { useStore } from 'zustand'
import { useUserStore } from './user'
import { listenToMessages } from '@/libs/utils/firebase'

export type ChatStoreApi = ReturnType<typeof createChatStore>

export const ChatStoreContext = createContext<ChatStoreApi | null>(null)

export const ChatStoreProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const storeRef = useRef<ChatStoreApi>(null)

  if (!storeRef.current) {
    storeRef.current = createChatStore()
  }

  const uid = useUserStore(state => state.uid)

  useEffect(() => {
    if (!uid) return undefined
    const unsubscribe = listenToMessages(uid, msgs =>
      storeRef.current?.getState().setMessages(msgs)
    )
    return () => unsubscribe()
  }, [uid])

  return (
    <ChatStoreContext.Provider value={storeRef.current}>
      {children}
    </ChatStoreContext.Provider>
  )
}

export const useChatStore = <T,>(selector: (store: ChatStore) => T): T => {
  const chatStoreContext = useContext(ChatStoreContext)

  if (!chatStoreContext) {
    throw new Error(`useChatStore must be used within ChatStoreProvider`)
  }

  return useStore(chatStoreContext, selector)
}
