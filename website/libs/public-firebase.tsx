import firebase from "firebase";
import { v4 as uuid } from "uuid";
import React from "react";

firebase.initializeApp({
  apiKey: "AIzaSyAJiP9vUrCgVPoftyvAeBRAyHf5-FKq6c4",
  authDomain: "koth-c3d3c.firebaseapp.com",
  databaseURL: "https://koth-c3d3c.firebaseio.com",
  projectId: "koth-c3d3c",
  storageBucket: "koth-c3d3c.appspot.com",
  messagingSenderId: "771741778985",
  appId: "1:771741778985:web:17a1157b85d8c3f0bd8838",
  measurementId: "G-HB42NHK07E"
}, uuid());

export const firestore = firebase.firestore();


export const useDocument = <T extends {}>(docPath: string) => {
  const [data, changeData] = React.useState<T | undefined>(undefined);

  React.useEffect(() => {
    const unsub = firestore.doc(docPath).onSnapshot(val => {
      changeData(val.data() as T || undefined);
    });
    return unsub;
  }, [])

  return data;
}