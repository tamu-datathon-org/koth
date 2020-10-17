import * as Firebase from "firebase-admin";

const firebaseCreds = {
  projectId: process.env.FIRESTORE_PROJECT_ID,
  clientEmail: process.env.FIRESTORE_CLIENT_EMAIL,
  privateKey: process.env.FIRESTORE_PRIVATE_KEY,
};

export const firebase = Firebase.initializeApp(
  {
    credential: Firebase.credential.cert(firebaseCreds),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  }
);