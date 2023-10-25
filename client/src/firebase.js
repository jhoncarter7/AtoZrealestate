// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "atozrealstate-dc68e.firebaseapp.com",
  projectId: "atozrealstate-dc68e",
  storageBucket: "atozrealstate-dc68e.appspot.com",
  messagingSenderId: "736168748172",
  appId: "1:736168748172:web:fa93d331dfbb577f5d07a9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);