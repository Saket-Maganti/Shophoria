import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [firstLogin, setFirstLogin] = useState(false); // ✅ Track first login

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setIsAdmin(data.role === "admin");
          setUserName(data.name);
          setFirstLogin(data.firstLogin || false);
        }
      } else {
        setIsAdmin(false);
        setUserName("");
        setFirstLogin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    const uid = user?.uid;
    if (uid) {
      localStorage.removeItem(`shophoria_cart_${uid}`);
      localStorage.removeItem(`shophoria_wishlist_${uid}`);
    }

    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
    setUserName("");
    setFirstLogin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, userName, firstLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
