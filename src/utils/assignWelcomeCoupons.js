import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const welcomeCoupons = [
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

export async function assignWelcomeCouponsToUser(userId) {
  const userCouponRef = collection(db, "users", userId, "coupons");

  for (const coupon of welcomeCoupons) {
    await addDoc(userCouponRef, coupon);
  }
}
