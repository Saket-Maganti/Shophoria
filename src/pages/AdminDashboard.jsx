import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
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
import { seedProducts } from "../utils/seedUtils";

// Reusable Stat Card
const StatCard = ({ title, value, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white shadow-lg p-6 rounded-lg border dark:bg-gray-800 dark:border-gray-700 hover:shadow-xl transition-shadow ${onClick ? "cursor-pointer" : ""}`}
  >
    <p className="text-gray-600 dark:text-gray-300">{title}</p>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
  </div>
);

// User List Component
const UserList = ({ users }) => (
  <div className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-6 mt-6">
    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Registered Users</h3>
    {users.length === 0 ? (
      <p className="text-gray-500 dark:text-gray-400">No users found.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-gray-600">
              <th className="p-3 text-gray-700 dark:text-gray-300">Name</th>
              <th className="p-3 text-gray-700 dark:text-gray-300">Email</th>
              <th className="p-3 text-gray-700 dark:text-gray-300">Registered On</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3 text-gray-900 dark:text-white">{user.name || "N/A"}</td>
                <td className="p-3 text-gray-900 dark:text-white">{user.email}</td>
                <td className="p-3 text-gray-900 dark:text-white">
                  {user.createdAt ? new Date(user.createdAt.toDate()).toLocaleString() : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

// Add Product Form + Seed Button with Quantity
const ProductForm = ({ form, onChange, onSubmit, onSeed }) => (
  <form onSubmit={onSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input name="name" value={form.name} onChange={onChange} placeholder="Product Name" className="border p-3 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-green-500" />
      <input name="price" value={form.price} onChange={onChange} placeholder="Price" className="border p-3 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-green-500" />
      <input name="image" value={form.image} onChange={onChange} placeholder="Image URL (optional)" className="border p-3 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-green-500" />
      <input name="category" value={form.category} onChange={onChange} placeholder="Category" className="border p-3 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-green-500" />
      <input name="quantity" value={form.quantity} onChange={onChange} placeholder="Quantity" className="border p-3 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-green-500" />
    </div>
    <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="w-full border p-3 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-green-500" />
    <div className="flex gap-4">
      <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">Add Product</button>
      <button type="button" onClick={onSeed} className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">🔁 Reseed Products</button>
    </div>
  </form>
);

// Inline Form for Editing with Quantity
const InlineEditForm = ({ form, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-4 mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
    <input name="name" value={form.name} onChange={onChange} placeholder="Product Name" className="w-full border p-3 rounded-lg dark:bg-gray-600 dark:text-white dark:border-gray-500 focus:ring-2 focus:ring-blue-500" />
    <input name="price" value={form.price} onChange={onChange} placeholder="Price" className="w-full border p-3 rounded-lg dark:bg-gray-600 dark:text-white dark:border-gray-500 focus:ring-2 focus:ring-blue-500" />
    <input name="image" value={form.image} onChange={onChange} placeholder="Image URL" className="w-full border p-3 rounded-lg dark:bg-gray-600 dark:text-white dark:border-gray-500 focus:ring-2 focus:ring-blue-500" />
    <input name="category" value={form.category} onChange={onChange} placeholder="Category" className="w-full border p-3 rounded-lg dark:bg-gray-600 dark:text-white dark:border-gray-500 focus:ring-2 focus:ring-blue-500" />
    <input name="quantity" value={form.quantity} onChange={onChange} placeholder="Quantity" className="w-full border p-3 rounded-lg dark:bg-gray-600 dark:text-white dark:border-gray-500 focus:ring-2 focus:ring-blue-500" />
    <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="w-full border p-3 rounded-lg dark:bg-gray-600 dark:text-white dark:border-gray-500 focus:ring-2 focus:ring-blue-500" />
    <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">Save Changes</button>
  </form>
);

// Modified ProductGrid Component
const ProductGrid = ({ products, onEdit, onDelete, editId, editForm, onEditChange, onEditSubmit }) => {
  const groupedProducts = products.reduce((acc, product) => {
    acc[product.category] = acc[product.category] || [];
    acc[product.category].push(product);
    return acc;
  }, {});

  const sortedCategories = Object.keys(groupedProducts).sort();
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="space-y-6">
      {/* Category List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sortedCategories.map(category => (
            <div
              key={category}
              onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedCategory === category 
                  ? 'bg-blue-100 dark:bg-blue-900 border-blue-500' 
                  : 'bg-gray-50 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {category} ({groupedProducts[category].length})
              </h4>
            </div>
          ))}
          {sortedCategories.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 col-span-full">No categories found.</p>
          )}
        </div>
      </div>

      {/* Products under Selected Category */}
      {selectedCategory && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Products in {selectedCategory}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groupedProducts[selectedCategory].map(product => (
              <div key={product.id} className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 hover:shadow-md transition-shadow">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-40 object-cover rounded-lg mb-4" 
                  loading="lazy" 
                  onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found'}
                />
                <h4 className="font-bold text-lg text-gray-900 dark:text-white">{product.name}</h4>
                <p className="text-gray-700 dark:text-gray-300">${product.price}</p>
                <p className="text-sm text-red-600 dark:text-red-400">Quantity: {product.quantity ?? 0}</p>
                <div className="flex gap-3 mt-3">
                  <button 
                    onClick={() => onEdit(product)} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDelete(product.id)} 
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
                {editId === product.id && (
                  <InlineEditForm 
                    form={editForm} 
                    onChange={onEditChange} 
                    onSubmit={onEditSubmit} 
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Charts Section
const Charts = ({ productCategoryData, orderDateData, COLORS }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg border dark:border-gray-700">
      <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">🛍️ Products by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={productCategoryData} dataKey="value" nameKey="name" outerRadius={100}>
            {productCategoryData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg border dark:border-gray-700">
      <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">📅 Orders Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
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

// Reviews Section
const ReviewList = ({ reviews, onDelete }) => (
  <div className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-6 dark:border-gray-700">
    {reviews.length === 0 ? (
      <p className="text-gray-500 dark:text-gray-400">No reviews found.</p>
    ) : (
      <ul className="space-y-6">
        {reviews.map((review) => (
          <li key={review.id} className="border-b pb-4 border-gray-200 dark:border-gray-600">
            <p className="text-gray-700 dark:text-gray-300"><strong>User:</strong> {review.userName}</p>
            <p className="text-gray-700 dark:text-gray-300"><strong>Product ID:</strong> {review.productId}</p>
            <p className="text-yellow-500">⭐ {review.rating}</p>
            <p className="text-gray-600 dark:text-gray-400">{review.text}</p>
            <button onClick={() => onDelete(review.id)} className="text-red-600 hover:underline text-sm mt-2">Delete</button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

// Orders Section
const OrderSection = ({ orders, onStatusUpdate, onDownloadCSV, onDownloadPDF }) => (
  <div>
    <div className="flex gap-4 mb-6">
      <button onClick={onDownloadCSV} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">⬇️ Download CSV</button>
      <button onClick={onDownloadPDF} className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">🧾 Export PDF</button>
    </div>
    <div id="order-report-pdf" className="space-y-6">
      {orders.map(order => (
        <div key={order.id} className="border rounded-lg p-6 bg-white shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300"><strong>Order ID:</strong> {order.id}</p>
          <p className="text-gray-600 dark:text-gray-400">Email: {order.email}</p>
          <p className="text-gray-600 dark:text-gray-400">Total: ${parseFloat(order.total || 0).toFixed(2)}</p>
          <p className="text-gray-600 dark:text-gray-400">Status: {order.status || "pending"}</p>
          <label className="block mt-3 text-gray-700 dark:text-gray-300">Update Status:</label>
          <select value={order.status || "pending"} onChange={(e) => onStatusUpdate(order.id, e.target.value)} className="border p-3 rounded-lg w-full mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-red-500">
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

// Modified RewardsSection with Detailed Coupon Form
const RewardsSection = ({
  globalCoupons,
  users,
  selectedUser,
  userCoupons,
  form,
  setForm,
  editingId,
  setEditingId,
  fetchGlobalCoupons,
  fetchUserCoupons,
  handleSubmit,
  handleDeleteCoupon,
  handleAssignToAll,
  handleAssignToUser,
  handleDeleteUserCoupon,
}) => (
  <div className="space-y-8">
    {/* Global Coupons */}
    <div className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-6 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">🎫 Global Coupons</h3>
      {globalCoupons.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No global coupons yet.</p>
      ) : (
        <ul className="space-y-4">
          {globalCoupons.map((coupon) => (
            <li key={coupon.id} className="border p-4 rounded-lg flex justify-between items-center dark:border-gray-600 hover:shadow-md transition-shadow">
              <div>
                <p className="text-gray-800 dark:text-white font-semibold">
                  {coupon.code} ({coupon.type} - {coupon.amount})
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Min: ${coupon.minOrder} | Expires: {coupon.expiresAt}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setForm(coupon); setEditingId(coupon.id); }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCoupon(coupon.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleAssignToAll(coupon)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Assign to All
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Enhanced Add/Edit Coupon Form */}
    <div className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-6 dark:border-gray-700">
      <h4 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
        ➕ {editingId ? "Edit Existing Coupon" : "Add New Coupon"}
      </h4>
      <div className="mb-6">
        <p className="text-gray-700 dark:text-gray-300">
          Create or edit coupons to offer discounts to your customers. Fill in the details below:
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 mt-2">
          <li><strong>Code:</strong> Unique code customers will use (e.g., "SAVE10")</li>
          <li><strong>Type:</strong> Choose between a flat amount (e.g., $10 off) or percentage (e.g., 10% off)</li>
          <li><strong>Amount:</strong> The discount value (e.g., 10 for $10 or 10%)</li>
          <li><strong>Minimum Order:</strong> Minimum purchase amount required to use the coupon (optional)</li>
          <li><strong>Expiration:</strong> Date when the coupon expires (format: YYYY-MM-DD, optional)</li>
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Coupon Code *
            </label>
            <input
              name="code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="e.g., SUMMER20"
              className="border p-3 rounded-lg w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Discount Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="border p-3 rounded-lg w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="flat">Flat ($ off)</option>
              <option value="percentage">Percentage (% off)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Discount Amount *
            </label>
            <input
              name="amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              type="number"
              min="0"
              placeholder={form.type === "flat" ? "e.g., 10 for $10" : "e.g., 10 for 10%"}
              className="border p-3 rounded-lg w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Minimum Order (Optional)
            </label>
            <input
              name="minOrder"
              value={form.minOrder}
              onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
              type="number"
              min="0"
              placeholder="e.g., 50 for $50 minimum"
              className="border p-3 rounded-lg w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Expiration Date (Optional)
            </label>
            <input
              name="expiresAt"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              type="date"
              placeholder="YYYY-MM-DD"
              className="border p-3 rounded-lg w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
            {editingId ? "Update Coupon" : "Add Coupon"}
          </button>
          {!editingId && (
            <button
              type="button"
              onClick={() => handleAssignToAll(form)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Assign to All
            </button>
          )}
        </div>
      </form>
    </div>

    {/* User-Specific Coupons */}
    <div className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-6 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">👥 User-Specific Coupons</h3>
      <div className="flex flex-wrap gap-3 mb-6">
        {users.sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email)).map((user) => (
          <button
            key={user.id}
            onClick={() => fetchUserCoupons(user.id)}
            className={`px-4 py-2 rounded-lg ${selectedUser === user.id ? "bg-pink-600 text-white" : "bg-gray-300 dark:bg-gray-600 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"}`}
          >
            {user.name || user.email}
          </button>
        ))}
      </div>
      {selectedUser && (
        <div className="space-y-6">
          <button
            onClick={() => handleAssignToUser(form)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Assign Current Coupon to User
          </button>
          {userCoupons.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No coupons assigned to this user.</p>
          ) : (
            <ul className="space-y-4">
              {userCoupons.map((coupon) => (
                <li key={coupon.id} className="border p-4 rounded-lg flex justify-between items-center dark:border-gray-600 hover:shadow-md transition-shadow">
                  <span className="text-gray-800 dark:text-white">
                    {coupon.code} - {coupon.type} - {coupon.amount}
                  </span>
                  <button
                    onClick={() => handleDeleteUserCoupon(selectedUser, coupon.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  </div>
);

// Main Component
export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", image: "", category: "", description: "", quantity: "" });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", image: "", category: "", description: "", quantity: "" });
  const [activeSection, setActiveSection] = useState(null);

  // Rewards State
  const [globalCoupons, setGlobalCoupons] = useState([]);
  const [couponForm, setCouponForm] = useState({ code: "", type: "flat", amount: 0, minOrder: 0, expiresAt: "" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [userCoupons, setUserCoupons] = useState([]);
  const [couponEditingId, setCouponEditingId] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchGlobalCoupons();
  }, []);

  const fetchStats = async () => {
    const productsSnap = await getDocs(collection(db, "products"));
    setProducts(productsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    const ordersSnap = await getDocs(collection(db, "orders"));
    setOrders(ordersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    const usersSnap = await getDocs(collection(db, "users"));
    setUserCount(usersSnap.size);
    setUsers(usersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    const reviewsSnap = await getDocs(collection(db, "reviews"));
    setReviews(reviewsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const fetchGlobalCoupons = async () => {
    const snap = await getDocs(collection(db, "coupons"));
    setGlobalCoupons(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const fetchUserCoupons = async (userId) => {
    setSelectedUser(userId);
    const snap = await getDocs(collection(db, "users", userId, "coupons"));
    setUserCoupons(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedForm = {
      ...form,
      image: form.image || `https://source.unsplash.com/300x200/?${encodeURIComponent(form.name || "product")}`,
      quantity: Number(form.quantity) || 0,
    };
    await addDoc(collection(db, "products"), updatedForm);
    setForm({ name: "", price: "", image: "", category: "", description: "", quantity: "" });
    fetchStats();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "products", editId), {
      ...editForm,
      quantity: Number(editForm.quantity) || 0,
    });
    setEditId(null);
    setEditForm({ name: "", price: "", image: "", category: "", description: "", quantity: "" });
    fetchStats();
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setEditForm(product);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await deleteDoc(doc(db, "products", id));
      fetchStats();
    }
  };

  const handleDeleteReview = async (id) => {
    await deleteDoc(doc(db, "reviews", id));
    fetchStats();
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    fetchStats();
  };

  const handleDownloadCSV = () => {
    const csv = ["Order ID,Email,Total,Status", ...orders.map((o) => `${o.id},${o.email},${o.total},${o.status || "pending"}`)].join("\n");
    saveAs(new Blob([csv], { type: "text/csv;charset=utf-8;" }), "orders.csv");
  };

  const handleDownloadPDF = () => {
    const content = document.getElementById("order-report-pdf");
    html2pdf().set({ margin: 0.5, filename: "order-report.pdf", image: { type: "jpeg", quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: "in", format: "letter", orientation: "portrait" } }).from(content).save();
  };

  const handleSeed = async () => {
    if (window.confirm("This will delete and reseed all products. Continue?")) {
      await seedProducts();
      fetchStats();
    }
  };

  // Rewards Handlers
  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (couponEditingId) {
      await updateDoc(doc(db, "coupons", couponEditingId), couponForm);
    } else {
      await addDoc(collection(db, "coupons"), couponForm);
    }
    setCouponForm({ code: "", type: "flat", amount: 0, minOrder: 0, expiresAt: "" });
    setCouponEditingId(null);
    fetchGlobalCoupons();
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm("Delete this coupon?")) {
      await deleteDoc(doc(db, "coupons", id));
      fetchGlobalCoupons();
    }
  };

  const handleAssignToAll = async (coupon) => {
    for (const user of users) {
      await addDoc(collection(db, "users", user.id, "coupons"), coupon);
    }
    alert("Coupon assigned to all users");
  };

  const handleAssignToUser = async (coupon) => {
    if (!selectedUser) return alert("Select a user first");
    await addDoc(collection(db, "users", selectedUser, "coupons"), coupon);
    alert("Coupon assigned to user");
    fetchUserCoupons(selectedUser);
  };

  const handleDeleteUserCoupon = async (userId, couponId) => {
    await deleteDoc(doc(db, "users", userId, "coupons", couponId));
    fetchUserCoupons(userId);
  };

  const toggleSection = (section) => setActiveSection(prev => prev === section ? null : section);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];
  const productCategoryData = Object.values(products.reduce((acc, curr) => {
    acc[curr.category] = acc[curr.category] || { name: curr.category, value: 0 };
    acc[curr.category].value++;
    return acc;
  }, {})).sort((a, b) => a.name.localeCompare(b.name));
  const orderDateData = orders.reduce((acc, order) => {
    const date = order.createdAt?.toDate().toISOString().split("T")[0];
    if (!date) return acc;
    const existing = acc.find(d => d.date === date);
    existing ? existing.count++ : acc.push({ date, count: 1 });
    return acc;
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Sorted Sections
  const sections = [
    { id: 'form', title: '🛒 Add Products', color: 'text-green-600', component: <ProductForm form={form} onChange={handleChange} onSubmit={handleSubmit} onSeed={handleSeed} /> },
    { id: 'products', title: '📦 Manage Products', color: 'text-blue-600', component: (
      <ProductGrid
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        editId={editId}
        editForm={editForm}
        onEditChange={handleEditChange}
        onEditSubmit={handleEditSubmit}
      />
    ) },
    { id: 'orders', title: '🚚 Order Management', color: 'text-red-600', component: (
      <OrderSection
        orders={orders}
        onStatusUpdate={handleStatusUpdate}
        onDownloadCSV={handleDownloadCSV}
        onDownloadPDF={handleDownloadPDF}
      />
    ) },
    { id: 'rewards', title: '🎁 Rewards Management', color: 'text-pink-600', component: (
      <RewardsSection
        globalCoupons={globalCoupons}
        users={users}
        selectedUser={selectedUser}
        userCoupons={userCoupons}
        form={couponForm}
        setForm={setCouponForm}
        editingId={couponEditingId}
        setEditingId={setCouponEditingId}
        fetchGlobalCoupons={fetchGlobalCoupons}
        fetchUserCoupons={fetchUserCoupons}
        handleSubmit={handleCouponSubmit}
        handleDeleteCoupon={handleDeleteCoupon}
        handleAssignToAll={handleAssignToAll}
        handleAssignToUser={handleAssignToUser}
        handleDeleteUserCoupon={handleDeleteUserCoupon}
      />
    ) },
    { id: 'reviews', title: '📝 Review Management', color: 'text-yellow-600', component: <ReviewList reviews={reviews} onDelete={handleDeleteReview} /> },
    { id: 'charts', title: '📈 Sales Insights', color: 'text-purple-600', component: <Charts productCategoryData={productCategoryData} orderDateData={orderDateData} COLORS={COLORS} /> },
    { id: 'stats', title: '📊 Statistics Overview', color: 'text-indigo-600', component: (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={userCount}
            onClick={() => setShowUsers(!showUsers)}
          />
          <StatCard title="Total Orders" value={orders.length} />
          <StatCard title="Total Products" value={products.length} />
        </div>
        {showUsers && <UserList users={users} />}
      </div>
    ) },
  ].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="min-h-screen p-8 space-y-10 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {sections.map(section => (
        <section key={section.id} className="transition-all duration-300">
          <h2
            onClick={() => toggleSection(section.id)}
            className={`text-2xl font-bold ${section.color} border-b-2 pb-3 mb-6 cursor-pointer hover:${section.color.replace('text-', 'text-').replace('-600', '-700')} transition-colors`}
          >
            {section.title}
          </h2>
          {activeSection === section.id && (
            <div className="animate-fade-in">
              {section.component}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}