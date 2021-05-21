import * as admin from 'firebase-admin';

// Set the environment variable:
// export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json"

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_AUTH_DOMAIN,
  });
}

const db = admin.firestore();

export { db };
