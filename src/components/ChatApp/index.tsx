'use client'

import { useChatStore } from '@/providers/chat'
import { Box } from '@mui/material'
import HistoryMessage from '../HistoryMessage'
import { useUserStore } from '@/providers/user'
import MessageInput from '../MessageInput'
import { saveMessageServer } from '@/app/actions/firebase'
import { useWebSocket } from '@/libs/hooks/websocket'
import { useCallback } from 'react'
import type { Message } from '@/stores/chat'

const ChatApp = () => {
  const { uid, name } = useUserStore(state => state)
  const { addMessage, setStatus } = useChatStore(state => state)

  const handleOnMessage = useCallback(
    (msg: Message) => {
      addMessage(msg)
      saveMessageServer(msg)
    },
    [addMessage]
  )

  const { sendMessage } = useWebSocket(uid, handleOnMessage, setStatus)

  const handleSubmit = useCallback(
    async (content: string) => {
      if (!uid || !name || !content.trim()) return undefined
      const msg = {
        uid: uid,
        name: name,
        user: { uid, name },
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      }
      addMessage(msg)
      await saveMessageServer(msg)
      sendMessage(msg)
      setStatus('replying')
    },
    [uid, name, addMessage, setStatus, sendMessage]
  )

  return (
    uid && (
      <Box component='main'>
        <HistoryMessage />
        <MessageInput onSubmit={handleSubmit} />
      </Box>
    )
  )
}

export default ChatApp
