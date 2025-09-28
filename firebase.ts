import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBB7qinTFWbpHNTUcRpNdXRLJmFyT0wPq0",
  authDomain: "sci-fiitjee.firebaseapp.com",
  databaseURL: "https://sci-fiitjee-default-rtdb.firebaseio.com",
  projectId: "sci-fiitjee",
  storageBucket: "sci-fiitjee.firebasestorage.app",
  messagingSenderId: "617894797762",
  appId: "1:617894797762:web:653df1a160135ea6ed365b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
