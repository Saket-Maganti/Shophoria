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

  if (!order) return <p className="p-4 text-gray-500 dark:text-gray-300 animate-pulse">Loading invoice...</p>;

  const orderItems = order.products || order.items || [];
  const subtotal = orderItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * (item.quantity || 1),
    0
  );
  const discount = parseFloat(order.discount || 0);
  const total = parseFloat(order.total || subtotal - discount); // Total without tax

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex justify-center items-center">
      <div
        ref={invoiceRef}
        className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-[1.01] duration-300"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">S</span>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">Shophoria</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">123 Online Ave, Ecom City, NY 10001</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">support@shophoria.com</p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">INVOICE</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Invoice #: <span className="font-mono text-indigo-600 dark:text-indigo-400">SH-{order.id.slice(0, 8).toUpperCase()}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Date: {order.createdAt?.toDate().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            {order.status && (
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mt-1">
                Status: <span className="capitalize">{order.status}</span>
              </p>
            )}
          </div>
        </div>

        {/* Billed To & Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Billed To:</h4>
            <p className="text-gray-800 dark:text-white">{order.email}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{order.address || "Billing address not provided"}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Payment Details:</h4>
            <p className="text-gray-800 dark:text-white">Stripe (Card ending in {order.cardLast4 || "****"})</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Paid on: {order.createdAt?.toDate().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 uppercase text-xs font-semibold tracking-wider">
                <th className="py-4 px-6">Item</th>
                <th className="py-4 px-6 text-right">Unit Price</th>
                <th className="py-4 px-6 text-center">Qty</th>
                <th className="py-4 px-6 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-4 px-6 text-gray-800 dark:text-white">{item.name}</td>
                  <td className="py-4 px-6 text-right text-gray-600 dark:text-gray-300">${parseFloat(item.price).toFixed(2)}</td>
                  <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-300">{item.quantity || 1}</td>
                  <td className="py-4 px-6 text-right font-medium text-gray-800 dark:text-white">${(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="mt-8 flex justify-end">
          <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="text-gray-800 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              {order.couponCode && (
                <div className="flex justify-between">
                  <span className="text-green-600 dark:text-green-400">Discount ({order.couponCode}):</span>
                  <span className="text-green-600 dark:text-green-400">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-3">
                <span className="text-lg font-semibold text-gray-800 dark:text-white">Total:</span>
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Thank you for your purchase from Shophoria!</p>
        </div>
      </div>

      {/* Download Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleDownload}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
        >
          📄 Download Invoice
        </button>
      </div>
    </div>
  );
}

export default Invoice;