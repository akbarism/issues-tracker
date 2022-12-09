import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC-0bQ0bngfjkWebWy2_1bXL9-_b-krA7E",
  authDomain: "issues-tracker-7ee79.firebaseapp.com",
  projectId: "issues-tracker-7ee79",
  storageBucket: "issues-tracker-7ee79.appspot.com",
  messagingSenderId: "1098693466830",
  appId: "1:1098693466830:web:759f43ee098001dbb7ce9f",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default db;
