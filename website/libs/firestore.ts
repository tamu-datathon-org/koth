import { firebase } from "./firebase";

const firestore = firebase.firestore();

export const getCollection = (collection: string) =>
  firestore.collection(collection);

export const getDoc = async (collection: string, docId: string) =>
  firestore.collection(collection).doc(docId).get();
