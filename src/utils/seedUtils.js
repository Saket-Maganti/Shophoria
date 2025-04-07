import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const sampleData = {
  Electronics: [
    { name: "Noise-canceling Earbuds", price: 79.99, image: "https://m.media-amazon.com/images/I/51bRSWrEc7S._AC_SL1500_.jpg", description: "Wireless earbuds with active noise cancellation and long battery life." },
    { name: "Smartphone", price: 599.99, image: "https://cdn.thewirecutter.com/wp-content/media/2024/05/smartphone-2048px-1013.jpg", description: "Latest model smartphone with high-resolution display and multi-camera system." },
    { name: "Laptop", price: 1299.00, image: "https://m.media-amazon.com/images/I/71mnSfDGO9L._AC_SL1500_.jpg", description: "High-performance laptop suitable for work, gaming, and multimedia." },
  ],
  Clothing: [
    { name: "Running Sneakers", price: 89.99, image: "https://cdn.thewirecutter.com/wp-content/media/2024/05/white-sneaker-2048px-9320.jpg?auto=webp&quality=75&crop=1.91:1&width=1200", description: "Lightweight running shoes designed for comfort and performance." },
    { name: "Hoodie", price: 39.99, image: "https://m.media-amazon.com/images/I/511Tlhfj9LL._AC_SL1500_.jpg", description: "Warm hooded sweatshirt made of soft fleece material." },
    { name: "Denim Jacket", price: 59.99, image: "https://hips.hearstapps.com/hmg-prod/images/oversized-jean-jackets-64db983d19851.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*", description: "Stylish denim jacket that adds a classic layer to any outfit." }
  ],
  Books: [
    { name: "Atomic Habits", price: 16.99, image: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg", description: "Build better habits and transform your life with practical strategies." },
    { name: "Deep Work", price: 14.50, image: "https://images-na.ssl-images-amazon.com/images/I/81qW97ndkvL.jpg", description: "Achieve focused success in a distracted world." },
    { name: "The Alchemist", price: 12.99, image: "https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg", description: "A magical story about following your dreams." },
  ],
  Kitchen: [
    { name: "Blender", price: 59.99, image: "https://m.media-amazon.com/images/I/417uBhwmWjL._AC_SL1500_.jpg", description: "Electric blender with multiple speeds, perfect for smoothies and sauces." },
    { name: "Coffee Maker", price: 79.99, image: "https://www.seriouseats.com/thmb/K5edFKUsDL2nZexA4BBC90l88Xk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/sea-product-breville-bambino-plus-espresso-machine-nsimpson-1095-fca4b3eb18524cb384f2e3b8373e7a44.jpeg", description: "Automatic drip coffee maker with a built-in timer and 12-cup carafe." },
    { name: "Kitchen Knife Set", price: 49.99, image: "https://m.media-amazon.com/images/I/61jNezjpYOL._AC_SL1500_.jpg", description: "Stainless steel kitchen knife set with a wooden block for storage." },
  ],
  Toys: [
    { name: "Remote Control Car", price: 49.99, image: "https://m.media-amazon.com/images/I/81XCeTr-zlL._AC_SL1500_.jpg", description: "Fast off-road remote control car with rechargeable battery and LED lights." },
    { name: "Building Blocks Set", price: 29.99, image: "https://m.media-amazon.com/images/I/81nixaD2olL._AC_SL1500_.jpg", description: "Creative building blocks set to inspire kids to build and imagine." },
    { name: "Teddy Bear", price: 19.99, image: "https://static.vecteezy.com/system/resources/thumbnails/051/740/873/small_2x/teddy-bear-sitting-on-a-cot-in-a-pink-bedroom-for-baby-girl-photo.jpg", description: "Soft and cuddly teddy bear plush toy, perfect for kids of all ages." }
  ],
  Gadgets: [
    { name: "Portable Charger", price: 25.00, image: "https://media.wired.com/photos/6504b2a1afe02332db973557/master/w_960,c_limit/Ugreen_Power_Bank-SOURCE-Ugreen-Gear.jpg", description: "Compact 10000mAh power bank to charge your devices on the go." },
    { name: "Smart Light Bulb", price: 15.99, image: "https://i.pcmag.com/imagery/reviews/02q84k4XLglSVUa6CsA2nWH-5..v1716393293.png", description: "Wi-Fi enabled smart LED bulb that you can control with a mobile app or voice assistant." },
    { name: "VR Headset", price: 299.99, image: "https://images-cdn.ubuy.co.in/633b6838cd07b561033d0133-oculus-quest-all-in-one-vr-gaming.jpg", description: "Virtual Reality headset that delivers an immersive gaming and entertainment experience." },
  ],
};

export async function seedProducts() {
  const productsRef = collection(db, "products");

  const existing = await getDocs(productsRef);
  for (const docSnap of existing.docs) {
    await deleteDoc(doc(db, "products", docSnap.id));
  }

  for (const category in sampleData) {
    for (const item of sampleData[category]) {
      await addDoc(productsRef, {
        ...item,
        category,
        quantity: 20, // ✅ Set default quantity
      });
    }
  }

  alert("✅ Seeded 6 categories with 3 products each including quantity!");
}
