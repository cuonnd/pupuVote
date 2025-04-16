// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdsStECA3HClYw-Ucuc6BKTDAkYXMR4HU",
  authDomain: "pupu-vote.firebaseapp.com",
  projectId: "pupu-vote",
  storageBucket: "pupu-vote.firebasestorage.app",
  messagingSenderId: "653304509070",
  appId: "1:653304509070:web:5fd5f3d0a36593873  1cfdf",
  measurementId: "G-7X0N8821F7"
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
export const db = getFirestore(app)
