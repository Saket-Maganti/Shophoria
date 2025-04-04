import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBn2hEQo0mxywRh07aCRoMERLJEFvoS5QE",
  authDomain: "shophoria-9500.firebaseapp.com",
  projectId: "shophoria-9500",
  storageBucket: "shophoria-9500.firebasestorage.app",
  messagingSenderId: "722091954301",
  appId: "1:722091954301:web:a3ebd3d6bdea31117ee114"
};
  
// ✅ First initialize the app
const app = initializeApp(firebaseConfig);

// ✅ THEN get the auth object from the initialized app
const auth = getAuth(app);

export const db = getFirestore(app); 

// ✅ Export the auth object
export { auth };