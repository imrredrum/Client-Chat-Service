import ChatApp from '@/components/ChatApp'
import UserSelect from '@/components/UserSelect'
import { Container, Typography } from '@mui/material'

export default function HomePage() {
  return (
    <Container maxWidth='sm' sx={{ my: 4 }}>
      <Typography variant='h5' component='h1' gutterBottom>
        Client Chat Service
      </Typography>
      <UserSelect />
      <ChatApp />
    </Container>
  )
}
