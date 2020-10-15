import * as Firebase from "firebase-admin";
import { v4 as uuid } from "uuid";

const firebaseCreds = {
  projectId: process.env.FIRESTORE_PROJECT_ID,
  clientEmail: process.env.FIRESTORE_CLIENT_EMAIL,
  privateKey: process.env.FIRESTORE_PRIVATE_KEY,
};

export const firebase = Firebase.initializeApp(
  {
    credential: Firebase.credential.cert(firebaseCreds),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  },
  uuid() // Hack for Vercel rebuilding files every time
);

export const firebaseBucket = firebase.storage().bucket();
