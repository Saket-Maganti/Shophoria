import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const sampleData = {
  Electronics: [
    { name: "Wireless Earbuds", price: "49.99", image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg", description: "Noise-canceling wireless earbuds with long battery life." },
    { name: "Bluetooth Speaker", price: "29.99", image: "https://images.pexels.com/photos/374087/pexels-photo-374087.jpeg", description: "Portable speaker with HD sound." },
    { name: "Smartphone Tripod", price: "15.00", image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg", description: "Compact tripod with Bluetooth remote." },
    { name: "USB-C Power Bank", price: "39.99", image: "https://images.pexels.com/photos/3945677/pexels-photo-3945677.jpeg", description: "10,000mAh fast charging power bank." },
    { name: "4K Action Camera", price: "89.99", image: "https://images.pexels.com/photos/2703489/pexels-photo-2703489.jpeg", description: "Waterproof action cam for adventures." },
  ],
  Clothing: [
    { name: "Denim Jacket", price: "59.99", image: "https://images.pexels.com/photos/1366872/pexels-photo-1366872.jpeg", description: "Classic blue denim jacket for all seasons." },
    { name: "Casual Hoodie", price: "34.99", image: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg", description: "Soft and cozy hoodie for daily wear." },
    { name: "Graphic T-Shirt", price: "19.99", image: "https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg", description: "Trendy graphic tee with unisex design." },
    { name: "Slim Fit Jeans", price: "49.99", image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg", description: "Stylish jeans with comfortable stretch." },
    { name: "Running Shorts", price: "25.00", image: "https://images.pexels.com/photos/39853/woman-girl-eye-model-39853.jpeg", description: "Breathable and lightweight running shorts." },
  ],
  Books: [
    { name: "Atomic Habits", price: "16.99", image: "https://images.pexels.com/photos/159711/books-159711.jpeg", description: "Best-selling book on building good habits." },
    { name: "Deep Work", price: "14.50", image: "https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg", description: "Guide to focused success in a distracted world." },
    { name: "The Alchemist", price: "12.99", image: "https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg", description: "Inspirational story about personal dreams." },
    { name: "Rich Dad Poor Dad", price: "10.99", image: "https://images.pexels.com/photos/48604/book-read-pocket-book-paperback-48604.jpeg", description: "Personal finance classic for beginners." },
    { name: "Design Patterns", price: "29.99", image: "https://images.pexels.com/photos/205316/pexels-photo-205316.jpeg", description: "Object-oriented design patterns in software." },
  ],
  Accessories: [
    { name: "Leather Wallet", price: "24.99", image: "https://images.pexels.com/photos/179885/pexels-photo-179885.jpeg", description: "Classic leather wallet with card slots." },
    { name: "Wrist Watch", price: "89.99", image: "https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg", description: "Stylish analog watch with leather strap." },
    { name: "Sunglasses", price: "19.99", image: "https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg", description: "UV protection sunglasses for sunny days." },
    { name: "Canvas Belt", price: "14.99", image: "https://images.pexels.com/photos/883531/pexels-photo-883531.jpeg", description: "Adjustable canvas belt for jeans or cargo pants." },
    { name: "Earrings Set", price: "22.00", image: "https://images.pexels.com/photos/1191530/pexels-photo-1191530.jpeg", description: "Elegant earring set for women." },
  ],
  Home: [
    { name: "LED Lamp", price: "18.99", image: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg", description: "Modern LED lamp for home decor." },
    { name: "Wall Clock", price: "22.99", image: "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg", description: "Minimalist wall clock for interiors." },
    { name: "Indoor Plant", price: "15.99", image: "https://images.pexels.com/photos/450326/pexels-photo-450326.jpeg", description: "Small pot plant for home freshness." },
    { name: "Cushion Cover Set", price: "19.00", image: "https://images.pexels.com/photos/276671/pexels-photo-276671.jpeg", description: "Colorful cushion covers to liven up living space." },
    { name: "Wall Art Poster", price: "12.99", image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg", description: "Inspirational framed poster for walls." },
  ],
  Kitchen: [
    { name: "Non-Stick Fry Pan", price: "27.99", image: "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg", description: "Easy to clean non-stick fry pan." },
    { name: "Knife Set", price: "39.99", image: "https://images.pexels.com/photos/1478475/pexels-photo-1478475.jpeg", description: "Professional stainless steel kitchen knives." },
    { name: "Glass Storage Jars", price: "21.50", image: "https://images.pexels.com/photos/208861/pexels-photo-208861.jpeg", description: "Airtight glass containers for kitchen storage." },
    { name: "Blender", price: "49.99", image: "https://images.pexels.com/photos/3738738/pexels-photo-3738738.jpeg", description: "Powerful blender for smoothies and shakes." },
    { name: "Wooden Cutting Board", price: "14.99", image: "https://images.pexels.com/photos/4109235/pexels-photo-4109235.jpeg", description: "Durable cutting board made of hardwood." },
  ],
  Furniture: [
    { name: "Coffee Table", price: "129.99", image: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg", description: "Wooden center coffee table for living room." },
    { name: "Study Desk", price: "179.00", image: "https://images.pexels.com/photos/245208/pexels-photo-245208.jpeg", description: "Compact wooden desk for study or work." },
    { name: "Office Chair", price: "149.99", image: "https://images.pexels.com/photos/205316/pexels-photo-205316.jpeg", description: "Ergonomic mesh office chair with lumbar support." },
    { name: "Bookshelf", price: "119.00", image: "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg", description: "Open-style bookshelf for home office." },
    { name: "Shoe Rack", price: "59.99", image: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg", description: "Space-saving shoe rack with multiple tiers." },
  ],
  Toys: [
    { name: "Building Blocks Set", price: "24.99", image: "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg", description: "Colorful interlocking blocks for kids." },
    { name: "Remote Control Car", price: "45.00", image: "https://images.pexels.com/photos/163743/pexels-photo-163743.jpeg", description: "High-speed RC car with rechargeable battery." },
    { name: "Stuffed Bear Toy", price: "19.99", image: "https://images.pexels.com/photos/459196/pexels-photo-459196.jpeg", description: "Soft and cuddly teddy bear toy." },
    { name: "Toy Kitchen Set", price: "29.50", image: "https://images.pexels.com/photos/3661353/pexels-photo-3661353.jpeg", description: "Miniature kitchen play set for pretend play." },
    { name: "Educational Puzzle", price: "14.75", image: "https://images.pexels.com/photos/1326944/pexels-photo-1326944.jpeg", description: "Brain-boosting educational puzzle for kids." },
  ],
  Gadgets: [
    { name: "Smartwatch", price: "89.99", image: "https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg", description: "Fitness tracker smartwatch with health monitor." },
    { name: "Wireless Charger", price: "25.00", image: "https://images.pexels.com/photos/845451/pexels-photo-845451.jpeg", description: "Fast wireless charging pad for phones." },
    { name: "Mini Projector", price: "99.99", image: "https://images.pexels.com/photos/5864144/pexels-photo-5864144.jpeg", description: "Portable mini projector for movies and games." },
    { name: "Smart Light Bulb", price: "15.99", image: "https://images.pexels.com/photos/577514/pexels-photo-577514.jpeg", description: "Voice-controlled color-changing LED bulb." },
    { name: "Bluetooth Tracker", price: "19.99", image: "https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg", description: "Key and wallet Bluetooth item finder." },
  ],
  Shoes: [
    { name: "Running Shoes", price: "69.99", image: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg", description: "Lightweight running shoes with cushioning." },
    { name: "Sneakers", price: "59.99", image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg", description: "Trendy white sneakers for daily wear." },
    { name: "Loafers", price: "45.00", image: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg", description: "Formal leather loafers for office wear." },
    { name: "Sandals", price: "25.99", image: "https://images.pexels.com/photos/19090/pexels-photo.jpg", description: "Comfortable sandals for summer." },
    { name: "Boots", price: "79.00", image: "https://images.pexels.com/photos/707915/pexels-photo-707915.jpeg", description: "Durable boots for hiking and outdoor use." },
  ],
  Beauty: [
    { name: "Facial Cleanser", price: "12.99", image: "https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg", description: "Gentle foaming cleanser for sensitive skin." },
    { name: "Lipstick Set", price: "19.99", image: "https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg", description: "Matte lipstick set in multiple shades." },
    { name: "Compact Mirror", price: "7.99", image: "https://images.pexels.com/photos/256298/pexels-photo-256298.jpeg", description: "Travel-size compact makeup mirror." },
    { name: "Makeup Brushes", price: "22.50", image: "https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg", description: "Professional makeup brush set." },
    { name: "Moisturizer Cream", price: "15.00", image: "https://images.pexels.com/photos/3736398/pexels-photo-3736398.jpeg", description: "Hydrating cream for day and night use." },
  ],
  Sports: [
    { name: "Football", price: "29.99", image: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg", description: "Official size outdoor football." },
    { name: "Yoga Mat", price: "19.99", image: "https://images.pexels.com/photos/3756523/pexels-photo-3756523.jpeg", description: "Non-slip yoga mat for indoor fitness." },
    { name: "Dumbbells", price: "39.99", image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg", description: "Set of two dumbbells for home workouts." },
    { name: "Skipping Rope", price: "9.99", image: "https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg", description: "Adjustable speed skipping rope." },
    { name: "Tennis Racket", price: "49.99", image: "https://images.pexels.com/photos/1202721/pexels-photo-1202721.jpeg", description: "Lightweight racket for beginner players." },
  ],
  Stationery: [
    { name: "Notebook Pack", price: "11.99", image: "https://images.pexels.com/photos/207665/pexels-photo-207665.jpeg", description: "Pack of 3 ruled notebooks." },
    { name: "Gel Pens", price: "9.99", image: "https://images.pexels.com/photos/159751/still-life-school-study-learn-159751.jpeg", description: "Smooth writing colorful gel pens." },
    { name: "Sticky Notes", price: "6.50", image: "https://images.pexels.com/photos/301943/pexels-photo-301943.jpeg", description: "Bright sticky notes in various sizes." },
    { name: "Desk Organizer", price: "17.99", image: "https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg", description: "Keep your stationery neat and tidy." },
    { name: "Highlighters Set", price: "8.99", image: "https://images.pexels.com/photos/159872/paper-note-pencil-highlighter-159872.jpeg", description: "Fluorescent highlighters in 5 colors." },
  ],
  Outdoors: [
    { name: "Camping Tent", price: "99.99", image: "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg", description: "2-person waterproof camping tent." },
    { name: "Sleeping Bag", price: "49.99", image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg", description: "All-weather sleeping bag for backpacking." },
    { name: "Hiking Backpack", price: "59.99", image: "https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg", description: "Large capacity backpack with support straps." },
    { name: "Camping Stove", price: "35.00", image: "https://images.pexels.com/photos/1660632/pexels-photo-1660632.jpeg", description: "Portable propane stove for camping meals." },
    { name: "LED Headlamp", price: "14.99", image: "https://images.pexels.com/photos/752810/pexels-photo-752810.jpeg", description: "Hands-free lighting for night hikes." },
  ],
  Travel: [
    { name: "Travel Pillow", price: "14.99", image: "https://images.pexels.com/photos/115655/pexels-photo-115655.jpeg", description: "Memory foam travel neck pillow." },
    { name: "Luggage Set", price: "159.99", image: "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg", description: "3-piece luggage set with spinner wheels." },
    { name: "Passport Holder", price: "9.99", image: "https://images.pexels.com/photos/297755/pexels-photo-297755.jpeg", description: "Leather holder for travel documents." },
    { name: "Packing Cubes", price: "24.99", image: "https://images.pexels.com/photos/273022/pexels-photo-273022.jpeg", description: "Organize your suitcase efficiently." },
    { name: "Portable Luggage Scale", price: "12.50", image: "https://images.pexels.com/photos/24320/pexels-photo.jpg", description: "Avoid overpacking fees with this scale." },
  ]
};

export async function seedProducts() {
  const productsRef = collection(db, "products");

  const existing = await getDocs(productsRef);
  for (const docSnap of existing.docs) {
    await deleteDoc(doc(db, "products", docSnap.id));
  }

  for (const category in sampleData) {
    const items = sampleData[category];
    for (const item of items) {
      await addDoc(productsRef, {
        ...item,
        category,
      });
    }
  }

  alert("🔥 Products reset and seeded successfully!");
}