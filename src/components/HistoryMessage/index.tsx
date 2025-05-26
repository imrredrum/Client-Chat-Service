import { useChatStore } from '@/providers/chat'
import { Box, CircularProgress, Typography } from '@mui/material'
import { Virtuoso } from 'react-virtuoso'

const HistoryMessage = () => {
  const { messages, status } = useChatStore(state => state)

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
        borderColor='grey.300'
        borderRadius={2}
        p={1}
      >
        <Virtuoso
          style={{ height: '100%' }}
          totalCount={messages.length}
          itemContent={idx => {
            const m = messages[idx]
            return (
              <Typography>
                <strong>{m.role}:</strong> {m.content}
              </Typography>
            )
          }}
        />
      </Box>
    </>
  )
}

export default HistoryMessage
