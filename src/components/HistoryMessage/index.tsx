'use client'

import { useChatStore } from '@/providers/chat'
import { Box, CircularProgress, Paper, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useEffect, useRef } from 'react'
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso'

const HistoryMessage = () => {
  const { messages, status } = useChatStore(state => state)
  const virtuosoRef = useRef<VirtuosoHandle>(null)

  useEffect(() => {
    if (virtuosoRef.current && messages.length > 0) {
      virtuosoRef.current.scrollToIndex({ index: messages.length - 1 })
    }
  }, [messages.length])

  return (
    <>
      <Box mt={1} mb={1}>
        <Typography variant='body2' color='textSecondary'>
          狀態：
          {status === 'replying'
            ? '正在輸入...'
            : status === 'replied'
            ? '已回覆'
            : status}{' '}
          {status === 'replying' && <CircularProgress size={14} />}
        </Typography>
      </Box>
      <Box
        height={400}
        border={1}
        borderColor='grey.700'
        borderRadius={2}
        p={1}
      >
        <Virtuoso
          ref={virtuosoRef}
          style={{ height: '100%' }}
          totalCount={messages.length}
          itemContent={index => {
            const m = messages[index]
            const isUser = m.role === 'user'

            return (
              <Box
                display='flex'
                justifyContent={isUser ? 'flex-end' : 'flex-start'}
                mb={1}
              >
                <Box maxWidth={3 / 4}>
                  <Typography variant='caption' color='text.secondary' mb={0.5}>
                    {isUser ? `${m.name}（你）` : 'AI'} ・{' '}
                    {dayjs(m.timestamp).format('HH:mm:ss')}
                  </Typography>
                  <Paper
                    elevation={2}
                    sx={theme => ({
                      px: 2,
                      py: 1,
                      bgcolor: isUser
                        ? theme.palette.primary.dark
                        : theme.palette.mode === 'dark'
                        ? theme.palette.grey[800]
                        : theme.palette.grey[200],
                      color: isUser
                        ? theme.palette.common.white
                        : theme.palette.mode === 'dark'
                        ? theme.palette.grey[100]
                        : theme.palette.text.primary,
                      borderRadius: 2,
                      borderTopRightRadius: isUser ? 0 : 2,
                      borderTopLeftRadius: isUser ? 2 : 0,
                    })}
                  >
                    <Typography whiteSpace='pre-wrap' variant='body2'>
                      {m.content}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            )
          }}
        />
      </Box>
    </>
  )
}

export default HistoryMessage
