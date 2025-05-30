'use client'

import { Box, Button, TextareaAutosize, TextField } from '@mui/material'
import { useRef, useState } from 'react'

const DEBOUNCE_INTERVAL = 1000

const MessageInput: React.FC<{
  onSubmit: (content: string) => Promise<void>
}> = ({ onSubmit }) => {
  const [submitting, setSubmitting] = useState(false)
  const lastSubmitTime = useRef(0)
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (formData: FormData) => {
    const now = Date.now()
    if (now - lastSubmitTime.current < DEBOUNCE_INTERVAL) return
    lastSubmitTime.current = now

    const input = formData.get('content') as string
    if (!input || input.trim() === '') return

    setSubmitting(true)
    try {
      await onSubmit(input.trim())
      if (inputRef.current) {
        inputRef.current.value = ''
        inputRef.current.focus()
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box
      component='form'
      action={handleSubmit}
      ref={formRef}
      display='flex'
      flexDirection='column'
      gap={1}
      mt={2}
    >
      <TextField
        name='content'
        multiline
        maxRows={3}
        fullWidth
        inputRef={inputRef}
        disabled={submitting}
      />
      <Button type='submit' variant='contained' loading={submitting}>
        Send
      </Button>
    </Box>
  )
}

export default MessageInput
