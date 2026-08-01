import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// User's Firebase web app configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq_h2iFYyCHxRluWMv7Qj4d4iiDbBrPvI",
  authDomain: "project-lpg-ytmr.firebaseapp.com",
  projectId: "project-lpg-ytmr",
  storageBucket: "project-lpg-ytmr.firebasestorage.app",
  messagingSenderId: "839218343014",
  appId: "1:839218343014:web:c26c0aea104c39602911a7",
  measurementId: "G-QTMKHX6GTE"
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
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
};
