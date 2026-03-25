"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const statusColor: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600",
  CONFIRMED: "bg-blue-50 text-blue-600",
  PROCESSING: "bg-amber-50 text-amber-600",
  OUT_FOR_DELIVERY: "bg-purple-50 text-purple-600",
  DELIVERED: "bg-green-50 text-green-600",
  CANCELLED: "bg-red-50 text-red-600",
};
const statusLabel: Record<string, string> = {
  PENDING: "অপেক্ষায়",
  CONFIRMED: "নিশ্চিত",
  PROCESSING: "প্রস্তুত হচ্ছে",
  OUT_FOR_DELIVERY: "রাস্তায়",
  DELIVERED: "পৌঁছেছে",
  CANCELLED: "বাতিল",
};
const nextStatus: Record<string, string> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PROCESSING",
  PROCESSING: "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "DELIVERED",
};
const nextLabel: Record<string, string> = {
  PENDING: "✓ Confirm",
  CONFIRMED: "Pack করুন",
  PROCESSING: "Delivery তে দিন",
  OUT_FOR_DELIVERY: "Delivered ✓",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");

  const loadOrders = () => {
    fetch("/api/orders")
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { loadOrders(); }, []);

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, changedBy: "admin" }),
    });
    loadOrders();
  };

  const filtered = orders.filter(o => filter === "ALL" || o.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">Orders</span>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex gap-2 mb-6 flex-wrap">
          {["ALL","PENDING","CONFIRMED","PROCESSING","OUT_FOR_DELIVERY","DELIVERED"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === s ? "bg-teal-500 text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
              {s === "ALL" ? "সব" : statusLabel[s] || s}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">🛒</div>
            <div>কোনো order নেই</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((o, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-bold text-gray-900">{o.customer?.user?.email || "Unknown"}</div>
                    <div className="text-xs text-gray-400 font-mono">{o.orderNumber}</div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[o.status]}`}>
                      {statusLabel[o.status]}
                    </span>
                    <div className="text-lg font-bold text-gray-900 mt-1">৳{Number(o.totalAmount).toFixed(0)}</div>
                  </div>
                </div>
                {o.dueAmount > 0 && (
                  <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg mb-3">
                    ⚠️ বাকি: ৳{Number(o.dueAmount).toFixed(0)}
                  </div>
                )}
                <div className="flex gap-2">
                  {nextStatus[o.status] && (
                    <button onClick={() => updateStatus(o.id, nextStatus[o.status])}
                      className="flex-1 bg-teal-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-teal-600 transition">
                      {nextLabel[o.status]}
                    </button>
                  )}
                  {o.status === "DELIVERED" && o.dueAmount > 0 && (
                    <Link href={`/admin/payments?orderId=${o.id}`}
                      className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm font-medium text-center hover:bg-green-600 transition">
                      💳 Payment নিন
                    </Link>
                  )}
                  {o.status !== "DELIVERED" && o.status !== "CANCELLED" && (
                    <button onClick={() => updateStatus(o.id, "CANCELLED")}
                      className="px-4 py-2 border border-red-200 text-red-500 rounded-xl text-sm hover:bg-red-50 transition">
                      বাতিল
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}