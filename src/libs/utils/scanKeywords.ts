'use server'

import { getFirestore } from 'firebase-admin/firestore'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { FIREBASE_ADMIN_ENV } from '../config'

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

type scanResult = {
  keywordId: string
  keywordName: string
  cateId: string
  cateName: string
}[]

export async function scanKeywords(text: string): Promise<scanResult> {
  const snapshot = await db.collection('keywordCategories').get()
  const results: scanResult = []

  snapshot.forEach(doc => {
    const data = doc.data()
    for (const k of data.keywords || []) {
      if (text.includes(k.keywordName)) {
        results.push({
          keywordId: k.keywordId,
          keywordName: k.keywordName,
          cateId: doc.id,
          cateName: data.cateName,
        })
      }
    }
  })

  return results
}

export async function logMention(entry: {
  uid: string
  keywordId: string
  keywordName: string
  cateId: string
  cateName: string
  source: 'user'
  messageId: string
  messageContent: string
  timestamp: string
  user: { uid: string; name: string }
}) {
  await db
    .collection('mentions')
    .add({ ...entry, message: db.collection('messages').doc(entry.messageId) })
}
