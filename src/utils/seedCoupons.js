import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export const seedWelcomeCoupons = async () => {
  const coupons = [
    {
      code: "WELCOME10",
      type: "percentage",
      amount: 10,
      minOrder: 0,
      expiresAt: "2025-12-31",
    },
    {
      code: "FREESHIP",
      type: "flat",
      amount: 10,
      minOrder: 0,
      expiresAt: "2025-12-31",
    },
    {
      code: "NEWUSER5",
      type: "flat",
      amount: 5,
      minOrder: 20,
      expiresAt: "2025-12-31",
    },
  ];

  for (const coupon of coupons) {
    await addDoc(collection(db, "coupons"), coupon);
  }

  alert("🎉 Welcome coupons seeded successfully!");
};
