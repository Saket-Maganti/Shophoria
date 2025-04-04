import { useState } from "react";
import { coupons } from "../utils/couponData";

function CouponInput({ onApply }) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");

  const handleApply = () => {
    const coupon = coupons.find(c => c.code.toLowerCase() === code.trim().toLowerCase());

    if (!coupon) {
      setStatus("❌ Invalid code");
      return;
    }

    const now = new Date();
    if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
      setStatus("❌ Coupon expired");
      return;
    }

    setStatus(`✅ Coupon "${coupon.code}" applied!`);
    onApply(coupon);
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
        <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">{status}</p>
      )}
    </div>
  );
}

export default CouponInput;
