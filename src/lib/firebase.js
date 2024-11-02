import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "react-chat-dc4a8.firebaseapp.com",
  projectId: "react-chat-dc4a8",
  storageBucket: "react-chat-dc4a8.appspot.com",
  messagingSenderId: "9120471258",
  appId: "1:9120471258:web:3ae29372fc759fa53fede3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()