import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate("/");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-purple-600 dark:text-purple-400 mb-6">
          🔐 Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
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
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
