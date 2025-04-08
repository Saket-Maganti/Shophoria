// CouponInput.jsx
import { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

function CouponInput({ onApply }) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const { user } = useAuth();

  const handleApply = async () => {
    if (!user) return;
    const couponRef = collection(db, "users", user.uid, "coupons");
    const q = query(couponRef, where("code", "==", code.trim().toUpperCase()));
    const snap = await getDocs(q);

    if (snap.empty) {
      setStatus("❌ Invalid or not assigned coupon");
      return;
    }

    const couponDoc = snap.docs[0];
    const coupon = couponDoc.data();
    const now = new Date();

    if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
      setStatus("❌ Coupon expired");
      return;
    }

    if (coupon.used) {
      setStatus("❌ Coupon already used");
      return;
    }

    // Mark coupon as used immediately for now (can be updated after successful payment)
    await updateDoc(doc(db, "users", user.uid, "coupons", couponDoc.id), { used: true });

    setStatus(`✅ Coupon "${coupon.code}" applied!`);
    onApply({ ...coupon, id: couponDoc.id });
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Discount Code
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          onClick={handleApply}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-medium"
        >
          Apply
        </button>
      </div>
      {status && (
        <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">
          {status}
        </p>
      )}
    </div>
  );
}

export default CouponInput;
