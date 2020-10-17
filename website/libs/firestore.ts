import { firebase } from "./firebase";

const firestore = firebase.firestore();
firestore.settings({ ignoreUndefinedProperties: true });

export const getCollection = (collection: string) =>
  firestore.collection(collection);

export const getDoc = async (collection: string, docId: string) =>
  firestore.collection(collection).doc(docId).get();

export const setDoc = async (collection: string, id: string, data: any) =>
  firestore.collection(collection).doc(id).set(data);
