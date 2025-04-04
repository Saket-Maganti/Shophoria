import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";

const StatCard = ({ title, value }) => (
  <div className="bg-white shadow p-4 rounded border dark:bg-gray-800 dark:border-gray-700">
    <p className="text-gray-600 dark:text-gray-300">{title}</p>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{value}</h3>
  </div>
);

const ProductForm = ({ form, onChange, onSubmit, editId }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input name="name" value={form.name} onChange={onChange} placeholder="Product Name" className="border p-2 rounded" />
      <input name="price" value={form.price} onChange={onChange} placeholder="Price" className="border p-2 rounded" />
      <input name="image" value={form.image} onChange={onChange} placeholder="Image URL (optional)" className="border p-2 rounded" />
      <input name="category" value={form.category} onChange={onChange} placeholder="Category" className="border p-2 rounded" />
    </div>
    <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="w-full border p-2 rounded" />
    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
      {editId ? "Update Product" : "Add Product"}
    </button>
  </form>
);

const ProductGrid = ({ products, onEdit, onDelete }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {products.map(product => (
      <div key={product.id} className="border p-4 rounded shadow bg-white dark:bg-gray-800">
        <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded mb-2" />
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{product.name}</h3>
        <p className="text-gray-700 dark:text-gray-300">${product.price} | {product.category}</p>
        <div className="flex gap-2 mt-2">
          <button onClick={() => onEdit(product)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
          <button onClick={() => onDelete(product.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
        </div>
      </div>
    ))}
  </div>
);

const ReviewList = ({ reviews, onDelete }) => (
  <div className="bg-white dark:bg-gray-800 border rounded shadow p-4 dark:border-gray-700">
    {reviews.length === 0 ? (
      <p className="text-gray-500 dark:text-gray-400">No reviews found.</p>
    ) : (
      <ul className="space-y-4">
        {reviews.map((review) => (
          <li key={review.id} className="border-b pb-2 border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300"><strong>User:</strong> {review.userName}</p>
            <p className="text-gray-700 dark:text-gray-300"><strong>Product ID:</strong> {review.productId}</p>
            <p className="text-yellow-500">⭐ {review.rating}</p>
            <p className="text-gray-600 dark:text-gray-400">{review.text}</p>
            <button onClick={() => onDelete(review.id)} className="text-red-600 hover:underline text-sm mt-1">Delete</button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const Charts = ({ productCategoryData, orderDateData, COLORS }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white dark:bg-gray-800 shadow p-4 rounded border dark:border-gray-700">
      <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">🛍️ Products by Category</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={productCategoryData} dataKey="value" nameKey="name" outerRadius={80}>
            {productCategoryData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div className="bg-white dark:bg-gray-800 shadow p-4 rounded border dark:border-gray-700">
      <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">📅 Orders Over Time</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={orderDateData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const OrderSection = ({ orders, onStatusUpdate, onDownloadCSV, onDownloadPDF }) => (
  <div>
    <div className="flex gap-4 mb-4">
      <button onClick={onDownloadCSV} className="bg-blue-600 text-white px-4 py-2 rounded">⬇️ Download CSV</button>
      <button onClick={onDownloadPDF} className="bg-purple-600 text-white px-4 py-2 rounded">🧾 Export PDF</button>
    </div>
    <div id="order-report-pdf" className="space-y-4">
      {orders.map(order => (
        <div key={order.id} className="border rounded p-4 bg-white shadow dark:bg-gray-800">
          <p className="text-gray-700 dark:text-gray-300"><strong>Order ID:</strong> {order.id}</p>
          <p className="text-gray-600 dark:text-gray-400">Email: {order.email}</p>
          <p className="text-gray-600 dark:text-gray-400">Total: ${parseFloat(order.total || 0).toFixed(2)}</p>
          <p className="text-gray-600 dark:text-gray-400">Status: {order.status || "pending"}</p>
          <label className="block mt-2 text-gray-700 dark:text-gray-300">Update Status:</label>
          <select
            value={order.status || "pending"}
            onChange={(e) => onStatusUpdate(order.id, e.target.value)}
            className="border p-2 rounded w-full mt-1"
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      ))}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", image: "", category: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [search] = useState("");
  const [productPage] = useState(1);
  const [orderPage] = useState(1);
  const itemsPerPage = 5;

  const fetchStats = async () => {
    const productsSnap = await getDocs(collection(db, "products"));
    setProducts(productsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    const ordersSnap = await getDocs(collection(db, "orders"));
    setOrders(ordersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    const usersSnap = await getDocs(collection(db, "users"));
    setUserCount(usersSnap.size);
    const reviewsSnap = await getDocs(collection(db, "reviews"));
    setReviews(reviewsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchStats(); }, []);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    await deleteDoc(doc(db, "reviews", reviewId));
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    alert("Review deleted successfully.");
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const q = query(collection(db, "products"), where("name", "==", form.name));
    const exists = await getDocs(q);
    if (!exists.empty && !editId) return alert("Product already exists.");
    const updatedForm = {
      ...form,
      image: form.image || `https://source.unsplash.com/300x200/?${encodeURIComponent(form.name || "product")}`,
    };
    if (editId) {
      await updateDoc(doc(db, "products", editId), updatedForm);
      setEditId(null);
    } else {
      await addDoc(collection(db, "products"), updatedForm);
    }
    setForm({ name: "", price: "", image: "", category: "", description: "" });
    fetchStats();
  };

  const handleEdit = (product) => { setForm(product); setEditId(product.id); };
  const handleDelete = async (id) => { if (window.confirm("Delete this product?")) { await deleteDoc(doc(db, "products", id)); fetchStats(); } };
  const handleStatusUpdate = async (orderId, newStatus) => { await updateDoc(doc(db, "orders", orderId), { status: newStatus }); fetchStats(); };
  const handleDownloadCSV = () => {
    const csv = ["Order ID,Email,Total,Status", ...orders.map((o) => `${o.id},${o.email},${o.total},${o.status || "pending"}`)].join("\n");
    saveAs(new Blob([csv], { type: "text/csv;charset=utf-8;" }), "orders.csv");
  };
  const handleDownloadPDF = () => {
    const content = document.getElementById("order-report-pdf");
    html2pdf().set({ margin: 0.5, filename: "order-report.pdf", image: { type: "jpeg", quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: "in", format: "letter", orientation: "portrait" } }).from(content).save();
  };

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];
  const productCategoryData = Object.values(products.reduce((acc, curr) => { acc[curr.category] = acc[curr.category] || { name: curr.category, value: 0 }; acc[curr.category].value++; return acc; }, {}));
  const orderDateData = orders.reduce((acc, order) => { const date = order.createdAt?.toDate().toISOString().split("T")[0]; if (!date) return acc; const existing = acc.find((d) => d.date === date); existing ? existing.count++ : acc.push({ date, count: 1 }); return acc; }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const paginatedProducts = filteredProducts.slice((productPage - 1) * itemsPerPage, productPage * itemsPerPage);
  const paginatedOrders = orders.slice((orderPage - 1) * itemsPerPage, orderPage * itemsPerPage);

  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(prev => prev === section ? null : section);
  };

  return (
    <div className="p-6 space-y-6">
      <section><h2 onClick={() => toggleSection('stats')} className="text-2xl font-bold text-indigo-600 border-b pb-2 mb-4 cursor-pointer">📊 Statistics Overview</h2>{activeSection === 'stats' && (<div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><StatCard title="Total Users" value={userCount} /><StatCard title="Total Orders" value={orders.length} /><StatCard title="Total Products" value={products.length} /></div>)}</section>
      <section><h2 onClick={() => toggleSection('form')} className="text-2xl font-bold text-green-600 border-b pb-2 mb-4 cursor-pointer">🛒 Add / Update Product</h2>{activeSection === 'form' && (<ProductForm form={form} onChange={handleChange} onSubmit={handleSubmit} editId={editId} />)}</section>
      <section><h2 onClick={() => toggleSection('products')} className="text-2xl font-bold text-blue-600 border-b pb-2 mb-4 cursor-pointer">📦 Manage Products</h2>{activeSection === 'products' && (<ProductGrid products={paginatedProducts} onEdit={handleEdit} onDelete={handleDelete} />)}</section>
      <section><h2 onClick={() => toggleSection('reviews')} className="text-2xl font-bold text-yellow-600 border-b pb-2 mb-4 cursor-pointer">📝 Review Management</h2>{activeSection === 'reviews' && (<ReviewList reviews={reviews} onDelete={handleDeleteReview} />)}</section>
      <section><h2 onClick={() => toggleSection('charts')} className="text-2xl font-bold text-purple-600 border-b pb-2 mb-4 cursor-pointer">📈 Sales Insights</h2>{activeSection === 'charts' && (<Charts productCategoryData={productCategoryData} orderDateData={orderDateData} COLORS={COLORS} />)}</section>
      <section><h2 onClick={() => toggleSection('orders')} className="text-2xl font-bold text-red-600 border-b pb-2 mb-4 cursor-pointer">🚚 Order Management</h2>{activeSection === 'orders' && (<OrderSection orders={paginatedOrders} onStatusUpdate={handleStatusUpdate} onDownloadCSV={handleDownloadCSV} onDownloadPDF={handleDownloadPDF} />)}</section>
    </div>
  );
};

export default AdminDashboard;
