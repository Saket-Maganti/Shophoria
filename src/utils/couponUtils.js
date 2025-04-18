import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

// Predefined coupons (global + welcome)
export const allCoupons = [
  {
    code: "WELCOME10",
    type: "percentage",
    amount: 10,
    minOrder: 100,
    expiresAt: "2025-12-31",
  },
  {
    code: "FREE50",
    type: "flat",
    amount: 50,
    minOrder: 300,
    expiresAt: "2025-12-31",
  },
  {
    code: "NEWUSER5",
    type: "flat",
    amount: 20,
    minOrder: 200,
    expiresAt: "2025-12-31",
  },
  {
    code: "FLAT5",
    type: "flat",
    amount: 5,
    minOrder: 20,
    expiresAt: "2025-06-30",
  },
  {
    code: "SUPER20",
    type: "percentage",
    amount: 20,
    minOrder: 100,
    expiresAt: "2025-12-01",
  },
  {
    code: "MARKETFEST",
    type: "flat",
    amount: 15,
    minOrder: 50,
    expiresAt: "2025-11-30",
  },
  {
    code: "FLASH25",
    type: "percentage",
    amount: 25,
    minOrder: 80,
    expiresAt: "2025-05-31",
  },
];

// Seed global coupons
export async function seedGlobalCoupons() {
  for (const coupon of allCoupons) {
    await addDoc(collection(db, "coupons"), coupon);
  }
  alert("🎉 Global coupons seeded successfully!");
}

// Assign welcome coupons to a specific user
export async function assignWelcomeCouponsToUser(userId) {
  const welcomeCoupons = allCoupons.filter(coupon =>
    ["WELCOME10", "FREE50", "NEWUSER5"].includes(coupon.code)
  );

  const userCouponRef = collection(db, "users", userId, "coupons");
  for (const coupon of welcomeCoupons) {
    await addDoc(userCouponRef, coupon);
  }
}
