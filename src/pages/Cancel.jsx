// src/pages/Cancel.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function Cancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 max-w-md text-center border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">❌ Payment Cancelled</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm md:text-base">
          It looks like you cancelled the checkout process. No worries — you can always try again later.
        </p>
        <button
          onClick={() => navigate("/cart")}
          className="bg-yellow-500 hover:bg-yellow-600 transition text-white font-medium px-6 py-2 rounded-lg shadow"
        >
          ⬅️ Return to Cart
        </button>
      </div>
    </div>
  );
}

export default Cancel;
