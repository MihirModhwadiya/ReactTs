// AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../config/firebase";
import PropTypes from "prop-types";

export const AuthContext = createContext();

AuthContextProvider.propTypes = {
  children: PropTypes.object,
};

export function AuthContextProvider({ children }) {
  const [isAuth, setIsAuth] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAuth(user);
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth }}>{children}</AuthContext.Provider>
  );
}
