import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const sampleData = {
  Electronics: [
    {
      name: "Wireless Earbuds",
      price: "49.99",
      image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg",
      description: "Noise-canceling wireless earbuds with long battery life."
    },
    {
      name: "Bluetooth Speaker",
      price: "29.99",
      image: "https://images.pexels.com/photos/374087/pexels-photo-374087.jpeg",
      description: "Portable speaker with HD sound."
    },
    {
      name: "Smartphone Tripod",
      price: "15.00",
      image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg",
      description: "Compact tripod for phones with Bluetooth remote."
    },
    {
      name: "USB-C Power Bank",
      price: "39.99",
      image: "https://images.pexels.com/photos/3945677/pexels-photo-3945677.jpeg",
      description: "10,000mAh portable charger with fast charging."
    },
    {
      name: "4K Action Camera",
      price: "89.99",
      image: "https://images.pexels.com/photos/2703489/pexels-photo-2703489.jpeg",
      description: "Waterproof action camera for adventure videos."
    }
  ],
  Clothing: [
    {
      name: "Denim Jacket",
      price: "59.99",
      image: "https://images.pexels.com/photos/1366872/pexels-photo-1366872.jpeg",
      description: "Classic blue denim jacket for all seasons."
    },
    {
      name: "Casual Hoodie",
      price: "34.99",
      image: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg",
      description: "Soft and cozy hoodie for daily wear."
    },
    {
      name: "Graphic T-Shirt",
      price: "19.99",
      image: "https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg",
      description: "Trendy graphic tee with unisex design."
    },
    {
      name: "Slim Fit Jeans",
      price: "49.99",
      image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg",
      description: "Stylish jeans with comfortable stretch."
    },
    {
      name: "Running Shorts",
      price: "25.00",
      image: "https://images.pexels.com/photos/39853/woman-girl-eye-model-39853.jpeg",
      description: "Breathable and lightweight running shorts."
    }
  ],
  Books: [
    {
      name: "Atomic Habits",
      price: "16.99",
      image: "https://images.pexels.com/photos/159711/books-159711.jpeg",
      description: "Best-selling book on building good habits."
    },
    {
      name: "Deep Work",
      price: "14.50",
      image: "https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg",
      description: "A guide to focused success in a distracted world."
    },
    {
      name: "The Alchemist",
      price: "12.99",
      image: "https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg",
      description: "Inspirational story about personal dreams."
    },
    {
      name: "Rich Dad Poor Dad",
      price: "10.99",
      image: "https://images.pexels.com/photos/48604/book-read-pocket-book-paperback-48604.jpeg",
      description: "Personal finance classic for beginners."
    },
    {
      name: "Design Patterns",
      price: "29.99",
      image: "https://images.pexels.com/photos/205316/pexels-photo-205316.jpeg",
      description: "Object-oriented design patterns in software."
    }
  ]
};

export async function seedProducts() {
  const productsRef = collection(db, "products");

  // Step 1: Delete all existing products
  const existing = await getDocs(productsRef);
  await Promise.all(existing.docs.map((docSnap) => deleteDoc(doc(db, "products", docSnap.id))));

  // Step 2: Add fresh products
  const addPromises = [];
  for (const category in sampleData) {
    const items = sampleData[category];
    for (const item of items) {
      addPromises.push(
        addDoc(productsRef, {
          ...item,
          category,
        })
      );
    }
  }

  await Promise.all(addPromises);
}
