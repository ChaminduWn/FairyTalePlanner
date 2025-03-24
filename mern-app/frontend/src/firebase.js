// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: "fairytaleplanner-bfa88.firebaseapp.com",
  projectId: "fairytaleplanner-bfa88",
  storageBucket: "fairytaleplanner-bfa88.firebasestorage.app",
  messagingSenderId: "807848390605",
  appId: "1:807848390605:web:763f9ad275d2f8f4ef1e84",
  measurementId: "G-687N566BP7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);