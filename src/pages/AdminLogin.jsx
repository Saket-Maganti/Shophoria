import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists() || snap.data().role !== "admin") {
        alert("Access denied. You are not an admin.");
        return;
      }

      alert("Welcome Admin!");
      navigate("/admin");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-red-600 dark:text-red-400 mb-6">
          🔐 Admin Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full border px-4 py-2 rounded dark:bg-gray-900 dark:text-white"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-4 py-2 rounded dark:bg-gray-900 dark:text-white"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
