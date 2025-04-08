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

    const clone = invoiceRef.current.cloneNode(true);
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
    clone.insertBefore(styleLink, clone.firstChild);

    const options = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `invoice-${orderId}-${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 4, useCORS: true, logging: false },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(options).from(clone).save().catch((err) => {
      console.error("PDF generation failed:", err);
    });
  };

  if (!order) return <p className="p-6 text-gray-500 dark:text-gray-400 animate-pulse text-center">Loading your invoice...</p>;

  const orderItems = order.products || order.items || [];
  const subtotal = orderItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * (item.quantity || 1),
    0
  );
  const discount = parseFloat(order.discount || 0);
  const total = parseFloat(order.total || subtotal - discount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8 flex flex-col items-center">
      <div
        ref={invoiceRef}
        className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 transition-all duration-300"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Shophoria</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">123 Online Ave, Ecom City, NY</p>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Invoice</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              #SH-{order.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {order.createdAt?.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Billed To</h4>
            <p className="text-sm text-gray-800 dark:text-gray-100">{order.email}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{order.address || "N/A"}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Payment</h4>
            <p className="text-sm text-gray-800 dark:text-gray-100">Stripe (**** {order.cardLast4 || "****"})</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Paid: {order.createdAt?.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs uppercase font-medium">
                <th className="py-2 px-4">Item</th>
                <th className="py-2 px-4 text-right">Price</th>
                <th className="py-2 px-4 text-center">Qty</th>
                <th className="py-2 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-200">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4 text-right">${parseFloat(item.price).toFixed(2)}</td>
                  <td className="py-2 px-4 text-center">{item.quantity || 1}</td>
                  <td className="py-2 px-4 text-right font-medium">${(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-6">
          <div className="w-full sm:w-1/3 text-sm">
            <div className="space-y-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-800 dark:text-gray-100">${subtotal.toFixed(2)}</span>
              </div>
              {order.couponCode && (
                <div className="flex justify-between">
                  <span className="text-green-600 dark:text-green-400">Discount ({order.couponCode})</span>
                  <span className="text-green-600 dark:text-green-400">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="font-medium text-gray-800 dark:text-gray-100">Total</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-300">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
          Thank you for choosing Shophoria! • support@shophoria.com
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleDownload}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 transition-all duration-200 shadow-md"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Download PDF
          </span>
        </button>
      </div>
    </div>
  );
}

export default Invoice;