"use client";
import { useEffect, useState } from "react";

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CASH");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const load = () => {
    fetch("/api/orders").then(r => r.json())
      .then(data => {
        const withDue = Array.isArray(data) ? data.filter((o: any) => Number(o.dueAmount) > 0) : [];
        setOrders(withDue);
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

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
    load();
  };

  const filtered = orders.filter(o =>
    !search ||
    o.customer?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer?.user?.phone?.includes(search) ||
    o.orderNumber?.includes(search)
  );

  const totalDue = orders.reduce((sum, o) => sum + Number(o.dueAmount || 0), 0);

  return (
    <div style={{ fontFamily: "sans-serif" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1a202c", margin: 0 }}>💳 Payments & Due</h1>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ background: "#FFF5F5", borderRadius: 12, padding: 16, border: "0.5px solid #FEB2B2" }}>
          <div style={{ fontSize: 11, color: "#718096", marginBottom: 4 }}>মোট Due</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#C53030" }}>৳{totalDue.toFixed(0)}</div>
        </div>
        <div style={{ background: "#f7f8fa", borderRadius: 12, padding: 16, border: "0.5px solid #e2e8f0" }}>
          <div style={{ fontSize: 11, color: "#718096", marginBottom: 4 }}>Due আছে</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#1a202c" }}>{orders.length} জন</div>
        </div>
        <div style={{ background: "#F0FFF4", borderRadius: 12, padding: 16, border: "0.5px solid #9AE6B4" }}>
          <div style={{ fontSize: 11, color: "#718096", marginBottom: 4 }}>গড় Due</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#276749" }}>
            ৳{orders.length > 0 ? (totalDue / orders.length).toFixed(0) : "0"}
          </div>
        </div>
      </div>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Customer নাম, phone বা order number..."
        style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 14, boxSizing: "border-box", background: "#fff" }} />

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <div style={{ color: "#276749", fontWeight: 700, fontSize: 16 }}>কোনো due নেই!</div>
          <div style={{ color: "#a0aec0", fontSize: 13, marginTop: 4 }}>সব payment পরিশোধ হয়েছে</div>
        </div>
      ) : (
        <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, overflow: "hidden" }}>
          {/* Table Header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 120px", padding: "10px 16px", background: "#f7f8fa", borderBottom: "0.5px solid #e2e8f0" }}>
            {["Customer", "Order", "মোট", "Due", ""].map((h, i) => (
              <div key={i} style={{ fontSize: 11, fontWeight: 700, color: "#718096" }}>{h}</div>
            ))}
          </div>

          {filtered.map((o, i) => (
            <div key={i}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 120px", padding: "14px 16px", borderBottom: "0.5px solid #f7fafc", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#1a202c" }}>{o.customer?.fullName || "Unknown"}</div>
                  <div style={{ fontSize: 11, color: "#a0aec0" }}>{o.customer?.user?.phone || o.customer?.user?.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#4a5568" }}>#{o.orderNumber?.slice(-6)}</div>
                  <div style={{ fontSize: 11, color: "#a0aec0" }}>{new Date(o.createdAt).toLocaleDateString("bn-BD")}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a202c" }}>৳{Number(o.totalAmount).toFixed(0)}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#C53030" }}>৳{Number(o.dueAmount).toFixed(0)}</div>
                <button onClick={() => { setSelectedOrder(o); setAmount(Number(o.dueAmount).toFixed(0)); }}
                  style={{ background: "#0D9488", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  💳 Payment নিন
                </button>
              </div>

              {/* Payment Form */}
              {selectedOrder?.id === o.id && (
                <div style={{ padding: "14px 16px", background: "#f0fdf9", borderBottom: "0.5px solid #b2f5ea" }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#0D9488", marginBottom: 12 }}>
                    Payment নিন — {o.customer?.fullName}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 10 }}>
                    {["CASH", "BKASH", "NAGAD", "ROCKET"].map(m => (
                      <button key={m} onClick={() => setMethod(m)}
                        style={{ padding: "9px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: method === m ? "2px solid #0D9488" : "0.5px solid #e2e8f0", background: method === m ? "#E6FFFA" : "#fff", color: method === m ? "#0D9488" : "#4a5568", cursor: "pointer" }}>
                        {m}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                      placeholder="পরিমাণ"
                      style={{ flex: 1, border: "0.5px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", fontSize: 14, boxSizing: "border-box" }} />
                    <button onClick={handlePayment} disabled={saving}
                      style={{ background: "#0D9488", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                      {saving ? "Save হচ্ছে..." : "✓ নিশ্চিত করুন"}
                    </button>
                    <button onClick={() => setSelectedOrder(null)}
                      style={{ border: "0.5px solid #e2e8f0", background: "#fff", color: "#718096", padding: "10px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
                      বাতিল
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}