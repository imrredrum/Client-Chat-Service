'use client'
import type { Message } from '@/stores/chat'
import { useCallback, useEffect, useRef } from 'react'
import { WEB_SOCKET_SERVER } from '../config'
import type { UserStore } from '@/stores/user'

export function useWebSocket(
  uid: UserStore['uid'],
  onMessage: (msg: Message) => void,
  onStatus?: (status: string) => void
) {
  const socket = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!uid || !WEB_SOCKET_SERVER) return undefined
    socket.current = new WebSocket(WEB_SOCKET_SERVER)
    socket.current.onmessage = e => {
      const msg = JSON.parse(e.data)
      if (msg.role === 'system') {
        onStatus?.(msg.content)
      } else {
        onMessage(msg)
        onStatus?.('replied')
      }
    }

    socket.current.onopen = () => {
      console.log('✅ WS connected')
    }
    socket.current.onerror = err => {
      console.error('❌ WS Error:', err)
    }
    socket.current.onclose = () => {
      console.warn('⚠️ WS closed')
    }
    return () => socket.current?.close()
  }, [uid, onMessage, onStatus])

  const sendMessage = useCallback((msg: Message) => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(msg))
    }
  }, [])

  return { sendMessage }
}
