import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDc4UK-obkbDqq16FZQzic49n5t7de8lv8",
  authDomain: "foodies-e4bd6.firebaseapp.com",
  projectId: "foodies-e4bd6",
  storageBucket: "foodies-e4bd6.firebasestorage.app",
  messagingSenderId: "905590548021",
  appId: "1:905590548021:web:38c4c8a77579c2847cf37c",
  measurementId: "G-4NR7WK8YK7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
