const admin = require('firebase-admin');
const logger = require('firebase-functions/logger');
const { defineSecret, defineString } = require('firebase-functions/params');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');

admin.initializeApp();

const db = getFirestore();
const resendApiKey = defineSecret('RESEND_API_KEY');
const emailFrom = defineString('EMAIL_FROM');

exports.notifyChatMessage = onDocumentCreated({
  document: 'conversations/{conversationId}/messages/{messageId}',
  secrets: [resendApiKey],
  maxInstances: 10,
}, async (event) => {
  const message = event.data?.data();
  if (!message?.senderId) return;

  const conversationSnapshot = await db.collection('conversations')
    .doc(event.params.conversationId)
    .get();
  if (!conversationSnapshot.exists) return;
  const conversation = conversationSnapshot.data();
  const recipientUid = (conversation.participants || []).find((uid) => uid !== message.senderId);
  if (!recipientUid) return;

  const recipientSnapshot = await db.collection('users').doc(recipientUid).get();
  if (!recipientSnapshot.exists) return;
  const recipient = recipientSnapshot.data();
  const role = conversation.participantProfiles?.[recipientUid]?.role;
  const prefs = recipient.notificationPrefs?.[role];
  if (!prefs?.t?.chat) return;

  const sender = conversation.participantProfiles?.[message.senderId]?.displayName || 'Pengguna Justip';
  const messageText = (message.text || '').trim();
  const body = messageText
    ? `${sender}: ${messageText.slice(0, 160)}`
    : `${sender} mengirim lampiran di chat.`;

  if (prefs.push) {
    const tokenSnapshot = await db.collection('users').doc(recipientUid).collection('pushTokens').get();
    const tokenDocs = tokenSnapshot.docs.filter((item) => typeof item.data().token === 'string');
    if (tokenDocs.length) {
      try {
        const result = await getMessaging().sendEachForMulticast({
          tokens: tokenDocs.map((item) => item.data().token),
          data: {
            title: 'Pesan chat baru',
            body,
            link: '/',
          },
          webpush: {
            headers: { TTL: '86400' },
            fcmOptions: { link: '/' },
          },
        });
        await Promise.all(result.responses.map((response, index) => {
          if (response.success) return null;
          const code = response.error?.code;
          if (code === 'messaging/registration-token-not-registered'
            || code === 'messaging/invalid-registration-token') {
            return tokenDocs[index].ref.delete();
          }
          logger.error('FCM chat notification failed', { recipientUid, code });
          return null;
        }));
      } catch (error) {
        logger.error('Could not send FCM chat notification', { recipientUid, error: error.message });
      }
    }
  }

  if (prefs.email && recipient.email) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey.value()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: emailFrom.value(),
          to: [recipient.email],
          subject: `Pesan chat baru dari ${sender}`,
          text: `${body}\n\nBuka Justip untuk membalas pesan ini.`,
        }),
      });
      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`Resend returned ${response.status}: ${detail}`);
      }
    } catch (error) {
      logger.error('Could not send Resend chat email', { recipientUid, error: error.message });
    }
  }
});
