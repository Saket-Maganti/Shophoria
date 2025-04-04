import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const sampleData = {
  Electronics: [
    { name: "Noise-canceling Earbuds", price: 79.99, image: "https://m.media-amazon.com/images/I/51bRSWrEc7S._AC_SL1500_.jpg", description: "Wireless earbuds with active noise cancellation and long battery life." },
    { name: "Smartphone", price: 599.99, image: "https://m.media-amazon.com/images/I/71OYLm6srFL._AC_SL1500_.jpg", description: "Latest model smartphone with high-resolution display and multi-camera system." },
    { name: "Laptop", price: 1299.00, image: "https://m.media-amazon.com/images/I/71mnSfDGO9L._AC_SL1500_.jpg", description: "High-performance laptop suitable for work, gaming, and multimedia." },
    { name: "Smartwatch", price: 199.99, image: "https://m.media-amazon.com/images/I/71gg8mPlAuL._AC_SL1500_.jpg", description: "Modern smartwatch with fitness tracking and messaging notifications." },
    { name: "Digital Camera", price: 99.99, image: "https://m.media-amazon.com/images/I/71LTojwvtmL._AC_SL1500_.jpg", description: "Compact digital camera for capturing high-quality photos and videos." }
  ],
  Clothing: [
    { name: "Men's Graphic T-Shirt", price: 19.99, image: "https://m.media-amazon.com/images/I/51j-zR44-iL._AC_SL1500_.jpg", description: "100% cotton t-shirt with a cool graphic print on the front." },
    { name: "Denim Jeans", price: 49.99, image: "https://m.media-amazon.com/images/I/81vn7dwh8SL._AC_SL1500_.jpg", description: "Classic blue denim jeans with a comfortable straight fit." },
    { name: "Running Sneakers", price: 89.99, image: "https://m.media-amazon.com/images/I/91fOZ8wa55L._AC_SL1500_.jpg", description: "Lightweight running shoes designed for comfort and performance." },
    { name: "Hoodie", price: 39.99, image: "https://m.media-amazon.com/images/I/511Tlhfj9LL._AC_SL1500_.jpg", description: "Warm hooded sweatshirt made of soft fleece material." },
    { name: "Denim Jacket", price: 59.99, image: "https://m.media-amazon.com/images/I/71cQWYVtcBL._AC_SL1500_.jpg", description: "Stylish denim jacket that adds a classic layer to any outfit." }
  ],
  Books: [
    { name: "Atomic Habits", price: 16.99, image: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg", description: "Build better habits and transform your life with practical strategies." },
    { name: "Deep Work", price: 14.50, image: "https://images-na.ssl-images-amazon.com/images/I/81qW97ndkvL.jpg", description: "Achieve focused success in a distracted world." },
    { name: "The Alchemist", price: 12.99, image: "https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg", description: "A magical story about following your dreams." },
    { name: "Rich Dad Poor Dad", price: 10.99, image: "https://images-na.ssl-images-amazon.com/images/I/81bsw6fnUiL.jpg", description: "Personal finance book offering powerful lessons on wealth building." },
    { name: "Design Patterns", price: 29.99, image: "https://images-na.ssl-images-amazon.com/images/I/41uPjEenkFL._SX373_BO1,204,203,200_.jpg", description: "Software design best practices for object-oriented programming." }
  ],
  Accessories: [
    { name: "Leather Wallet", price: 24.99, image: "https://m.media-amazon.com/images/I/81Z3RijYzEL._AC_SL1500_.jpg", description: "Durable bifold wallet with multiple compartments." },
    { name: "Wrist Watch", price: 89.99, image: "https://m.media-amazon.com/images/I/61OvQlTZ-3L._AC_SL1500_.jpg", description: "Elegant wrist watch with analog display." },
    { name: "Sunglasses", price: 19.99, image: "https://m.media-amazon.com/images/I/71lFCdE0NoL._AC_SL1500_.jpg", description: "Stylish sunglasses with UV protection." },
    { name: "Canvas Belt", price: 14.99, image: "https://m.media-amazon.com/images/I/91VJvFxbldL._AC_SL1500_.jpg", description: "Classic canvas belt with adjustable fit." },
    { name: "Earrings Set", price: 22.00, image: "https://m.media-amazon.com/images/I/81hvTgOU9kL._AC_SL1500_.jpg", description: "Elegant earrings set suitable for any occasion." }
  ],
  Home: [
    { name: "Table Lamp", price: 45.00, image: "https://m.media-amazon.com/images/I/417uBhwmWjL._AC_SL1500_.jpg", description: "Modern bedside table lamp with soft ambient lighting." },
    { name: "Decorative Pillow Set", price: 20.00, image: "https://m.media-amazon.com/images/I/81s-m1+01QL._AC_SL1500_.jpg", description: "Set of cozy throw pillows to add comfort and style to your sofa." },
    { name: "Wall Clock", price: 29.99, image: "https://m.media-amazon.com/images/I/71gg8mPlAuL._AC_SL1500_.jpg", description: "Analog wall clock with easy-to-read numbers and silent movement." },
    { name: "Ceramic Vase", price: 25.00, image: "https://m.media-amazon.com/images/I/417uBhwmWjL._AC_SL1500_.jpg", description: "Elegant ceramic flower vase that complements any home décor." },
    { name: "Picture Frame Set", price: 14.99, image: "https://m.media-amazon.com/images/I/71mnSfDGO9L._AC_SL1500_.jpg", description: "Set of photo frames for displaying cherished memories on your wall or shelf." }
  ],
  Kitchen: [
    { name: "Blender", price: 59.99, image: "https://m.media-amazon.com/images/I/417uBhwmWjL._AC_SL1500_.jpg", description: "Electric blender with multiple speeds, perfect for smoothies and sauces." },
    { name: "Coffee Maker", price: 79.99, image: "https://m.media-amazon.com/images/I/8107-P9dC0L._AC_SL1500_.jpg", description: "Automatic drip coffee maker with a built-in timer and 12-cup carafe." },
    { name: "Kitchen Knife Set", price: 49.99, image: "https://m.media-amazon.com/images/I/61jNezjpYOL._AC_SL1500_.jpg", description: "Stainless steel kitchen knife set with a wooden block for storage." },
    { name: "Non-Stick Frying Pan", price: 29.99, image: "https://m.media-amazon.com/images/I/51Am6O-pXQL._AC_SL1500_.jpg", description: "Medium-sized non-stick frying pan for easy cooking and quick cleanup." },
    { name: "Cutting Board", price: 18.99, image: "https://m.media-amazon.com/images/I/71pbtQJK4SL._AC_SL1500_.jpg", description: "Bamboo cutting board that is gentle on knives and easy to maintain." }
  ],
  Toys: [
    { name: "Remote Control Car", price: 49.99, image: "https://m.media-amazon.com/images/I/81XCeTr-zlL._AC_SL1500_.jpg", description: "Fast off-road remote control car with rechargeable battery and LED lights." },
    { name: "Building Blocks Set", price: 29.99, image: "https://m.media-amazon.com/images/I/81nixaD2olL._AC_SL1500_.jpg", description: "Creative building blocks set to inspire kids to build and imagine." },
    { name: "Action Figure", price: 14.99, image: "https://m.media-amazon.com/images/I/71n-zmjOJfL._AC_SL1500_.jpg", description: "Collectible action figure with movable joints and detailed design." },
    { name: "Board Game", price: 24.99, image: "https://m.media-amazon.com/images/I/71Be68MU3DS._AC_SL1500_.jpg", description: "Fun family board game that supports 2-4 players with exciting challenges." },
    { name: "Teddy Bear", price: 19.99, image: "https://m.media-amazon.com/images/I/81s-m1+01QL._AC_SL1500_.jpg", description: "Soft and cuddly teddy bear plush toy, perfect for kids of all ages." }
  ],
  Gadgets: [
    { name: "Portable Charger", price: 25.00, image: "https://m.media-amazon.com/images/I/813y2+dPUOL._AC_SL1500_.jpg", description: "Compact 10000mAh power bank to charge your devices on the go." },
    { name: "Smart Light Bulb", price: 15.99, image: "https://m.media-amazon.com/images/I/81yduUsQD6L._AC_SL1500_.jpg", description: "Wi-Fi enabled smart LED bulb that you can control with a mobile app or voice assistant." },
    { name: "VR Headset", price: 299.99, image: "https://m.media-amazon.com/images/I/71OYLm6srFL._AC_SL1500_.jpg", description: "Virtual Reality headset that delivers an immersive gaming and entertainment experience." },
    { name: "Camera Drone", price: 99.99, image: "https://m.media-amazon.com/images/I/717wbS2RsCS._AC_SL1500_.jpg", description: "Quadcopter drone equipped with an HD camera for aerial photography." },
    { name: "Smart Speaker", price: 49.99, image: "https://m.media-amazon.com/images/I/51bRSWrEc7S._AC_SL1500_.jpg", description: "Voice-controlled smart speaker that can play music and answer questions." }
  ],
  Sports: [
    { name: "Basketball", price: 29.99, image: "https://m.media-amazon.com/images/I/71Be68MU3DS._AC_SL1500_.jpg", description: "Official size outdoor basketball with durable rubber cover." },
    { name: "Soccer Ball", price: 25.00, image: "https://m.media-amazon.com/images/I/81XCeTr-zlL._AC_SL1500_.jpg", description: "Regulation size soccer ball designed for training and recreational play." },
    { name: "Tennis Racket", price: 59.99, image: "https://m.media-amazon.com/images/I/51Am6O-pXQL._AC_SL1500_.jpg", description: "Lightweight tennis racket with comfortable grip for players of all levels." },
    { name: "Yoga Mat", price: 19.99, image: "https://m.media-amazon.com/images/I/81s-m1+01QL._AC_SL1500_.jpg", description: "Non-slip yoga mat that provides cushioning and stability for workouts." },
    { name: "Water Bottle", price: 9.99, image: "https://m.media-amazon.com/images/I/813y2+dPUOL._AC_SL1500_.jpg", description: "Insulated stainless steel water bottle keeps drinks cold or hot for hours." }
  ]
};

export async function seedProducts() {
  const productsRef = collection(db, "products");

  const existing = await getDocs(productsRef);
  for (const docSnap of existing.docs) {
    await deleteDoc(doc(db, "products", docSnap.id));
  }

  for (const category in sampleData) {
    for (const item of sampleData[category]) {
      await addDoc(productsRef, { ...item, category });
    }
  }

  alert("✅ Seeded 9 categories with 5 products each!");
}
