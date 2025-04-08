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
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(options).from(invoiceRef.current).save();
  };

  if (!order)
    return <p className="p-4 text-gray-500 dark:text-gray-300">Loading invoice...</p>;

  const orderItems = order.products || order.items || [];
  const subtotal = orderItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * (item.quantity || 1),
    0
  );
  const discount = parseFloat(order.discount || 0);
  const total = parseFloat(order.total || 0);

  return (
    <div className="p-8 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div
        ref={invoiceRef}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-10 max-w-4xl mx-auto border border-gray-200 dark:border-gray-700 space-y-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-300 pb-6">
          <div>
            <h2 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400 tracking-wide">Shophoria</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">123 Online Ave, Ecom City, NY</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">support@shophoria.com</p>
          </div>
          <div className="text-right space-y-1">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">INVOICE</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Invoice #: <span className="font-mono">SH-{order.id.slice(0, 6).toUpperCase()}</span></p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Date: {order.createdAt?.toDate().toLocaleDateString()}</p>
            {order.status && (
              <span className="inline-block text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full mt-1">Status: {order.status}</span>
            )}
          </div>
        </div>

        {/* Billing Info */}
        <div className="grid md:grid-cols-2 gap-8 text-sm">
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Billed To</h4>
            <p className="text-gray-600 dark:text-gray-400">{order.email}</p>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{order.address}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Payment Method</h4>
            <p className="text-gray-600 dark:text-gray-400">Stripe (Card)</p>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto border-t border-b py-4">
          <table className="w-full text-sm text-gray-800 dark:text-gray-200">
            <thead>
              <tr className="bg-indigo-50 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300">
                <th className="py-2 px-3 text-left">Product</th>
                <th className="py-2 px-3 text-left">Price</th>
                <th className="py-2 px-3 text-left">Qty</th>
                <th className="py-2 px-3 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, idx) => (
                <tr key={idx} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="py-2 px-3">{item.name}</td>
                  <td className="py-2 px-3">${parseFloat(item.price).toFixed(2)}</td>
                  <td className="py-2 px-3">{item.quantity || 1}</td>
                  <td className="py-2 px-3">${(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="text-right space-y-1 text-sm">
          <p className="text-gray-700 dark:text-gray-300">Subtotal: ${subtotal.toFixed(2)}</p>
          {order.couponCode && (
            <p className="text-gray-700 dark:text-gray-300">Discount ({order.couponCode}): -${discount.toFixed(2)}</p>
          )}
          <p className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mt-2">
            Grand Total: ${total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Download Button */}
      <div className="text-center mt-6">
        <button
          onClick={handleDownload}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-full shadow-md"
        >
          📄 Download Invoice
        </button>
      </div>
    </div>
  );
}

export default Invoice;