// Authentication Provider Component With Firebase Auth Methods
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.init";

// Google Authentication Provider Instance
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  // Authentication State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register New User With Email And Password
  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign In Existing User With Email And Password
  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign In With Google Popup
  const signInGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Send Password Reset Email
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Sign Out Current User
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Update User Profile Information
  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  // Listen For Authentication State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Context Value Object
  const authInfo = {
    user,
    loading,
    registerUser,
    signInUser,
    signInGoogle,
    resetPassword,
    logOut,
    updateUserProfile,
  };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
