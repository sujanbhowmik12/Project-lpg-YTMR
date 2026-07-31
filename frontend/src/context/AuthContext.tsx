import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { 
  auth, 
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut, 
  onAuthStateChanged,
  updateProfile
} from '../firebase/config';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string, name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('lpg_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: any) => {
      if (firebaseUser) {
        const currentUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Admin User',
          email: firebaseUser.email || '',
          role: 'admin',
          phone: firebaseUser.phoneNumber || "9876543210"
        };
        setUser(currentUser);
        localStorage.setItem('lpg_auth_user', JSON.stringify(currentUser));
      } else {
        const saved = localStorage.getItem('lpg_auth_user');
        if (!saved) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string) => {
    if (password && password.length >= 6) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const currentUser: User = {
          id: userCred.user.uid,
          name: userCred.user.displayName || email.split('@')[0],
          email: email,
          role: 'admin',
          phone: "9876543210"
        };
        setUser(currentUser);
        localStorage.setItem('lpg_auth_user', JSON.stringify(currentUser));
        return;
      } catch (err: any) {
        console.warn("Firebase login fallback to demo auth:", err.message);
      }
    }

    // Admin demo quick login fallback
    const currentUser: User = {
      id: "emp-1",
      name: email ? email.split('@')[0].toUpperCase() : "ADMIN USER",
      email: email || "admin@ytmrlpg.com",
      role: 'admin',
      phone: "9800011122"
    };
    setUser(currentUser);
    localStorage.setItem('lpg_auth_user', JSON.stringify(currentUser));
  };

  const loginWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        const currentUser: User = {
          id: res.user.uid,
          name: (res.user.displayName || res.user.email?.split('@')[0] || 'GOOGLE ADMIN').toUpperCase(),
          email: res.user.email || 'google_admin@ytmrlpg.com',
          role: 'admin',
          phone: res.user.phoneNumber || "9876543210"
        };
        setUser(currentUser);
        localStorage.setItem('lpg_auth_user', JSON.stringify(currentUser));
        return;
      }
    } catch (err: any) {
      console.warn("Google authentication popup error, using instant fallback:", err.message);
    }

    // Fallback Google Sign-In demo user
    const googleDemoUser: User = {
      id: "google-demo-1",
      name: "SUJAN BHOWMIK (ADMIN)",
      email: "sujan@ytmrlpg.com",
      role: 'admin',
      phone: "8207004928"
    };
    setUser(googleDemoUser);
    localStorage.setItem('lpg_auth_user', JSON.stringify(googleDemoUser));
  };

  const signup = async (email: string, password: string, name: string, phone: string) => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      if (userCred.user) {
        await updateProfile(userCred.user, { displayName: name.toUpperCase() });
      }
      const newUser: User = {
        id: userCred.user.uid,
        name: name.toUpperCase(),
        email: email,
        role: 'admin',
        phone: phone
      };
      setUser(newUser);
      localStorage.setItem('lpg_auth_user', JSON.stringify(newUser));
    } catch (err: any) {
      // Fallback local signup
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: name.toUpperCase(),
        email: email,
        role: 'admin',
        phone: phone
      };
      setUser(newUser);
      localStorage.setItem('lpg_auth_user', JSON.stringify(newUser));
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('lpg_auth_user');
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      const updated = { ...user, role: 'admin' as UserRole };
      setUser(updated);
      localStorage.setItem('lpg_auth_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, loginWithGoogle, signup, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
