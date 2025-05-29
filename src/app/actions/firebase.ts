'use server'

import { FIREBASE_ADMIN_ENV } from '@/libs/config'
import { logMention, scanKeywords } from '@/libs/utils/scanKeywords'
import type { Message } from '@/stores/chat'
import dayjs from 'dayjs'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

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

async function batchUpdate(
  msg: Message,
  docRef: FirebaseFirestore.DocumentReference<
    FirebaseFirestore.DocumentData,
    FirebaseFirestore.DocumentData
  >
) {
  const dateKey = dayjs(msg.timestamp).format('YYYY-MM-DD')
  const batch = db.batch()

  batch.set(db.collection('latestConversations').doc(msg.uid), {
    uid: msg.uid,
    name: msg.name,
    lastMessage: msg.content,
    lastTimestamp: Timestamp.fromDate(new Date(msg.timestamp)),
  })

  const userStatsRef = db
    .collection('dailyUserStats')
    .doc(dateKey)
    .collection('users')
    .doc(msg.uid)
  batch.set(userStatsRef, { messageCount: 1 }, { merge: true })

  const dayStatsRef = db.collection('dailyStats').doc(dateKey)
  batch.set(dayStatsRef, { userMessageCount: 1 }, { merge: true })

  const matches = await scanKeywords(msg.content)
  const mentionRef = db
    .collection('dailyUserMentions')
    .doc(dateKey)
    .collection('users')
    .doc(msg.uid)
  const mentionUpdates: Record<string, number> = {}

  for (const match of matches) {
    const key = `${match.cateId}__${match.keywordId}`
    mentionUpdates[key] = (mentionUpdates[key] || 0) + 1

    const statKey = `mentions.${match.cateId}.${match.keywordId}`
    batch.set(dayStatsRef, { [statKey]: 1 }, { merge: true })

    await logMention({
      uid: msg.uid,
      keywordId: match.keywordId,
      keywordName: match.keywordName,
      cateId: match.cateId,
      cateName: match.cateName,
      source: 'user',
      messageId: docRef.id,
      timestamp: msg.timestamp,
    })
  }

  if (matches.length) {
    batch.set(mentionRef, mentionUpdates, { merge: true })
  }

  await batch.commit()
}

export async function saveMessageServer(msg: Message) {
  if (!msg.uid || !msg.content || !msg.role || !msg.timestamp)
    throw new Error('Invalid message')

  const docRef = await db.collection('messages').add(msg)

  if (msg.role !== 'user') return undefined
  await batchUpdate(msg, docRef)
}
