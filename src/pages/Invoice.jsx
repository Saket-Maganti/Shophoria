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
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div
        ref={invoiceRef}
        className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-10 max-w-4xl mx-auto border border-gray-300 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-10 border-b pb-6 border-gray-300 dark:border-gray-700">
          <div>
            <h2 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400">Shophoria</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">123 Online Ave, Ecom City, NY</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">support@shophoria.com</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">INVOICE</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Invoice #: <span className="font-mono">SH-{order.id.slice(0, 6).toUpperCase()}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Date: {order.createdAt?.toDate().toLocaleDateString()}
            </p>
            {order.status && (
              <p className="text-sm text-yellow-600 mt-1 font-medium">Status: {order.status}</p>
            )}
          </div>
        </div>

        {/* Billing & Payment */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Billed To:</p>
            <p className="text-gray-700 dark:text-gray-400">{order.email}</p>
            <p className="text-gray-700 dark:text-gray-400 whitespace-pre-line">{order.address}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Payment Method:</p>
            <p className="text-gray-700 dark:text-gray-400">Stripe (Card)</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-left border border-gray-300 dark:border-gray-700 text-sm shadow-sm">
            <thead>
              <tr className="bg-indigo-100 dark:bg-indigo-800 text-indigo-900 dark:text-white">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {orderItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-300">{item.name}</td>
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-300">
                    ${parseFloat(item.price).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-300">{item.quantity || 1}</td>
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-300">
                    ${(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="mt-8 text-right space-y-2 text-sm text-gray-800 dark:text-gray-300">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          {order.couponCode && (
            <p>
              Discount ({order.couponCode}): -${discount.toFixed(2)}
            </p>
          )}
          <p className="text-lg font-bold text-indigo-700 dark:text-indigo-400">
            Grand Total: ${total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Download Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleDownload}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition"
        >
          📄 Download Invoice
        </button>
      </div>
    </div>
  );
}

export default Invoice;