import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// User's Firebase web app configuration
const firebaseConfig = {
  apiKey: "AIzaSyCid1FHjcDPK17CP9eKdlB9bLxux_YDyZU",
  authDomain: "ytmr-lpg.firebaseapp.com",
  projectId: "ytmr-lpg",
  storageBucket: "ytmr-lpg.firebasestorage.app",
  messagingSenderId: "345138469885",
  appId: "1:345138469885:web:1a6b2df33946f8706d5794",
  measurementId: "G-SSZ81SZ5QS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut, 
  onAuthStateChanged,
  updateProfile,
  signInWithPopup
};
