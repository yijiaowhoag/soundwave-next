const serviceAccount = require('../../soundwave-service-account.json');
import * as admin from 'firebase-admin';

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://soundwave-b4354.firebaseio.com',
  });
}

const db = admin.firestore();

export { db };
