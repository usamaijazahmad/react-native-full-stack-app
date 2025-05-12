// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXLBijZoj6uAWn0PjNLe-Wu_5IGQsDSqM",
  authDomain: "react-native-73d3c.firebaseapp.com",
  projectId: "react-native-73d3c",
  storageBucket: "react-native-73d3c.firebasestorage.app",
  messagingSenderId: "435567790066",
  appId: "1:435567790066:web:daf1b1498026d8339a0d6b",
  measurementId: "G-Z0JNV0MC2R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app);
const analytics = getAnalytics(app);
