import { Firestore } from "@google-cloud/firestore";

const firestore = new Firestore({
    projectId: process.env.FIRESTORE_PROJECT_ID,
    credentials: {
        client_email: process.env.FIRESTORE_CLIENT_EMAIL,
        private_key: process.env.FIRESTORE_PRIVATE_KEY,
    },
});

export const getCollection = (collection: string) => firestore.collection(collection);  

export const getDoc = async (collection: string, docId: string) => firestore.collection(collection).doc(docId).get();  