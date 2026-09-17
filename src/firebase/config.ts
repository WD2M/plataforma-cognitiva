// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsRXlFCRm6SUHerhFRuSeMAFNXv2NhOrY",
  authDomain: "lapsucc-4c251.firebaseapp.com",
  projectId: "lapsucc-4c251",
  storageBucket: "lapsucc-4c251.firebasestorage.app",
  messagingSenderId: "961671351947",
  appId: "1:961671351947:web:eb16d8b3f4409792f84e8e",
  measurementId: "G-KPMSF45DXV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
