import React from "react";
import { seedProducts } from "../utils/seedUtils";

function Seed() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-4">🌱 Seed Products</h1>
      <button
        onClick={seedProducts}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Run Seeding Script
      </button>
    </div>
  );
}

export default Seed;
