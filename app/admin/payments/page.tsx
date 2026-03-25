"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CASH");
  const [saving, setSaving] = useState(false);

  const loadDueOrders = () => {
    fetch("/api/orders?due=true")
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data.filter((o: any) => o.dueAmount > 0) : []); setLoading(false); });
  };

  useEffect(() => { loadDueOrders(); }, []);

  const handlePayment = async () => {
    if (!selectedOrder || !amount) return;
    setSaving(true);
    await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: selectedOrder.id,
        customerId: selectedOrder.customerId,
        amount: parseFloat(amount),
        method,
        status: "COMPLETED",
        receivedBy: "admin",
        receivedAt: new Date().toISOString(),
      }),
    });
    setSelectedOrder(null);
    setAmount("");
    setSaving(false);
    loadDueOrders();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">Payments & Due</span>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">✅</div>
            <div className="text-gray-500">কোনো due নেই!</div>
          </div>
        ) : (
          orders.map((o, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-bold text-gray-900">{o.customer?.user?.email}</div>
                  <div className="text-xs text-gray-400 font-mono">{o.orderNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">বাকি</div>
                  <div className="text-xl font-bold text-red-500">৳{Number(o.dueAmount).toFixed(0)}</div>
                </div>
              </div>
              {selectedOrder?.id === o.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {["CASH","BKASH","NAGAD","ROCKET"].map(m => (
                      <button key={m} onClick={() => setMethod(m)}
                        className={`py-2 rounded-xl border-2 text-sm font-medium transition ${method === m ? "border-teal-400 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-600"}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder={`Amount (বাকি: ৳${Number(o.dueAmount).toFixed(0)})`}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                  <div className="flex gap-2">
                    <button onClick={handlePayment} disabled={saving}
                      className="flex-1 bg-teal-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-teal-600 disabled:opacity-50 transition">
                      {saving ? "Save হচ্ছে..." : "✓ Payment নিন"}
                    </button>
                    <button onClick={() => setSelectedOrder(null)}
                      className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setSelectedOrder(o); setAmount(Number(o.dueAmount).toFixed(0)); }}
                  className="w-full bg-green-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-600 transition">
                  💳 Payment নিন
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}