import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

let app, firestore;
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
  firestore = admin.firestore().settings({ ignoreUndefinedProperties: true });
}

// export const firestore = initializeFirestore(app, {
//   //@ts-ignore
//   ignoreUndefinedProperties: true,
// });

const storage = getStorage(app);

export { app, firestore, storage };
