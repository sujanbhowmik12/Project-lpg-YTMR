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
  apiKey: "AIzaSyA85tjIJFxYfHmsXSlBNAdWpDXhmF4_bk4",
  authDomain: "lpg-ytmr.firebaseapp.com",
  projectId: "lpg-ytmr",
  storageBucket: "lpg-ytmr.firebasestorage.app",
  messagingSenderId: "574656128255",
  appId: "1:574656128255:web:680757cbf3f2315c9f18ca",
  measurementId: "G-HF6P4GDDEV"
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
