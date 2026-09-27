import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5lDh4C4St7NkSJ9mQx1-Fwgqk42P1JB4",
  authDomain: "utsavnest-5d07c.firebaseapp.com",
  projectId: "utsavnest-5d07c",
  storageBucket: "utsavnest-5d07c.firebasestorage.app",
  messagingSenderId: "30729528929",
  appId: "1:30729528929:web:00c0cf109bda7c04e2dc20",
  measurementId: "G-BDN205GQ04"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
