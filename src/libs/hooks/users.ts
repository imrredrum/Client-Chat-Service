import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { app } from '../utils/firebase'

type User = {
  id: string
  name: string
}

const db = getFirestore(app)

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'))
      setUsers(snapshot.docs.map(doc => doc.data() as User))
    }
    fetchUsers()
  }, [])

  return users
}
