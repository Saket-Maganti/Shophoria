import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import ProductDetails from "./pages/ProductDetails";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import Checkout from "./pages/Checkout";
import Invoice from "./pages/Invoice";
import Seed from "./pages/Seed";
import UserDashboard from "./pages/UserDashboard";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
          <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/invoice/:orderId" element={<PrivateRoute><Invoice /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/seed" element={<AdminRoute><Seed /></AdminRoute>} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
