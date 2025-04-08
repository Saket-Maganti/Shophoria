import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const sampleData = {
  Electronics: [
    {
      name: "Wireless Earbuds",
      price: "49.99",
      image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg",
      description: "Noise-canceling wireless earbuds with long battery life.",
    },
    {
      name: "Bluetooth Speaker",
      price: "29.99",
      image: "https://images.pexels.com/photos/374087/pexels-photo-374087.jpeg",
      description: "Portable speaker with HD sound.",
    },
    {
      name: "Smartphone Tripod",
      price: "15.00",
      image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg",
      description: "Compact tripod for phones with Bluetooth remote.",
    },
  ],
  Clothing: [
    {
      name: "Denim Jacket",
      price: "59.99",
      image: "https://images.pexels.com/photos/1366872/pexels-photo-1366872.jpeg",
      description: "Classic blue denim jacket for all seasons.",
    },
    {
      name: "Casual Hoodie",
      price: "34.99",
      image: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg",
      description: "Soft and cozy hoodie for daily wear.",
    },
    {
      name: "Graphic T-Shirt",
      price: "19.99",
      image: "https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg",
      description: "Trendy graphic tee with unisex design.",
    },
  ],
  Books: [
    {
      name: "Atomic Habits",
      price: "16.99",
      image: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg",
      description: "Best-selling book on building good habits.",
    },
    {
      name: "Deep Work",
      price: "14.50",
      image: "https://images-na.ssl-images-amazon.com/images/I/81qW97ndkvL.jpg",
      description: "A guide to focused success in a distracted world.",
    },
    {
      name: "The Alchemist",
      price: "12.99",
      image: "https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg",
      description: "Inspirational story about personal dreams.",
    },
  ],
  Kitchen: [
    {
      name: "Blender",
      price: "59.99",
      image: "https://m.media-amazon.com/images/I/417uBhwmWjL._AC_SL1500_.jpg",
      description: "Electric blender perfect for smoothies and sauces.",
    },
    {
      name: "Coffee Maker",
      price: "79.99",
      image: "https://m.media-amazon.com/images/I/81r0AHrP0-L._AC_SL1500_.jpg",
      description: "12-cup coffee machine with auto brew setting.",
    },
    {
      name: "Knife Set",
      price: "49.99",
      image: "https://m.media-amazon.com/images/I/61jNezjpYOL._AC_SL1500_.jpg",
      description: "Stainless steel knife set with wooden block.",
    },
  ],
  Toys: [
    {
      name: "Remote Control Car",
      price: "49.99",
      image: "https://m.media-amazon.com/images/I/81XCeTr-zlL._AC_SL1500_.jpg",
      description: "Fast off-road RC car with LED lights.",
    },
    {
      name: "Building Blocks Set",
      price: "29.99",
      image: "https://m.media-amazon.com/images/I/81nixaD2olL._AC_SL1500_.jpg",
      description: "Creative building block set for kids.",
    },
    {
      name: "Teddy Bear",
      price: "19.99",
      image: "https://static.vecteezy.com/system/resources/thumbnails/051/740/873/small_2x/teddy-bear-sitting-on-a-cot-in-a-pink-bedroom-for-baby-girl-photo.jpg",
      description: "Soft and cuddly teddy bear for all ages.",
    },
  ],
  Gadgets: [
    {
      name: "Portable Charger",
      price: "25.00",
      image: "https://media.wired.com/photos/6504b2a1afe02332db973557/master/w_960,c_limit/Ugreen_Power_Bank-SOURCE-Ugreen-Gear.jpg",
      description: "10000mAh power bank with fast charging.",
    },
    {
      name: "Smart Bulb",
      price: "15.99",
      image: "https://i.pcmag.com/imagery/reviews/02q84k4XLglSVUa6CsA2nWH-5..v1716393293.png",
      description: "Wi-Fi smart LED bulb controllable via app.",
    },
    {
      name: "VR Headset",
      price: "299.99",
      image: "https://images-cdn.ubuy.co.in/633b6838cd07b561033d0133-oculus-quest-all-in-one-vr-gaming.jpg",
      description: "Immersive virtual reality headset for gaming.",
    },
  ],
};

export async function seedProducts() {
  const productsRef = collection(db, "products");

  // Step 1: Clear existing products
  const existing = await getDocs(productsRef);
  await Promise.all(existing.docs.map((docSnap) => deleteDoc(doc(db, "products", docSnap.id))));

  // Step 2: Add new products with quantity
  for (const category in sampleData) {
    const items = sampleData[category];
    for (const item of items) {
      await addDoc(productsRef, {
        ...item,
        category,
        quantity: 30, // default stock quantity
      });
    }
  }

  alert("✅ Products seeded successfully with 6 categories!");
}
