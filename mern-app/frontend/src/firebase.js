// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "gym-member-management.firebaseapp.com",
  projectId: "gym-member-management",
  storageBucket: "gym-member-management.appspot.com",
  messagingSenderId: "633089235248",
  appId: "1:633089235248:web:dd6a684fe3bae634e950f5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Firebase
// export const app = initializeApp(firebaseConfig);