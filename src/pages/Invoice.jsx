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
        className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 max-w-3xl mx-auto border border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <div>
            <h2 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400">Shophoria</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">123 Online Ave, Ecom City, NY</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">support@shophoria.com</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">INVOICE</h3>
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
        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Billed To:</p>
            <p className="text-gray-600 dark:text-gray-400">{order.email}</p>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{order.address}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Payment Method:</p>
            <p className="text-gray-600 dark:text-gray-400">Stripe (Card)</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-t border-b border-gray-200 dark:border-gray-700 text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                <th className="py-2 px-2">Product</th>
                <th className="py-2 px-2">Price</th>
                <th className="py-2 px-2">Qty</th>
                <th className="py-2 px-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{item.name}</td>
                  <td className="py-2 px-2 text-gray-700 dark:text-gray-300">
                    ${parseFloat(item.price).toFixed(2)}
                  </td>
                  <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{item.quantity || 1}</td>
                  <td className="py-2 px-2 text-gray-700 dark:text-gray-300">
                    ${(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="mt-6 text-right space-y-1 text-sm text-gray-700 dark:text-gray-300">
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
