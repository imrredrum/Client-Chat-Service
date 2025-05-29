import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { app } from '../utils/firebase'

type User = {
  uid: string
  name: string
}

const db = getFirestore(app)

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'))
      setUsers(
        snapshot.docs.map(doc => ({
          uid: doc.id,
          ...(doc.data() as { name: string }),
        }))
      )
    }
    fetchUsers()
  }, [])

  return users
}
