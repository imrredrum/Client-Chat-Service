'use client'

import { Button, TextField } from '@mui/material'
import { useState } from 'react'

const MessageInput: React.FC<{
  onSubmit: (content: string) => Promise<void>
}> = ({ onSubmit }) => {
  const [input, setInput] = useState('')

  const handleSubmit = async () => {
    if (input.trim() === '') return
    await onSubmit(input.trim())
    setInput('')
  }

  return (
    <>
      <TextField
        fullWidth
        value={input}
        onChange={e => setInput(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button onClick={handleSubmit} variant='contained' sx={{ mt: 1 }}>
        Send
      </Button>
    </>
  )
}

export default MessageInput
