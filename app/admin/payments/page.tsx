"use client";
import { useEffect, useState } from "react";
import { AdminLayout } from "../layout-component";

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CASH");
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/orders?due=true").then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data.filter((o: any) => Number(o.dueAmount) > 0) : []); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const handlePayment = async () => {
    if (!selectedOrder || !amount) return;
    setSaving(true);
    await fetch("/api/payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: selectedOrder.id, customerId: selectedOrder.customerId, amount: parseFloat(amount), method, status: "COMPLETED", receivedBy: "admin", receivedAt: new Date().toISOString() }) });
    setSelectedOrder(null); setAmount(""); setSaving(false); load();
  };

  return (
    <AdminLayout title="Payments & Due" active="/admin/payments">
      {loading ? <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>Loading...</div> :
        orders.length === 0 ? <div style={{ textAlign: "center", padding: 40 }}><div style={{ fontSize: 32, marginBottom: 8 }}>✅</div><div style={{ color: "#a0aec0" }}>কোনো due নেই!</div></div> :
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.map((o, i) => (
            <div key={i} style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1a202c" }}>{o.customer?.user?.email}</div>
                  <div style={{ fontSize: 11, color: "#a0aec0", fontFamily: "monospace" }}>{o.orderNumber}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#a0aec0" }}>বাকি</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#C53030" }}>৳{Number(o.dueAmount).toFixed(0)}</div>
                </div>
              </div>
              {selectedOrder?.id === o.id ? (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                    {["CASH", "BKASH", "NAGAD", "ROCKET"].map(m => (
                      <button key={m} onClick={() => setMethod(m)} style={{ padding: "9px", borderRadius: 9, fontSize: 13, fontWeight: 500, border: method === m ? "2px solid #0D9488" : "0.5px solid #e2e8f0", background: method === m ? "#E6FFFA" : "#fff", color: method === m ? "#0D9488" : "#4a5568", cursor: "pointer" }}>{m}</button>
                    ))}
                  </div>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={`৳${Number(o.dueAmount).toFixed(0)}`}
                    style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 9, padding: "10px 14px", fontSize: 14, marginBottom: 10, boxSizing: "border-box" }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handlePayment} disabled={saving} style={{ flex: 1, background: "#0D9488", color: "#fff", border: "none", padding: 10, borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                      {saving ? "Save হচ্ছে..." : "✓ Payment নিন"}
                    </button>
                    <button onClick={() => setSelectedOrder(null)} style={{ padding: "10px 14px", border: "0.5px solid #e2e8f0", background: "#fff", borderRadius: 9, fontSize: 13, cursor: "pointer" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setSelectedOrder(o); setAmount(Number(o.dueAmount).toFixed(0)); }} style={{ width: "100%", background: "#38A169", color: "#fff", border: "none", padding: 10, borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  💳 Payment নিন
                </button>
              )}
            </div>
          ))}
        </div>
      }
    </AdminLayout>
  );
}