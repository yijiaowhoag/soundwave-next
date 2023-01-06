const serviceAccount = require('../../soundwave-service-account.json');
import * as admin from 'firebase-admin';

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://soundwave-b4354.firebaseio.com',
  });
}

const db = admin.firestore();

const converter = <T>() => ({
  toFirestore: (data: Partial<T>): FirebaseFirestore.DocumentData => data,
  fromFirestore: (snapshot: FirebaseFirestore.QueryDocumentSnapshot<T>): T => ({
    id: snapshot.id,
    ...snapshot.data(),
  }),
});

export { db, converter };
