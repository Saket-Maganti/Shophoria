import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const categoryImages = {
  Electronics: "https://images.pexels.com/photos/1054386/pexels-photo-1054386.jpeg",
  Clothing: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
  Books: "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg",
  Accessories: "https://images.pexels.com/photos/19090/pexels-photo.jpg",
  Home: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
  Kitchen: "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg",
  Toys: "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg",
  Gadgets: "https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg",
  Sports: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg",
};

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (cat) setCategory(cat);
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "products"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const allCategories = Object.keys(categoryImages);
  const featured = products.slice(0, 10);
  const filteredFeatured = search
    ? featured.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : featured;
  const filtered = products.filter(p => category === "all" || p.category === category);

  return (
    <div className="font-[Poppins] max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        className="h-[60vh] flex items-center justify-center rounded-xl overflow-hidden relative bg-cover bg-center shadow-lg"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/1476880/pexels-photo-1476880.jpeg')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome to Shophoria</h1>
          <p className="text-lg mb-6">Discover the best deals on your favorite products!</p>
          <a
            href="#categories"
            className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 transition text-white"
          >
            Shop Now
          </a>
        </div>
      </motion.div>

      {/* Search Bar */}
      <div className="my-8">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded shadow-sm"
        />
      </div>

      {/* Categories */}
      <div id="categories" className="mb-10">
        <h2 className="text-2xl font-bold mb-4">📁 Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {allCategories.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <CategoryCard
                title={cat}
                image={categoryImages[cat] || `https://source.unsplash.com/600x400/?${encodeURIComponent(cat)}`}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      {category !== "all" && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Showing results for "{category}"</h2>
            <button onClick={() => setCategory("all")} className="text-blue-600 text-sm hover:underline">
              Clear Filter
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Featured Section */}
      <div id="featured" className="mb-12">
        <h2 className="text-2xl font-bold mb-4">🔥 Featured Products</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        ) : filteredFeatured.length === 0 ? (
          <p className="text-gray-500">No featured products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {filteredFeatured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
