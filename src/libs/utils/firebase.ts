import { initializeApp, getApps } from 'firebase/app'
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { FIREBASE_CONFIG } from '../config'
import type { Message } from '@/stores/chat'

export const app =
  getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApps()[0]
const db = getFirestore(app)

export function listenToMessages(uid: string, cb: (msgs: Message[]) => void) {
  const q = query(
    collection(db, 'messages'),
    where('uid', '==', uid),
    orderBy('timestamp')
  )
  return onSnapshot(q, snapshot => {
    cb(snapshot.docs.map(doc => doc.data() as Message))
  })
}
