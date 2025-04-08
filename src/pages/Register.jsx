import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { assignWelcomeCouponsToUser } from "../utils/couponUtils";

function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name,
        role: "customer",
        firstLogin: true, // ✅ flag to show welcome message on dashboard
      });

      await assignWelcomeCouponsToUser(user.uid);
      alert("🎉 Registration successful! Login to explore Shophoria.");
      navigate("/login");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-teal-600 dark:text-teal-400 mb-6">
          📝 Register
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border px-4 py-2 rounded dark:bg-gray-900 dark:text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-4 py-2 rounded dark:bg-gray-900 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-4 py-2 rounded dark:bg-gray-900 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
