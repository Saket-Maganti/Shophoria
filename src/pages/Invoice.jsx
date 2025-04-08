import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import html2pdf from "html2pdf.js";

function Invoice() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchOrder = async () => {
      const docRef = doc(db, "orders", orderId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setOrder({ id: snap.id, ...snap.data() });
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleDownload = () => {
    if (!invoiceRef.current) return;
    const options = {
      margin: 0.5,
      filename: `invoice-${orderId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(options).from(invoiceRef.current).save();
  };

  if (!order) return <p className="p-4 text-gray-500 dark:text-gray-300">Loading invoice...</p>;

  const orderItems = order.products || order.items || [];
  const subtotal = orderItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * (item.quantity || 1),
    0
  );
  const discount = parseFloat(order.discount || 0);
  const total = parseFloat(order.total || 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen dark:bg-gray-900">
      <div
        ref={invoiceRef}
        style={{
          fontFamily: "'Inter', sans-serif",
          maxWidth: "700px",
          margin: "0 auto",
          backgroundColor: "#fff",
          padding: "32px",
          borderRadius: "16px",
          boxShadow: "0 0 20px rgba(0,0,0,0.08)",
          color: "#333",
          lineHeight: "1.6",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", borderBottom: "1px solid #e5e7eb", paddingBottom: "16px" }}>
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#1e3a8a" }}>Shophoria</h2>
            <p style={{ fontSize: "14px" }}>123 Online Ave, Ecom City, NY</p>
            <p style={{ fontSize: "14px" }}>support@shophoria.com</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "600" }}>INVOICE</h3>
            <p style={{ fontSize: "14px" }}>Invoice #: <span style={{ fontFamily: "monospace" }}>SH-{order.id.slice(0, 6).toUpperCase()}</span></p>
            <p style={{ fontSize: "14px" }}>Date: {order.createdAt?.toDate().toLocaleDateString()}</p>
            {order.status && <p style={{ fontSize: "14px", color: "#ca8a04", fontWeight: "500" }}>Status: {order.status}</p>}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", fontSize: "14px" }}>
          <div>
            <p style={{ fontWeight: "600", marginBottom: "4px" }}>Billed To:</p>
            <p>{order.email}</p>
            <p>{order.address}</p>
          </div>
          <div>
            <p style={{ fontWeight: "600", marginBottom: "4px" }}>Payment Method:</p>
            <p>Stripe (Card)</p>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6", fontWeight: "600" }}>
              <th style={{ textAlign: "left", padding: "8px" }}>Product</th>
              <th style={{ textAlign: "right", padding: "8px" }}>Price</th>
              <th style={{ textAlign: "center", padding: "8px" }}>Qty</th>
              <th style={{ textAlign: "right", padding: "8px" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "8px" }}>{item.name}</td>
                <td style={{ textAlign: "right", padding: "8px" }}>${parseFloat(item.price).toFixed(2)}</td>
                <td style={{ textAlign: "center", padding: "8px" }}>{item.quantity || 1}</td>
                <td style={{ textAlign: "right", padding: "8px" }}>${(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "24px", textAlign: "right" }}>
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          {order.couponCode && (
            <p>Discount ({order.couponCode}): -${discount.toFixed(2)}</p>
          )}
          <p style={{ fontSize: "16px", fontWeight: "bold", color: "#4f46e5" }}>
            Grand Total: ${total.toFixed(2)}
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: "32px", fontSize: "13px", color: "#6b7280" }}>
          Thank you for shopping with Shophoria!
        </p>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleDownload}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded shadow"
        >
          📄 Download Invoice
        </button>
      </div>
    </div>
  );
}

export default Invoice;
