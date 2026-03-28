// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaDCS8Wt-zfFPKd7TGmyoOHJO0uLUThs8",
  authDomain: "diningwebsite-25476.firebaseapp.com",
  projectId: "diningwebsite-25476",
  storageBucket: "diningwebsite-25476.firebasestorage.app",
  messagingSenderId: "652433420317",
  appId: "1:652433420317:web:cef191e73699d9c86096f4",
  measurementId: "G-JNX04QRXPM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);