'use server'

import { FIREBASE_ADMIN_ENV } from '@/libs/config'
import { logMention, scanKeywords } from '@/libs/utils/scanKeywords'
import type { Message } from '@/stores/chat'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const adminConfig = {
  projectId: FIREBASE_ADMIN_ENV.projectId,
  credential: cert({
    projectId: FIREBASE_ADMIN_ENV.credential.projectId,
    clientEmail: FIREBASE_ADMIN_ENV.credential.clientEmail,
    privateKey: FIREBASE_ADMIN_ENV.credential.privateKey,
  }),
}

const adminApp =
  getApps().length === 0 ? initializeApp(adminConfig) : getApps()[0]
const db = getFirestore(adminApp)

export async function saveMessageServer(msg: Message) {
  if (!msg.uid || !msg.content || !msg.role || !msg.timestamp)
    throw new Error('Invalid message')

  const docRef = await db.collection('messages').add({
    ...msg,
    user: { uid: msg.uid, name: msg.name },
  })

  if (msg.role !== 'user') return

  const matches = await scanKeywords(msg.content)

  for (const match of matches) {
    await logMention({
      uid: msg.uid,
      keywordId: match.keywordId,
      keywordName: match.keywordName,
      cateId: match.cateId,
      cateName: match.cateName,
      source: 'user',
      messageId: docRef.id,
      messageContent: msg.content,
      timestamp: msg.timestamp,
      user: { uid: msg.uid, name: msg.name },
    })
  }

  await db
    .collection('latestConversations')
    .doc(msg.uid)
    .set({
      uid: msg.uid,
      user: { uid: msg.uid, name: msg.name },
      lastMessageId: docRef.id,
      lastMessageContent: msg.content,
      lastMessage: docRef,
      lastTimestamp: msg.timestamp,
    })
}
