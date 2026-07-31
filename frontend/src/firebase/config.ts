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
import { getAnalytics, isSupported } from "firebase/analytics";

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

// Analytics
export const analytics = typeof window !== 'undefined' ? isSupported().then((yes: boolean) => yes ? getAnalytics(app) : null) : null;

// Google Auth Provider configured to prompt account selector
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut, 
  onAuthStateChanged,
  updateProfile,
  signInWithPopup
};
