'use client'

import { useUsers } from '@/libs/hooks/users'
import { useUserStore } from '@/providers/user'
import {
  Select,
  MenuItem,
  type SelectChangeEvent,
  FormControl,
  InputLabel,
} from '@mui/material'

const UserSelect = () => {
  const users = useUsers()
  const { uid, update } = useUserStore(state => state)

  const handleChange = (event: SelectChangeEvent) => {
    update({
      uid: event.target.value,
      name: users.find(u => u.id === event.target.value)?.name ?? '',
    })
  }

  return (
    <FormControl fullWidth>
      <InputLabel id='user-select-label'>User</InputLabel>
      <Select
        labelId='user-select-label'
        id='user-select'
        value={uid ?? ''}
        label='User'
        onChange={handleChange}
      >
        {users.map(u => (
          <MenuItem key={u.id} value={u.id}>
            {u.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default UserSelect
