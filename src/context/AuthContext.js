import React, { createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useLocalStorage } from "../service/hooks/useLocalStorage";
import GET_USER from "../service/graphql/querys/getUser";
import { useLazyQuery } from "@apollo/client";
import PropTypes from "prop-types";
import { useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("user", null);
  const [userData, setUserData] = useState("");
  // const [isRegister, setIsRegister] = useState(true)

  const [userQuery] = useLazyQuery(GET_USER);

  //User es admin para responder
  const getUser = async () => {
    const { data } = await userQuery({ variables: { getUserId: user.uid } });
    if (data) {
      setUserData(data.getUser);
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [window.localStorage.getItem("user")]);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleProvider);
  };

  const handleGoogleSignIn = async () => {
    const auth = await loginWithGoogle();
    const {uid} = auth.user;
    const data = await userQuery({ variables: { getUserId: uid } });
    setUserData(data.data.getUser);
    if (!data.data.getUser) {
      // setIsRegister(false)
      window.location.href = "/register";
    }
  };

  const handleLogout = async () => {
    await logout();
    window.localStorage.removeItem("user");
    setUserData("");
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        handleGoogleSignIn,
        handleLogout,
        auth,
        setUserData,
        userData,
        getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

export function useAuthContext() {
  return useContext(AuthContext);
}
